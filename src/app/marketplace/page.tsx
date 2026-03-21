'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Music, Headphones, Star, Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { useSupabase } from '@/app/providers';
import { useAudio } from '@/lib/audio-context';

interface Product {
  id: string;
  name: string;
  artist?: string;
  price: number;
  description?: string;
  image: string;
  category: string;
  sales?: number;
}

interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  cover_url?: string;
  audio_url?: string;
  play_count?: number;
}

const DEMO_PRODUCTS: Product[] = [
  { id: '1', name: 'Ambiguous Tour Tee', artist: 'O D Porter', price: 28, category: 'merch', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', sales: 142 },
  { id: '2', name: 'Ambiguous Hoodie', artist: 'O D Porter', price: 65, category: 'merch', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500', sales: 78 },
  { id: '3', name: 'Premium Phone Case', price: 25, category: 'essentials', image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500', sales: 234 },
];

export default function MarketplacePage() {
  const { supabase } = useSupabase();
  const { currentTrack, isPlaying, playTrack, togglePlay, playNext, playPrev, queue, setQueue } = useAudio();
  const [featuredTracks, setFeaturedTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  // Load featured artist tracks
  useEffect(() => {
    async function loadTracks() {
      if (!supabase) {
        setLoading(false);
        return;
      }
      
      const { data } = await supabase
        .from('tracks')
        .select('*')
        .order('play_count', { ascending: false })
        .limit(10);
      
      if (data && data.length > 0) {
        setFeaturedTracks(data);
        setQueue(data);
      }
      setLoading(false);
    }
    
    loadTracks();
  }, [supabase, setQueue]);

  const handleListenNow = () => {
    if (featuredTracks.length > 0) {
      playTrack(featuredTracks[0]);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--pf-bg)] pb-32">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-b from-[var(--pf-orange)]/10 to-transparent">
        <div className="pf-container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Shop, Stream, Support
            </h1>
            <p className="text-xl text-[var(--pf-text-secondary)] mb-8">
              Every purchase puts money in artists' pockets. From merch to everyday essentials.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-[var(--pf-surface)] px-4 py-2 rounded-full">
                <span className="text-[var(--pf-orange)] font-bold">80%</span>
                <span className="text-[var(--pf-text-secondary)]">to artists on merch</span>
              </div>
              <div className="flex items-center gap-2 bg-[var(--pf-surface)] px-4 py-2 rounded-full">
                <span className="text-purple-400 font-bold">20%</span>
                <span className="text-[var(--pf-text-secondary)]">to artists from marketplace</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Artist */}
      <section className="py-12">
        <div className="pf-container">
          <div className="pf-card p-8 bg-gradient-to-r from-[var(--pf-orange)]/5 to-purple-500/5">
            <div className="grid md:grid-cols-[200px_1fr] gap-8 items-center">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-[var(--pf-orange)] to-purple-600 flex items-center justify-center">
                <span className="text-6xl">🎤</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-3xl font-bold">O D Porter</h2>
                  <span className="bg-[var(--pf-orange)]/20 text-[var(--pf-orange)] px-2 py-0.5 rounded text-sm font-medium">
                    ✓ Verified Artist
                  </span>
                </div>
                <p className="text-[var(--pf-text-secondary)] mb-2">Hip-Hop, R&B, Soul • New Orleans, LA</p>
                <p className="text-[var(--pf-text-muted)] mb-4">
                  Independent artist and founder of Porterful. 100 tracks, 8 albums, building a platform where artists own everything.
                </p>
                <div className="flex items-center gap-6 text-sm mb-6">
                  <div>
                    <span className="text-2xl font-bold text-[var(--pf-orange)]">$45,000+</span>
                    <span className="text-[var(--pf-text-muted)] ml-1">earned</span>
                  </div>
                  <div>
                    <span className="text-2xl font-bold">12,500+</span>
                    <span className="text-[var(--pf-text-muted)] ml-1">supporters</span>
                  </div>
                  <div>
                    <span className="text-2xl font-bold">100</span>
                    <span className="text-[var(--pf-text-muted)] ml-1">tracks</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={handleListenNow}
                    className="pf-btn pf-btn-primary flex items-center gap-2"
                  >
                    {isPlaying && currentTrack ? (
                      <>
                        <Pause size={18} />
                        Now Playing
                      </>
                    ) : (
                      <>
                        <Play size={18} />
                        Listen Now
                      </>
                    )}
                  </button>
                  <Link href="/artist/od-porter" className="pf-btn pf-btn-secondary">
                    View Profile
                  </Link>
                </div>
              </div>
            </div>

            {/* Mini player when playing */}
            {isPlaying && currentTrack && (
              <div className="mt-6 pt-6 border-t border-[var(--pf-border)]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-[var(--pf-surface)] flex items-center justify-center shrink-0">
                    {currentTrack.cover_url ? (
                      <img src={currentTrack.cover_url} alt={currentTrack.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl">🎵</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{currentTrack.title}</p>
                    <p className="text-sm text-[var(--pf-text-muted)]">{currentTrack.artist}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={playPrev} className="p-2 rounded-full hover:bg-[var(--pf-surface)]">
                      <SkipBack size={18} />
                    </button>
                    <button onClick={togglePlay} className="w-10 h-10 rounded-full bg-[var(--pf-orange)] flex items-center justify-center">
                      <Pause size={18} className="text-white" />
                    </button>
                    <button onClick={playNext} className="p-2 rounded-full hover:bg-[var(--pf-surface)]">
                      <SkipForward size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Artist Merch */}
      <section className="py-12">
        <div className="pf-container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Artist Merch</h2>
              <p className="text-[var(--pf-text-secondary)]">Direct from O D Porter. 80% goes to the artist.</p>
            </div>
            <Link href="/store" className="text-[var(--pf-orange)] hover:underline">
              View all →
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DEMO_PRODUCTS.slice(0, 4).map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="pf-card group overflow-hidden"
              >
                <div className="aspect-square bg-[var(--pf-surface)] overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold group-hover:text-[var(--pf-orange)] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-[var(--pf-text-muted)]">
                    {product.artist}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold">${product.price}</span>
                    <span className="text-xs text-green-400">80% to artist</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Tracks */}
      <section className="py-12 bg-[var(--pf-bg-secondary)]">
        <div className="pf-container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Top Tracks</h2>
              <p className="text-[var(--pf-text-secondary)]">Pay what you want. Artists keep 80%.</p>
            </div>
            <Link href="/radio" className="pf-btn pf-btn-secondary">
              <Headphones className="inline mr-2" size={16} />
              Open Radio
            </Link>
          </div>

          {loading ? (
            <div className="pf-card p-8 text-center">
              <p className="text-[var(--pf-text-muted)]">Loading tracks...</p>
            </div>
          ) : featuredTracks.length === 0 ? (
            <div className="pf-card p-8 text-center">
              <Music size={48} className="mx-auto mb-4 text-[var(--pf-text-muted)]" />
              <p className="text-[var(--pf-text-muted)]">No tracks yet</p>
            </div>
          ) : (
            <div className="pf-card overflow-hidden">
              <div className="divide-y divide-[var(--pf-border)]">
                {featuredTracks.slice(0, 5).map((track, i) => (
                  <div key={track.id} className={`flex items-center gap-4 p-4 hover:bg-[var(--pf-surface-hover)] transition-colors group ${currentTrack?.id === track.id ? 'bg-[var(--pf-orange)]/5' : ''}`}>
                    <span className="w-8 text-center text-[var(--pf-text-muted)] font-bold">{i + 1}</span>
                    <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-[var(--pf-surface)] flex items-center justify-center">
                      {track.cover_url ? (
                        <img src={track.cover_url} alt={track.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl">🎵</span>
                      )}
                    </div>
                    <button 
                      onClick={() => playTrack(track)}
                      className="w-10 h-10 rounded-full bg-[var(--pf-surface)] flex items-center justify-center group-hover:bg-[var(--pf-orange)] transition-colors shrink-0"
                    >
                      {currentTrack?.id === track.id && isPlaying ? (
                        <Pause size={16} className="text-white" />
                      ) : (
                        <Play size={16} className="text-white ml-0.5" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold truncate ${currentTrack?.id === track.id ? 'text-[var(--pf-orange)]' : ''}`}>
                        {track.title}
                      </p>
                      <p className="text-sm text-[var(--pf-text-muted)]">{track.artist}</p>
                    </div>
                    <span className="text-sm text-[var(--pf-text-muted)] hidden sm:block">
                      {track.play_count ? `${(track.play_count / 1000).toFixed(0)}K plays` : 'New'}
                    </span>
                    <span className="font-bold">$5+</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Everyday Essentials */}
      <section className="py-12">
        <div className="pf-container">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">Everyday Essentials</h2>
            <p className="text-[var(--pf-text-secondary)]">
              Buy what you need. 20% goes to artists. Same prices as anywhere else.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DEMO_PRODUCTS.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="pf-card group"
              >
                <div className="aspect-square bg-[var(--pf-surface)] overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm truncate">{product.name}</h3>
                  <p className="text-xs text-[var(--pf-text-muted)]">{product.category}</p>
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
  );
}