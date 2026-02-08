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
    console.log('🧱 AuditEngine constructor called')
    this.storeUrl = storeUrl
  }

  /* =====================================================
     SAFE WRAPPER
  ===================================================== */

  private async safe<T>(fn: () => Promise<T>, label?: string): Promise<T> {
    try {
      console.log(`🟡 Starting scanner: ${label ?? 'unknown'}`)
      const result = await fn()
      console.log(`🟢 Completed scanner: ${label ?? 'unknown'}`)
      return result
    } catch (e) {
      console.error(`🔴 Scanner failed: ${label ?? 'unknown'}`, e)
      throw e
    }
  }

  /* =====================================================
     MAIN RUN
  ===================================================== */

  async run(): Promise<AuditResult> {
    console.log('🚀 Starting audit for:', this.storeUrl)
    console.time('⏱ Total Audit Time')

    try {
      /* =========================================
         1️⃣ INIT CRAWLER
      ========================================= */

      console.log('🧭 Initializing crawler...')
      this.crawler = new AdvancedCrawler()
      await this.crawler.initialize()
      console.log('✅ Crawler initialized')

      /* =========================================
         2️⃣ PARALLEL: performance + crawl
      ========================================= */

      console.log('⚡ Running performance scan + site crawl in parallel')

      const [performance, crawlResult] = await Promise.all([
        this.safe(
          () => PerformanceScanner.scan(this.storeUrl),
          'PerformanceScanner'
        ),
        this.safe(
          () => this.crawler!.crawl(this.storeUrl),
          'AdvancedCrawler.crawl'
        )
      ])

      console.log('📊 Performance metrics:', performance.metrics)
      console.log('🕸 Crawl result summary:', {
        htmlLength: crawlResult.html?.length,
        headers: crawlResult.headers
      })

      /* =========================================
         3️⃣ STORE DETECTION
      ========================================= */

      console.log('🏪 Detecting store platform...')
      const storeInfo = ShopifyDetector.detect(
        crawlResult.html,
        crawlResult.headers,
        this.storeUrl
      )
      console.log('🛍 Store detected:', storeInfo)

      /* =========================================
         4️⃣ PARALLEL SCANNERS
      ========================================= */

      console.log('🔍 Running SEO / UX / Conversion / Trust scanners')

      const [seo, ux, conversion, trust] = await Promise.all([
        this.safe(
          () => SEOScanner.scan(crawlResult.html, this.storeUrl),
          'SEOScanner'
        ),
        this.safe(
          () => UXScanner.scan(crawlResult.html, this.storeUrl),
          'UXScanner'
        ),
        this.safe(
          () => ConversionScanner.scan(crawlResult.html),
          'ConversionScanner'
        ),
        this.safe(
          () => TrustScanner.scan(crawlResult.html),
          'TrustScanner'
        )
      ])

      console.log('📈 SEO metrics:', seo.metrics)
      console.log('🎨 UX metrics:', ux.metrics)
      console.log('🛒 Conversion metrics:', conversion.metrics)
      console.log('🔐 Trust metrics:', trust.metrics)

      /* =========================================
         5️⃣ MERGE ISSUES
      ========================================= */

      console.log('🧩 Merging issues from all scanners')

      const allIssues = [
        ...performance.issues,
        ...seo.issues,
        ...ux.issues,
        ...conversion.issues,
        ...trust.issues
      ]

      console.log(`📌 Total raw issues: ${allIssues.length}`)

      const classifiedIssues = IssueClassifier.classify(allIssues)

      console.log(
        '🏷 Classified issues breakdown:',
        classifiedIssues.reduce((acc: any, i: any) => {
          acc[i.severity] = (acc[i.severity] || 0) + 1
          return acc
        }, {})
      )

      /* =========================================
         6️⃣ SCORES
      ========================================= */

      console.log('🧮 Calculating scores')

      const scores = ScoreCalculator.calculate({
        performance: performance.metrics,
        seo: seo.metrics,
        ux: ux.metrics,
        conversion: conversion.metrics,
        trust: trust.metrics,
        issues: classifiedIssues
      })

      console.log('🏆 Final scores:', scores)

      /* =========================================
         7️⃣ AI
      ========================================= */

      console.log('🤖 Running AI store analysis')

      const aiAnalysis = await AIAnalyzer.analyzeStore(this.storeUrl, {
        storeInfo,
        scores,
        issues: classifiedIssues
      })

      console.log('🧠 AI analysis completed')

      console.log('✨ Enhancing issues with AI')

      const enhancedIssues = await AIAnalyzer.enhanceIssues(classifiedIssues)

      console.log(`🧠 Enhanced issues count: ${enhancedIssues.length}`)

      console.log('📋 Generating recommendations')
      const recommendations = this.generateRecommendations(enhancedIssues)

      console.log('🎯 Recommendations ready:', recommendations)

      console.log('✅ Audit completed successfully')
      console.timeEnd('⏱ Total Audit Time')

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

    } catch (err) {
      console.error('❌ Audit failed completely:', err)
      throw err
    } finally {
      console.log('🧹 Cleaning up crawler')
      if (this.crawler) await this.crawler.close()
      console.log('🧼 Crawler closed')
    }
  }

  /* =====================================================
     RECOMMENDATIONS
  ===================================================== */

  private generateRecommendations(issues: any[]) {
    console.log('🧠 Processing recommendations from issues')

    const pick = (severity: string) => {
      const selected = issues
        .filter(i => i.severity === severity)
        .slice(0, 5)
        .map(i => i.solutionSteps?.[0] || i.title || 'Fix issue')
        .filter(Boolean)

      console.log(`➡ ${severity.toUpperCase()} recommendations:`, selected)
      return selected
    }

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
  console.log('🔁 runCompleteAudit called for:', storeUrl)
  return new AuditEngine(storeUrl).run()
}
