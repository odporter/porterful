import { NextRequest, NextResponse } from 'next/server'

// Stripe would be imported like this when keys are configured:
// import Stripe from 'stripe'
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' })

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, shipping, referralCode } = body

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
    const shippingCost = subtotal >= 50 ? 0 : 500 // $5 or free over $50
    const total = subtotal + shippingCost

    // Calculate artist earnings (67% to seller, 20% to artist fund, 3% to superfans, 10% platform)
    const artistFund = Math.round(subtotal * 0.20)
    const superfanShare = Math.round(subtotal * 0.03)
    const platformFee = Math.round(subtotal * 0.10)
    const sellerEarnings = subtotal - artistFund - superfanShare - platformFee

    // Check if Stripe is configured
    const stripeKey = process.env.STRIPE_SECRET_KEY
    
    if (!stripeKey || stripeKey === 'your_stripe_secret_key') {
      // Demo mode - return mock session
      return NextResponse.json({
        sessionId: `demo_session_${Date.now()}`,
        url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/success?demo=true`,
        demo: true,
        message: 'Stripe not configured. Running in demo mode.',
        breakdown: {
          subtotal: subtotal / 100,
          shipping: shippingCost / 100,
          total: total / 100,
          artistFund: artistFund / 100,
          sellerEarnings: sellerEarnings / 100,
        }
      })
    }

    // Real Stripe integration would go here:
    // const session = await stripe.checkout.sessions.create({
    //   payment_method_types: ['card'],
    //   line_items: items.map((item: any) => ({
    //     price_data: {
    //       currency: 'usd',
    //       product_data: {
    //         name: item.title,
    //         description: item.artist || item.description,
    //       },
    //       unit_amount: Math.round(item.price * 100),
    //     },
    //     quantity: item.quantity,
    //   })),
    //   mode: 'payment',
    //   success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    //   cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
    //   metadata: {
    //     artist_fund: artistFund.toString(),
    //     superfan_share: superfanShare.toString(),
    //     referral_code: referralCode || '',
    //   },
    // })
    //
    // return NextResponse.json({ sessionId: session.id, url: session.url })

    // For now, return demo response
    return NextResponse.json({
      sessionId: `demo_session_${Date.now()}`,
      url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/success?demo=true`,
      demo: true,
      breakdown: {
        subtotal: subtotal / 100,
        shipping: shippingCost / 100,
        total: total / 100,
        artistFund: artistFund / 100,
        sellerEarnings: sellerEarnings / 100,
      }
    })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Checkout failed' },
      { status: 500 }
    )
  }
}