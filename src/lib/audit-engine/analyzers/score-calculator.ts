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
    }, data.issues)

    return {
      overall: Math.round(overallScore),
      performance: Math.round(performanceScore),
      seo: Math.round(seoScore),
      ux: Math.round(uxScore),
      conversion: Math.round(conversionScore),
      trust: Math.round(trustScore)
    }
  }

  private static calculatePerformanceScore(metrics: PerformanceMetrics, issues: AuditIssue[]): number {
    let score = metrics.mobileScore || 50
    
    // Adjust based on critical performance issues
    const criticalPerfIssues = issues.filter(i => 
      i.category === 'performance' && i.severity === 'critical'
    )
    
    const highPerfIssues = issues.filter(i => 
      i.category === 'performance' && i.severity === 'high'
    )
    
    // Deductions
    score -= criticalPerfIssues.length * 15
    score -= highPerfIssues.length * 10
    
    // Bonus for good LCP
    if (metrics.largestContentfulPaint < 2500) {
      score += 5
    }
    
    // Bonus for good CLS
    if (metrics.cumulativeLayoutShift < 0.1) {
      score += 5
    }
    
    return Math.max(0, Math.min(100, score))
  }

  private static calculateSEOScore(metrics: SEOMetrics, issues: AuditIssue[]): number {
    let score = metrics.score || 50
    
    const seoIssues = issues.filter(i => i.category === 'seo')
    
    seoIssues.forEach(issue => {
      switch (issue.severity) {
        case 'critical': score -= 20; break
        case 'high': score -= 15; break
        case 'medium': score -= 10; break
        case 'low': score -= 5; break
      }
    })
    
    // Bonuses
    if (metrics.metaTitle.present && metrics.metaTitle.length <= 60) {
      score += 5
    }
    
    if (metrics.structuredData.present) {
      score += 10
    }
    
    if (metrics.headingStructure.hierarchyValid) {
      score += 5
    }
    
    return Math.max(0, Math.min(100, score))
  }

  private static calculateUXScore(metrics: UXMetrics, issues: AuditIssue[]): number {
    let score = 70 // Base UX score
    
    // Add points for good UX practices
    if (metrics.mobileFriendly) score += 10
    if (metrics.productPage.stickyAddToCart) score += 5
    if (metrics.productPage.imageZoom) score += 5
    if (metrics.productPage.reviews.present) score += 10
    if (metrics.navigation.searchFunctionality) score += 5
    if (metrics.cartCheckout.guestCheckout) score += 5
    
    // Deductions for UX issues
    const uxIssues = issues.filter(i => i.category === 'ux')
    uxIssues.forEach(issue => {
      switch (issue.severity) {
        case 'critical': score -= 20; break
        case 'high': score -= 15; break
        case 'medium': score -= 10; break
        case 'low': score -= 5; break
      }
    })
    
    return Math.max(0, Math.min(100, score))
  }

  private static calculateConversionScore(metrics: ConversionMetrics, issues: AuditIssue[]): number {
    let score = 60 // Base conversion score
    
    // Add points for conversion optimizations
    if (metrics.emailCapture.present) score += 10
    if (metrics.upsells.relatedProducts) score += 5
    if (metrics.upsells.bundles) score += 10
    if (metrics.urgency.countdownTimers) score += 5
    if (metrics.freeShipping.bar) score += 10
    if (metrics.exitIntent) score += 5
    
    // Deductions for conversion issues
    const convIssues = issues.filter(i => i.category === 'conversion')
    convIssues.forEach(issue => {
      switch (issue.severity) {
        case 'critical': score -= 15; break
        case 'high': score -= 10; break
        case 'medium': score -= 7; break
        case 'low': score -= 3; break
      }
    })
    
    return Math.max(0, Math.min(100, score))
  }

  private static calculateTrustScore(metrics: TrustMetrics, issues: AuditIssue[]): number {
    let score = 70 // Base trust score
    
    // Add points for trust indicators
    if (metrics.security.ssl) score += 10
    if (metrics.security.paymentIcons) score += 10
    if (metrics.socialProof.reviews) score += 10
    if (metrics.policies.refund) score += 5
    if (metrics.contactInfo.email || metrics.contactInfo.phone) score += 5
    if (metrics.aboutPage) score += 5
    
    // Deductions for trust issues
    const trustIssues = issues.filter(i => i.category === 'trust')
    trustIssues.forEach(issue => {
      switch (issue.severity) {
        case 'critical': score -= 25; break
        case 'high': score -= 20; break
        case 'medium': score -= 10; break
        case 'low': score -= 5; break
      }
    })
    
    return Math.max(0, Math.min(100, score))
  }

  private static calculateOverallScore(
    categoryScores: Record<string, number>,
    issues: AuditIssue[]
  ): number {
    // Weighted average
    const weights = {
      performance: 0.30,
      seo: 0.15,
      ux: 0.20,
      conversion: 0.20,
      trust: 0.15
    }
    
    let weightedSum = 0
    let totalWeight = 0
    
    for (const [category, weight] of Object.entries(weights)) {
      const score = categoryScores[category] || 50
      weightedSum += score * weight
      totalWeight += weight
    }
    
    let overallScore = weightedSum / totalWeight
    
    // Apply issue-based adjustments
    const criticalIssues = issues.filter(i => i.severity === 'critical')
    const highIssues = issues.filter(i => i.severity === 'high')
    
    overallScore -= criticalIssues.length * 5
    overallScore -= highIssues.length * 3
    
    // Cap at 0-100
    overallScore = Math.max(0, Math.min(100, overallScore))
    
    return overallScore
  }
}