import type { Metadata } from 'next'
import { ArtistsPageClient } from './ArtistsPageClient'
import Script from 'next/script'

const ARTISTS_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'MusicGroup',
  '@id': 'https://porterful.com/#artists',
  name: 'Porterful Artists',
  url: 'https://porterful.com/artists',
  description: 'Discover and support independent artists on Porterful. Every purchase helps creators keep making music.',
  image: 'https://porterful.com/og-image.png',
  sameAs: [
    'https://twitter.com/porterful',
    'https://instagram.com/od.porter',
    'https://youtube.com/@odporter',
    'https://tiktok.com/@porterful',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Music & Merch',
    url: 'https://porterful.com/store',
  },
}

const FAQ_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I support an artist on Porterful?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can support artists by purchasing their music or merchandise directly from their store page. 80% of every sale goes directly to the artist, with 10% supporting the platform and 10% going to the artist fund.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I become a verified artist on Porterful?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Artists can apply to join Porterful. Verified artists have a badge on their profile. Apply through our artist application form to get started.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does the Superfan program work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Superfans earn 3% commission on every sale made through their unique referral link. You also get exclusive badges, early access to new releases, and behind-the-scenes content from your favorite artists.',
      },
    },
    {
      '@type': 'Question',
      name: 'What payment methods are accepted?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We accept all major credit cards, debit cards, and digital wallets through our secure Stripe checkout. All transactions are encrypted and secure.',
      },
    },
  ],
}

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
  return (
    <>
      <Script
        id="artists-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTISTS_JSON_LD) }}
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />
      <ArtistsPageClient />
    </>
  )
}
