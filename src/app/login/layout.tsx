import { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Login - Porterful',
  description: 'Sign in to your Porterful account',
}

function LoadingLogin() {
  return (
    <div className="min-h-screen pt-20 pb-12 px-4 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[var(--pf-orange)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[var(--pf-text-muted)]">Loading...</p>
      </div>
    </div>
  )
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LoadingLogin />}>{children}</Suspense>
}
