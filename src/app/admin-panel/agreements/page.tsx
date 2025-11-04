"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  ArrowLeft,
  FileText,
  Eye,
  Download,
  Loader2,
  User,
  Briefcase,
  CreditCard,
  Pencil,
  Trash2,
  Copy,
  MoreVertical,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { InvoiceForm } from "../../../components/invoice-form"
import { motion } from "framer-motion"
import { ClientAgreementForm } from "../../../components/client-agreement-form"
import { useToast } from "@/hooks/use-toast"
import { FreelancerAgreementForm } from "../../../components/freelancer-agreement-form"

// Define proper TypeScript interfaces
interface BaseDocument {
  id: string
  created_at: string
  status: string
  project_title?: string
  work_type?: string
  client_name?: string
  client_email?: string
  freelancer_name?: string
  freelancer_email?: string
  pdf_url?: string
  docuseal_envelope_id?: string
  document_type?: "agreement" | "invoice"
}

interface ClientAgreement extends BaseDocument {
  type: "client"
  payment_amount?: number
  currency?: string
  scope?: string
  deliverables?: string
  terms?: string
  payment_terms?: string
  responsibilities?: string
  termination?: string
  confidentiality?: string
  governing_law?: string
  ownership?: string
}

interface FreelancerAgreement extends BaseDocument {
  type: "freelancer"
  hourly_rate?: number
  project_duration?: string
  nda?: string
  ip_rights?: string
}

interface Invoice extends BaseDocument {
  type: "invoice"
  invoice_number: string
  amount: number
  total_amount: number
  due_date: string
}

type Agreement = ClientAgreement | FreelancerAgreement
type Document = Agreement | Invoice

interface FormData {
  client_name: string
  client_address: string
  client_email: string
  project_title: string
  scope: string
  payment_terms: string
  deliverables: string
  terms: string
  payment_amount: string
  currency: string
  // Freelancer specific
  freelancer_name: string
  freelancer_email: string
  work_type: string
  nda: string
  ip_rights: string
  rate_amount: string
  rate_type: string
  project_duration: string
  // Client specific
  responsibilities?: string
  termination?: string
  confidentiality?: string
  governing_law?: string
  ownership?: string
}

function AgreementAutomationPageContent() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [agreements, setAgreements] = useState<Agreement[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // CHANGE: make toast hook compatible with both { toast } and { addToast }
  const toastApi = useToast() as any
  const toast =
    typeof toastApi?.toast === "function"
      ? toastApi.toast
      : typeof toastApi?.addToast === "function"
        ? toastApi.addToast
        : () => { } // no-op fallback
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [editFormData, setEditFormData] = useState<any>({})


  const defaultFreelancerTerms = `Professional Conduct & Communication
Terms and Conditions
The freelancer is expected to maintain the highest level of professionalism in all interactions—
internal and external.
All communication with clients must be courteous, respectful, and aligned with Finzie's standards.
Poaching, discussing payment terms directly with the client, or engaging in independent side
conversations unrelated to the project shall be considered a breach of contract.
Attendance in client meetings is mandatory. In case of emergencies, prior notice of at least 5–6
hours must be given to the Finzie team.

Commitment & Duration
The minimum duration of engagement is 2 months.
A 10-day notice period is required in case of termination by either party. If the freelancer
chooses to discontinue before the minimum duration period, a 50% deduction will be applied
to the pending payout.

Ownership & Accountability
The freelancer is expected to take complete ownership of their assigned work, from planning
to delivery.
Finzie reserves the right to terminate the engagement without notice in case of serious
misconduct, repeated underperformance, or breach of trust.

Performance & Deliverables
Freelancers are expected to meet deadlines, follow briefs precisely, and deliver high-quality
work.
Failure to meet performance standards may result in review, deduction, or termination.
Specific deliverables and timelines will be communicated per project. Delays must be informed
in advance.

Confidentiality & Conflict of Interest
The freelancer shall not disclose or misuse any confidential information, documents, strategies,
or trade secrets of Finzie or its clients during or after the term of engagement.
Any potential conflict of interest must be disclosed immediately. Freelancers must not work
with direct competitors of Finzie or its clients without written approval.

Intellectual Property Rights
All work created during the engagement is the sole property of Finzie or its clients.
The freelancer waives the right to reuse, reproduce, or republish any part of the work without
prior written consent.`

  const [formData, setFormData] = useState<FormData>({
    client_name: "",
    client_address: "",
    client_email: "",
    project_title: "",
    scope: "",
    payment_terms: "",
    deliverables: "",
    terms: defaultFreelancerTerms,
    payment_amount: "",
    currency: "USD",
    freelancer_name: "",
    freelancer_email: "",
    work_type: "",
    nda: "",
    ip_rights: "",
    rate_amount: "",
    rate_type: "hour",
    project_duration: "",
  })

  useEffect(() => {
    fetchAgreements()
    fetchInvoices()
  }, [])

  const fetchAgreements = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/agreements")
      if (!response.ok) {
        throw new Error(`Failed to fetch agreements: ${response.status}`)
      }
      const data = await response.json()
      setAgreements(data.agreements || [])
    } catch (error) {
      console.error("Error fetching agreements:", error)
      setError("Failed to load agreements")
    } finally {
      setLoading(false)
    }
  }

  const fetchInvoices = async () => {
    try {
      const response = await fetch("/api/invoices")
      if (!response.ok) {
        throw new Error(`Failed to fetch invoices: ${response.status}`)
      }
      const data = await response.json()
      setInvoices(data.invoices || [])
    } catch (error) {
      console.error("Error fetching invoices:", error)
      setError("Failed to load invoices")
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const generateAITerms = async (type: "client" | "freelancer" | "payment") => {
    setAiLoading(true)
    setError(null)
    try {
      let requestData

      if (type === "client") {
        requestData = {
          type: "client",
          projectTitle: formData.project_title,
          scope: formData.scope,
          paymentAmount: Number.parseFloat(formData.payment_amount) || 0,
          currency: formData.currency,
        }
      } else if (type === "freelancer") {
        requestData = {
          type: "freelancer",
          workType: formData.work_type,
          rateAmount: Number.parseFloat(formData.rate_amount) || 0,
          rateType: formData.rate_type,
          projectDuration: formData.project_duration,
        }
      } else {
        requestData = {
          type: "payment",
          amount: Number.parseFloat(formData.payment_amount) || 0,
          currency: formData.currency,
          projectType: formData.project_title,
        }
      }

      const response = await fetch("/api/agreements/generate-terms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      })

      if (!response.ok) {
        throw new Error(`Failed to generate terms: ${response.status}`)
      }

      const data = await response.json()

      if (type === "payment") {
        handleInputChange("payment_terms", data.terms)
      } else {
        handleInputChange("terms", data.terms)
      }
    } catch (error) {
      console.error("Error generating terms:", error)
      setError("Failed to generate terms. Please try again.")
    } finally {
      setAiLoading(false)
    }
  }

  const generateAIContent = async (prompt: string, type: "terms" | "payment_terms" | "deliverables" | "scope") => {
    setAiLoading(true)
    setError(null)
    try {
      const requestData = {
        type: "custom",
        prompt: prompt,
        context: {
          projectTitle: formData.project_title,
          clientName: formData.client_name,
          freelancerName: formData.freelancer_name,
          workType: formData.work_type,
          paymentAmount: formData.payment_amount,
          currency: formData.currency,
        },
      }

      const response = await fetch("/api/agreements/generate-terms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      })

      if (!response.ok) {
        throw new Error(`Failed to generate content: ${response.status}`)
      }

      const data = await response.json()
      handleInputChange(type, data.terms)
    } catch (error) {
      console.error("Error generating content:", error)
      setError("Failed to generate content. Please try again.")
    } finally {
      setAiLoading(false)
    }
  }

  // Replaced single handleSubmit with separate client and freelancer submit functions
  const handleClientSubmit = async (clientPayload?: Partial<FormData>) => {
    setLoading(true)
    setError(null)

    try {
      // Use the payload passed by the child if present; otherwise fallback to parent's formData
      const source = clientPayload ?? formData

      // Build payload with proper numeric conversions
      const payload = {
        type: "client",
        client_name: source.client_name || "",
        client_address: source.client_address || "",
        client_email: source.client_email || "",
        freelancer_email: source.freelancer_email || "", // Assuming this might be relevant for client agreements too
        project_title: source.project_title || "",
        scope: source.scope || "",
        payment_terms: source.payment_terms || "",
        deliverables: source.deliverables || "",
        terms: source.terms || "",
        payment_amount:
          source.payment_amount && source.payment_amount !== ""
            ? Number.parseFloat(String(source.payment_amount))
            : null,
        currency: source.currency || "USD",
        responsibilities: source.responsibilities || "",
        termination: source.termination || "",
        confidentiality: source.confidentiality || "",
        governing_law: source.governing_law || "",
        ownership: source.ownership || "",
      }

      console.log("[v0] Submitting client agreement payload:", payload)

      const response = await fetch("/api/agreements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to create client agreement: ${response.status}`)
      }

      console.log("[v0] Client agreement created successfully ✅")
      await fetchAgreements()

      toast({
        title: "Success",
        description: "Client agreement created successfully",
        variant: "default",
      })

      // Reset form data after successful submission for client agreement
      setFormData({
        client_name: "",
        client_address: "",
        client_email: "",
        project_title: "",
        scope: "",
        payment_terms: "",
        deliverables: "",
        terms: defaultFreelancerTerms, // Reset to default or keep last used? For now, default.
        payment_amount: "",
        currency: "USD",
        freelancer_name: "", // Clear freelancer specific if any was filled
        freelancer_email: "",
        work_type: "",
        nda: "",
        ip_rights: "",
        rate_amount: "",
        rate_type: "hour",
        project_duration: "",
        responsibilities: "", // Clear client specific extra fields
        termination: "",
        confidentiality: "",
        governing_law: "",
        ownership: "",
      })
      setActiveTab("dashboard")
    } catch (error) {
      console.error("[v0] Error creating client agreement:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to create client agreement"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFreelancerSubmit = async (freelancerPayload?: Partial<FormData>) => {
    setLoading(true)
    setError(null)

    try {
      const source = freelancerPayload ?? formData

      // Basic validation using the payload
      if (!source.freelancer_name) throw new Error("Freelancer name is required")
      if (!source.freelancer_email) throw new Error("Freelancer email is required")
      if (!source.client_name) throw new Error("Client name is required for freelancer agreement")

      const payload = {
        type: "freelancer",
        freelancer_name: source.freelancer_name,
        freelancer_email: source.freelancer_email,
        client_name: source.client_name || "",
        client_email: source.client_email || "",
        work_type: source.work_type || "",
        nda: source.nda || "",
        ip_rights: source.ip_rights || "",
        deliverables: source.deliverables || "",
        terms: source.terms || "",
        rate_amount:
          source.rate_amount && source.rate_amount !== "" ? Number.parseFloat(String(source.rate_amount)) : null,
        rate_type: source.rate_type || "hour",
        currency: source.currency || "USD",
        project_duration: source.project_duration || "",
      }

      console.log("[v0] Submitting freelancer agreement payload:", payload)

      const response = await fetch("/api/agreements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to create freelancer agreement: ${response.status}`)
      }

      console.log("[v0] Freelancer agreement created successfully ✅")
      await fetchAgreements()

      toast({
        title: "Success",
        description: "Freelancer agreement created successfully",
        variant: "default",
      })

      // Reset form data after successful submission for freelancer agreement
      setFormData({
        client_name: "",
        client_address: "",
        client_email: "",
        project_title: "",
        scope: "",
        payment_terms: "",
        deliverables: "",
        terms: defaultFreelancerTerms, // Reset to default
        payment_amount: "",
        currency: "USD",
        freelancer_name: "",
        freelancer_email: "",
        work_type: "",
        nda: "",
        ip_rights: "",
        rate_amount: "",
        rate_type: "hour",
        project_duration: "",
      })
      setActiveTab("dashboard")
    } catch (error) {
      console.error("[v0] Error creating freelancer agreement:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to create freelancer agreement"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const downloadFile = async (url: string, filename: string) => {
    const response = await fetch(url)
    const blob = await response.blob()
    const blobUrl = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = blobUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(blobUrl)
  }

  const generatePDF = async (agreementId: string, type: "client" | "freelancer") => {
    try {
      const response = await fetch("/api/agreements/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agreementId, type }),
      })

      if (!response.ok) {
        throw new Error(`Failed to generate PDF: ${response.status}`)
      }

      const data = await response.json()
      await downloadFile(data.pdfUrl, `agreement-${agreementId}.pdf`)

      await fetchAgreements()
    } catch (error) {
      console.error("Error generating PDF:", error)
      setError("Failed to generate PDF")
    }
  }

  const generateInvoicePDF = async (invoiceId: string) => {
    try {
      const response = await fetch("/api/invoices/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId }),
      })

      if (!response.ok) {
        throw new Error(`Failed to generate invoice PDF: ${response.status}`)
      }

      const data = await response.json()
      // Try common keys returned by backends
      const url = data.pdfUrl || data.url
      if (url) {
        await downloadFile(url, `invoice-${invoiceId}.pdf`)
      }

      await fetchInvoices()
    } catch (error) {
      console.error("Error generating invoice PDF:", error)
      setError("Failed to generate invoice PDF")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "sent":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "signed":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "completed":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30"
      case "paid":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  const getDocumentAmount = (document: Document): number => {
    const toNumber = (val: unknown) => {
      const num = typeof val === "number" ? val : Number.parseFloat(String(val))
      return Number.isFinite(num) ? num : 0
    }

    if ("amount" in document && (document as any).amount !== undefined) {
      return toNumber((document as any).amount)
    }
    if ("total_amount" in document && (document as any).total_amount !== undefined) {
      return toNumber((document as any).total_amount)
    }
    if ("payment_amount" in document && (document as any).payment_amount !== undefined) {
      return toNumber((document as any).payment_amount)
    }
    return 0
  }

  const allDocuments = [
    ...agreements.map((a) => ({ ...a, document_type: "agreement" as const })),
    ...invoices.map((i) => ({ ...i, document_type: "invoice" as const })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const stats = {
    total: agreements.length + invoices.length,
    pending: allDocuments.filter((doc) => doc.status === "pending").length,
    signed: allDocuments.filter((doc) => doc.status === "signed" || doc.status === "paid").length,
    revenue: allDocuments.reduce((sum, doc) => sum + getDocumentAmount(doc), 0),
  }

  const handleInvoiceSubmit = async (invoiceData: any) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoiceData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to create invoice: ${response.status}`)
      }

      await fetchInvoices()
      setActiveTab("dashboard")
      toast({
        title: "Success",
        description: "Invoice created successfully",
        variant: "default",
      })
    } catch (error) {
      console.error("Error creating invoice:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to create invoice"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // CHANGE: allow direct delete by accepting an optional document param
  const handleDelete = async (docParam?: Document) => {
    const doc = docParam ?? selectedDocument
    if (!doc) return

    try {
      const endpoint = doc.document_type === "invoice" ? "/api/invoices" : "/api/agreements"
      const params = new URLSearchParams({
        id: doc.id,
        ...(doc.document_type === "agreement" && { type: (doc as Agreement).type }),
      })

      const response = await fetch(`${endpoint}?${params}`, { method: "DELETE" })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to delete document")
      }

      toast({
        title: "Success",
        description: "Document deleted successfully",
        variant: "default",
      })

      if (doc.document_type === "invoice") {
        fetchInvoices()
      } else {
        fetchAgreements()
      }
    } catch (error) {
      console.error("Error deleting document:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to delete document"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setSelectedDocument(null)
    }
  }

  const handleEdit = async () => {
    if (!selectedDocument) return

    try {
      console.log("[v0] Edit form data:", editFormData)
      const endpoint = selectedDocument.document_type === "invoice" ? "/api/invoices" : "/api/agreements"

      // Prepare the update payload, ensuring correct type handling for agreements
      const updatePayload: any = {
        id: selectedDocument.id,
        ...editFormData, // Spread the form data
      }
      console.log("[v0] Initial update payload:", updatePayload)
      if (selectedDocument.document_type === "agreement") {
        // Ensure 'type' is included for agreements if it's not already in editFormData
        updatePayload.type = (selectedDocument as Agreement).type
      }

      // For numeric fields, attempt conversion if they are strings
      if (selectedDocument.document_type === "invoice") {
        if (editFormData.amount !== undefined) updatePayload.amount = Number.parseFloat(String(editFormData.amount))
        if (editFormData.total_amount !== undefined)
          updatePayload.total_amount = Number.parseFloat(String(editFormData.total_amount))
      } else {
        // Agreement types
        if (editFormData.payment_amount !== undefined)
          updatePayload.payment_amount = Number.parseFloat(String(editFormData.payment_amount))
        if (editFormData.hourly_rate !== undefined)
          updatePayload.hourly_rate = Number.parseFloat(String(editFormData.hourly_rate))
      }

      console.log("[v0] Sending update payload:", updatePayload)

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to update document")
      }

      toast({
        title: "Success",
        description: "Document updated successfully",
        variant: "default",
      })

      if (selectedDocument.document_type === "invoice") {
        fetchInvoices()
      } else {
        fetchAgreements()
      }
    } catch (error) {
      console.error("Error updating document:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to update document"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setEditDialogOpen(false)
      setSelectedDocument(null)
      setEditFormData({})
    }
  }

  const handleRecreate = async (invoice: Invoice) => {
    try {
      // Fetch the specific invoice to get its details
      const response = await fetch(`/api/invoices?id=${invoice.id}`) // Assuming an API endpoint to get a single invoice by ID
      if (!response.ok) {
        throw new Error("Failed to fetch invoice details")
      }

      const data = await response.json()
      console.log("[v0] Invoice data received for recreation:", data)

      // Check if invoice data exists in the response
      if (!data.invoice) {
        throw new Error("Invoice data not found in response")
      }

      const invoiceData = data.invoice

      // Remove id and timestamps to create a new invoice with the same details
      // Keep fields like invoice_number, amount, client_name, etc.
      const { id, created_at, updated_at, ...recreateData } = invoiceData

      const createResponse = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recreateData),
      })

      if (!createResponse.ok) {
        const errorData = await createResponse.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to recreate invoice")
      }

      toast({
        title: "Success",
        description: "Invoice recreated successfully",
        variant: "default",
      })

      fetchInvoices() // Refresh the list of invoices
    } catch (error) {
      console.error("[v0] Error recreating invoice:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to recreate invoice"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (document: Document) => {
    setSelectedDocument(document)
    // Initialize editFormData with the document's data, handling potential null/undefined for optional fields
    setEditFormData({ ...document })
    setEditDialogOpen(true)
  }


  return (
    <div className="min-h-screen bg-[#241C15] text-white p-4 md:p-6 pt-[80px] sm:pt-[120px] lg:pt-[140px]">
      <div className="max-w-7xl mx-auto">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 animate-pulse">
            <p>{error}</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 text-red-200 hover:text-white hover:bg-red-500/30"
              onClick={() => setError(null)}
            >
              Dismiss
            </Button>
          </div>
        )}

        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Left: Back button */}
          <motion.div whileHover={{ x: -2 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="text-white hover:text-[#FFE01B] hover:bg-white/10 transition-all duration-200 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Admin</span>
            </Button>
          </motion.div>

          {/* Right: Title + Subtitle */}
          <motion.div
            className="flex flex-col text-center md:text-left"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="flex items-center justify-center md:justify-start gap-2">
              <FileText className="w-6 h-6 text-[#FFE01B]" />
              <h1 className="text-2xl md:text-3xl font-bold text-white">Agreement Automation</h1>
            </div>
            <p className="text-white/70 text-sm md:text-base mt-1">Manage agreements, invoices & document signing</p>
          </motion.div>
        </motion.div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Total Documents</p>
                  <p className="text-xl md:text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <div className="p-2 bg-[#FFE01B]/20 rounded-lg">
                  <FileText className="w-5 h-5 md:w-6 md:h-6 text-[#FFE01B]" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Removed unused stat cards for brevity */}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 md:space-y-6">
          <TabsList className="bg-white/5 backdrop-blur-sm border-white/10 w-full flex flex-wrap">
            <TabsTrigger
              value="dashboard"
              className="flex-1 data-[state=active]:bg-[#FFE01B] data-[state=active]:text-black transition-all duration-200 rounded-xl h-full"
            >
              <FileText className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger
              value="client-agreement"
              className="flex-1 data-[state=active]:bg-[#FFE01B] data-[state=active]:text-black transition-all duration-200 rounded-xl h-full"
            >
              <User className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Client</span>
            </TabsTrigger>
            <TabsTrigger
              value="freelancer-agreement"
              className="flex-1 data-[state=active]:bg-[#FFE01B] data-[state=active]:text-black transition-all duration-200 rounded-xl h-full"
            >
              <Briefcase className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Freelancer</span>
            </TabsTrigger>
            <TabsTrigger
              value="invoice"
              className="flex-1 data-[state=active]:bg-[#FFE01B] data-[state=active]:text-black transition-all duration-200 rounded-xl h-full"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Invoice</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-4 md:space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-white">Recent Documents</h2>
            </div>

            <Card className="bg-white/5 backdrop-blur-sm border-white/10 transition-all duration-300">
              <CardContent className="p-4 md:p-6">
                <div className="space-y-4">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-[#FFE01B]" />
                    </div>
                  ) : allDocuments.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 mx-auto text-white/40 mb-4" />
                      <p className="text-white/70">No documents found. Create your first document to get started.</p>
                    </div>
                  ) : (
                    allDocuments.map((document) => (
                      <div key={`${document.document_type}-${document.id}`} className="space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 transition-all duration-200 hover:bg-white/10">
                          <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-0">
                            <div className="w-10 h-10 bg-[#FFE01B]/20 rounded-lg flex items-center justify-center">
                              {document.document_type === "invoice" ? (
                                <CreditCard className="w-5 h-5 text-[#FFE01B]" />
                              ) : (
                                <FileText className="w-5 h-5 text-[#FFE01B]" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-white text-base md:text-lg">
                                {document.project_title ||
                                  document.work_type ||
                                  ("invoice_number" in document ? document.invoice_number : "Untitled")}
                              </h3>
                              <p className="text-white/70 text-sm">
                                {document.client_name || document.freelancer_name} • {document.document_type}
                                {document.type && ` (${document.type})`}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                            {getDocumentAmount(document) > 0 && (
                              <span className="text-[#FFE01B] font-semibold text-sm md:text-base">
                                {new Intl.NumberFormat("en-IN", {
                                  style: "currency",
                                  currency:
                                    "currency" in document && (document as any).currency
                                      ? (document as any).currency
                                      : "USD", // fallback USD if not provided
                                  minimumFractionDigits: 2,
                                }).format(getDocumentAmount(document))}
                              </span>
                            )}

                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-white hover:text-[#FFE01B] hover:bg-[#FFE01B]/10 transition-all duration-200"
                                onClick={() => {
                                  if (document.document_type === "invoice") {
                                    generateInvoicePDF(document.id)
                                  } else {
                                    generatePDF(document.id, (document as Agreement).type)
                                  }
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              {document.pdf_url && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-white hover:text-[#FFE01B] hover:bg-[#FFE01B]/10 transition-all duration-200"
                                  onClick={() =>
                                    downloadFile(document.pdf_url!, `${document.document_type}-${document.id}.pdf`)
                                  }
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
                              )}

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-white hover:text-[#FFE01B] hover:bg-[#FFE01B]/10 transition-all duration-200"
                                  >
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-[#241C15] border-white/10">
                                  {/* use onSelect for Radix menu items so actions fire correctly */}
                                  <DropdownMenuItem
                                    onSelect={(e) => {
                                      e.preventDefault()
                                      openEditDialog(document)
                                    }}
                                    className="text-white hover:text-[#FFE01B] hover:bg-[#FFE01B]/10 cursor-pointer"
                                  >
                                    <Pencil className="w-4 h-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  {document.document_type === "invoice" && (
                                    <DropdownMenuItem
                                      onSelect={() => handleRecreate(document as Invoice)}
                                      className="text-white hover:text-[#FFE01B] hover:bg-[#FFE01B]/10 cursor-pointer"
                                    >
                                      <Copy className="w-4 h-4 mr-2" />
                                      Recreate
                                    </DropdownMenuItem>
                                  )}
                                  {/* CHANGE: call delete directly from the menu instead of opening dialog */}
                                  <DropdownMenuItem
                                    onSelect={() => {
                                      // directly call delete for this document
                                      handleDelete(document)
                                    }}
                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Client Agreement Tab */}
          <TabsContent value="client-agreement" className="space-y-4 md:space-y-6 animate-fadeIn">
            <ClientAgreementForm
              onSubmitAction={handleClientSubmit}
              loading={loading}
              onGenerateAIContent={generateAIContent}
              onGenerateAITerms={generateAITerms}
              aiLoading={aiLoading}
            />
          </TabsContent>

          {/* Freelancer Agreement Tab */}
          <TabsContent value="freelancer-agreement" className="space-y-4 md:space-y-6 animate-fadeIn">
            {/* Removed old inline form, now using FreelancerAgreementForm component */}
            <FreelancerAgreementForm
              onSubmitAction={handleFreelancerSubmit}
              loading={loading}
              onGenerateAITerms={generateAITerms}
              aiLoading={aiLoading}
            />
          </TabsContent>

          {/* Invoice Tab */}
          <TabsContent value="invoice" className="animate-fadeIn">
            <InvoiceForm onSubmitAction={handleInvoiceSubmit} loading={loading} />
          </TabsContent>
        </Tabs>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="bg-[#241C15] border-white/10">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Are you sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-white/70">
                This action cannot be undone. This will permanently delete the document from the database.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-white/5 text-white border-white/10 hover:bg-white/10">
                Cancel
              </AlertDialogCancel>
              {/* Call the updated handleDelete without arguments to use selectedDocument */}
              <AlertDialogAction onClick={() => handleDelete()} className="bg-red-500 text-white hover:bg-red-600">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={(open) => {
          // Only allow closing, not opening through onOpenChange
          if (!open) {
            setEditDialogOpen(false)
          }
        }}>
          <DialogContent className="bg-[#241C15] border-white/10 max-w-2xl max-h-[80vh] overflow-y-auto" style={{ zIndex: 10000, position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <DialogHeader>
              <DialogTitle className="text-white">Edit Document</DialogTitle>
              <DialogDescription className="text-white/70">
                Make changes to your document. Click save when you're done.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {selectedDocument?.document_type === "invoice" ? (
                <>
                  <div>
                    <label className="text-white/70 text-sm mb-2 block">Invoice Number</label>
                    <Input
                      value={editFormData.invoice_number || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, invoice_number: e.target.value })}
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-white/70 text-sm mb-2 block">Client Name</label>
                    <Input
                      value={editFormData.client_name || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, client_name: e.target.value })}
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-white/70 text-sm mb-2 block">Amount</label>
                    <Input
                      type="number"
                      value={editFormData.amount || ""}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, amount: Number.parseFloat(String(e.target.value)) })
                      }
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-white/70 text-sm mb-2 block">Due Date</label>
                    <Input
                      type="date"
                      value={editFormData.due_date ? editFormData.due_date.split("T")[0] : ""} // Format for date input
                      onChange={(e) => setEditFormData({ ...editFormData, due_date: e.target.value })}
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Dynamic fields based on agreement type */}
                  {(selectedDocument as Agreement)?.type === "client" ? (
                    <>
                      <div>
                        <label className="text-white/70 text-sm mb-2 block">Client Name</label>
                        <Input
                          value={editFormData.client_name || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, client_name: e.target.value })}
                          className="bg-white/5 border-white/20 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-white/70 text-sm mb-2 block">Client Email</label>
                        <Input
                          type="email"
                          value={editFormData.client_email || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, client_email: e.target.value })}
                          className="bg-white/5 border-white/20 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-white/70 text-sm mb-2 block">Payment Amount</label>
                        <Input
                          type="number"
                          value={editFormData.payment_amount || ""}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              payment_amount: Number.parseFloat(String(e.target.value)),
                            })
                          }
                          className="bg-white/5 border-white/20 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-white/70 text-sm mb-2 block">Currency</label>
                        <Input
                          value={editFormData.currency || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, currency: e.target.value })}
                          className="bg-white/5 border-white/20 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-white/70 text-sm mb-2 block">Scope</label>
                        <Textarea
                          value={editFormData.scope || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, scope: e.target.value })}
                          className="bg-white/5 border-white/20 text-white min-h-[100px]"
                        />
                      </div>
                      <div>
                        <label className="text-white/70 text-sm mb-2 block">Deliverables</label>
                        <Textarea
                          value={editFormData.deliverables || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, deliverables: e.target.value })}
                          className="bg-white/5 border-white/20 text-white min-h-[100px]"
                        />
                      </div>
                      <div>
                        <label className="text-white/70 text-sm mb-2 block">Responsibilities</label>
                        <Textarea
                          value={editFormData.responsibilities || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, responsibilities: e.target.value })}
                          className="bg-white/5 border-white/20 text-white min-h-[100px]"
                        />
                      </div>
                      <div>
                        <label className="text-white/70 text-sm mb-2 block">Termination Clause</label>
                        <Textarea
                          value={editFormData.termination || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, termination: e.target.value })}
                          className="bg-white/5 border-white/20 text-white min-h-[100px]"
                        />
                      </div>
                      <div>
                        <label className="text-white/70 text-sm mb-2 block">Confidentiality</label>
                        <Textarea
                          value={editFormData.confidentiality || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, confidentiality: e.target.value })}
                          className="bg-white/5 border-white/20 text-white min-h-[100px]"
                        />
                      </div>
                      <div>
                        <label className="text-white/70 text-sm mb-2 block">Governing Law</label>
                        <Input
                          value={editFormData.governing_law || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, governing_law: e.target.value })}
                          className="bg-white/5 border-white/20 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-white/70 text-sm mb-2 block">Ownership Clause</label>
                        <Textarea
                          value={editFormData.ownership || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, ownership: e.target.value })}
                          className="bg-white/5 border-white/20 text-white min-h-[100px]"
                        />
                      </div>
                    </>
                  ) : (selectedDocument as Agreement)?.type === "freelancer" ? (
                    <>
                      <div>
                        <label className="text-white/70 text-sm mb-2 block">Freelancer Name</label>
                        <Input
                          value={editFormData.freelancer_name || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, freelancer_name: e.target.value })}
                          className="bg-white/5 border-white/20 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-white/70 text-sm mb-2 block">Freelancer Email</label>
                        <Input
                          type="email"
                          value={editFormData.freelancer_email || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, freelancer_email: e.target.value })}
                          className="bg-white/5 border-white/20 text-white"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-white/70 text-sm">Freelancer Rate</label>

                        <div className="flex items-center gap-3">
                          {/* Rate Input */}
                          <Input
                            type="number"
                            placeholder="Enter amount"
                            value={editFormData.rate_amount || ""}
                            onChange={(e) =>
                              setEditFormData({ ...editFormData, rate_amount: e.target.value })
                            }
                            className="bg-white/5 border-white/20 text-white w-1/2"
                          />

                          {/* Rate Type Dropdown */}
                          <select
                            value={editFormData.rate_type || "hour"}
                            onChange={(e) =>
                              setEditFormData({ ...editFormData, rate_type: e.target.value })
                            }
                            className="bg-white/5 border border-white/20 text-white text-sm rounded-md px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="hour">Per Hour</option>
                            <option value="day">Per Day</option>
                            <option value="month">Per Month</option>
                            <option value="video">Per Video</option>
                            <option value="project">Per Project</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-white/70 text-sm mb-2 block">Project Duration</label>
                        <Input
                          value={editFormData.project_duration || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, project_duration: e.target.value })}
                          className="bg-white/5 border-white/20 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-white/70 text-sm mb-2 block">Work Type</label>
                        <Input
                          value={editFormData.work_type || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, work_type: e.target.value })}
                          className="bg-white/5 border-white/20 text-white"
                        />
                      </div>
                    </>
                  ) : null}

                  <div>
                    <label className="text-white/70 text-sm mb-2 block">Terms & Conditions</label>
                    <Textarea
                      value={editFormData.terms || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, terms: e.target.value })}
                      className="bg-white/5 border-white/20 text-white min-h-[150px]"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
                className="bg-white/5 text-white border-white/10 hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button onClick={handleEdit} className="bg-[#FFE01B] text-black hover:bg-[#FFE01B]/90">
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

export default function AgreementAutomationPage() {
  return <AgreementAutomationPageContent />
}
