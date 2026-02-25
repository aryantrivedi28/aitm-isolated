export interface CaseStudyMetric {
  label: string
  value: number
  type: 'number' | 'percentage' | 'currency'
  trend?: 'up' | 'down' | 'neutral'
  previousValue?: number
}

export interface Testimonial {
  content: string
  author?: string
  role?: string
  company?: string
  avatar?: string
  rating?: number
}

export interface CaseStudy {
  id: string
  freelancer_id: string
  title: string
  slug: string
  short_summary: string
  category: string
  industry: string
  service_type?: string
  problem_statement: string
  solution_provided: string
  strategy?: string
  implementation?: string
  results_overview: string
  metrics: CaseStudyMetric[]
  technologies: string[]
  tags: string[]
  image_url: string
  gallery_images: string[]
  project_url?: string
  testimonial?: Testimonial
  status: 'draft' | 'pending' | 'approved' | 'rejected'
  is_featured: boolean
  is_verified: boolean
  view_count: number
  created_at: string
  updated_at: string
  seo?: {
    title?: string
    description?: string
    keywords?: string[]
    canonical_url?: string
  }
  freelancer?: {
    id: string
    full_name: string
    avatar_url?: string
    title?: string
    hourly_rate?: number
    skills?: string[]
    experience_years?: number
    completed_projects?: number
    linkedin_url?: string
    github_url?: string
    portfolio_url?: string
    bio?: string
    email?: string
    location?: string
    availability?: 'available' | 'busy' | 'unavailable'
  }
}

export interface CaseStudyFilters {
  categories: Array<{ value: string; label: string; count: number }>
  industries: Array<{ value: string; label: string; count: number }>
  technologies: Array<{ value: string; label: string; count: number }>
  sortOptions: Array<{ value: string; label: string }>
}

export interface CaseStudyStats {
  totalCaseStudies: number
  totalViews: number
  avgViewsPerStudy: number
  categoryDistribution: Record<string, number>
  monthlyTrends: Record<string, number>
  topCategories: Array<{
    category: string
    count: number
    views: number
    avgViews: number
  }>
}

export interface CaseStudyFormData {
  title: string
  short_summary: string
  category: string
  industry: string
  service_type?: string
  problem_statement: string
  solution_provided: string
  strategy?: string
  implementation?: string
  results_overview: string
  metrics: CaseStudyMetric[]
  technologies: string[]
  tags: string[]
  image_url: string
  gallery_images: string[]
  project_url?: string
  testimonial?: Testimonial
  status: 'draft' | 'pending' | 'approved' | 'rejected'
  is_featured: boolean
}

export interface CaseStudyResponse {
  data: CaseStudy[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}