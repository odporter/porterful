import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!webhookSecret || webhookSecret === 'your_stripe_webhook_secret') {
      console.log('⚠️ Webhook received but STRIPE_WEBHOOK_SECRET not configured')
      return NextResponse.json({ 
        received: true, 
        warning: 'Webhook secret not configured. Set STRIPE_WEBHOOK_SECRET in .env.local' 
      })
    }

    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(body, signature!, webhookSecret)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        console.log('✅ Payment successful:', session.id)
        console.log('   Customer:', session.customer_details?.email || session.customer_email)
        console.log('   Amount:', session.amount_total ? `$${(session.amount_total / 100).toFixed(2)}` : 'N/A')
        console.log('   Artist fund:', session.metadata?.artist_fund)
        console.log('   Superfan share:', session.metadata?.superfan_share)
        console.log('   Referral code:', session.metadata?.referral_code)

        // Extract order data from session
        const orderData = {
          orderId: session.id,
          paymentIntentId: session.payment_intent as string,
          email: session.customer_details?.email || session.customer_email || '',
          shipping: {
            name: (session as any).shipping_details?.name || session.customer_details?.name || '',
            address: (session as any).shipping_details?.address?.line1 || '',
            city: (session as any).shipping_details?.address?.city || '',
            state: (session as any).shipping_details?.address?.state || '',
            zip: (session as any).shipping_details?.address?.postal_code || '',
            country: (session as any).shipping_details?.address?.country || 'US',
          },
          subtotal: session.amount_subtotal || 0,
          total: session.amount_total || 0,
          metadata: session.metadata || {},
        }

        // TODO: Store order in database
        // await createOrderInDatabase(orderData)

        // TODO: Send confirmation email
        // await sendOrderConfirmationEmail(orderData)

        // TODO: Trigger fulfillment for dropship items
        // await fetch('/api/fulfillment', { ... })

        break
      }
      
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('✅ Payment intent succeeded:', paymentIntent.id)
        break
      }
      
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('❌ Payment failed:', paymentIntent.id)
        console.log('   Error:', paymentIntent.last_payment_error?.message)
        break
      }
      
      case 'charge.succeeded': {
        const charge = event.data.object as Stripe.Charge
        console.log('✅ Charge succeeded:', charge.id)
        break
      }
      
      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        console.log('💸 Refund processed:', charge.id)
        // TODO: Handle refund - update order status, notify customer
        break
      }
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook error:', error.message)
    return NextResponse.json(
      { error: `Webhook error: ${error.message}` },
      { status: 400 }
    )
  }
}