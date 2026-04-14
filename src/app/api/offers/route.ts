import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

const PRODUCT_CATALOG: Record<string, { name: string; minPrice: number; maxPrice: number }> = {
  'credit-klimb': { name: 'Credit Klimb', minPrice: 4900, maxPrice: 4900 },
  'nlds-membership': { name: 'NLDS Deal Access', minPrice: 2500, maxPrice: 2500 },
  'teachyoung': { name: 'TeachYoung', minPrice: 1900, maxPrice: 1900 },
  'family-os': { name: 'Family Legacy OS', minPrice: 3900, maxPrice: 3900 },
};

// POST /api/offers — create a new offer
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

  if (!sessionData.lkId) {
    return NextResponse.json({ error: 'Likeness™ identity required' }, { status: 403 });
  }

  const { productId, price } = await req.json();
  if (!productId || !PRODUCT_CATALOG[productId]) {
    return NextResponse.json({ error: 'Unknown product' }, { status: 400 });
  }

  const product = PRODUCT_CATALOG[productId];
  // Validate price is locked or within range
  const priceCents = Math.round((price || product.minPrice) * 100);
  if (priceCents < product.minPrice || priceCents > product.maxPrice) {
    return NextResponse.json({ error: 'Price outside allowed range' }, { status: 400 });
  }

  const supabase = createServerClient();

  // Check if active offer already exists for this user+product
  const { data: existing } = await supabase
    .from('offers')
    .select('offer_id')
    .eq('lk_id', sessionData.lkId)
    .eq('product_id', productId)
    .eq('status', 'active')
    .limit(1)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ offer_id: existing.offer_id, status: 'already_exists' });
  }

  // Generate offer ID (no secrets — just a public identifier)
  const offerId = `OFR-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  const { data: offer, error } = await supabase
    .from('offers')
    .insert({
      offer_id: offerId,
      lk_id: sessionData.lkId,
      username: sessionData.email.split('@')[0],
      product_id: productId,
      product_name: product.name,
      price_cents: priceCents,
      status: 'active',
    })
    .select()
    .limit(1)
    .single();

  if (error || !offer) {
    return NextResponse.json({ error: 'Failed to create offer' }, { status: 500 });
  }

  return NextResponse.json({ offer_id: offer.offer_id, offer_url: `/offer/${offer.offer_id}` });
}

// GET /api/offers — list current user's offers
export async function GET(req: NextRequest) {
  const sessionToken = req.cookies.get('porterful_session')?.value;
  if (!sessionToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let sessionData: { email: string; lkId: string | null };
  try {
    sessionData = JSON.parse(Buffer.from(sessionToken, 'base64url').toString('utf8'));
  } catch {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  }

  if (!sessionData.lkId) {
    return NextResponse.json({ error: 'No Likeness™ identity' }, { status: 403 });
  }

  const supabase = createServerClient();
  const { data: offers } = await supabase
    .from('offers')
    .select('offer_id, product_id, product_name, price_cents, status, click_count, created_at')
    .eq('lk_id', sessionData.lkId)
    .order('created_at', { ascending: false });

  return NextResponse.json({ offers: offers || [] });
}
