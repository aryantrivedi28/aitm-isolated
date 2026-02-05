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

  async run(): Promise<AuditResult> {
    console.log('🚀 Starting audit for:', this.storeUrl)

    let crawlResult: any = null

    try {
      // STEP 1: Run Performance scan FIRST (API-based, safest)
      console.log('⚡ Running performance scan (PageSpeed API)...')
      const performance = await PerformanceScanner.scan(this.storeUrl)

      // STEP 2: Initialize crawler ONLY if needed
      console.log('🕷️ Initializing crawler...')
      this.crawler = new AdvancedCrawler()
      await this.crawler.initialize()

      console.log('🌐 Crawling store...')
      crawlResult = await this.crawler.crawl(this.storeUrl)

      // STEP 3: Detect Shopify
      console.log('🛍️ Detecting Shopify...')
      const storeInfo = ShopifyDetector.detect(
        crawlResult.html,
        crawlResult.headers,
        this.storeUrl
      )

      // STEP 4: Run HTML-based scanners in parallel
      console.log('🔍 Running content scanners...')
      const [seo, ux, conversion, trust] = await Promise.all([
        SEOScanner.scan(crawlResult.html, this.storeUrl),
        UXScanner.scan(crawlResult.html, this.storeUrl),
        ConversionScanner.scan(crawlResult.html),
        TrustScanner.scan(crawlResult.html)
      ])

      // STEP 5: Merge all issues
      const allIssues = [
        ...performance.issues,
        ...seo.issues,
        ...ux.issues,
        ...conversion.issues,
        ...trust.issues
      ]

      // STEP 6: Classify issues
      console.log('🧠 Classifying issues...')
      const classifiedIssues = IssueClassifier.classify(allIssues)

      // STEP 7: Calculate scores
      console.log('📊 Calculating scores...')
      const scores = ScoreCalculator.calculate({
        performance: performance.metrics,
        seo: seo.metrics,
        ux: ux.metrics,
        conversion: conversion.metrics,
        trust: trust.metrics,
        issues: classifiedIssues
      })

      // STEP 8: AI analysis
      console.log('🤖 Running AI analysis...')
      const aiAnalysis = await AIAnalyzer.analyzeStore(this.storeUrl, {
        storeInfo,
        performance: performance.metrics,
        seo: seo.metrics,
        ux: ux.metrics,
        conversion: conversion.metrics,
        trust: trust.metrics,
        issues: classifiedIssues
      })

      // STEP 9: Enhance issues with AI
      console.log('✨ Enhancing issues...')
      const enhancedIssues = await AIAnalyzer.enhanceIssues(classifiedIssues)

      // STEP 10: Recommendations
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

    } catch (error) {
      console.error('❌ Audit failed:', error)
      throw error
    } finally {
      if (this.crawler) {
        await this.crawler.close()
      }
    }
  }

  private generateRecommendations(issues: any[]) {
    const pick = (severity: string) =>
      issues
        .filter(i => i.severity === severity)
        .slice(0, 5)
        .map(i => i.solutionSteps?.[0])
        .filter(Boolean)

    return {
      critical: pick('critical'),
      high: pick('high'),
      medium: pick('medium'),
      low: pick('low')
    }
  }
}

// Export helper
export async function runCompleteAudit(storeUrl: string): Promise<AuditResult> {
  return new AuditEngine(storeUrl).run()
}
