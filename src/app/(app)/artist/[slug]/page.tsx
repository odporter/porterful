import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getArtistById, getArtistTracks, ARTISTS } from '@/lib/artists'
import { ArtistHero } from '@/components/artist/ArtistHero'
import { ArtistTabs } from '@/components/artist/ArtistTabs'
import type { Track } from '@/lib/audio-context'
import { createClient } from '@supabase/supabase-js'
import { mergeCanonicalTracks, dedupeQueueTracks } from '@/lib/track-dedupe'

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

// Server-side Supabase client
function getServerSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

async function getServerTracksByArtistNameFull(artistName: string) {
  const supabase = getServerSupabase()
  const { data, error } = await supabase
    .from('tracks')
    .select('*')
    .eq('artist', artistName)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('[getServerTracksByArtistNameFull] Error:', error)
    return []
  }
  
  return data || []
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

export default async function ArtistPage({ params }: PageProps) {
  const { slug } = await params
  const artist = getArtistById(slug)

  if (!artist) {
    notFound()
  }

  // Fetch ALL DB tracks (including inactive for canonical dedupe)
  const dbTracksRaw = await getServerTracksByArtistNameFull(artist.name)
  const staticTracks = getArtistTracks(slug)
  
  // Merge using canonical dedupe: inactive DB blocks matching static
  const tracks = mergeCanonicalTracks(
    dbTracksRaw as any[],
    staticTracks as any[],
    { includeInactive: false }
  )
  
  // Block empty public artist pages
  if (tracks.length === 0) {
    notFound()
  }

  // Dedupe queue before passing to player
  const dedupedTracks = dedupeQueueTracks(tracks)

  const albumTracks = dedupedTracks.filter((t) => !!t.album && ALBUM_LIST.includes(t.album))
  const singles = dedupedTracks.filter((t) => !t.album || !ALBUM_LIST.includes(t.album))
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
        firstTrack={dedupedTracks[0] ?? null}
        queueTracks={dedupedTracks}
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
