import { AuditIssue } from '../types'

export class IssueClassifier {

  static classify(issues: AuditIssue[]): AuditIssue[] {
    if (!Array.isArray(issues) || issues.length === 0) {
      console.log('ℹ️ No issues to classify')
      return []
    }

    return issues
      .filter(Boolean) // ⬅️ removes undefined/null
      .map(issue => this.enrichIssue(issue))
      .sort((a, b) => this.getIssuePriority(b) - this.getIssuePriority(a))
  }

  private static enrichIssue(issue: AuditIssue): AuditIssue {
    const enriched: AuditIssue = {
      ...issue,
      category: issue.category || 'seo',
      severity: issue.severity || 'medium'
    }

    // Confidence
    enriched.confidence ??= this.calculateConfidence(enriched.severity)

    // Fix priority
    enriched.fixPriority ??= this.calculateFixPriority(
      enriched.severity,
      enriched.category
    )

    // Estimated time
    enriched.estimatedTime ??= this.estimateFixTime(
      enriched.severity,
      enriched.category
    )

    // Safe ID generation
    enriched.id ??= this.generateIssueId(enriched)

    return enriched
  }

  private static generateIssueId(issue: AuditIssue): string {
    const category = issue.category || 'general'
    const severity = issue.severity || 'medium'

    const categoryCode = category.substring(0, 3).toUpperCase()
    const severityCode = severity.substring(0, 1).toUpperCase()
    const timestamp = Date.now().toString(36).slice(-4)

    return `${categoryCode}-${severityCode}-${timestamp}`
  }

  private static calculateConfidence(severity: string): number {
    const map: Record<string, number> = {
      critical: 0.95,
      high: 0.9,
      medium: 0.8,
      low: 0.7
    }
    return map[severity] ?? 0.8
  }

  private static calculateFixPriority(severity: string, category: string): number {
    const severityWeights: Record<string, number> = {
      critical: 10,
      high: 8,
      medium: 5,
      low: 2
    }

    const categoryWeights: Record<string, number> = {
      performance: 1.2,
      security: 1.5,
      trust: 1.1,
      conversion: 1.3,
      seo: 1.0,
      ux: 1.0
    }

    return Math.round(
      (severityWeights[severity] ?? 5) *
      (categoryWeights[category] ?? 1)
    )
  }

  private static estimateFixTime(severity: string, category: string): string {
    const key = `${severity}-${category}`

    const map: Record<string, string> = {
      'critical-security': 'Immediate',
      'critical-performance': '2–4 hours',
      'high-seo': '3–4 hours',
      'medium-seo': '5–10 hours',
      'low-seo': '2–3 days'
    }

    return map[key] ?? '1–2 hours'
  }

  private static getIssuePriority(issue: AuditIssue): number {
    const severityScore = {
      critical: 100,
      high: 75,
      medium: 50,
      low: 25
    }[issue.severity] ?? 0

    const categoryScore = {
      performance: 10,
      security: 15,
      trust: 8,
      conversion: 12,
      seo: 6,
      ux: 5
    }[issue.category] ?? 0

    return severityScore + categoryScore + (issue.fixPriority ?? 0)
  }
}
