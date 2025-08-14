export interface CustomQuestion {
  id: string
  question: string
  type: "text" | "textarea" | "dropdown" | "radio" | "checkbox"
  options?: string[] // For dropdown, radio, and checkbox types
  required: boolean
}

export interface Form {
  form_id: string // Changed from 'id' to 'form_id' to support custom IDs
  form_name: string
  category: string
  subcategory: string[] // Updated to support multiple subcategories
  industry: string
  tech_stack?: string[] // Added tech_stack field as array
  tools?: string[] // Added tools field as array
  required_fields: string[] // Added required_fields for custom field selection
  custom_questions: CustomQuestion[] // Added custom_questions for dynamic form fields
  created_by?: string
  created_at: string
}

export interface FreelancerSubmission {
  id: string
  form_id?: string // Made optional to support admin direct entries
  name: string
  email: string
  phone?: string
  portfolio_link?: string // Updated field name for consistency
  github_link?: string // Updated field name for consistency
  resume_link?: string // Updated field name for consistency
  years_experience?: number
  proposal_link?: string // Updated field name for consistency
  subcategory?: string[] // Added subcategory field as array
  tech_stack?: string[] // Added tech_stack field as array
  tools?: string[] // Added tools field as array
  source?: string // Added source field to track entry method
  created_at: string
}

export interface CreateFormData {
  form_id: string // Added form_id field for custom IDs
  form_name: string
  category: string
  subcategory: string[] // Updated to support multiple subcategories
  industry: string
  tech_stack?: string[] // Added tech_stack field as array
  tools?: string[] // Added tools field as array
  required_fields: string[] // Added required_fields for custom field selection
  custom_questions: CustomQuestion[] // Added custom_questions for dynamic form fields
  created_by?: string
}

export interface CreateSubmissionData {
  form_id?: string // Made optional to support admin direct entries
  name: string
  email: string
  phone?: string
  portfolio_link?: string // Updated field name for consistency
  github_link?: string // Updated field name for consistency
  resume_link?: string // Updated field name for consistency
  years_experience?: number
  proposal_link?: string // Updated field name for consistency
  subcategory?: string[] // Added subcategory field as array
  tech_stack?: string[] // Added tech_stack field as array
  tools?: string[] // Added tools field as array
  source?: string // Added source field to track entry method
}

export interface CreateDirectSubmissionData {
  name: string
  email: string
  phone?: string
  portfolio_link?: string
  github_link?: string
  resume_link?: string
  years_experience?: number
  proposal_link?: string
  subcategory?: string[]
  tech_stack?: string[]
  tools?: string[]
  source: string // Changed to string to support different sources
}
