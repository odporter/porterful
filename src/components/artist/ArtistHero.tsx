'use client'

import { useAudio, Track } from '@/lib/audio-context'
import Image from 'next/image'
import Link from 'next/link'
import { Play, Pause, Headphones, Users, Disc, Verified, ChevronLeft } from 'lucide-react'

interface ArtistHeroProps {
  artist: {
    name: string
    slug: string
    genre: string
    location: string
    verified: boolean
    image: string
    coverGradient: string
    followers: number
    trackCount?: number
    social?: Record<string, string>
  }
  featuredTrack?: Track
  totalPlays: number
}

function formatPlays(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(0) + 'K'
  return n.toString()
}

export function ArtistHero({ artist, featuredTrack, totalPlays }: ArtistHeroProps) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio()
  const isActive = currentTrack?.id === featuredTrack?.id

  return (
    <section className="relative bg-gradient-to-b from-[var(--pf-orange)]/10 via-[var(--pf-bg)] to-[var(--pf-bg)]">
      {/* Back nav */}
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <Link
          href="/music"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--pf-text-muted)] hover:text-[var(--pf-orange)] transition-colors"
        >
          <ChevronLeft size={16} />
          All Artists
        </Link>
      </div>

      <div className="relative max-w-6xl mx-auto px-6 pt-8 pb-12">
        <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">

          {/* Avatar */}
          <div className="relative w-48 h-48 flex-shrink-0 rounded-2xl overflow-hidden border-2 border-[var(--pf-orange)]/30 shadow-2xl shadow-[var(--pf-orange)]/10">
            <Image
              src={artist.image || '/artist-art/od-porter.jpg'}
              alt={artist.name}
              fill
              sizes="192px"
              className="object-cover"
              priority
            />
          </div>

          {/* Info + Controls */}
          <div className="flex-1 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
              {artist.verified && (
                <Verified size={18} className="text-[var(--pf-orange)]" />
              )}
              <span className="text-sm text-[var(--pf-text-muted)] uppercase tracking-widest">
                Artist
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold mb-2">{artist.name}</h1>

            <p className="text-[var(--pf-text-secondary)] mb-6">
              {artist.genre} · {artist.location}
            </p>

            {/* Featured Track */}
            {featuredTrack && (
              <button
                onClick={() => isActive ? togglePlay() : playTrack(featuredTrack)}
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[var(--pf-orange)] hover:bg-[var(--pf-orange-dark)] text-white font-semibold transition-all shadow-lg shadow-[var(--pf-orange)]/20 mb-8"
              >
                {isActive && isPlaying ? (
                  <>
                    <Pause size={20} />
                    Pause
                  </>
                ) : (
                  <>
                    <Play size={20} className="ml-0.5" />
                    Play Featured Track
                  </>
                )}
              </button>
            )}

            {/* Stats */}
            <div className="flex items-center justify-center lg:justify-start gap-6">
              <div className="flex items-center gap-2 text-[var(--pf-text-secondary)]">
                <Headphones size={16} />
                <span className="text-sm font-mono">{formatPlays(totalPlays)}+ plays</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--pf-text-secondary)]">
                <Disc size={16} />
                <span className="text-sm font-mono">{artist.trackCount || 0} tracks</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--pf-text-secondary)]">
                <Users size={16} />
                <span className="text-sm font-mono">{formatPlays(artist.followers)} followers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
