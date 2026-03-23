'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
import { PRODUCTS } from '@/lib/data'

// Custom Porterful Icons
const Icon = {
  Search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  ShoppingCart: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
    </svg>
  ),
  ShoppingBag: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  ),
  Package: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="16.5" y1="9.5" x2="7.5" y2="4.3" />
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      <polyline points="3.27,6.96 12,12.01 20.73,6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  Star: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  ),
  Truck: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16,8 20,8 23,11 23,16 16,16" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  ),
  Shield: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Users: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  Sparkles: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z" />
      <path d="M5 19l.5 2L7 21l-1.5.5L5 24l-.5-2L3 21l1.5-.5L5 19z" />
      <path d="M19 5l.5 2L21 7l-1.5.5L19 10l-.5-2L17 7l1.5-.5L19 5z" />
    </svg>
  ),
  Heart: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
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
  Music: () => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  ),
  Shirt: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z" />
    </svg>
  ),
}

// Categories for filter
const CATEGORIES = [
  { id: 'all', name: 'All', icon: Icon.ShoppingBag },
  { id: 'merch', name: 'Merch', icon: Icon.Shirt },
  { id: 'music', name: 'Music', icon: Icon.Music },
]

export default function MarketplacePage() {
  const { items, addItem, itemCount } = useCart()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [addedToCart, setAddedToCart] = useState<string | null>(null)

  const handleAddToCart = (product: typeof PRODUCTS[0]) => {
    addItem({
      productId: product.id,
      price: product.price,
      name: product.name,
      artist: product.artist,
      image: product.image,
      artistCut: product.artistCut,
    })
    setAddedToCart(product.id)
    setTimeout(() => setAddedToCart(null), 1500)
  }

  // Filter products
  const filteredProducts = selectedCategory === 'all' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === selectedCategory)

  return (
    <div className="min-h-screen bg-[var(--pf-bg-secondary)]">
      {/* Amazon-style Header */}
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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

        <div className="bg-[#232F3E] overflow-x-auto">
          <div className="flex items-center gap-1 px-4 py-2 text-sm whitespace-nowrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                  selectedCategory === cat.id 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <cat.icon />
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="pb-20">
        {/* Artist Merch Grid */}
        <section className="p-4">
          <h2 className="text-lg font-bold mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="text-[var(--pf-orange)]"><Icon.Sparkles /></span>
              Artist Merch & Music
            </span>
            <span className="text-sm text-green-400 flex items-center gap-1">
              <Icon.Users /> 80% to artists
            </span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-[var(--pf-surface)] rounded-xl overflow-hidden group">
                <Link href={`/product/${product.id}`}>
                  <div className="aspect-square relative">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    {product.category === 'music' && (
                      <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Icon.Music /> Music
                      </div>
                    )}
                    {product.category === 'merch' && (
                      <div className="absolute top-2 left-2 bg-[var(--pf-orange)] text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Icon.Shirt /> Merch
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-3">
                  <p className="text-xs text-[var(--pf-orange)] mb-0.5">{product.artist}</p>
                  <Link href={`/product/${product.id}`}>
                    <h3 className="font-medium text-sm truncate hover:text-[var(--pf-orange)]">{product.name}</h3>
                  </Link>
                  {product.rating && (
                    <div className="flex items-center gap-1 mt-1">
                      <Icon.Star />
                      <span className="text-xs">{product.rating}</span>
                      {product.reviews && (
                        <span className="text-xs text-[var(--pf-text-muted)]">({product.reviews})</span>
                      )}
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold">${product.price}</span>
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
        </section>

        {/* Trust Badges */}
        <section className="grid grid-cols-3 gap-2 px-4 mb-4">
          <div className="bg-[var(--pf-surface)] rounded-xl p-3 text-center">
            <div className="flex justify-center mb-1 text-[var(--pf-orange)]"><Icon.Truck /></div>
            <p className="text-xs font-medium">Free Ship</p>
            <p className="text-[10px] text-[var(--pf-text-muted)]">$50+</p>
          </div>
          <div className="bg-[var(--pf-surface)] rounded-xl p-3 text-center">
            <div className="flex justify-center mb-1 text-[var(--pf-orange)]"><Icon.Shield /></div>
            <p className="text-xs font-medium">Secure</p>
            <p className="text-[10px] text-[var(--pf-text-muted)]">SSL</p>
          </div>
          <div className="bg-[var(--pf-surface)] rounded-xl p-3 text-center">
            <div className="flex justify-center mb-1 text-[var(--pf-orange)]"><Icon.Users /></div>
            <p className="text-xs font-medium">Artists</p>
            <p className="text-[10px] text-[var(--pf-text-muted)]">Get Paid</p>
          </div>
        </section>

        {/* How It Works */}
        <section className="p-4 mt-2">
          <div className="bg-[var(--pf-surface)] rounded-xl p-6 text-center">
            <h2 className="text-lg font-bold mb-4">How Porterful Works</h2>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="flex justify-center mb-2 text-[var(--pf-orange)]"><Icon.ShoppingBag /></div>
                <p className="font-medium">Shop</p>
                <p className="text-xs text-[var(--pf-text-muted)]">Same prices</p>
              </div>
              <div>
                <div className="flex justify-center mb-2 text-[var(--pf-orange)]"><Icon.Heart /></div>
                <p className="font-medium">Support</p>
                <p className="text-xs text-[var(--pf-text-muted)]">Artists get paid</p>
              </div>
              <div>
                <div className="flex justify-center mb-2 text-[var(--pf-orange)]"><Icon.Sparkles /></div>
                <p className="font-medium">Feel Good</p>
                <p className="text-xs text-[var(--pf-text-muted)]">Every purchase</p>
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
              <span className="font-bold">
                View Cart →
              </span>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}