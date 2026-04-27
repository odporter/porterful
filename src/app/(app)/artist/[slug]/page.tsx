import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getArtistById, getArtistTracks, ARTISTS } from '@/lib/artists'
import { ArtistHero } from '@/components/artist/ArtistHero'
import { ArtistTabs } from '@/components/artist/ArtistTabs'
import type { Track } from '@/lib/audio-context'
import { getServerTracksByArtistName } from '@/lib/artist-tracks-server'

interface SocialLinks {
  instagram?: string
  twitter?: string
  tiktok?: string
  youtube?: string
  website?: string
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return ARTISTS
    .filter((artist) => artist.trackCount && artist.trackCount > 0)
    .map((artist) => ({
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

const ALBUM_LIST = [
  'Ambiguous',
  'From Feast to Famine',
  'God Is Good',
  'One Day',
  'Streets Thought I Left',
  'Roxannity',
  'Artgasm',
  'Levi',
]

// Merge DB tracks with static, preferring DB
function mergeArtistTracks(dbTracks: any[], staticTracks: any[]): Track[] {
  const merged = new Map<string, any>()
  
  // Add DB tracks first (preferred)
  dbTracks.forEach((t: any) => {
    merged.set(t.id, {
      id: t.id,
      title: t.title,
      artist: t.artist || 'Unknown',
      album: t.album,
      duration: t.duration,
      audio_url: t.audio_url,
      cover_url: t.cover_url,
      image: t.cover_url,
      plays: t.play_count || 0,
      price: t.proud_to_pay_min || 1,
    })
  })
  
  // Add static tracks only if not in DB
  staticTracks.forEach((t: any) => {
    if (!merged.has(t.id)) {
      merged.set(t.id, t)
    }
  })
  
  return Array.from(merged.values()) as Track[]
}

export default async function ArtistPage({ params }: PageProps) {
  const { slug } = await params
  const artist = getArtistById(slug)

  if (!artist) {
    notFound()
  }

  // Fetch DB tracks (filtered by is_active=true)
  const dbTracks = await getServerTracksByArtistName(artist.name)
  const staticTracks = getArtistTracks(slug)
  
  // Merge: DB tracks preferred, static as fallback
  const tracks = mergeArtistTracks(dbTracks, staticTracks)
  
  // Block empty public artist pages
  if (tracks.length === 0) {
    notFound()
  }

  const albumTracks = tracks.filter((t) => !!t.album && ALBUM_LIST.includes(t.album))
  const singles = tracks.filter((t) => !t.album || !ALBUM_LIST.includes(t.album))
  const products: never[] = []

  return (
    <div className="min-h-screen pb-32">
      <ArtistHero
        artist={{
          name: artist.name,
          slug: artist.slug,
          genre: artist.genre,
          location: artist.location,
          verified: artist.verified,
          likeness_verified: artist.likeness_verified,
          image: artist.image,
          social: artist.social as SocialLinks | undefined,
        }}
        firstTrack={tracks[0] ?? null}
        queueTracks={tracks}
      />
      <ArtistTabs
        artistName={artist.name}
        bio={artist.bio}
        social={artist.social}
        singles={singles}
        albumTracks={albumTracks}
        products={products}
      />
    </div>
  )
}
