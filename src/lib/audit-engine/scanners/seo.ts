import * as cheerio from 'cheerio'
import { SEOMetrics, AuditIssue } from '../types'

export class SEOScanner {

  static async scan(html: string, pageUrl: string): Promise<{
    metrics: SEOMetrics
    issues: AuditIssue[]
  }> {
    const $ = cheerio.load(html)

    console.log('🔍 SEO Scan started for:', pageUrl)

    const metrics = this.calculateSEOMetrics($, html, pageUrl)
    const issues = this.generateSEOIssues($, metrics)

    console.log('✅ SEO Metrics:', metrics)
    console.log('⚠️ SEO Issues:', issues.length)

    return { metrics, issues }
  }

  private static calculateSEOMetrics(
    $: ReturnType<typeof cheerio.load>,
    html: string,
    pageUrl: string
  ): SEOMetrics {

    const hostname = new URL(pageUrl).hostname

    // Meta tags
    const metaTitle = $('title').text().trim()
    const metaDescription = $('meta[name="description"]').attr('content') || ''

    // Headings
    const h1Count = $('h1').length
    const h2Count = $('h2').length
    const h3Count = $('h3').length

    // Structured data
    const structuredData = this.checkStructuredData(html)

    // Links
    let internalLinks = 0
    let externalLinks = 0

    $('a[href]').each((_, el) => {
      const href = $(el).attr('href')
      if (!href) return

      // Relative links → internal
      if (href.startsWith('/')) {
        internalLinks++
        return
      }

      // Absolute links
      if (href.startsWith('http')) {
        try {
          const linkHost = new URL(href).hostname
          linkHost === hostname ? internalLinks++ : externalLinks++
        } catch {
          // ignore malformed URLs
        }
      }
    })

    // Canonical
    const canonicalUrl = $('link[rel="canonical"]').attr('href') || ''

    // Robots & sitemap (placeholders)
    const robotsTxt = { present: false, valid: false }
    const sitemap = { present: false, valid: false }

    // SEO score
    let score = 100
    if (!metaTitle) score -= 15
    if (!metaDescription) score -= 10
    if (metaTitle.length > 60) score -= 5
    if (metaDescription.length > 160) score -= 5
    if (h1Count !== 1) score -= 10
    if (!structuredData.present) score -= 5
    if (!canonicalUrl) score -= 5

    score = Math.max(0, Math.min(100, score))

    const metrics: SEOMetrics = {
      score: Math.round(score),

      metaTitle: {
        present: !!metaTitle,
        length: metaTitle.length,
        missing: !metaTitle
      },

      metaDescription: {
        present: !!metaDescription,
        length: metaDescription.length,
        missing: !metaDescription
      },

      headingStructure: {
        h1Count,
        h2Count,
        h3Count,
        hierarchyValid: h1Count === 1 && h2Count > 0
      },

      structuredData,

      internalLinks,
      externalLinks,

      canonicalUrl: {
        present: !!canonicalUrl,
        valid: canonicalUrl
          ? new URL(canonicalUrl, pageUrl).hostname === hostname
          : false
      },

      robotsTxt,
      sitemap
    }

    console.log('📊 Calculated Metrics:', metrics)

    return metrics
  }

  private static checkStructuredData(html: string) {
    const jsonLd = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)
    const microdata = html.match(/itemtype="[^"]+"/gi)

    return {
      present: Boolean(jsonLd || microdata),
      type: jsonLd ? 'JSON-LD' : microdata ? 'Microdata' : 'None',
      valid: true
    }
  }

  private static generateSEOIssues(
    $: ReturnType<typeof cheerio.load>,
    metrics: SEOMetrics
  ): AuditIssue[] {

    const issues: AuditIssue[] = []

    if (!metrics.metaTitle.present) {
      issues.push({
        id: 'seo-missing-title',
        title: 'Missing Page Title',
        description: 'Page is missing a title tag',
        category: 'seo',
        subcategory: 'meta-tags',
        severity: 'critical',
        confidence: 1,
        metric: {
          name: 'Title Tag',
          value: 'Missing',
          target: '50–60 characters',
          unit: 'presence'
        },
        businessImpact: 'Lower rankings and CTR',
        technicalImpact: 'Missing SEO signal',
        solutionSteps: [
          'Add a title tag',
          'Keep it under 60 characters'
        ],
        fixPriority: 1,
        estimatedTime: '30 minutes',
        detectedBy: 'SEOScanner',
        ruleId: 'SEO-META-001'
      })
    }

    if (!metrics.structuredData.present) {
      issues.push({
        id: 'seo-no-structured-data',
        title: 'Missing Structured Data',
        description: 'No Schema.org markup found',
        category: 'seo',
        subcategory: 'structured-data',
        severity: 'high',
        confidence: 0.9,
        metric: {
          name: 'Structured Data',
          value: 'Not found',
          target: 'JSON-LD',
          unit: 'presence'
        },
        businessImpact: 'No rich results',
        technicalImpact: 'Search engines lack context',
        solutionSteps: [
          'Add Product / Organization schema',
          'Validate with Rich Results Test'
        ],
        fixPriority: 2,
        estimatedTime: '3 hours',
        detectedBy: 'SEOScanner',
        ruleId: 'SEO-SCHEMA-001'
      })
    }

    if (!metrics.canonicalUrl.present) {
      issues.push({
        id: 'seo-no-canonical',
        title: 'Missing Canonical URL',
        description: 'Canonical tag not found',
        category: 'seo',
        subcategory: 'canonical',
        severity: 'medium',
        confidence: 0.85,
        metric: {
          name: 'Canonical',
          value: 'Missing',
          target: 'Self canonical',
          unit: 'presence'
        },
        businessImpact: 'Duplicate content risk',
        technicalImpact: 'Indexing ambiguity',
        solutionSteps: [
          'Add canonical tag',
          'Use absolute URL'
        ],
        fixPriority: 3,
        estimatedTime: '2 hours',
        detectedBy: 'SEOScanner',
        ruleId: 'SEO-CANON-001'
      })
    }

    console.log('🧠 Generated Issues:', issues)

    return issues
  }
}
