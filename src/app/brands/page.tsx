import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Brands',
  description: 'Discover independent brands building carefully and selling directly. Porterful only displays brands with an active public collection.',
  openGraph: {
    title: 'Brands | Porterful',
    description: 'Discover independent brands building carefully and selling directly.',
    url: 'https://porterful.com/brands',
    siteName: 'Porterful',
    type: 'website',
    images: [
      {
        url: 'https://porterful.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Brands on Porterful — Independent Brands Selling Direct',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brands | Porterful',
    description: 'Discover independent brands on Porterful.',
    images: ['https://porterful.com/og-image.png'],
  },
}

const brands = [
  {
    slug: 'noble-naturals',
    name: 'Noble Naturals™',
    category: 'Wellness & Hair Care',
    description: 'Natural hair care products crafted with premium ingredients for all hair types.',
    live: 0,
    preview: 3,
  },
]

export default function BrandsPage() {
  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="pf-container max-w-6xl">
        {/* Header */}
        <div className="mb-10 rounded-[32px] border border-[var(--pf-border)] bg-[var(--pf-surface)] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.1)] sm:p-12">
          <div className="flex items-center gap-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star text-[var(--pf-accent-text)]" aria-hidden="true">
              <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
            </svg>
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--pf-accent-text)]">Featured Brands</span>
          </div>
          <h1 className="mb-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Brands with a point of view.</h1>
          <p className="text-lg text-[var(--pf-text-secondary)] max-w-2xl">Independent brands building carefully and selling directly. Porterful only displays brands with an active public collection.</p>
        </div>

        {/* Brand Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <Link key={brand.slug} href={`/brands/${brand.slug}`} className="group block">
              <article className="h-full rounded-[24px] border border-[var(--pf-border)] bg-[var(--pf-surface)] p-6 transition-all hover:border-[var(--pf-orange)]/30 hover:shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-[var(--pf-border)] bg-[var(--pf-bg)]">
                    <Image
                      src={`/brand/${brand.slug}-mark.svg`}
                      alt={`${brand.name} logo`}
                      fill
                      className="object-contain p-2"
                      sizes="64px"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold group-hover:text-[var(--pf-accent-text)] transition-colors">{brand.name}</h2>
                    <p className="text-sm text-[var(--pf-accent-text)]">{brand.category}</p>
                  </div>
                </div>
                <p className="text-sm text-[var(--pf-text-secondary)] mb-4 line-clamp-2">{brand.description}</p>
                <div className="flex items-center gap-4 text-xs text-[var(--pf-text-muted)]">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                    {brand.live} Live
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--pf-text-muted)]"></span>
                    {brand.preview} Preview
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-[var(--pf-accent-text)]">
                  Explore {brand.name}
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right transition-transform group-hover:translate-x-1" aria-hidden="true">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
