import { Metadata } from 'next'
import ShopClient from './ShopClient'
import Script from 'next/script'

// Force fresh render on every request — prevents Vercel Edge ISR cache from
// serving a stale redirect when the redirect config changes.
export const dynamic = 'force-dynamic'

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://porterful.com' },
    { '@type': 'ListItem', position: 2, name: 'Shop', item: 'https://porterful.com/shop' },
  ],
}

export const metadata: Metadata = {
  title: 'Shop Merch - Official Artist Merchandise',
  description: 'Browse official merchandise from your favorite independent artists. T-shirts, hoodies, vinyl, posters, and more. 80% goes directly to artists.',
  keywords: ['artist merchandise', 'band merch', 'music merch', 'vinyl', 't-shirts', 'hoodies', 'independent artist merch', 'artist shop'],
  openGraph: {
    title: 'Shop Merch - Porterful',
    description: 'Official artist merchandise. Support independent artists directly.',
    images: ['https://porterful.com/og-image.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop Merch - Porterful',
    description: 'Official artist merchandise. Support independent artists directly.',
  },
  alternates: {
    canonical: 'https://porterful.com/shop',
  },
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
