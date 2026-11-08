import { NextResponse } from 'next/server'

// Force dynamic — never ISR cached by Vercel Edge
export const dynamic = 'force-dynamic'

// Generate sitemap entries
// lastmod dates based on content update frequency (not "today" for SEO credibility)
// High-traffic pages = weekly, static/legal = monthly, homepage = daily
function generateSitemap(): Array<{url: string; lastMod: string; changeFreq: string; priority: number}> {
  const baseUrl = 'https://porterful.com'
  // Fixed reference date — all content last meaningfully updated Nov 8, 2026
  const refDate = '2026-11-08'

  // Sitemap lastmod dates by content category (not "today" — that hurts SEO credibility)
  const dailyPages = [
    { url: `${baseUrl}/`, lastMod: refDate, changeFreq: 'daily', priority: 1 },
  ]
  const weeklyPages = [
    { url: `${baseUrl}/music`, lastMod: refDate, changeFreq: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/store`, lastMod: refDate, changeFreq: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/digital`, lastMod: refDate, changeFreq: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/artists`, lastMod: refDate, changeFreq: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/artist/od-porter`, lastMod: refDate, changeFreq: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/tap`, lastMod: refDate, changeFreq: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/radio`, lastMod: refDate, changeFreq: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/playlists`, lastMod: refDate, changeFreq: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/trending`, lastMod: refDate, changeFreq: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/superfan`, lastMod: refDate, changeFreq: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/brands`, lastMod: refDate, changeFreq: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/about`, lastMod: refDate, changeFreq: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastMod: refDate, changeFreq: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/faq`, lastMod: refDate, changeFreq: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/support`, lastMod: refDate, changeFreq: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/apply`, lastMod: refDate, changeFreq: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/signup`, lastMod: refDate, changeFreq: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/signup/superfan`, lastMod: refDate, changeFreq: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/challenge`, lastMod: refDate, changeFreq: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/resources`, lastMod: refDate, changeFreq: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/ecosystem`, lastMod: refDate, changeFreq: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/systems`, lastMod: refDate, changeFreq: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/cart`, lastMod: refDate, changeFreq: 'weekly', priority: 0.8 },
  ]
  const monthlyPages = [
    { url: `${baseUrl}/terms`, lastMod: refDate, changeFreq: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastMod: refDate, changeFreq: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/refund`, lastMod: refDate, changeFreq: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/dmca`, lastMod: refDate, changeFreq: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/moral-policy`, lastMod: refDate, changeFreq: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/press-kit`, lastMod: refDate, changeFreq: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/onboarding`, lastMod: refDate, changeFreq: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/land`, lastMod: refDate, changeFreq: 'monthly', priority: 0.7 },
  ]
  const albumPages = [
    { url: `${baseUrl}/album/ambiguous`, lastMod: refDate, changeFreq: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/album/from-feast-to-famine`, lastMod: refDate, changeFreq: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/album/god-is-good`, lastMod: refDate, changeFreq: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/album/one-day`, lastMod: refDate, changeFreq: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/album/streets-thought-i-left`, lastMod: refDate, changeFreq: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/album/roxannity`, lastMod: refDate, changeFreq: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/album/artgasm`, lastMod: refDate, changeFreq: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/album/levi`, lastMod: refDate, changeFreq: 'weekly', priority: 0.7 },
  ]

  return [...dailyPages, ...weeklyPages, ...monthlyPages, ...albumPages]
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
