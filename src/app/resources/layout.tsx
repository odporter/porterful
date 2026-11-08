import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Resources for Artists — Porterful',
  description: 'Tools, platforms, and guides to help you manage money, build credit, and run your creative business. Free resources for independent artists.',
  openGraph: {
    title: 'Resources for Artists — Porterful',
    description: 'Tools, platforms, and guides to help you manage money, build credit, and run your creative business.',
    url: 'https://porterful.com/resources',
    siteName: 'Porterful',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Resources for Artists — Porterful',
    description: 'Tools, platforms, and guides to help you manage money, build credit, and run your creative business.',
  },
  alternates: {
    canonical: 'https://porterful.com/resources',
  },
}

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
