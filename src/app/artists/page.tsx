'use client'

import Link from 'next/link'
import { Music, MapPin } from 'lucide-react'

// Featured artists on the platform
const ARTISTS = [
  {
    id: 'od-porter',
    name: 'O D Porter',
    location: 'St. Louis, MO',
    specialty: 'Hip-Hop / R&B / Soul',
    bio: 'St. Louis artist blending hip-hop, R&B, and soul. Born in Miami, raised in NOLA & STL. Building Porterful to help artists own everything.',
    avatar: 'OD',
    tracks: 21,
    verified: true,
  },
  {
    id: 'jai-jai',
    name: 'Jai Jai',
    location: 'St. Louis, MO',
    specialty: 'Hip-Hop',
    bio: 'St. Louis hip-hop artist. Part of the 82 FAM collective. Raw bars and authentic storytelling.',
    avatar: 'JJ',
    tracks: 12,
    verified: true,
  },
]

export default function ArtistsPage() {
  return (
    <div className="min-h-screen pt-20 pb-24 bg-[var(--pf-bg)]">
      {/* Hero */}
      <section className="relative py-16 bg-gradient-to-br from-[var(--pf-orange)]/10 via-purple-500/5 to-[var(--pf-bg)]">
        <div className="pf-container">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-[var(--pf-orange)]">Artists</span> on Porterful
            </h1>
            <p className="text-lg text-[var(--pf-text-secondary)]">
              Discover independent artists selling music and merch directly to fans. 
              No labels, no middlemen — just artists and their community.
            </p>
          </div>
        </div>
      </section>

      {/* Artists Grid */}
      <section className="py-12">
        <div className="pf-container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ARTISTS.map((artist) => (
              <Link
                key={artist.id}
                href={`/artist/${artist.id}`}
                className="bg-[var(--pf-surface)] rounded-2xl p-6 border border-[var(--pf-border)] hover:border-[var(--pf-orange)] transition-all group"
              >
                {/* Artist Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--pf-orange)] to-purple-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
                    {artist.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold truncate group-hover:text-[var(--pf-orange)] transition-colors">
                        {artist.name}
                      </h2>
                      {artist.verified && (
                        <span className="bg-[var(--pf-orange)]/20 text-[var(--pf-orange)] px-2 py-0.5 rounded text-xs font-medium shrink-0">
                          ✓
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[var(--pf-text-secondary)]">{artist.specialty}</p>
                    <p className="text-xs text-[var(--pf-text-muted)] flex items-center gap-1 mt-1">
                      <MapPin size={10} /> {artist.location}
                    </p>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-sm text-[var(--pf-text-secondary)] mb-4 line-clamp-2">
                  {artist.bio}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-[var(--pf-text-muted)]">
                    <Music size={14} />
                    <span>{artist.tracks} tracks</span>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-4 pt-4 border-t border-[var(--pf-border)]">
                  <span className="text-sm text-[var(--pf-orange)] font-medium group-hover:underline">
                    View Artist Store →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Empty state - more artists coming */}
          {ARTISTS.length === 1 && (
            <div className="text-center py-12 text-[var(--pf-text-muted)]">
              <p className="text-lg mb-2">More artists joining soon!</p>
              <p className="text-sm">Are you an artist? <Link href="/signup?role=artist" className="text-[var(--pf-orange)] hover:underline">Start selling today</Link></p>
            </div>
          )}
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-12 bg-[var(--pf-bg-secondary)]">
        <div className="pf-container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Are You an Artist?</h2>
            <p className="text-[var(--pf-text-secondary)] mb-6">
              Join Porterful and open your own store. Upload your music, sell custom merch, 
              and keep 80% of every sale. No inventory, no hassle.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/signup?role=artist" className="pf-btn pf-btn-primary">
                Open Your Store
              </Link>
              <Link href="/marketplace" className="pf-btn pf-btn-secondary">
                Browse the Marketplace
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
