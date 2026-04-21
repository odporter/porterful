import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Signal Shirt — Likeness™',
  description: 'Signal is part of Likeness™ — visit likenessverified.com/signal to learn more.',
}

export default function SignalPage() {
  return (
    <div className="min-h-screen bg-[var(--pf-bg)] pt-20">
      <div className="pf-container py-20">
        <div className="mx-auto max-w-lg text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--pf-orange)]">Likeness™</p>
          <h1 className="mt-4 text-4xl font-bold">Signal Shirt</h1>
          <p className="mt-4 text-lg text-[var(--pf-text-secondary)]">
            Signal is part of the Likeness™ ecosystem. It lives at Likeness, not Porterful.
          </p>
          <p className="mt-3 text-base text-[var(--pf-text-secondary)]">
            Visit the official Likeness site to explore Signal.
          </p>
          <a
            href="https://likenessverified.com/signal"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-[var(--pf-orange)] px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90"
          >
            Visit Likeness Signal
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </div>
  )
}