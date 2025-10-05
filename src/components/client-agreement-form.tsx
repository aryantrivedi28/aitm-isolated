"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AIPromptInput } from "../components/ai-prompt-input"
import {
  User,
  Mail,
  MapPin,
  Target,
  DollarSign,
  Shield,
  CalendarDays,
  FileSignature,
  Loader2,
  Sparkles,
} from "lucide-react"

interface ClientAgreementFormData {
  client_name: string
  client_address: string
  client_email: string
  freelancer_email: string
  project_title: string
  scope: string
  payment_terms: string
  deliverables: string
  terms: string
  payment_amount: string
  currency: string
  responsibilities: string
  termination: string
  confidentiality: string
  governing_law: string
  ownership: string
  type?: string
}

interface ClientAgreementFormProps {
  onSubmitAction: (data: ClientAgreementFormData) => Promise<void>
  loading: boolean
  onGenerateAIContent: (
    prompt: string,
    type: "terms" | "payment_terms" | "deliverables" | "scope"
  ) => Promise<void>   // <-- narrowed type
  onGenerateAITerms: (type: "client" | "payment") => Promise<void>
  aiLoading: boolean
}


const DEFAULT_RESPONSIBILITIES = `3.1 Service Provider (Finzie)
• Source and manage qualified service providers based on project needs.
• Coordinate project timelines, quality assurance, and communications.
• Ensure completion of tasks within timelines and scope.
• Provide replacements for underperforming providers within 3 working days.

3.2 Client
• Provide clear briefs, goals, references, and timely feedback.
• Approve freelancer costs and project scopes as required.
• Make payments according to agreed terms.
• Raise performance or delivery concerns promptly.`

const DEFAULT_TERMINATION = `4.1 Either party may terminate this Agreement with 7 days written notice.
4.2 In the event of termination, the Client shall pay the Service Provider for all approved and completed work up to the date of termination, within 15 days of final invoicing.`

const DEFAULT_CONFIDENTIALITY = `5.1 Both parties agree to maintain the confidentiality of all sensitive, proprietary, or business-specific information shared during the engagement.
5.2 All communication related to payment, scope, or freelancer engagements shall be handled exclusively through the Service Provider.
5.3 This clause will survive the termination of this Agreement.`

const DEFAULT_GOVERNING_LAW = `This Agreement shall be governed by the laws of India and California. In the event of a dispute, both parties agree to first attempt to resolve the matter through informal negotiation. If unresolved, the matter may be referred to arbitration or legal proceedings in either Chhindwara, Madhya Pradesh, India or Santa Barbara, California, based on mutual agreement.`

const DEFAULT_OWNERSHIP = `8.1 All work produced under this Agreement will be the sole and exclusive property of the Client upon final payment.
8.2 The Service Provider shall ensure that freelancers avoid the use of any unlicensed or third-party intellectual property unless provided or approved by the Client.
8.3 Neither the Service Provider nor any engaged freelancer may publicly share or refer to the Client's brand, content, or projects without prior written approval.`

export function ClientAgreementForm({
  onSubmitAction,
  loading,
  onGenerateAIContent,
  onGenerateAITerms,
  aiLoading,
}: ClientAgreementFormProps) {
  const [formData, setFormData] = useState<ClientAgreementFormData>({
    client_name: "",
    client_address: "",
    client_email: "",
    freelancer_email: "",
    project_title: "",
    scope: "",
    payment_terms: "",
    deliverables: "",
    terms: "",
    payment_amount: "",
    currency: "USD",
    responsibilities: DEFAULT_RESPONSIBILITIES,
    termination: DEFAULT_TERMINATION,
    confidentiality: DEFAULT_CONFIDENTIALITY,
    governing_law: DEFAULT_GOVERNING_LAW,
    ownership: DEFAULT_OWNERSHIP,
  })

  const handleInputChange = (field: keyof ClientAgreementFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    console.log("Submitting formData:", formData) // Check values here

    try {
      await onSubmitAction({ ...formData, type: "client" })
      console.log("Data sent to backend successfully ✅")
    } catch (error) {
      console.error("Error sending data to backend ❌:", error)
    }
  }

  return (
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
            <div className="border-b border-white/10 pb-2">
              <h3 className="text-white font-semibold text-lg">Basic Information</h3>
            </div>

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
                    className="bg-white/5 border-white/20 text-white transition-all duration-200 focus:ring-2 focus:ring-[#FFE01B] min-h-[115px]"
                    placeholder="Enter client address"
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
                    <DollarSign className="w-4 h-4" />
                    Payment Amount
                  </label>
                  <div className="flex gap-2">
                    <Select value={formData.currency} onValueChange={(value) => handleInputChange("currency", value)}>
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
            </div>

            <div className="border-b border-white/10 pb-2 pt-4">
              <h3 className="text-white font-semibold text-lg">1. Scope of Work</h3>
            </div>

            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="text-white/70 text-sm mb-2 flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  Scope Description
                </label>
                <Textarea
                  value={formData.scope}
                  onChange={(e) => handleInputChange("scope", e.target.value)}
                  className="bg-white/5 border-white/20 text-white transition-all duration-200 focus:ring-2 focus:ring-[#FFE01B] min-h-[150px]"
                  placeholder="Describe the scope of work, responsibilities, and deliverables"
                />
              </div>

              <div>
                <label className="text-white/70 text-sm mb-2 flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  Deliverables
                </label>
                <Textarea
                  value={formData.deliverables}
                  onChange={(e) => handleInputChange("deliverables", e.target.value)}
                  className="bg-white/5 border-white/20 text-white transition-all duration-200 focus:ring-2 focus:ring-[#FFE01B] min-h-[100px]"
                  placeholder="List specific deliverables"
                />
              </div>
            </div>

            <div className="border-b border-white/10 pb-2 pt-4">
              <h3 className="text-white font-semibold text-lg">2. Payment Terms</h3>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-white/70 text-sm flex items-center gap-1">
                  <CalendarDays className="w-4 h-4" />
                  Payment Terms Details
                </label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => onGenerateAITerms("payment")}
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
                className="bg-white/5 border-white/20 text-white transition-all duration-200 focus:ring-2 focus:ring-[#FFE01B] min-h-[150px]"
                placeholder="Describe payment schedule, milestones, and terms"
              />
            </div>

            <div className="border-b border-white/10 pb-2 pt-4">
              <h3 className="text-white font-semibold text-lg">3. Responsibilities</h3>
            </div>

            <div>
              <label className="text-white/70 text-sm mb-2 flex items-center gap-1">
                <Shield className="w-4 h-4" />
                Responsibilities of Both Parties
              </label>
              <Textarea
                value={formData.responsibilities}
                onChange={(e) => handleInputChange("responsibilities", e.target.value)}
                className="bg-white/5 border-white/20 text-white transition-all duration-200 focus:ring-2 focus:ring-[#FFE01B] min-h-[200px] font-mono text-sm"
                placeholder="Define responsibilities"
              />
            </div>

            <div className="border-b border-white/10 pb-2 pt-4">
              <h3 className="text-white font-semibold text-lg">4. Termination</h3>
            </div>

            <div>
              <label className="text-white/70 text-sm mb-2 flex items-center gap-1">
                <FileSignature className="w-4 h-4" />
                Termination Conditions
              </label>
              <Textarea
                value={formData.termination}
                onChange={(e) => handleInputChange("termination", e.target.value)}
                className="bg-white/5 border-white/20 text-white transition-all duration-200 focus:ring-2 focus:ring-[#FFE01B] min-h-[120px] font-mono text-sm"
                placeholder="Define termination terms"
              />
            </div>

            <div className="border-b border-white/10 pb-2 pt-4">
              <h3 className="text-white font-semibold text-lg">5. Confidentiality</h3>
            </div>

            <div>
              <label className="text-white/70 text-sm mb-2 flex items-center gap-1">
                <Shield className="w-4 h-4" />
                Confidentiality Terms
              </label>
              <Textarea
                value={formData.confidentiality}
                onChange={(e) => handleInputChange("confidentiality", e.target.value)}
                className="bg-white/5 border-white/20 text-white transition-all duration-200 focus:ring-2 focus:ring-[#FFE01B] min-h-[120px] font-mono text-sm"
                placeholder="Define confidentiality requirements"
              />
            </div>

            <div className="border-b border-white/10 pb-2 pt-4">
              <h3 className="text-white font-semibold text-lg">6. Governing Law</h3>
            </div>

            <div>
              <label className="text-white/70 text-sm mb-2 flex items-center gap-1">
                <Shield className="w-4 h-4" />
                Governing Law & Jurisdiction
              </label>
              <Textarea
                value={formData.governing_law}
                onChange={(e) => handleInputChange("governing_law", e.target.value)}
                className="bg-white/5 border-white/20 text-white transition-all duration-200 focus:ring-2 focus:ring-[#FFE01B] min-h-[120px] font-mono text-sm"
                placeholder="Define governing law"
              />
            </div>

            <div className="border-b border-white/10 pb-2 pt-4">
              <h3 className="text-white font-semibold text-lg">7. Additional Terms & Conditions</h3>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-white/70 text-sm flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  Additional Terms
                </label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => onGenerateAITerms("client")}
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
                className="bg-white/5 border-white/20 text-white transition-all duration-200 focus:ring-2 focus:ring-[#FFE01B] min-h-[150px]"
                placeholder="Enter any additional terms and conditions"
              />
            </div>

            <div className="border-b border-white/10 pb-2 pt-4">
              <h3 className="text-white font-semibold text-lg">8. Ownership & Usage</h3>
            </div>

            <div>
              <label className="text-white/70 text-sm mb-2 flex items-center gap-1">
                <Shield className="w-4 h-4" />
                Intellectual Property & Ownership
              </label>
              <Textarea
                value={formData.ownership}
                onChange={(e) => handleInputChange("ownership", e.target.value)}
                className="bg-white/5 border-white/20 text-white transition-all duration-200 focus:ring-2 focus:ring-[#FFE01B] min-h-[150px] font-mono text-sm"
                placeholder="Define ownership and IP rights"
              />
            </div>

            <div className="flex gap-3 md:gap-4 flex-col sm:flex-row">
              <Button
                onClick={handleSubmit}
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
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Prompt Inputs Sidebar */}
      <div className="space-y-3 md:space-y-4">
        <AIPromptInput
          onGenerateAction={(prompt, type) => onGenerateAIContent(
            prompt,
            type as "terms" | "payment_terms" | "deliverables" | "scope"
          )}
          loading={aiLoading}
          title="Generate Scope of Work"
          placeholder="e.g., Design and develop a mobile app with user authentication"
          type="scope"
          icon={<Shield className="w-4 h-4" />}
        />
        <AIPromptInput
          onGenerateAction={(prompt, type) => onGenerateAIContent(
            prompt,
            type as "terms" | "payment_terms" | "deliverables" | "scope"
          )}
          loading={aiLoading}
          title="Generate Payment Terms"
          placeholder="e.g., 50% upfront, 50% on completion, Net 30 payment terms"
          type="payment_terms"
          icon={<CalendarDays className="w-4 h-4" />}
        />
        <AIPromptInput
          onGenerateAction={(prompt, type) => onGenerateAIContent(
            prompt,
            type as "terms" | "payment_terms" | "deliverables" | "scope"
          )}
          loading={aiLoading}
          title="Generate Terms & Conditions"
          placeholder="e.g., Include IP ownership, revision limits, cancellation policy"
          type="terms"
          icon={<Shield className="w-4 h-4" />}
        />
      </div>
    </div>
  )
}
