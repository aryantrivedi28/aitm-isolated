"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Plus, FileText, DollarSign, Users, Send, Eye, Download, Sparkles, Loader2, FileSignature, Clock, Calendar, MapPin, Mail, User, Briefcase, Target, Shield, Coins, CalendarDays, FileCheck, FileDigit, CreditCard, Landmark } from "lucide-react"
import { InvoiceForm } from "../../../components/invoice-form"
import { SignatureStatus } from "../../../components/signature-status"
import { AIPromptInput } from "@/src/components/ai-prompt-input"
import { motion } from "framer-motion"

// Define proper TypeScript interfaces
interface BaseDocument {
  id: string;
  created_at: string;
  status: string;
  project_title?: string;
  work_type?: string;
  client_name?: string;
  client_email?: string;
  freelancer_name?: string;
  freelancer_email?: string;
  pdf_url?: string;
  docuseal_envelope_id?: string;
}

interface ClientAgreement extends BaseDocument {
  type: "client";
  payment_amount?: number;
  currency?: string;
  scope?: string;
  deliverables?: string;
  terms?: string;
  payment_terms?: string;
}

interface FreelancerAgreement extends BaseDocument {
  type: "freelancer";
  hourly_rate?: number;
  project_duration?: string;
  nda?: string;
  ip_rights?: string;
}

interface Invoice extends BaseDocument {
  type: "invoice";
  invoice_number: string;
  amount: number;
  total_amount: number;
  due_date: string;
}

type Agreement = ClientAgreement | FreelancerAgreement;
type Document = Agreement | Invoice;

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
  hourly_rate: string
  project_duration: string
}

function AgreementAutomationPageContent() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [agreements, setAgreements] = useState<Agreement[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    client_name: "",
    client_address: "",
    client_email: "",
    project_title: "",
    scope: "",
    payment_terms: "",
    deliverables: "",
    terms: "",
    payment_amount: "",
    currency: "USD",
    freelancer_name: "",
    freelancer_email: "",
    work_type: "",
    nda: "",
    ip_rights: "",
    hourly_rate: "",
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
          hourlyRate: Number.parseFloat(formData.hourly_rate) || 0,
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

  const handleSubmit = async (type: "client" | "freelancer") => {
    setLoading(true)
    setError(null)

    try {
      let payload: any = {}

      if (type === "client") {
        payload = {
          client_name: formData.client_name,
          client_address: formData.client_address,
          client_email: formData.client_email,
          project_title: formData.project_title,
          scope: formData.scope,
          payment_terms: formData.payment_terms,
          deliverables: formData.deliverables,
          terms: formData.terms,
          payment_amount: formData.payment_amount,
          currency: formData.currency,
          type,
        }
      } else if (type === "freelancer") {
        payload = {
          freelancer_name: formData.freelancer_name,
          freelancer_email: formData.freelancer_email,
          work_type: formData.work_type,
          nda: formData.nda,
          ip_rights: formData.ip_rights,
          hourly_rate: formData.hourly_rate,
          project_duration: formData.project_duration,
          type,
        }
      }

      const response = await fetch("/api/agreements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to create agreement: ${response.status}`)
      }

      await fetchAgreements()

      // Reset form
      setFormData({
        client_name: "",
        client_address: "",
        client_email: "",
        project_title: "",
        scope: "",
        payment_terms: "",
        deliverables: "",
        terms: "",
        payment_amount: "",
        currency: "USD",
        freelancer_name: "",
        freelancer_email: "",
        work_type: "",
        nda: "",
        ip_rights: "",
        hourly_rate: "",
        project_duration: "",
      })

      setActiveTab("dashboard")
    } catch (error) {
      console.error("Error creating agreement:", error)
      setError(error instanceof Error ? error.message : "Failed to create agreement")
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
      await downloadFile(data.pdfUrl, `invoice-${invoiceId}.pdf`)

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
    if ("amount" in document && typeof document.amount === "number") {
      return document.amount
    }
    if ("total_amount" in document && typeof document.total_amount === "number") {
      return document.total_amount
    }
    if ("payment_amount" in document && typeof document.payment_amount === "number") {
      return document.payment_amount
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
    } catch (error) {
      console.error("Error creating invoice:", error)
      setError(error instanceof Error ? error.message : "Failed to create invoice")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#241C15] text-white p-4 md:p-6">
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
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Agreement Automation
              </h1>
            </div>
            <p className="text-white/70 text-sm md:text-base mt-1">
              Manage agreements, invoices & document signing
            </p>
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

          {/* <Card className="bg-white/5 backdrop-blur-sm border-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Pending Signatures</p>
                  <p className="text-xl md:text-2xl font-bold text-white">{stats.pending}</p>
                </div>
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Clock className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card> */}

          {/* <Card className="bg-white/5 backdrop-blur-sm border-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Signed Documents</p>
                  <p className="text-xl md:text-2xl font-bold text-white">{stats.signed}</p>
                </div>
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <FileSignature className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card> */}

          {/* <Card className="bg-white/5 backdrop-blur-sm border-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Total Revenue</p>
                  <p className="text-xl md:text-2xl font-bold text-white">${stats.revenue.toLocaleString()}</p>
                </div>
                <div className="p-2 bg-[#FFE01B]/20 rounded-lg">
                  <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-[#FFE01B]" />
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 md:space-y-6">
          <TabsList className="bg-white/5 backdrop-blur-sm border-white/10 w-full flex flex-wrap">
            <TabsTrigger value="dashboard" className="flex-1 data-[state=active]:bg-[#FFE01B] data-[state=active]:text-black transition-all duration-200 rounded-xl h-full">
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
            <TabsTrigger value="invoice" className="flex-1 data-[state=active]:bg-[#FFE01B] data-[state=active]:text-black transition-all duration-200 rounded-xl h-full">
              <CreditCard className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Invoice</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-4 md:space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-white">Recent Documents</h2>
              {/* <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  onClick={() => setActiveTab("client-agreement")}
                  className="bg-[#FFE01B] text-black hover:bg-[#FFE01B]/90 transition-all duration-200 flex-1 sm:flex-initial"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">New Agreement</span>
                </Button>
                <Button
                  onClick={() => setActiveTab("invoice")}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 transition-all duration-200 flex-1 sm:flex-initial"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">New Invoice</span>
                </Button>
              </div> */}
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
                                {document.project_title || document.work_type || ('invoice_number' in document ? document.invoice_number : 'Untitled')}
                              </h3>
                              <p className="text-white/70 text-sm">
                                {document.client_name || document.freelancer_name} • {document.document_type}
                                {document.type && ` (${document.type})`}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                            <Badge className={`${getStatusColor(document.status || "pending")} self-start md:self-auto`}>
                              {(document.status || "pending").charAt(0).toUpperCase() +
                                (document.status || "pending").slice(1)}
                            </Badge>
                            {getDocumentAmount(document) > 0 && (
                              <span className="text-[#FFE01B] font-semibold text-sm md:text-base">
                                ${getDocumentAmount(document).toLocaleString()}
                              </span>
                            )}
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-white hover:text-[#FFE01B] transition-all duration-200"
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
                                  className="text-white hover:text-[#FFE01B] transition-all duration-200"
                                  onClick={() =>
                                    downloadFile(
                                      document.pdf_url!,
                                      `${document.document_type}-${document.id}.pdf`
                                    )
                                  }
                                >
                                  <Download className="w-4 h-4" />
                                </Button>

                              )}
                            </div>
                          </div>
                        </div>

                        {document.pdf_url && (
                          <SignatureStatus
                            documentId={document.id}
                            documentType={
                              document.document_type === "invoice" ? "invoice" : (document as Agreement).type
                            }
                            status={document.status || "pending"}
                            docusealEnvelopeId={document.docuseal_envelope_id}
                            signerEmail={document.client_email || (document as FreelancerAgreement).freelancer_email}
                            signerName={document.client_name || (document as FreelancerAgreement).freelancer_name}
                            onStatusUpdate={() => {
                              // Refresh documents when status changes
                              if (document.document_type === "invoice") {
                                fetchInvoices()
                              } else {
                                fetchAgreements()
                              }
                            }}
                          />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Client Agreement Tab */}
          <TabsContent value="client-agreement" className="space-y-4 md:space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              <div className="lg:col-span-2">
                <Card className="bg-white/5 backdrop-blur-sm border-white/10 transition-all duration-300">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-white flex items-center gap-2">
                      <User className="w-5 h-5 text-[#FFE01B]" />
                      Create Client Agreement
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 md:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div className="space-y-3 md:space-y-4">
                        <div>
                          <label className="text-white/70 text-sm mb-2 flex items-center gap-1">
                            <User className="w-4 h-4" />
                            Client Name
                          </label>
                          <Input
                            value={formData.client_name}
                            onChange={(e) => handleInputChange("client_name", e.target.value)}
                            className="bg-white/5 border-white/20 text-white transition-all duration-200 focus:ring-2 focus:ring-[#FFE01B]"
                            placeholder="Enter client name"
                          />
                        </div>
                        <div>
                          <label className="text-white/70 text-sm mb-2 flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            Client Email
                          </label>
                          <Input
                            type="email"
                            value={formData.client_email}
                            onChange={(e) => handleInputChange("client_email", e.target.value)}
                            className="bg-white/5 border-white/20 text-white transition-all duration-200 focus:ring-2 focus:ring-[#FFE01B]"
                            placeholder="client@example.com"
                          />
                        </div>
                        <div>
                          <label className="text-white/70 text-sm mb-2 flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            Project Title
                          </label>
                          <Input
                            value={formData.project_title}
                            onChange={(e) => handleInputChange("project_title", e.target.value)}
                            className="bg-white/5 border-white/20 text-white transition-all duration-200 focus:ring-2 focus:ring-[#FFE01B]"
                            placeholder="Enter project title"
                          />
                        </div>
                        <div>
                          <label className="text-white/70 text-sm mb-2 flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            Payment Amount
                          </label>
                          <div className="flex gap-2">
                            <Select
                              value={formData.currency}
                              onValueChange={(value) => handleInputChange("currency", value)}
                            >
                              <SelectTrigger className="w-20 md:w-24 bg-white/5 border-white/20 text-white transition-all duration-200 focus:ring-2 focus:ring-[#FFE01B]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-[#241C15] border-white/20 text-white">
                                <SelectItem value="USD">USD</SelectItem>
                                <SelectItem value="EUR">EUR</SelectItem>
                                <SelectItem value="INR">INR</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input
                              type="number"
                              value={formData.payment_amount}
                              onChange={(e) => handleInputChange("payment_amount", e.target.value)}
                              className="bg-white/5 border-white/20 text-white transition-all duration-200 focus:ring-2 focus:ring-[#FFE01B]"
                              placeholder="0.00"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3 md:space-y-4">
                        <div>
                          <label className="text-white/70 text-sm mb-2 flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            Client Address
                          </label>
                          <Textarea
                            value={formData.client_address}
                            onChange={(e) => handleInputChange("client_address", e.target.value)}
                            className="bg-white/5 border-white/20 text-white transition-all duration-200 focus:ring-2 focus:ring-[#FFE01B] min-h-[100px]"
                            placeholder="Enter client address"
                          />
                        </div>
                        <div>
                          <label className="text-white/70 text-sm mb-2 flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            Scope of Work
                          </label>
                          <Textarea
                            value={formData.scope}
                            onChange={(e) => handleInputChange("scope", e.target.value)}
                            className="bg-white/5 border-white/20 text-white transition-all duration-200 focus:ring-2 focus:ring-[#FFE01B] min-h-[100px]"
                            placeholder="Describe the scope of work"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 md:space-y-4">
                      <div>
                        <label className="text-white/70 text-sm mb-2 flex items-center gap-1">
                          <FileCheck className="w-4 h-4" />
                          Deliverables
                        </label>
                        <Textarea
                          value={formData.deliverables}
                          onChange={(e) => handleInputChange("deliverables", e.target.value)}
                          className="bg-white/5 border-white/20 text-white transition-all duration-200 focus:ring-2 focus:ring-[#FFE01B] min-h-[80px]"
                          placeholder="List the deliverables"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-white/70 text-sm flex items-center gap-1">
                            <CalendarDays className="w-4 h-4" />
                            Payment Terms
                          </label>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => generateAITerms("payment")}
                            disabled={aiLoading}
                            className="border-[#FFE01B]/30 text-[#FFE01B] hover:bg-[#FFE01B]/10 transition-all duration-200"
                          >
                            {aiLoading ? (
                              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            ) : (
                              <Sparkles className="w-3 h-3 mr-1" />
                            )}
                            AI Generate
                          </Button>
                        </div>
                        <Textarea
                          value={formData.payment_terms}
                          onChange={(e) => handleInputChange("payment_terms", e.target.value)}
                          className="bg-white/5 border-white/20 text-white transition-all duration-200 focus:ring-2 focus:ring-[#FFE01B] min-h-[80px]"
                          placeholder="Describe payment terms"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-white/70 text-sm flex items-center gap-1">
                            <Shield className="w-4 h-4" />
                            Terms & Conditions
                          </label>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => generateAITerms("client")}
                            disabled={aiLoading}
                            className="border-[#FFE01B]/30 text-[#FFE01B] hover:bg-[#FFE01B]/10 transition-all duration-200"
                          >
                            {aiLoading ? (
                              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            ) : (
                              <Sparkles className="w-3 h-3 mr-1" />
                            )}
                            AI Generate
                          </Button>
                        </div>
                        <Textarea
                          value={formData.terms}
                          onChange={(e) => handleInputChange("terms", e.target.value)}
                          className="bg-white/5 border-white/20 text-white transition-all duration-200 focus:ring-2 focus:ring-[#FFE01B] min-h-[100px]"
                          placeholder="Enter terms and conditions"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 md:gap-4 flex-col sm:flex-row">
                      <Button
                        onClick={() => handleSubmit("client")}
                        disabled={loading}
                        className="bg-[#FFE01B] text-black hover:bg-[#FFE01B]/90 transition-all duration-200 flex-1"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <FileSignature className="w-4 h-4 mr-2" />
                            Create Agreement
                          </>
                        )}
                      </Button>
                      <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent transition-all duration-200 flex-1">
                        Save as Draft
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* AI Prompt Inputs Sidebar */}
              <div className="space-y-3 md:space-y-4">
                <AIPromptInput
                  onGenerateAction={generateAIContent}
                  loading={aiLoading}
                  title="Generate Scope of Work"
                  placeholder="e.g., Create a modern e-commerce website with payment integration"
                  type="scope"
                  icon={<FileText className="w-4 h-4" />}
                />
                <AIPromptInput
                  onGenerateAction={generateAIContent}
                  loading={aiLoading}
                  title="Generate Deliverables"
                  placeholder="e.g., Website design, mobile app, user documentation"
                  type="deliverables"
                  icon={<FileCheck className="w-4 h-4" />}
                />
                <AIPromptInput
                  onGenerateAction={generateAIContent}
                  loading={aiLoading}
                  title="Generate Payment Terms"
                  placeholder="e.g., 50% upfront, 50% on completion, Net 30 payment terms"
                  type="payment_terms"
                  icon={<CalendarDays className="w-4 h-4" />}
                />
                <AIPromptInput
                  onGenerateAction={generateAIContent}
                  loading={aiLoading}
                  title="Generate Terms & Conditions"
                  placeholder="e.g., Include IP ownership, revision limits, cancellation policy"
                  type="terms"
                  icon={<Shield className="w-4 h-4" />}
                />
              </div>
            </div>
          </TabsContent>

          {/* Freelancer Agreement Tab */}
          <TabsContent value="freelancer-agreement" className="space-y-4 md:space-y-6 animate-fadeIn">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-[#FFE01B]" />
                  Create Freelancer Agreement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-3 md:space-y-4">
                    <div>
                      <label className="text-white/70 text-sm mb-2 flex items-center gap-1">
                        <User className="w-4 h-4" />
                        Freelancer Name
                      </label>
                      <Input
                        value={formData.freelancer_name}
                        onChange={(e) => handleInputChange("freelancer_name", e.target.value)}
                        className="bg-white/5 border-white/20 text-white transition-all duration-200 focus:ring-2 focus:ring-[#FFE01B]"
                        placeholder="Enter freelancer name"
                      />
                    </div>
                    <div>
                      <label className="text-white/70 text-sm mb-2 flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        Freelancer Email
                      </label>
                      <Input
                        type="email"
                        value={formData.freelancer_email}
                        onChange={(e) => handleInputChange("freelancer_email", e.target.value)}
                        className="bg-white/5 border-white/20 text-white transition-all duration-200 focus:ring-2 focus:ring-[#FFE01B]"
                        placeholder="freelancer@example.com"
                      />
                    </div>
                    <div>
                      <label className="text-white/70 text-sm mb-2 flex items-center gap-1">
                        <User className="w-4 h-4" />
                        Client Name
                      </label>
                      <Input
                        value={formData.client_name}
                        onChange={(e) => handleInputChange("client_name", e.target.value)}
                        className="bg-white/5 border-white/20 text-white transition-all duration-200 focus:ring-2 focus:ring-[#FFE01B]"
                        placeholder="Enter client name"
                      />
                    </div>
                    <div>
                      <label className="text-white/70 text-sm mb-2 flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        Work Type
                      </label>
                      <Input
                        value={formData.work_type}
                        onChange={(e) => handleInputChange("work_type", e.target.value)}
                        className="bg-white/5 border-white/20 text-white transition-all duration-200 focus:ring-2 focus:ring-[#FFE01B]"
                        placeholder="e.g., Web Development, Design"
                      />
                    </div>
                  </div>
                  <div className="space-y-3 md:space-y-4">
                    <div>
                      <label className="text-white/70 text-sm mb-2 flex items-center gap-1">
                        <Coins className="w-4 h-4" />
                        Hourly Rate ($)
                      </label>
                      <Input
                        type="number"
                        value={formData.hourly_rate}
                        onChange={(e) => handleInputChange("hourly_rate", e.target.value)}
                        className="bg-white/5 border-white/20 text-white transition-all duration-200 focus:ring-2 focus:ring-[#FFE01B]"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="text-white/70 text-sm mb-2 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Project Duration
                      </label>
                      <Input
                        value={formData.project_duration}
                        onChange={(e) => handleInputChange("project_duration", e.target.value)}
                        className="bg-white/5 border-white/20 text-white transition-all duration-200 focus:ring-2 focus:ring-[#FFE01B]"
                        placeholder="e.g., 3 months, 40 hours"
                      />
                    </div>
                    <div>
                      <label className="text-white/70 text-sm mb-2 flex items-center gap-1">
                        <Shield className="w-4 h-4" />
                        NDA Requirements
                      </label>
                      <Textarea
                        value={formData.nda}
                        onChange={(e) => handleInputChange("nda", e.target.value)}
                        className="bg-white/5 border-white/20 text-white transition-all duration-200 focus:ring-2 focus:ring-[#FFE01B] min-h-[80px]"
                        placeholder="Describe NDA requirements"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3 md:space-y-4">
                  <div>
                    <label className="text-white/70 text-sm mb-2 flex items-center gap-1">
                      <Landmark className="w-4 h-4" />
                      IP Rights
                    </label>
                    <Textarea
                      value={formData.ip_rights}
                      onChange={(e) => handleInputChange("ip_rights", e.target.value)}
                      className="bg-white/5 border-white/20 text-white transition-all duration-200 focus:ring-2 focus:ring-[#FFE01B] min-h-[80px]"
                      placeholder="Describe intellectual property rights"
                    />
                  </div>
                  <div>
                    <label className="text-white/70 text-sm mb-2 flex items-center gap-1">
                      <FileCheck className="w-4 h-4" />
                      Deliverables
                    </label>
                    <Textarea
                      value={formData.deliverables}
                      onChange={(e) => handleInputChange("deliverables", e.target.value)}
                      className="bg-white/5 border-white/20 text-white transition-all duration-200 focus:ring-2 focus:ring-[#FFE01B] min-h-[80px]"
                      placeholder="List the deliverables"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-white/70 text-sm flex items-center gap-1">
                        <Shield className="w-4 h-4" />
                        Terms & Conditions
                      </label>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => generateAITerms("freelancer")}
                        disabled={aiLoading}
                        className="border-[#FFE01B]/30 text-[#FFE01B] hover:bg-[#FFE01B]/10 transition-all duration-200"
                      >
                        {aiLoading ? (
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        ) : (
                          <Sparkles className="w-3 h-3 mr-1" />
                        )}
                        AI Generate
                      </Button>
                    </div>
                    <Textarea
                      value={formData.terms}
                      onChange={(e) => handleInputChange("terms", e.target.value)}
                      className="bg-white/5 border-white/20 text-white transition-all duration-200 focus:ring-2 focus:ring-[#FFE01B] min-h-[100px]"
                      placeholder="Enter terms and conditions"
                    />
                  </div>
                </div>

                <div className="flex gap-3 md:gap-4 flex-col sm:flex-row">
                  <Button
                    onClick={() => handleSubmit("freelancer")}
                    disabled={loading}
                    className="bg-[#FFE01B] text-black hover:bg-[#FFE01B]/90 transition-all duration-200 flex-1"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <FileSignature className="w-4 h-4 mr-2" />
                        Create Agreement
                      </>
                    )}
                  </Button>
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent transition-all duration-200 flex-1">
                    Save as Draft
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invoice Tab */}
          <TabsContent value="invoice" className="animate-fadeIn">
            <InvoiceForm onSubmitAction={handleInvoiceSubmit} loading={loading} />
          </TabsContent>
        </Tabs>
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