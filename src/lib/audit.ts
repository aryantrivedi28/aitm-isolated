export interface AuditRequest {
  email: string;
  storeUrl: string;
  name?: string;
  phone?: string;
}

export interface AuditResult {
  id: string;
  email: string;
  store_url: string;
  scores: {
    overall: number;
    performance: number;
    ux: number;
    seo: number;
    conversion: number;
    trust: number;
  };
  issues: {
    critical: Array<{
      title: string;
      category: string;
      impact: string;
      solution: string;
    }>;
    high: Array<{
      title: string;
      category: string;
      impact: string;
      solution: string;
    }>;
    medium: Array<{
      title: string;
      category: string;
      impact: string;
      solution: string;
    }>;
  };
  recommendations: string[];
  ai_analysis: string;
  status: 'processing' | 'completed' | 'failed';
  is_email_sent: boolean;
  created_at: string;
}