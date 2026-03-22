import { NextResponse } from 'next/server'
import { PRODUCTS } from '@/lib/data'

// GET /api/products - List products
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '50')

    let products = [...PRODUCTS]

    if (category && category !== 'all') {
      products = products.filter(p => p.category === category)
    }

    return NextResponse.json({ 
      products: products.slice(0, limit),
      total: products.length 
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}