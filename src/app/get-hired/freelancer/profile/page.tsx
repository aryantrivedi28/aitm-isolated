"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { ArrowLeft, User, Menu } from "lucide-react"
import { ProfileHeaderButtons } from "./component/profile-header-buttons"
import { ProfileContent } from "./component/profile-content"
import { freelancerApi } from "../../../../lib/freelancer-api"

const fetcher = (url: string) => fetch(url, { credentials: "include" }).then((res) => res.json())

interface Project {
  name: string
  description: string
  technologies?: string[]
  project_url?: string
  start_date?: string
  end_date?: string
}

interface CaseStudyItem {
  id: string
  title: string
  description: string
  image_url: string
  image_path?: string
  project_url?: string
  category: string
  tools?: string[]
}

interface WorkExperience {
  id: string
  role: string
  company: string
  location?: string
  startDate: string // Change from start_date to startDate
  endDate?: string // Change from end_date to endDate
  current: boolean // Change from is_current to current
  description: string
  achievements?: string[]
}

const formatEducation = (entry: any) => {
  if (typeof entry === "string") {
    try {
      const parsed = JSON.parse(entry)
      const parts = [parsed.degree, parsed.institution, parsed.year].filter(Boolean)
      return parts.join(" — ")
    } catch {
      return entry
    }
  }
  if (entry && typeof entry === "object") {
    const parts = [entry.degree, entry.institution, entry.year].filter(Boolean)
    return parts.join(" — ")
  }
  return ""
}

// Transform API profile shape into UI form state
const mapApiProfileToFormData = (profile: any) => ({
  name: profile.name || "",
  email: profile.email || "",
  phone: profile.phone || "",
  title: profile.title || "",
  bio: profile.bio || "",
  skills: Array.isArray(profile.skills) ? profile.skills : [],
  experience_years: profile.experience_years || 0,
  availability: profile.availability || "full-time",
  github_url: profile.github_url || "",
  portfolio_url: profile.portfolio_url || "",
  linkedin_url: profile.linkedin_url || "",
  twitter_url: profile.twitter_url || "",
  hourly_rate: profile.hourly_rate ?? null,
  languages: Array.isArray(profile.languages) ? profile.languages : [],
  education: Array.isArray(profile.education) ? profile.education.map((e: any) => formatEducation(e)).filter(Boolean) : [],
  certifications: Array.isArray(profile.certifications) ? profile.certifications : [],
  resume_url: profile.resume_url || "",
  projects: Array.isArray(profile.projects) ? profile.projects : [],
  background_type: profile.background_type || "tech",
  profile_rating: profile.profile_rating ?? null,
  rating_feedback: Array.isArray(profile.rating_feedback) ? profile.rating_feedback : [],
  photo_url: profile.photo_url || "",
  case_studies: Array.isArray(profile.case_studies)
    ? profile.case_studies.map((item: any) => ({
      id: item.id,
      title: item.title || "",
      description: item.description || "",
      image_url: item.image_url || "",
      image_path: item.image_path || "",
      project_url: item.project_url || "",
      category: item.category || "marketing",
      tools: Array.isArray(item.tools) ? item.tools : [],
    }))
    : [],
  work_experience: Array.isArray(profile.work_experience)
    ? profile.work_experience.map((item: any) => ({
      id: item.id,
      role: item.role || "",
      company: item.company || "",
      location: item.location || "",
      start_date: item.start_date || "",
      end_date: item.end_date || "",
      is_current: item.is_current ?? false,
      description: item.description || "",
      achievements: Array.isArray(item.achievements) ? item.achievements : [],
    }))
    : [],
})

export default function FreelancerProfilePage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [uploadingImages, setUploadingImages] = useState<Record<string, boolean>>({})

  const [showCaseStudyModal, setShowCaseStudyModal] = useState(false)
  const [showExperienceModal, setShowExperienceModal] = useState(false)
  const [savingCaseStudy, setSavingCaseStudy] = useState(false)
  const [savingExperience, setSavingExperience] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const [newCaseStudyItem, setNewCaseStudyItem] = useState<CaseStudyItem>({
    id: crypto.randomUUID(),
    title: "",
    description: "",
    image_url: "",
    image_path: "",
    project_url: "",
    category: "marketing",
    tools: [],
  })

  const [newExperience, setNewExperience] = useState<WorkExperience>({
    id: crypto.randomUUID(),
    role: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
    achievements: [],
  })

  const { data: profileData, mutate } = useSWR("/api/freelancer/profile", fetcher)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    title: "",
    bio: "",
    skills: [] as string[],
    experience_years: 0,
    availability: "full-time",
    github_url: "",
    portfolio_url: "",
    linkedin_url: "",
    twitter_url: "",
    hourly_rate: null as number | null,
    languages: [] as string[],
    education: [] as string[],
    certifications: [] as string[],
    resume_url: "",
    projects: [] as Project[],
    background_type: "tech" as "tech" | "non-tech" | "both",
    profile_rating: null as number | null,
    rating_feedback: [] as string[],
    photo_url: "",
    case_studies: [] as CaseStudyItem[],
    work_experience: [] as WorkExperience[],
  })

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (profileData?.profile) {
      setFormData(mapApiProfileToFormData(profileData.profile))
    }
  }, [profileData])

  // Handle mobile menu close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (mobileMenuOpen && !target.closest('.mobile-menu') && !target.closest('.mobile-menu-toggle')) {
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [mobileMenuOpen])

  // -----------------------
  // Case study image upload
  // -----------------------
  const handleCaseStudyImageUpload = async (itemId: string, file: File) => {
    if (!file) return

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.")
      return
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      setError("File too large. Maximum size is 5MB.")
      return
    }

    setUploadingImages((prev) => ({ ...prev, [itemId]: true }))
    setError("")

    try {
      const result = await freelancerApi.uploadCaseStudyImage(itemId, file)

      if (!result.success) {
        setError(result.error || "Failed to upload image")
        return
      }

      if (itemId === "new-case-study") {
        setNewCaseStudyItem((prev) => ({
          ...prev,
          image_url: result.imageUrl,
          image_path: result.imagePath,
        }))
      } else {
        // Update existing case study item in formData
        setFormData((prev) => ({
          ...prev,
          case_studies: prev.case_studies.map((item) =>
            item.id === itemId ? { ...item, image_url: result.imageUrl, image_path: result.imagePath } : item
          ),
        }))
      }
    } catch (err) {
      setError("Failed to upload image. Please try again.")
      console.error(err)
    } finally {
      setUploadingImages((prev) => ({ ...prev, [itemId]: false }))
    }
  }

  const handleCaseStudyImageDelete = async (itemId: string, imagePath: string) => {
    if (!imagePath) return

    try {
      await freelancerApi.deleteCaseStudyImage(imagePath, itemId)

      if (itemId === "new-case-study") {
        setNewCaseStudyItem((prev) => ({
          ...prev,
          image_url: "",
          image_path: "",
        }))
      } else {
        setFormData((prev) => ({
          ...prev,
          case_studies: prev.case_studies.map((item) =>
            item.id === itemId ? { ...item, image_url: "", image_path: "" } : item
          ),
        }))
      }
    } catch (err) {
      console.error("Failed to delete image:", err)
    }
  }

  // -----------------------
  // Remove case study
  // -----------------------
  const removeCaseStudyItem = async (id: string) => {
    const item = formData.case_studies.find((p) => p.id === id)
    if (item?.image_path) {
      await handleCaseStudyImageDelete(id, item.image_path)
    }

    try {
      const result = await freelancerApi.deleteCaseStudy(id)

      if (result.success) {
        setFormData((prev) => ({
          ...prev,
          case_studies: prev.case_studies.filter((item) => item.id !== id),
        }))
      }
    } catch (err) {
      console.error("Failed to delete case study:", err)
    }
  }

  // -----------------------
  // Remove work experience
  // -----------------------
  const removeWorkExperience = async (id: string) => {
    try {
      const result = await freelancerApi.deleteWorkExperience(id)

      if (result.success) {
        setFormData((prev) => ({
          ...prev,
          work_experience: prev.work_experience.filter((exp) => exp.id !== id),
        }))
      }
    } catch (err) {
      console.error("Failed to delete work experience:", err)
    }
  }

  // -----------------------
  // Resetters
  // -----------------------
  const resetNewCaseStudyItem = () => {
    setNewCaseStudyItem({
      id: crypto.randomUUID(),
      title: "",
      description: "",
      image_url: "",
      image_path: "",
      project_url: "",
      category: "marketing",
      tools: [],
    })
  }

  const resetNewExperience = () => {
    setNewExperience({
      id: crypto.randomUUID(),
      role: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      achievements: [],
    })
  }

  // -----------------------
  // Handlers for form fields
  // -----------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "experience_years" ? Number.parseFloat(value) || 0 : value,
    }))
  }

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      skills: e.target.value
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== ""),
    }))
  }


  // Update the saveNewCaseStudyItem function in the main page component
  const saveNewCaseStudyItem = async () => {
    if (!newCaseStudyItem.title || !newCaseStudyItem.description || !newCaseStudyItem.category) {
      setError("Please fill in the title, description, and select a category")
      return
    }

    setSavingCaseStudy(true)
    setError("")

    try {
      const result = await freelancerApi.addCaseStudy(newCaseStudyItem)

      if (!result.success) {
        setError(result.error || "Failed to save case study")
        return
      }

      setFormData((prev) => ({
        ...prev,
        case_studies: result.case_studies || prev.case_studies
      }))
      resetNewCaseStudyItem()
      setShowCaseStudyModal(false)
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error(err)
    } finally {
      setSavingCaseStudy(false)
    }
  }

  // -----------------------
  // Save new experience
  // -----------------------
  const saveNewExperience = async () => {
    if (!newExperience.role || !newExperience.company || !newExperience.startDate) {
      setError("Please fill in the role, company, and start date")
      return
    }

    setSavingExperience(true)
    setError("")

    try {
      const result = await freelancerApi.addWorkExperience(newExperience)

      if (!result.success) {
        setError(result.error || "Failed to save work experience")
        return
      }

      setFormData((prev) => ({ ...prev, work_experience: result.work_experience || prev.work_experience }))
      resetNewExperience()
      setShowExperienceModal(false)
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error(err)
    } finally {
      setSavingExperience(false)
    }
  }

  // -----------------------
  // Submit full profile
  // -----------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Remove case_studies and work_experience from the update
      const { case_studies, work_experience, ...profileUpdates } = formData
      const response = await freelancerApi.updateProfile(profileUpdates)

      if (!response.profile) {
        setError(response.error || "Failed to update profile")
        return
      }

      mutate()
      setIsEditing(false)
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (!isClient) return null

  const profile = profileData?.profile

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#faf4e5" }}>
      {/* Header */}
      <header className="sticky top-0 z-40" style={{ borderBottom: "2px solid #f7af00", backgroundColor: "#faf4e5" }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-3 sm:py-4">
          {/* Mobile Header - Stacked */}
          <div className="sm:hidden">
            <div className="flex items-center justify-between mb-3">
              {/* Left: Back Button */}
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-f0eadd transition-colors shrink-0"
                style={{ color: "#31302f" }}
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>

              {/* Center: Title */}
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: "#f7af00" }}>
                  <User className="h-5 w-5" style={{ color: "#050504" }} />
                </div>
                <h1 className="text-lg font-bold" style={{ color: "#050504" }}>
                  My Profile
                </h1>
              </div>

              {/* Right: Mobile Menu Toggle */}
              <Button
                variant="ghost"
                className="mobile-menu-toggle p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{ color: "#31302f" }}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
              <div 
                className="mobile-menu absolute left-0 right-0 mx-4 mt-2 rounded-xl border shadow-lg z-50 animate-in slide-in-from-top-2 duration-200"
                style={{
                  backgroundColor: "#faf4e5",
                  borderColor: "#241C15"
                }}
              >
                <div className="p-4 space-y-3">
                  {/* Edit Profile Button */}
                  <Button
                    onClick={() => {
                      setIsEditing(!isEditing)
                      setMobileMenuOpen(false)
                    }}
                    className="flex items-center justify-between w-full font-semibold text-sm px-4 py-3 rounded-lg transition-all"
                    style={{
                      backgroundColor: isEditing ? "transparent" : "#f7af00",
                      color: isEditing ? "#31302f" : "#050504",
                      border: isEditing ? "2px solid #f7af00" : "none",
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      {isEditing ? (
                        <ArrowLeft className="h-4 w-4" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                      <span>{isEditing ? "Cancel Edit" : "Edit Profile"}</span>
                    </div>
                  </Button>

                  {/* Add Experience Button */}
                  <Button
                    onClick={() => {
                      resetNewExperience()
                      setShowExperienceModal(true)
                      setMobileMenuOpen(false)
                    }}
                    className="flex items-center justify-between w-full font-semibold text-sm px-4 py-3 rounded-lg transition-all"
                    style={{ 
                      backgroundColor: "#241C15", 
                      color: "#f7af00",
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <User className="h-4 w-4" />
                      <span>Add Experience</span>
                    </div>
                    <span className="text-xs bg-f7af00 text-050504 px-2 py-1 rounded">+</span>
                  </Button>

                  {/* Add Case Study Button */}
                  <Button
                    onClick={() => {
                      resetNewCaseStudyItem()
                      setShowCaseStudyModal(true)
                      setMobileMenuOpen(false)
                    }}
                    className="flex items-center justify-between w-full font-semibold text-sm px-4 py-3 rounded-lg transition-all"
                    style={{ 
                      backgroundColor: "#f7af00", 
                      color: "#050504",
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <User className="h-4 w-4" />
                      <span>Add Case Study</span>
                    </div>
                    <span className="text-xs bg-241C15 text-f7af00 px-2 py-1 rounded">+</span>
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Header - Horizontal */}
          <div className="hidden sm:flex items-center justify-between">
            {/* Left: Back button and Title */}
            <div className="flex items-center space-x-6">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-f0eadd transition-colors"
                style={{ color: "#31302f" }}
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <div className="h-8 w-px" style={{ backgroundColor: "#f7af00" }}></div>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: "#f7af00" }}>
                  <User className="h-5 w-5" style={{ color: "#050504" }} />
                </div>
                <h1 className="text-xl font-bold" style={{ color: "#050504" }}>
                  My Profile
                </h1>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div>
              <ProfileHeaderButtons
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                showExperienceModal={showExperienceModal}
                setShowExperienceModal={setShowExperienceModal}
                showCaseStudyModal={showCaseStudyModal}
                setShowCaseStudyModal={setShowCaseStudyModal}
                newExperience={newExperience}
                setNewExperience={setNewExperience}
                newCaseStudyItem={newCaseStudyItem}
                setNewCaseStudyItem={setNewCaseStudyItem}
                uploadingImages={uploadingImages}
                error={error}
                savingCaseStudy={savingCaseStudy}
                savingExperience={savingExperience}
                handleAddExperience={saveNewExperience}
                handleAddCaseStudyItem={saveNewCaseStudyItem}
                handleImageUpload={handleCaseStudyImageUpload}
                resetNewExperience={resetNewExperience}
                resetNewCaseStudyItem={resetNewCaseStudyItem}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8">
        <ProfileContent
          isEditing={isEditing}
          formData={formData}
          profile={profile}
          loading={loading}
          error={error}
          handleChange={handleChange}
          handleSkillsChange={handleSkillsChange}
          handleSubmit={handleSubmit}
          setFormData={setFormData}
          removeWorkExperience={removeWorkExperience}
          removeCaseStudyItem={removeCaseStudyItem}
          onAddExperience={() => {
            resetNewExperience()
            setShowExperienceModal(true)
          }}
          onStartEditing={() => setIsEditing(true)}
        />
      </main>

      {/* Mobile Modals (simplified for mobile) */}
      {/* Experience Modal for Mobile */}
      {showExperienceModal && (
        <div className="sm:hidden fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(36, 28, 21, 0.5)" }}>
          <div className="w-full max-w-md rounded-xl border" style={{ backgroundColor: "#faf4e5", borderColor: "#241C15" }}>
            <div className="p-4 space-y-4">
              <h3 className="text-lg font-bold" style={{ color: "#050504" }}>Add Experience</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#31302f" }}>Job Title</label>
                  <input
                    type="text"
                    value={newExperience.role}
                    onChange={(e) => setNewExperience({ ...newExperience, role: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    style={{ 
                      borderColor: "#241C15", 
                      color: "#31302f",
                      backgroundColor: "#f0eadd"
                    }}
                    placeholder="e.g., Senior Developer"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#31302f" }}>Company</label>
                  <input
                    type="text"
                    value={newExperience.company}
                    onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    style={{ 
                      borderColor: "#241C15", 
                      color: "#31302f",
                      backgroundColor: "#f0eadd"
                    }}
                    placeholder="Company name"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setShowExperienceModal(false)}
                  className="flex-1 text-sm px-4 py-2 rounded-lg"
                  style={{ 
                    color: "#31302f", 
                    borderColor: "#241C15",
                    backgroundColor: "transparent"
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveNewExperience}
                  disabled={savingExperience}
                  className="flex-1 text-sm px-4 py-2 rounded-lg"
                  style={{ 
                    backgroundColor: "#f7af00", 
                    color: "#050504"
                  }}
                >
                  {savingExperience ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Case Study Modal for Mobile */}
      {showCaseStudyModal && (
        <div className="sm:hidden fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(36, 28, 21, 0.5)" }}>
          <div className="w-full max-w-md rounded-xl border" style={{ backgroundColor: "#faf4e5", borderColor: "#241C15" }}>
            <div className="p-4 space-y-4">
              <h3 className="text-lg font-bold" style={{ color: "#050504" }}>Add Case Study</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#31302f" }}>Title</label>
                  <input
                    type="text"
                    value={newCaseStudyItem.title}
                    onChange={(e) => setNewCaseStudyItem({ ...newCaseStudyItem, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    style={{ 
                      borderColor: "#241C15", 
                      color: "#31302f",
                      backgroundColor: "#f0eadd"
                    }}
                    placeholder="Project Title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#31302f" }}>Description</label>
                  <textarea
                    value={newCaseStudyItem.description}
                    onChange={(e) => setNewCaseStudyItem({ ...newCaseStudyItem, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
                    style={{ 
                      borderColor: "#241C15", 
                      color: "#31302f",
                      backgroundColor: "#f0eadd"
                    }}
                    placeholder="Describe your project..."
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setShowCaseStudyModal(false)}
                  className="flex-1 text-sm px-4 py-2 rounded-lg"
                  style={{ 
                    color: "#31302f", 
                    borderColor: "#241C15",
                    backgroundColor: "transparent"
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveNewCaseStudyItem}
                  disabled={savingCaseStudy}
                  className="flex-1 text-sm px-4 py-2 rounded-lg"
                  style={{ 
                    backgroundColor: "#f7af00", 
                    color: "#050504"
                  }}
                >
                  {savingCaseStudy ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}