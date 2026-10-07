import type { Metadata } from 'next'
import { ArtistsPageClient } from './ArtistsPageClient'

export const metadata: Metadata = {
  title: 'Discover Artists',
  description: 'Browse and support independent artists on Porterful. Every purchase helps them keep creating.',
  openGraph: {
    title: 'Discover Artists | Porterful',
    description: 'Browse and support independent artists. Every purchase helps them keep creating.',
    url: 'https://porterful.com/artists',
    siteName: 'Porterful',
    locale: 'en_US',
    type: 'website',
    images: [{ url: 'https://porterful.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Discover Artists | Porterful',
    description: 'Browse and support independent artists.',
    images: ['https://porterful.com/og-image.png'],
  },
  robots: { index: true, follow: true },
}

export default function ArtistsPage() {
  return <ArtistsPageClient />
}
