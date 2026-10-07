import type { Metadata } from 'next'
import PlaylistsClient from './PlaylistsClient'

export const metadata: Metadata = {
  title: 'My Playlists | Porterful',
  description: 'Create and manage your custom playlists on Porterful. Earn 3% when others listen to your playlists and purchase tracks. Build your collection of independent music.',
  openGraph: {
    title: 'My Playlists | Porterful',
    description: 'Create custom playlists and earn when others listen. 3% of track purchases from your playlists goes to you.',
    url: 'https://porterful.com/playlists',
    siteName: 'Porterful',
    type: 'website',
    images: [
      {
        url: 'https://porterful.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'My Playlists on Porterful',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Playlists | Porterful',
    description: 'Create custom playlists and earn when others listen. 3% of track purchases from your playlists goes to you.',
    images: ['https://porterful.com/og-image.png'],
  },
  alternates: {
    canonical: 'https://porterful.com/playlists',
  },
}

export default function PlaylistsPage() {
  return <PlaylistsClient />
}
