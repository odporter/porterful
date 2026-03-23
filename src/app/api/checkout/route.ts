import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json({ 
        error: 'Stripe not configured',
        demo: true,
        url: 'https://porterful.com/checkout/success?demo=true'
      })
    }

    const body = await request.json()
    const { items } = body

    console.log('Items received:', JSON.stringify(items))

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: items[0]?.name || 'Track',
            description: items[0]?.artist ? `by ${items[0].artist}` : undefined,
          },
          unit_amount: 100, // $1.00
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: 'https://porterful.com/checkout/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://porterful.com/',
    })

    console.log('Session created:', session.id)

    return NextResponse.json({
      sessionId: session.id,
      url: session.url
    })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json({ 
      error: error.message,
      type: error.type,
      stack: error.stack
    }, { status: 500 })
  }
}
