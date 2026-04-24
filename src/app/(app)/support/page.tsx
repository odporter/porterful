'use client'

import { useState } from 'react'
import { Check, Heart, Search } from 'lucide-react'

const SUPPORT_ARTISTS = [
  { id: 'od-porter', name: 'O D Porter', genre: 'Hip-Hop / R&B', location: 'St. Louis, MO', verified: true },
]

type Artist = typeof SUPPORT_ARTISTS[number]

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null)
  const [loading, setLoading] = useState<number | null>(null)
  const supportAmounts = [1, 5, 10]

  const filteredArtists = SUPPORT_ARTISTS.filter((artist) =>
    artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    artist.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    artist.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSupport = async (amount: number) => {
    setLoading(amount)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{
            productId: `support-${selectedArtist?.id || 'default'}-${amount}`,
            name: `Support ${selectedArtist?.name || 'Any Artist'}`,
            artist: selectedArtist?.name || 'Various Artists',
            price: amount,
            quantity: 1,
            type: 'digital',
            image: '/logo.svg'
          }]
        })
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else if (data.demo) {
        window.location.href = '/checkout/success?demo=true'
      }
    } catch (error) {
      console.error('Checkout error:', error)
    }
    setLoading(null)
  }

  return (
    <div className="min-h-screen bg-[var(--pf-bg)] text-[var(--pf-text)] pt-24 pb-12">
      <div className="pf-container">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--pf-orange)]/30 bg-[var(--pf-orange)]/10 px-4 py-2 text-sm font-medium text-[var(--pf-orange)]">
            <Heart size={16} />
            Support
          </span>
          <h1 className="mt-4 text-4xl font-bold md:text-6xl">
            Support an artist.
            <br />
            <span className="text-[var(--pf-orange)]">Pick an amount.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-xl text-[var(--pf-text-secondary)]">
            Choose someone, choose an amount, and tap in.
          </p>
        </div>

        <div className="mx-auto mb-12 max-w-xl">
          <h2 className="mb-4 text-center text-xl font-bold">Choose an artist</h2>
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--pf-text-muted)]" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search artists..."
              className="w-full rounded-xl border border-[var(--pf-border)] bg-[var(--pf-surface)] py-4 pl-12 pr-4 focus:border-[var(--pf-orange)] focus:outline-none"
            />
          </div>

          {selectedArtist && (
            <div className="mb-4 flex items-center justify-between rounded-xl border border-[var(--pf-orange)]/30 bg-[var(--pf-orange)]/10 p-4">
              <div>
                <p className="font-bold">
                  {selectedArtist.name} {selectedArtist.verified && <span className="text-blue-400">✓</span>}
                </p>
                <p className="text-sm text-[var(--pf-text-secondary)]">{selectedArtist.genre}</p>
              </div>
              <button onClick={() => setSelectedArtist(null)} className="text-[var(--pf-text-muted)] hover:text-[var(--pf-text)]">
                Clear
              </button>
            </div>
          )}

          <div className="grid max-h-64 grid-cols-1 gap-3 overflow-y-auto sm:grid-cols-2">
            {filteredArtists.map((artist) => (
              <button
                key={artist.id}
                onClick={() => setSelectedArtist(artist)}
                className={`rounded-xl border p-3 text-left transition-all ${
                  selectedArtist?.id === artist.id
                    ? 'border-[var(--pf-orange)] bg-[var(--pf-orange)]/20'
                    : 'border-[var(--pf-border)] bg-[var(--pf-surface)] hover:border-[var(--pf-orange)]/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎤</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{artist.name}</p>
                    <p className="truncate text-xs text-[var(--pf-text-muted)]">{artist.genre}</p>
                  </div>
                  {selectedArtist?.id === artist.id && <Check size={16} className="text-[var(--pf-orange)]" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mx-auto mb-16 max-w-4xl">
          <h2 className="mb-8 text-center text-2xl font-bold">Choose an amount</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {supportAmounts.map((amount) => (
              <div key={amount} className={`pf-card p-6 text-center ${amount === 5 ? 'border-2 border-[var(--pf-orange)]' : ''}`}>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--pf-orange)]/15">
                  <Heart className="text-[var(--pf-orange)]" size={28} />
                </div>
                <h3 className="mb-2 text-xl font-bold">Support</h3>
                <p className="mb-2 text-4xl font-bold">${amount}</p>
                <p className="mb-6 text-sm text-[var(--pf-text-muted)]">One-time support</p>
                <button
                  onClick={() => handleSupport(amount)}
                  disabled={loading === amount || !selectedArtist}
                  className="block w-full rounded-xl bg-[var(--pf-orange)] px-6 py-3 text-center font-medium text-[#111111] transition-colors hover:bg-[var(--pf-orange-light)] disabled:opacity-50"
                >
                  {loading === amount ? 'Processing...' : `Support $${amount}`}
                </button>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-sm text-[var(--pf-text-secondary)]">
            Choose an artist above, then pick an amount below.
          </p>
        </div>
      </div>
    </div>
  )
}
