// src/lib/audit-engine/scanners/performance.ts

type PageSpeedStrategy = 'mobile' | 'desktop'

/**
 * MUST match the PerformanceMetrics expected by ScoreCalculator
 */
interface PerformanceMetrics {
  mobileScore: number
  desktopScore: number

  loadTime: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  cumulativeLayoutShift: number
  totalBlockingTime: number
  speedIndex: number
  interactiveTime: number

  mainThreadTime: number
  totalByteWeight: number
  unusedJavaScript: number
  unusedCSS: number

  imageOptimization: {
    totalImages: number
    oversizedImages: number
    unoptimizedImages: number
    formatRecommendations: string[]
  }
}

export class PerformanceScanner {
  // --------------------------------------------
  // PageSpeed runner
  // --------------------------------------------
  private static async runPageSpeed(
    url: string,
    strategy: PageSpeedStrategy
  ) {
    console.log(`⚡ [Performance] Running PageSpeed (${strategy}) for:`, url)

    const apiKey = process.env.PAGESPEED_API_KEY
    if (!apiKey) {
      console.error('❌ [Performance] PAGESPEED_API_KEY is missing')
      throw new Error('PAGESPEED_API_KEY is missing')
    }

    console.log('🔑 [Performance] API key loaded')

    const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
      url
    )}&strategy=${strategy}&category=performance&key=${apiKey}`

    console.log('🌐 [Performance] PageSpeed endpoint:', endpoint)

    const res = await fetch(endpoint)

    if (!res.ok) {
      const text = await res.text()
      console.error(
        `❌ [Performance] PageSpeed API failed (${strategy})`,
        res.status,
        text
      )
      throw new Error(`PageSpeed API failed: ${res.statusText}`)
    }

    const data = await res.json()

    console.log(
      `✅ [Performance] PageSpeed (${strategy}) completed`
    )

    return data.lighthouseResult
  }

  // --------------------------------------------
  // MAIN SCAN
  // --------------------------------------------
  static async scan(url: string) {
    console.log('🚀 [Performance] Starting performance scan for:', url)

    try {
      const [mobile, desktop] = await Promise.all([
        this.runPageSpeed(url, 'mobile'),
        this.runPageSpeed(url, 'desktop')
      ])

      console.log('📱 [Performance] Mobile data received')
      console.log('🖥️ [Performance] Desktop data received')

      const mobileAudits = mobile.audits

      console.log('📊 [Performance] Extracting metrics...')

      const metrics: PerformanceMetrics = {
        mobileScore: Math.round(
          (mobile.categories.performance.score ?? 0) * 100
        ),
        desktopScore: Math.round(
          (desktop.categories.performance.score ?? 0) * 100
        ),

        loadTime: mobileAudits['interactive']?.numericValue ?? 0,
        firstContentfulPaint:
          mobileAudits['first-contentful-paint']?.numericValue ?? 0,
        largestContentfulPaint:
          mobileAudits['largest-contentful-paint']?.numericValue ?? 0,
        cumulativeLayoutShift:
          mobileAudits['cumulative-layout-shift']?.numericValue ?? 0,
        totalBlockingTime:
          mobileAudits['total-blocking-time']?.numericValue ?? 0,
        speedIndex:
          mobileAudits['speed-index']?.numericValue ?? 0,
        interactiveTime:
          mobileAudits['interactive']?.numericValue ?? 0,

        mainThreadTime:
          mobileAudits['mainthread-work-breakdown']?.numericValue ?? 0,
        totalByteWeight:
          mobileAudits['total-byte-weight']?.numericValue ?? 0,
        unusedJavaScript:
          mobileAudits['unused-javascript']?.numericValue ?? 0,
        unusedCSS:
          mobileAudits['unused-css-rules']?.numericValue ?? 0,

        imageOptimization: {
          totalImages: 0,
          oversizedImages: 0,
          unoptimizedImages: 0,
          formatRecommendations: [
            'Use WebP / AVIF',
            'Lazy load below-the-fold images',
            'Serve responsive image sizes'
          ]
        }
      }

      console.log('✅ [Performance] Metrics extracted:', {
        mobileScore: metrics.mobileScore,
        desktopScore: metrics.desktopScore,
        LCP: metrics.largestContentfulPaint,
        CLS: metrics.cumulativeLayoutShift,
        TBT: metrics.totalBlockingTime
      })

      const issues = this.generateIssues(mobileAudits, metrics, url)

      console.log(
        `🚨 [Performance] Issues detected: ${issues.length}`
      )

      return {
        metrics,
        issues
      }
    } catch (error) {
      console.error('❌ [Performance] Scan failed:', error)

      return {
        metrics: this.getFallbackMetrics(),
        issues: []
      }
    }
  }

  // --------------------------------------------
  // ISSUE GENERATION
  // --------------------------------------------
  private static generateIssues(
    audits: any,
    metrics: PerformanceMetrics,
    url: string
  ) {
    console.log('🔍 [Performance] Generating issues...')

    const issues: any[] = []

    if (metrics.largestContentfulPaint > 2500) {
      console.warn('🚨 [Performance] LCP issue detected')

      issues.push({
        type: 'performance',
        severity:
          metrics.largestContentfulPaint > 4000 ? 'critical' : 'high',
        title: 'Slow Largest Contentful Paint (LCP)',
        description:
          'Main content takes too long to load. Optimize hero images and critical resources.',
        metric: 'LCP',
        value: Math.round(metrics.largestContentfulPaint),
        url
      })
    }

    if (metrics.cumulativeLayoutShift > 0.1) {
      console.warn('🚨 [Performance] CLS issue detected')

      issues.push({
        type: 'performance',
        severity:
          metrics.cumulativeLayoutShift > 0.25 ? 'critical' : 'medium',
        title: 'High Cumulative Layout Shift (CLS)',
        description:
          'Unexpected layout shifts detected. Reserve space for images and dynamic content.',
        metric: 'CLS',
        value: metrics.cumulativeLayoutShift,
        url
      })
    }

    if (metrics.totalBlockingTime > 300) {
      console.warn('🚨 [Performance] TBT issue detected')

      issues.push({
        type: 'performance',
        severity: 'high',
        title: 'High Total Blocking Time (TBT)',
        description:
          'JavaScript is blocking the main thread. Reduce JS size and defer unused scripts.',
        metric: 'TBT',
        value: metrics.totalBlockingTime,
        url
      })
    }

    return issues
  }

  // --------------------------------------------
  // FALLBACK (TS-safe)
  // --------------------------------------------
  private static getFallbackMetrics(): PerformanceMetrics {
    console.warn('⚠️ [Performance] Using fallback metrics')

    return {
      mobileScore: 0,
      desktopScore: 0,

      loadTime: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      cumulativeLayoutShift: 0,
      totalBlockingTime: 0,
      speedIndex: 0,
      interactiveTime: 0,

      mainThreadTime: 0,
      totalByteWeight: 0,
      unusedJavaScript: 0,
      unusedCSS: 0,

      imageOptimization: {
        totalImages: 0,
        oversizedImages: 0,
        unoptimizedImages: 0,
        formatRecommendations: []
      }
    }
  }
}
