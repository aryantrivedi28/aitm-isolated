import * as cheerio from 'cheerio'
import { TrustMetrics, AuditIssue } from '../types'

export class TrustScanner {
  static async scan(html: string): Promise<{
    metrics: TrustMetrics
    issues: AuditIssue[]
  }> {
    const $ = cheerio.load(html)
    const metrics = this.calculateTrustMetrics($, html)
    const issues = this.generateTrustIssues($, metrics)
    
    return { metrics, issues }
  }

  private static calculateTrustMetrics($: ReturnType<typeof cheerio.load>, html: string): TrustMetrics {
    // Security indicators
    const ssl = html.includes('https://') || window.location.protocol === 'https:'
    const secureCheckout = html.includes('secure-checkout') || html.includes('checkout.shopify.com')
    const paymentIcons = this.detectPaymentIcons($, html)
    
    // Social proof
    const socialProof = this.detectSocialProof($, html)
    
    // Policies
    const policies = this.detectPolicies($, html)
    
    // Contact info
    const contactInfo = this.detectContactInfo($, html)
    
    // About page & blog
    const aboutPage = html.includes('about') || $('a[href*="about"]').length > 0
    const blog = html.includes('blog') || $('a[href*="blog"]').length > 0
    
    return {
      security: {
        ssl,
        secureCheckout,
        paymentIcons
      },
      socialProof,
      policies,
      contactInfo,
      aboutPage,
      blog
    }
  }

  private static detectPaymentIcons($: ReturnType<typeof cheerio.load>, html: string): boolean {
    const paymentTerms = [
      'visa', 'mastercard', 'amex', 'discover', 'paypal', 
      'apple-pay', 'google-pay', 'shop-pay', 'klarna', 'afterpay'
    ]
    
    return paymentTerms.some(term => 
      html.toLowerCase().includes(term) || 
      $('img[src*="' + term + '"], img[alt*="' + term + '"]').length > 0
    )
  }

  private static detectSocialProof($: ReturnType<typeof cheerio.load>, html: string) {
    const hasReviews = html.includes('review') || $('.review, .testimonial').length > 0
    const hasTestimonials = html.includes('testimonial') || $('.testimonial').length > 0
    const hasTrustpilot = html.includes('trustpilot') || $('img[src*="trustpilot"]').length > 0
    const hasSocialMedia = $('a[href*="facebook.com"], a[href*="instagram.com"], a[href*="twitter.com"]').length > 0
    
    return {
      reviews: hasReviews,
      testimonials: hasTestimonials,
      trustpilot: hasTrustpilot,
      socialMedia: hasSocialMedia
    }
  }

  private static detectPolicies($: ReturnType<typeof cheerio.load>, html: string) {
    const links = $('a').toArray()
    
    const refundPolicy = links.some(el => 
      $(el).attr('href')?.includes('refund') || 
      $(el).text().toLowerCase().includes('refund')
    )
    
    const shippingPolicy = links.some(el => 
      $(el).attr('href')?.includes('shipping') || 
      $(el).text().toLowerCase().includes('shipping')
    )
    
    const privacyPolicy = links.some(el => 
      $(el).attr('href')?.includes('privacy') || 
      $(el).text().toLowerCase().includes('privacy')
    )
    
    const termsPolicy = links.some(el => 
      $(el).attr('href')?.includes('terms') || 
      $(el).text().toLowerCase().includes('terms')
    )
    
    return {
      refund: refundPolicy,
      shipping: shippingPolicy,
      privacy: privacyPolicy,
      terms: termsPolicy
    }
  }

  private static detectContactInfo($: ReturnType<typeof cheerio.load>, html: string) {
    const hasAddress = html.includes('address') || $('address').length > 0
    const hasPhone = html.includes('tel:') || $('a[href^="tel:"]').length > 0
    const hasEmail = html.includes('mailto:') || $('a[href^="mailto:"]').length > 0
    const hasLiveChat = html.includes('live-chat') || html.includes('chat') || html.includes('support')
    
    return {
      address: hasAddress,
      phone: hasPhone,
      email: hasEmail,
      liveChat: hasLiveChat
    }
  }

  private static generateTrustIssues($: ReturnType<typeof cheerio.load>, metrics: TrustMetrics): AuditIssue[] {
    const issues: AuditIssue[] = []
    
    // No SSL (though Shopify enforces this)
    if (!metrics.security.ssl) {
      issues.push({
        id: 'trust-no-ssl',
        title: 'Missing SSL Certificate',
        description: 'Site is not using HTTPS, which is essential for security',
        category: 'trust',
        subcategory: 'security',
        severity: 'critical',
        confidence: 1.0,
        businessImpact: 'Customers will not trust your store with payment info',
        technicalImpact: 'Data transmitted in plain text, security vulnerability',
        solutionSteps: [
          'Enable SSL certificate in Shopify settings',
          'Force HTTPS for all pages',
          'Update all internal links to use HTTPS',
          'Set up proper SSL redirects'
        ],
        fixPriority: 1,
        estimatedTime: '30 minutes',
        detectedBy: 'TrustScanner',
        ruleId: 'TRUST-SEC-001'
      })
    }
    
    // No payment icons
    if (!metrics.security.paymentIcons) {
      issues.push({
        id: 'trust-no-payment-icons',
        title: 'Missing Payment Method Icons',
        description: 'Customers want to see accepted payment methods before shopping',
        category: 'trust',
        subcategory: 'payment',
        severity: 'high',
        confidence: 0.9,
        businessImpact: 'Lower conversion rates at checkout',
        technicalImpact: 'Lack of payment method transparency',
        solutionSteps: [
          'Add payment icons to footer',
          'Show accepted methods on product pages',
          'Include payment security badges',
          'Add trust seals like Norton or McAfee'
        ],
        codeExamples: [
          '<!-- Payment icons -->',
          '<div class="payment-icons">',
          '  <img src="visa.svg" alt="Visa">',
          '  <img src="mastercard.svg" alt="Mastercard">',
          '  <img src="paypal.svg" alt="PayPal">',
          '  <img src="apple-pay.svg" alt="Apple Pay">',
          '</div>'
        ],
        fixPriority: 2,
        estimatedTime: '1 hour',
        detectedBy: 'TrustScanner',
        ruleId: 'TRUST-PAY-001'
      })
    }
    
    // No refund policy
    if (!metrics.policies.refund) {
      issues.push({
        id: 'trust-no-refund-policy',
        title: 'Missing Refund/Return Policy',
        description: 'Clear return policies increase customer confidence',
        category: 'trust',
        subcategory: 'policies',
        severity: 'high',
        confidence: 0.95,
        businessImpact: 'Customers hesitant to purchase without clear returns',
        technicalImpact: 'Legal compliance issues',
        solutionSteps: [
          'Create clear refund and return policy',
          'Link to policy in footer and checkout',
          'Include timeframes and conditions',
          'Make policy easy to find and understand'
        ],
        fixPriority: 2,
        estimatedTime: '1-2 hours',
        detectedBy: 'TrustScanner',
        ruleId: 'TRUST-POLICY-001'
      })
    }
    
    // No contact info
    if (!metrics.contactInfo.email && !metrics.contactInfo.phone) {
      issues.push({
        id: 'trust-no-contact-info',
        title: 'Missing Contact Information',
        description: 'Customers need ways to contact you for support',
        category: 'trust',
        subcategory: 'contact',
        severity: 'high',
        confidence: 0.9,
        businessImpact: 'Lost sales from customers with questions',
        technicalImpact: 'Poor customer service accessibility',
        solutionSteps: [
          'Add email address to header/footer',
          'Include phone number if possible',
          'Add contact form to website',
          'Consider live chat for immediate support'
        ],
        codeExamples: [
          '<!-- Contact info in footer -->',
          '<div class="contact-info">',
          '  <p>Email: support@yourstore.com</p>',
          '  <p>Phone: (555) 123-4567</p>',
          '  <p>Hours: Mon-Fri 9am-5pm EST</p>',
          '</div>'
        ],
        fixPriority: 2,
        estimatedTime: '1 hour',
        detectedBy: 'TrustScanner',
        ruleId: 'TRUST-CONTACT-001'
      })
    }
    
    // No about page
    if (!metrics.aboutPage) {
      issues.push({
        id: 'trust-no-about-page',
        title: 'Missing About Us Page',
        description: 'Customers want to know who they\'re buying from',
        category: 'trust',
        subcategory: 'brand',
        severity: 'medium',
        confidence: 0.85,
        businessImpact: 'Lower brand trust and customer connection',
        technicalImpact: 'Missing brand story and values',
        solutionSteps: [
          'Create "About Us" page',
          'Tell your brand story',
          'Include team photos and bios',
          'Share your mission and values'
        ],
        fixPriority: 3,
        estimatedTime: '2-3 hours',
        detectedBy: 'TrustScanner',
        ruleId: 'TRUST-BRAND-001'
      })
    }
    
    return issues
  }
}