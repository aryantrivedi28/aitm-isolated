"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { User, Mail, Briefcase, Coins, Calendar, Shield, FileSignature, Loader2, Sparkles } from "lucide-react"

interface FreelancerAgreementFormData {
  freelancer_name: string
  freelancer_email: string
  client_name: string
  client_email: string
  work_type: string
  scope: string
  terms: string
  rate_amount: string
  rate_type: string
  currency: string
  project_duration: string
}

interface FreelancerAgreementFormProps {
  onSubmitAction: (data: FreelancerAgreementFormData) => Promise<void>
  loading: boolean
  onGenerateAITerms: (type: "freelancer") => Promise<void>
  aiLoading: boolean
}

// Clean, well-formatted default terms
const DEFAULT_FREELANCER_TERMS = `1. PROFESSIONAL CONDUCT & COMMUNICATION
    - Freelancers are expected to maintain the highest level of professionalism in all interactions, 
       both internal and external.
    - All communication with clients must be courteous, respectful, and consistent with professional standards.
    - Discussing payments directly with clients, soliciting projects independently, or engaging in side 
       communications unrelated to the engagement is strictly prohibited and will be considered a breach of contract.
    - Attendance in scheduled client meetings is mandatory. In case of emergencies, a prior notice of at 
       least 5-6 hours must be provided.

2. COMMITMENT & DURATION
    - The minimum engagement duration is two (2) months.
    - Either party may terminate the agreement by providing a 10-day written notice.
    - If the freelancer discontinues the engagement before completing the minimum duration, 50% of the 
       pending payout will be deducted as a penalty.

3. OWNERSHIP & ACCOUNTABILITY
    - Freelancers are expected to take full ownership of their assigned work—from planning to final delivery.
    - The company reserves the right to terminate the engagement without prior notice in cases of serious 
       misconduct, repeated underperformance, or breach of trust.

4. PERFORMANCE & DELIVERABLES
    - Freelancers must meet deadlines, follow briefs accurately, and deliver high-quality work.
    - Failure to meet agreed performance standards may result in a performance review, payment deductions, or termination.
    - Specific deliverables, formats, and timelines will be communicated per project. Any anticipated delay 
       must be reported in advance.

5. CONFIDENTIALITY & CONFLICT OF INTEREST
    - Freelancers shall not disclose, share, or misuse any confidential information, documents, strategies,
       or trade secrets belonging to the company or its clients—both during and after the engagement.
    - Any potential conflict of interest must be disclosed immediately. Freelancers are prohibited from 
       working with direct competitors without prior written approval.

6. INTELLECTUAL PROPERTY RIGHTS
    - All work created during the engagement shall be the exclusive property of the company or its respective clients.
    - Freelancers waive any rights to reuse, reproduce, or republish any part of the work without prior written consent.`

export function FreelancerAgreementForm({
  onSubmitAction,
  loading,
  onGenerateAITerms,
  aiLoading,
}: FreelancerAgreementFormProps) {
  const [formData, setFormData] = useState<FreelancerAgreementFormData>({
    freelancer_name: "",
    freelancer_email: "",
    client_name: "",
    client_email: "",
    work_type: "",
    scope: "",
    terms: DEFAULT_FREELANCER_TERMS,
    rate_amount: "",
    rate_type: "hour",
    currency: "USD",
    project_duration: "",
  })

  const handleInputChange = (field: keyof FreelancerAgreementFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    await onSubmitAction(formData)
    // Reset form after successful submission
    setFormData({
      freelancer_name: "",
      freelancer_email: "",
      client_name: "",
      client_email: "",
      work_type: "",
      scope: "",
      terms: DEFAULT_FREELANCER_TERMS,
      rate_amount: "",
      rate_type: "hour",
      currency: "USD",
      project_duration: "",
    })
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6">
      <div className="lg:col-span-2">
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#FFE01B]" />
              Create Freelancer Agreement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <div className="space-y-4 md:space-y-4">
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
              </div>
              <div className="space-y-3 md:space-y-4">
                <div>
                  <label className="text-white/70 text-sm mb-2 flex items-center gap-1">
                    <Coins className="w-4 h-4" />
                    Rate
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <Input
                      type="number"
                      value={formData.rate_amount}
                      onChange={(e) => handleInputChange("rate_amount", e.target.value)}
                      className="bg-white/5 border-white/20 text-white transition-all duration-200 focus:ring-2 focus:ring-[#FFE01B] w-full sm:w-1/3"
                      placeholder="0.00"
                    />
                    <select
                      value={formData.currency}
                      onChange={(e) => handleInputChange("currency", e.target.value)}
                      className="bg-white/5 border border-white/20 text-white rounded-lg px-3 py-2 w-full sm:w-1/3 focus:ring-2 focus:ring-[#FFE01B]"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="INR">INR (₹)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="AUD">AUD (A$)</option>
                      <option value="CAD">CAD (C$)</option>
                      <option value="JPY">JPY (¥)</option>
                    </select>
                    <select
                      value={formData.rate_type}
                      onChange={(e) => handleInputChange("rate_type", e.target.value)}
                      className="bg-white/5 border border-white/20 text-white rounded-lg px-3 py-2 w-full sm:w-1/3 focus:ring-2 focus:ring-[#FFE01B]"
                    >
                      <option value="hour">Per Hour</option>
                      <option value="video">Per Video</option>
                      <option value="day">Per Day</option>
                      <option value="month">Per Month</option>
                      <option value="project">Per Project</option>
                    </select>
                  </div>
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
            </div>

            <div className="space-y-6 md:space-y-4">
              <div>
                <label className="text-white/70 text-sm mb-2 flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  Scope Of Work
                </label>
                <Textarea
                  value={formData.scope}
                  onChange={(e) => handleInputChange("scope", e.target.value)}
                  className="bg-white/5 border-white/20 text-white transition-all duration-200 focus:ring-2 focus:ring-[#FFE01B] min-h-[80px]"
                  placeholder="Describe Scope of Work"
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
                    onClick={() => onGenerateAITerms("freelancer")}
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
                  className="bg-white/5 border-white/20 text-white transition-all duration-200 focus:ring-2 focus:ring-[#FFE01B] min-h-[200px] font-mono text-sm"
                  placeholder="Enter terms and conditions"
                />
              </div>
            </div>
            <div className="flex gap-3 md:gap-4">
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
    </div>
  )
}