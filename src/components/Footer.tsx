'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Footer() {
  const pathname = usePathname()
  const hideOnTapRoute = pathname.startsWith('/tap')

  if (hideOnTapRoute) {
    return null
  }

  const links = [
    { href: '/music', label: 'Music' },
    { href: '/store', label: 'Store' },
    { href: '/artists', label: 'Artists' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <footer className="border-t border-[var(--pf-border)] bg-[var(--pf-bg-secondary)] py-8 mt-12">
      <div className="max-w-6xl mx-auto px-6 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="font-bold text-lg text-[var(--pf-text)]">Porterful</h3>
          <p className="text-[var(--pf-text-secondary)] text-sm mt-1">
            Music. Directly from the artists.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-[var(--pf-text-secondary)] hover:text-[var(--pf-text)] transition-colors">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
