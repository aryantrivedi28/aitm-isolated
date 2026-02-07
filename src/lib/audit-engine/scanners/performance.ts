// src/lib/audit-engine/scanners/performance.ts

type PageSpeedStrategy = 'mobile' | 'desktop'

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

  /* ===================================================
     SAFE PageSpeed call (never throws)
  =================================================== */

  private static async runPageSpeed(
    url: string,
    strategy: PageSpeedStrategy
  ): Promise<any | null> {

    const apiKey = process.env.PAGESPEED_API_KEY
    if (!apiKey) return null

    const endpoint =
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed` +
      `?url=${encodeURIComponent(url)}` +
      `&strategy=${strategy}` +
      `&category=performance` +
      `&key=${apiKey}`

    const controller = new AbortController()

    // 🔥 25s realistic timeout (not 12s)
    const timeout = setTimeout(() => controller.abort(), 25_000)

    try {
      const res = await fetch(endpoint, { signal: controller.signal })

      if (!res.ok) return null

      const data = await res.json()

      return data.lighthouseResult ?? null
    } catch {
      return null // 🔥 never throw
    } finally {
      clearTimeout(timeout)
    }
  }

  /* ===================================================
     MAIN SCAN (PARALLEL + SAFE)
  =================================================== */

  static async scan(url: string) {
    console.log('🚀 [Performance] Starting performance scan')

    try {

      // 🔥 PARALLEL instead of sequential
      const [mobile, desktop] = await Promise.all([
        this.runPageSpeed(url, 'mobile'),
        this.runPageSpeed(url, 'desktop')
      ])

      if (!mobile && !desktop) {
        return {
          metrics: this.getFallbackMetrics(),
          issues: []
        }
      }

      const base = mobile || desktop
      const audits = base.audits

      const metrics: PerformanceMetrics = {
        mobileScore: mobile
          ? Math.round((mobile.categories.performance.score ?? 0) * 100)
          : 0,

        desktopScore: desktop
          ? Math.round((desktop.categories.performance.score ?? 0) * 100)
          : 0,

        loadTime: audits['interactive']?.numericValue ?? 0,
        firstContentfulPaint: audits['first-contentful-paint']?.numericValue ?? 0,
        largestContentfulPaint: audits['largest-contentful-paint']?.numericValue ?? 0,
        cumulativeLayoutShift: audits['cumulative-layout-shift']?.numericValue ?? 0,
        totalBlockingTime: audits['total-blocking-time']?.numericValue ?? 0,
        speedIndex: audits['speed-index']?.numericValue ?? 0,
        interactiveTime: audits['interactive']?.numericValue ?? 0,

        mainThreadTime: audits['mainthread-work-breakdown']?.numericValue ?? 0,
        totalByteWeight: audits['total-byte-weight']?.numericValue ?? 0,
        unusedJavaScript: audits['unused-javascript']?.numericValue ?? 0,
        unusedCSS: audits['unused-css-rules']?.numericValue ?? 0,

        imageOptimization: {
          totalImages: 0,
          oversizedImages: 0,
          unoptimizedImages: 0,
          formatRecommendations: [
            'Use WebP / AVIF',
            'Lazy load images',
            'Serve responsive sizes'
          ]
        }
      }

      const issues = this.generateIssues(metrics, url)

      return { metrics, issues }

    } catch {
      return {
        metrics: this.getFallbackMetrics(),
        issues: []
      }
    }
  }

  /* ===================================================
     ISSUE GENERATION
  =================================================== */

  private static generateIssues(metrics: PerformanceMetrics, url: string) {
    const issues: any[] = []

    if (metrics.largestContentfulPaint > 2500) {
      issues.push({
        type: 'performance',
        severity: metrics.largestContentfulPaint > 4000 ? 'critical' : 'high',
        title: 'Slow Largest Contentful Paint (LCP)',
        description: 'Optimize hero images and critical resources.',
        metric: 'LCP',
        value: Math.round(metrics.largestContentfulPaint),
        url
      })
    }

    if (metrics.cumulativeLayoutShift > 0.1) {
      issues.push({
        type: 'performance',
        severity: metrics.cumulativeLayoutShift > 0.25 ? 'critical' : 'medium',
        title: 'High Cumulative Layout Shift (CLS)',
        description: 'Reserve space for images and dynamic content.',
        metric: 'CLS',
        value: metrics.cumulativeLayoutShift,
        url
      })
    }

    if (metrics.totalBlockingTime > 300) {
      issues.push({
        type: 'performance',
        severity: 'high',
        title: 'High Total Blocking Time (TBT)',
        description: 'Reduce JS size and defer unused scripts.',
        metric: 'TBT',
        value: metrics.totalBlockingTime,
        url
      })
    }

    return issues
  }

  /* ===================================================
     FALLBACK
  =================================================== */

  private static getFallbackMetrics(): PerformanceMetrics {
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
