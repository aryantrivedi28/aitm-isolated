export interface ShopifyStoreInfo {
  url: string;
  isShopify: boolean;

  theme?: {
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
  codeExamples?: string[];

  // Evidence - MAKE THESE OPTIONAL
  affectedPages?: string[];
  screenshotUrl?: string;
  htmlSnippet?: string;

  // AI Analysis
  aiExplanation?: string;
  fixPriority: number;
  estimatedTime: string;

  // Audit Info
  detectedBy: string;
  ruleId: string;

  businessImpact?: string
  technicalImpact?: string
  solutionSteps?: string[]

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