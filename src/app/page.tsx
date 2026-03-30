'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Play, Headphones, Music, Star, Users, DollarSign, Upload, ShoppingCart, Package, Radio, Disc3 } from 'lucide-react';
import { useSupabase } from '@/app/providers';
import { TRACKS } from '@/lib/data';
import { ArtistSearch } from '@/components/ArtistSearch';

export default function Home() {
  const { user } = useSupabase();
  const featuredTracks = TRACKS.slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-[var(--pf-bg)] via-[var(--pf-bg-secondary)] to-[var(--pf-bg)]">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--pf-orange)]/5 via-transparent to-purple-500/5" />
        
        <div className="relative z-10 w-full py-12 md:py-20">
          <div className="pf-container">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              {/* Left - Text */}
              <div className="text-center lg:text-left">
                {/* Signup Banner */}
                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--pf-orange)] text-white rounded-full text-sm font-semibold mb-6 shadow-lg shadow-[var(--pf-orange)]/20">
                  <Star size={16} className="fill-current" />
                  Sign up as an artist — your first 24 hours are on us
                </div>

                {/* Headline */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-5 leading-tight">
                  Where Artists<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--pf-orange)] to-purple-500">
                    Own Everything
                  </span>
                </h1>

                <p className="text-lg md:text-xl text-[var(--pf-text-secondary)] mb-6 max-w-lg mx-auto lg:mx-0">
                  Sell music and merch. Keep <span className="text-[var(--pf-orange)] font-semibold">80%</span> of every sale.
                  No label. No middleman. Just you and your fans.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8">
                  <Link
                    href={user?.user_metadata?.role === 'artist' ? '/dashboard' : '/signup?role=artist'}
                    className="pf-btn pf-btn-primary text-lg px-8 py-3.5 flex items-center justify-center gap-2 shadow-lg shadow-[var(--pf-orange)]/10"
                  >
                    <Star size={18} className="fill-current" />
                    {user?.user_metadata?.role === 'artist' ? 'Go to Dashboard' : 'Start Selling — Free'}
                  </Link>
                  <Link href="/digital" className="pf-btn pf-btn-secondary text-lg px-8 py-3.5 flex items-center justify-center gap-2">
                    <Headphones size={18} />
                    Listen Now
                  </Link>
                </div>

                {/* Stats */}
                <div className="flex gap-8 justify-center lg:justify-start">
                  <div className="text-center lg:text-left">
                    <div className="text-2xl md:text-3xl font-bold text-[var(--pf-orange)]">{TRACKS.length}</div>
                    <div className="text-sm text-[var(--pf-text-muted)]">Tracks</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-2xl md:text-3xl font-bold text-[var(--pf-orange)]">80%</div>
                    <div className="text-sm text-[var(--pf-text-muted)]">To Artists</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-2xl md:text-3xl font-bold text-[var(--pf-orange)]">$0</div>
                    <div className="text-sm text-[var(--pf-text-muted)]">To Start</div>
                  </div>
                </div>
              </div>

              {/* Right - Image + Album Grid */}
              <div className="relative">
                {/* Background glow */}
                <div className="absolute -inset-4 bg-gradient-to-br from-[var(--pf-orange)]/10 via-transparent to-purple-500/10 blur-3xl rounded-3xl" />
                
                {/* Main image - person listening to music */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-4 aspect-[4/3]">
                  <Image
                    src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80"
                    alt="Artist and fan listening to music"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center"
                    priority
                  />
                  {/* Dark overlay at bottom for text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {/* Caption overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white text-sm font-medium drop-shadow-lg">
                      🎧 Independent music, direct to fans
                    </p>
                  </div>
                </div>

                {/* Floating album art cards */}
                <div className="absolute -top-4 -right-4 md:-right-8 grid grid-cols-2 gap-3">
                  {[
                    TRACKS.find(t => t.album === 'Ambiguous'),
                    TRACKS.find(t => t.album === 'From Feast to Famine'),
                  ].filter(Boolean).map((track, i) => (
                    <Link key={track!.id} href={`/album/${track!.album.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden shadow-xl shadow-black/30 border-2 border-white/10 relative">
                      <Image
                        src={track!.image}
                        alt={track!.album || ''}
                        fill
                        sizes="96px"
                        className="object-cover hover:scale-105 transition-transform"
                      />
                    </Link>
                  ))}
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-3 -left-4 md:-left-8 bg-[var(--pf-surface)] border border-[var(--pf-border)] rounded-2xl px-4 py-3 shadow-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Headphones size={14} className="text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs text-[var(--pf-text-muted)]">Now Streaming</p>
                      <p className="text-sm font-semibold text-[var(--pf-text)]">{TRACKS.length}+ tracks</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* How It Works */}
      <section className="py-16 md:py-24 bg-[var(--pf-bg-secondary)]">
        <div className="pf-container">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            For Artists, <span className="text-[var(--pf-orange)]">By Artists</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-[var(--pf-bg)] rounded-2xl p-6 border border-[var(--pf-border)] hover:border-[var(--pf-orange)] transition-colors">
              <div className="w-14 h-14 rounded-xl bg-[var(--pf-orange)]/10 flex items-center justify-center mb-4">
                <Music className="text-[var(--pf-orange)]" size={28} />
              </div>
              <h3 className="text-lg font-bold mb-2">Upload Your Music</h3>
              <p className="text-[var(--pf-text-secondary)] text-sm">
                Upload tracks, set your price. Fans can buy individual songs or tip more to support.
              </p>
            </div>
            
            <div className="bg-[var(--pf-bg)] rounded-2xl p-6 border border-[var(--pf-border)] hover:border-[var(--pf-orange)] transition-colors">
              <div className="w-14 h-14 rounded-xl bg-[var(--pf-orange)]/10 flex items-center justify-center mb-4">
                <Package className="text-[var(--pf-orange)]" size={28} />
              </div>
              <h3 className="text-lg font-bold mb-2">Sell Your Merch</h3>
              <p className="text-[var(--pf-text-secondary)] text-sm">
                Connect Printful or submit designs. We handle printing and shipping. You keep the profit.
              </p>
            </div>
            
            <div className="bg-[var(--pf-bg)] rounded-2xl p-6 border border-[var(--pf-border)] hover:border-[var(--pf-orange)] transition-colors">
              <div className="w-14 h-14 rounded-xl bg-[var(--pf-orange)]/10 flex items-center justify-center mb-4">
                <DollarSign className="text-[var(--pf-orange)]" size={28} />
              </div>
              <h3 className="text-lg font-bold mb-2">Earn 80%</h3>
              <p className="text-[var(--pf-text-secondary)] text-sm">
                No label taking 90%. You keep 80% of every sale. Platform takes 10%, artists fund gets 10%.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Superfan Section */}
      <section className="py-16 md:py-24 bg-[var(--pf-bg)]">
        <div className="pf-container">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-[var(--pf-orange)]/10 via-purple-500/5 to-[var(--pf-bg)] rounded-3xl p-8 md:p-12 border border-[var(--pf-border)]">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--pf-orange)]/20 border border-[var(--pf-orange)]/30 rounded-full text-[var(--pf-orange)] text-sm font-medium mb-4">
                  <span className="text-lg">⭐</span>
                  New: Superfan Program
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Become a <span className="text-[var(--pf-orange)]">Superfan</span>
                </h2>
                <p className="text-[var(--pf-text-secondary)] text-lg max-w-2xl mx-auto">
                  Earn rewards when your favorite artists succeed. Share your link, fans buy, you earn.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-[var(--pf-bg)]/50 rounded-xl p-6 text-center">
                  <div className="text-3xl mb-3">🎁</div>
                  <h3 className="font-bold mb-2">Earn Rewards</h3>
                  <p className="text-sm text-[var(--pf-text-secondary)]">Get 3% of every sale made through your unique Superfan link</p>
                </div>
                <div className="bg-[var(--pf-bg)]/50 rounded-xl p-6 text-center">
                  <div className="text-3xl mb-3">👑</div>
                  <h3 className="font-bold mb-2">Exclusive Access</h3>
                  <p className="text-sm text-[var(--pf-text-secondary)]">Unlock special badges, early drops, and behind-the-scenes content</p>
                </div>
                <div className="bg-[var(--pf-bg)]/50 rounded-xl p-6 text-center">
                  <div className="text-3xl mb-3">💫</div>
                  <h3 className="font-bold mb-2">Support Artists</h3>
                  <p className="text-sm text-[var(--pf-text-secondary)]">Your success directly funds the artists you love</p>
                </div>
              </div>
              
              <div className="text-center">
                <Link href="/superfan" className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--pf-orange)] text-white rounded-xl font-bold hover:bg-[var(--pf-orange)]/90 transition-colors">
                  Join the Superfan Program
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Artist */}
      <section className="py-16 md:py-24 bg-[var(--pf-bg)]">
        <div className="pf-container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">
              Featured Artist
            </h2>
            <Link href="/artist/od-porter" className="text-[var(--pf-orange)] hover:underline text-sm font-medium">
              View Profile →
            </Link>
          </div>
          
          <div className="bg-gradient-to-br from-[var(--pf-orange)]/10 to-purple-500/10 rounded-2xl overflow-hidden border border-[var(--pf-border)]">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Artist Info */}
              <div className="p-6 md:p-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--pf-orange)] to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                    O
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold">O D Porter</h3>
                      <span className="text-blue-400">✓</span>
                    </div>
                    <p className="text-sm text-[var(--pf-text-secondary)]">St. Louis, MO</p>
                  </div>
                </div>
                
                <p className="text-[var(--pf-text-secondary)] mb-6">
                  Independent artist and founder. Born in Miami, raised in NOLA & STL. 
                  Building a platform where artists own everything.
                </p>
                
                <div className="flex gap-4 mb-6">
                  <div>
                    <div className="text-2xl font-bold text-[var(--pf-orange)]">{TRACKS.length}</div>
                    <div className="text-xs text-[var(--pf-text-muted)]">Tracks</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[var(--pf-orange)]">{new Set(TRACKS.map(t => t.album)).size}</div>
                    <div className="text-xs text-[var(--pf-text-muted)]">Albums</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[var(--pf-orange)]">12K+</div>
                    <div className="text-xs text-[var(--pf-text-muted)]">Listeners</div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Link href="/artist/od-porter" className="pf-btn pf-btn-primary">
                    <Users size={18} className="mr-2" />
                    Follow Artist
                  </Link>
                  <Link href="/digital" className="pf-btn pf-btn-secondary">
                    <Play size={18} className="mr-2" />
                    Play Music
                  </Link>
                </div>
              </div>
              
              {/* Latest Releases */}
              <div className="p-6 md:p-10 bg-[var(--pf-surface)]">
                <h4 className="text-sm font-semibold text-[var(--pf-text-muted)] mb-4">LATEST RELEASES</h4>
                <div className="space-y-3">
                  {featuredTracks.slice(0, 5).map(track => (
                    <Link 
                      key={track.id}
                      href={`/artist/od-porter`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--pf-bg)] transition-colors group"
                    >
                      <div className="w-12 h-12 rounded relative shrink-0">
                        <Image src={track.image} alt={track.title} fill sizes="48px" className="object-cover rounded" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate group-hover:text-[var(--pf-orange)] transition-colors">
                          {track.title}
                        </p>
                        <p className="text-sm text-[var(--pf-text-muted)] truncate hover:text-[var(--pf-orange)]">{track.artist}</p>
                      </div>
                      <span className="text-xs text-[var(--pf-text-muted)]">${track.price}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 md:py-24 bg-[var(--pf-bg-secondary)]">
        <div className="pf-container">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Explore Porterful
          </h2>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/digital" className="group bg-[var(--pf-bg)] rounded-xl p-6 border border-[var(--pf-border)] hover:border-[var(--pf-orange)] transition-colors">
              <div className="w-12 h-12 rounded-lg bg-[var(--pf-orange)]/10 flex items-center justify-center mb-4 group-hover:bg-[var(--pf-orange)]/20 transition-colors">
                <Music size={24} className="text-[var(--pf-orange)]" />
              </div>
              <h3 className="font-bold mb-1">Music</h3>
              <p className="text-sm text-[var(--pf-text-secondary)]">Stream and buy tracks</p>
            </Link>
            
            <Link href="/marketplace" className="group bg-[var(--pf-bg)] rounded-xl p-6 border border-[var(--pf-border)] hover:border-[var(--pf-orange)] transition-colors">
              <div className="w-12 h-12 rounded-lg bg-[var(--pf-orange)]/10 flex items-center justify-center mb-4 group-hover:bg-[var(--pf-orange)]/20 transition-colors">
                <ShoppingCart size={24} className="text-[var(--pf-orange)]" />
              </div>
              <h3 className="font-bold mb-1">Marketplace</h3>
              <p className="text-sm text-[var(--pf-text-secondary)]">Merch and products</p>
            </Link>
            
            <Link href="/radio" className="group bg-[var(--pf-bg)] rounded-xl p-6 border border-[var(--pf-border)] hover:border-[var(--pf-orange)] transition-colors">
              <div className="w-12 h-12 rounded-lg bg-[var(--pf-orange)]/10 flex items-center justify-center mb-4 group-hover:bg-[var(--pf-orange)]/20 transition-colors">
                <Radio size={24} className="text-[var(--pf-orange)]" />
              </div>
              <h3 className="font-bold mb-1">Radio</h3>
              <p className="text-sm text-[var(--pf-text-secondary)]">24/7 streaming</p>
            </Link>
            
            <Link href="/playlists" className="group bg-[var(--pf-bg)] rounded-xl p-6 border border-[var(--pf-border)] hover:border-[var(--pf-orange)] transition-colors">
              <div className="w-12 h-12 rounded-lg bg-[var(--pf-orange)]/10 flex items-center justify-center mb-4 group-hover:bg-[var(--pf-orange)]/20 transition-colors">
                <Disc3 size={24} className="text-[var(--pf-orange)]" />
              </div>
              <h3 className="font-bold mb-1">Playlists</h3>
              <p className="text-sm text-[var(--pf-text-secondary)]">Curated collections</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[var(--pf-orange)] to-purple-600">
        <div className="pf-container text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
            Ready to Own Your Music?
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Join Porterful as an artist. Upload your music, sell merch, and keep 80% of everything.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup?role=artist" className="px-8 py-4 bg-white text-[var(--pf-orange)] rounded-xl font-bold hover:bg-gray-100 transition-colors">
              Start as Artist
            </Link>
            <Link href="/digital" className="px-8 py-4 bg-white/10 text-white border border-white/30 rounded-xl font-bold hover:bg-white/20 transition-colors">
              Browse Music
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}