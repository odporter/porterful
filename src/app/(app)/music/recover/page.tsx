'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Music, Download, AlertCircle, Loader2 } from 'lucide-react'

interface RecoveryState {
  loading: boolean
  error: string | null
  track: {
    title: string
    artist: string
    downloadUrl: string
    expiresIn: number
  } | null
}

function RecoveryContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [state, setState] = useState<RecoveryState>({
    loading: true,
    error: null,
    track: null,
  })

  useEffect(() => {
    if (!token) {
      setState({ loading: false, error: 'No recovery token provided.', track: null })
      return
    }

    fetch(`/api/music/recover?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setState({ loading: false, error: data.error, track: null })
        } else {
          setState({
            loading: false,
            error: null,
            track: {
              title: data.trackTitle,
              artist: data.artist,
              downloadUrl: data.downloadUrl,
              expiresIn: data.expiresIn,
            },
          })
        }
      })
      .catch(() => {
        setState({ loading: false, error: 'Failed to recover track access.', track: null })
      })
  }, [token])

  if (state.loading) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">
        <div className="flex items-center gap-3 text-[var(--pf-text-muted)]">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-sm">Recovering your track...</span>
        </div>
      </div>
    )
  }

  if (state.error) {
    return (
      <div className="min-h-screen pt-20 pb-12 px-4">
        <div className="max-w-md mx-auto mt-12">
          <div className="bg-[var(--pf-surface)] rounded-2xl p-6 border border-red-500/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                <AlertCircle size={20} className="text-red-400" />
              </div>
              <h1 className="text-lg font-bold">Access Link Expired</h1>
            </div>
            <p className="text-sm text-[var(--pf-text-secondary)] mb-4">{state.error}</p>
            <p className="text-xs text-[var(--pf-text-muted)]">
              Recovery links expire after 7 days. If you purchased this track, sign in to your Porterful account to access it.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!state.track) return null

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-md mx-auto mt-12">
        <div className="bg-[var(--pf-surface)] rounded-2xl p-6 border border-[var(--pf-border)]">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--pf-orange)]/20 flex items-center justify-center">
              <Music size={32} className="text-[var(--pf-orange)]" />
            </div>
            <h1 className="text-xl font-bold mb-1">Your Track is Ready</h1>
            <p className="text-sm text-[var(--pf-text-secondary)]">
              {state.track.title} by {state.track.artist}
            </p>
          </div>

          <a
            href={`/api/music/download-proxy?token=${token}`}
            className="w-full py-3 rounded-xl bg-[var(--pf-orange)] text-white font-semibold flex items-center justify-center gap-2 hover:bg-[var(--pf-orange-dark)] transition-colors"
          >
            <Download size={18} />
            Download MP3
          </a>

          <p className="text-xs text-[var(--pf-text-muted)] text-center mt-3">
            Link expires in {Math.round(state.track.expiresIn / 60)} minutes.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function MusicRecoverPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">
          <div className="flex items-center gap-3 text-[var(--pf-text-muted)]">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm">Loading...</span>
          </div>
        </div>
      }
    >
      <RecoveryContent />
    </Suspense>
  )
}
