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

    // Resolve items: order_items → metadata.items JSON → metadata.product_id catalog fallback
    let resolvedItems: any[] = []

    if (order?.items && Array.isArray(order.items)) {
      resolvedItems = order.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        artist: item.artist,
        type: item.type,
        price: item.price,
        audioUrl: item.download_url || item.audio_url || item.audioUrl || '',
        downloadUrl: item.download_url || item.audio_url,
        storagePath: item.storage_path,
      }))
    }

    // If no order items, try metadata.items JSON array
    if (resolvedItems.length === 0 && session.metadata?.items) {
      try {
        const parsed = JSON.parse(session.metadata.items)
        if (Array.isArray(parsed)) {
          resolvedItems = parsed.map((item: any) => ({
            id: item.id || '',
            name: item.name || item.title || 'Unknown Track',
            artist: item.artist || 'Unknown Artist',
            type: item.type || 'track',
            audioUrl: item.audioUrl || item.audio_url || '',
            image: item.image || '',
          }))
        }
      } catch (e) {
        console.error('[session]', sessionId, 'Failed to parse metadata.items:', e)
      }
    }

    // Last resort: single product_id catalog lookup
    if (resolvedItems.length === 0 && session.metadata?.product_id) {
      const { data: catalogItem } = await supabase
        .from('products')
        .select('id, name, artist, image, type, audio_url')
        .eq('id', session.metadata.product_id)
        .maybeSingle()

      if (catalogItem) {
        resolvedItems = [{
          id: catalogItem.id,
          name: catalogItem.name,
          artist: catalogItem.artist || 'Unknown Artist',
          type: catalogItem.type || 'track',
          audioUrl: catalogItem.audio_url || '',
          image: catalogItem.image || '',
        }]
      }
    }

    response.items = resolvedItems

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Session fetch error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch session' },
      { status: 500 }
    )
  }
}
