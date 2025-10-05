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
  hourly_rate: string
  project_duration: string
}

interface FreelancerAgreementFormProps {
  onSubmitAction: (data: FreelancerAgreementFormData) => Promise<void>
  loading: boolean
  onGenerateAITerms: (type: "freelancer") => Promise<void>
  aiLoading: boolean
}

const DEFAULT_FREELANCER_TERMS = `Professional Conduct & Communication
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
    hourly_rate: "",
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
      hourly_rate: "",
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
                  className="bg-white/5 border-white/20 text-white transition-all duration-200 focus:ring-2 focus:ring-[#FFE01B] min-h-[200px]"
                  placeholder="Enter terms and conditions"
                />
              </div>
            </div>
            <div className="flex gap-3 md:gap-4 w-12">
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
