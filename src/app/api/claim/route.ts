import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// Map product_id to protected product routes
const PRODUCT_REDIRECTS: Record<string, string> = {
  'credit-klimb': '/credit-klimb',
  'nlds-membership': '/nlds',
  'teachyoung': '/teachyoung',
  'family-os': '/family-os',
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, product, offer, session_id } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const supabase = createServerClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Service not available' }, { status: 500 })
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Step 1: Find completed order by session_id and buyer_email
    let order = null
    if (session_id) {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('stripe_checkout_session_id', session_id)
        .eq('buyer_email', normalizedEmail)
        .eq('status', 'completed')
        .single()
      order = data
    }

    // Step 2: Verify access — entitlements table if available, orders fallback
    let hasAccess = false
    let accessSource = ''

    if (product) {
      // Try entitlements table first
      const { data: entitlement } = await supabase
        .from('entitlements')
        .select('id')
        .eq('buyer_email', normalizedEmail)
        .eq('product_id', product)
        .eq('status', 'active')
        .maybeSingle()

      if (entitlement) {
        hasAccess = true
        accessSource = 'entitlement'
      } else if (order && order.product_id === product) {
        hasAccess = true
        accessSource = 'order'
      } else if (order && !order.product_id) {
        // Legacy order without product_id — grant access if order exists
        hasAccess = true
        accessSource = 'order_legacy'
      }
    } else if (order) {
      hasAccess = true
      accessSource = 'order_any'
    }

    if (!hasAccess) {
      return NextResponse.json({
        error: 'No active access found for this email and product. Please complete a purchase first or contact support.',
      }, { status: 403 })
    }

    // Step 3: Determine redirect URL
    let redirectUrl = '/dashboard'
    if (product && PRODUCT_REDIRECTS[product]) {
      redirectUrl = PRODUCT_REDIRECTS[product]
    }

    // Step 4: Set claim session cookie
    const response = NextResponse.json({
      success: true,
      message: 'Access verified. Redirecting to your product...',
      redirect_url: redirectUrl,
      product_id: product,
      access_source: accessSource,
    })

    const claimToken = Buffer.from(JSON.stringify({
      email: normalizedEmail,
      product_id: product,
      ts: Date.now(),
      source: accessSource,
    })).toString('base64url')

    response.cookies.set('porterful_claim', claimToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (err: any) {
    console.error('[claim] Error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
