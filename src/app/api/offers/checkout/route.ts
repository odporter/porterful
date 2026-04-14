import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

const PRODUCT_PRICES: Record<string, number> = {
  'credit-klimb': 4900,
  'nlds-membership': 2500,
  'teachyoung': 1900,
  'family-os': 3900,
};

const PRODUCT_NAMES: Record<string, string> = {
  'credit-klimb': 'Credit Klimb',
  'nlds-membership': 'NLDS Deal Access',
  'teachyoung': 'TeachYoung',
  'family-os': 'Family Legacy OS',
};

export async function POST(req: NextRequest) {
  const sessionToken = req.cookies.get('porterful_session')?.value;
  if (!sessionToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let sessionData: { email: string; lkId: string | null; profileId: string };
  try {
    sessionData = JSON.parse(Buffer.from(sessionToken, 'base64url').toString('utf8'));
  } catch {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  }

  const { offerId, productId } = await req.json();
  if (!offerId) {
    return NextResponse.json({ error: 'offerId required' }, { status: 400 });
  }

  const supabase = createServerClient();

  // Fetch locked price from server — NEVER trust URL price
  const { data: offer } = await supabase
    .from('offers')
    .select('offer_id, lk_id, username, product_id, product_name, price_cents, status')
    .eq('offer_id', offerId)
    .eq('status', 'active')
    .limit(1)
    .maybeSingle();

  if (!offer) {
    return NextResponse.json({ error: 'Offer not found or expired' }, { status: 404 });
  }

  const price = offer.price_cents; // locked server-side
  const productName = offer.product_name;

  // Create Stripe checkout session
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
  }

  const Stripe = (await import('stripe')).default;
  const stripe = new Stripe(stripeKey);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: productName },
        unit_amount: price,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${req.nextUrl.origin}/offer/${offerId}/success`,
    cancel_url: `${req.nextUrl.origin}/offer/${offerId}`,
    metadata: {
      offer_id: offer.offer_id,
      lk_id: offer.lk_id,
      username: offer.username,
      user_id: sessionData.profileId || '',
      email: sessionData.email || '',
      product_id: offer.product_id,
      source: 'likeness',
      commission_cents: Math.round(price * 0.03), // 3% to seller
    },
  });

  return NextResponse.json({ url: session.url, sessionId: session.id });
}
