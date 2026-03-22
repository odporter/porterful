// Printful API integration for dropshipping
import { NextRequest, NextResponse } from 'next/server'

const PRINTFUL_API_URL = 'https://api.printful.com'

async function printfulRequest(endpoint: string, options: RequestInit = {}) {
  const apiKey = process.env.PRINTFUL_API_KEY
  
  if (!apiKey || apiKey === 'your_printful_api_key') {
    return null
  }

  const response = await fetch(`${PRINTFUL_API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  return response.json()
}

// GET /api/dropship/printful/products - List Printful products
export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.PRINTFUL_API_KEY
    
    if (!apiKey || apiKey === 'your_printful_api_key') {
      return NextResponse.json({ 
        error: 'Printful not configured',
        demo: true,
        products: [
          { id: 'demo-1', name: 'Demo T-Shirt', type: 'tshirt', variants: 10 },
          { id: 'demo-2', name: 'Demo Hoodie', type: 'hoodie', variants: 8 },
          { id: 'demo-3', name: 'Demo Poster', type: 'poster', variants: 5 },
        ]
      })
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (action === 'products') {
      // Get all products from Printful store
      const data = await printfulRequest('/store/products')
      return NextResponse.json(data)
    }

    if (action === 'product') {
      const productId = searchParams.get('id')
      const data = await printfulRequest(`/store/products/${productId}`)
      return NextResponse.json(data)
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    console.error('Printful API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/dropship/printful - Create order in Printful
export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.PRINTFUL_API_KEY
    const body = await request.json()
    const { action, data } = body

    if (!apiKey || apiKey === 'your_printful_api_key') {
      // Demo mode - simulate successful order
      return NextResponse.json({
        success: true,
        demo: true,
        orderId: `demo-${Date.now()}`,
        message: 'Printful not configured - order simulated'
      })
    }

    if (action === 'create_order') {
      // Create order in Printful
      const orderData = {
        external_id: data.orderId,
        shipping: data.shipping,
        items: data.items.map((item: any) => ({
          external_id: item.id,
          variant_id: item.variantId,
          quantity: item.quantity,
          files: item.files || [],
        })),
        retail_costs: {
          currency: 'USD',
          subtotal: data.subtotal,
          discount: data.discount || 0,
          shipping: data.shippingCost,
          tax: data.tax || 0,
        },
      }

      const result = await printfulRequest('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      })

      return NextResponse.json(result)
    }

    if (action === 'shipping_rates') {
      // Get shipping rates for an order
      const result = await printfulRequest('/shipping/rates', {
        method: 'POST',
        body: JSON.stringify(data),
      })

      return NextResponse.json(result)
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    console.error('Printful API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}