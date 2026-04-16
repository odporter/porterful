'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

// Fallback page component — route.ts handles HTTP GET at /auth/callback server-side.
// This client component exists in case client-side navigation needs a page component.
export default function CallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const error = searchParams.get('error')
    if (error) {
      router.replace('/login?error=' + encodeURIComponent(error))
      return
    }
    const code = searchParams.get('code')
    if (!code) {
      router.replace('/login?error=no_code')
      return
    }
    router.replace('/login')
  }, [searchParams])

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 flex items-center justify-center">
      <div className="max-w-md w-full text-center">
        <div className="text-5xl mb-6 animate-pulse">🔑</div>
        <h1 className="text-2xl font-bold mb-2">Signing you in…</h1>
        <p className="text-[var(--pf-text-secondary)]">Completing your sign-in — one moment.</p>
      </div>
    </div>
  )
}