// components/calendly-meeting-modal.tsx
"use client"

import { useEffect, useState } from "react"
import { X, Calendar, Clock } from "lucide-react"

interface CalendlyMeetingModalProps {
  isOpen: boolean
  onClose: () => void
  freelancerName: string
  freelancerEmail: string
  formId: string
  submissionId: string
}

export default function CalendlyMeetingModal({
  isOpen,
  onClose,
  freelancerName,
  freelancerEmail,
  formId,
  submissionId
}: CalendlyMeetingModalProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isOpen) return

    // Load Calendly script only when modal is open
    const existingScript = document.querySelector(
      'script[src="https://assets.calendly.com/assets/external/widget.js"]'
    )
    if (!existingScript) {
      const script = document.createElement("script")
      script.src = "https://assets.calendly.com/assets/external/widget.js"
      script.async = true
      document.body.appendChild(script)

      script.onload = () => {
        initCalendlyWidget()
      }

      return () => {
        // Remove Calendly iframe when modal closes
        const iframe = document.querySelector(".calendly-inline-widget iframe")
        if (iframe && iframe.parentNode) iframe.parentNode.removeChild(iframe)
      }
    } else {
      initCalendlyWidget()
    }
  }, [isOpen])

  const initCalendlyWidget = () => {
    const calendlyDiv = document.querySelector(".calendly-inline-widget") as HTMLElement | null
    if (!calendlyDiv) return

    // Add your Calendly link and theme customization here
    calendlyDiv.setAttribute(
      "data-url",
      `https://calendly.com/aryan-getfinzie?background_color=fbf5e4&text_color=241c15&primary_color=ffe01d&hide_event_type_details=1&hide_gdpr_banner=1`
    )

    setIsLoading(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border-2 border-[#241C15]/10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-[#241C15]/10 bg-gradient-to-r from-[#FFE01B] to-[#FCD34D]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl">
              <Calendar className="w-6 h-6 text-[#241C15]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#241C15]">
                Schedule Meeting with {freelancerName}
              </h2>
              <p className="text-sm text-[#241C15]/70 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Please book at least 4 hours in advance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/20 transition-all"
          >
            <X className="w-6 h-6 text-[#241C15]" />
          </button>
        </div>

        {/* Calendly Widget */}
        <div className="h-[600px] bg-[#fbf5e5] relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#fbf5e5]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFE01B] mx-auto mb-4"></div>
                <p className="text-[#241C15]/70">Loading scheduling calendar...</p>
              </div>
            </div>
          )}

          <div
            className="calendly-inline-widget h-full w-full"
            data-url=""
            style={{ minWidth: "320px" }}
          />
        </div>
      </div>
    </div>
  )
}
