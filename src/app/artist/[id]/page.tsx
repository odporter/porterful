'use client';

import { useState, useEffect } from 'react';
import { useSupabase } from '@/app/providers';
import { useAudio } from '@/lib/audio-context';
import Link from 'next/link';
import { Play, Pause, Heart, Share2, Music, Package, Users, DollarSign } from 'lucide-react';

export default function ArtistProfilePage({ params }: { params: { id: string } }) {
  const { supabase } = useSupabase();
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();
  const [activeTab, setActiveTab] = useState<'music' | 'merch' | 'about'>('music');
  const [following, setFollowing] = useState(false);
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // O D Porter's bio as founder
  const artist = {
    name: 'O D Porter',
    bio: `Independent artist and founder of Porterful. Born and raised in New Orleans, I've seen firsthand how the music industry exploits artists—taking the majority of profits while leaving creators with scraps.

After years of watching talented musicians struggle to make a living from their craft, I knew there had to be a better way. That's why I built Porterful—a platform where artists keep 80% of every sale. No label middlemen, no streaming fractions of a penny. Just direct support from fans to creators.

My music is my story—every track comes from lived experience. From the streets of New Orleans to stages across the country, I've been making music that speaks to real life: the struggles, the hustle, the moments that define us.

Porterful isn't just my platform—it's my vision for what the music industry should be. Where artists own their work, fans connect directly with the music they love, and every purchase actually supports the creator.

This is bigger than just another streaming service. This is about ownership. This is about respect. This is about artists getting what they deserve.`,
    shortBio: 'Independent artist and founder of Porterful. Building a platform where artists keep 80% of every sale. New Orleans born, globally raised.',
    genre: 'Hip-Hop, R&B, Soul',
    location: 'New Orleans, LA',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb1614b109?w=400',
    verified: true,
    earnings: 45000,
    supporters: 12500,
    tracks: 100,
    products: 12,
  };

  // Load tracks from Supabase
  useEffect(() => {
    async function loadTracks() {
      if (!supabase) {
        setLoading(false);
        return;
      }
      
      const { data } = await supabase
        .from('tracks')
        .select('*')
        .order('album', { ascending: true })
        .order('created_at', { ascending: false });
      
      if (data) {
        setTracks(data);
      }
      setLoading(false);
    }
    
    loadTracks();
  }, [supabase]);

  // Group tracks by album
  const albums = tracks.reduce((acc: Record<string, any[]>, track: any) => {
    const album = track.album || 'Singles';
    if (!acc[album]) acc[album] = [];
    acc[album].push(track);
    return acc;
  }, {});

  // Album order
  const albumOrder = ['Ambiguous', 'Roxannity', 'One Day', 'From Feast to Famine', 'God Is Good', 'Streets Thought I Left', 'Levi', 'Artgasm', 'Singles'];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="pf-container">
        {/* Hero */}
        <div className="relative mb-8">
          <div className="h-48 md:h-64 rounded-2xl overflow-hidden bg-gradient-to-r from-[var(--pf-orange)]/30 to-purple-600/30">
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--pf-bg)] via-transparent to-transparent" />
          </div>
        </div>

        {/* Artist Info */}
        <div className="relative -mt-24 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Avatar */}
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-[var(--pf-bg)] shadow-xl bg-gradient-to-br from-[var(--pf-orange)] to-purple-600 flex items-center justify-center">
              <span className="text-5xl">🎤</span>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{artist.name}</h1>
                {artist.verified && (
                  <span className="bg-[var(--pf-orange)]/20 text-[var(--pf-orange)] px-2 py-0.5 rounded text-sm font-medium">
                    ✓ Verified Artist
                  </span>
                )}
              </div>
              <p className="text-[var(--pf-text-secondary)] mb-4">
                {artist.genre} • {artist.location}
              </p>
              <p className="text-[var(--pf-text-muted)] max-w-xl">
                {artist.shortBio}
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
                  <p className="text-2xl font-bold">{tracks.length || artist.tracks}</p>
                  <p className="text-sm text-[var(--pf-text-muted)]">Tracks</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 mt-6">
                <button onClick={() => setFollowing(!following)} className={`pf-btn ${following ? 'pf-btn-primary' : 'pf-btn-secondary'}`}>
                  <Heart size={18} className={`inline mr-2 ${following ? 'fill-white' : ''}`} />
                  {following ? 'Following' : 'Follow'}
                </button>
                <Link href="/radio" className="pf-btn pf-btn-primary">
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
            {loading ? (
              <div className="text-center py-12">
                <p className="text-[var(--pf-text-muted)]">Loading tracks...</p>
              </div>
            ) : tracks.length === 0 ? (
              <div className="pf-card p-12 text-center">
                <Music size={48} className="mx-auto mb-4 text-[var(--pf-text-muted)]" />
                <p className="text-[var(--pf-text-muted)]">No tracks yet</p>
              </div>
            ) : (
              <div className="space-y-8">
                {albumOrder.map(albumName => {
                  const albumTracks = albums[albumName];
                  if (!albumTracks || albumTracks.length === 0) return null;
                  
                  return (
                    <div key={albumName}>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">{albumName}</h2>
                        <span className="text-sm text-[var(--pf-text-muted)]">{albumTracks.length} tracks</span>
                      </div>
                      <div className="pf-card overflow-hidden">
                        <div className="divide-y divide-[var(--pf-border)]">
                          {albumTracks.map((track: any, i: number) => (
                            <div key={track.id} className={`flex items-center gap-4 p-4 hover:bg-[var(--pf-surface-hover)] transition-colors group ${currentTrack?.id === track.id ? 'bg-[var(--pf-orange)]/5' : ''}`}>
                              <span className="w-8 text-center text-[var(--pf-text-muted)] font-bold">{i + 1}</span>
                              <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-[var(--pf-surface)] flex items-center justify-center">
                                {track.cover_url ? (
                                  <img src={track.cover_url} alt={track.title} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-2xl">🎵</span>
                                )}
                              </div>
                              <button onClick={() => playTrack(track)} className="w-10 h-10 rounded-full bg-[var(--pf-surface)] flex items-center justify-center group-hover:bg-[var(--pf-orange)] transition-colors shrink-0">
                                {currentTrack?.id === track.id && isPlaying ? (
                                  <Pause size={16} className="text-white" />
                                ) : (
                                  <Play size={16} className="text-white ml-0.5" />
                                )}
                              </button>
                              <div className="flex-1 min-w-0">
                                <p className={`font-semibold truncate ${currentTrack?.id === track.id ? 'text-[var(--pf-orange)]' : ''}`}>{track.title}</p>
                                <p className="text-sm text-[var(--pf-text-muted)]">{track.artist}</p>
                              </div>
                              <span className="text-sm text-[var(--pf-text-muted)] hidden sm:block">
                                {track.play_count ? `${(track.play_count / 1000).toFixed(0)}K plays` : 'New'}
                              </span>
                              <span className="font-bold">${track.proud_to_pay_min || 5}+</span>
                              <button className="p-2 rounded-lg hover:text-red-500 text-[var(--pf-text-muted)] transition-colors">
                                <Heart size={18} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="max-w-3xl">
            <div className="pf-card p-8">
              <h2 className="text-xl font-bold mb-6">About {artist.name}</h2>
              
              <div className="prose prose-invert max-w-none">
                {artist.bio.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="text-[var(--pf-text-secondary)] mb-4">{paragraph}</p>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-[var(--pf-border)]">
                <div className="flex items-center gap-3">
                  <Music className="text-purple-400" size={24} />
                  <div>
                    <p className="text-xl font-bold">{tracks.length || artist.tracks}</p>
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

              <div className="mt-8 pt-8 border-t border-[var(--pf-border)]">
                <h3 className="font-semibold mb-4">Founder's Mission</h3>
                <blockquote className="border-l-4 border-[var(--pf-orange)] pl-4 italic text-[var(--pf-text-secondary)]">
                  "I built Porterful because I was tired of watching artists get pennies while platforms got rich. 
                  Every purchase here puts real money in artists' pockets—80% goes directly to them. 
                  This isn't just a platform, it's a movement. Own your music. Own your worth."
                </blockquote>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'merch' && (
          <div className="pf-card p-12 text-center">
            <Package size={48} className="mx-auto mb-4 text-[var(--pf-text-muted)]" />
            <h3 className="text-xl font-bold mb-2">Merch Coming Soon</h3>
            <p className="text-[var(--pf-text-secondary)]">Artist merchandise will be available here.</p>
            <Link href="/dashboard/upload" className="pf-btn pf-btn-primary mt-4 inline-block">
              Upload Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}