import type { Metadata } from 'next'
import DigitalClient from './DigitalClient'

export const metadata: Metadata = {
  title: 'Music — Stream & Buy from Independent Artists | Porterful',
  description: 'Stream and buy music directly from independent artists. No label, no middleman — 80% of every sale goes to the creator. Browse albums, singles, and EPs.',
  keywords: ['buy music', 'independent artists', 'direct to fan', 'albums', 'hip-hop', 'R&B', 'stream music'],
  alternates: { canonical: 'https://porterful.com/music' },
  openGraph: {
    title: 'Porterful Music — Independent Artists, Direct to Fans',
    description: 'Stream and buy music directly from independent artists. 80% goes to creators.',
    url: 'https://porterful.com/music',
    siteName: 'Porterful',
    locale: 'en_US',
    type: 'website',
    images: [{ url: 'https://porterful.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Porterful Music — Independent Artists, Direct to Fans',
    description: 'Stream and buy music directly from independent artists. 80% goes to creators.',
    images: ['https://porterful.com/og-image.png'],
  },
  robots: { index: true, follow: true },
}

export default function MusicPage() {
  return <DigitalClient />
}
