import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Providers } from '@/app/providers'
import { GlobalPlayer } from '@/components/GlobalPlayer'
import { getServerUser } from '@/lib/supabase-auth'

export const metadata: Metadata = {
  title: 'Porterful',
  description: 'Music. Land. Mind. Law. Commerce. Credit.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#000000',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const initialUser = await getServerUser()

  return (
    <html lang="en" suppressHydrationWarning style={{ background: '#0a0a0a' }}>
      <head>
        <meta name="theme-color" content="#0a0a0a" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg?v=2" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var key='theme';var saved=localStorage.getItem(key);var theme=(saved==='light'||saved==='dark')?saved:(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');var root=document.documentElement;root.classList.remove('dark','light');root.classList.add(theme);root.style.colorScheme=theme;var meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.setAttribute('content',theme==='dark'?'#0a0a0a':'#ffffff');}catch(e){}})();`,
          }}
        />
      </head>
      <body suppressHydrationWarning style={{ margin: 0, padding: 0, background: 'var(--pf-bg)', overflow: 'visible' }}>
        <Providers initialUser={initialUser}>
          {children}
          <GlobalPlayer />
        </Providers>
      </body>
    </html>
  )
}
