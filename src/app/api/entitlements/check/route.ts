import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

/**
 * GET /api/entitlements/check?email=X&product=Y
 * Cross-system entitlement verification for Porterful products.
 * Used by CreditKlimb, NLDS, FamilyOS, etc. to verify purchased access.
 * 
 * Protected by INTERNAL_API_KEY to prevent abuse.
 */
export async function GET(request: NextRequest) {
  const internalKey = request.headers.get('x-internal-key')
  const sharedKey = process.env.ENTITLEMENT_CHECK_SECRET || process.env.INTERNAL_API_KEY

  if (!sharedKey || internalKey !== sharedKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')?.toLowerCase().trim()
  const product = searchParams.get('product')

  if (!email) {
    return NextResponse.json({ error: 'email required' }, { status: 400 })
  }

  const supabase = createServerClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 500 })
  }

  // Verify active entitlement
  let hasAccess = false
  let entitlementId: string | null = null
  let grantedAt: string | null = null

  if (product) {
    const { data } = await supabase
      .from('entitlements')
      .select('id, granted_at')
      .eq('buyer_email', email)
      .eq('product_id', product)
      .eq('status', 'active')
      .maybeSingle()

    hasAccess = !!data
    entitlementId = data?.id || null
    grantedAt = data?.granted_at || null
  } else {
    // Check if any active entitlement exists
    const { data } = await supabase
      .from('entitlements')
      .select('id, product_id, granted_at')
      .eq('buyer_email', email)
      .eq('status', 'active')
      .maybeSingle()

    hasAccess = !!data
    entitlementId = data?.id || null
    grantedAt = data?.granted_at || null
  }

  return NextResponse.json({
    email,
    product: product || 'any',
    has_access: hasAccess,
    entitlement_id: entitlementId,
    granted_at: grantedAt,
    verified_at: new Date().toISOString(),
  })
}