import Link from 'next/link'
import { ShoppingBag, Music, Tshirt, Headphones, Sparkles } from 'lucide-react'

const CATEGORIES = [
  { id: 'all', name: 'All', icon: Sparkles },
  { id: 'music', name: 'Music', icon: Music },
  { id: 'merch', name: 'Merch', icon: Tshirt },
  { id: 'essentials', name: 'Essentials', icon: ShoppingBag },
  { id: 'electronics', name: 'Electronics', icon: Headphones },
]

const PRODUCTS = [
  // Artist Merch
  { id: '1', name: 'Ambiguous Tour Tee', artist: 'O D Porter', price: 25, category: 'merch', image: '👕', type: 'Artist Merch' },
  { id: '2', name: 'Ambiguous EP (Digital)', artist: 'O D Porter', price: 5, category: 'music', image: '💿', type: 'Digital Album' },
  { id: '3', name: 'Ambiguous Vinyl', artist: 'O D Porter', price: 50, category: 'merch', image: '📀', type: 'Vinyl' },
  
  // Essentials (everyday items - part of the marketplace vision)
  { id: '4', name: 'Premium Toothpaste', brand: 'CleanSmile', price: 8.99, category: 'essentials', image: '🦷', type: 'Essential', discount: '20% supports artists' },
  { id: '5', name: 'Organic Shampoo', brand: 'Naturals', price: 14.99, category: 'essentials', image: '🧴', type: 'Essential', discount: '20% supports artists' },
  { id: '6', name: 'Bamboo Toothbrush Set', brand: 'EcoBrush', price: 12.99, category: 'essentials', image: '🌿', type: 'Essential', discount: '20% supports artists' },
  
  // Electronics
  { id: '7', name: 'Wireless Earbuds', brand: 'SoundMax', price: 49.99, category: 'electronics', image: '🎧', type: 'Electronics', discount: '20% supports artists' },
  { id: '8', name: 'Portable Charger', brand: 'PowerUp', price: 29.99, category: 'electronics', image: '🔋', type: 'Electronics', discount: '20% supports artists' },
]

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-[var(--pf-bg)]">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-b from-[var(--pf-orange)]/10 to-transparent">
        <div className="pf-container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Shop, Stream, Support
            </h1>
            <p className="text-xl text-[var(--pf-text-secondary)] mb-8">
              Every purchase puts money in artists' pockets. From merch to toothpaste.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-[var(--pf-surface)] px-4 py-2 rounded-full">
                <span className="text-[var(--pf-orange)] font-bold">80%</span>
                <span class="text-[var(--pf-text-secondary)]">to artists on merch</span>
              </div>
              <div className="flex items-center gap-2 bg-[var(--pf-surface)] px-4 py-2 rounded-full">
                <span className="text-purple-400 font-bold">20%</span>
                <span class="text-[var(--pf-text-secondary)]">to artists from marketplace</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-b border-[var(--pf-border)]">
        <div className="pf-container">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className="flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors bg-[var(--pf-surface)] hover:bg-[var(--pf-surface-hover)] text-[var(--pf-text-secondary)] hover:text-white"
              >
                <cat.icon size={16} />
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Artist Merch */}
      <section className="py-12">
        <div className="pf-container">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Artist Merch</h2>
              <p className="text-[var(--pf-text-secondary)]">Direct from the artists you love</p>
            </div>
            <Link href="/store" className="text-[var(--pf-orange)] hover:underline">
              View all →
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.filter(p => p.category === 'merch' || p.category === 'music').map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="pf-card group overflow-hidden"
              >
                <div className="aspect-square bg-gradient-to-br from-[var(--pf-orange)]/10 to-purple-500/10 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform">
                  {product.image}
                </div>
                <div className="p-4">
                  <p className="text-xs text-[var(--pf-text-muted)] uppercase tracking-wider mb-1">
                    {product.type}
                  </p>
                  <h3 className="font-semibold group-hover:text-[var(--pf-orange)] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-[var(--pf-text-secondary)]">{product.artist}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold">${product.price}</span>
                    <span className="text-sm text-[var(--pf-orange)]">80% to artist</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplace - Everyday Items */}
      <section className="py-12 bg-[var(--pf-bg-secondary)]">
        <div className="pf-container">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">Everyday Essentials</h2>
            <p className="text-[var(--pf-text-secondary)]">
              Buy what you need. 20% goes to artists. Same price as Amazon.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRODUCTS.filter(p => p.category === 'essentials' || p.category === 'electronics').map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="pf-card group"
              >
                <div className="aspect-square bg-gradient-to-br from-blue-500/10 to-green-500/10 flex items-center justify-center text-5xl group-hover:scale-105 transition-transform rounded-t-xl">
                  {product.image}
                </div>
                <div className="p-3">
                  <p className="text-xs text-[var(--pf-text-muted)]">{product.type}</p>
                  <h3 className="font-medium text-sm truncate">{product.name}</h3>
                  <p className="text-xs text-[var(--pf-text-secondary)]">{product.brand}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold">${product.price}</span>
                    <span className="text-xs text-purple-400">20% to artists</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-[var(--pf-text-secondary)] mb-4">
              This is the vision: Every purchase supports creators.
            </p>
            <Link href="/about" className="pf-btn pf-btn-secondary">
              Learn How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="pf-container">
          <div className="pf-card p-8 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Want Your Products Here?</h2>
            <p className="text-[var(--pf-text-secondary)] mb-6">
              Businesses can list products and reach music fans. Artists promote what they love.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/signup?role=business" className="pf-btn pf-btn-primary">
                List Your Products
              </Link>
              <Link href="/signup?role=artist" className="pf-btn pf-btn-secondary">
                Become an Artist
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}