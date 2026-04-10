import { NextRequest, NextResponse } from 'next/server'

async function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return null
  const Stripe = (await import('stripe')).default
  return new Stripe(key)
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const sessionId = params.id

  // Demo mode
  if (sessionId.startsWith('demo_')) {
    return NextResponse.json({
      item: {
        name: 'Demo Track',
        artist: 'O D Porter',
        image: '',
        type: 'track',
      },
      demo: true,
    })
  }

  try {
    const stripe = await getStripe()

    // If no Stripe key, fall back to metadata-only response
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    // Try to parse full items array from metadata first
    let items: any[] = []
    if (session.metadata?.items) {
      try {
        items = JSON.parse(session.metadata.items)
      } catch {
        // Fall back to single-item parse
      }
    }

    // If no items parsed, build from individual metadata fields
    if (items.length === 0) {
      const type = session.metadata?.type || 'product'
      items = [{
        name: session.metadata?.track_name || 'Your Purchase',
        artist: session.metadata?.track_artist || 'Artist',
        image: session.metadata?.track_image || '',
        audioUrl: session.metadata?.audio_url || '',
        type,
      }]
    }

    return NextResponse.json({
      item: items[0] || null,
      items,
      customerEmail: session.customer_details?.email || session.customer_email || null,
      amount: session.amount_total ? (session.amount_total / 100) : null,
      sessionId: session.id,
      paymentStatus: session.payment_status || null,
    })
  } catch (error: any) {
    // Stripe session not found or error — still return something usable
    if (error.code === 'resource_missing' || error.statusCode === 404) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }
    return NextResponse.json({ error: error.message || 'Failed to retrieve session' }, { status: 500 })
  }
}
