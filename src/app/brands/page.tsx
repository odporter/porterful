import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Brands',
  description: 'Discover independent brands building carefully and selling directly. Porterful only displays brands with an active public collection.',
  openGraph: {
    title: 'Brands | Porterful',
    description: 'Discover independent brands building carefully and selling directly.',
    url: 'https://porterful.com/brands',
    siteName: 'Porterful',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brands | Porterful',
    description: 'Discover independent brands on Porterful.',
  },
}

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
        
        {/* Coming Soon */}
        <div className="text-center py-16">
          <p className="text-lg text-[var(--pf-text-secondary)]">More brands coming soon.</p>
          <p className="text-sm text-[var(--pf-text-muted)] mt-2">Check back as we onboard new independent brands.</p>
        </div>
      </div>
    </div>
  )
}
