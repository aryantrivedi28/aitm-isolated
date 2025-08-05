export interface FreelancerData {
  timestamp: string
  name: string
  email: string
  portfolioUrl?: string
  resumeFile?: string
  proposalText?: string
  github?: string
  portfolioContent?: string
  resumeContent?: string
  proposalContent?: string
}

export interface AIAnalysisResult {
  rating: number // 0-90 for DevOps scoring
  review: string
}

export interface ProcessingStatus {
  isRunning: boolean
  processedCount: number
  totalCount: number
  errors: string[]
}

export interface DevOpsSignals {
  releasePipelines: number
  cicdDesign: number
  cloudArchitecture: number
  infrastructureAsCode: number
  containerization: number
  observability: number
  security: number
  ownership: number
  experience: number
}
