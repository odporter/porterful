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
