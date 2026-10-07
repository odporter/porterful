import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us | Porterful',
  description: "Get in touch with the Porterful team. We're here to help independent artists sell music and merchandise with ease.",
  openGraph: {
    title: 'Contact Us | Porterful',
    description: "Get in touch with the Porterful team. We're here to help independent artists sell music and merchandise with ease.",
    url: 'https://porterful.com/contact',
    siteName: 'Porterful',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Contact Us | Porterful',
    description: "Get in touch with the Porterful team. We're here to help independent artists sell music and merchandise with ease.",
  },
}

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
