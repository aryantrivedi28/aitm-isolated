import { MetadataRoute } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://finzie.co'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/dashboard/',
          '/api/',
          '/src/app/admin-panel'
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}