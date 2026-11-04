import type { Metadata } from 'next'
import { Suspense } from 'react'
import { StoreClient } from './StoreClient'

export const metadata: Metadata = {
  title: 'Shop — Music & Merch from Independent Artists',
  description: 'Shop music, apparel, tech, and home goods from independent artists. 80% of every sale goes directly to creators. Browse the Porterful marketplace.',
  alternates: { canonical: 'https://porterful.com/store' },
  openGraph: {
    title: 'Porterful Store — Independent Artist Merch & Music',
    description: 'Shop music and merch from independent artists. 80% of every sale goes directly to creators.',
    url: 'https://porterful.com/store',
    siteName: 'Porterful',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://porterful.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Porterful Store — Independent Artist Merch & Music',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Porterful Store — Independent Artist Merch & Music',
    description: 'Shop music and merch from independent artists. 80% goes to creators.',
    images: ['https://porterful.com/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function StorePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[var(--pf-orange)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[var(--pf-text-secondary)] text-sm">Loading store…</p>
        </div>
      </div>
    }>
      <StoreClient />
    </Suspense>
  )
}
