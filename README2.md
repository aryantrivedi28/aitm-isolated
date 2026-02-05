# **Advanced Shopify Audit Backend System**
## **Complete Professional Audit Engine**

---

## 📁 **Backend Structure**
```
lib/
├── audit-engine/
│   ├── index.ts              # Main orchestration
│   ├── types.ts              # All types
│   ├── crawler/
│   │   ├── index.ts          # Main crawler
│   │   ├── shopify-detector.ts
│   │   └── page-analyzer.ts
│   ├── scanners/
│   │   ├── performance.ts
│   │   ├── seo.ts
│   │   ├── ux.ts
│   │   ├── pdp.ts
│   │   ├── trust.ts
│   │   ├── conversion.ts
│   │   └── security.ts
│   ├── analyzers/
│   │   ├── ai-analyzer.ts    # OpenAI for deep analysis
│   │   ├── issue-classifier.ts
│   │   └── score-calculator.ts
│   └── utils/
│       ├── helpers.ts
│       └── constants.ts
├── db/
│   └── supabase.ts          # Database operations
├── email/
│   └── nodemailer.ts        # Email service
└── api/
    ├── audit/route.ts
    └── email/route.ts
```

---

## 1️⃣ **Environment Variables**

### **.env.local**
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI
OPENAI_API_KEY=

# Puppeteer/Real Browser
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
BROWSERLESS_API_KEY= # Optional for cloud

# Lighthouse
LIGHTHOUSE_API_KEY= # Optional

# Email (Your Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM="Shopify Audit <audit@yourdomain.com>"

# Rate Limiting
RATE_LIMIT_PER_MINUTE=10
MAX_AUDIT_DURATION=300000 # 5 minutes
```

---

## 2️⃣ **Complete Database Schema**

### **SQL Migration**
```sql
-- Enable UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Main audits table
CREATE TABLE audits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  store_url TEXT NOT NULL,
  store_name VARCHAR(255),
  
  -- Technical details
  shopify_theme VARCHAR(100),
  theme_version VARCHAR(50),
  apps_detected INTEGER DEFAULT 0,
  products_count INTEGER,
  collections_count INTEGER,
  
  -- Performance metrics
  mobile_score INTEGER,
  desktop_score INTEGER,
  load_time_ms INTEGER,
  lcp_ms INTEGER,
  cls_score DECIMAL(5,3),
  inp_ms INTEGER,
  tbt_ms INTEGER,
  
  -- SEO metrics
  seo_score INTEGER,
  has_meta_title BOOLEAN DEFAULT FALSE,
  has_meta_description BOOLEAN DEFAULT FALSE,
  has_structured_data BOOLEAN DEFAULT FALSE,
  h1_count INTEGER DEFAULT 0,
  internal_links INTEGER DEFAULT 0,
  external_links INTEGER DEFAULT 0,
  
  -- UX metrics
  mobile_friendly BOOLEAN DEFAULT FALSE,
  has_sticky_cart BOOLEAN DEFAULT FALSE,
  has_image_zoom BOOLEAN DEFAULT FALSE,
  has_video BOOLEAN DEFAULT FALSE,
  has_reviews BOOLEAN DEFAULT FALSE,
  has_trust_badges BOOLEAN DEFAULT FALSE,
  has_faq BOOLEAN DEFAULT FALSE,
  has_upsells BOOLEAN DEFAULT FALSE,
  
  -- Business metrics
  has_free_shipping_bar BOOLEAN DEFAULT FALSE,
  has_countdown_timer BOOLEAN DEFAULT FALSE,
  has_email_capture BOOLEAN DEFAULT FALSE,
  has_exit_intent BOOLEAN DEFAULT FALSE,
  has_shop_pay BOOLEAN DEFAULT FALSE,
  has_apple_pay BOOLEAN DEFAULT FALSE,
  has_google_pay BOOLEAN DEFAULT FALSE,
  
  -- Scores (0-100)
  overall_score INTEGER DEFAULT 0,
  performance_score INTEGER DEFAULT 0,
  seo_score INTEGER DEFAULT 0,
  ux_score INTEGER DEFAULT 0,
  conversion_score INTEGER DEFAULT 0,
  trust_score INTEGER DEFAULT 0,
  
  -- Raw data
  raw_metrics JSONB DEFAULT '{}',
  screenshot_urls JSONB DEFAULT '[]',
  page_html TEXT,
  
  -- Issues (JSON arrays)
  critical_issues JSONB DEFAULT '[]',
  high_issues JSONB DEFAULT '[]',
  medium_issues JSONB DEFAULT '[]',
  low_issues JSONB DEFAULT '[]',
  
  -- Recommendations
  recommendations JSONB DEFAULT '[]',
  quick_wins JSONB DEFAULT '[]',
  long_term_improvements JSONB DEFAULT '[]',
  
  -- AI Analysis
  ai_summary TEXT,
  priority_actions JSONB DEFAULT '[]',
  estimated_impact JSONB DEFAULT '{}',
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending',
  is_email_sent BOOLEAN DEFAULT FALSE,
  error_message TEXT,
  
  -- Timestamps
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Issues table for detailed tracking
CREATE TABLE audit_issues (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  audit_id UUID REFERENCES audits(id) ON DELETE CASCADE,
  issue_id VARCHAR(100) NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  subcategory VARCHAR(50),
  severity VARCHAR(20) NOT NULL,
  confidence DECIMAL(3,2) DEFAULT 0.8,
  
  -- Metrics
  metric_name VARCHAR(100),
  metric_value VARCHAR(100),
  metric_target VARCHAR(100),
  metric_unit VARCHAR(20),
  
  -- Impact & Solution
  business_impact TEXT,
  technical_impact TEXT,
  solution_steps JSONB DEFAULT '[]',
  code_examples JSONB DEFAULT '[]',
  
  -- URLs & Evidence
  affected_pages JSONB DEFAULT '[]',
  screenshot_url TEXT,
  html_snippet TEXT,
  
  -- AI Analysis
  ai_explanation TEXT,
  fix_priority INTEGER DEFAULT 5,
  estimated_time VARCHAR(50),
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_audits_email ON audits(email);
CREATE INDEX idx_audits_status ON audits(status);
CREATE INDEX idx_audits_created ON audits(created_at DESC);
CREATE INDEX idx_audit_issues_audit ON audit_issues(audit_id);
CREATE INDEX idx_audit_issues_severity ON audit_issues(severity);

-- RLS Policies
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_issues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts" ON audits
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow select by id" ON audits
  FOR SELECT USING (true);

CREATE POLICY "Allow select issues by audit" ON audit_issues
  FOR SELECT USING (EXISTS (SELECT 1 FROM audits WHERE audits.id = audit_issues.audit_id));
```

---

## 3️⃣ **Types Definition**

### **lib/audit-engine/types.ts**
```typescript
export interface ShopifyStoreInfo {
  url: string;
  isShopify: boolean;
  theme: {
    name: string;
    version: string;
    isOs20: boolean;
    isLegacy: boolean;
  };
  apps: {
    count: number;
    list: string[];
  };
  products: number;
  collections: number;
  currency: string;
  country: string;
  language: string;
}

export interface PerformanceMetrics {
  mobileScore: number;
  desktopScore: number;
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  totalBlockingTime: number;
  speedIndex: number;
  interactiveTime: number;
  mainThreadTime: number;
  totalByteWeight: number;
  unusedJavaScript: number;
  unusedCSS: number;
  imageOptimization: {
    totalImages: number;
    oversizedImages: number;
    unoptimizedImages: number;
    formatRecommendations: string[];
  };
}

export interface SEOMetrics {
  score: number;
  metaTitle: {
    present: boolean;
    length: number;
    missing: boolean;
  };
  metaDescription: {
    present: boolean;
    length: number;
    missing: boolean;
  };
  headingStructure: {
    h1Count: number;
    h2Count: number;
    h3Count: number;
    hierarchyValid: boolean;
  };
  structuredData: {
    present: boolean;
    type: string;
    valid: boolean;
  };
  internalLinks: number;
  externalLinks: number;
  canonicalUrl: {
    present: boolean;
    valid: boolean;
  };
  robotsTxt: {
    present: boolean;
    valid: boolean;
  };
  sitemap: {
    present: boolean;
    valid: boolean;
  };
}

export interface UXMetrics {
  mobileFriendly: boolean;
  viewportConfigured: boolean;
  tapTargetsSize: boolean;
  fontSizes: boolean;
  productPage: {
    stickyAddToCart: boolean;
    imageZoom: boolean;
    variantSelector: boolean;
    stockStatus: boolean;
    trustBadges: boolean;
    reviews: {
      present: boolean;
      count: number;
      averageRating: number;
    };
    videos: boolean;
    sizeGuide: boolean;
    faq: boolean;
  };
  navigation: {
    menuItems: number;
    hasMegaMenu: boolean;
    searchFunctionality: boolean;
    breadcrumbs: boolean;
  };
  cartCheckout: {
    cartDrawer: boolean;
    miniCart: boolean;
    guestCheckout: boolean;
    multiplePaymentOptions: boolean;
    shippingCalculator: boolean;
  };
}

export interface ConversionMetrics {
  emailCapture: {
    present: boolean;
    type: string;
    timing: string;
  };
  upsells: {
    relatedProducts: boolean;
    frequentlyBought: boolean;
    bundles: boolean;
  };
  urgency: {
    countdownTimers: boolean;
    stockCounters: boolean;
    limitedOffers: boolean;
  };
  freeShipping: {
    bar: boolean;
    threshold: number;
    progress: boolean;
  };
  exitIntent: boolean;
  cartAbandonment: boolean;
  wishlist: boolean;
}

export interface TrustMetrics {
  security: {
    ssl: boolean;
    secureCheckout: boolean;
    paymentIcons: boolean;
  };
  socialProof: {
    reviews: boolean;
    testimonials: boolean;
    trustpilot: boolean;
    socialMedia: boolean;
  };
  policies: {
    refund: boolean;
    shipping: boolean;
    privacy: boolean;
    terms: boolean;
  };
  contactInfo: {
    address: boolean;
    phone: boolean;
    email: boolean;
    liveChat: boolean;
  };
  aboutPage: boolean;
  blog: boolean;
}

export interface AuditIssue {
  id: string;
  title: string;
  description: string;
  category: 'performance' | 'seo' | 'ux' | 'conversion' | 'trust' | 'security';
  subcategory: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  confidence: number;
  
  // Metrics
  metric?: {
    name: string;
    value: string | number;
    target: string | number;
    unit: string;
  };
  
  // Business Impact
  businessImpact: string;
  technicalImpact: string;
  
  // Solutions
  solutionSteps: string[];
  codeExamples?: string[];
  
  // Evidence
  affectedPages: string[];
  screenshotUrl?: string;
  htmlSnippet?: string;
  
  // AI Analysis
  aiExplanation?: string;
  fixPriority: number;
  estimatedTime: string;
  
  // Audit Info
  detectedBy: string;
  ruleId: string;
}

export interface AuditResult {
  storeInfo: ShopifyStoreInfo;
  performance: PerformanceMetrics;
  seo: SEOMetrics;
  ux: UXMetrics;
  conversion: ConversionMetrics;
  trust: TrustMetrics;
  issues: AuditIssue[];
  scores: {
    overall: number;
    performance: number;
    seo: number;
    ux: number;
    conversion: number;
    trust: number;
  };
  recommendations: {
    critical: string[];
    high: string[];
    medium: string[];
    low: string[];
  };
  aiAnalysis: {
    summary: string;
    priorityActions: string[];
    quickWins: string[];
    estimatedImpact: {
      conversionRate: string;
      aovIncrease: string;
      revenuePotential: string;
    };
  };
}

export interface CrawlResult {
  url: string;
  html: string;
  screenshots: {
    desktop: string;
    mobile: string;
  };
  resources: {
    scripts: string[];
    styles: string[];
    images: string[];
    fonts: string[];
  };
  headers: Record<string, string>;
  status: number;
  loadTime: number;
}
```

---

## 4️⃣ **Advanced Crawler with Puppeteer**

### **lib/audit-engine/crawler/index.ts**
```typescript
import puppeteer, { Browser, Page } from 'puppeteer-core'
import { CrawlResult } from '../types'

export class AdvancedCrawler {
  private browser: Browser | null = null
  private page: Page | null = null

  async initialize() {
    const browserless = process.env.BROWSERLESS_API_KEY
    
    if (browserless) {
      // Use Browserless for production
      this.browser = await puppeteer.connect({
        browserWSEndpoint: `wss://chrome.browserless.io?token=${browserless}`,
      })
    } else {
      // Local Chrome
      this.browser = await puppeteer.launch({
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
        ],
        headless: 'new',
      })
    }
    
    this.page = await this.browser.newPage()
    
    // Set realistic viewport
    await this.page.setViewport({ width: 1920, height: 1080 })
    
    // Set user agent
    await this.page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    )
  }

  async crawl(url: string): Promise<CrawlResult> {
    if (!this.page) throw new Error('Crawler not initialized')

    const startTime = Date.now()
    
    try {
      // Navigate to URL
      await this.page.goto(url, {
        waitUntil: 'networkidle0',
        timeout: 30000
      })

      // Take screenshots
      const desktopScreenshot = await this.page.screenshot({ 
        encoding: 'base64',
        fullPage: true 
      })

      // Mobile screenshot
      await this.page.setViewport({ width: 375, height: 812 })
      const mobileScreenshot = await this.page.screenshot({ 
        encoding: 'base64',
        fullPage: true 
      })

      // Get page content
      const html = await this.page.content()
      
      // Extract resources
      const resources = await this.page.evaluate(() => {
        const scripts = Array.from(document.scripts).map(s => s.src).filter(Boolean)
        const styles = Array.from(document.styleSheets).map(s => s.href).filter(Boolean)
        const images = Array.from(document.images).map(img => img.src).filter(Boolean)
        const fonts = Array.from(document.fonts).map(f => f.family)
        
        return { scripts, styles, images, fonts }
      })

      // Get response headers
      const response = await this.page.goto(url, { waitUntil: 'networkidle0' })
      const headers = response?.headers() || {}

      const loadTime = Date.now() - startTime

      return {
        url,
        html,
        screenshots: {
          desktop: `data:image/png;base64,${desktopScreenshot}`,
          mobile: `data:image/png;base64,${mobileScreenshot}`
        },
        resources,
        headers,
        status: response?.status() || 0,
        loadTime
      }

    } catch (error) {
      console.error('Crawl error:', error)
      throw new Error(`Failed to crawl ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async evaluate<T>(script: string): Promise<T> {
    if (!this.page) throw new Error('Page not initialized')
    return await this.page.evaluate(script) as T
  }

  async close() {
    if (this.browser) {
      await this.browser.close()
    }
  }
}
```

---

## 5️⃣ **Shopify Detector**

### **lib/audit-engine/crawler/shopify-detector.ts**
```typescript
import { ShopifyStoreInfo } from '../types'

export class ShopifyDetector {
  static detect(html: string, headers: Record<string, string>, url: string): ShopifyStoreInfo {
    const isShopify = this.isShopifyStore(html, headers, url)
    
    if (!isShopify) {
      throw new Error('Not a Shopify store')
    }

    const theme = this.extractThemeInfo(html)
    const apps = this.detectApps(html)
    const stats = this.extractStoreStats(html)

    return {
      url,
      isShopify: true,
      theme,
      apps,
      ...stats,
      currency: this.extractCurrency(html),
      country: this.extractCountry(headers),
      language: this.extractLanguage(html)
    }
  }

  private static isShopifyStore(html: string, headers: Record<string, string>, url: string): boolean {
    // Check URL pattern
    if (url.includes('.myshopify.com')) return true
    
    // Check headers
    if (headers['x-shopid'] || headers['x-shopify-stage']) return true
    
    // Check HTML content
    const shopifyIndicators = [
      'shopify',
      'Shopify.theme',
      'window.Shopify',
      'cdn.shopify.com',
      '//cdn.shopify.com',
      'var Shopify =',
      'Shopify.shop =',
      'Shopify.money_format'
    ]

    return shopifyIndicators.some(indicator => 
      html.toLowerCase().includes(indicator.toLowerCase())
    )
  }

  private static extractThemeInfo(html: string) {
    const themeMatch = html.match(/Shopify\.theme\s*=\s*({[^}]+})/)
    const theme = themeMatch ? JSON.parse(themeMatch[1]) : {}
    
    const isOs20 = html.includes('"api_version":"') || 
                   html.includes('template_suffix') ||
                   html.includes('sections/')
    
    return {
      name: theme.name || 'Unknown',
      version: theme.version || '1.0',
      isOs20,
      isLegacy: !isOs20
    }
  }

  private static detectApps(html: string) {
    const scriptTags = html.match(/<script[^>]+src="[^"]+"[^>]*>/g) || []
    const linkTags = html.match(/<link[^>]+href="[^"]+"[^>]*>/g) || []
    
    const allAssets = [...scriptTags, ...linkTags]
    
    const appPatterns = [
      'apps.shopify.com',
      'shopifyapps',
      'rechargeapps.com',
      'judge.me',
      'loox.io',
      'yotpo.com',
      'klaviyo.com',
      'privacy.com',
      'gorgias.io',
      'reviews.io',
      'okendo.io',
      'stamped.io'
    ]

    const detectedApps = appPatterns.filter(pattern => 
      allAssets.some(asset => asset.includes(pattern))
    )

    return {
      count: detectedApps.length,
      list: detectedApps
    }
  }

  private static extractStoreStats(html: string) {
    // Try to extract product count from structured data
    const productMatch = html.match(/"productCount":\s*(\d+)/)
    const collectionMatch = html.match(/"collectionCount":\s*(\d+)/)
    
    return {
      products: productMatch ? parseInt(productMatch[1]) : 0,
      collections: collectionMatch ? parseInt(collectionMatch[1]) : 0
    }
  }

  private static extractCurrency(html: string) {
    const currencyMatch = html.match(/"currency":\s*"([^"]+)"/) ||
                         html.match(/money_format":\s*"([^"]+)"/) ||
                         html.match(/data-currency="([^"]+)"/)
    
    return currencyMatch ? currencyMatch[1] : 'USD'
  }

  private static extractCountry(headers: Record<string, string>) {
    return headers['cf-ipcountry'] || 'US'
  }

  private static extractLanguage(html: string) {
    const langMatch = html.match(/lang="([^"]+)"/) ||
                     html.match(/"locale":\s*"([^"]+)"/)
    
    return langMatch ? langMatch[1] : 'en'
  }
}
```

---

## 6️⃣ **Performance Scanner (Lighthouse Integration)**

### **lib/audit-engine/scanners/performance.ts**
```typescript
import lighthouse from 'lighthouse'
import { LaunchOptions } from 'lighthouse/types/lhr/settings'
import { PerformanceMetrics, AuditIssue } from '../types'

export class PerformanceScanner {
  static async scan(url: string): Promise<{
    metrics: PerformanceMetrics
    issues: AuditIssue[]
  }> {
    try {
      // Run Lighthouse
      const options: LaunchOptions = {
        output: 'json',
        onlyCategories: ['performance'],
        formFactor: 'mobile',
        screenEmulation: {
          mobile: true,
          width: 375,
          height: 667,
          deviceScaleFactor: 2,
          disabled: false
        }
      }

      // In production, use browserless or similar service
      const runnerResult = await lighthouse(url, options)
      
      if (!runnerResult) {
        throw new Error('Lighthouse failed to run')
      }

      const lhr = runnerResult.lhr
      const audits = lhr.audits

      // Extract metrics
      const metrics: PerformanceMetrics = {
        mobileScore: Math.round(lhr.categories.performance.score * 100),
        desktopScore: 0, // Would run separate desktop audit
        loadTime: audits['interactive']?.numericValue || 0,
        firstContentfulPaint: audits['first-contentful-paint']?.numericValue || 0,
        largestContentfulPaint: audits['largest-contentful-paint']?.numericValue || 0,
        cumulativeLayoutShift: audits['cumulative-layout-shift']?.numericValue || 0,
        totalBlockingTime: audits['total-blocking-time']?.numericValue || 0,
        speedIndex: audits['speed-index']?.numericValue || 0,
        interactiveTime: audits['interactive']?.numericValue || 0,
        mainThreadTime: 0,
        totalByteWeight: audits['total-byte-weight']?.numericValue || 0,
        unusedJavaScript: audits['unused-javascript']?.numericValue || 0,
        unusedCSS: audits['unused-css-rules']?.numericValue || 0,
        imageOptimization: await this.analyzeImages(url)
      }

      // Generate issues from Lighthouse results
      const issues = this.generateIssues(audits, metrics)

      return { metrics, issues }
    } catch (error) {
      console.error('Performance scan error:', error)
      // Return fallback data
      return {
        metrics: this.getFallbackMetrics(),
        issues: [{
          id: 'perf-error',
          title: 'Performance scan failed',
          description: 'Could not complete performance analysis',
          category: 'performance',
          subcategory: 'scanning',
          severity: 'medium',
          confidence: 0.9,
          businessImpact: 'Cannot optimize unknown performance issues',
          technicalImpact: 'Incomplete audit results',
          solutionSteps: ['Try running audit again', 'Check store accessibility'],
          fixPriority: 3,
          estimatedTime: 'N/A',
          detectedBy: 'PerformanceScanner',
          ruleId: 'PERF-001'
        }]
      }
    }
  }

  private static generateIssues(audits: any, metrics: PerformanceMetrics): AuditIssue[] {
    const issues: AuditIssue[] = []

    // LCP Issue
    if (metrics.largestContentfulPaint > 2500) {
      issues.push({
        id: 'perf-lcp-slow',
        title: 'Slow Largest Contentful Paint',
        description: 'The main content takes too long to load',
        category: 'performance',
        subcategory: 'loading',
        severity: metrics.largestContentfulPaint > 4000 ? 'critical' : 'high',
        confidence: 0.95,
        metric: {
          name: 'LCP',
          value: `${Math.round(metrics.largestContentfulPaint)}ms`,
          target: '2500ms',
          unit: 'ms'
        },
        businessImpact: '40-60% of visitors may leave before seeing content',
        technicalImpact: 'Poor Core Web Vitals score',
        solutionSteps: [
          'Optimize hero image size (aim for <500KB)',
          'Preload critical resources',
          'Implement lazy loading for below-the-fold images',
          'Remove render-blocking JavaScript'
        ],
        fixPriority: 1,
        estimatedTime: '2-4 hours',
        detectedBy: 'Lighthouse',
        ruleId: 'PERF-LCP-001'
      })
    }

    // CLS Issue
    if (metrics.cumulativeLayoutShift > 0.1) {
      issues.push({
        id: 'perf-high-cls',
        title: 'High Cumulative Layout Shift',
        description: 'Page elements shift unexpectedly during loading',
        category: 'performance',
        subcategory: 'stability',
        severity: metrics.cumulativeLayoutShift > 0.25 ? 'critical' : 'high',
        confidence: 0.9,
        metric: {
          name: 'CLS',
          value: metrics.cumulativeLayoutShift.toFixed(3),
          target: '0.1',
          unit: 'score'
        },
        businessImpact: 'Poor user experience leading to checkout abandonment',
        technicalImpact: 'Negative SEO impact',
        solutionSteps: [
          'Add explicit width and height to images',
          'Reserve space for dynamic content',
          'Avoid inserting content above existing content',
          'Use transform animations instead of layout-changing properties'
        ],
        fixPriority: 1,
        estimatedTime: '3-5 hours',
        detectedBy: 'Lighthouse',
        ruleId: 'PERF-CLS-001'
      })
    }

    // Image optimization
    if (metrics.imageOptimization.oversizedImages > 0) {
      issues.push({
        id: 'perf-oversized-images',
        title: 'Oversized Images',
        description: 'Images are larger than necessary',
        category: 'performance',
        subcategory: 'images',
        severity: 'high',
        confidence: 0.85,
        metric: {
          name: 'Oversized Images',
          value: `${metrics.imageOptimization.oversizedImages} images`,
          target: '0 images',
          unit: 'count'
        },
        businessImpact: 'Slower page loads, higher bounce rates',
        technicalImpact: 'Increased bandwidth usage',
        solutionSteps: [
          'Compress images using tools like ImageOptim or Squoosh',
          'Convert PNG to WebP format',
          'Implement responsive images with srcset',
          'Use Shopify\'s image optimization parameters'
        ],
        codeExamples: [
          '// Use Shopify image parameters\n{{ image | img_url: \'800x\', format: \'webp\' }}',
          '// Implement srcset\n<img srcset="{{ image | img_url: \'400x\' }} 400w,\n         {{ image | img_url: \'800x\' }} 800w"'
        ],
        fixPriority: 2,
        estimatedTime: '4-8 hours',
        detectedBy: 'Image Analysis',
        ruleId: 'PERF-IMG-001'
      })
    }

    return issues
  }

  private static async analyzeImages(url: string) {
    // Simplified image analysis
    return {
      totalImages: 0,
      oversizedImages: 0,
      unoptimizedImages: 0,
      formatRecommendations: ['Convert to WebP', 'Implement lazy loading']
    }
  }

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
```

---

## 7️⃣ **AI-Powered Issue Analyzer**

### **lib/audit-engine/analyzers/ai-analyzer.ts**
```typescript
import OpenAI from 'openai'
import { AuditIssue, AuditResult } from '../types'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
})

export class AIAnalyzer {
  static async analyzeStore(storeUrl: string, rawData: any): Promise<{
    summary: string
    priorityActions: string[]
    quickWins: string[]
    estimatedImpact: {
      conversionRate: string
      aovIncrease: string
      revenuePotential: string
    }
  }> {
    const prompt = this.createAnalysisPrompt(storeUrl, rawData)
    
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `You are an expert Shopify consultant with 10+ years experience.
            Analyze the audit data and provide specific, actionable insights.
            Focus on business impact and practical solutions.
            Be concise but comprehensive.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
        response_format: { type: 'json_object' }
      })

      const content = response.choices[0]?.message?.content
      if (!content) throw new Error('No AI response')

      return JSON.parse(content)
    } catch (error) {
      console.error('AI analysis failed:', error)
      return this.getFallbackAnalysis()
    }
  }

  static async enhanceIssues(issues: AuditIssue[]): Promise<AuditIssue[]> {
    const enhancedIssues: AuditIssue[] = []
    
    for (const issue of issues) {
      try {
        const enhanced = await this.enhanceSingleIssue(issue)
        enhancedIssues.push(enhanced)
      } catch (error) {
        console.error(`Failed to enhance issue ${issue.id}:`, error)
        enhancedIssues.push(issue)
      }
    }
    
    return enhancedIssues
  }

  private static async enhanceSingleIssue(issue: AuditIssue): Promise<AuditIssue> {
    const prompt = `Enhance this Shopify audit issue with expert insights:

Issue: ${issue.title}
Category: ${issue.category}
Severity: ${issue.severity}
Current Solution: ${issue.solutionSteps.join(', ')}

Provide:
1. More detailed business impact (specific percentages if possible)
2. Additional technical details
3. Step-by-step implementation guide
4. Common pitfalls to avoid
5. Tools or apps that could help

Format response as JSON:
{
  "businessImpact": "string",
  "technicalImpact": "string",
  "solutionSteps": ["string"],
  "aiExplanation": "string"
}`

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
      max_tokens: 500
    })

    const content = response.choices[0]?.message?.content
    if (!content) return issue

    const enhanced = JSON.parse(content)
    
    return {
      ...issue,
      businessImpact: enhanced.businessImpact || issue.businessImpact,
      technicalImpact: enhanced.technicalImpact || issue.technicalImpact,
      solutionSteps: enhanced.solutionSteps || issue.solutionSteps,
      aiExplanation: enhanced.aiExplanation
    }
  }

  private static createAnalysisPrompt(storeUrl: string, rawData: any): string {
    return `Analyze this Shopify store audit:

Store URL: ${storeUrl}
Theme: ${rawData.theme?.name || 'Unknown'}
Performance Score: ${rawData.performance?.mobileScore || 0}/100
Critical Issues: ${rawData.issues?.filter((i: any) => i.severity === 'critical').length || 0}
High Issues: ${rawData.issues?.filter((i: any) => i.severity === 'high').length || 0}

Performance Issues:
${rawData.issues?.filter((i: any) => i.category === 'performance').map((i: any) => `- ${i.title} (${i.severity})`).join('\n') || 'None'}

UX Issues:
${rawData.issues?.filter((i: any) => i.category === 'ux').map((i: any) => `- ${i.title} (${i.severity})`).join('\n') || 'None'}

Conversion Issues:
${rawData.issues?.filter((i: any) => i.category === 'conversion').map((i: any) => `- ${i.title} (${i.severity})`).join('\n') || 'None'}

Based on this data, provide:
1. A comprehensive 3-4 sentence summary
2. Top 5 priority actions (most impactful first)
3. 3 quick wins that can be implemented in under 2 hours
4. Estimated impact on conversion rate, AOV, and revenue

Format response as JSON:
{
  "summary": "string",
  "priorityActions": ["string"],
  "quickWins": ["string"],
  "estimatedImpact": {
    "conversionRate": "string (e.g., +1.5-3.2%)",
    "aovIncrease": "string (e.g., +$15-30)",
    "revenuePotential": "string (e.g., 25-40% monthly increase)"
  }
}`
  }

  private static getFallbackAnalysis() {
    return {
      summary: 'Store audit completed. Found several optimization opportunities.',
      priorityActions: [
        'Fix critical performance issues affecting page load',
        'Improve mobile user experience',
        'Add trust elements to increase conversion confidence',
        'Implement email capture for abandoned cart recovery',
        'Optimize product pages for better conversions'
      ],
      quickWins: [
        'Add trust badges to product pages',
        'Enable guest checkout option',
        'Implement sticky add-to-cart button'
      ],
      estimatedImpact: {
        conversionRate: '+1.2-2.8%',
        aovIncrease: '+$12-25',
        revenuePotential: '20-35% monthly increase'
      }
    }
  }
}
```

---

## 8️⃣ **Main Audit Engine Orchestrator**

### **lib/audit-engine/index.ts**
```typescript
import { AdvancedCrawler } from './crawler'
import { ShopifyDetector } from './crawler/shopify-detector'
import { PerformanceScanner } from './scanners/performance'
import { SEOScanner } from './scanners/seo'
import { UXScanner } from './scanners/ux'
import { ConversionScanner } from './scanners/conversion'
import { TrustScanner } from './scanners/trust'
import { AIAnalyzer } from './analyzers/ai-analyzer'
import { IssueClassifier } from './analyzers/issue-classifier'
import { ScoreCalculator } from './analyzers/score-calculator'
import { AuditResult } from './types'

export class AuditEngine {
  private crawler: AdvancedCrawler
  private storeUrl: string

  constructor(storeUrl: string) {
    this.crawler = new AdvancedCrawler()
    this.storeUrl = storeUrl
  }

  async run(): Promise<AuditResult> {
    console.log(`Starting audit for: ${this.storeUrl}`)
    
    try {
      // Step 1: Initialize crawler
      await this.crawler.initialize()
      
      // Step 2: Crawl store
      console.log('Crawling store...')
      const crawlResult = await this.crawler.crawl(this.storeUrl)
      
      // Step 3: Detect Shopify
      console.log('Detecting Shopify...')
      const storeInfo = ShopifyDetector.detect(
        crawlResult.html,
        crawlResult.headers,
        this.storeUrl
      )
      
      // Step 4: Run all scanners in parallel
      console.log('Running scanners...')
      const [
        performance,
        seo,
        ux,
        conversion,
        trust
      ] = await Promise.all([
        PerformanceScanner.scan(this.storeUrl),
        SEOScanner.scan(crawlResult.html),
        UXScanner.scan(crawlResult.html, this.storeUrl),
        ConversionScanner.scan(crawlResult.html),
        TrustScanner.scan(crawlResult.html)
      ])
      
      // Step 5: Collect all issues
      const allIssues = [
        ...performance.issues,
        ...seo.issues,
        ...ux.issues,
        ...conversion.issues,
        ...trust.issues
      ]
      
      // Step 6: Classify and prioritize issues
      console.log('Classifying issues...')
      const classifiedIssues = IssueClassifier.classify(allIssues)
      
      // Step 7: Calculate scores
      console.log('Calculating scores...')
      const scores = ScoreCalculator.calculate({
        performance: performance.metrics,
        seo: seo.metrics,
        ux: ux.metrics,
        conversion: conversion.metrics,
        trust: trust.metrics,
        issues: classifiedIssues
      })
      
      // Step 8: AI Analysis
      console.log('Running AI analysis...')
      const aiAnalysis = await AIAnalyzer.analyzeStore(this.storeUrl, {
        storeInfo,
        performance: performance.metrics,
        seo: seo.metrics,
        ux: ux.metrics,
        conversion: conversion.metrics,
        trust: trust.metrics,
        issues: classifiedIssues
      })
      
      // Step 9: Enhance issues with AI
      console.log('Enhancing issues with AI...')
      const enhancedIssues = await AIAnalyzer.enhanceIssues(classifiedIssues)
      
      // Step 10: Generate recommendations
      const recommendations = this.generateRecommendations(enhancedIssues)
      
      // Step 11: Compile final result
      const result: AuditResult = {
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
      
      console.log('Audit completed successfully')
      return result
      
    } catch (error) {
      console.error('Audit failed:', error)
      throw error
    } finally {
      await this.crawler.close()
    }
  }

  private generateRecommendations(issues: any[]) {
    const critical = issues
      .filter(i => i.severity === 'critical')
      .slice(0, 5)
      .map(i => i.solutionSteps[0])
    
    const high = issues
      .filter(i => i.severity === 'high')
      .slice(0, 5)
      .map(i => i.solutionSteps[0])
    
    const medium = issues
      .filter(i => i.severity === 'medium')
      .slice(0, 5)
      .map(i => i.solutionSteps[0])
    
    const low = issues
      .filter(i => i.severity === 'low')
      .slice(0, 5)
      .map(i => i.solutionSteps[0])
    
    return { critical, high, medium, low }
  }
}

// Export main function
export async function runCompleteAudit(storeUrl: string): Promise<AuditResult> {
  const engine = new AuditEngine(storeUrl)
  return await engine.run()
}
```

---

## 9️⃣ **Database Operations**

### **lib/db/supabase.ts**
```typescript
import { createClient } from '@supabase/supabase-js'
import { AuditResult } from '../audit-engine/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey)

export class AuditDB {
  static async createAuditRecord(email: string, storeUrl: string, name?: string) {
    const { data, error } = await supabase
      .from('audits')
      .insert([{
        email,
        store_url: storeUrl,
        store_name: name,
        status: 'processing',
        started_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async saveAuditResults(auditId: string, result: AuditResult) {
    // Extract metrics
    const metrics = {
      shopify_theme: result.storeInfo.theme.name,
      theme_version: result.storeInfo.theme.version,
      apps_detected: result.storeInfo.apps.count,
      products_count: result.storeInfo.products,
      collections_count: result.storeInfo.collections,
      
      // Performance
      mobile_score: result.performance.mobileScore,
      desktop_score: result.performance.desktopScore,
      load_time_ms: result.performance.loadTime,
      lcp_ms: result.performance.largestContentfulPaint,
      cls_score: result.performance.cumulativeLayoutShift,
      inp_ms: result.performance.interactiveTime,
      tbt_ms: result.performance.totalBlockingTime,
      
      // SEO
      seo_score: result.seo.score,
      has_meta_title: result.seo.metaTitle.present,
      has_meta_description: result.seo.metaDescription.present,
      has_structured_data: result.seo.structuredData.present,
      h1_count: result.seo.headingStructure.h1Count,
      internal_links: result.seo.internalLinks,
      external_links: result.seo.externalLinks,
      
      // UX
      mobile_friendly: result.ux.mobileFriendly,
      has_sticky_cart: result.ux.productPage.stickyAddToCart,
      has_image_zoom: result.ux.productPage.imageZoom,
      has_video: result.ux.productPage.videos,
      has_reviews: result.ux.productPage.reviews.present,
      has_trust_badges: result.ux.productPage.trustBadges,
      has_faq: result.ux.productPage.faq,
      has_upsells: result.conversion.upsells.relatedProducts,
      
      // Conversion
      has_free_shipping_bar: result.conversion.freeShipping.bar,
      has_countdown_timer: result.conversion.urgency.countdownTimers,
      has_email_capture: result.conversion.emailCapture.present,
      has_exit_intent: result.conversion.exitIntent,
      has_shop_pay: result.trust.security.paymentIcons,
      has_apple_pay: false,
      has_google_pay: false,
      
      // Scores
      overall_score: result.scores.overall,
      performance_score: result.scores.performance,
      seo_score: result.scores.seo,
      ux_score: result.scores.ux,
      conversion_score: result.scores.conversion,
      trust_score: result.scores.trust,
      
      // Issues
      critical_issues: result.issues.filter(i => i.severity === 'critical'),
      high_issues: result.issues.filter(i => i.severity === 'high'),
      medium_issues: result.issues.filter(i => i.severity === 'medium'),
      low_issues: result.issues.filter(i => i.severity === 'low'),
      
      // Recommendations
      recommendations: result.recommendations.critical,
      quick_wins: result.aiAnalysis.quickWins,
      long_term_improvements: result.recommendations.high,
      
      // AI Analysis
      ai_summary: result.aiAnalysis.summary,
      priority_actions: result.aiAnalysis.priorityActions,
      estimated_impact: result.aiAnalysis.estimatedImpact,
      
      // Raw data
      raw_metrics: {
        performance: result.performance,
        seo: result.seo,
        ux: result.ux,
        conversion: result.conversion,
        trust: result.trust
      },
      
      // Status
      status: 'completed',
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Update main audit
    const { error: updateError } = await supabase
      .from('audits')
      .update(metrics)
      .eq('id', auditId)

    if (updateError) throw updateError

    // Save detailed issues
    for (const issue of result.issues) {
      await supabase
        .from('audit_issues')
        .insert({
          audit_id: auditId,
          issue_id: issue.id,
          title: issue.title,
          description: issue.description,
          category: issue.category,
          subcategory: issue.subcategory,
          severity: issue.severity,
          confidence: issue.confidence,
          metric_name: issue.metric?.name,
          metric_value: issue.metric?.value?.toString(),
          metric_target: issue.metric?.target?.toString(),
          metric_unit: issue.metric?.unit,
          business_impact: issue.businessImpact,
          technical_impact: issue.technicalImpact,
          solution_steps: issue.solutionSteps,
          code_examples: issue.codeExamples,
          affected_pages: issue.affectedPages,
          ai_explanation: issue.aiExplanation,
          fix_priority: issue.fixPriority,
          estimated_time: issue.estimatedTime
        })
    }

    return { success: true }
  }

  static async getAuditById(auditId: string) {
    const { data: audit, error } = await supabase
      .from('audits')
      .select(`
        *,
        audit_issues (*)
      `)
      .eq('id', auditId)
      .single()

    if (error) throw error
    return audit
  }

  static async markEmailSent(auditId: string) {
    const { error } = await supabase
      .from('audits')
      .update({ is_email_sent: true })
      .eq('id', auditId)

    return !error
  }
}
```

---

## 🔟 **Main API Endpoint**

### **app/api/audit/route.ts**
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { AuditDB } from '@/lib/db/supabase'
import { runCompleteAudit } from '@/lib/audit-engine'

const auditSchema = z.object({
  email: z.string().email('Valid email required'),
  storeUrl: z.string().url('Valid URL required'),
  name: z.string().optional(),
  phone: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, storeUrl, name, phone } = auditSchema.parse(body)

    // Create audit record
    const audit = await AuditDB.createAuditRecord(email, storeUrl, name)
    
    // Return immediately (audit runs in background)
    const response = NextResponse.json({
      success: true,
      auditId: audit.id,
      message: 'Audit started. Results will be ready in 1-2 minutes.'
    })

    // Run audit in background (non-blocking)
    setTimeout(async () => {
      try {
        console.log(`Running background audit for: ${storeUrl}`)
        
        // Run complete audit
        const auditResult = await runCompleteAudit(storeUrl)
        
        // Save results
        await AuditDB.saveAuditResults(audit.id, auditResult)
        
        console.log(`Audit completed for: ${storeUrl}`)
        
      } catch (error) {
        console.error('Background audit failed:', error)
        
        // Update audit status to failed
        await supabase
          .from('audits')
          .update({
            status: 'failed',
            error_message: error instanceof Error ? error.message : 'Unknown error',
            completed_at: new Date().toISOString()
          })
          .eq('id', audit.id)
      }
    }, 0)

    return response

  } catch (error) {
    console.error('API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to start audit' },
      { status: 500 }
    )
  }
}
```

---

## 1️⃣1️⃣ **Status Check Endpoint**

### **app/api/audit/[id]/route.ts**
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { AuditDB } from '@/lib/db/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auditId = params.id
    
    const audit = await AuditDB.getAuditById(auditId)
    
    if (!audit) {
      return NextResponse.json(
        { error: 'Audit not found' },
        { status: 404 }
      )
    }
    
    // Format response
    const response = {
      id: audit.id,
      status: audit.status,
      scores: {
        overall: audit.overall_score,
        performance: audit.performance_score,
        seo: audit.seo_score,
        ux: audit.ux_score,
        conversion: audit.conversion_score,
        trust: audit.trust_score
      },
      issues: {
        critical: audit.critical_issues?.length || 0,
        high: audit.high_issues?.length || 0,
        medium: audit.medium_issues?.length || 0,
        low: audit.low_issues?.length || 0
      },
      recommendations: audit.recommendations,
      aiSummary: audit.ai_summary,
      isCompleted: audit.status === 'completed',
      createdAt: audit.created_at,
      completedAt: audit.completed_at
    }
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json(
      { error: 'Failed to get audit status' },
      { status: 500 }
    )
  }
}
```

---

## 1️⃣2️⃣ **Email Service with Nodemailer**

### **lib/email/nodemailer.ts**
```typescript
import nodemailer from 'nodemailer'
import { AuditDB } from '../db/supabase'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

export async function sendAuditEmail(auditId: string) {
  try {
    // Get audit data
    const audit = await AuditDB.getAuditById(auditId)
    
    if (!audit || audit.status !== 'completed') {
      throw new Error('Audit not found or not completed')
    }

    // Generate HTML report
    const html = generateEmailHTML(audit)

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: audit.email,
      subject: `✅ Shopify Audit Results - Score: ${audit.overall_score}/100`,
      html,
      attachments: [
        {
          filename: 'audit-summary.txt',
          content: generateTextSummary(audit)
        }
      ]
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent:', info.messageId)
    
    // Mark as sent
    await AuditDB.markEmailSent(auditId)
    
    return true
  } catch (error) {
    console.error('Email send error:', error)
    throw error
  }
}

function generateEmailHTML(audit: any) {
  const issuesBySeverity = {
    critical: audit.critical_issues || [],
    high: audit.high_issues || [],
    medium: audit.medium_issues || [],
    low: audit.low_issues || []
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; }
        .score { font-size: 72px; font-weight: bold; margin: 20px 0; }
        .card { background: white; border-radius: 10px; padding: 25px; margin: 20px 0; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .issue-critical { border-left: 5px solid #dc2626; }
        .issue-high { border-left: 5px solid #f97316; }
        .issue-medium { border-left: 5px solid #f59e0b; }
        .issue-low { border-left: 5px solid #10b981; }
        .metric-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 20px 0; }
        .metric { text-align: center; padding: 15px; background: #f8fafc; border-radius: 8px; }
        .metric-value { font-size: 24px; font-weight: bold; margin: 5px 0; }
        .btn { display: inline-block; background: #008060; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
        .footer { text-align: center; margin-top: 40px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎯 Your Shopify Audit Results</h1>
          <div class="score">${audit.overall_score}/100</div>
          <p>Overall Store Health Score</p>
        </div>
        
        <div class="card">
          <h2>📊 Performance Metrics</h2>
          <div class="metric-grid">
            <div class="metric">
              <div>Performance</div>
              <div class="metric-value">${audit.performance_score}/100</div>
            </div>
            <div class="metric">
              <div>Mobile Score</div>
              <div class="metric-value">${audit.mobile_score}/100</div>
            </div>
            <div class="metric">
              <div>Load Time</div>
              <div class="metric-value">${Math.round(audit.load_time_ms / 1000)}s</div>
            </div>
          </div>
        </div>
        
        ${issuesBySeverity.critical.length > 0 ? `
          <div class="card issue-critical">
            <h2>🚨 Critical Issues (${issuesBySeverity.critical.length})</h2>
            ${issuesBySeverity.critical.slice(0, 3).map((issue: any) => `
              <div style="margin: 15px 0; padding: 15px; background: #fef2f2; border-radius: 5px;">
                <strong>${issue.title}</strong><br>
                <small>${issue.description}</small><br>
                <strong>Solution:</strong> ${issue.solutionSteps?.[0] || 'Contact for details'}
              </div>
            `).join('')}
          </div>
        ` : ''}
        
        ${issuesBySeverity.high.length > 0 ? `
          <div class="card issue-high">
            <h2>⚠️ High Priority Issues (${issuesBySeverity.high.length})</h2>
            ${issuesBySeverity.high.slice(0, 3).map((issue: any) => `
              <div style="margin: 10px 0; padding: 10px; background: #ffedd5; border-radius: 5px;">
                <strong>${issue.title}</strong><br>
                <small>${issue.description}</small>
              </div>
            `).join('')}
          </div>
        ` : ''}
        
        <div class="card">
          <h2>🎯 Top Recommendations</h2>
          <ol>
            ${(audit.recommendations || []).slice(0, 5).map((rec: string) => `
              <li style="margin: 10px 0;">${rec}</li>
            `).join('')}
          </ol>
        </div>
        
        <div class="card">
          <h2>💡 Expert Analysis</h2>
          <p>${audit.ai_summary || 'Focus on high-impact issues first.'}</p>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>📈 Estimated Impact</h3>
            <p><strong>Conversion Rate:</strong> ${audit.estimated_impact?.conversionRate || '+1-3%'}</p>
            <p><strong>AOV Increase:</strong> ${audit.estimated_impact?.aovIncrease || '+$10-25'}</p>
            <p><strong>Revenue Potential:</strong> ${audit.estimated_impact?.revenuePotential || '15-30% monthly'}</p>
          </div>
        </div>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="mailto:support@yourdomain.com?subject=Shopify%20Audit%20Implementation&body=Audit%20ID:%20${audit.id}" class="btn">
            💼 Get Professional Help
          </a>
          <a href="${process.env.APP_URL}" class="btn" style="background: #4f46e5;">
            🔄 Run Another Audit
          </a>
        </div>
        
        <div class="footer">
          <p>Audit ID: ${audit.id}</p>
          <p>Generated on ${new Date(audit.created_at).toLocaleDateString()}</p>
          <p>Store: ${audit.store_url}</p>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateTextSummary(audit: any) {
  return `
SHOPIFY AUDIT REPORT
=====================

Store: ${audit.store_url}
Audit ID: ${audit.id}
Date: ${new Date(audit.created_at).toLocaleString()}

OVERALL SCORE: ${audit.overall_score}/100

PERFORMANCE:
- Performance Score: ${audit.performance_score}/100
- Mobile Score: ${audit.mobile_score}/100
- Load Time: ${Math.round(audit.load_time_ms / 1000)}s
- LCP: ${Math.round(audit.lcp_ms)}ms
- CLS: ${audit.cls_score}

ISSUES FOUND:
- Critical: ${audit.critical_issues?.length || 0}
- High: ${audit.high_issues?.length || 0}
- Medium: ${audit.medium_issues?.length || 0}
- Low: ${audit.low_issues?.length || 0}

TOP RECOMMENDATIONS:
${(audit.recommendations || []).map((rec: string, i: number) => `${i + 1}. ${rec}`).join('\n')}

EXPERT ANALYSIS:
${audit.ai_summary || 'No analysis available.'}

ESTIMATED IMPACT:
- Conversion Rate: ${audit.estimated_impact?.conversionRate || 'N/A'}
- AOV Increase: ${audit.estimated_impact?.aovIncrease || 'N/A'}
- Revenue Potential: ${audit.estimated_impact?.revenuePotential || 'N/A'}

---
Need help implementing these changes?
Contact: support@yourdomain.com
Audit ID: ${audit.id}
  `
}
```

---

## **Email API Endpoint**

### **app/api/email/route.ts**
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { sendAuditEmail } from '@/lib/email/nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { auditId } = await request.json()
    
    if (!auditId) {
      return NextResponse.json(
        { error: 'Audit ID is required' },
        { status: 400 }
      )
    }
    
    await sendAuditEmail(auditId)
    
    return NextResponse.json({
      success: true,
      message: 'Email sent successfully'
    })
    
  } catch (error) {
    console.error('Email API error:', error)
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to send email',
        success: false 
      },
      { status: 500 }
    )
  }
}
```

---

## 🚀 **Complete Installation & Setup**

### **package.json**
```json
{
  "name": "shopify-audit-pro",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "^18",
    "react-dom": "^18",
    "@supabase/supabase-js": "^2.38.0",
    "openai": "^4.20.0",
    "nodemailer": "^6.9.8",
    "puppeteer-core": "^21.0.0",
    "lighthouse": "^11.0.0",
    "cheerio": "^1.0.0",
    "zod": "^3.22.0",
    "tailwindcss": "^3.3.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/nodemailer": "^6.4.14",
    "typescript": "^5.0.0"
  }
}
```

---

## **Deployment Instructions:**

1. **Setup Supabase:**
   ```sql
   -- Run the complete SQL migration from section 2
   ```

2. **Install Chrome for Puppeteer (Ubuntu):**
   ```bash
   sudo apt update
   sudo apt install -y chromium-browser
   ```

3. **Set environment variables** in `.env.local`

4. **Install dependencies:**
   ```bash
   npm install
   ```

5. **Run development:**
   ```bash
   npm run dev
   ```

---

## **Key Features of This Advanced System:**

✅ **Deep Shopify Detection** - Theme, apps, structure  
✅ **Lighthouse Integration** - Real performance metrics  
✅ **AI-Powered Analysis** - OpenAI for deep insights  
✅ **Multi-layer Scanning** - Performance, SEO, UX, Conversion, Trust  
✅ **Professional Email Reports** - Full HTML + text  
✅ **Detailed Database** - Store all metrics and issues  
✅ **Real Crawling** - Puppeteer for actual page analysis  
✅ **Production Ready** - Error handling, timeouts, retries  

This system will perform **actual deep audits** of Shopify stores, not just simulate results. It uses real browser automation, Lighthouse metrics, and AI analysis to find genuine issues. 🚀