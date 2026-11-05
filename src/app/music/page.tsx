import type { Metadata } from 'next'
import MusicClient from './MusicClient'

export const metadata: Metadata = {
  title: 'Music — Stream & Buy from Independent Artists | Porterful',
  description: 'Stream and buy music directly from independent artists. No label, no middleman — 80% of every sale goes to the creator. Browse albums, singles, and EPs.',
  keywords: ['buy music', 'independent artists', 'direct to fan', 'albums', 'EPs', 'singles', 'hip-hop', 'R&B', 'stream music', 'support artists', 'music downloads'],
  alternates: {
    canonical: 'https://porterful.com/music',
  },
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
  robots: {
    index: true,
    follow: true,
  },
}

export default function MusicPage() {
  return <MusicClient />
}
