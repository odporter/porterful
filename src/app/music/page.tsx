import type { Metadata } from 'next'
import MusicClient from './MusicClient'

export const metadata: Metadata = {
  title: 'Music',
  description: 'Stream and buy music from independent artists. Support creators directly. MP3s, albums, and exclusive releases — 80% goes to artists.',
  openGraph: {
    title: 'Music | Porterful',
    description: 'Stream and buy music from independent artists. Support creators directly.',
    url: 'https://porterful.com/music',
    siteName: 'Porterful',
    type: 'website',
    images: [
      {
        url: 'https://porterful.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Music on Porterful — Independent Artist Tracks & Albums',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Music | Porterful',
    description: 'Stream and buy music from independent artists. Support creators directly.',
    images: ['https://porterful.com/og-image.png'],
  },
  alternates: {
    canonical: 'https://porterful.com/music',
  },
}

export default function MusicPage() {
  return <MusicClient />
}
