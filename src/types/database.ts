export interface CustomQuestion {
  id: string
  question: string
  type: "text" | "textarea" | "dropdown" | "radio" | "checkbox"
  options?: string[] // For dropdown, radio, and checkbox types
  required: boolean
}

export interface Form {
  id: string
  form_id: string // Changed from 'id' to 'form_id' to support custom IDs
  form_name: string
  form_description: string
  category: string
  subcategory: string // Changed from string[] to string to match database schema
  industry: string
  tech_stack?: string // Changed from string[] to string to match database schema
  tools?: string // Changed from string[] to string to match database schema
  required_fields: string[] // Added required_fields for custom field selection
  custom_questions: CustomQuestion[] // Added custom_questions for dynamic form fields
  created_by?: string
  created_at: string
  is_active?: boolean // Added is_active field to control form status
}

export interface FreelancerSubmission {
  id: string
  form_id?: string // Made optional to support admin direct entries
  name: string
  email: string
  phone?: string
  portfolio_link?: string // Fixed field name to match database schema
  github_link?: string // Fixed field name to match database schema
  resume_link?: string // Fixed field name to match database schema
  years_experience?: number
  proposal_link?: string // Fixed field name to match database schema
  custom_responses?: any // Added custom_responses field for dynamic form data
  source?: string // Added source field to track entry method
  created_at: string
}

export interface CreateFormData {
  form_id: string;
  form_name: string;
  form_description?: string | null;
  industry: string;
  category: string;        // still required
  subcategory: string;     // still required
  tech_stack?: string[] | null;
  tools?: string[] | null;
  required_fields?: string[] | null;
  custom_questions?: any[] | null;
  created_by?: string;
  is_active?: boolean;     // Added is_active field to control form status
  message?: string | null; // 👈 NEW: optional message field
}


export interface CreateSubmissionData {
  form_id?: string // Made optional to support admin direct entries
  name: string
  email: string
  phone?: string
  portfolio_link?: string // Fixed field name to match database schema
  github_link?: string // Fixed field name to match database schema
  resume_link?: string // Fixed field name to match database schema
  years_experience?: number
  proposal_link?: string // Fixed field name to match database schema
  custom_responses?: any // Added custom_responses field for dynamic form data
  source?: string // Added source field to track entry method
}

export interface CreateDirectSubmissionData {
  name: string
  email: string
  phone?: string
  portfolio_link?: string // Fixed field name to match database schema
  github_link?: string // Fixed field name to match database schema
  resume_link?: string // Fixed field name to match database schema
  years_experience?: number
  proposal_link?: string // Fixed field name to match database schema
  custom_responses?: any // Added custom_responses field for dynamic form data
  source: string // Changed to string to support different sources
}
