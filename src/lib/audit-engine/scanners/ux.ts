import * as cheerio from 'cheerio'
import { UXMetrics, AuditIssue } from '../types'

export class UXScanner {
  static scan(html: string, storeUrl: string): {
    metrics: UXMetrics
    issues: AuditIssue[]
  } {
    const $ = cheerio.load(html)
    const metrics = this.calculateUXMetrics($, html, storeUrl)
    const issues = this.generateUXIssues($, metrics)
    
    return { metrics, issues }
  }

  private static calculateUXMetrics($: cheerio.CheerioAPI, html: string, storeUrl: string): UXMetrics {
    // Mobile friendliness
    const viewport = $('meta[name="viewport"]').attr('content') || ''
    const viewportConfigured = viewport.includes('width=device-width')
    
    // Product page elements (simulate checking)
    const hasStickyCart = html.includes('sticky') && (html.includes('cart') || html.includes('add-to-cart'))
    const hasImageZoom = html.includes('zoom') || html.includes('lightbox') || html.includes('magnify')
    const hasVideos = html.includes('video') || html.includes('youtube') || html.includes('vimeo')
    const hasReviews = html.includes('review') || html.includes('rating') || html.includes('judge.me') || html.includes('yotpo')
    const hasTrustBadges = html.includes('trust') || html.includes('secure') || html.includes('badge')
    const hasFAQ = html.includes('faq') || html.includes('accordion') || html.includes('question')
    
    // Navigation
    const menuItems = $('nav a, .menu a, .navigation a').length
    const hasMegaMenu = html.includes('mega-menu') || html.includes('megamenu')
    const searchFunctionality = html.includes('search') || $('input[type="search"]').length > 0
    const breadcrumbs = html.includes('breadcrumb') || $('.breadcrumb').length > 0
    
    // Cart & Checkout
    const cartDrawer = html.includes('cart-drawer') || html.includes('drawer') && html.includes('cart')
    const miniCart = html.includes('mini-cart') || html.includes('cart-toggle')
    const guestCheckout = html.includes('guest') || html.includes('checkout')
    const multiplePaymentOptions = html.includes('payment') && (html.includes('shop-pay') || html.includes('apple-pay') || html.includes('google-pay'))
    const shippingCalculator = html.includes('shipping') && html.includes('calculator')
    
    // Mobile tap targets
    const tapTargetsSize = this.checkTapTargets($)
    const fontSizes = this.checkFontSizes($)
    
    // Review analysis
    const reviews = this.analyzeReviews($)
    
    return {
      mobileFriendly: viewportConfigured && tapTargetsSize && fontSizes,
      viewportConfigured,
      tapTargetsSize,
      fontSizes,
      productPage: {
        stickyAddToCart: hasStickyCart,
        imageZoom: hasImageZoom,
        variantSelector: html.includes('variant') || html.includes('option-selector'),
        stockStatus: html.includes('stock') || html.includes('inventory'),
        trustBadges: hasTrustBadges,
        reviews,
        videos: hasVideos,
        sizeGuide: html.includes('size-guide') || html.includes('sizing'),
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

  private static checkTapTargets($: cheerio.CheerioAPI): boolean {
    // Check if buttons and links are large enough for mobile
    const buttons = $('button, a.btn, input[type="submit"], .button')
    let allLargeEnough = true
    
    buttons.each((_, element) => {
      const styles = $(element).attr('style') || ''
      if (styles.includes('padding') && styles.includes('px')) {
        const paddingMatch = styles.match(/padding:\s*(\d+)px/)
        if (paddingMatch && parseInt(paddingMatch[1]) < 10) {
          allLargeEnough = false
        }
      }
    })
    
    return buttons.length === 0 || allLargeEnough
  }

  private static checkFontSizes($: cheerio.CheerioAPI): boolean {
    // Check base font size
    const bodyStyle = $('body').attr('style') || ''
    const bodyFontSizeMatch = bodyStyle.match(/font-size:\s*(\d+)px/)
    
    if (bodyFontSizeMatch) {
      return parseInt(bodyFontSizeMatch[1]) >= 14
    }
    
    // Check for CSS files (simplified)
    return true
  }

  private static analyzeReviews($: cheerio.CheerioAPI) {
    const reviewElements = $('.review, .rating, [itemprop="review"]')
    const reviewCount = reviewElements.length
    
    // Try to extract average rating
    let averageRating = 0
    const ratingElements = $('[itemprop="ratingValue"], .rating-value')
    if (ratingElements.length > 0) {
      const total = ratingElements.toArray().reduce((sum, el) => {
        const text = $(el).text().trim()
        const match = text.match(/(\d+(\.\d+)?)/)
        return sum + (match ? parseFloat(match[1]) : 0)
      }, 0)
      averageRating = ratingElements.length > 0 ? total / ratingElements.length : 0
    }
    
    return {
      present: reviewCount > 0,
      count: reviewCount,
      averageRating
    }
  }

  private static generateUXIssues($: cheerio.CheerioAPI, metrics: UXMetrics): AuditIssue[] {
    const issues: AuditIssue[] = []
    
    // Missing viewport
    if (!metrics.viewportConfigured) {
      issues.push({
        id: 'ux-no-viewport',
        title: 'Missing Viewport Meta Tag',
        description: 'Your store is not optimized for mobile devices',
        category: 'ux',
        subcategory: 'mobile',
        severity: 'critical',
        confidence: 1.0,
        businessImpact: 'Poor mobile experience leads to high bounce rates',
        technicalImpact: 'Content not scaling properly on mobile devices',
        solutionSteps: [
          'Add viewport meta tag to theme.liquid',
          'Ensure proper scaling and zoom settings',
          'Test on multiple mobile devices'
        ],
        codeExamples: [
          '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">',
          '<!-- Add to theme.liquid head section -->'
        ],
        fixPriority: 1,
        estimatedTime: '5 minutes',
        detectedBy: 'UXScanner',
        ruleId: 'UX-MOBILE-001'
      })
    }
    
    // No sticky add to cart
    if (!metrics.productPage.stickyAddToCart) {
      issues.push({
        id: 'ux-no-sticky-cart',
        title: 'Missing Sticky Add to Cart',
        description: 'Product pages need sticky add-to-cart buttons for better conversion',
        category: 'ux',
        subcategory: 'product-page',
        severity: 'high',
        confidence: 0.9,
        businessImpact: 'Lower conversion rates, especially on mobile',
        technicalImpact: 'Users need to scroll to find add-to-cart button',
        solutionSteps: [
          'Implement sticky add-to-cart button',
          'Show button after user scrolls past product info',
          'Include price and variant selector in sticky bar',
          'Ensure button is visible on all screen sizes'
        ],
        codeExamples: [
          `<!-- Sticky cart implementation -->
          <div class="sticky-cart-bar">
            <button class="btn-add-to-cart">Add to Cart - $99.99</button>
          </div>
          <style>
            .sticky-cart-bar {
              position: fixed;
              bottom: 0;
              left: 0;
              right: 0;
              background: white;
              padding: 10px;
              box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
              z-index: 1000;
            }
          </style>`
        ],
        fixPriority: 2,
        estimatedTime: '2-3 hours',
        detectedBy: 'UXScanner',
        ruleId: 'UX-PRODUCT-001'
      })
    }
    
    // No image zoom
    if (!metrics.productPage.imageZoom) {
      issues.push({
        id: 'ux-no-image-zoom',
        title: 'Missing Image Zoom Feature',
        description: 'Customers want to examine product details closely',
        category: 'ux',
        subcategory: 'product-page',
        severity: 'medium',
        confidence: 0.8,
        businessImpact: 'Reduced product confidence and conversion rates',
        technicalImpact: 'Users cannot see product details clearly',
        solutionSteps: [
          'Implement image zoom on product pages',
          'Use Shopify app or custom solution',
          'Enable click/tap to zoom functionality',
          'Add hover zoom for desktop users'
        ],
        codeExamples: [
          '<!-- Using Shopify\'s native zoom -->',
          '{{ product.featured_image | img_url: \'1000x1000\' | img_tag: product.title, \'product-image-zoom\' }}',
          '<!-- Or use a library like fancybox -->'
        ],
        fixPriority: 3,
        estimatedTime: '3-4 hours',
        detectedBy: 'UXScanner',
        ruleId: 'UX-PRODUCT-002'
      })
    }
    
    // No reviews
    if (!metrics.productPage.reviews.present) {
      issues.push({
        id: 'ux-no-reviews',
        title: 'Missing Customer Reviews',
        description: 'Social proof is essential for ecommerce conversions',
        category: 'ux',
        subcategory: 'trust',
        severity: 'high',
        confidence: 0.95,
        businessImpact: 'Significantly lower conversion rates (up to 270% difference)',
        technicalImpact: 'Lack of social proof and user-generated content',
        solutionSteps: [
          'Install a review app (Judge.me, Loox, Yotpo)',
          'Import reviews from other platforms',
          'Show reviews prominently on product pages',
          'Enable photo reviews for better authenticity'
        ],
        fixPriority: 1,
        estimatedTime: '1-2 hours',
        detectedBy: 'UXScanner',
        ruleId: 'UX-TRUST-001'
      })
    }
    
    // Too many menu items
    if (metrics.navigation.menuItems > 7) {
      issues.push({
        id: 'ux-too-many-menu-items',
        title: 'Navigation Menu Too Complex',
        description: 'Too many menu items can overwhelm users',
        category: 'ux',
        subcategory: 'navigation',
        severity: 'medium',
        confidence: 0.85,
        metric: {
          name: 'Menu Items',
          value: `${metrics.navigation.menuItems} items`,
          target: '5-7 main items',
          unit: 'count'
        },
        businessImpact: 'Decision paralysis, users can\'t find what they need',
        technicalImpact: 'Poor information architecture',
        solutionSteps: [
          'Group related items into categories',
          'Use mega menus for complex structures',
          'Implement dropdowns for sub-items',
          'Follow the 7±2 rule for menu items'
        ],
        fixPriority: 3,
        estimatedTime: '2-3 hours',
        detectedBy: 'UXScanner',
        ruleId: 'UX-NAV-001'
      })
    }
    
    // No search functionality
    if (!metrics.navigation.searchFunctionality) {
      issues.push({
        id: 'ux-no-search',
        title: 'Missing Search Functionality',
        description: 'Many users prefer searching over browsing',
        category: 'ux',
        subcategory: 'navigation',
        severity: 'high',
        confidence: 0.9,
        businessImpact: 'Users can\'t find specific products, leading to lost sales',
        technicalImpact: 'Limited navigation options',
        solutionSteps: [
          'Add search bar to header',
          'Implement autocomplete suggestions',
          'Include search filters and sorting',
          'Consider adding predictive search'
        ],
        codeExamples: [
          '<!-- Shopify search form -->',
          '<form action="/search" method="get" role="search">',
          '  <input type="search" name="q" placeholder="Search products...">',
          '  <button type="submit">Search</button>',
          '</form>'
        ],
        fixPriority: 2,
        estimatedTime: '2 hours',
        detectedBy: 'UXScanner',
        ruleId: 'UX-NAV-002'
      })
    }
    
    return issues
  }
}