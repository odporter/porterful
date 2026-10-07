import type { Metadata } from 'next'
import Link from 'next/link'
import { Upload, Headphones, ShoppingCart, TrendingUp, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Apply as Artist',
  description: 'Join Porterful as an artist. Upload your music, sell merch, and keep 80% of every sale. No label, no middleman — direct from you to your fans.',
  openGraph: {
    title: 'Apply as Artist',
    description: 'Join Porterful as an artist. Keep 80% of every sale. No label, no middleman.',
    url: 'https://porterful.com/apply',
    siteName: 'Porterful',
    locale: 'en_US',
    type: 'website',
    images: [{ url: 'https://porterful.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Apply as Artist',
    description: 'Join Porterful as an artist. Keep 80% of every sale. No label, no middleman.',
    images: ['https://porterful.com/og-image.png'],
  },
  robots: { index: true, follow: true },
}

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-[var(--pf-bg)] pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--pf-orange)]/10 border border-[var(--pf-orange)]/30 rounded-full text-[var(--pf-orange)] text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Now Accepting Artists
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Join Porterful as an Artist
          </h1>
          <p className="text-xl text-[var(--pf-text-secondary)] max-w-2xl mx-auto">
            Upload your music. Sell merch. Keep 80% of every sale. Direct to your fans, no middleman.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-[var(--pf-surface)] border border-[var(--pf-border)] rounded-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-[var(--pf-orange)]/10 flex items-center justify-center mb-4">
              <Upload className="w-6 h-6 text-[var(--pf-orange)]" />
            </div>
            <h3 className="font-semibold text-white mb-2">Upload Music</h3>
            <p className="text-sm text-[var(--pf-text-secondary)]">Drop your tracks, set your price, keep control of your catalog.</p>
          </div>
          <div className="bg-[var(--pf-surface)] border border-[var(--pf-border)] rounded-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-[var(--pf-orange)]/10 flex items-center justify-center mb-4">
              <ShoppingCart className="w-6 h-6 text-[var(--pf-orange)]" />
            </div>
            <h3 className="font-semibold text-white mb-2">Sell Merch</h3>
            <p className="text-sm text-[var(--pf-text-secondary)]">Create t-shirts, vinyl, and more from your music. One platform.</p>
          </div>
          <div className="bg-[var(--pf-surface)] border border-[var(--pf-border)] rounded-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-[var(--pf-orange)]/10 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-[var(--pf-orange)]" />
            </div>
            <h3 className="font-semibold text-white mb-2">Track Sales</h3>
            <p className="text-sm text-[var(--pf-text-secondary)]">Full analytics on who buys, where, and why. Grow with data.</p>
          </div>
          <div className="bg-[var(--pf-surface)] border border-[var(--pf-border)] rounded-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-[var(--pf-orange)]/10 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-[var(--pf-orange)]" />
            </div>
            <h3 className="font-semibold text-white mb-2">Keep 80%</h3>
            <p className="text-sm text-[var(--pf-text-secondary)]">The highest revenue share in independent music. You earn more.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-[var(--pf-orange)]/10 to-purple-500/10 rounded-2xl border border-[var(--pf-border)] p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to join?</h2>
          <p className="text-[var(--pf-text-secondary)] mb-8 max-w-lg mx-auto">
            Apply now to become a founding beta artist on Porterful. Limited spots available.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/signup?role=artist" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--pf-orange)] text-white font-bold rounded-full hover:bg-[var(--pf-orange)]/90 transition-colors"
            >
              Apply Now — Free
            </Link>
            <Link 
              href="/artists" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-[var(--pf-border)] bg-[var(--pf-surface)] text-[var(--pf-text)] font-medium rounded-full hover:border-[var(--pf-text-muted)] transition-colors"
            >
              View Existing Artists
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-[var(--pf-surface)] border border-[var(--pf-border)] rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">How much does it cost?</h3>
              <p className="text-sm text-[var(--pf-text-secondary)]">Free to join as a founding beta artist. No upfront fees.</p>
            </div>
            <div className="bg-[var(--pf-surface)] border border-[var(--pf-border)] rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">How does the 80% revenue share work?</h3>
              <p className="text-sm text-[var(--pf-text-secondary)]">You keep 80% of every sale. Porterful takes 20% to keep the platform running.</p>
            </div>
            <div className="bg-[var(--pf-surface)] border border-[var(--pf-border)] rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">What music formats do you support?</h3>
              <p className="text-sm text-[var(--pf-text-secondary)]">MP3, WAV, FLAC, and AIFF. High-quality audio recommended.</p>
            </div>
            <div className="bg-[var(--pf-surface)] border border-[var(--pf-border)] rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">Can I sell physical merch too?</h3>
              <p className="text-sm text-[var(--pf-text-secondary)]">Yes! Create t-shirts, vinyl records, posters, and more directly from your artist dashboard.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
