import { NextResponse } from 'next/server'

// Force dynamic — never ISR cached by Vercel Edge
export const dynamic = 'force-dynamic'

// Generate sitemap entries
// Cache-busting strategy: each <loc> URL gets a daily query param (?d=YYYY-MM-DD)
// Vercel Edge caches by exact URL, so a new date = new cache key = fresh response
// The query param is stripped from canonical signals by search engines
function generateSitemap(): Array<{url: string; lastMod: string; changeFreq: string; priority: number}> {
  const baseUrl = 'https://porterful.com'
  const today = new Date().toISOString().split('T')[0]
  // Daily cache-busting suffix — creates unique edge cache key each day
  const cacheBust = `?d=${today}`

  return [
    { url: `${baseUrl}/`, lastMod: today, changeFreq: 'daily', priority: 1 },
    { url: `${baseUrl}/music${cacheBust}`, lastMod: today, changeFreq: 'daily', priority: 0.9 },
    { url: `${baseUrl}/store${cacheBust}`, lastMod: today, changeFreq: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/digital${cacheBust}`, lastMod: today, changeFreq: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/artists${cacheBust}`, lastMod: today, changeFreq: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/artist/od-porter${cacheBust}`, lastMod: today, changeFreq: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/tap${cacheBust}`, lastMod: today, changeFreq: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/radio${cacheBust}`, lastMod: today, changeFreq: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/playlists${cacheBust}`, lastMod: today, changeFreq: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/trending${cacheBust}`, lastMod: today, changeFreq: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/superfan${cacheBust}`, lastMod: today, changeFreq: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/brands${cacheBust}`, lastMod: today, changeFreq: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/about${cacheBust}`, lastMod: today, changeFreq: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/contact${cacheBust}`, lastMod: today, changeFreq: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/faq${cacheBust}`, lastMod: today, changeFreq: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/support${cacheBust}`, lastMod: today, changeFreq: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/signal${cacheBust}`, lastMod: today, changeFreq: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/apply${cacheBust}`, lastMod: today, changeFreq: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/land${cacheBust}`, lastMod: today, changeFreq: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/signup${cacheBust}`, lastMod: today, changeFreq: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/signup/superfan${cacheBust}`, lastMod: today, changeFreq: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/terms${cacheBust}`, lastMod: today, changeFreq: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy${cacheBust}`, lastMod: today, changeFreq: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/refund${cacheBust}`, lastMod: today, changeFreq: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/dmca${cacheBust}`, lastMod: today, changeFreq: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/moral-policy${cacheBust}`, lastMod: today, changeFreq: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/press-kit${cacheBust}`, lastMod: today, changeFreq: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/onboarding${cacheBust}`, lastMod: today, changeFreq: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/challenge${cacheBust}`, lastMod: today, changeFreq: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/resources${cacheBust}`, lastMod: today, changeFreq: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/ecosystem${cacheBust}`, lastMod: today, changeFreq: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/systems${cacheBust}`, lastMod: today, changeFreq: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/cart${cacheBust}`, lastMod: today, changeFreq: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/album/ambiguous${cacheBust}`, lastMod: today, changeFreq: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/album/from-feast-to-famine${cacheBust}`, lastMod: today, changeFreq: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/album/god-is-good${cacheBust}`, lastMod: today, changeFreq: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/album/one-day${cacheBust}`, lastMod: today, changeFreq: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/album/streets-thought-i-left${cacheBust}`, lastMod: today, changeFreq: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/album/roxannity${cacheBust}`, lastMod: today, changeFreq: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/album/artgasm${cacheBust}`, lastMod: today, changeFreq: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/album/levi${cacheBust}`, lastMod: today, changeFreq: 'weekly', priority: 0.7 },
  ]
}

export async function GET(): Promise<NextResponse> {
  const sitemap = generateSitemap()
  // Full ISO 8601 timestamp for @generated (sitemaps.org spec)
  const generated = new Date().toISOString()

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
>
<!-- Generated: ${generated} -->
${sitemap.map(entry => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastMod}</lastmod>
    <changefreq>${entry.changeFreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      // Aggressive cache-busting: no-cache forces revalidation on every request
      // Vary: * prevents cached variants from being served
      'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Vary': '*',
      'X-Robots-Tag': 'index, follow',
    },
  })
}
