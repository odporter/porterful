import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// GET /api/products - List products
export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { searchParams } = new URL(request.url)
    
    const category = searchParams.get('category')
    const artist_id = searchParams.get('artist_id')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('products')
      .select(`
        *,
        profiles:seller_id (name, avatar_url),
        artists:linked_artist_id (name, slug)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (category) {
      query = query.eq('category', category)
    }

    if (artist_id) {
      query = query.eq('linked_artist_id', artist_id)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ products: data })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

// POST /api/products - Create product (seller only)
export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      description,
      price,
      category,
      images,
      variants,
      inventory_count,
      dropship_provider,
      dropship_product_id,
      linked_artist_id,
    } = body

    // Get user profile to check role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['artist', 'business', 'admin'].includes(profile.role)) {
      return NextResponse.json({ error: 'Only sellers can create products' }, { status: 403 })
    }

    // Calculate revenue splits based on seller type
    const seller_percent = profile.role === 'artist' ? 80 : 67
    const artist_fund_percent = profile.role === 'artist' ? 15 : 20
    const superfan_percent = profile.role === 'artist' ? 5 : 3
    const platform_percent = profile.role === 'artist' ? 0 : 10

    const { data, error } = await supabase
      .from('products')
      .insert({
        seller_id: user.id,
        seller_type: profile.role,
        name,
        description,
        price,
        category,
        images: images || [],
        variants: variants || [],
        inventory_count: inventory_count || 999,
        dropship_provider: dropship_provider || 'none',
        dropship_product_id,
        linked_artist_id,
        seller_percent,
        artist_fund_percent,
        superfan_percent,
        platform_percent,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ product: data })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}