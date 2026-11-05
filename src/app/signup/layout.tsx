import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up — Join Porterful',
  description: 'Create your free Porterful account and start selling music and merchandise as an independent artist. No upfront costs, just your art.',
  openGraph: {
    title: 'Sign Up — Join Porterful',
    description: 'Create your free Porterful account and start selling music and merchandise as an independent artist. No upfront costs, just your art.',
    url: 'https://porterful.com/signup',
    siteName: 'Porterful',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Sign Up — Join Porterful',
    description: 'Create your free Porterful account and start selling music and merchandise as an independent artist.',
  },
}

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
