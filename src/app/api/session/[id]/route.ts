import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
    }

    // Fetch from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'customer_details'],
    })

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Fetch from Supabase orders
    const supabase = createServerClient()
    const { data: order } = await supabase
      .from('orders')
      .select('*')
      .eq('stripe_checkout_session_id', sessionId)
      .single()

    // Build response
    const response: any = {
      sessionId: session.id,
      customerEmail: session.customer_details?.email || order?.buyer_email,
      paymentStatus: session.payment_status,
      amountTotal: session.amount_total,
      currency: session.currency,
    }

    // If we have order items with download URLs
    if (order?.items && Array.isArray(order.items)) {
      response.items = order.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        artist: item.artist,
        type: item.type,
        price: item.price,
        downloadUrl: item.download_url || item.audio_url,
        storagePath: item.storage_path,
      }))
    } else if (session.metadata) {
      // Fallback to metadata
      response.items = [{
        name: session.metadata.item_name || 'Track Purchase',
        artist: session.metadata.item_artist || 'Unknown Artist',
        type: session.metadata.item_type || 'track',
        downloadUrl: session.metadata.download_url || null,
      }]
    }

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Session fetch error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch session' },
      { status: 500 }
    )
  }
}
