import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Instagram, Youtube, Twitter, Music2 } from 'lucide-react'
import { getArtistById, getArtistTracks, ARTISTS } from '@/lib/artists'
import { FEATURED_PRODUCTS } from '@/lib/products'
import { ArtistHero } from '@/components/artist/ArtistHero'
import { ArtistTrackList } from '@/components/artist/ArtistTrackList'
import { ArtistSupportCard } from '@/components/artist/ArtistSupportCard'
import { ArtistProducts } from '@/components/artist/ArtistProducts'
import { LikenessVerifiedBadge } from '@/components/LikenessVerifiedBadge'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return ARTISTS.map(artist => ({
    slug: artist.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const artist = getArtistById(slug)
  if (!artist) return { title: 'Artist Not Found' }

  return {
    title: `${artist.name} — Porterful`,
    description: artist.shortBio,
    openGraph: {
      title: `${artist.name} on Porterful`,
      description: artist.shortBio,
      images: artist.image ? [{ url: artist.image }] : [],
    },
  }
}

export default async function ArtistPage({ params }: PageProps) {
  const { slug } = await params
  const artist = getArtistById(slug)

  if (!artist) {
    notFound()
  }

  const tracks = getArtistTracks(slug)
  const featuredTrack = tracks[0]
  const totalPlays = tracks.reduce((sum, t) => sum + (t.plays || 0), 0)

  // Separate singles from albums
  const ALBUM_LIST = ['Ambiguous', 'From Feast to Famine', 'God Is Good', 'One Day', 'Streets Thought I Left', 'Roxannity', 'Artgasm', 'Levi']
  const albums = tracks.filter(t => ALBUM_LIST.includes(t.album))
  const singles = tracks.filter(t => !ALBUM_LIST.includes(t.album))

  const products = FEATURED_PRODUCTS.slice(0, 4)

  return (
    <div className="min-h-screen pb-24">
      {/* Hero Section */}
      <ArtistHero artist={artist} featuredTrack={featuredTrack} totalPlays={totalPlays} />

      {/* Social Links Bar */}
      {artist.social && (artist.social.instagram || artist.social.twitter || artist.social.youtube || artist.social.tiktok) && (
        <div className="max-w-6xl mx-auto px-6 pt-6">
          <div className="flex items-center gap-3">
            {artist.social.instagram && (
              <a href={`https://instagram.com/${artist.social.instagram}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--pf-surface)] border border-[var(--pf-border)] hover:border-pink-500 transition-colors text-sm text-[var(--pf-text-secondary)]">
                <Instagram size={15} className="text-pink-400" />
                <span>@{artist.social.instagram}</span>
              </a>
            )}
            {artist.social.twitter && (
              <a href={`https://x.com/${artist.social.twitter}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--pf-surface)] border border-[var(--pf-border)] hover:border-blue-500 transition-colors text-sm text-[var(--pf-text-secondary)]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-blue-400"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                <span>@{artist.social.twitter}</span>
              </a>
            )}
            {artist.social.youtube && (
              <a href={`https://youtube.com/${artist.social.youtube.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--pf-surface)] border border-[var(--pf-border)] hover:border-red-500 transition-colors text-sm text-[var(--pf-text-secondary)]">
                <Youtube size={15} className="text-red-500" />
                <span>{artist.social.youtube}</span>
              </a>
            )}
            {artist.social.tiktok && (
              <a href={`https://tiktok.com/@${artist.social.tiktok.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--pf-surface)] border border-[var(--pf-border)] hover:border-pink-600 transition-colors text-sm text-[var(--pf-text-secondary)]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-pink-500"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.73a8.26 8.26 0 0 0 4.83 1.54V6.78a4.85 4.85 0 0 1-1-.09z"/></svg>
                <span>@{artist.social.tiktok}</span>
              </a>
            )}
          </div>
        </div>
      )}

      {/* Content Grid */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* Main Column — Tracks */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio Section */}
            <section>
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm uppercase tracking-widest text-[var(--pf-orange)]">About</p>
                {artist.likeness_verified && (
                  <div className="flex items-center gap-1.5 text-xs text-[var(--pf-text-muted)]">
                    <LikenessVerifiedBadge size={14} />
                    <span>Likeness Verified</span>
                  </div>
                )}
              </div>
              <div className="bg-[var(--pf-surface)] rounded-2xl p-6 border border-[var(--pf-border)]">
                <p className="text-[var(--pf-text-secondary)] leading-relaxed whitespace-pre-line break-words max-w-full">
                  {artist.bio}
                </p>
              </div>
            </section>

            {/* Featured Singles (first) */}
            {singles.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm uppercase tracking-widest text-[var(--pf-orange)]">Featured Singles</p>
                  <span className="text-sm text-[var(--pf-text-muted)]">{singles.length} singles</span>
                </div>
                <ArtistTrackList tracks={singles} />
                <p className="text-xs text-[var(--pf-text-muted)] mt-3 text-center">
                  {singles.length === 1 ? 'This track' : `${singles.length} tracks`}
                  {` — listen, then explore merch & support options in the sidebar`}
                </p>
              </section>
            )}

            {/* Albums */}
            {albums.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm uppercase tracking-widest text-[var(--pf-orange)]">Albums</p>
                  <span className="text-sm text-[var(--pf-text-muted)]">{albums.length} albums</span>
                </div>
                <ArtistTrackList tracks={albums} />
              </section>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="space-y-5 flex flex-col">

            {/* Support Card */}
            <ArtistSupportCard artist={artist} />

            {/* Products */}
            <ArtistProducts products={products} artistName={artist.name} />

            {/* Superfan CTA */}
            <div className="bg-gradient-to-br from-[var(--pf-orange)]/10 to-purple-600/10 rounded-2xl p-5 border border-[var(--pf-orange)]/20 flex flex-col min-h-[140px]">
              <div className="flex items-start justify-between mb-2">
                <div className="text-2xl">⭐</div>
              </div>
              <h3 className="font-bold text-base mb-1">Become a Superfan</h3>
              <p className="text-sm text-[var(--pf-text-secondary)] flex-1">
                Earn 3% on everything your referrals buy. Help {artist.name.split(' ')[0]} grow without spending a dime.
              </p>
              <p className="text-xs text-[var(--pf-text-muted)] mt-2">
                No purchase required to join
              </p>
              <Link
                href="/superfan"
                className="mt-4 block w-full py-2.5 rounded-xl text-center text-sm font-semibold bg-[var(--pf-orange)] text-white hover:bg-[var(--pf-orange-dark)] transition-colors"
              >
                Learn More
              </Link>
            </div>

            {/* Platform Stats */}
            <div className="bg-[var(--pf-surface)] rounded-2xl p-5 border border-[var(--pf-border)] min-h-[160px]">
              <p className="text-sm uppercase tracking-widest text-[var(--pf-text-muted)] mb-4">Platform</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--pf-text-secondary)]">Artist revenue share</span>
                  <span className="text-sm font-semibold text-[var(--pf-orange)]">80%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--pf-text-secondary)]">Superfan commission</span>
                  <span className="text-sm font-semibold">3–8%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--pf-text-secondary)]">Platform fee</span>
                  <span className="text-sm font-semibold">10%</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[var(--pf-border)]">
                <Link href="/ecosystem" className="text-sm text-[var(--pf-orange)] hover:underline">
                  How Porterful works →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
