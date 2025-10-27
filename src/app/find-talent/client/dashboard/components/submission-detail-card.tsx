"use client"

import {
  Mail,
  Phone,
  FileText,
  Github,
  Briefcase,
  ExternalLink,
  Star,
  Calendar,
  Award,
  Download,
  Copy,
  CheckCircle,
} from "lucide-react"
import { useState } from "react"

interface SubmissionDetailCardProps {
  submission: any
  formName: string
  onClose?: () => void
}

export function SubmissionDetailCard({ submission, formName, onClose }: SubmissionDetailCardProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-[#241C15]/10 overflow-hidden shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FFE01B]/10 to-[#FCD34D]/10 border-b-2 border-[#241C15]/10 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h3 className="text-xl sm:text-2xl font-black text-[#241C15] mb-1">{submission.name}</h3>
            <p className="text-sm text-[#241C15]/70 font-semibold">{formName}</p>
          </div>
          {submission.profile_rating && (
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border-2 border-[#FFE01B]/30">
              <Star className="w-5 h-5 text-[#FFE01B] fill-current" />
              <span className="font-black text-[#241C15]">{submission.profile_rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1.5 bg-green-500/20 text-green-700 rounded-lg text-xs font-bold border border-green-500/30">
            Submitted
          </span>
          <span className="px-3 py-1.5 bg-[#FFE01B]/20 text-[#241C15] rounded-lg text-xs font-bold border border-[#FFE01B]/30">
            {formatDate(submission.created_at)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6 space-y-6">
        {/* Contact Information */}
        <div>
          <h4 className="text-sm font-black text-[#241C15] mb-4 flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Contact Information
          </h4>
          <div className="space-y-3">
            {/* Email */}
            <div className="flex items-center justify-between p-3 bg-[#fbf5e5] rounded-xl border border-[#241C15]/10 hover:border-[#FFE01B]/50 transition-all">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Mail className="w-4 h-4 text-[#241C15]/60 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-[#241C15]/60 font-semibold">Email</p>
                  <p className="text-sm font-bold text-[#241C15] truncate">{submission.email}</p>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(submission.email)}
                className="ml-2 p-2 hover:bg-white rounded-lg transition-all flex-shrink-0"
              >
                {copied ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-[#241C15]/60" />
                )}
              </button>
            </div>

            {/* Phone */}
            {submission.phone && (
              <div className="flex items-center justify-between p-3 bg-[#fbf5e5] rounded-xl border border-[#241C15]/10 hover:border-[#FFE01B]/50 transition-all">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Phone className="w-4 h-4 text-[#241C15]/60 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-[#241C15]/60 font-semibold">Phone</p>
                    <p className="text-sm font-bold text-[#241C15] truncate">{submission.phone}</p>
                  </div>
                </div>
                <a
                  href={`tel:${submission.phone}`}
                  className="ml-2 p-2 hover:bg-white rounded-lg transition-all flex-shrink-0"
                >
                  <ExternalLink className="w-4 h-4 text-[#FFE01B]" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Professional Information */}
        <div>
          <h4 className="text-sm font-black text-[#241C15] mb-4 flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Professional Information
          </h4>
          <div className="space-y-3">
            {/* Years of Experience */}
            {submission.years_experience !== null && submission.years_experience !== undefined && (
              <div className="p-3 bg-[#fbf5e5] rounded-xl border border-[#241C15]/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#FFE01B]" />
                    <span className="text-xs text-[#241C15]/60 font-semibold">Years of Experience</span>
                  </div>
                  <span className="text-sm font-black text-[#241C15]">{submission.years_experience} years</span>
                </div>
              </div>
            )}

            {/* Resume Link */}
            {submission.resume_link && (
              <a
                href={submission.resume_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-gradient-to-r from-[#FFE01B]/10 to-[#FCD34D]/10 rounded-xl border-2 border-[#FFE01B]/30 hover:border-[#FFE01B] hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-[#FFE01B] group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-bold text-[#241C15]">View Resume</span>
                </div>
                <ExternalLink className="w-4 h-4 text-[#FFE01B] group-hover:translate-x-1 transition-transform" />
              </a>
            )}

            {/* Portfolio Link */}
            {submission.portfolio_link && (
              <a
                href={submission.portfolio_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-gradient-to-r from-[#FFE01B]/10 to-[#FCD34D]/10 rounded-xl border-2 border-[#FFE01B]/30 hover:border-[#FFE01B] hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Briefcase className="w-4 h-4 text-[#FFE01B] group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-bold text-[#241C15]">View Portfolio</span>
                </div>
                <ExternalLink className="w-4 h-4 text-[#FFE01B] group-hover:translate-x-1 transition-transform" />
              </a>
            )}

            {/* GitHub Link */}
            {submission.github_link && (
              <a
                href={submission.github_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-gradient-to-r from-[#FFE01B]/10 to-[#FCD34D]/10 rounded-xl border-2 border-[#FFE01B]/30 hover:border-[#FFE01B] hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Github className="w-4 h-4 text-[#FFE01B] group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-bold text-[#241C15]">View GitHub</span>
                </div>
                <ExternalLink className="w-4 h-4 text-[#FFE01B] group-hover:translate-x-1 transition-transform" />
              </a>
            )}

            {/* Proposal Link */}
            {submission.proposal_link && (
              <a
                href={submission.proposal_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-gradient-to-r from-[#FFE01B]/10 to-[#FCD34D]/10 rounded-xl border-2 border-[#FFE01B]/30 hover:border-[#FFE01B] hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Download className="w-4 h-4 text-[#FFE01B] group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-bold text-[#241C15]">View Proposal</span>
                </div>
                <ExternalLink className="w-4 h-4 text-[#FFE01B] group-hover:translate-x-1 transition-transform" />
              </a>
            )}
          </div>
        </div>

        {/* Custom Responses */}
        {submission.custom_responses && Object.keys(submission.custom_responses).length > 0 && (
          <div>
            <h4 className="text-sm font-black text-[#241C15] mb-4">Additional Information</h4>
            <div className="space-y-2">
              {Object.entries(submission.custom_responses).map(([key, value]: [string, any]) => (
                <div key={key} className="p-3 bg-[#fbf5e5] rounded-xl border border-[#241C15]/10">
                  <p className="text-xs text-[#241C15]/60 font-semibold mb-1 capitalize">{key}</p>
                  <p className="text-sm text-[#241C15] font-medium">{String(value)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="pt-4 border-t-2 border-[#241C15]/10">
          <div className="flex items-center justify-between text-xs text-[#241C15]/60 font-semibold">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Submitted {formatDate(submission.created_at)}</span>
            </div>
            {submission.updated_at && <span>Updated {formatDate(submission.updated_at)}</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
