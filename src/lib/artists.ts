// Artist data - in production this would come from Supabase
import { TRACKS } from './data'

export interface ArtistData {
  id: string
  name: string
  slug: string
  genre: string
  location: string
  bio: string
  shortBio: string
  verified: boolean
  image: string
  coverGradient: string
  followers: number
  supporters: number | null
  earnings: number | null
  products: number
  trackCount?: number
  social?: {
    instagram?: string
    twitter?: string
    tiktok?: string
    youtube?: string
  }
}

// Array of artists for listing pages
export const ARTISTS: ArtistData[] = [
  {
    id: 'od-porter',
    name: 'O D Porter',
    slug: 'od-porter',
    genre: 'Hip-Hop, R&B, Soul',
    location: 'St. Louis, MO',
    bio: `Independent artist and founder of Porterful. Born in Miami, raised between New Orleans and St. Louis — most known from the STL.`,
    shortBio: 'Independent artist and founder of Porterful. Born in Miami, raised in New Orleans & St. Louis.',
    verified: true,
    image: '',
    coverGradient: 'from-[var(--pf-orange)] to-purple-600',
    followers: 2847,
    supporters: null,
    earnings: null,
    products: 12,
    trackCount: TRACKS.filter(t => t.artist === 'O D Porter').length,
    social: {
      instagram: 'odporter',
      twitter: 'odporter',
      youtube: '@odporter',
    },
  },
  {
    id: 'noble-naturals',
    name: 'Noble Naturals',
    slug: 'noble-naturals',
    genre: 'R&B, Soul',
    location: 'New Orleans, LA',
    bio: `Noble Naturals blends organic soul with modern R&B, drawing from the rich musical heritage of New Orleans. Their sound is a lush landscape of warm vocals, live instruments, and heartfelt lyrics.`,
    shortBio: 'Soul-infused R&B from the heart of New Orleans.',
    verified: false,
    image: '',
    coverGradient: 'from-emerald-500 to-teal-600',
    followers: 412,
    supporters: null,
    earnings: null,
    products: 3,
    trackCount: 8,
    social: {
      instagram: 'noblenaturalsmusic',
    },
  },
  {
    id: 'stl-collective',
    name: 'STL Collective',
    slug: 'stl-collective',
    genre: 'Hip-Hop, Rap',
    location: 'St. Louis, MO',
    bio: `STL Collective is a forward-thinking hip-hop group from St. Louis, known for their energetic performances and socially conscious lyrics. Representing the STL with pride.`,
    shortBio: 'St. Louis hip-hop collective pushing the boundaries of rap.',
    verified: false,
    image: '',
    coverGradient: 'from-blue-500 to-indigo-600',
    followers: 389,
    supporters: null,
    earnings: null,
    products: 2,
    trackCount: 5,
    social: {
      instagram: 'stlcollective',
    },
  },
  {
    id: 'velvet-dreams',
    name: 'Velvet Dreams',
    slug: 'velvet-dreams',
    genre: 'Indie Pop, Lo-Fi',
    location: 'Chicago, IL',
    bio: `Velvet Dreams creates dreamy indie pop with lo-fi textures and introspective lyrics. Based in Chicago, their music captures the feeling of late-night city walks and quiet reflections.`,
    shortBio: 'Dreamy indie pop with lo-fi warmth from Chicago.',
    verified: false,
    image: '',
    coverGradient: 'from-pink-500 to-rose-600',
    followers: 267,
    supporters: null,
    earnings: null,
    products: 1,
    trackCount: 12,
    social: {
      instagram: 'velvetdreamsmusic',
    },
  },
]

// Get artist by ID, returns undefined if not found
export function getArtistById(id: string): ArtistData | undefined {
  return ARTISTS.find(a => a.id === id || a.slug === id)
}

// Get all artist IDs for routing
export function getAllArtistIds(): string[] {
  return ARTISTS.map(a => a.id)
}

// Get tracks for a specific artist
export function getArtistTracks(artistId: string): typeof TRACKS {
  const artist = getArtistById(artistId)
  if (!artist) return []
  return TRACKS.filter(t => t.artist === artist.name || t.artist === artist.id)
}

// Get products for a specific artist (placeholder - would be from DB)
export function getArtistProducts(artistId: string): number {
  const artist = getArtistById(artistId)
  return artist?.products || 0
}

// Get artist slug by name (for GlobalPlayer)
export function getArtistSlugByName(name: string): string | undefined {
  const artist = ARTISTS.find(a => a.name === name)
  return artist?.slug
}
