import { 
  PerformanceMetrics, 
  SEOMetrics, 
  UXMetrics, 
  ConversionMetrics, 
  TrustMetrics,
  AuditIssue 
} from '../types'

export class ScoreCalculator {

  static calculate(data: {
    performance: PerformanceMetrics
    seo: SEOMetrics
    ux: UXMetrics
    conversion: ConversionMetrics
    trust: TrustMetrics
    issues: AuditIssue[]
  }) {

    const performanceScore = this.calculatePerformanceScore(data.performance, data.issues)
    const seoScore = this.calculateSEOScore(data.seo, data.issues)
    const uxScore = this.calculateUXScore(data.ux, data.issues)
    const conversionScore = this.calculateConversionScore(data.conversion, data.issues)
    const trustScore = this.calculateTrustScore(data.trust, data.issues)

    const overallScore = this.calculateOverallScore({
      performance: performanceScore,
      seo: seoScore,
      ux: uxScore,
      conversion: conversionScore,
      trust: trustScore
    })

    return {
      overall: Math.round(overallScore),
      performance: Math.round(performanceScore),
      seo: Math.round(seoScore),
      ux: Math.round(uxScore),
      conversion: Math.round(conversionScore),
      trust: Math.round(trustScore)
    }
  }

  /* =====================================================
     PERFORMANCE SCORE
  ===================================================== */

  private static calculatePerformanceScore(
    metrics: PerformanceMetrics,
    issues: AuditIssue[]
  ): number {

    let score = 0

    if (metrics.mobileScore && metrics.desktopScore) {
      score = (metrics.mobileScore + metrics.desktopScore) / 2
    }
    else if (metrics.mobileScore) {
      score = metrics.mobileScore
    }
    else if (metrics.desktopScore) {
      score = metrics.desktopScore
    }

    const perfIssues = issues.filter(i => i.category === 'performance')

    perfIssues.forEach(issue => {

      switch (issue.severity) {

        case 'critical':
          score -= 10
          break

        case 'high':
          score -= 6
          break

        case 'medium':
          score -= 3
          break

        case 'low':
          score -= 1
          break
      }

    })

    if (metrics.largestContentfulPaint < 2500) score += 3
    if (metrics.cumulativeLayoutShift < 0.1) score += 3

    return Math.max(0, Math.min(100, score))
  }

  /* =====================================================
     SEO SCORE
  ===================================================== */

  private static calculateSEOScore(
    metrics: SEOMetrics,
    issues: AuditIssue[]
  ): number {

    let score = metrics.score || 50

    const seoIssues = issues.filter(i => i.category === 'seo')

    seoIssues.forEach(issue => {

      switch (issue.severity) {

        case 'critical':
          score -= 15
          break

        case 'high':
          score -= 10
          break

        case 'medium':
          score -= 5
          break

        case 'low':
          score -= 2
          break

      }

    })

    if (metrics.metaTitle.present) score += 3
    if (metrics.structuredData.present) score += 5
    if (metrics.headingStructure.hierarchyValid) score += 3

    return Math.max(0, Math.min(100, score))
  }

  /* =====================================================
     UX SCORE
  ===================================================== */

  private static calculateUXScore(
    metrics: UXMetrics,
    issues: AuditIssue[]
  ): number {

    let score = 50

    if (metrics.mobileFriendly) score += 10
    if (metrics.productPage.stickyAddToCart) score += 10
    if (metrics.productPage.imageZoom) score += 5
    if (metrics.productPage.reviews.present) score += 10
    if (metrics.navigation.searchFunctionality) score += 5
    if (metrics.cartCheckout.guestCheckout) score += 5

    const uxIssues = issues.filter(i => i.category === 'ux')

    uxIssues.forEach(issue => {

      switch (issue.severity) {

        case 'critical':
          score -= 15
          break

        case 'high':
          score -= 10
          break

        case 'medium':
          score -= 5
          break

        case 'low':
          score -= 2
          break

      }

    })

    return Math.max(0, Math.min(100, score))
  }

  /* =====================================================
     CONVERSION SCORE
  ===================================================== */

  private static calculateConversionScore(
    metrics: ConversionMetrics,
    issues: AuditIssue[]
  ): number {

    let score = 40

    if (metrics.emailCapture.present) score += 10
    if (metrics.upsells.relatedProducts) score += 10
    if (metrics.upsells.bundles) score += 10
    if (metrics.urgency.countdownTimers) score += 5
    if (metrics.freeShipping.bar) score += 10
    if (metrics.exitIntent) score += 5

    const convIssues = issues.filter(i => i.category === 'conversion')

    convIssues.forEach(issue => {

      switch (issue.severity) {

        case 'critical':
          score -= 12
          break

        case 'high':
          score -= 8
          break

        case 'medium':
          score -= 5
          break

        case 'low':
          score -= 2
          break

      }

    })

    return Math.max(0, Math.min(100, score))
  }

  /* =====================================================
     TRUST SCORE
  ===================================================== */

  private static calculateTrustScore(
    metrics: TrustMetrics,
    issues: AuditIssue[]
  ): number {

    let score = 50

    if (metrics.security.ssl) score += 10
    if (metrics.security.paymentIcons) score += 10
    if (metrics.socialProof.reviews) score += 10
    if (metrics.policies.refund) score += 5
    if (metrics.contactInfo.email || metrics.contactInfo.phone) score += 5
    if (metrics.aboutPage) score += 5

    const trustIssues = issues.filter(i => i.category === 'trust')

    trustIssues.forEach(issue => {

      switch (issue.severity) {

        case 'critical':
          score -= 15
          break

        case 'high':
          score -= 10
          break

        case 'medium':
          score -= 5
          break

        case 'low':
          score -= 2
          break

      }

    })

    return Math.max(0, Math.min(100, score))
  }

  /* =====================================================
     OVERALL SCORE
  ===================================================== */

  private static calculateOverallScore(categoryScores: Record<string, number>): number {

    const weights = {
      performance: 0.30,
      seo: 0.20,
      ux: 0.20,
      conversion: 0.15,
      trust: 0.15
    }

    let total = 0

    for (const key in weights) {
      total += categoryScores[key as keyof typeof weights] * weights[key as keyof typeof weights]
    }

    return total
  }

}