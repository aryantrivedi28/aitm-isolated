"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Send, CheckCircle, Clock, AlertCircle, ExternalLink, RefreshCw } from "lucide-react"

interface SignatureStatusProps {
  documentId: string
  documentType: "client" | "freelancer" | "invoice"
  status: string
  docusealEnvelopeId?: string
  signerEmail?: string
  signerName?: string
  onStatusUpdate?: (newStatus: string) => void
}

export function SignatureStatus({
  documentId,
  documentType,
  status,
  docusealEnvelopeId,
  signerEmail,
  signerName,
  onStatusUpdate,
}: SignatureStatusProps) {
  const [loading, setLoading] = useState(false)
  const [signingStatus, setSigningStatus] = useState<any>(null)

  const sendForSignature = async () => {
    if (!signerEmail || !signerName) {
      alert("Signer email and name are required")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/docuseal/send-for-signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId,
          documentType,
          signerEmail,
          signerName,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        onStatusUpdate?.("sent")
        alert("Document sent for signature successfully!")
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error("Error sending for signature:", error)
      alert("Failed to send document for signature")
    } finally {
      setLoading(false)
    }
  }

  const checkStatus = async () => {
    if (!docusealEnvelopeId) return

    setLoading(true)
    try {
      const response = await fetch(`/api/docuseal/status?submissionId=${docusealEnvelopeId}`)
      const data = await response.json()

      if (response.ok) {
        setSigningStatus(data)
        if (data.status !== status) {
          onStatusUpdate?.(data.status)
        }
      }
    } catch (error) {
      console.error("Error checking status:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (docusealEnvelopeId && (status === "sent" || status === "pending")) {
      checkStatus()
      // Poll for status updates every 30 seconds
      const interval = setInterval(checkStatus, 30000)
      return () => clearInterval(interval)
    }
  }, [docusealEnvelopeId, status])

  const getStatusIcon = (currentStatus: string) => {
    switch (currentStatus) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "sent":
        return <Send className="w-4 h-4" />
      case "signed":
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "expired":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusColor = (currentStatus: string) => {
    switch (currentStatus) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "sent":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "signed":
      case "completed":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "expired":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  return (
    <Card className="bg-white/5 backdrop-blur-sm border-white/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Signature Status</h3>
          <Badge className={getStatusColor(status)}>
            {getStatusIcon(status)}
            <span className="ml-1 capitalize">{status}</span>
          </Badge>
        </div>

        {status === "pending" && (
          <div className="space-y-4">
            <p className="text-white/70 text-sm">
              Ready to send for signature. Make sure the document PDF has been generated first.
            </p>
            <Button
              onClick={sendForSignature}
              disabled={loading}
              className="bg-[#FFE01B] text-black hover:bg-[#FFE01B]/90"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send for Signature
                </>
              )}
            </Button>
          </div>
        )}

        {status === "sent" && (
          <div className="space-y-4">
            <p className="text-white/70 text-sm">
              Document sent to {signerEmail} for signature. Waiting for completion.
            </p>
            <Button
              onClick={checkStatus}
              disabled={loading}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 bg-transparent"
            >
              {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
              Check Status
            </Button>
          </div>
        )}

        {(status === "signed" || status === "completed") && (
          <div className="space-y-4">
            <p className="text-white/70 text-sm">
              Document successfully signed by {signerEmail}
              {signingStatus?.completedAt && (
                <span> on {new Date(signingStatus.completedAt).toLocaleDateString()}</span>
              )}
            </p>
            {signingStatus?.auditTrailUrl && (
              <Button
                onClick={() => window.open(signingStatus.auditTrailUrl, "_blank")}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Audit Trail
              </Button>
            )}
          </div>
        )}

        {status === "expired" && (
          <div className="space-y-4">
            <p className="text-white/70 text-sm">
              Signature request has expired. You can resend the document for signature.
            </p>
            <Button
              onClick={sendForSignature}
              disabled={loading}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 bg-transparent"
            >
              <Send className="w-4 h-4 mr-2" />
              Resend for Signature
            </Button>
          </div>
        )}

        {signingStatus?.submitters && signingStatus.submitters.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <h4 className="text-sm font-semibold text-white mb-2">Signers</h4>
            <div className="space-y-2">
              {signingStatus.submitters.map((submitter: any, index: number) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-white/70">
                    {submitter.name} ({submitter.email})
                  </span>
                  <Badge className={getStatusColor(submitter.status)}>{submitter.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
