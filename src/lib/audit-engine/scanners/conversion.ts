import * as cheerio from 'cheerio'
import { ConversionMetrics, AuditIssue } from '../types'

export class ConversionScanner {
  static async scan(html: string): Promise<{
    metrics: ConversionMetrics
    issues: AuditIssue[]
  }> {
    const $ = cheerio.load(html)
    const metrics = this.calculateConversionMetrics($, html)
    const issues = this.generateConversionIssues($, metrics)
    
    return { metrics, issues }
  }

  private static calculateConversionMetrics($: ReturnType<typeof cheerio.load>, html: string): ConversionMetrics {
    // Email capture
    const emailCapture = this.detectEmailCapture($, html)
    
    // Upsells
    const upsells = this.detectUpsells($, html)
    
    // Urgency elements
    const urgency = this.detectUrgency($, html)
    
    // Free shipping
    const freeShipping = this.detectFreeShipping($, html)
    
    // Exit intent
    const exitIntent = html.includes('exit-intent') || html.includes('beforeunload')
    
    // Cart abandonment
    const cartAbandonment = html.includes('cart-abandonment') || html.includes('abandoned-cart')
    
    // Wishlist
    const wishlist = html.includes('wishlist') || html.includes('save-for-later')
    
    return {
      emailCapture,
      upsells,
      urgency,
      freeShipping,
      exitIntent,
      cartAbandonment,
      wishlist
    }
  }

  private static detectEmailCapture($: ReturnType<typeof cheerio.load>, html: string) {
    const emailForms = $('form').filter((_, form) => {
      const formHtml = $(form).html() || ''
      return formHtml.includes('email') || formHtml.includes('@')
    }).length
    
    const popups = html.includes('popup') && html.includes('email') || 
                   html.includes('modal') && html.includes('subscribe')
    
    const type = popups ? 'popup' : emailForms > 0 ? 'form' : 'none'
    const timing = popups ? 'exit-intent' : 'footer'
    
    return {
      present: emailForms > 0 || popups,
      type,
      timing
    }
  }

  private static detectUpsells($: ReturnType<typeof cheerio.load>, html: string) {
    const relatedProducts = html.includes('related-products') || 
                           $('.related-products, .product-recommendations').length > 0
    
    const frequentlyBought = html.includes('frequently-bought') || 
                            html.includes('customers-also-bought')
    
    const bundles = html.includes('bundle') || 
                   $('.product-bundle, .bundle-offer').length > 0
    
    return {
      relatedProducts,
      frequentlyBought,
      bundles
    }
  }

  private static detectUrgency($: ReturnType<typeof cheerio.load>, html: string) {
    const countdownTimers = html.includes('countdown') || 
                           $('.countdown-timer, .timer').length > 0
    
    const stockCounters = html.includes('stock') && 
                         (html.includes('only') || html.includes('left'))
    
    const limitedOffers = html.includes('limited') || 
                         html.includes('offer') || 
                         html.includes('special')
    
    return {
      countdownTimers,
      stockCounters,
      limitedOffers
    }
  }

  private static detectFreeShipping($: ReturnType<typeof cheerio.load>, html: string) {
    const hasBar = html.includes('free-shipping') || 
                  $('.free-shipping-bar, .shipping-progress').length > 0
    
    // Try to extract threshold
    const thresholdMatch = html.match(/\$(\d+).*free shipping/i) || 
                          html.match(/spend.*\$(\d+)/i)
    
    const threshold = thresholdMatch ? parseFloat(thresholdMatch[1]) : 0
    const hasProgress = html.includes('progress') || html.includes('meter')
    
    return {
      bar: hasBar,
      threshold,
      progress: hasProgress
    }
  }

  private static generateConversionIssues($: ReturnType<typeof cheerio.load>, metrics: ConversionMetrics): AuditIssue[] {
    const issues: AuditIssue[] = []
    
    // No email capture
    if (!metrics.emailCapture.present) {
      issues.push({
        id: 'conv-no-email-capture',
        title: 'Missing Email Capture',
        description: 'Not capturing emails means lost marketing opportunities',
        category: 'conversion',
        subcategory: 'email-marketing',
        severity: 'high',
        confidence: 0.95,
        businessImpact: 'Lost repeat customers and abandoned cart recovery',
        technicalImpact: 'No email list for marketing campaigns',
        solutionSteps: [
          'Add email signup form in footer',
          'Implement exit-intent popup',
          'Offer discount for newsletter signup',
          'Add signup form to thank you page'
        ],
        codeExamples: [
          '<!-- Simple email capture -->',
          '<div class="newsletter-signup">',
          '  <h3>Get 10% Off Your First Order</h3>',
          '  <form action="/contact#contact_form" method="post">',
          '    <input type="email" name="contact[email]" placeholder="Your email">',
          '    <button type="submit">Subscribe</button>',
          '  </form>',
          '</div>'
        ],
        fixPriority: 2,
        estimatedTime: '1-2 hours',
        detectedBy: 'ConversionScanner',
        ruleId: 'CONV-EMAIL-001'
      })
    }
    
    // No upsells
    if (!metrics.upsells.relatedProducts) {
      issues.push({
        id: 'conv-no-upsells',
        title: 'Missing Product Recommendations',
        description: 'Not showing related products reduces average order value',
        category: 'conversion',
        subcategory: 'upselling',
        severity: 'medium',
        confidence: 0.9,
        businessImpact: 'Lower average order value (AOV)',
        technicalImpact: 'Missed cross-selling opportunities',
        solutionSteps: [
          'Enable Shopify\'s product recommendations',
          'Show "Customers also bought" section',
          'Implement "Frequently bought together"',
          'Add "Complete the look" bundles'
        ],
        fixPriority: 3,
        estimatedTime: '2-3 hours',
        detectedBy: 'ConversionScanner',
        ruleId: 'CONV-UPSELL-001'
      })
    }
    
    // No urgency elements
    if (!metrics.urgency.countdownTimers && !metrics.urgency.stockCounters) {
      issues.push({
        id: 'conv-no-urgency',
        title: 'Missing Urgency Elements',
        description: 'Urgency triggers immediate action from shoppers',
        category: 'conversion',
        subcategory: 'urgency',
        severity: 'medium',
        confidence: 0.85,
        businessImpact: 'Slower decision making, more abandoned carts',
        technicalImpact: 'No psychological triggers for conversion',
        solutionSteps: [
          'Add stock counters for low inventory items',
          'Implement countdown timers for sales',
          'Show "Limited time offer" badges',
          'Add "Only X left in stock" messaging'
        ],
        codeExamples: [
          '<!-- Stock counter -->',
          '<div class="stock-counter">',
          '  <span class="stock-low">Only 3 left in stock!</span>',
          '  <div class="stock-progress"></div>',
          '</div>',
          '',
          '<!-- Countdown timer -->',
          '<div class="countdown" data-end="2024-12-31T23:59:59">',
          '  Sale ends in: <span class="timer">24:00:00</span>',
          '</div>'
        ],
        fixPriority: 3,
        estimatedTime: '2 hours',
        detectedBy: 'ConversionScanner',
        ruleId: 'CONV-URGENCY-001'
      })
    }
    
    // No free shipping bar
    if (!metrics.freeShipping.bar && metrics.freeShipping.threshold > 0) {
      issues.push({
        id: 'conv-no-shipping-bar',
        title: 'Missing Free Shipping Progress Bar',
        description: 'Free shipping bars encourage customers to add more items',
        category: 'conversion',
        subcategory: 'shipping',
        severity: 'medium',
        confidence: 0.8,
        businessImpact: 'Lower average order value',
        technicalImpact: 'Missed incentive to increase cart value',
        solutionSteps: [
          'Add free shipping progress bar to cart',
          'Show amount needed for free shipping',
          'Update progress in real-time',
          'Add motivational messages as threshold approaches'
        ],
        codeExamples: [
          '<!-- Free shipping bar -->',
          '<div class="free-shipping-bar">',
          '  <div class="progress">',
          '    <div class="progress-fill" style="width: 60%"></div>',
          '  </div>',
          '  <p>Add $25 more for free shipping!</p>',
          '</div>'
        ],
        fixPriority: 3,
        estimatedTime: '2-3 hours',
        detectedBy: 'ConversionScanner',
        ruleId: 'CONV-SHIPPING-001'
      })
    }
    
    return issues
  }
}