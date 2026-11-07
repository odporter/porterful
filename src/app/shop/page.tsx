import { Metadata } from 'next'
import ShopClient from './ShopClient'

// Force fresh render on every request — prevents Vercel Edge ISR cache from
// serving a stale redirect when the redirect config changes.
export const dynamic = 'force-dynamic'

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
  // Dynamic export ensures this page is never statically generated or ISR-cached.
  // This prevents stale redirects from being baked in at build time.
  return <ShopClient />
}
