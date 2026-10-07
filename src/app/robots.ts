import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/checkout/', '/dashboard/', '/_next/', '/static/'],
      },
    ],
    sitemap: 'https://porterful.com/sitemap.xml',
  }
}