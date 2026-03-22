'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, Star, Truck, Shield, Sun, Moon, Plus, Check } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';
import { useAudio } from '@/lib/audio-context';
import { useCart } from '@/lib/cart-context';
import { Play, Pause } from 'lucide-react';
import { PRODUCTS } from '@/lib/data';

// Categories for mobile scroll
const CATEGORIES = [
  { id: 'all', name: 'All', icon: '🛒' },
  { id: 'merch', name: 'Merch', icon: '👕' },
  { id: 'music', name: 'Music', icon: '🎵' },
];

// Featured products (non-artist items for the "Everyday Essentials" section)
const FEATURED = [
  { id: 'feat-1', name: 'Wireless Earbuds Pro', price: 49.99, rating: 4.5, reviews: 2345, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400', artistCut: 10, category: 'electronics' },
  { id: 'feat-2', name: 'Premium Cotton Tee', price: 24.99, rating: 4.7, reviews: 892, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', artistCut: 5, category: 'merch' },
  { id: 'feat-3', name: 'LED Desk Lamp', price: 34.99, rating: 4.3, reviews: 567, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400', artistCut: 7, category: 'home' },
  { id: 'feat-4', name: 'Phone Case - Clear', price: 14.99, rating: 4.6, reviews: 3421, image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400', artistCut: 3, category: 'electronics' },
];

export default function MarketplacePage() {
  const { theme, toggleTheme } = useTheme();
  const { currentTrack, isPlaying, togglePlay } = useAudio();
  const { items, addItem, itemCount } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedToCart, setAddedToCart] = useState<string | null>(null);

  const handleAddToCart = (product: typeof PRODUCTS[0]) => {
    addItem({
      productId: product.id,
      price: product.price,
      name: product.name,
      artist: product.artist,
      image: product.image,
      artistCut: product.artistCut,
    });
    setAddedToCart(product.id);
    setTimeout(() => setAddedToCart(null), 1500);
  };

  // Filter products
  const filteredProducts = selectedCategory === 'all' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[var(--pf-bg-secondary)]">
      {/* Amazon-style Header */}
      <header className="bg-[#131921] text-white sticky top-0 z-50">
        {/* Top Bar */}
        <div className="px-4 py-3 flex items-center gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 shrink-0">
            <span className="text-lg font-bold text-[var(--pf-orange)]">PORTERFUL</span>
          </Link>

          {/* Search */}
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
                <Search size={16} className="text-white" />
              </button>
            </div>
          </div>

          {/* Theme Toggle */}
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-white/10">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Cart */}
          <Link href="/cart" className="relative p-2">
            <ShoppingCart size={22} />
            {itemCount > 0 && (
              <span className="absolute -top-1 right-0 w-5 h-5 bg-[var(--pf-orange)] rounded-full text-xs flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </Link>
        </div>

        {/* Category Bar */}
        <div className="bg-[#232F3E] overflow-x-auto">
          <div className="flex items-center gap-1 px-4 py-2 text-sm whitespace-nowrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1 ${
                  selectedCategory === cat.id 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{cat.icon}</span>
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
            <span>Artist Merch & Music</span>
            <span className="text-sm text-green-400">80% to artists</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-[var(--pf-surface)] rounded-xl overflow-hidden group">
                <Link href={`/product/${product.id}`}>
                  <div className="aspect-square relative">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    {product.category === 'music' && (
                      <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                        🎵 Music
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
                      <Star size={12} className="text-yellow-400 fill-yellow-400" />
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
                        <span className="flex items-center gap-1"><Check size={14} /> Added</span>
                      ) : (
                        <span className="flex items-center gap-1"><Plus size={14} /> Add</span>
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
            <Truck size={20} className="mx-auto mb-1 text-[var(--pf-orange)]" />
            <p className="text-xs font-medium">Free Ship</p>
            <p className="text-[10px] text-[var(--pf-text-muted)]">$50+</p>
          </div>
          <div className="bg-[var(--pf-surface)] rounded-xl p-3 text-center">
            <Shield size={20} className="mx-auto mb-1 text-[var(--pf-orange)]" />
            <p className="text-xs font-medium">Secure</p>
            <p className="text-[10px] text-[var(--pf-text-muted)]">SSL</p>
          </div>
          <div className="bg-[var(--pf-surface)] rounded-xl p-3 text-center">
            <Star size={20} className="mx-auto mb-1 text-[var(--pf-orange)]" />
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
                <div className="text-2xl mb-2">🛒</div>
                <p className="font-medium">Shop</p>
                <p className="text-xs text-[var(--pf-text-muted)]">Same prices</p>
              </div>
              <div>
                <div className="text-2xl mb-2">💜</div>
                <p className="font-medium">Support</p>
                <p className="text-xs text-[var(--pf-text-muted)]">Artists get paid</p>
              </div>
              <div>
                <div className="text-2xl mb-2">✨</div>
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
                <ShoppingCart size={18} />
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
  );
}