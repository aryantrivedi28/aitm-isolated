import * as cheerio from 'cheerio'
import { UXMetrics, AuditIssue } from '../types'

export class UXScanner {
  static async scan(
    html: string,
    storeUrl: string
  ): Promise<{
    metrics: UXMetrics
    issues: AuditIssue[]
  }> {
    try {
      const $ = cheerio.load(html)
      const metrics = this.calculateUXMetrics($, html, storeUrl)
      const issues = this.generateUXIssues($, metrics)
      return { metrics, issues }
    } catch (error) {
      console.error('❌ [UXScanner] Scan failed:', error)

      return {
        metrics: this.getFallbackMetrics(),
        issues: []
      }
    }
  }

  // --------------------------------------------
  // METRICS
  // --------------------------------------------
  private static calculateUXMetrics(
    $: ReturnType<typeof cheerio.load>,
    html: string,
    storeUrl: string
  ): UXMetrics {
    const safeHtml = html.toLowerCase()

    // Mobile friendliness
    const viewport =
      $('meta[name="viewport"]').attr('content') || ''
    const viewportConfigured =
      viewport.includes('width=device-width')

    // Product page heuristics
    const hasStickyCart =
      safeHtml.includes('sticky') &&
      (safeHtml.includes('cart') ||
        safeHtml.includes('add-to-cart'))

    const hasImageZoom =
      safeHtml.includes('zoom') ||
      safeHtml.includes('lightbox') ||
      safeHtml.includes('magnify')

    const hasVideos =
      safeHtml.includes('<video') ||
      safeHtml.includes('youtube') ||
      safeHtml.includes('vimeo')

    const hasTrustBadges =
      safeHtml.includes('trust') ||
      safeHtml.includes('secure') ||
      safeHtml.includes('badge')

    const hasFAQ =
      safeHtml.includes('faq') ||
      safeHtml.includes('accordion') ||
      safeHtml.includes('question')

    // Navigation
    const menuItems = $(
      'nav a, .menu a, .navigation a'
    ).length

    const hasMegaMenu =
      safeHtml.includes('mega-menu') ||
      safeHtml.includes('megamenu')

    const searchFunctionality =
      $('input[type="search"]').length > 0 ||
      safeHtml.includes('search')

    const breadcrumbs =
      $('.breadcrumb, [aria-label="breadcrumb"]').length >
        0 || safeHtml.includes('breadcrumb')

    // Cart & Checkout
    const cartDrawer =
      safeHtml.includes('cart-drawer') ||
      (safeHtml.includes('drawer') &&
        safeHtml.includes('cart'))

    const miniCart =
      safeHtml.includes('mini-cart') ||
      safeHtml.includes('cart-toggle')

    const guestCheckout =
      safeHtml.includes('guest') &&
      safeHtml.includes('checkout')

    const multiplePaymentOptions =
      safeHtml.includes('payment') &&
      (safeHtml.includes('shop-pay') ||
        safeHtml.includes('apple-pay') ||
        safeHtml.includes('google-pay'))

    const shippingCalculator =
      safeHtml.includes('shipping') &&
      safeHtml.includes('calculator')

    // Accessibility heuristics
    const tapTargetsSize = this.checkTapTargets($)
    const fontSizes = this.checkFontSizes($)

    const reviews = this.analyzeReviews($)

    return {
      mobileFriendly:
        viewportConfigured &&
        tapTargetsSize &&
        fontSizes,
      viewportConfigured,
      tapTargetsSize,
      fontSizes,

      productPage: {
        stickyAddToCart: hasStickyCart,
        imageZoom: hasImageZoom,
        variantSelector:
          safeHtml.includes('variant') ||
          safeHtml.includes('option-selector'),
        stockStatus:
          safeHtml.includes('stock') ||
          safeHtml.includes('inventory'),
        trustBadges: hasTrustBadges,
        reviews,
        videos: hasVideos,
        sizeGuide:
          safeHtml.includes('size-guide') ||
          safeHtml.includes('sizing'),
        faq: hasFAQ
      },

      navigation: {
        menuItems,
        hasMegaMenu,
        searchFunctionality,
        breadcrumbs
      },

      cartCheckout: {
        cartDrawer,
        miniCart,
        guestCheckout,
        multiplePaymentOptions,
        shippingCalculator
      }
    }
  }

  // --------------------------------------------
  // HELPERS
  // --------------------------------------------
  private static checkTapTargets(
    $: ReturnType<typeof cheerio.load>
  ): boolean {
    const buttons = $(
      'button, a, input[type="submit"]'
    )

    if (buttons.length === 0) return true

    let ok = true

    buttons.each((_, el) => {
      const style = $(el).attr('style') || ''
      const match = style.match(/padding:\s*(\d+)px/i)
      if (match && parseInt(match[1]) < 8) {
        ok = false
      }
    })

    return ok
  }

  private static checkFontSizes(
    $: ReturnType<typeof cheerio.load>
  ): boolean {
    const bodyStyle = $('body').attr('style') || ''
    const match = bodyStyle.match(/font-size:\s*(\d+)px/i)
    return match ? parseInt(match[1]) >= 14 : true
  }

  private static analyzeReviews(
    $: ReturnType<typeof cheerio.load>
  ) {
    const reviewElements = $(
      '.review, .rating, [itemprop="review"]'
    )

    const ratingElements = $(
      '[itemprop="ratingValue"], .rating-value'
    )

    let averageRating = 0

    if (ratingElements.length > 0) {
      let total = 0
      ratingElements.each((_, el) => {
        const text = $(el).text().trim()
        const match = text.match(/(\d+(\.\d+)?)/)
        if (match) total += parseFloat(match[1])
      })
      averageRating = total / ratingElements.length
    }

    return {
      present: reviewElements.length > 0,
      count: reviewElements.length,
      averageRating
    }
  }

  // --------------------------------------------
  // ISSUES
  // --------------------------------------------
  private static generateUXIssues(
    $: ReturnType<typeof cheerio.load>,
    metrics: UXMetrics
  ): AuditIssue[] {
    const issues: AuditIssue[] = []

    if (!metrics.viewportConfigured) {
      issues.push({
        id: 'ux-no-viewport',
        title: 'Missing Viewport Meta Tag',
        description:
          'Your store is not optimized for mobile devices',
        category: 'ux',
        subcategory: 'mobile',
        severity: 'critical',
        confidence: 1,
        businessImpact:
          'High mobile bounce rate and poor UX',
        technicalImpact:
          'Improper scaling on mobile devices',
        solutionSteps: [
          'Add viewport meta tag in theme head'
        ],
        fixPriority: 1,
        estimatedTime: '5 minutes',
        detectedBy: 'UXScanner',
        ruleId: 'UX-MOBILE-001'
      })
    }

    if (!metrics.productPage.stickyAddToCart) {
      issues.push({
        id: 'ux-no-sticky-cart',
        title: 'Missing Sticky Add to Cart',
        description:
          'Sticky add-to-cart improves mobile conversions',
        category: 'ux',
        subcategory: 'product-page',
        severity: 'high',
        confidence: 0.9,
        fixPriority: 2,
        estimatedTime: '2–3 hours',
        detectedBy: 'UXScanner',
        ruleId: 'UX-PRODUCT-001'
      })
    }

    if (!metrics.productPage.reviews.present) {
      issues.push({
        id: 'ux-no-reviews',
        title: 'Missing Customer Reviews',
        description:
          'Social proof significantly increases conversions',
        category: 'ux',
        subcategory: 'trust',
        severity: 'high',
        confidence: 0.95,
        fixPriority: 1,
        estimatedTime: '1–2 hours',
        detectedBy: 'UXScanner',
        ruleId: 'UX-TRUST-001'
      })
    }

    return issues
  }

  // --------------------------------------------
  // FALLBACK
  // --------------------------------------------
  private static getFallbackMetrics(): UXMetrics {
    return {
      mobileFriendly: false,
      viewportConfigured: false,
      tapTargetsSize: false,
      fontSizes: false,
      productPage: {
        stickyAddToCart: false,
        imageZoom: false,
        variantSelector: false,
        stockStatus: false,
        trustBadges: false,
        reviews: {
          present: false,
          count: 0,
          averageRating: 0
        },
        videos: false,
        sizeGuide: false,
        faq: false
      },
      navigation: {
        menuItems: 0,
        hasMegaMenu: false,
        searchFunctionality: false,
        breadcrumbs: false
      },
      cartCheckout: {
        cartDrawer: false,
        miniCart: false,
        guestCheckout: false,
        multiplePaymentOptions: false,
        shippingCalculator: false
      }
    }
  }
}
