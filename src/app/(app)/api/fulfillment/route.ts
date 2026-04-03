// Unified order fulfillment - routes to correct dropship provider
import { NextRequest, NextResponse } from 'next/server'

interface OrderItem {
  productId: string
  variantId?: string
  quantity: number
  price: number
  name: string
  dropshipProvider?: string
  dropshipProductId?: string
}

interface ShippingInfo {
  name: string
  email: string
  address: string
  city: string
  state: string
  zip: string
  country: string
}

// Route order items to the correct fulfillment provider
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, items, shipping, subtotal }: {
      orderId: string
      items: OrderItem[]
      shipping: ShippingInfo
      subtotal: number
    } = body

    // Group items by fulfillment type
    const selfFulfilled = items.filter(i => !i.dropshipProvider || i.dropshipProvider === 'none')
    const printfulItems = items.filter(i => i.dropshipProvider === 'printful')
    const zendropItems = items.filter(i => i.dropshipProvider === 'zendrop')

    const results = {
      orderId,
      selfFulfilled: selfFulfilled.length,
      printful: null as any,
      zendrop: null as any,
      errors: [] as string[],
    }

    // Process Printful orders
    if (printfulItems.length > 0) {
      try {
        const printfulResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/dropship/printful`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'create_order',
            data: {
              orderId: `${orderId}-printful`,
              shipping,
              items: printfulItems.map(i => ({
                id: i.productId,
                variantId: i.dropshipProductId,
                quantity: i.quantity,
              })),
              subtotal: printfulItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
              shippingCost: 0, // Calculate based on Printful rates
            },
          }),
        })
        results.printful = await printfulResponse.json()
      } catch (error: any) {
        results.errors.push(`Printful: ${error.message}`)
      }
    }

    // Process Zendrop orders
    if (zendropItems.length > 0) {
      try {
        const zendropResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/dropship/zendrop`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'create_order',
            data: {
              orderId: `${orderId}-zendrop`,
              shipping,
              items: zendropItems.map(i => ({
                productId: i.productId,
                variantId: i.dropshipProductId,
                quantity: i.quantity,
              })),
            },
          }),
        })
        results.zendrop = await zendropResponse.json()
      } catch (error: any) {
        results.errors.push(`Zendrop: ${error.message}`)
      }
    }

    // Log self-fulfilled items for manual processing
    if (selfFulfilled.length > 0) {
      console.log(`Order ${orderId}: ${selfFulfilled.length} items need manual fulfillment`)
      console.log('Items:', selfFulfilled.map(i => `${i.name} x${i.quantity}`).join(', '))
      console.log('Ship to:', shipping)
    }

    return NextResponse.json({
      success: results.errors.length === 0,
      results,
      message: results.errors.length > 0 
        ? 'Some items need attention' 
        : 'Order routed to fulfillment providers',
    })

  } catch (error: any) {
    console.error('Order fulfillment error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}