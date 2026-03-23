'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'

// Custom Porterful Icons
const Icon = {
  Search: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  ShoppingCart: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
    </svg>
  ),
  Plus: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20,6 9,17 4,12" />
    </svg>
  ),
  Heart: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  ),
  Users: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  Package: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      <polyline points="3.27,6.96 12,12.01 20.73,6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  Sparkles: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z" />
    </svg>
  ),
}

interface Product {
  id: string
  name: string
  category: string
  subcategory?: string
  basePrice: number
  salePrice: number
  colors?: string[]
  sizes?: string[]
  images: string[]
  rating?: number
  reviews?: number
  inStock: boolean
}

const CATEGORIES = [
  { id: 'all', name: 'All Products' },
  { id: 'Apparel', name: 'Apparel' },
  { id: 'Tech', name: 'Tech' },
  { id: 'Home & Living', name: 'Home' },
  { id: 'Art', name: 'Art' },
  { id: 'Accessories', name: 'Accessories' },
  { id: 'Music', name: 'Music' },
]

export default function MarketplacePage() {
  const { items, addItem, itemCount } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [addedToCart, setAddedToCart] = useState<string | null>(null)

  // Fetch products from API
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products?limit=200')
      const data = await res.json()
      setProducts(data.products || [])
    } catch (err) {
      console.error('Failed to fetch products:', err)
    } finally {
      setLoading(false)
    }
  }

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory
    const matchesSearch = !search || 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      (p.subcategory?.toLowerCase().includes(search.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      price: product.salePrice,
      name: product.name,
      artist: 'Porterful',
      image: product.images[0],
      artistCut: product.salePrice * 0.8, // 80% to artist
    })
    setAddedToCart(product.id)
    setTimeout(() => setAddedToCart(null), 1500)
  }

  return (
    <div className="min-h-screen bg-[var(--pf-bg-secondary)] pt-16">
      {/* Header */}
      <header className="bg-[#131921] text-white sticky top-0 z-50">
        <div className="px-4 py-3 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1 shrink-0">
            <span className="text-lg font-bold text-[var(--pf-orange)]">PORTERFUL</span>
          </Link>

          <div className="flex-1 flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full py-2.5 px-4 pr-10 rounded-full text-black text-sm focus:outline-none"
              />
              <button className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 bg-[var(--pf-orange)] rounded-full flex items-center justify-center">
                <Icon.Search />
              </button>
            </div>
          </div>

          <Link href="/cart" className="relative p-2">
            <Icon.ShoppingCart />
            {itemCount > 0 && (
              <span className="absolute -top-1 right-0 w-5 h-5 bg-[var(--pf-orange)] rounded-full text-xs flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </Link>
        </div>

        <div className="bg-[#232F3E] overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-1 px-4 py-2 text-sm whitespace-nowrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="pb-24">
        {/* Products Grid */}
        <section className="p-4">
          <h2 className="text-lg font-bold mb-3 flex items-center justify-between">
            <span>
              {selectedCategory === 'all' ? 'All Products' : selectedCategory}
              <span className="ml-2 text-sm text-[var(--pf-text-secondary)] font-normal">
                {filteredProducts.length} items
              </span>
            </span>
            <span className="text-sm text-green-400 flex items-center gap-1">
              <Icon.Users />
              80% to artists
            </span>
          </h2>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-[var(--pf-surface)] rounded-xl overflow-hidden animate-pulse">
                  <div className="aspect-square bg-[var(--pf-border)]" />
                  <div className="p-3 space-y-2">
                    <div className="h-4 bg-[var(--pf-border)] rounded w-3/4" />
                    <div className="h-3 bg-[var(--pf-border)] rounded w-1/2" />
                    <div className="h-5 bg-[var(--pf-border)] rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-[var(--pf-text)] mb-2">No products found</h3>
              <p className="text-[var(--pf-text-secondary)]">Try a different search or category</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-[var(--pf-surface)] rounded-xl overflow-hidden group">
                  <Link href={`/product/${product.id}`}>
                    <div className="aspect-square relative">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      {product.category && (
                        <div className="absolute top-2 left-2 bg-[var(--pf-orange)] text-white text-xs px-2 py-0.5 rounded-full">
                          {product.category}
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="p-3">
                    <p className="text-xs text-[var(--pf-text-secondary)] mb-0.5">
                      {product.subcategory || product.category}
                    </p>
                    <Link href={`/product/${product.id}`}>
                      <h3 className="font-medium text-sm truncate hover:text-[var(--pf-orange)] text-[var(--pf-text)]">
                        {product.name}
                      </h3>
                    </Link>
                    {product.rating && (
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-yellow-400">★</span>
                        <span className="text-xs text-[var(--pf-text-secondary)]">
                          {product.rating.toFixed(1)}
                        </span>
                        {product.reviews && (
                          <span className="text-xs text-[var(--pf-text-muted)]">
                            ({product.reviews})
                          </span>
                        )}
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-[var(--pf-text)]">${product.salePrice.toFixed(2)}</span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          addedToCart === product.id
                            ? 'bg-green-500 text-white'
                            : 'bg-[var(--pf-orange)] text-white hover:bg-[var(--pf-orange)]/80'
                        }`}
                      >
                        {addedToCart === product.id ? (
                          <span className="flex items-center gap-1"><Icon.Check /> Added</span>
                        ) : (
                          <span className="flex items-center gap-1"><Icon.Plus /> Add</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Trust Badges */}
        <section className="grid grid-cols-3 gap-2 px-4 mb-4">
          <div className="bg-[var(--pf-surface)] rounded-xl p-3 text-center">
            <Icon.Package />
            <p className="text-xs font-medium mt-1 text-[var(--pf-text)]">Free Ship</p>
            <p className="text-[10px] text-[var(--pf-text-muted)]">Orders $50+</p>
          </div>
          <div className="bg-[var(--pf-surface)] rounded-xl p-3 text-center">
            <Icon.Heart />
            <p className="text-xs font-medium mt-1 text-[var(--pf-text)]">Artists First</p>
            <p className="text-[10px] text-[var(--pf-text-muted)]">80% to creators</p>
          </div>
          <div className="bg-[var(--pf-surface)] rounded-xl p-3 text-center">
            <Icon.Users />
            <p className="text-xs font-medium mt-1 text-[var(--pf-text)]">Community</p>
            <p className="text-[10px] text-[var(--pf-text-muted)]">Support local</p>
          </div>
        </section>

        {/* How It Works */}
        <section className="px-4 mb-4">
          <div className="bg-[var(--pf-surface)] rounded-xl p-6 text-center">
            <h2 className="text-lg font-bold mb-4 text-[var(--pf-text)]">How Porterful Works</h2>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="flex justify-center mb-2 text-[var(--pf-orange)]"><Icon.Package /></div>
                <p className="font-medium text-[var(--pf-text)]">Shop</p>
                <p className="text-xs text-[var(--pf-text-secondary)]">Same prices</p>
              </div>
              <div>
                <div className="flex justify-center mb-2 text-[var(--pf-orange)]"><Icon.Heart /></div>
                <p className="font-medium text-[var(--pf-text)]">Support</p>
                <p className="text-xs text-[var(--pf-text-secondary)]">Artists get paid</p>
              </div>
              <div>
                <div className="flex justify-center mb-2 text-[var(--pf-orange)]"><Icon.Sparkles /></div>
                <p className="font-medium text-[var(--pf-text)]">Feel Good</p>
                <p className="text-xs text-[var(--pf-text-secondary)]">Every purchase</p>
              </div>
            </div>
          </div>
        </section>

        {/* Cart Quick View */}
        {itemCount > 0 && (
          <div className="fixed bottom-4 left-4 right-4 z-50">
            <Link
              href="/cart"
              className="flex items-center justify-between bg-[var(--pf-orange)] text-white rounded-full px-6 py-3 shadow-lg"
            >
              <span className="flex items-center gap-2">
                <Icon.ShoppingCart />
                <span>{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
              </span>
              <span className="font-bold">View Cart →</span>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}