import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: 'Missing webhook config' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = (await import('stripe')).default.webhooks.constructEvent(body, sig, webhookSecret);
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const { offer_id, lk_id, username, commission_cents, product_id } = session.metadata || {};

    if (!offer_id || !lk_id) {
      console.log('[stripe-webhook] Missing metadata, skipping');
      return NextResponse.json({ received: true });
    }

    const supabase = createServerClient();

    // Record the transaction
    const { error: txError } = await supabase
      .from('offer_transactions')
      .insert({
        offer_id,
        lk_id,
        buyer_email: session.customer_email || null,
        stripe_session_id: session.id,
        amount_cents: session.amount_total || 0,
        commission_cents: parseInt(commission_cents || '0', 10),
        product_id: product_id || '',
        status: 'completed',
      });

    if (txError) {
      console.error('[stripe-webhook] Transaction insert failed:', txError);
    }

    // Update earnings
    const commissionCents = parseInt(commission_cents || '0', 10);
    if (commissionCents > 0) {
      await supabase.rpc('add_earnings', {
        p_lk_id: lk_id,
        p_username: username || lk_id,
        p_cents: commissionCents,
      });
    }

    // Mark offer as sold if one-time purchase
    await supabase
      .from('offers')
      .update({ status: 'sold' })
      .eq('offer_id', offer_id);
  }

  return NextResponse.json({ received: true });
}
