import { NextResponse } from 'next/server'
import { ALBUMS } from '@/lib/data'
import { ARTISTS } from '@/lib/artists'

// Force dynamic — never ISR cached by Vercel Edge
export const dynamic = 'force-dynamic'

// Album slugs derived from ALBUMS data (single source of truth)
const ALBUM_SLUGS = Object.values(ALBUMS).map(album => album.id)

// Artist slugs derived from ARTISTS data (single source of truth)
const ARTIST_SLUGS = Object.values(ARTISTS).map(artist => artist.slug)

// Generate sitemap entries — clean canonical URLs only (no query params in <loc>)
function generateSitemap(): Array<{ url: string; lastMod: string; changeFreq: string; priority: number }> {
  const base = 'https://porterful.com'
  const today = new Date().toISOString().split('T')[0]

  const entries: Array<{ url: string; lastMod: string; changeFreq: string; priority: number }> = []

  // ── High-priority pages ──────────────────────────────────────────────
  entries.push(
    { url: `${base}/`, lastMod: today, changeFreq: 'daily', priority: 1.0 },
    { url: `${base}/digital`, lastMod: today, changeFreq: 'weekly', priority: 0.9 },
    { url: `${base}/shop`, lastMod: today, changeFreq: 'weekly', priority: 0.9 },
    // NOTE: /store and /music are excluded — they permanently redirect (avoids duplicate canonical)
    { url: `${base}/artists`, lastMod: today, changeFreq: 'weekly', priority: 0.9 },
  )

  // ── Artist detail pages ──────────────────────────────────────────────
  for (const slug of ARTIST_SLUGS) {
    entries.push({ url: `${base}/artist/${slug}`, lastMod: today, changeFreq: 'weekly', priority: 0.8 })
  }

  // ── Album pages ──────────────────────────────────────────────────────
  for (const slug of ALBUM_SLUGS) {
    entries.push({ url: `${base}/album/${slug}`, lastMod: today, changeFreq: 'weekly', priority: 0.7 })
  }

  // ── App / feature pages ──────────────────────────────────────────────
  entries.push(
    { url: `${base}/tap`, lastMod: today, changeFreq: 'weekly', priority: 0.8 },
    { url: `${base}/radio`, lastMod: today, changeFreq: 'weekly', priority: 0.8 },
    { url: `${base}/playlists`, lastMod: today, changeFreq: 'weekly', priority: 0.8 },
    { url: `${base}/trending`, lastMod: today, changeFreq: 'weekly', priority: 0.8 },
    { url: `${base}/superfan`, lastMod: today, changeFreq: 'weekly', priority: 0.8 },
    { url: `${base}/learn`, lastMod: today, changeFreq: 'weekly', priority: 0.8 },
    { url: `${base}/brands`, lastMod: today, changeFreq: 'weekly', priority: 0.8 },
    // NOTE: /competition is excluded — it permanently redirects to /apply (avoids duplicate canonical)
  )

  // ── Dashboard pages (noindex in robots.txt but useful to have in sitemap) ──
  entries.push(
    { url: `${base}/dashboard`, lastMod: today, changeFreq: 'weekly', priority: 0.6 },
    { url: `${base}/dashboard/artist`, lastMod: today, changeFreq: 'weekly', priority: 0.6 },
    { url: `${base}/dashboard/upload`, lastMod: today, changeFreq: 'weekly', priority: 0.6 },
    { url: `${base}/cart`, lastMod: today, changeFreq: 'weekly', priority: 0.6 },
  )

  // ── Marketing / static pages ─────────────────────────────────────────
  entries.push(
    { url: `${base}/about`, lastMod: today, changeFreq: 'monthly', priority: 0.7 },
    { url: `${base}/contact`, lastMod: today, changeFreq: 'monthly', priority: 0.7 },
    { url: `${base}/faq`, lastMod: today, changeFreq: 'monthly', priority: 0.7 },
    { url: `${base}/support`, lastMod: today, changeFreq: 'monthly', priority: 0.7 },
    { url: `${base}/apply`, lastMod: today, changeFreq: 'weekly', priority: 0.8 },
    { url: `${base}/signup`, lastMod: today, changeFreq: 'weekly', priority: 0.8 },
    { url: `${base}/signup/superfan`, lastMod: today, changeFreq: 'weekly', priority: 0.8 },
    { url: `${base}/land`, lastMod: today, changeFreq: 'monthly', priority: 0.6 },
    { url: `${base}/resources`, lastMod: today, changeFreq: 'monthly', priority: 0.6 },
    { url: `${base}/ecosystem`, lastMod: today, changeFreq: 'monthly', priority: 0.6 },
    { url: `${base}/systems`, lastMod: today, changeFreq: 'monthly', priority: 0.6 },
    { url: `${base}/challenge`, lastMod: today, changeFreq: 'weekly', priority: 0.7 },
    { url: `${base}/onboarding`, lastMod: today, changeFreq: 'monthly', priority: 0.5 },
    { url: `${base}/press-kit`, lastMod: today, changeFreq: 'monthly', priority: 0.5 },
  )

  // ── Legal pages ──────────────────────────────────────────────────────
  entries.push(
    { url: `${base}/terms`, lastMod: today, changeFreq: 'yearly', priority: 0.4 },
    { url: `${base}/privacy`, lastMod: today, changeFreq: 'yearly', priority: 0.4 },
    { url: `${base}/refund`, lastMod: today, changeFreq: 'yearly', priority: 0.4 },
    { url: `${base}/dmca`, lastMod: today, changeFreq: 'yearly', priority: 0.4 },
    { url: `${base}/moral-policy`, lastMod: today, changeFreq: 'yearly', priority: 0.4 },
  )

  return entries
}

export async function GET(): Promise<NextResponse> {
  const sitemap = generateSitemap()
  const generated = new Date().toISOString()

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
>
<!-- Generated: ${generated} -->
<!-- Porterful — Music, merch, and direct support for independent artists -->
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
      'Content-Type': 'application/xml; charset=utf-8',
      // Prevent Vercel Edge caching so lastmod always reflects today
      // x-vercel-cache headers must be set at the route level (not just vercel.json) to bypass Edge cache
      'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Vary': '*',
      'X-Robots-Tag': 'index, follow',
      'x-vercel-cache': 'BYPASS',
      'x-vercel-set-bypass-cache': 'true',
    },
  })
}
