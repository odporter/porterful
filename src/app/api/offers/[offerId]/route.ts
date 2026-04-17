import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createServerClient } from '@/lib/supabase';

function getOfferSecret() {
  const secret = process.env.OFFER_SECRET;
  if (!secret) {
    throw new Error('OFFER_SECRET is required');
  }
  return secret;
}

function verifyOffer(token: string): { valid: true; data: any } | { valid: false; error: string } {
  try {
    const [tokenPart, sigPart] = token.split('.');
    if (!tokenPart || !sigPart) return { valid: false, error: 'Malformed token' };
    const data = JSON.parse(Buffer.from(tokenPart, 'base64url').toString('utf8'));
    const sig = crypto.createHmac('sha256', getOfferSecret()).update(JSON.stringify(data)).digest('base64url');
    if (sigPart !== sig) return { valid: false, error: 'Invalid signature' };
    if (data.exp && data.exp < Math.floor(Date.now() / 1000)) return { valid: false, error: 'Expired' };
    return { valid: true, data };
  } catch {
    return { valid: false, error: 'Invalid token' };
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ offerId: string }> }
) {
  const { offerId } = await params;
  const token = new URL(req.url).searchParams.get('token');

  if (!offerId) return NextResponse.json({ error: 'Missing offerId' }, { status: 400 });

  if (token) {
    // Token-based: verify the self-contained token
    const result = verifyOffer(token);
    if (!result.valid) return NextResponse.json({ error: result.error }, { status: 404 });

    const supabase = createServerClient();
    const { data: offer } = await supabase
      .from('offers')
      .select('offer_id, product_id, product_name, price_cents, username, lk_id, status')
      .eq('offer_id', offerId)
      .eq('status', 'active')
      .limit(1)
      .single();

    if (!offer || offer.lk_id !== result.data.lk_id || offer.product_id !== result.data.product_id) {
      return NextResponse.json({ error: 'Offer not found or token expired' }, { status: 404 });
    }

    return NextResponse.json(offer);
  }

  // No token: try DB-based (legacy, won't exist)
  return NextResponse.json({ error: 'Offer not found or token expired' }, { status: 404 });
}
