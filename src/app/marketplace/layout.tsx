import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Marketplace | Porterful',
  description: 'Shop exclusive merchandise from independent artists on Porterful.',
  openGraph: {
    title: 'Marketplace | Porterful',
    description: 'Shop exclusive merchandise from independent artists.',
  },
}

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}