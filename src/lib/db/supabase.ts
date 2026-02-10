import { createClient } from '@supabase/supabase-js'
import { AuditResult } from '../audit-engine/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey)

export class AuditDB {
  static async createAuditRecord(email: string, storeUrl: string, name?: string) {
    const { data, error } = await supabase
      .from('audits')
      .insert([{
        email,
        store_url: storeUrl,
        store_name: name,
        status: 'processing',
        started_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async saveAuditResults(auditId: string, result: AuditResult) {

    const int = (v?: number) => (typeof v === 'number' ? Math.round(v) : null)

    // Extract metrics
    const metrics = {
      shopify_theme: result.storeInfo?.theme.name,
      theme_version: result.storeInfo?.theme.version,
      apps_detected: result.storeInfo.apps.count,
      products_count: result.storeInfo.products,
      collections_count: result.storeInfo.collections,

      // Performance
      mobile_score: result.performance.mobileScore,
      desktop_score: result.performance.desktopScore,
      load_time_ms: int(result.performance.loadTime),
      lcp_ms: int(result.performance.largestContentfulPaint),
      inp_ms: int(result.performance.interactiveTime),
      tbt_ms: int(result.performance.totalBlockingTime),

      cls_score: result.performance.cumulativeLayoutShift,

      // SEO
      has_meta_title: result.seo.metaTitle.present,
      has_meta_description: result.seo.metaDescription.present,
      has_structured_data: result.seo.structuredData.present,
      h1_count: result.seo.headingStructure.h1Count,
      internal_links: result.seo.internalLinks,
      external_links: result.seo.externalLinks,

      // UX
      mobile_friendly: result.ux.mobileFriendly,
      has_sticky_cart: result.ux.productPage.stickyAddToCart,
      has_image_zoom: result.ux.productPage.imageZoom,
      has_video: result.ux.productPage.videos,
      has_reviews: result.ux.productPage.reviews.present,
      has_trust_badges: result.ux.productPage.trustBadges,
      has_faq: result.ux.productPage.faq,
      has_upsells: result.conversion.upsells.relatedProducts,

      // Conversion
      has_free_shipping_bar: result.conversion.freeShipping.bar,
      has_countdown_timer: result.conversion.urgency.countdownTimers,
      has_email_capture: result.conversion.emailCapture.present,
      has_exit_intent: result.conversion.exitIntent,
      has_shop_pay: result.trust.security.paymentIcons,
      has_apple_pay: false,
      has_google_pay: false,

      // Scores
      overall_score: result.scores.overall,
      performance_score: result.scores.performance,
      seo_score: result.scores.seo,
      ux_score: result.scores.ux,
      conversion_score: result.scores.conversion,
      trust_score: result.scores.trust,

      // Issues
      critical_issues: result.issues.filter(i => i.severity === 'critical'),
      high_issues: result.issues.filter(i => i.severity === 'high'),
      medium_issues: result.issues.filter(i => i.severity === 'medium'),
      low_issues: result.issues.filter(i => i.severity === 'low'),

      // Recommendations
      recommendations: result.recommendations.critical,
      quick_wins: result.aiAnalysis.quickWins,
      long_term_improvements: result.recommendations.high,

      // AI Analysis
      ai_summary: result.aiAnalysis.summary,
      priority_actions: result.aiAnalysis.priorityActions,
      estimated_impact: result.aiAnalysis.estimatedImpact,

      // Raw data
      raw_metrics: {
        performance: result.performance,
        seo: result.seo,
        ux: result.ux,
        conversion: result.conversion,
        trust: result.trust
      },

      // Status
      status: 'completed',
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Update main audit
    const { error: updateError } = await supabase
      .from('audits')
      .update(metrics)
      .eq('id', auditId)

    if (updateError) throw updateError

    // Save detailed issues
    for (const issue of result.issues) {
      await supabase
        .from('audit_issues')
        .insert({
          audit_id: auditId,
          issue_id: issue.id,
          title: issue.title,
          description: issue.description,
          category: issue.category,
          subcategory: issue.subcategory,
          severity: issue.severity,
          confidence: issue.confidence,
          metric_name: issue.metric?.name,
          metric_value: issue.metric?.value?.toString(),
          metric_target: issue.metric?.target?.toString(),
          metric_unit: issue.metric?.unit,
          business_impact: issue.businessImpact,
          technical_impact: issue.technicalImpact,
          solution_steps: issue.solutionSteps,
          code_examples: issue.codeExamples,
          affected_pages: issue.affectedPages,
          ai_explanation: issue.aiExplanation,
          fix_priority: issue.fixPriority,
          estimated_time: issue.estimatedTime
        })
    }

    return { success: true }
  }

  static async getAuditById(auditId: string) {
    const { data: audit, error } = await supabase
      .from('audits')
      .select(`
        *,
        audit_issues (*)
      `)
      .eq('id', auditId)
      .single()

    if (error) throw error
    return audit
  }

  static async markEmailSent(auditId: string) {
    const { error } = await supabase
      .from('audits')
      .update({ is_email_sent: true })
      .eq('id', auditId)

    return !error
  }
}