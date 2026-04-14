import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ offerId: string }> }
) {
  const { offerId } = await params;
  if (!offerId) return NextResponse.json({ error: 'Missing offerId' }, { status: 400 });

  const supabase = createServerClient();
  const { data: offer } = await supabase
    .from('offers')
    .select('offer_id, lk_id, username, product_id, product_name, price_cents, status')
    .eq('offer_id', offerId)
    .eq('status', 'active')
    .limit(1)
    .maybeSingle();

  if (!offer) return NextResponse.json({ error: 'Offer not found' }, { status: 404 });

  // Increment click count (fire-and-forget)
  supabase.rpc('increment_offer_clicks', { offer_id: offerId }).then(() => {});

  return NextResponse.json(offer);
}
