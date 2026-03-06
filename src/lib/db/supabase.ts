import { createClient } from '@supabase/supabase-js'
import { AuditResult } from '../audit-engine/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient(
  supabaseUrl,
  supabaseServiceKey
)

export class AuditDB {

  /* ===============================
     CREATE AUDIT RECORD
  =============================== */

  static async createAuditRecord(
    email: string,
    storeUrl: string,
    name?: string
  ) {

    const { data, error } = await supabase
      .from('audits')
      .insert({
        email,
        store_url: storeUrl,
        store_name: name,
        status: 'processing',
        started_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    return data
  }

  /* ===============================
     SAVE AUDIT RESULTS
  =============================== */

  static async saveAuditResults(
    auditId: string,
    result: AuditResult
  ) {

    const int = (v?: number) =>
      typeof v === "number" ? Math.round(v) : null

    /* Clean JSON to avoid Supabase stripping values */
    const rawMetrics = JSON.parse(
      JSON.stringify({
        performance: result.performance,
        seo: result.seo,
        ux: result.ux,
        conversion: result.conversion,
        trust: result.trust
      })
    )

    const recommendations = {
      critical: result.recommendations?.critical || [],
      high: result.recommendations?.high || [],
      medium: result.recommendations?.medium || [],
      low: result.recommendations?.low || []
    }

    const { error } = await supabase
      .from("audits")
      .update({

        /* ================= STORE INFO ================= */

        shopify_theme: result.storeInfo?.theme?.name || null,
        theme_version: result.storeInfo?.theme?.version || null,

        currency: result.storeInfo?.currency || null,
        country: result.storeInfo?.country || null,
        language: result.storeInfo?.language || null,

        apps_detected: result.storeInfo?.apps?.count || 0,
        apps_list: result.storeInfo?.apps?.list || [],

        products_count: result.storeInfo?.products || 0,
        collections_count: result.storeInfo?.collections || 0,

        /* ================= PERFORMANCE ================= */

        mobile_score: result.performance?.mobileScore || 0,
        desktop_score: result.performance?.desktopScore || 0,

        load_time_ms: int(result.performance?.loadTime),
        lcp_ms: int(result.performance?.largestContentfulPaint),
        inp_ms: int(result.performance?.interactiveTime),
        tbt_ms: int(result.performance?.totalBlockingTime),

        cls_score: result.performance?.cumulativeLayoutShift ?? null,

        /* ================= SEO ================= */

        has_meta_title: result.seo?.metaTitle?.present ?? false,
        meta_title_length: result.seo?.metaTitle?.length ?? null,

        has_meta_description: result.seo?.metaDescription?.present ?? false,
        meta_description_length: result.seo?.metaDescription?.length ?? null,

        has_structured_data: result.seo?.structuredData?.present ?? false,
        structured_data_type: result.seo?.structuredData?.type ?? null,
        structured_data_valid: result.seo?.structuredData?.valid ?? null,

        h1_count: result.seo?.headingStructure?.h1Count ?? 0,
        h2_count: result.seo?.headingStructure?.h2Count ?? 0,
        h3_count: result.seo?.headingStructure?.h3Count ?? 0,

        heading_hierarchy_valid:
          result.seo?.headingStructure?.hierarchyValid ?? false,

        has_canonical: result.seo?.canonicalUrl?.present ?? false,
        canonical_valid: result.seo?.canonicalUrl?.valid ?? false,

        has_robots_txt: result.seo?.robotsTxt?.present ?? false,
        has_sitemap: result.seo?.sitemap?.present ?? false,

        internal_links: result.seo?.internalLinks ?? 0,
        external_links: result.seo?.externalLinks ?? 0,

        /* ================= UX ================= */

        mobile_friendly: result.ux?.mobileFriendly ?? false,

        has_sticky_cart: result.ux?.productPage?.stickyAddToCart ?? false,
        has_image_zoom: result.ux?.productPage?.imageZoom ?? false,
        has_video: result.ux?.productPage?.videos ?? false,

        has_variant_selector:
          result.ux?.productPage?.variantSelector ?? false,

        has_stock_status:
          result.ux?.productPage?.stockStatus ?? false,

        has_size_guide:
          result.ux?.productPage?.sizeGuide ?? false,

        has_reviews:
          result.ux?.productPage?.reviews?.present ?? false,

        review_count:
          result.ux?.productPage?.reviews?.count ?? 0,

        has_trust_badges:
          result.ux?.productPage?.trustBadges ?? false,

        has_faq:
          result.ux?.productPage?.faq ?? false,

        menu_items_count:
          result.ux?.navigation?.menuItems ?? 0,

        /* ================= CONVERSION ================= */

        has_upsells:
          result.conversion?.upsells?.relatedProducts ?? false,

        has_product_bundles:
          result.conversion?.upsells?.bundles ?? false,

        has_free_shipping_bar:
          result.conversion?.freeShipping?.bar ?? false,

        has_countdown_timer:
          result.conversion?.urgency?.countdownTimers ?? false,

        has_stock_counter:
          result.conversion?.urgency?.stockCounters ?? false,

        has_limited_offer:
          result.conversion?.urgency?.limitedOffers ?? false,

        has_email_capture:
          result.conversion?.emailCapture?.present ?? false,

        has_exit_intent:
          result.conversion?.exitIntent ?? false,

        /* ================= TRUST ================= */

        has_payment_icons:
          result.trust?.security?.paymentIcons ?? false,

        /* ================= SCORES ================= */

        overall_score: result.scores?.overall ?? 0,
        performance_score: result.scores?.performance ?? 0,
        seo_score: result.scores?.seo ?? 0,
        ux_score: result.scores?.ux ?? 0,
        conversion_score: result.scores?.conversion ?? 0,
        trust_score: result.scores?.trust ?? 0,

        /* ================= AI ================= */

        recommendations,
        quick_wins: result.aiAnalysis?.quickWins || [],
        long_term_improvements: result.recommendations?.high || [],

        ai_summary: result.aiAnalysis?.summary || null,
        priority_actions: result.aiAnalysis?.priorityActions || [],
        estimated_impact: result.aiAnalysis?.estimatedImpact || {},

        /* ================= RAW DATA ================= */

        raw_metrics: rawMetrics,

        engine_version: "1.0.0",

        status: "completed",
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()

      })
      .eq("id", auditId)

    if (error) throw error

    // =========================
    // INSERT ISSUES (BULK)
    // =========================

    const issues = result.issues.map(
      (issue) => ({

        audit_id: auditId,

        issue_id: issue.id,

        title: issue.title,

        description: issue.description,

        category: issue.category,

        subcategory: issue.subcategory,

        severity: issue.severity,

        confidence: issue.confidence,

        metric_name:
          issue.metric?.name,

        metric_value:
          issue.metric?.value?.toString(),

        metric_target:
          issue.metric?.target?.toString(),

        metric_unit:
          issue.metric?.unit,

        business_impact:
          issue.businessImpact,

        technical_impact:
          issue.technicalImpact,

        solution_steps:
          issue.solutionSteps,

        code_examples:
          issue.codeExamples,

        affected_pages:
          issue.affectedPages,

        ai_explanation:
          issue.aiExplanation,

        fix_priority:
          issue.fixPriority,

        estimated_time:
          issue.estimatedTime

      })
    )

    if (issues.length > 0) {

      const { error: issueError } =
        await supabase
          .from('audit_issues')
          .insert(issues)

      if (issueError)
        throw issueError
    }

    return { success: true }

  }

  /* ===============================
     GET AUDIT
  =============================== */

  static async getAuditById(
    auditId: string
  ) {

    const { data, error } =
      await supabase
        .from('audits')
        .select(`
          id,
          email,
          store_name,
          store_url,
          shopify_theme,
          status,
          overall_score,
          performance_score,
          seo_score,
          ux_score,
          conversion_score,
          trust_score,
          recommendations,
          quick_wins,
          priority_actions,
          estimated_impact,
          ai_summary,
          raw_metrics,
          completed_at
        `)
        .eq('id', auditId)
        .single()

    if (error) throw error



    return data
  }

  /* ===============================
     GET ISSUES
  =============================== */

  static async getIssuesByAuditId(
    auditId: string
  ) {

    const { data, error } =
      await supabase
        .from('audit_issues')
        .select(`
          title,
          description,
          severity,
          solution_steps
        `)
        .eq('audit_id', auditId)

    if (error) throw error

    return data || []
  }

}