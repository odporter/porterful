'use client'

import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'

interface LikenessGateProps {
  action: 'sell' | 'upload' | 'payout'
  children: React.ReactNode
}

/**
 * LikenessGate — Monetization enforcement UI
 * 
 * Shows a blocking message when an artist tries to monetize
 * without verified Likeness ownership.
 * 
 * action: which action was blocked — affects message text
 */
export function LikenessGate({ action, children }: LikenessGateProps) {
  // In Phase 1, this is always open — Likeness fields don't exist in DB yet.
  // The actual gate is in the API layer. This component is a placeholder
  // for the UI that will be wired up in Phase 2.
  return <>{children}</>
}

/**
 * Likeness Verification Status Badge
 * 
 * Shows the Likeness Verified badge when an artist is verified.
 * Used in artist profile headers and cards.
 */
export function LikenessBadge({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <span
        title="Identity and likeness ownership verified through the Likeness™ registry"
        className="inline-flex items-center gap-1 text-[var(--pf-orange)]"
        aria-label="Likeness Verified"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10" opacity="0.2" />
          <path d="M12 3a9 9 0 1 0 0 18A9 9 0 0 0 12 3zm-1 4.5l5.5 5.5-1.5 1.5-4-4-2 2V10h3v-2.5H11.5z" />
        </svg>
      </span>
    )
  }

  return (
    <span
      title="Identity and likeness ownership verified through the Likeness™ registry"
      className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--pf-orange)] bg-[var(--pf-orange)]/10 px-2.5 py-1 rounded-full border border-[var(--pf-orange)]/20"
      aria-label="Likeness Verified"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="10" opacity="0.2" />
        <path d="M12 3a9 9 0 1 0 0 18A9 9 0 0 0 12 3zm-1 4.5l5.5 5.5-1.5 1.5-4-4-2 2V10h3v-2.5H11.5z" />
      </svg>
      Likeness Verified
    </span>
  )
}

/**
 * LikenessGateBlock — The blocking panel shown when action is denied.
 */
export function LikenessGateBlock({ action }: { action: 'sell' | 'upload' | 'payout' }) {
  const actionLabels: Record<string, string> = {
    sell: 'sell music or products',
    upload: 'upload tracks',
    payout: 'receive payouts',
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl bg-[var(--pf-surface)] border border-[var(--pf-orange)]/20">
      <div className="w-14 h-14 rounded-full bg-[var(--pf-orange)]/10 flex items-center justify-center mb-4">
        <ShieldCheck size={28} className="text-[var(--pf-orange)]" />
      </div>
      <h3 className="text-lg font-bold mb-2">Likeness Verification Required</h3>
      <p className="text-sm text-[var(--pf-text-secondary)] max-w-xs mb-5">
        You must verify ownership of your likeness before you can {actionLabels[action]}. This protects your identity and brand on Porterful.
      </p>
      <Link
        href="https://likenessverified.com/register"
        target="_blank"
        rel="noopener noreferrer"
        className="px-5 py-2.5 bg-[var(--pf-orange)] text-white text-sm font-semibold rounded-xl hover:bg-[var(--pf-orange-dark)] transition-colors"
      >
        Verify My Likeness
      </Link>
      <p className="text-xs text-[var(--pf-text-muted)] mt-3">
        Register at LikenessVerified.com — takes about 60 seconds
      </p>
    </div>
  )
}
