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
  try {
    const stripe = await getStripe()
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
    }

    const session = await stripe.checkout.sessions.retrieve(params.id)

    const item = {
      name: session.metadata?.track_name || '',
      artist: session.metadata?.track_artist || '',
      image: session.metadata?.track_image || '',
      audioUrl: session.metadata?.audio_url || '',
      type: session.metadata?.type || 'track',
    }

    return NextResponse.json({ item })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
