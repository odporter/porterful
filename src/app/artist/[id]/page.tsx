'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Play, Heart, Share2, Music, Package, Users, DollarSign } from 'lucide-react';
import { TRACKS, ARTISTS, PRODUCTS } from '@/lib/data';

export default function ArtistProfilePage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<'music' | 'merch' | 'about'>('music');
  const [following, setFollowing] = useState(false);

  const artist = ARTISTS[0];
  const tracks = TRACKS;
  const merchProducts = PRODUCTS.filter(p => p.artist === artist.name);

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="pf-container">
        {/* Hero */}
        <div className="relative mb-8">
          <div className="h-48 md:h-64 rounded-2xl overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1493225457124-a3eb1614b109?w=1200"
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--pf-bg)] via-transparent to-transparent" />
          </div>
        </div>

        {/* Artist Info */}
        <div className="relative -mt-24 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Avatar */}
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-[var(--pf-bg)] shadow-xl">
              <img 
                src={artist.image}
                alt={artist.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{artist.name}</h1>
                {artist.verified && (
                  <span className="bg-[var(--pf-orange)]/20 text-[var(--pf-orange)] px-2 py-0.5 rounded text-sm font-medium">
                    ✓ Verified
                  </span>
                )}
              </div>
              <p className="text-[var(--pf-text-secondary)] mb-4">
                {artist.genre} • {artist.location}
              </p>
              <p className="text-[var(--pf-text-muted)] max-w-xl">
                {artist.bio}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-6 mt-4">
                <div>
                  <p className="text-2xl font-bold text-[var(--pf-orange)]">${artist.earnings.toLocaleString()}</p>
                  <p className="text-sm text-[var(--pf-text-muted)]">Earned</p>
                </div>
                <div className="w-px h-8 bg-[var(--pf-border)]" />
                <div>
                  <p className="text-2xl font-bold">{artist.supporters.toLocaleString()}</p>
                  <p className="text-sm text-[var(--pf-text-muted)]">Supporters</p>
                </div>
                <div className="w-px h-8 bg-[var(--pf-border)]" />
                <div>
                  <p className="text-2xl font-bold">{artist.tracks}</p>
                  <p className="text-sm text-[var(--pf-text-muted)]">Tracks</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 mt-6">
                <button 
                  onClick={() => setFollowing(!following)}
                  className={`pf-btn ${following ? 'pf-btn-primary' : 'pf-btn-secondary'}`}
                >
                  <Heart 
                    size={18} 
                    className={`inline mr-2 ${following ? 'fill-white' : ''}`}
                  />
                  {following ? 'Following' : 'Follow'}
                </button>
                <Link href="/digital" className="pf-btn pf-btn-primary">
                  <Play size={18} className="inline mr-2" />
                  Play All
                </Link>
                <button className="pf-btn pf-btn-secondary">
                  <Share2 size={18} className="inline mr-2" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-[var(--pf-border)] mb-8">
          <div className="flex gap-8">
            {(['music', 'merch', 'about'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 font-semibold transition-colors capitalize ${
                  activeTab === tab
                    ? 'text-[var(--pf-orange)] border-b-2 border-[var(--pf-orange)]'
                    : 'text-[var(--pf-text-muted)] hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'music' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Music ({tracks.length})</h2>
              <Link href="/digital" className="text-[var(--pf-orange)] hover:underline">
                View all releases
              </Link>
            </div>
            <div className="pf-card overflow-hidden">
              <div className="divide-y divide-[var(--pf-border)]">
                {tracks.map((track, i) => (
                  <div key={track.id} className="flex items-center gap-4 p-4 hover:bg-[var(--pf-surface-hover)] transition-colors group">
                    <span className="w-8 text-center text-[var(--pf-text-muted)] font-bold">{i + 1}</span>
                    <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0">
                      <img src={track.image} alt={track.title} className="w-full h-full object-cover" />
                    </div>
                    <button className="w-10 h-10 rounded-full bg-[var(--pf-surface)] flex items-center justify-center group-hover:bg-[var(--pf-orange)] transition-colors shrink-0">
                      <Play size={16} className="text-white ml-0.5" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{track.title}</p>
                      <p className="text-sm text-[var(--pf-text-muted)]">{track.album}</p>
                    </div>
                    <span className="text-sm text-[var(--pf-text-muted)] hidden sm:block">
                      {(track.plays / 1000).toFixed(0)}K plays
                    </span>
                    <span className="text-sm text-[var(--pf-text-muted)]">{track.duration}</span>
                    <span className="font-bold">${track.price}+</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'merch' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Merch ({merchProducts.length})</h2>
              <Link href="/marketplace" className="text-[var(--pf-orange)] hover:underline">
                View all products
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {merchProducts.map((product) => (
                <Link key={product.id} href={`/product/${product.id}`} className="pf-card group overflow-hidden">
                  <div className="aspect-square bg-[var(--pf-surface)] overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold group-hover:text-[var(--pf-orange)] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-[var(--pf-text-muted)]">{product.type}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-lg font-bold">${product.price}</span>
                      <span className="text-xs text-green-400">${(product.artistCut).toFixed(2)} to artist</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="max-w-2xl">
            <div className="pf-card p-8">
              <h2 className="text-xl font-bold mb-4">About {artist.name}</h2>
              <p className="text-[var(--pf-text-secondary)] mb-6">
                {artist.bio}
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Location</h3>
                  <p className="text-[var(--pf-text-muted)]">{artist.location}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Genre</h3>
                  <p className="text-[var(--pf-text-muted)]">{artist.genre}</p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-[var(--pf-border)]">
                <h3 className="font-semibold mb-4">Stats</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <Music className="text-purple-400" size={24} />
                    <div>
                      <p className="text-xl font-bold">{artist.tracks}</p>
                      <p className="text-sm text-[var(--pf-text-muted)]">Tracks</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="text-blue-400" size={24} />
                    <div>
                      <p className="text-xl font-bold">{artist.supporters.toLocaleString()}</p>
                      <p className="text-sm text-[var(--pf-text-muted)]">Supporters</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSign className="text-green-400" size={24} />
                    <div>
                      <p className="text-xl font-bold">${artist.earnings.toLocaleString()}</p>
                      <p className="text-sm text-[var(--pf-text-muted)]">Earned</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Package className="text-[var(--pf-orange)]" size={24} />
                    <div>
                      <p className="text-xl font-bold">{artist.products}</p>
                      <p className="text-sm text-[var(--pf-text-muted)]">Products</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}