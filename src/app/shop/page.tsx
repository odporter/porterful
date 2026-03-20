'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Filter, Search, ShoppingBag, Heart, Music, Check, Star } from 'lucide-react'

// Demo artists (will come from Supabase)
const DEMO_ARTISTS = [
  { id: 'od', name: 'O D Music', genre: 'Hip-Hop / R&B', image: '🎤', supporters: 2847, goal: 2500, current: 1847 },
  { id: 'alex', name: 'Alex Rivers', genre: 'Indie Pop', image: '🎸', supporters: 1205, goal: 1500, current: 890 },
  { id: 'maya', name: 'Maya Sol', genre: 'Electronic', image: '🎹', supporters: 983, goal: 1000, current: 672 },
  { id: 'luna', name: 'Luna Wave', genre: 'Lo-Fi', image: '🎧', supporters: 1562, goal: 2000, current: 1456 },
]

// Demo products (will come from Supabase)
const DEMO_PRODUCTS = [
  { id: '1', category: 'essentials', name: 'Premium Toothpaste', price: 8.99, image: '🪥', description: 'Whitening formula - 6oz' },
  { id: '2', category: 'essentials', name: 'Toilet Paper (12 Rolls)', price: 12.99, image: '🧻', description: 'Ultra-soft 3-ply' },
  { id: '3', category: 'essentials', name: 'Hand Soap Refill', price: 9.99, image: '🧼', description: 'Lavender scent - 32oz' },
  { id: '4', category: 'essentials', name: 'Bottled Water (24 Pack)', price: 8.99, image: '💧', description: 'Natural spring water' },
  { id: '5', category: 'trending', name: 'Wireless Earbuds Pro', price: 49.99, image: '🎧', description: 'Noise cancelling, 24hr battery' },
  { id: '6', category: 'trending', name: 'Phone Charger Cable', price: 15.99, image: '🔌', description: 'Braided, fast charge' },
  { id: '7', category: 'trending', name: 'Portable Speaker', price: 29.99, image: '🔊', description: 'Waterproof, bluetooth' },
  { id: '8', category: 'artist', name: 'Ambiguous Tour Tee', price: 25.00, image: '👕', description: 'Limited edition cotton' },
  { id: '9', category: 'artist', name: 'Ambiguous EP Digital', price: 5.00, image: '💿', description: '5-track digital release' },
  { id: '10', category: 'artist', name: 'Signed Vinyl', price: 50.00, image: '📀', description: 'Limited signed edition' },
]

const CATEGORIES = [
  { id: 'all', label: 'All Products' },
  { id: 'essentials', label: 'Essentials' },
  { id: 'trending', label: 'Trending' },
  { id: 'artist', label: 'Artist Merch' },
]

export const dynamic = 'force-dynamic'

function ShopContent() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('category') || 'all'
  
  const [category, setCategory] = useState(initialCategory)
  const [search, setSearch] = useState('')
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null)
  const [showArtistSelector, setShowArtistSelector] = useState(false)
  const [cart, setCart] = useState<any[]>([])
  
  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) setCategory(cat)
  }, [searchParams])

  const filteredProducts = DEMO_PRODUCTS.filter(p => {
    const matchesCategory = category === 'all' || p.category === category
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const selectedArtistData = DEMO_ARTISTS.find(a => a.id === selectedArtist)

  const addToCart = (product: any) => {
    setCart([...cart, { ...product, artist: selectedArtistData }])
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="pf-container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Marketplace</h1>
          <p className="text-[var(--pf-text-secondary)]">
            Every purchase supports artists. Choose who you want to help.
          </p>
        </div>

        {/* Artist Selector - THE KEY FEATURE */}
        <div className="pf-card p-6 mb-8 bg-gradient-to-r from-[var(--pf-orange)]/10 to-transparent border-[var(--pf-orange)]/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Music className="text-[var(--pf-orange)]" size={20} />
                Choose Your Artist
              </h2>
              <p className="text-sm text-[var(--pf-text-secondary)]">
                20% of every purchase goes to your selected artist
              </p>
            </div>
            {selectedArtist && (
              <button
                onClick={() => setShowArtistSelector(!showArtistSelector)}
                className="text-sm text-[var(--pf-orange)] hover:underline"
              >
                Change artist
              </button>
            )}
          </div>

          {selectedArtist && !showArtistSelector ? (
            <div className="flex items-center gap-4 p-4 bg-[var(--pf-bg)] rounded-xl">
              <div className="w-14 h-14 rounded-xl bg-[var(--pf-orange)]/20 flex items-center justify-center text-3xl">
                {selectedArtistData?.image}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{selectedArtistData?.name}</p>
                <p className="text-sm text-[var(--pf-text-muted)]">{selectedArtistData?.genre}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm">
                  <Star className="text-[var(--pf-orange)]" size={14} />
                  <span>{selectedArtistData?.supporters.toLocaleString()} supporters</span>
                </div>
                <p className="text-xs text-[var(--pf-text-muted)]">
                  ${selectedArtistData?.current.toLocaleString()} / ${selectedArtistData?.goal.toLocaleString()}
                </p>
              </div>
              <Check className="text-green-400" size={24} />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {DEMO_ARTISTS.map(artist => (
                <button
                  key={artist.id}
                  onClick={() => {
                    setSelectedArtist(artist.id)
                    setShowArtistSelector(false)
                  }}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    selectedArtist === artist.id
                      ? 'border-[var(--pf-orange)] bg-[var(--pf-orange)]/10'
                      : 'border-[var(--pf-border)] hover:border-[var(--pf-orange)]/50 bg-[var(--pf-bg)]'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-[var(--pf-orange)]/20 flex items-center justify-center text-xl">
                      {artist.image}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{artist.name}</p>
                      <p className="text-xs text-[var(--pf-text-muted)]">{artist.genre}</p>
                    </div>
                    {selectedArtist === artist.id && (
                      <Check className="text-[var(--pf-orange)]" size={18} />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--pf-text-muted)]">{artist.supporters.toLocaleString()} supporters</span>
                    <span className="text-[var(--pf-orange)]">{Math.round((artist.current / artist.goal) * 100)}%</span>
                  </div>
                  <div className="mt-2 h-1 bg-[var(--pf-border)] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[var(--pf-orange)] rounded-full"
                      style={{ width: `${(artist.current / artist.goal) * 100}%` }}
                    />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--pf-text-muted)]" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pf-input pl-12"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  category === cat.id 
                    ? 'bg-[var(--pf-orange)] text-white' 
                    : 'bg-[var(--pf-surface)] text-[var(--pf-text-secondary)] hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Revenue Split Explanation */}
        <div className="mb-8 p-4 bg-[var(--pf-surface)] rounded-xl border border-[var(--pf-border)]">
          <div className="flex items-center justify-center gap-6 text-sm flex-wrap">
            <span className="text-[var(--pf-text-muted)]">Every purchase:</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Seller: 67%
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[var(--pf-orange)]"></span>
              Artist: 20%
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              Superfan: 3%
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[var(--pf-text-muted)]"></span>
              Platform: 10%
            </span>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="pf-card group">
              <div className="aspect-square bg-[var(--pf-bg-tertiary)] flex items-center justify-center text-6xl relative">
                {product.image}
                <button className="absolute top-3 right-3 p-2 rounded-full bg-[var(--pf-bg)]/80 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--pf-orange)] hover:text-white">
                  <Heart size={18} />
                </button>
                <span className="absolute top-3 left-3 px-2 py-1 bg-[var(--pf-bg)]/80 rounded text-xs font-medium capitalize">
                  {product.category}
                </span>
              </div>
              <div className="p-4">
                <p className="text-sm text-[var(--pf-orange)] mb-1">{product.description}</p>
                <h3 className="font-semibold mb-1">{product.name}</h3>
                
                {/* Artist Support Badge */}
                {selectedArtist && (
                  <p className="text-xs text-[var(--pf-text-muted)] mb-2 flex items-center gap-1">
                    <Music size={12} />
                    Supports: <span className="text-[var(--pf-orange)]">{selectedArtistData?.name}</span>
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                    {selectedArtist && (
                      <p className="text-xs text-green-400">+${(product.price * 0.20).toFixed(2)} to artist</p>
                    )}
                  </div>
                  <button 
                    onClick={() => addToCart(product)}
                    className="p-2 rounded-lg bg-[var(--pf-orange)] hover:bg-[var(--pf-orange-light)] transition-colors"
                  >
                    <ShoppingBag size={18} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[var(--pf-text-muted)] text-lg">No products found</p>
          </div>
        )}

        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[var(--pf-orange)] text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3">
            <ShoppingBag size={20} />
            <span>{cart.length} item{cart.length > 1 ? 's' : ''} in cart</span>
            {selectedArtist && (
              <span className="text-sm opacity-80">
                Supporting {selectedArtistData?.name}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Wrapper for useSearchParams
export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 flex items-center justify-center"><div className="text-[var(--pf-text-muted)]">Loading...</div></div>}>
      <ShopContent />
    </Suspense>
  )
}