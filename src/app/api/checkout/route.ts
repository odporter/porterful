import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// Lazy-initialize Stripe only when needed
let stripeInstance: Stripe | null = null

const getStripe = () => {
  if (!stripeInstance && process.env.STRIPE_SECRET_KEY) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)
  }
  return stripeInstance
}

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe()
    const body = await request.json()
    const { items, shipping, referralCode } = body

    console.log('Checkout request:', JSON.stringify(items, null, 2))

    // Check if this is digital (tracks) or physical (merch)
    const isDigital = items.some((item: any) => item.type === 'track' || item.type === 'digital')
    
    // Calculate totals (in cents)
    const subtotal = items.reduce((sum: number, item: any) => {
      const price = Math.round(item.price * 100) // Convert to cents
      return sum + (price * (item.quantity || 1))
    }, 0)
    
    // No shipping for digital products
    const shippingCost = isDigital ? 0 : (subtotal >= 5000 ? 0 : 500)
    const total = subtotal + shippingCost

    // Calculate artist earnings (67% to seller, 20% to artist fund, 3% to superfans, 10% platform)
    const artistFund = Math.round(subtotal * 0.20)
    const superfanShare = Math.round(subtotal * 0.03)
    const platformFee = Math.round(subtotal * 0.10)
    const sellerEarnings = subtotal - artistFund - superfanShare - platformFee

    // Check if Stripe is configured
    if (!stripe) {
      // Demo mode - return mock session
      const demoSessionId = `demo_session_${Date.now()}`
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://porterful.com'
      return NextResponse.json({
        sessionId: demoSessionId,
        url: `${baseUrl}/checkout/success?demo=true&session_id=${demoSessionId}`,
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

    // Base URL for absolute paths
    const baseUrl = 'https://porterful.com'
    
    // Convert relative image URLs to absolute URLs
    const getAbsoluteUrl = (path: string | undefined): string[] => {
      if (!path) return []
      // Already absolute
      if (path.startsWith('http://') || path.startsWith('https://')) return [path]
      // Convert relative to absolute
      return [`${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`]
    }

    // Create Stripe checkout session
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: items.map((item: any) => {
        const images = getAbsoluteUrl(item.image)
        console.log(`Product: ${item.name}, Image: ${item.image} -> ${images[0] || 'none'}`)
        
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.name || item.title || 'Product',
              description: item.artist ? `by ${item.artist}` : (item.description || ''),
              images: images,
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity || 1,
        }
      }),
      mode: 'payment',
      success_url: `https://porterful.com/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://porterful.com/cart`,
      metadata: {
        artist_fund: artistFund.toString(),
        superfan_share: superfanShare.toString(),
        referral_code: referralCode || '',
        type: items[0]?.type || 'product',
      },
    }

    // Only collect shipping for physical products
    if (!isDigital) {
      sessionConfig.shipping_address_collection = {
        allowed_countries: ['US', 'CA'],
      }
    }

    console.log('Creating Stripe session...')
    const session = await stripe.checkout.sessions.create(sessionConfig)
    console.log('Session created:', session.id, session.url)

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
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
    console.error('Error details:', {
      message: error.message,
      type: error.type,
      stack: error.stack
    })
    return NextResponse.json(
      { error: error.message || 'Checkout failed', details: error.type || 'unknown' },
      { status: 500 }
    )
  }
}