"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileText, CheckCircle2, Sparkles, ArrowRight, X, Loader2, Zap, Shield } from "lucide-react"

type OnboardingStep = "upload" | "processing" | "error"

export default function ResumeUploadPage() {
  const router = useRouter()
  const [step, setStep] = useState<OnboardingStep>("upload")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [resume, setResume] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)

  const uploadFile = async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("type", "resume")

    const response = await fetch("/api/freelancer/upload-file", {
      method: "POST",
      body: formData,
      credentials: "include",
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.error || "File upload failed")
    return data.fileUrl
  }

  // AI Parse helper
  const safeArray = (v: any) => {
    if (!v) return []
    if (Array.isArray(v)) return v
    try {
      const parsed = JSON.parse(v)
      return Array.isArray(parsed) ? parsed : [parsed]
    } catch {
      return [v]
    }
  }

  const handleOnboarding = async () => {
    if (!resume) return
    setLoading(true)
    setProgress(10)
    setStep("processing")

    try {
      const resumeUrl = await uploadFile(resume)
      setProgress(50)

      const resp = await fetch("/api/freelancer/parse-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ fileUrl: resumeUrl }),
      })

      const data = await resp.json()
      if (!resp.ok) throw new Error(data.error)
      const parsed = data.profile || data

      setProgress(80)

      const payload = {
        name: parsed.name || "",
        title: parsed.title || "",
        bio: parsed.bio || "",
        skills: safeArray(parsed.skills),
        resume_url: resumeUrl,
        profile_completed: false,
      }

      const saveResp = await fetch("/api/freelancer/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      })

      const saveData = await saveResp.json()
      if (!saveResp.ok) throw new Error(saveData.error)

      setProgress(100)

      setTimeout(() => router.push("/get-hired/freelancer/onboarding-details"), 1500)
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : "Unexpected error occurred.")
      setStep("error")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: "#fbf5e5" }}>
      <Card className="w-full max-w-3xl border-2 shadow-xl" style={{ borderColor: "#FFE01B" }}>
        <CardHeader className="text-center border-b" style={{ borderBottomColor: "#FFE01B" }}>
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full" style={{ backgroundColor: "#FFE01B" }}>
              <Sparkles className="h-6 w-6" style={{ color: "#241C15" }} />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold" style={{ color: "#241C15" }}>
            Upload Your Resume
          </CardTitle>
          <CardDescription className="text-sm" style={{ color: "#241C15", opacity: 0.6 }}>
            We’ll analyze your experience and create your profile for you.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 space-y-8">
          {step === "upload" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                <div className="p-4 rounded-lg" style={{ backgroundColor: "#fbf5e5" }}>
                  <Zap className="mx-auto h-5 w-5" style={{ color: "#FFE01B" }} />
                  <p className="text-xs mt-2">AI Powered Parsing</p>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: "#fbf5e5" }}>
                  <Shield className="mx-auto h-5 w-5" style={{ color: "#FFE01B" }} />
                  <p className="text-xs mt-2">Safe & Secure</p>
                </div>
              </div>

              {/* Upload box */}
              <div
                className="border-2 border-dashed rounded-xl p-8 text-center relative"
                style={{ borderColor: resume ? "#FFE01B" : "#e5e7eb", backgroundColor: resume ? "#fbf5e5" : "#fff" }}
              >
                <input
                  type="file"
                  className="hidden"
                  id="resume-upload"
                  onChange={(e) => {
                    setResume(e.target.files?.[0] || null)
                    if (e.target.files?.[0]) setProgress(100)
                  }}
                />

                <label htmlFor="resume-upload" className="block cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-3" style={{ color: "#241C15" }} />
                  {resume ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 mx-auto mb-2" style={{ color: "#FFE01B" }} />
                      <p className="font-medium text-sm">{resume.name}</p>
                      <p className="text-xs opacity-60">Click to replace</p>
                    </>
                  ) : (
                    <>
                      <p className="font-medium text-sm">Click to select resume</p>
                      <p className="text-xs opacity-60">PDF or DOC (max 3MB)</p>
                    </>
                  )}
                </label>

                {resume && (
                  <button
                    onClick={() => {
                      setResume(null)
                      setProgress(0)
                    }}
                    className="absolute top-3 right-3 p-1 rounded-full hover:bg-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {progress > 0 && (
                <>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: "#241C15" }}>Progress</span>
                    <span style={{ color: "#241C15" }}>{progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#fbf5e5]">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${progress}%`, backgroundColor: "#FFE01B" }}
                    />
                  </div>
                </>
              )}

              <Button
                disabled={!resume || loading}
                onClick={handleOnboarding}
                className="w-full py-5 text-base font-semibold"
                style={{ backgroundColor: "#FFE01B", color: "#241C15" }}
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <>Continue <ArrowRight className="h-5 w-5 ml-1" /></>}
              </Button>
            </>
          )}

          {step === "processing" && (
            <div className="text-center space-y-5 py-10">
              <Loader2 className="animate-spin h-12 w-12 mx-auto" style={{ color: "#FFE01B" }} />
              <p className="text-sm opacity-70">Analyzing your resume...</p>
            </div>
          )}

          {step === "error" && (
            <div className="text-center space-y-5 py-10">
              <p className="text-red-600 font-medium">❌ {error}</p>
              <Button
                onClick={() => {
                  setStep("upload")
                  setError("")
                }}
                style={{ backgroundColor: "#FFE01B", color: "#241C15" }}
              >
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
