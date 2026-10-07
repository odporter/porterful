import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { TRACKS, ALBUMS } from '@/lib/data'
import AlbumClient from './AlbumClient'

interface PageProps {
  params: Promise<{ slug: string }>
}

// Generate static params for all albums
export async function generateStaticParams() {
  return Object.values(ALBUMS).map(album => ({
    slug: album.id,
  }))
}

// Helper to format total album duration
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  if (hours > 0) return `${hours}h ${mins}m`
  return `${mins} min`
}

// Generate metadata for SEO (server-side)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const album = Object.values(ALBUMS).find(a => a.id === slug)
  
  if (!album) {
    return { title: 'Album Not Found' }
  }
  
  const albumTracks = TRACKS.filter(t => t.album === album.name)
  const totalPlays = albumTracks.reduce((sum, t) => sum + (t.plays || 0), 0)
  
  return {
    title: `${album.name} by O D Porter`,
    description: `Stream and buy tracks from ${album.name} album. ${albumTracks.length} tracks. Total plays: ${totalPlays.toLocaleString()}.`,
    openGraph: {
      title: `${album.name} | Porterful`,
      description: `${albumTracks.length} tracks • ${totalPlays.toLocaleString()} total plays`,
      images: [{ url: album.image, width: 500, height: 500, alt: album.name }],
    },
  }
}

export default async function AlbumPage({ params }: PageProps) {
  const { slug } = await params
  const album = Object.values(ALBUMS).find(a => a.id === slug)
  
  if (!album) {
    notFound()
  }
  
  const albumTracks = TRACKS.filter(t => t.album === album.name)
  const totalSeconds = albumTracks.reduce((acc, t) => {
    const [mins, secs] = (t.duration || '0:00').split(':').map(Number)
    return acc + mins * 60 + secs
  }, 0)

  return (
    <div className="min-h-screen pt-20 pb-24">
      <AlbumClient
        albumName={album.name}
        albumImage={album.image}
        albumTracks={albumTracks}
        totalDuration={formatDuration(totalSeconds)}
      />
    </div>
  )
}
