'use client'

import { Heart, ShoppingBag, Share2 } from 'lucide-react'
import Link from 'next/link'

interface ArtistSupportCardProps {
  artist: {
    name: string
    slug: string
    verified: boolean
  }
}

export function ArtistSupportCard({ artist }: ArtistSupportCardProps) {
  return (
    <div className="bg-[var(--pf-surface)] rounded-2xl p-6 border border-[var(--pf-border)]">
      <p className="text-sm uppercase tracking-widest text-[var(--pf-orange)] mb-4">Support {artist.name.split(' ')[0]}</p>

      <div className="space-y-3">
        {/* Proud to Pay */}
        <Link
          href="/proud-to-pay"
          className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-[var(--pf-orange)]/10 to-purple-600/10 border border-[var(--pf-orange)]/20 hover:border-[var(--pf-orange)]/40 transition-colors group"
        >
          <Heart size={20} className="text-[var(--pf-orange)] shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">Proud to Pay</p>
            <p className="text-xs text-[var(--pf-text-muted)]">Support directly, own a piece</p>
          </div>
          <Share2 size={16} className="text-[var(--pf-text-muted)] group-hover:text-[var(--pf-orange)] transition-colors" />
        </Link>

        {/* Buy Music */}
        <Link
          href="/music"
          className="flex items-center gap-3 p-4 rounded-xl bg-[var(--pf-bg)] border border-[var(--pf-border)] hover:border-[var(--pf-orange)]/40 transition-colors group"
        >
          <ShoppingBag size={20} className="text-[var(--pf-text-muted)] shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">Buy Music</p>
            <p className="text-xs text-[var(--pf-text-muted)]">80% goes straight to {artist.name.split(' ')[0]}</p>
          </div>
          <Share2 size={16} className="text-[var(--pf-text-muted)] group-hover:text-[var(--pf-orange)] transition-colors" />
        </Link>

        {/* Share */}
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: artist.name, url: window.location.href })
            } else {
              navigator.clipboard.writeText(window.location.href)
            }
          }}
          className="w-full flex items-center gap-3 p-4 rounded-xl bg-[var(--pf-bg)] border border-[var(--pf-border)] hover:border-[var(--pf-orange)]/40 transition-colors"
        >
          <Share2 size={20} className="text-[var(--pf-text-muted)] shrink-0" />
          <div className="flex-1 text-left">
            <p className="font-medium text-sm">Share Artist</p>
            <p className="text-xs text-[var(--pf-text-muted)]">Spread the word</p>
          </div>
        </button>
      </div>

      {/* Revenue split reminder */}
      <div className="mt-4 pt-4 border-t border-[var(--pf-border)]">
        <p className="text-xs text-[var(--pf-text-muted)] text-center">
          <span className="text-[var(--pf-orange)] font-semibold">80%</span> of every purchase goes to {artist.name.split(' ')[0]}. Always.
        </p>
      </div>
    </div>
  )
}
