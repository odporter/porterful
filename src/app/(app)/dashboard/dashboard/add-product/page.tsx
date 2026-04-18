'use client'
import { useEffect } from 'react'

export default function AddProductPage() {
  useEffect(() => {
    window.location.href = '/dashboard/dashboard/catalog'
  }, [])
  return (
    <div className="min-h-screen pt-20 pb-24 flex items-center justify-center">
      <div className="text-[var(--pf-text-muted)]">Redirecting...</div>
    </div>
  )
}
