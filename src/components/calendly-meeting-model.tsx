"use client"

import { useEffect, useState, useRef } from "react"
import { X, Calendar, Clock, Copy, Check, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

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
  const [copied, setCopied] = useState(false)
  const calendlyRef = useRef<HTMLDivElement>(null)
  
  // Generate the Calendly URL with custom parameters
  const calendlyBaseUrl = "https://calendly.com/aryan-getfinzie"
  const calendlyUrl = `${calendlyBaseUrl}?background_color=fbf5e4&text_color=241c15&primary_color=ffe01d&hide_event_type_details=1&hide_gdpr_banner=1&name=${encodeURIComponent(freelancerName)}&email=${encodeURIComponent(freelancerEmail)}&a1=${submissionId}&a2=${formId}&a3=${freelancerEmail}`

  const copyCalendlyUrl = () => {
    navigator.clipboard.writeText(calendlyUrl)
    setCopied(true)
    toast.success("Calendly link copied to clipboard!")
    setTimeout(() => setCopied(false), 2000)
  }

  const openInNewTab = () => {
    window.open(calendlyUrl, '_blank', 'noopener,noreferrer')
  }

  useEffect(() => {
    if (!isOpen) return

    const loadCalendlyScript = () => {
      const existingScript = document.querySelector(
        'script[src="https://assets.calendly.com/assets/external/widget.js"]'
      )
      
      if (!existingScript) {
        const script = document.createElement("script")
        script.src = "https://assets.calendly.com/assets/external/widget.js"
        script.async = true
        
        script.onload = () => {
          initCalendlyWidget()
        }
        
        document.body.appendChild(script)
      } else {
        // If script already loaded, initialize immediately
        if ((window as any).Calendly) {
          initCalendlyWidget()
        } else {
          // Wait for script to load
          const checkCalendly = setInterval(() => {
            if ((window as any).Calendly) {
              clearInterval(checkCalendly)
              initCalendlyWidget()
            }
          }, 100)
        }
      }
    }

    loadCalendlyScript()

    // Cleanup function
    return () => {
      // Remove any existing Calendly iframe
      const iframe = document.querySelector(".calendly-inline-widget iframe")
      if (iframe && iframe.parentNode) {
        iframe.parentNode.removeChild(iframe)
      }
    }
  }, [isOpen, calendlyUrl, freelancerName, freelancerEmail, formId, submissionId])

  const initCalendlyWidget = () => {
    const calendlyDiv = calendlyRef.current
    if (!calendlyDiv || !(window as any).Calendly) {
      console.error('Calendly widget or div not found')
      return
    }

    try {
      // Clear any existing iframe
      while (calendlyDiv.firstChild) {
        calendlyDiv.removeChild(calendlyDiv.firstChild)
      }

      // Initialize Calendly widget using the proper method
      (window as any).Calendly.initInlineWidget({
        url: calendlyUrl,
        parentElement: calendlyDiv,
        prefill: {
          name: freelancerName,
          email: freelancerEmail,
          customAnswers: {
            a1: submissionId,
            a2: formId,
            a3: freelancerEmail
          }
        },
        utm: {
          utmSource: "Finzie",
          utmMedium: "freelancer_applications",
          utmCampaign: "intro_meeting"
        }
      })

      setIsLoading(false)
    } catch (error) {
      console.error('Error initializing Calendly widget:', error)
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden border-2 border-[#241C15]/10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-[#241C15]/10 bg-gradient-to-r from-[#FFE01B] to-[#FCD34D]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl">
              <Calendar className="w-6 h-6 text-[#241C15]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#241C15]">
                Schedule Introductory Meeting
              </h2>
              <p className="text-sm text-[#241C15]/70 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Select your preferred time slot (30-minute meeting)
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

        <div className="flex flex-col lg:flex-row">
          {/* Left Side - Meeting Details */}
          <div className="lg:w-1/3 p-6 border-r border-[#241C15]/10 bg-[#fbf5e5]">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-[#241C15] mb-3">Meeting Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#FFE01B] rounded-full"></div>
                    <span className="text-sm text-[#241C15]/70">Duration: 30 minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#FFE01B] rounded-full"></div>
                    <span className="text-sm text-[#241C15]/70">Format: Video Call</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#FFE01B] rounded-full"></div>
                    <span className="text-sm text-[#241C15]/70">Platform: Google Meet</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-[#241C15] mb-3">What to Expect</h3>
                <ul className="space-y-2 text-sm text-[#241C15]/70">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-[#FFE01B] rounded-full mt-1.5"></div>
                    <span>Project overview and requirements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-[#FFE01B] rounded-full mt-1.5"></div>
                    <span>Your experience and qualifications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-[#FFE01B] rounded-full mt-1.5"></div>
                    <span>Next steps and timeline</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-[#FFE01B] rounded-full mt-1.5"></div>
                    <span>Q&A session</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-[#241C15] mb-3">Share Link</h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={calendlyUrl}
                      readOnly
                      className="flex-1 px-3 py-2 text-sm border border-[#241C15]/20 rounded-lg bg-white"
                    />
                    <Button
                      onClick={copyCalendlyUrl}
                      variant="outline"
                      className="whitespace-nowrap"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <Button
                    onClick={openInNewTab}
                    className="w-full"
                    variant="outline"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open in New Tab
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Calendly Widget */}
          <div className="lg:w-2/3 h-[600px] relative bg-white">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#fbf5e5]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFE01B] mx-auto mb-4"></div>
                  <p className="text-[#241C15]/70">Loading scheduling calendar...</p>
                </div>
              </div>
            )}

            <div
              ref={calendlyRef}
              className="calendly-inline-widget h-full w-full"
              data-url={calendlyUrl}
              style={{ minWidth: "320px" }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#241C15]/10 bg-white">
          <div className="flex justify-between items-center">
            <p className="text-sm text-[#241C15]/60">
              After scheduling, you'll receive a confirmation email with the meeting link
            </p>
            <Button
              onClick={onClose}
              variant="ghost"
              className="text-[#241C15] hover:bg-[#fbf5e5]"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}