import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Music — Stream & Buy Tracks | Porterful',
  description: 'Stream and buy music directly from independent artists. Your purchase supports the creators you love.',
  openGraph: {
    title: 'Music | Porterful',
    description: 'Stream and buy music directly from independent artists.',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Porterful - Music for Independent Artists' }],
  },
  twitter: { card: 'summary_large_image', title: 'Music | Porterful', description: 'Stream and buy music directly from independent artists. 80% goes to artists.' },
  alternates: { canonical: 'https://porterful.com/music' },
}

export default function DigitalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
