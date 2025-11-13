"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, CheckCircle, Clock } from "lucide-react"

const fetcher = (url: string) => fetch(url, { credentials: "include" }).then((res) => res.json())

export default function ApplyFormPage() {
  const router = useRouter()
  const params = useParams()
  const formId = params.id as string

  const [isClient, setIsClient] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const [email, setEmail] = useState("")
  const [emailVerified, setEmailVerified] = useState(false)
  const [verificationStep, setVerificationStep] = useState<"email" | "otp" | "form">("email")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const [verifyError, setVerifyError] = useState("")
  const [otpTimer, setOtpTimer] = useState(0)

  const { data, error: fetchError, isLoading } = useSWR(`/api/form/${formId}`, fetcher)

  useEffect(() => setIsClient(true), [])

  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [otpTimer])

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setOtpLoading(true)
    setVerifyError("")

    try {
      const response = await fetch("/api/freelancer/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        credentials: "include",
      })

      const data = await response.json()
      if (!response.ok) {
        setVerifyError(data.error || "Failed to send OTP")
        return
      }

      setOtpSent(true)
      setOtpTimer(300) // 5 minutes timer
      setVerificationStep("otp")
    } catch (err) {
      setVerifyError("Failed to send OTP. Please try again.")
      console.error(err)
    } finally {
      setOtpLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setOtpLoading(true)
    setVerifyError("")

    try {
      const response = await fetch("/api/freelancer/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
        credentials: "include",
      })

      const data = await response.json()
      if (!response.ok) {
        setVerifyError(data.error || "Invalid OTP")
        return
      }

      setEmailVerified(true)
      setVerificationStep("form")
    } catch (err) {
      setVerifyError("Failed to verify OTP. Please try again.")
      console.error(err)
    } finally {
      setOtpLoading(false)
    }
  }

  const handleAnswerChange = (fieldId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [fieldId]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailVerified) {
      setError("Please verify your email first")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/freelancer/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formId, answers, email }),
        credentials: "include",
      })

      const resData = await response.json()
      if (!response.ok) {
        setError(resData.error || "Failed to submit form")
        return
      }

      router.push("/get-hired/freelancer/dashboard")
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (!isClient || isLoading) return <div className="p-10 text-center">Loading form...</div>
  if (fetchError || data?.error) return <div className="p-10 text-center text-red-600">Error loading form.</div>

  const form = data?.form
  if (!form) return <div className="p-10 text-center">Form not found.</div>

  const allFields = [
    ...(form.required_fields || []).map((f: string) => ({
      id: f,
      label: f.replace(/_/g, " "),
      type: "text",
      required: true,
    })),
    ...(form.custom_questions || []).map((q: any) => ({
      id: q.id || q.label,
      label: q.label,
      type: q.type || "text",
      options: q.options || [],
      required: q.required || false,
    })),
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Apply to Opportunity</h1>
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {!emailVerified && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Step 1: Verify Your Email
              </CardTitle>
              <CardDescription>We'll send you an OTP to verify your email address</CardDescription>
            </CardHeader>
            <CardContent>
              {verifyError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                  {verifyError}
                </div>
              )}

              {verificationStep === "email" && (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="your@email.com"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <Button type="submit" disabled={otpLoading} className="w-full">
                    {otpLoading ? "Sending OTP..." : "Send OTP"}
                  </Button>
                </form>
              )}

              {verificationStep === "otp" && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="p-3 bg-blue-100 border border-blue-300 rounded-md text-sm text-blue-700">
                    OTP has been sent to <strong>{email}</strong>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Enter OTP</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      placeholder="000000"
                      maxLength={6}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="w-4 h-4" />
                    OTP expires in {Math.floor(otpTimer / 60)}:{String(otpTimer % 60).padStart(2, "0")}
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={otpLoading} className="flex-1">
                      {otpLoading ? "Verifying..." : "Verify OTP"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setVerificationStep("email")
                        setOtp("")
                        setOtpSent(false)
                      }}
                    >
                      Back
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        )}

        {emailVerified && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                Email Verified
              </CardTitle>
              <CardDescription>{email}</CardDescription>
            </CardHeader>
          </Card>
        )}

        <Card className={emailVerified ? "" : "opacity-50 pointer-events-none"}>
          <CardHeader>
            <CardTitle className="text-2xl">{form.title}</CardTitle>
            <CardDescription>{form.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {allFields.map((field) => (
                <div key={field.id}>
                  <label className="block text-sm font-medium mb-2">
                    {field.label}
                    {field.required && <span className="text-red-500">*</span>}
                  </label>

                  {field.type === "text" && (
                    <input
                      type="text"
                      value={answers[field.id] || ""}
                      onChange={(e) => handleAnswerChange(field.id, e.target.value)}
                      required={field.required}
                      disabled={!emailVerified}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  )}

                  {field.type === "textarea" && (
                    <textarea
                      value={answers[field.id] || ""}
                      onChange={(e) => handleAnswerChange(field.id, e.target.value)}
                      required={field.required}
                      disabled={!emailVerified}
                      rows={4}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  )}

                  {field.type === "select" && (
                    <select
                      value={answers[field.id] || ""}
                      onChange={(e) => handleAnswerChange(field.id, e.target.value)}
                      required={field.required}
                      disabled={!emailVerified}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Select an option</option>
                      {field.options?.map((option: string) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}

              <Button type="submit" disabled={loading || !emailVerified} className="w-full">
                {loading ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
