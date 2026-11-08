import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// Lazy initialization to avoid build-time errors when env vars aren't set
let stripeInstance: Stripe | null = null
function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) throw new Error('STRIPE_SECRET_KEY not configured')
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-01-27.acacia' as any })
  }
  return stripeInstance
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, successUrl, cancelUrl } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items specified' }, { status: 400 })
    }

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.type === 'track' ? `${item.artist} — ${item.name}` : item.name,
          description: item.type === 'track' ? `Digital track purchase` : undefined,
        },
        unit_amount: Math.round((item.price || 1) * 100),
      },
      quantity: item.quantity || 1,
    }))

    // Build metadata from all items (for music purchases)
    const metadata: Record<string, string> = {
      item_count: String(items.length),
      items: items.map((item: any) => `${item.type || 'track'}:${item.id || item.name}`).join(','),
    }

    // Include audio URLs for all track purchases
    const trackItems = items.filter((item: any) => item.type === 'track' && item.audio_url);
    if (trackItems.length > 0) {
      metadata.audio_urls = trackItems.map((item: any) => item.audio_url).join(',');
    }

    // Include all artist IDs for attribution
    const artistIds = [...new Set(items.map((item: any) => item.artist).filter(Boolean))];
    if (artistIds.length > 0) {
      metadata.artists = artistIds.join(',');
    }

    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: successUrl?.replace('{CHECKOUT_SESSION_ID}', '{CHECKOUT_SESSION_ID}') || `${request.nextUrl.origin}/checkout/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${request.nextUrl.origin}`,
      metadata,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: err.message || 'Checkout failed' }, { status: 500 })
  }
}
