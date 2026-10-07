import type { Metadata } from 'next'
import MusicClient from './MusicClient'

export const metadata: Metadata = {
  title: 'Music',
  description: 'Stream and buy music from independent artists. Support creators directly. MP3s, albums, and exclusive releases — 80% goes to artists.',
  openGraph: {
    title: 'Music',
    description: 'Stream and buy music from independent artists. Support creators directly.',
    url: 'https://porterful.com/music',
    siteName: 'Porterful',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Music | Porterful',
    description: 'Stream and buy music from independent artists. Support creators directly.',
  },
  alternates: {
    canonical: 'https://porterful.com/music',
  },
}

export default function MusicPage() {
  return <MusicClient />
}
