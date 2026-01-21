"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, User, FileText, CheckCircle2, Sparkles, ArrowRight, X, Loader2, Shield, Zap, AlertCircle } from "lucide-react"

type OnboardingStep = "upload" | "processing" | "error"

// File validation function
const validateFile = (file: File, type: "resume" | "photo"): string | null => {
  if (type === "resume") {
    const validTypes = ['.pdf', '.doc', '.docx']
    const maxSize = 3 * 1024 * 1024 // 3MB
    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase()
    
    if (!validTypes.includes(fileExt)) {
      return 'Invalid file type. Please upload PDF, DOC, or DOCX files.'
    }
    if (file.size > maxSize) {
      return 'File size exceeds 3MB limit.'
    }
  } else {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    const maxSize = 5 * 1024 * 1024 // 5MB
    
    if (!validTypes.includes(file.type)) {
      return 'Invalid image type. Please upload JPG, PNG, or GIF files.'
    }
    if (file.size > maxSize) {
      return 'Image size exceeds 5MB limit.'
    }
  }
  return null
}

export default function FreelancerOnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<OnboardingStep>("upload")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<{ message: string; details?: string } | null>(null)
  const [resume, setResume] = useState<File | null>(null)
  const [photo, setPhoto] = useState<File | null>(null)
  const [progress, setProgress] = useState({ resume: 0, photo: 0 })
  const [uploadedFiles, setUploadedFiles] = useState({ resume: false, photo: false })
  const [uploadedUrls, setUploadedUrls] = useState<{ resume: string | null; photo: string | null }>({ resume: null, photo: null })

  // File uploader with better error handling
  const uploadFile = useCallback(async (file: File, type: "resume" | "photo"): Promise<string> => {
    const validationError = validateFile(file, type)
    if (validationError) {
      throw new Error(validationError)
    }

    const formData = new FormData()
    formData.append("file", file)
    formData.append("type", type)

    const response = await fetch("/api/freelancer/upload-file", {
      method: "POST",
      body: formData,
      credentials: "include",
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `Failed to upload ${type}`)
    }

    const data = await response.json()
    if (!data.fileUrl) {
      throw new Error(`No file URL returned for ${type}`)
    }

    return data.fileUrl
  }, [])

  // Safe array helper
  const safeArray = useCallback((val: any): any[] => {
    if (!val) return []
    if (Array.isArray(val)) return val
    try {
      const parsed = JSON.parse(val)
      return Array.isArray(parsed) ? parsed : [parsed]
    } catch {
      return [val]
    }
  }, [])

  // Handle file selection with validation
  const handleFileSelect = useCallback(async (file: File | null, type: "resume" | "photo") => {
    if (!file) {
      removeFile(type)
      return
    }

    // Validate file
    const validationError = validateFile(file, type)
    if (validationError) {
      setError({ message: `Invalid ${type}: ${validationError}` })
      return
    }

    setError(null)
    
    if (type === "resume") {
      setResume(file)
      setProgress(prev => ({ ...prev, resume: 0 }))
      setUploadedFiles(prev => ({ ...prev, resume: false }))
    } else {
      setPhoto(file)
      setProgress(prev => ({ ...prev, photo: 0 }))
      setUploadedFiles(prev => ({ ...prev, photo: false }))
    }

    // Upload file immediately
    try {
      const url = await uploadFile(file, type)
      setUploadedUrls(prev => ({ ...prev, [type]: url }))
      setUploadedFiles(prev => ({ ...prev, [type]: true }))
      setProgress(prev => ({ ...prev, [type]: 100 }))
    } catch (err) {
      setError({ 
        message: `Failed to upload ${type}`, 
        details: err instanceof Error ? err.message : 'Unknown error' 
      })
      removeFile(type)
    }
  }, [uploadFile])

  const removeFile = useCallback((type: "resume" | "photo") => {
    if (type === "resume") {
      setResume(null)
      setUploadedFiles(prev => ({ ...prev, resume: false }))
      setUploadedUrls(prev => ({ ...prev, resume: null }))
      setProgress(prev => ({ ...prev, resume: 0 }))
    } else {
      setPhoto(null)
      setUploadedFiles(prev => ({ ...prev, photo: false }))
      setUploadedUrls(prev => ({ ...prev, photo: null }))
      setProgress(prev => ({ ...prev, photo: 0 }))
    }
  }, [])

  // Main onboarding handler
  const handleOnboarding = async () => {
    if (!resume || !photo) {
      setError({ message: "Please upload both resume and profile photo" })
      return
    }

    if (!uploadedUrls.resume || !uploadedUrls.photo) {
      setError({ message: "Files are still uploading. Please wait." })
      return
    }

    setLoading(true)
    setError(null)
    setStep("processing")

    try {
      setProgress({ resume: 10, photo: 10 })

      // Step 3: Parse resume via AI
      const parseResponse = await fetch("/api/freelancer/parse-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileUrl: uploadedUrls.resume }),
        credentials: "include",
      })

      if (!parseResponse.ok) {
        const errorData = await parseResponse.json()
        throw new Error(JSON.stringify(errorData) || `Failed to parse resume: ${parseResponse.status}`)
      }

      const parseData = await parseResponse.json()
      const parsed = parseData.profile || parseData

      setProgress({ resume: 60, photo: 60 })

      // Validate required fields
      if (!parsed.name || !parsed.email) {
        console.warn("Missing required fields from parsed resume, using defaults")
      }

      // Step 4: Merge all parsed data for DB
      const payload = {
        name: parsed.name || "",
        email: parsed.email || "",
        phone: parsed.phone || "",
        title: parsed.title || "Freelancer",
        bio: parsed.bio || `Experienced freelancer with ${parsed.experience_years || 0} years of experience`,
        skills: safeArray(parsed.skills),
        experience_years: parsed.experience_years ?? 0,
        profile_rating: parsed.profile_rating ?? null,
        rating_feedback: safeArray(parsed.rating_feedback),
        portfolio_url: parsed.portfolio_url || parsed.portfolio || null,
        github_url: parsed.github_url || parsed.github || null,
        linkedin_url: parsed.linkedin_url || null,
        twitter_url: parsed.twitter_url || null,
        education: safeArray(parsed.education),
        graduation_year: parsed.graduation_year ?? null,
        projects: Array.isArray(parsed.projects) ? parsed.projects : [],
        certifications: safeArray(parsed.certifications),
        work_experience: Array.isArray(parsed.work_experience)
          ? parsed.work_experience.map((w: any) => ({
              id: crypto.randomUUID(),
              role: w.role || "",
              company: w.company || "",
              location: w.location || "",
              startDate: w.start_date || w.startDate || "",
              endDate: w.end_date || w.endDate || "",
              current: !w.end_date || /present|current|now/i.test(w.end_date || w.endDate || ""),
              description: w.description || "",
              achievements: Array.isArray(w.achievements) ? w.achievements : [],
            }))
          : [],
        resume_url: uploadedUrls.resume,
        photo_url: uploadedUrls.photo,
        profile_completed: true,
        availability: "full-time",
      }

      setProgress({ resume: 80, photo: 80 })

      const saveResponse = await fetch("/api/freelancer/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      })

      const saveData = await saveResponse.json()
      if (!saveResponse.ok) {
        throw new Error(saveData.error || `Failed to save profile: ${saveResponse.status}`)
      }

      setProgress({ resume: 100, photo: 100 })

      // Success - redirect to dashboard
      setTimeout(() => {
        router.push("/get-hired/freelancer/dashboard")
      }, 1500)

    } catch (err) {
      console.error("[Onboarding Error]", err)
      let errorMessage = "Unexpected error occurred."
      let errorDetails = ""
      
      try {
        if (err instanceof Error) {
          const errorData = JSON.parse(err.message)
          errorMessage = errorData.error || errorData.message || err.message
          errorDetails = errorData.details || errorData.code || ""
        }
      } catch {
        errorMessage = err instanceof Error ? err.message : "Unexpected error occurred."
      }
      
      setError({ 
        message: errorMessage, 
        details: errorDetails 
      })
      setStep("error")
    } finally {
      setLoading(false)
    }
  }

  // Processing State Component
  const ProcessingStep = () => (
    <div className="text-center space-y-6 py-8">
      <div className="relative inline-block">
        <Loader2 className="h-16 w-16 animate-spin" style={{ color: '#FFE01B' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="h-8 w-8" style={{ color: '#241C15' }} />
        </div>
      </div>
      <div className="space-y-3">
        <h3 className="text-xl font-bold" style={{ color: '#241C15' }}>Building Your Profile</h3>
        <p className="text-sm" style={{ color: '#241C15', opacity: 0.6 }}>
          We're analyzing your resume and setting up your account...
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center" style={{ backgroundColor: '#fbf5e5' }}>
            <FileText className="h-6 w-6" style={{ color: '#FFE01B' }} />
          </div>
          <p className="text-xs font-medium mb-1" style={{ color: '#241C15' }}>Resume</p>
          <div className="w-full h-2 rounded-full overflow-hidden bg-[#fbf5e5]">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress.resume}%`, backgroundColor: "#FFE01B" }} />
          </div>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center" style={{ backgroundColor: '#fbf5e5' }}>
            <User className="h-6 w-6" style={{ color: '#FFE01B' }} />
          </div>
          <p className="text-xs font-medium mb-1" style={{ color: '#241C15' }}>Profile Photo</p>
          <div className="w-full h-2 rounded-full overflow-hidden bg-[#fbf5e5]">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress.photo}%`, backgroundColor: "#FFE01B" }} />
          </div>
        </div>
      </div>
    </div>
  )

  // Enhanced ErrorStep Component with details
  const ErrorStep = () => (
    <div className="text-center space-y-6 py-8">
      <div className="inline-flex p-4 rounded-full" style={{ backgroundColor: '#fee2e2' }}>
        <AlertCircle className="h-8 w-8" style={{ color: '#dc2626' }} />
      </div>
      <div className="space-y-3">
        <h3 className="text-xl font-bold" style={{ color: '#241C15' }}>Onboarding Failed</h3>
        <div className="text-sm space-y-2" style={{ color: '#241C15' }}>
          <p className="font-medium">{error?.message || "Something went wrong."}</p>
          {error?.details && (
            <details className="text-xs opacity-70 cursor-pointer">
              <summary className="hover:opacity-100">View technical details</summary>
              <pre className="mt-2 p-2 bg-gray-100 rounded text-left overflow-auto max-h-40">
                {error.details}
              </pre>
            </details>
          )}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          onClick={() => {
            setStep("upload")
            setError(null)
            setUploadedUrls({ resume: null, photo: null })
          }}
          className="font-semibold"
          style={{ backgroundColor: '#FFE01B', color: '#241C15' }}
        >
          Start Over
        </Button>
        <Button
          onClick={handleOnboarding}
          variant="outline"
          className="font-semibold"
          style={{ borderColor: '#FFE01B', color: '#241C15' }}
        >
          <Loader2 className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    </div>
  )

  // --- UI Layout ---
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8" style={{ backgroundColor: "#fbf5e5" }}>
      <Card className="w-full max-w-4xl lg:max-w-6xl border-2 shadow-xl" style={{ borderColor: "#FFE01B", backgroundColor: "white" }}>
        <CardHeader className="text-center border-b pb-6 sm:pb-8" style={{ borderBottomColor: "#FFE01B" }}>
          <div className="flex justify-center mb-4">
            <div className="p-3 sm:p-4 rounded-full" style={{ backgroundColor: "#FFE01B" }}>
              <Sparkles className="h-6 w-6 sm:h-8 sm:w-8" style={{ color: "#241C15" }} />
            </div>
          </div>
          <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3" style={{ color: "#241C15" }}>
            Complete Your Profile
          </CardTitle>
          <CardDescription className="text-sm sm:text-base lg:text-lg" style={{ color: "#241C15", opacity: 0.6 }}>
            Upload your resume and profile photo. We'll analyze your experience and set up your account automatically.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 lg:p-8">
          {step === "upload" && (
            <div className="space-y-6 sm:space-y-8">
              {/* Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center space-y-2 p-4 rounded-lg" style={{ backgroundColor: '#fbf5e5' }}>
                  <Zap className="h-5 w-5" style={{ color: '#FFE01B' }} />
                  <span className="text-sm font-medium" style={{ color: '#241C15' }}>AI Analysis</span>
                  <p className="text-xs" style={{ color: '#241C15', opacity: 0.6 }}>Smart resume parsing</p>
                </div>
                <div className="flex flex-col items-center space-y-2 p-4 rounded-lg" style={{ backgroundColor: '#fbf5e5' }}>
                  <Shield className="h-5 w-5" style={{ color: '#FFE01B' }} />
                  <span className="text-sm font-medium" style={{ color: '#241C15' }}>Secure & Private</span>
                  <p className="text-xs" style={{ color: '#241C15', opacity: 0.6 }}>Your data is protected</p>
                </div>
                <div className="flex flex-col items-center space-y-2 p-4 rounded-lg" style={{ backgroundColor: '#fbf5e5' }}>
                  <Sparkles className="h-5 w-5" style={{ color: '#FFE01B' }} />
                  <span className="text-sm font-medium" style={{ color: '#241C15' }}>Instant Setup</span>
                  <p className="text-xs" style={{ color: '#241C15', opacity: 0.6 }}>Ready in minutes</p>
                </div>
              </div>

              {/* Upload Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {/* Resume Upload */}
                <div className="space-y-4">
                  <label className="flex items-center space-x-2 font-semibold text-base sm:text-lg" style={{ color: "#241C15" }}>
                    <FileText className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: "#FFE01B" }} />
                    <span>Upload Resume</span>
                  </label>
                  <div
                    className="border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 group relative"
                    style={{
                      borderColor: resume ? "#FFE01B" : "#e5e7eb",
                      backgroundColor: resume ? "#fbf5e5" : "white",
                    }}
                  >
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileSelect(e.target.files?.[0] || null, "resume")}
                      className="hidden"
                      id="resume-upload"
                      disabled={loading}
                    />
                    <label htmlFor="resume-upload" className="cursor-pointer block">
                      <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                        <div
                          className="p-3 sm:p-4 rounded-full group-hover:scale-110 transition-all"
                          style={{ backgroundColor: resume ? "#FFE01B" : "#fbf5e5" }}
                        >
                          <Upload className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: "#241C15" }} />
                        </div>
                        {resume ? (
                          <>
                            <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: "#FFE01B" }} />
                            <span className="font-semibold text-sm sm:text-base truncate max-w-full">{resume.name}</span>
                            <p className="text-xs sm:text-sm opacity-60">Click to change file</p>
                          </>
                        ) : (
                          <>
                            <p className="font-medium text-sm sm:text-base">Click to select your resume</p>
                            <p className="text-xs sm:text-sm opacity-60">PDF, DOC, DOCX (max 3MB)</p>
                          </>
                        )}
                      </div>
                    </label>
                    {resume && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeFile("resume")
                        }}
                        className="absolute top-3 right-3 p-1 rounded-full hover:bg-white transition-colors"
                        style={{ color: '#241C15' }}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  {progress.resume > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span style={{ color: '#241C15' }}>Uploading...</span>
                        <span style={{ color: '#241C15' }}>{progress.resume}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full overflow-hidden bg-[#fbf5e5]">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress.resume}%`, backgroundColor: "#FFE01B" }} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Photo Upload */}
                <div className="space-y-4">
                  <label className="flex items-center space-x-2 font-semibold text-base sm:text-lg" style={{ color: "#241C15" }}>
                    <User className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: "#FFE01B" }} />
                    <span>Upload Profile Photo</span>
                  </label>
                  <div
                    className="border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 group relative"
                    style={{
                      borderColor: photo ? "#FFE01B" : "#e5e7eb",
                      backgroundColor: photo ? "#fbf5e5" : "white",
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileSelect(e.target.files?.[0] || null, "photo")}
                      className="hidden"
                      id="photo-upload"
                      disabled={loading}
                    />
                    <label htmlFor="photo-upload" className="cursor-pointer block">
                      <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                        <div
                          className="p-3 sm:p-4 rounded-full group-hover:scale-110 transition-all"
                          style={{ backgroundColor: photo ? "#FFE01B" : "#fbf5e5" }}
                        >
                          <User className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: "#241C15" }} />
                        </div>
                        {photo ? (
                          <>
                            <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: "#FFE01B" }} />
                            <span className="font-semibold text-sm sm:text-base truncate max-w-full">{photo.name}</span>
                            <p className="text-xs sm:text-sm opacity-60">Click to change photo</p>
                          </>
                        ) : (
                          <>
                            <p className="font-medium text-sm sm:text-base">Click to select your photo</p>
                            <p className="text-xs sm:text-sm opacity-60">JPG, PNG, or GIF (max 5MB)</p>
                          </>
                        )}
                      </div>
                    </label>
                    {photo && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeFile("photo")
                        }}
                        className="absolute top-3 right-3 p-1 rounded-full hover:bg-white transition-colors"
                        style={{ color: '#241C15' }}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  {progress.photo > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span style={{ color: '#241C15' }}>Uploading...</span>
                        <span style={{ color: '#241C15' }}>{progress.photo}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full overflow-hidden bg-[#fbf5e5]">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress.photo}%`, backgroundColor: "#FFE01B" }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* File Status */}
              {(uploadedFiles.resume || uploadedFiles.photo) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg" style={{ backgroundColor: '#fbf5e5' }}>
                  {uploadedFiles.resume && (
                    <div className="flex items-center space-x-3">
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0" style={{ color: '#FFE01B' }} />
                      <div>
                        <p className="text-sm font-medium" style={{ color: '#241C15' }}>Resume Ready</p>
                        <p className="text-xs" style={{ color: '#241C15', opacity: 0.6 }}>{resume?.name}</p>
                      </div>
                    </div>
                  )}
                  {uploadedFiles.photo && (
                    <div className="flex items-center space-x-3">
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0" style={{ color: '#FFE01B' }} />
                      <div>
                        <p className="text-sm font-medium" style={{ color: '#241C15' }}>Photo Ready</p>
                        <p className="text-xs" style={{ color: '#241C15', opacity: 0.6 }}>{photo?.name}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Continue Button */}
              <Button
                onClick={handleOnboarding}
                disabled={!resume || !photo || loading}
                className="w-full text-base sm:text-lg font-semibold py-4 sm:py-6 flex items-center justify-center space-x-2 hover:shadow-lg disabled:opacity-50 transition-all duration-200"
                style={{ backgroundColor: "#FFE01B", color: "#241C15" }}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Upload & Continue</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </Button>

              {/* Requirements */}
              <div className="text-center">
                <p className="text-xs sm:text-sm" style={{ color: '#241C15', opacity: 0.5 }}>
                  By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          )}

          {step === "processing" && <ProcessingStep />}
          {step === "error" && <ErrorStep />}
        </CardContent>
      </Card>
    </div>
  )
}