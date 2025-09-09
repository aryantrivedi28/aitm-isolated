export interface ClientAgreement {
  id?: string
  client_id?: string
  client_name: string
  client_email: string
  client_address: string
  project_title: string
  scope: string
  payment_terms: string
  deliverables: string
  terms: string
  payment_amount?: number
  currency?: string
  pdf_url?: string
  signed_pdf_url?: string
  docuseal_envelope_id?: string
  status?: "pending" | "sent" | "signed" | "completed"
  created_at?: string
  updated_at?: string
  signed_at?: string
}

export interface FreelancerAgreement {
  id?: string
  freelancer_id?: string
  freelancer_name: string
  freelancer_email: string
  client_name: string
  work_type: string
  nda: string
  ip_rights: string
  deliverables: string
  terms: string
  hourly_rate?: number
  project_duration?: string
  pdf_url?: string
  signed_pdf_url?: string
  docuseal_envelope_id?: string
  status?: "pending" | "sent" | "signed" | "completed"
  created_at?: string
  updated_at?: string
  signed_at?: string
}

export interface Invoice {
  id?: string
  client_id?: string
  client_name: string
  client_email: string
  client_address?: string   // ✅ added
  project_title: string
  amount: number
  currency?: string
  due_date: string
  invoice_date?: string     // ✅ added
  terms: string
  invoice_number?: string
  tax_amount?: number
  total_amount?: number
  // ✅ new fields for payment details
  payee_name?: string
  account_number?: string
  account_type?: string
  routing_number?: string
  payment_method?: string

  pdf_url?: string
  signed_pdf_url?: string
  docuseal_envelope_id?: string
  status?: "pending" | "sent" | "paid" | "overdue"
  created_at?: string
  updated_at?: string
  paid_at?: string
}

export interface InvoiceItem {
  id?: string
  invoice_id: string
  description: string
  quantity: number
  rate: number
  amount: number
}

export interface DocumentTemplate {
  id: string
  name: string
  type: "client_agreement" | "freelancer_agreement" | "invoice"
  template_content: string
  is_active: boolean
}

export type Agreement = ClientAgreement | FreelancerAgreement

export type Document = ClientAgreement | FreelancerAgreement | Invoice
