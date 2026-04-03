'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Play, Headphones, Music, Star, Users, ArrowRight, Heart, ChevronDown, Zap, Shield, TrendingUp, Pause, SkipForward, Crown } from 'lucide-react'
import { useSupabase } from '@/app/providers'
import { TRACKS } from '@/lib/data'
import { ARTISTS } from '@/lib/artists'
import { FEATURED_PRODUCTS } from '@/lib/products'
import { useAudio, Track } from '@/lib/audio-context'
import { EmailCapture } from '@/components/EmailCapture'

const HERO_BG_IMAGES = [
  '/images/hero/ai-bg-1.png',
  '/images/hero/ai-bg-2.png',
  '/images/hero/ai-bg-3.png',
]

// Alphabetical artists, Od at the end
const PLATFORM_ARTISTS = ARTISTS.filter(a => ['gune', 'nikee-turbo', 'rob-soule', 'od-porter'].includes(a.id))
  .sort((a, b) => {
    if (a.id === 'od-porter') return 1;
    if (b.id === 'od-porter') return -1;
    return a.name.localeCompare(b.name);
  });

// All tracks shuffled for the hero player
const HERO_TRACKS = (TRACKS.filter(t =>
  ['O D Porter', 'Gune', 'Nikee Turbo', 'Rob Soule'].includes(t.artist)
).sort(() => Math.random() - 0.5) as unknown as Track[]);

export default function MusicPage() {
  const { user } = useSupabase();
  const { currentTrack: audioTrack, isPlaying, playTrack } = useAudio();
  const [showWhyModal, setShowWhyModal] = useState(false);
  const [heroBgIndex, setHeroBgIndex] = useState(0);
  const [heroTrackIndex, setHeroTrackIndex] = useState(0);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const trackIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isHeroPlaying = audioTrack && HERO_TRACKS.some(t => t.id === audioTrack.id);

  useEffect(() => {
    if (isHeroPlaying) return;
    trackIntervalRef.current = setInterval(() => {
      setHeroTrackIndex(i => (i + 1) % HERO_TRACKS.length);
    }, 9000);
    return () => { if (trackIntervalRef.current) clearInterval(trackIntervalRef.current); };
  }, [isHeroPlaying]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const howItWorksEl = howItWorksRef.current;
      if (!howItWorksEl) return;
      const sectionTop = howItWorksEl.getBoundingClientRect().top + window.scrollY;
      const sectionHeight = howItWorksEl.offsetHeight;
      if (scrollY > sectionTop + sectionHeight * 0.3) setHeroBgIndex(1);
      if (scrollY > sectionTop + sectionHeight * 0.8) setHeroBgIndex(2);
      if (scrollY < sectionTop) setHeroBgIndex(0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentTrack = HERO_TRACKS[heroTrackIndex] as Track;

  return (
    <div className="min-h-screen">

      {/* WHY MODAL */}
      {showWhyModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm overflow-y-auto" onClick={() => setShowWhyModal(false)}>
          <div className="min-h-screen py-12 px-4 flex items-start justify-center" onClick={e => e.stopPropagation()}>
            <div className="bg-[var(--pf-bg)] border border-[var(--pf-border)] rounded-2xl max-w-2xl w-full p-8 relative">
              <button onClick={() => setShowWhyModal(false)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[var(--pf-surface)] border border-[var(--pf-border)] flex items-center justify-center hover:border-[var(--pf-orange)] transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
              <h2 className="text-3xl font-bold mb-4">Why Porterful Exists</h2>
              <div className="space-y-4 text-[var(--pf-text-secondary)]">
                <p>Streaming platforms take 70-85% of what artists earn. We think that&apos;s wrong.</p>
                <p>Porterful was built on a simple idea: artists should own their work, keep most of what they make, and connect directly with the people who love it.</p>
                <p>No label contracts. No hidden fees. No algorithmic gatekeepers deciding who gets heard.</p>
                <p>Just music, merch, and the fans who make it possible.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-xl border-b border-[var(--pf-border)]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-black tracking-tight">PORTERFUL</Link>
            <div className="hidden md:flex items-center gap-6 text-sm">
              <Link href="/music" className="text-[var(--pf-orange)] font-medium">Music</Link>
              <Link href="/marketplace" className="text-[var(--pf-text-secondary)] hover:text-white transition-colors">Shop</Link>
              <Link href="/radio" className="text-[var(--pf-text-secondary)] hover:text-white transition-colors">Radio</Link>
              <Link href="/competition" className="text-[var(--pf-text-secondary)] hover:text-white transition-colors">$10K Competition</Link>
              <Link href="/support" className="text-[var(--pf-text-secondary)] hover:text-white transition-colors">Support</Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <Link href="/dashboard" className="px-4 py-2 text-sm font-medium bg-[var(--pf-surface)] rounded-full hover:border-[var(--pf-orange)] border border-transparent transition-colors">Dashboard</Link>
            ) : (
              <>
                <Link href="/login" className="px-4 py-2 text-sm font-medium text-[var(--pf-text-secondary)] hover:text-white transition-colors">Log In</Link>
                <Link href="/signup" className="px-4 py-2 text-sm font-medium bg-[var(--pf-orange)] text-black rounded-full hover:bg-[var(--pf-orange)]/90 transition-colors">Sign Up Free</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black/90" />
          <div
            className="absolute inset-0 opacity-30 transition-opacity duration-1000"
            style={{
              backgroundImage: `url(${HERO_BG_IMAGES[heroBgIndex]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(60px)',
              transform: 'scale(1.2)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--pf-orange)]/10 border border-[var(--pf-orange)]/30 text-[var(--pf-orange)] text-xs font-bold tracking-widest uppercase mb-8">
            <Crown size={12} />
            The Artist Economy
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Stream Music.<br />
            <span className="text-[var(--pf-orange)]">Own Everything.</span>
          </h1>
          <p className="text-xl text-[var(--pf-text-secondary)] mb-10 max-w-2xl mx-auto">
            No labels. No middlemen. 80% of every sale goes directly to artists. This is music as it should be.
          </p>

          {/* Hero Track */}
          {currentTrack && (
            <div className="flex items-center justify-center gap-4 mb-10">
              <div className="flex items-center gap-4 bg-[var(--pf-surface)]/50 backdrop-blur-sm rounded-2xl px-6 py-4 border border-[var(--pf-border)]">
                <button
                  onClick={() => playTrack(currentTrack)}
                  className="w-12 h-12 rounded-full bg-[var(--pf-orange)] hover:bg-[var(--pf-orange)]/80 flex items-center justify-center transition-colors"
                >
                  {isHeroPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" className="ml-1" />}
                </button>
                <div className="text-left">
                  <p className="font-bold text-sm">{currentTrack.title}</p>
                  <p className="text-xs text-[var(--pf-text-secondary)]">{currentTrack.artist}</p>
                </div>
                <button
                  onClick={() => setHeroTrackIndex(i => (i + 1) % HERO_TRACKS.length)}
                  className="p-2 text-[var(--pf-text-secondary)] hover:text-white transition-colors"
                >
                  <SkipForward size={18} />
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup?role=artist" className="px-8 py-4 bg-[var(--pf-orange)] text-black font-bold rounded-full hover:bg-[var(--pf-orange)]/90 transition-colors flex items-center gap-2">
              Start Creating <ArrowRight size={18} />
            </Link>
            <button onClick={() => setShowWhyModal(false)} className="px-8 py-4 text-sm font-medium text-[var(--pf-text-secondary)] hover:text-white transition-colors">
              How it works →
            </button>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <ChevronDown size={24} className="text-[var(--pf-text-secondary)]" />
        </div>
      </section>

      {/* PLATFORM STATS */}
      <section className="py-16 border-y border-[var(--pf-border)] bg-[var(--pf-bg-secondary)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Artists', value: '4', icon: Music },
              { label: 'Tracks', value: '100+', icon: Headphones },
              { label: 'Revenue Share', value: '80%', icon: TrendingUp },
              { label: 'Superfan Earners', value: '12', icon: Users },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <Icon size={24} className="text-[var(--pf-orange)] mb-1" />
                <span className="text-3xl md:text-4xl font-black">{value}</span>
                <span className="text-sm text-[var(--pf-text-secondary)]">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section ref={howItWorksRef} className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">How Porterful Works</h2>
            <p className="text-[var(--pf-text-secondary)]">Simple. Fair. Built for artists.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Upload Your Music',
                desc: 'Drop your tracks. Set your prices. Your page is live in minutes.',
                icon: Music,
              },
              {
                step: '02',
                title: 'Fans Buy Direct',
                desc: 'Listeners purchase tracks, albums, or merch. Payment processes instantly.',
                icon: Heart,
              },
              {
                step: '03',
                title: 'You Keep 80%',
                desc: '80% of every sale. Deposited to your wallet. Withdraw anytime.',
                icon: Zap,
              },
            ].map(({ step, title, desc, icon: Icon }) => (
              <div key={step} className="bg-[var(--pf-surface)]/30 rounded-2xl p-6 border border-[var(--pf-border)] hover:border-[var(--pf-orange)]/30 transition-colors group">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-[var(--pf-orange)] tracking-widest">{step}</span>
                  <Icon size={20} className="text-[var(--pf-text-secondary)] group-hover:text-[var(--pf-orange)] transition-colors" />
                </div>
                <h3 className="text-lg font-bold mb-2">{title}</h3>
                <p className="text-sm text-[var(--pf-text-secondary)]">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-[var(--pf-orange)]/10 border border-[var(--pf-orange)]/30 rounded-2xl p-6 text-center">
            <p className="text-sm text-[var(--pf-text-secondary)] mb-2">Average artist keeps</p>
            <p className="text-4xl font-black text-[var(--pf-orange)]">$0.80</p>
            <p className="text-xs text-[var(--pf-text-secondary)] mt-1">of every dollar. Always.</p>
          </div>
        </div>
      </section>

      {/* FEATURED TRACKS */}
      <section className="py-24 px-6 bg-[var(--pf-bg-secondary)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-black">Featured Tracks</h2>
            <Link href="/digital" className="text-sm font-medium text-[var(--pf-orange)] hover:text-[var(--pf-orange)]/80 transition-colors">View All →</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {HERO_TRACKS.slice(0, 6).map(track => (
              <div key={track.id} className="bg-[var(--pf-surface)]/50 rounded-xl p-4 border border-[var(--pf-border)] hover:border-[var(--pf-orange)]/30 transition-all group">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => playTrack(track)}
                    className="w-12 h-12 rounded-lg bg-[var(--pf-bg)] flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--pf-orange)] transition-colors"
                  >
                    {audioTrack?.id === track.id && isPlaying ? (
                      <Pause size={18} fill="currentColor" />
                    ) : (
                      <Play size={18} fill="currentColor" className="ml-0.5" />
                    )}
                  </button>
                  <div className="min-w-0">
                    <p className="font-bold text-sm truncate">{track.title}</p>
                    <p className="text-xs text-[var(--pf-text-secondary)] truncate">{track.artist}</p>
                  </div>
                  <span className="text-xs font-medium text-[var(--pf-text-secondary)] ml-auto">${track.price?.toFixed(2) ?? '1.00'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED MERCH */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-black">Merch & Products</h2>
            <Link href="/marketplace" className="text-sm font-medium text-[var(--pf-orange)] hover:text-[var(--pf-orange)]/80 transition-colors">Shop All →</Link>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {FEATURED_PRODUCTS.slice(0, 4).map(product => (
              <Link key={product.id} href={`/product/${product.id}`} className="group">
                <div className="aspect-square bg-[var(--pf-surface)] rounded-xl border border-[var(--pf-border)] overflow-hidden mb-3 relative">
                  {product.image ? (
                    <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Music size={32} className="text-[var(--pf-border)]" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className="text-xs font-bold bg-[var(--pf-orange)] text-black px-2 py-0.5 rounded-full">{product.price}</span>
                  </div>
                </div>
                <h3 className="font-bold text-sm mb-1 group-hover:text-[var(--pf-orange)] transition-colors">{product.name}</h3>
                <p className="text-xs text-[var(--pf-text-secondary)]">{product.artist}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ARTISTS */}
      <section className="py-24 px-6 bg-[var(--pf-bg-secondary)] border-y border-[var(--pf-border)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black mb-2">The Artists</h2>
            <p className="text-[var(--pf-text-secondary)]">Real artists. Real music. No algorithm.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {PLATFORM_ARTISTS.map(artist => (
              <Link key={artist.id} href={`/artist/${artist.id}`} className="group text-center">
                <div className="w-32 h-32 mx-auto rounded-full bg-[var(--pf-surface)] border border-[var(--pf-border)] overflow-hidden mb-4 group-hover:border-[var(--pf-orange)] transition-colors">
                  {artist.image ? (
                    <Image src={artist.image} alt={artist.name} width={128} height={128} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl font-black text-[var(--pf-border)]">
                      {artist.name.charAt(0)}
                    </div>
                  )}
                </div>
                <h3 className="font-bold group-hover:text-[var(--pf-orange)] transition-colors">{artist.name}</h3>
                <p className="text-xs text-[var(--pf-text-secondary)] mt-1">{artist.genre}</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/signup?role=artist" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--pf-orange)] hover:text-[var(--pf-orange)]/80 transition-colors">
              Apply to join the platform <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* SUPERFAN PROGRAM */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--pf-orange)]/10 border border-[var(--pf-orange)]/30 text-[var(--pf-orange)] text-xs font-bold tracking-widest uppercase mb-6">
            <Users size={12} />
            Earn While You Stream
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-4">Become a Superfan</h2>
          <p className="text-[var(--pf-text-secondary)] mb-8 max-w-2xl mx-auto">
            Share your favorite artists. Earn 3% on every track, album, and merch purchase your referrals make — forever.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/superfan" className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-100 transition-colors flex items-center gap-2">
              Learn More <ArrowRight size={18} />
            </Link>
            <Link href="/signup?role=superfan" className="px-8 py-4 text-sm font-medium text-[var(--pf-text-secondary)] hover:text-white transition-colors">
              Start Earning →
            </Link>
          </div>
        </div>
      </section>

      {/* EMAIL CAPTURE */}
      <section className="py-16 px-6 bg-[var(--pf-bg-secondary)] border-t border-[var(--pf-border)]">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-black mb-2">Stay in the Loop</h2>
          <p className="text-[var(--pf-text-secondary)] mb-6">New releases, artist features, platform updates.</p>
          <EmailCapture />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[var(--pf-bg-secondary)] border-t border-[var(--pf-border)] py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-bold text-lg">PORTERFUL</h3>
              <p className="text-sm text-[var(--pf-text-secondary)]">The Artist Economy.</p>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/terms" className="text-[var(--pf-text-secondary)] hover:text-white transition-colors">Terms</Link>
              <Link href="/privacy" className="text-[var(--pf-text-secondary)] hover:text-white transition-colors">Privacy</Link>
              <Link href="/faq" className="text-[var(--pf-text-secondary)] hover:text-white transition-colors">FAQ</Link>
              <Link href="/contact" className="text-[var(--pf-text-secondary)] hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-[var(--pf-border)] text-center">
            <p className="text-sm text-[var(--pf-text-secondary)]">© {new Date().getFullYear()} Porterful. Built different.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
