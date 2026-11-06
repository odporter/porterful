import type { Metadata } from 'next'
import { HomeClient } from './HomeClient'

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://porterful.com/#website',
      url: 'https://porterful.com',
      name: 'Porterful',
      description: 'Music, merch, and direct support for independent artists.',
      publisher: { '@id': 'https://porterful.com/#porterful-brand' },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://porterful.com/search?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      '@id': 'https://porterful.com/#organization',
      name: 'Porterful',
      url: 'https://porterful.com',
      description: 'Music, merch, and direct support for independent artists.',
      logo: {
        '@type': 'ImageObject',
        url: 'https://porterful.com/porterful-logo-white.svg',
      },
      dateFounded: '2026-01-01',
      foundingLocation: { '@type': 'Place', name: 'St. Louis, MO' },
      sameAs: [
        'https://twitter.com/porterful',
        'https://instagram.com/od.porter',
        'https://youtube.com/@odporter',
        'https://discord.gg/porterful',
        'https://tiktok.com/@Porterful',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'support@porterful.com',
        contactType: 'Customer Support',
      },
    },
    {
      '@type': 'WebPage',
      '@id': 'https://porterful.com/#webpage',
      url: 'https://porterful.com',
      name: 'Porterful — Music, Merch, and Direct Support',
      isPartOf: { '@id': 'https://porterful.com/#website' },
      description:
        'Music, merch, and direct support for independent artists. Upload your music, sell merch, and connect directly with fans.',
      about: {
        '@type': 'Thing',
        name: 'Independent Music Platform',
      },
      mainEntity: {
        '@type': 'WebSite',
        name: 'Porterful',
      },
      dateModified: new Date().toISOString(),
    },
    // MusicGroup schema — helps Google surface Porterful as a music platform
    {
      '@type': 'MusicGroup',
      '@id': 'https://porterful.com/#music-group',
      name: 'Porterful',
      url: 'https://porterful.com',
      description: 'Independent music platform where artists sell directly to fans and keep 80%.',
      genre: 'Independent',
      foundingLocation: { '@type': 'Place', name: 'St. Louis, MO' },
      sameAs: [
        'https://twitter.com/porterful',
        'https://instagram.com/od.porter',
        'https://youtube.com/@odporter',
        'https://discord.gg/porterful',
        'https://tiktok.com/@Porterful',
      ],
      member: {
        '@type': 'Person',
        name: 'O D Jonathan Porter',
        alternateName: ['Od Jonathan Porter', 'O D Porter'],
        url: 'https://www.imglikeness.com/od-jonathan-porter',
        founderOf: { '@id': 'https://porterful.com/#music-group' },
      },
    },
  ],
}

// HowTo schema for Google rich results — mirrors the "How it works" 4-step section
const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to sell music and merch on Porterful',
  description: 'A step-by-step guide for independent artists to upload music, build products, sell direct, and track results on Porterful.',
  totalTime: 'PT0S',
  step: [
    {
      '@type': 'HowToStep',
      name: 'Upload Your Music',
      text: 'Drop your tracks. Set your price. Keep control of your catalog and rights.',
      image: 'https://porterful.com/og-image.png',
    },
    {
      '@type': 'HowToStep',
      name: 'Build Your Products',
      text: 'Create merch from your music — t-shirts, vinyl, accessories, and digital bundles.',
      image: 'https://porterful.com/og-image.png',
    },
    {
      '@type': 'HowToStep',
      name: 'Sell Direct to Fans',
      text: 'Your fans buy from you — no middleman, no platform lock-in. Your store, your rules.',
      image: 'https://porterful.com/og-image.png',
    },
    {
      '@type': 'HowToStep',
      name: 'Track Everything',
      text: 'See what sells, where, and why. Use real data to grow smarter every day.',
      image: 'https://porterful.com/og-image.png',
    },
  ],
}

// FAQ structured data for Google rich snippets
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How does Porterful work for artists?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Artists upload their music and merch to Porterful, set their prices, and sell directly to fans. Porterful handles payments, hosting, and delivery. Artists keep 80% of every sale — more than 10x what major streaming platforms pay.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does it cost to sell on Porterful?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It\'s free to start selling on Porterful. There are no upfront fees, monthly subscriptions, or hidden costs. We take a small cut (20%) only when you make a sale.',
      },
    },
    {
      '@type': 'Question',
      name: 'What can artists sell on Porterful?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Artists can sell music (albums, singles, bundles), merchandise (t-shirts, hoodies, accessories), digital products, and exclusive fan experiences. Physical products are print-on-demand and ship directly to fans.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do fans benefit from Porterful?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Fans get direct access to their favorite artists — no middlemen, no algorithms deciding what they hear. Fans can stream music for free, buy official merch, unlock exclusive content, and support artists they love with knowing that more of their money goes directly to the creator.',
      },
    },
    {
      '@type': 'Question',
      name: 'What makes Porterful different from Spotify or Apple Music?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Unlike major streaming platforms that pay artists fractions of a cent per stream, Porterful lets artists sell directly to fans and keep 80%. There\'s no label, no middleman, and no contract. Artists own their music and their relationship with fans.',
      },
    },
  ],
}

// Force dynamic rendering so homepage always shows fresh content (no stale ISR cache)
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Porterful — Music, Merch, and Direct Support',
  description: 'Music, merch, and direct support for independent artists. Upload your music, sell merch, and connect directly with fans.',
  openGraph: {
    title: 'Porterful — Where Artists Own Everything',
    description: 'Sell music and merch. Keep 80% of every sale. No label. No middleman.',
    url: 'https://porterful.com',
    siteName: 'Porterful',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://porterful.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Porterful — Where Artists Own Everything',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Porterful — Where Artists Own Everything',
    description: 'Sell music and merch. Keep 80% of every sale. No label. No middleman.',
    images: ['https://porterful.com/og-image.png'],
    creator: '@odporter',
  },
  keywords: [
    'independent music',
    'music streaming',
    'artist merchandise',
    'buy music directly',
    'support independent artists',
    'music marketplace',
    'artist platform',
    'stream music',
    'buy merch',
    'direct to fan',
  ],
  alternates: {
    canonical: 'https://porterful.com',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <HomeClient />
    </>
  )
}
