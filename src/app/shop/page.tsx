import ShopClient from './ShopClient'
import Script from 'next/script'
import type { Metadata } from 'next'

// Force fresh render on every request — prevents Vercel Edge ISR cache from
// serving a stale redirect when the redirect config changes.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Shop — Merch & Music from Independent Artists | Porterful',
  description: 'Browse tees, hoodies, vinyl, and more from independent artists. 80% of every sale goes directly to creators. Free shipping on orders over $50.',
  keywords: ['artist merch', 'independent music', 'band t-shirts', 'vinyl records', 'hoodies', 'custom apparel', 'support artists', 'direct to fan'],
  alternates: {
    canonical: 'https://porterful.com/shop',
  },
  openGraph: {
    title: 'Shop | Porterful',
    description: 'Merch & music from independent artists. 80% of every sale supports creators directly.',
    url: 'https://porterful.com/shop',
    siteName: 'Porterful',
    type: 'website',
    images: [
      {
        url: 'https://porterful.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Shop Porterful — Independent Artist Merch & Music',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop | Porterful',
    description: 'Merch & music from independent artists. 80% of every sale supports creators directly.',
    images: ['https://porterful.com/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://porterful.com' },
    { '@type': 'ListItem', position: 2, name: 'Shop', item: 'https://porterful.com/shop' },
  ],
}

export default function ShopPage() {
  return (
    <>
      <Script
        id="shop-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ShopClient />
    </>
  )
}
