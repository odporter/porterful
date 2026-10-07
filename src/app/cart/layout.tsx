import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Your Cart — Porterful',
  description: 'Review your cart before checkout. Every purchase supports independent artists — 80% of every sale goes directly to creators.',
  alternates: { canonical: 'https://porterful.com/cart' },
  openGraph: {
    title: 'Your Cart — Porterful',
    description: 'Review your cart before checkout. Every purchase supports independent artists.',
    url: 'https://porterful.com/cart',
    siteName: 'Porterful',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://porterful.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Your Cart — Porterful',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your Cart — Porterful',
    description: 'Review your cart before checkout. Every purchase supports independent artists.',
    images: ['https://porterful.com/og-image.png'],
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
