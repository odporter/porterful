import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Porterful Land Division — Off-Market Land Deals',
  description: 'Get early access to off-market land opportunities and proprietary land intelligence from Porterful\'s Land Division.',
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Porterful Land Division — Off-Market Land Deals',
    description: 'Get early access to off-market land opportunities.',
    type: 'website',
  },
}

export default function LandLayout({ children }: { children: React.ReactNode }) {
  return children
}
