import { Metadata } from 'next'
import ContactClient from './ContactClient'

export const metadata: Metadata = {
  title: 'Contact Porterful — Get in Touch',
  description: 'Get in touch with the Porterful team. Questions, partnerships, artist applications, and customer support. We respond within 24 hours.',
  alternates: { canonical: 'https://porterful.com/contact' },
  openGraph: {
    title: 'Contact Porterful — Get in Touch',
    description: 'Get in touch with the Porterful team. Questions, partnerships, artist applications, and customer support.',
    url: 'https://porterful.com/contact',
    siteName: 'Porterful',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://porterful.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Contact Porterful',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Porterful',
    description: 'Get in touch with the Porterful team.',
    images: ['https://porterful.com/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function ContactPage() {
  return <ContactClient />
}
