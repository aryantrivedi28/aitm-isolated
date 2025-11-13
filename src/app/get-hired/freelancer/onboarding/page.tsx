"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, User, FileText, CheckCircle2, Sparkles, ArrowRight } from "lucide-react"

type OnboardingStep = "upload" | "processing" | "error"

export default function FreelancerOnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<OnboardingStep>("upload")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [resume, setResume] = useState<File | null>(null)
  const [photo, setPhoto] = useState<File | null>(null)
  const [progress, setProgress] = useState({ resume: 0, photo: 0 })

  // File uploader (used for resume + photo)
  const uploadFile = async (file: File, type: "resume" | "photo") => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("type", type)

    const response = await fetch("/api/freelancer/upload-file", {
      method: "POST",
      body: formData,
      credentials: "include",
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.error || `Failed to upload ${type}`)
    return data.fileUrl
  }

  // 🧠 HELPER: ensures proper array format for fields
  const safeArray = (val: any) => {
    if (!val) return []
    if (Array.isArray(val)) return val
    try {
      const parsed = JSON.parse(val)
      return Array.isArray(parsed) ? parsed : [parsed]
    } catch {
      return [val]
    }
  }

  // 🚀 MAIN LOGIC
  const handleOnboarding = async () => {
    if (!resume || !photo) return
    setLoading(true)
    setError("")
    setStep("processing")

    try {
      setProgress({ resume: 10, photo: 10 })

      // Step 1: Upload resume
      const resumeUrl = await uploadFile(resume, "resume")
      setProgress((p) => ({ ...p, resume: 50 }))
      console.log("📄 Resume uploaded:", resumeUrl)

      // Step 2: Upload photo
      const photoUrl = await uploadFile(photo, "photo")
      setProgress((p) => ({ ...p, photo: 50 }))
      console.log("🖼️ Photo uploaded:", photoUrl)

      // Step 3: Parse resume via AI
      const parseResponse = await fetch("/api/freelancer/parse-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileUrl: resumeUrl }),
        credentials: "include",
      })
      const parseData = await parseResponse.json()
      if (!parseResponse.ok) throw new Error(parseData.error || "Failed to parse resume")
      console.log("🧩 [DEBUG] Parsed data:", parseData)

      const parsed = parseData.profile || parseData

      setProgress({ resume: 80, photo: 80 })

      // Step 4: Merge all parsed data for DB
      const payload = {
        name: parsed.name || "",
        title: parsed.title || "",
        bio: parsed.bio || "",
        skills: safeArray(parsed.skills),
        experience_years: parsed.experience_years ?? 0,
        hourly_rate: parsed.hourly_rate ?? null,
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
        languages: safeArray(parsed.languages),
        resume_url: resumeUrl,
        photo_url: photoUrl,
        profile_completed: true,
        availability: "full-time",
      }

      console.log("📤 [DEBUG] Sending full payload to Supabase:", payload)

      const saveResponse = await fetch("/api/freelancer/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      })

      const saveData = await saveResponse.json()
      if (!saveResponse.ok) throw new Error(saveData.error || "Failed to save profile")

      console.log("✅ [DEBUG] Profile saved successfully:", saveData)
      setProgress({ resume: 100, photo: 100 })

      // Step 5: Redirect to dashboard after short delay
      setTimeout(() => router.push("/get-hired/freelancer/dashboard"), 2000)
    } catch (err) {
      console.error("[Onboarding Error]", err)
      setError(err instanceof Error ? err.message : "Unexpected error occurred.")
      setStep("error")
      setLoading(false)
    }
  }

  // --- UI Layout ---
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#fbf5e5" }}>
      <Card className="w-full max-w-7xl border-2 shadow-lg" style={{ borderColor: "#FFE01B", backgroundColor: "white" }}>
        <CardHeader className="text-center border-b pb-6" style={{ borderBottomColor: "#FFE01B" }}>
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full" style={{ backgroundColor: "#FFE01B" }}>
              <Sparkles className="h-8 w-8" style={{ color: "#241C15" }} />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold mb-2" style={{ color: "#241C15" }}>
            Complete Your Profile
          </CardTitle>
          <CardDescription className="text-base" style={{ color: "#241C15", opacity: 0.6 }}>
            Upload your resume and profile photo. We'll analyze your experience and set up your account automatically.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4">
          {step === "upload" && (
            <div className="space-y-6">
              {/* Upload Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Resume Upload */}
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 font-semibold text-base" style={{ color: "#241C15" }}>
                    <FileText className="h-5 w-5" style={{ color: "#FFE01B" }} />
                    <span>Upload Resume</span>
                  </label>
                  <div
                    className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 group"
                    style={{
                      borderColor: resume ? "#FFE01B" : "#e5e7eb",
                      backgroundColor: resume ? "#fbf5e5" : "white",
                    }}
                  >
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setResume(e.target.files?.[0] || null)}
                      className="hidden"
                      id="resume-upload"
                      disabled={loading}
                    />
                    <label htmlFor="resume-upload" className="cursor-pointer block">
                      <div className="flex flex-col items-center space-y-3">
                        <div
                          className="p-4 rounded-full group-hover:scale-110 transition-all"
                          style={{ backgroundColor: resume ? "#FFE01B" : "#fbf5e5" }}
                        >
                          <Upload className="h-6 w-6" style={{ color: "#241C15" }} />
                        </div>
                        {resume ? (
                          <>
                            <CheckCircle2 className="h-5 w-5" style={{ color: "#FFE01B" }} />
                            <span className="font-semibold">{resume.name}</span>
                            <p className="text-sm opacity-60">Click to change file</p>
                          </>
                        ) : (
                          <>
                            <p className="font-medium">Click to select your resume</p>
                            <p className="text-sm opacity-60">PDF, DOC, DOCX (max 3MB)</p>
                          </>
                        )}
                      </div>
                    </label>
                  </div>
                  {progress.resume > 0 && (
                    <div className="w-full h-2 rounded-full overflow-hidden bg-[#fbf5e5]">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress.resume}%`, backgroundColor: "#FFE01B" }} />
                    </div>
                  )}
                </div>

                {/* Photo Upload */}
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 font-semibold text-base" style={{ color: "#241C15" }}>
                    <User className="h-5 w-5" style={{ color: "#FFE01B" }} />
                    <span>Upload Profile Photo</span>
                  </label>
                  <div
                    className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 group"
                    style={{
                      borderColor: photo ? "#FFE01B" : "#e5e7eb",
                      backgroundColor: photo ? "#fbf5e5" : "white",
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                      className="hidden"
                      id="photo-upload"
                      disabled={loading}
                    />
                    <label htmlFor="photo-upload" className="cursor-pointer block">
                      <div className="flex flex-col items-center space-y-3">
                        <div
                          className="p-4 rounded-full group-hover:scale-110 transition-all"
                          style={{ backgroundColor: photo ? "#FFE01B" : "#fbf5e5" }}
                        >
                          <User className="h-6 w-6" style={{ color: "#241C15" }} />
                        </div>
                        {photo ? (
                          <>
                            <CheckCircle2 className="h-5 w-5" style={{ color: "#FFE01B" }} />
                            <span className="font-semibold">{photo.name}</span>
                            <p className="text-sm opacity-60">Click to change photo</p>
                          </>
                        ) : (
                          <>
                            <p className="font-medium">Click to select your photo</p>
                            <p className="text-sm opacity-60">JPG, PNG, or GIF (max 5MB)</p>
                          </>
                        )}
                      </div>
                    </label>
                  </div>
                  {progress.photo > 0 && (
                    <div className="w-full h-2 rounded-full overflow-hidden bg-[#fbf5e5]">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress.photo}%`, backgroundColor: "#FFE01B" }} />
                    </div>
                  )}
                </div>
              </div>

              {/* Continue Button */}
              <Button
                onClick={handleOnboarding}
                disabled={!resume || !photo || loading}
                className="w-full text-lg font-semibold py-6 flex items-center justify-center space-x-2 hover:shadow-lg disabled:opacity-50"
                style={{ backgroundColor: "#FFE01B", color: "#241C15" }}
              >
                <span>{loading ? "Processing..." : "Upload & Continue"}</span>
                {!loading && <ArrowRight className="h-5 w-5" />}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}




// "use client"

// import type React from "react"
// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// type OnboardingStep = "choose-method" | "upload-resume" | "manual-entry" | "processing" | "error"

// interface ParsedProfile {
//   name: string
//   title: string
//   skills: string[]
//   experience_years: number
//   bio: string
//   hourly_rate?: number
//   profile_rating: number
//   rating_feedback: string[]
// }

// export default function FreelancerOnboardingPage() {
//   const router = useRouter()
//   const [step, setStep] = useState<OnboardingStep>("choose-method")
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState("")
//   const [file, setFile] = useState<File | null>(null)
//   const [uploadProgress, setUploadProgress] = useState(0)
//   const [formData, setFormData] = useState({
//     name: "",
//     title: "",
//     bio: "",
//     skills: "",
//     experience_years: 0,
//     hourly_rate: 0,
//     availability: "full-time",
//     portfolio_url: "",
//   })

//   const renderChooseMethod = () => (
//     <div className="space-y-4">
//       <p className="text-slate-600 mb-6">How would you like to set up your profile?</p>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <button
//           onClick={() => setStep("upload-resume")}
//           className="p-6 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-left"
//         >
//           <h3 className="font-semibold text-lg mb-2">Upload Resume</h3>
//           <p className="text-sm text-slate-600">
//             Let us analyze your resume to auto-fill your profile and calculate your rating
//           </p>
//         </button>
//         <button
//           onClick={() => setStep("manual-entry")}
//           className="p-6 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-left"
//         >
//           <h3 className="font-semibold text-lg mb-2">Manual Entry</h3>
//           <p className="text-sm text-slate-600">Fill in your profile details manually</p>
//         </button>
//       </div>
//     </div>
//   )

//   const renderUploadResume = () => (
//     <div className="space-y-4">
//       <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition">
//         <input
//           type="file"
//           accept=".pdf,.doc,.docx"
//           onChange={(e) => setFile(e.target.files?.[0] || null)}
//           className="hidden"
//           id="resume-upload"
//           disabled={loading}
//         />
//         <label htmlFor="resume-upload" className="cursor-pointer block">
//           <div className="space-y-2">
//             <p className="text-sm text-slate-600">
//               {file ? `✓ ${file.name}` : "Click to select or drag your resume here"}
//             </p>
//             <p className="text-xs text-slate-500">Supported formats: PDF, DOC, DOCX (Max 5MB)</p>
//             {file && <p className="text-xs text-green-600">File ready for upload</p>}
//           </div>
//         </label>
//       </div>
//       {uploadProgress > 0 && uploadProgress < 100 && (
//         <div className="w-full bg-slate-200 rounded-full h-2">
//           <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${uploadProgress}%` }}></div>
//         </div>
//       )}
//       <div className="flex gap-2">
//         <Button variant="outline" onClick={() => setStep("choose-method")} className="flex-1" disabled={loading}>
//           Back
//         </Button>
//         <Button onClick={() => handleResumeSubmit()} disabled={!file || loading} className="flex-1">
//           {loading ? `Processing... ${uploadProgress}%` : "Upload & Parse Resume"}
//         </Button>
//       </div>
//     </div>
//   )

//   const renderManualEntry = () => (
//     <form onSubmit={(e) => handleManualSubmit(e)} className="space-y-4">
//       <div>
//         <label className="block text-sm font-medium mb-2">Full Name *</label>
//         <input
//           type="text"
//           value={formData.name}
//           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//           placeholder="John Doe"
//           required
//           disabled={loading}
//           className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium mb-2">Professional Title *</label>
//         <input
//           type="text"
//           value={formData.title}
//           onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//           placeholder="e.g., Full Stack Developer"
//           required
//           disabled={loading}
//           className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium mb-2">Bio *</label>
//         <textarea
//           value={formData.bio}
//           onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
//           placeholder="Tell us about yourself... (minimum 50 characters for better profile rating)"
//           rows={4}
//           required
//           disabled={loading}
//           className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium mb-2">Skills (comma-separated) *</label>
//         <input
//           type="text"
//           value={formData.skills}
//           onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
//           placeholder="React, Node.js, TypeScript, etc."
//           required
//           disabled={loading}
//           className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
//         />
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <label className="block text-sm font-medium mb-2">Years of Experience *</label>
//           <input
//             type="number"
//             value={formData.experience_years}
//             onChange={(e) => setFormData({ ...formData, experience_years: Number.parseFloat(e.target.value) })}
//             min="0"
//             required
//             disabled={loading}
//             className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-2">Hourly Rate ($)</label>
//           <input
//             type="number"
//             value={formData.hourly_rate}
//             onChange={(e) => setFormData({ ...formData, hourly_rate: Number.parseFloat(e.target.value) })}
//             min="0"
//             step="0.01"
//             disabled={loading}
//             className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
//           />
//         </div>
//       </div>

//       <div>
//         <label className="block text-sm font-medium mb-2">Portfolio URL (optional)</label>
//         <input
//           type="url"
//           value={formData.portfolio_url}
//           onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
//           placeholder="https://yourportfolio.com"
//           disabled={loading}
//           className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium mb-2">Availability</label>
//         <select
//           value={formData.availability}
//           onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
//           disabled={loading}
//           className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
//         >
//           <option value="full-time">Full-time</option>
//           <option value="part-time">Part-time</option>
//           <option value="contract">Contract</option>
//           <option value="freelance">Freelance</option>
//         </select>
//       </div>

//       <div className="flex gap-2">
//         <Button
//           type="button"
//           variant="outline"
//           onClick={() => setStep("choose-method")}
//           className="flex-1"
//           disabled={loading}
//         >
//           Back
//         </Button>
//         <Button type="submit" disabled={loading} className="flex-1">
//           {loading ? "Saving..." : "Complete Profile"}
//         </Button>
//       </div>
//     </form>
//   )

//   const renderProcessing = () => (
//     <div className="text-center space-y-4">
//       <div className="inline-block">
//         <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
//       </div>
//       <h3 className="font-semibold text-lg">Processing Your Profile</h3>
//       <p className="text-sm text-slate-600">
//         Setting up your account, analyzing your data, and preparing your dashboard...
//       </p>
//       <div className="text-xs text-slate-500 space-y-1">
//         <p>• Uploading and parsing resume</p>
//         <p>• Calculating profile rating</p>
//         <p>• Verifying profile completion</p>
//         <p>• Preparing dashboard</p>
//       </div>
//     </div>
//   )

//   const renderError = () => (
//     <div className="space-y-4">
//       <div className="p-4 bg-red-50 border border-red-200 rounded-md">
//         <p className="text-sm text-red-700 font-medium mb-2">Error</p>
//         <p className="text-sm text-red-600">{error}</p>
//       </div>
//       <div className="flex gap-2">
//         <Button
//           variant="outline"
//           onClick={() => {
//             setStep("choose-method")
//             setError("")
//             setFile(null)
//           }}
//           className="flex-1"
//         >
//           Start Over
//         </Button>
//       </div>
//     </div>
//   )

//   const handleResumeSubmit = async () => {
//     if (!file) return

//     setLoading(true)
//     setError("")
//     setStep("processing")

//     try {
//       // Step 1: Upload resume file to Supabase
//       console.log("[v0] Uploading resume to Supabase...")
//       setUploadProgress(25)

//       const formDataToSend = new FormData()
//       formDataToSend.append("file", file)

//       const uploadResponse = await fetch("/api/freelancer/upload-resume", {
//         method: "POST",
//         body: formDataToSend,
//         credentials: "include",
//       })

//       const uploadData = await uploadResponse.json()

//       if (!uploadResponse.ok) {
//         throw new Error(uploadData.error || "Failed to upload resume")
//       }

//       console.log("[v0] Resume uploaded successfully:", uploadData.fileUrl)
//       setUploadProgress(50)

//       // Step 2: Parse the resume using Supabase file URL
//       console.log("[v0] Parsing resume content...")
//       setUploadProgress(75)

//       const parseResponse = await fetch("/api/freelancer/parse-resume", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ fileUrl: uploadData.fileUrl }),
//         credentials: "include",
//       })

//       const parseData = await parseResponse.json()

//       if (!parseResponse.ok) {
//         throw new Error(parseData.error || "Failed to parse resume")
//       }

//       console.log("[v0] Resume parsed successfully:", parseData.profile)
//       setUploadProgress(85)

//       // Step 3: Save extracted profile data with rating to database
//       console.log("[v0] Saving profile to database...")

//       const saveResponse = await fetch("/api/freelancer/profile", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: parseData.profile.name,
//           title: parseData.profile.title,
//           bio: parseData.profile.bio,
//           skills: parseData.profile.skills,
//           experience_years: parseData.profile.experience_years,
//           hourly_rate: parseData.profile.hourly_rate,
//           profile_rating: parseData.profile.profile_rating,
//           onboarding_completed: true,
//           availability: "full-time",
//         }),
//         credentials: "include",
//       })

//       if (!saveResponse.ok) {
//         const saveError = await saveResponse.json()
//         throw new Error(saveError.error || "Failed to save profile")
//       }

//       console.log("[v0] Profile saved successfully")
//       setUploadProgress(100)

//       console.log("[v0] Verifying profile completion...")
//       const verifyResponse = await fetch("/api/freelancer/me", {
//         credentials: "include",
//       })

//       if (verifyResponse.ok) {
//         const { freelancer } = await verifyResponse.json()

//         if (freelancer.onboarding_completed) {
//           console.log("[v0] Profile verified, redirecting to dashboard...")

//           // Redirect to dashboard after successful completion
//           setTimeout(() => {
//             router.push("/find-talent/freelancer/dashboard")
//           }, 1500)
//         } else {
//           throw new Error("Profile verification failed")
//         }
//       } else {
//         throw new Error("Could not verify profile completion")
//       }
//     } catch (err) {
//       console.error("[v0] Resume submission error:", err)
//       setError(err instanceof Error ? err.message : "An error occurred. Please try again.")
//       setStep("error")
//       setLoading(false)
//     }
//   }

//   const handleManualSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)
//     setError("")
//     setStep("processing")

//     try {
//       console.log("[v0] Saving manual profile entry...")

//       // Create profile data with manual entry
//       const profileData = {
//         name: formData.name,
//         title: formData.title,
//         bio: formData.bio,
//         skills: formData.skills.split(",").map((s) => s.trim()),
//         experience_years: formData.experience_years,
//         hourly_rate: formData.hourly_rate,
//         availability: formData.availability,
//         portfolio_url: formData.portfolio_url,
//         onboarding_completed: true,
//       }

//       const response = await fetch("/api/freelancer/profile", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(profileData),
//         credentials: "include",
//       })

//       const data = await response.json()

//       if (!response.ok) {
//         throw new Error(data.error || "Failed to complete registration")
//       }

//       console.log("[v0] Manual profile saved successfully")

//       console.log("[v0] Verifying profile completion...")
//       const verifyResponse = await fetch("/api/freelancer/me", {
//         credentials: "include",
//       })

//       if (verifyResponse.ok) {
//         const { freelancer } = await verifyResponse.json()

//         if (freelancer.onboarding_completed) {
//           console.log("[v0] Profile verified, redirecting to dashboard...")

//           setTimeout(() => {
//             router.push("/find-talent/freelancer/dashboard")
//           }, 1500)
//         } else {
//           throw new Error("Profile verification failed")
//         }
//       } else {
//         throw new Error("Could not verify profile completion")
//       }
//     } catch (err) {
//       console.error("[v0] Manual submission error:", err)
//       setError(err instanceof Error ? err.message : "An error occurred. Please try again.")
//       setStep("error")
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
//       <Card className="w-full max-w-2xl">
//         <CardHeader>
//           <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
//           <CardDescription>
//             {step === "choose-method" && "Choose how you'd like to set up your profile"}
//             {step === "upload-resume" && "Upload your resume for analysis"}
//             {step === "manual-entry" && "Fill in your profile details"}
//             {step === "processing" && "Almost there!"}
//             {step === "error" && "Something went wrong"}
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {step === "choose-method" && renderChooseMethod()}
//           {step === "upload-resume" && renderUploadResume()}
//           {step === "manual-entry" && renderManualEntry()}
//           {step === "processing" && renderProcessing()}
//           {step === "error" && renderError()}
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
