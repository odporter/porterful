'use client'

import { useState } from 'react'
import { Mail, ArrowRight, Check } from 'lucide-react'

interface EmailCaptureProps {
  source?: string
  heading?: string
  subtext?: string
  dark?: boolean
}

export function EmailCapture({
  source = 'homepage',
  heading = 'Stay in the loop',
  subtext = 'Get first access to new music, drops, and exclusive content from O D Porter and the Porterful artist community.',
  dark = false,
}: EmailCaptureProps) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || loading) return

    setLoading(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      })
      if (res.ok) {
        setSubmitted(true)
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
        <div className="flex items-center justify-center gap-2 text-green-400 font-bold mb-1">
          <Check size={16} /> You’re on the list!
        </div>
        <p className="text-sm text-[var(--pf-text-muted)]">
          We’ll send updates to {email}. Check your inbox soon.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md mx-auto">
      <div className="relative flex-1">
        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--pf-text-muted)]" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm ${
            dark
              ? 'bg-black/40 border border-white/20 text-white placeholder-gray-500 focus:border-orange-400'
              : 'bg-[var(--pf-surface)] border border-[var(--pf-border)] text-white placeholder-gray-500 focus:border-[var(--pf-orange)]'
          } border focus:outline-none transition-colors`}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="px-5 py-3 bg-[var(--pf-orange)] hover:bg-[var(--pf-orange-dark)] text-white font-bold rounded-xl transition-colors text-sm flex items-center gap-2 disabled:opacity-60"
      >
        {loading ? '...' : <>Join <ArrowRight size={14} /></>}
      </button>
    </form>
  )
}
