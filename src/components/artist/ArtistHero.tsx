'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, Pause, Play, Verified } from 'lucide-react'
import { useAudio, Track } from '@/lib/audio-context'
import { LikenessBadge } from '@/components/likeness/LikenessGate'

interface SocialLinks {
  instagram?: string
  twitter?: string
  tiktok?: string
  youtube?: string
  website?: string
}

interface ArtistHeroProps {
  artist: {
    name: string
    slug: string
    genre: string
    location: string
    verified: boolean
    likeness_verified?: boolean
    image: string
    social?: SocialLinks
  }
  firstTrack: Track | null
  queueTracks: Track[]
}

function externalUrl(platform: keyof SocialLinks, value: string): string {
  switch (platform) {
    case 'instagram':
      return `https://instagram.com/${value.replace(/^@/, '')}`
    case 'twitter':
      return `https://twitter.com/${value.replace(/^@/, '')}`
    case 'tiktok':
      return `https://tiktok.com/@${value.replace(/^@/, '')}`
    case 'youtube':
      return value.startsWith('http') ? value : `https://youtube.com/${value}`
    case 'website':
      return value.startsWith('http') ? value : `https://${value}`
  }
}

// Social icon components (inline SVGs)
function InstagramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  )
}

function TwitterIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
}

function YouTubeIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  )
}

function TikTokIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.8-.1 3.5.6 4.5 2.5 1.1 1.9 1.2 4.2.7 6.4-.1.4-.3.8-.4 1.2 0 .1-.1.2-.1.2 1.9.2 3.5.8 4.6 1.7 1.1.9 1.7 2.2 1.8 3.7-.1.5-.3 1-.5 1.4-.5.9-1.2 1.7-2.1 2.2-1.5.9-3.3 1.3-5.1 1.2h-.8c-.4-.1-.8-.1-1.2-.2-1.6-.3-3.2-.9-4.5-1.7-1.3-.8-2.3-1.8-3-3.1-.6-1.1-1-2.4-1.1-3.7V8.1c.1-.4.2-.9.3-1.3.3-1.4 1-2.7 1.9-3.7C8.6 1.7 10.5.7 12.5.2h.1v5.3c-.5-.1-1.1 0-1.6.2-.4.2-.8.6-1 1-.2.4-.3.9-.2 1.3v7.9c0 .5.2 1 .5 1.4.3.4.8.6 1.3.7h.1c.5-.1 1-.4 1.3-.8.3-.4.4-.9.4-1.4V6.6c-.1-.3-.1-.7-.1-1z"/>
    </svg>
  )
}

const SOCIAL_ICONS = {
  instagram: InstagramIcon,
  twitter: TwitterIcon,
  youtube: YouTubeIcon,
  tiktok: TikTokIcon,
  website: null,
}

export function ArtistHero({ artist, firstTrack, queueTracks }: ArtistHeroProps) {
  const { currentTrack, isPlaying, playTrack, togglePlay, setQueue } = useAudio()

  const isThisArtistPlaying = !!currentTrack && queueTracks.some((t) => t.id === currentTrack.id)
  const showPause = isThisArtistPlaying && isPlaying

  const handlePlay = () => {
    if (!firstTrack) return
    if (isThisArtistPlaying) {
      togglePlay()
      return
    }
    if (queueTracks.length > 0) setQueue(queueTracks)
    playTrack(firstTrack)
  }

  const socialEntries = artist.social
    ? (Object.entries(artist.social).filter(([k, v]) => !!v && k !== 'website') as Array<[keyof SocialLinks, string]>)
    : []

  return (
    <section className="bg-[var(--pf-bg)] border-b border-[var(--pf-border)]">
      {/* Back nav */}
      <div className="max-w-6xl mx-auto px-5 sm:px-6 pt-5">
        <Link
          href="/artists"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--pf-text-secondary)] hover:text-[var(--pf-text)] transition-colors"
        >
          <ChevronLeft size={16} />
          Artists
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-6 pt-5 pb-6 sm:pt-6 sm:pb-8">
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Avatar */}
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden flex-shrink-0 bg-[var(--pf-surface)] border border-[var(--pf-border)]">
            {artist.image ? (
              <Image
                src={artist.image}
                alt={artist.name}
                fill
                sizes="(max-width: 640px) 96px, 128px"
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-3xl font-bold text-[var(--pf-text-secondary)]">
                  {artist.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-[11px] uppercase tracking-widest text-[var(--pf-text-secondary)] mb-1">
              Artist
            </p>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl sm:text-3xl font-bold truncate">{artist.name}</h1>
              {artist.verified && (
                <Verified size={16} className="text-[var(--pf-text-secondary)] shrink-0" />
              )}
              {artist.likeness_verified && <LikenessBadge compact />}
            </div>
            <p className="text-sm text-[var(--pf-text-secondary)] truncate">
              {artist.genre}
              {artist.location && ` · ${artist.location}`}
            </p>

            {/* Social Media Icons */}
            {socialEntries.length > 0 && (
              <div className="flex items-center gap-2 mt-2">
                {socialEntries.map(([platform, value]) => {
                  const Icon = SOCIAL_ICONS[platform]
                  if (!Icon) return null
                  return (
                    <a
                      key={platform}
                      href={externalUrl(platform, value)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-[var(--pf-surface)] border border-[var(--pf-border)] flex items-center justify-center text-[var(--pf-text-secondary)] hover:text-[var(--pf-text)] hover:border-[var(--pf-text-muted)] transition-colors"
                      aria-label={`${artist.name} on ${platform}`}
                    >
                      <Icon size={16} />
                    </a>
                  )
                })}
              </div>
            )}
          </div>

          {/* Primary action */}
          <button
            onClick={handlePlay}
            disabled={!firstTrack}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[var(--pf-orange)] hover:bg-[var(--pf-orange)]/90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0 transition-colors shadow-lg"
            aria-label={showPause ? `Pause ${artist.name}` : `Play ${artist.name}`}
          >
            {showPause ? (
              <Pause size={24} className="text-[var(--pf-text)]" />
            ) : (
              <Play size={24} className="text-[var(--pf-text)] ml-0.5" />
            )}
          </button>
        </div>
      </div>
    </section>
  )
}
