// types/form.ts
export interface FormData {
  name: string;
  email: string;
  phone: string;
  website: string;
  services: ServiceSelection[];
}

export interface ServiceSelection {
  category: string;
  subServices?: string[];
}

export const SERVICE_CATEGORIES = {
  Shopify: {
    label: "Shopify",
    subcategories: []
  },
  GoHighLevel: {
    label: "GoHigh Level",
    subcategories: []
  },
  marketing: {
    label: "Marketing",
    subcategories: [
      "SEO Optimization",
      "Content Marketing",
      "Influencer Marketing",
      "Market Research",
      "Social Media Management",
      "FB Ads",
      "Google Ads",
      "Email Marketing",
      "Landing Page Creation"
    ]
  },
  // googleAds: {
  //   label: "Google Ads",
  //   subcategories: []
  // },
  // emailMarketing: {
  //   label: "Email Marketing",
  //   subcategories: []
  // },
  // landingPage: {
  //   label: "Landing Page Creation",
  //   subcategories: []
  // }
} as const;