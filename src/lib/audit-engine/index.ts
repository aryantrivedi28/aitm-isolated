import { AdvancedCrawler } from './crawler'
import { ShopifyDetector } from './crawler/shopify-detector'
import { PerformanceScanner } from './scanners/performance'
import { SEOScanner } from './scanners/seo'
import { UXScanner } from './scanners/ux'
import { ConversionScanner } from './scanners/conversion'
import { TrustScanner } from './scanners/trust'
import { IssueClassifier } from './analyzers/issue-classifier'
import { ScoreCalculator } from './analyzers/score-calculator'
import { AIAnalyzer } from './analyzers/ai-analyzer'
import { AuditResult } from './types'

export class AuditEngine {
  private crawler: AdvancedCrawler | null = null
  private storeUrl: string

  constructor(storeUrl: string) {
    this.storeUrl = storeUrl
  }

  /* =====================================================
     SAFE WRAPPER (NO FALLBACK TYPES NEEDED)
  ===================================================== */

  private async safe<T>(fn: () => Promise<T>): Promise<T> {
    try {
      return await fn()
    } catch (e) {
      console.error('Scanner failed:', e)
      throw e // scanners already handle fallback internally
    }
  }

  /* =====================================================
     MAIN RUN
  ===================================================== */

  async run(): Promise<AuditResult> {
    console.log('🚀 Starting audit for:', this.storeUrl)

    try {
      /* =========================================
         1️⃣ INIT CRAWLER
      ========================================= */

      this.crawler = new AdvancedCrawler()
      await this.crawler.initialize()

      /* =========================================
         2️⃣ PARALLEL: performance + crawl
      ========================================= */

      const [performance, crawlResult] = await Promise.all([
        this.safe(() => PerformanceScanner.scan(this.storeUrl)),
        this.safe(() => this.crawler!.crawl(this.storeUrl))
      ])

      /* =========================================
         3️⃣ STORE DETECTION
      ========================================= */

      const storeInfo = ShopifyDetector.detect(
        crawlResult.html,
        crawlResult.headers,
        this.storeUrl
      )

      /* =========================================
         4️⃣ PARALLEL SCANNERS
      ========================================= */

      const [seo, ux, conversion, trust] = await Promise.all([
        this.safe(() => SEOScanner.scan(crawlResult.html, this.storeUrl)),
        this.safe(() => UXScanner.scan(crawlResult.html, this.storeUrl)),
        this.safe(() => ConversionScanner.scan(crawlResult.html)),
        this.safe(() => TrustScanner.scan(crawlResult.html))
      ])

      /* =========================================
         5️⃣ MERGE ISSUES
      ========================================= */

      const allIssues = [
        ...performance.issues,
        ...seo.issues,
        ...ux.issues,
        ...conversion.issues,
        ...trust.issues
      ]

      const classifiedIssues = IssueClassifier.classify(allIssues)

      /* =========================================
         6️⃣ SCORES
      ========================================= */

      const scores = ScoreCalculator.calculate({
        performance: performance.metrics,
        seo: seo.metrics,
        ux: ux.metrics,
        conversion: conversion.metrics,
        trust: trust.metrics,
        issues: classifiedIssues
      })

      /* =========================================
         7️⃣ AI
      ========================================= */

      const aiAnalysis = await AIAnalyzer.analyzeStore(this.storeUrl, {
        storeInfo,
        scores,
        issues: classifiedIssues
      })

      const enhancedIssues = await AIAnalyzer.enhanceIssues(classifiedIssues)

      const recommendations = this.generateRecommendations(enhancedIssues)

      console.log('✅ Audit completed successfully')

      return {
        storeInfo,
        performance: performance.metrics,
        seo: seo.metrics,
        ux: ux.metrics,
        conversion: conversion.metrics,
        trust: trust.metrics,
        issues: enhancedIssues,
        scores,
        recommendations,
        aiAnalysis
      }

    } finally {
      if (this.crawler) await this.crawler.close()
    }
  }

  /* =====================================================
     RECOMMENDATIONS
  ===================================================== */

  private generateRecommendations(issues: any[]) {
    const pick = (severity: string) =>
      issues
        .filter(i => i.severity === severity)
        .slice(0, 5)
        .map(i => i.solutionSteps?.[0] || i.title || 'Fix issue')
        .filter(Boolean)

    return {
      critical: pick('critical'),
      high: pick('high'),
      medium: pick('medium'),
      low: pick('low')
    }
  }
}

/* =====================================================
   HELPER
===================================================== */

export async function runCompleteAudit(storeUrl: string): Promise<AuditResult> {
  return new AuditEngine(storeUrl).run()
}
