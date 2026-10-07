import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Porterful Ecosystem — Five Systems. One Mission.',
  description: 'The Porterful Ecosystem: LAND, MIND, LAW, COMMERCE, and CREDIT — five independent systems working toward one shared mission: ownership and agency for creators.',
  openGraph: {
    title: 'The Porterful Ecosystem',
    description: 'Five systems. One mission. LAND, MIND, LAW, COMMERCE, and CREDIT — building the ownership economy for creators.',
    url: 'https://porterful.com/ecosystem',
    siteName: 'Porterful',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'The Porterful Ecosystem',
    description: 'Five systems. One mission. LAND, MIND, LAW, COMMERCE, and CREDIT — building the ownership economy for creators.',
  },
  alternates: {
    canonical: 'https://porterful.com/ecosystem',
  },
}

export default function EcosystemLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
