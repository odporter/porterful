import type { Metadata } from 'next'
import RadioClient from './RadioClient'

export const metadata: Metadata = {
  title: 'Radio | Porterful',
  description: 'Listen to shuffled music from independent artists on Porterful Radio. Stream tracks randomly and discover new music — 80% of every purchase goes directly to artists.',
  openGraph: {
    title: 'Porterful Radio — Shuffle Music',
    description: 'Stream shuffled music from independent artists. Discover new tracks and support creators directly.',
    url: 'https://porterful.com/radio',
    siteName: 'Porterful',
    type: 'website',
    images: [
      {
        url: 'https://porterful.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Porterful Radio — Stream Independent Music',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Porterful Radio — Shuffle Music',
    description: 'Stream shuffled music from independent artists. Discover new tracks and support creators directly.',
    images: ['https://porterful.com/og-image.png'],
  },
  alternates: {
    canonical: 'https://porterful.com/radio',
  },
}

export default function RadioPage() {
  return <RadioClient />
}
