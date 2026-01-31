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
  marketing: {
    label: "Marketing",
    subcategories: [
      "SEO Optimization",
      "Content Marketing",
      "Influencer Marketing",
      "Market Research"
    ]
  },
  socialMedia: {
    label: "Social Media Management",
    subcategories: []
  },
  fbAds: {
    label: "FB Ads",
    subcategories: []
  },
  googleAds: {
    label: "Google Ads",
    subcategories: []
  },
  emailMarketing: {
    label: "Email Marketing",
    subcategories: []
  },
  landingPage: {
    label: "Landing Page Creation",
    subcategories: []
  }
} as const;