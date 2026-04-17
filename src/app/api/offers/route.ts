import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createServerClient } from '@/lib/supabase';
import { decodePorterfulSession } from '@/lib/porterful-session';

function getOfferSecret() {
  const secret = process.env.OFFER_SECRET;
  if (!secret) {
    throw new Error('OFFER_SECRET is required');
  }
  return secret;
}

// Sign an offer token — self-contained, no DB needed
function signOffer(payload: object): string {
  const data = JSON.stringify(payload);
  const sig = crypto.createHmac('sha256', getOfferSecret()).update(data).digest('base64url');
  const token = Buffer.from(data).toString('base64url');
  return `${token}.${sig}`;
}

// Verify and decode an offer token
function verifyOffer(token: string): { valid: true; data: any } | { valid: false; error: string } {
  try {
    const [tokenPart, sigPart] = token.split('.');
    if (!tokenPart || !sigPart) return { valid: false, error: 'Malformed token' };
    const data = JSON.parse(Buffer.from(tokenPart, 'base64url').toString('utf8'));
    const expectedSig = crypto.createHmac('sha256', getOfferSecret()).update(JSON.stringify(data)).digest('base64url');
    if (sigPart !== expectedSig) return { valid: false, error: 'Invalid signature' };
    return { valid: true, data };
  } catch {
    return { valid: false, error: 'Invalid token' };
  }
}

// POST /api/offers — create a self-contained offer token
export async function POST(req: NextRequest) {
  const sessionToken = req.cookies.get('porterful_session')?.value;
  if (!sessionToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const session = decodePorterfulSession(sessionToken);
  if (!session) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  }

  if (!session.lkId) return NextResponse.json({ error: 'Likeness™ identity required' }, { status: 403 });

  const { productId } = await req.json();
  if (!productId) return NextResponse.json({ error: 'Missing productId' }, { status: 400 });

  const supabase = createServerClient();
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('id, name, base_price')
    .eq('id', productId)
    .limit(1)
    .single();

  if (productError || !product) {
    return NextResponse.json({ error: 'Unknown product' }, { status: 400 });
  }

  // Generate offer_id and self-contained token
  const offerId = `OFR-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  const payload = {
    offer_id: offerId,
    lk_id: session.lkId,
    username: session.email.split('@')[0],
    product_id: productId,
    product_name: product.name,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days
  };

  const { error: offerInsertError } = await supabase
    .from('offers')
    .insert({
      offer_id: offerId,
      lk_id: session.lkId,
      username: session.email.split('@')[0],
      product_id: productId,
      product_name: product.name,
      price_cents: Math.round(Number(product.base_price) * 100),
      status: 'active',
    });

  if (offerInsertError) {
    return NextResponse.json({ error: 'Failed to create offer' }, { status: 500 });
  }

  const token = signOffer(payload);
  const offerUrl = `${req.nextUrl.origin}/offer/${offerId}?token=${token}`;

  return NextResponse.json({ offer_id: offerId, offer_url: offerUrl, token });
}

// GET /api/offers — list user's active offers (from orders table pending records)
export async function GET(req: NextRequest) {
  const sessionToken = req.cookies.get('porterful_session')?.value;
  if (!sessionToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const session = decodePorterfulSession(sessionToken);
  if (!session) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  }

  if (!session.lkId) return NextResponse.json({ error: 'No Likeness™ identity' }, { status: 403 });

  return NextResponse.json({ offers: [], message: 'Token-based offers — links are self-contained' });
}
