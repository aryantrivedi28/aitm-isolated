"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { ArrowLeft, User, Menu, Briefcase, Star, BookOpen, Wrench, Loader2 } from "lucide-react"
import { ProfileHeaderButtons } from "./component/profile-header-buttons"
import { ProfileContent } from "./component/profile-content"
import { freelancerApi } from "../../../../lib/freelancer-api"

const fetcher = (url: string) => fetch(url, { credentials: "include" }).then((res) => res.json())

// Define interfaces matching your Supabase table structure
interface CaseStudy {
  id?: string
  title: string
  description: string
  outcome: string
  technologies?: string[]
  category?: string
  image_url: string
  image_path?: string
  project_url?: string
}

interface Testimonial {
  id?: string
  client_name: string
  company: string
  content: string
  rating: number
  date?: string
  linkedin_url?: string
}

interface WorkExperience {
  id: string
  title: string
  role?: string
  company: string
  location?: string
  start_date: string
  startDate?: string
  end_date?: string
  endDate?: string
  current: boolean
  is_current?: boolean
  description: string
  achievements?: string[]
}

interface Education {
  id?: string
  degree: string
  institution: string
  graduation_year: number
  field_of_study?: string
}

interface Project {
  id?: string
  name: string
  description: string
  technologies?: string[]
  project_url?: string
  start_date?: string
  end_date?: string
}

interface FreelancerProfile {
  id: string
  name: string
  email: string
  phone: string | null
  title: string | null
  bio: string | null
  skills: string[]
  tools_tech_stack: string[]
  experience_years: number
  availability: string
  primary_category: string | null
  subcategory: string | null
  github_url: string | null
  linkedin_url: string | null
  twitter_url: string | null
  portfolio_url: string | null
  portfolio_links: string[] | any
  hourly_rate: number | null
  languages: string[]
  education: Education[] | any
  certifications: string[]
  resume_url: string | null
  projects: Project[]
  background_type: "tech" | "non-tech" | "both"
  profile_rating: number | null
  rating_feedback: string[]
  photo_url: string | null
  case_studies: CaseStudy[]
  testimonials: Testimonial[]
  work_experience: WorkExperience[]
  case_study_count: number
  case_study_categories: string[]
  verified: boolean
  profile_status: string
  review_status: string
  created_at: string
  updated_at: string
}

// Helper function to parse JSON fields
const parseJsonField = (field: any): any[] => {
  if (!field) return []
  if (Array.isArray(field)) return field
  if (typeof field === 'string') {
    try {
      return JSON.parse(field)
    } catch {
      return []
    }
  }
  return []
}

// Format education for display
const formatEducation = (edu: any): string => {
  if (typeof edu === "string") {
    try {
      const parsed = JSON.parse(edu)
      const parts = [parsed.degree, parsed.institution, parsed.year || parsed.graduation_year].filter(Boolean)
      return parts.join(" — ")
    } catch {
      return edu
    }
  }
  if (edu && typeof edu === "object") {
    const parts = [
      edu.degree,
      edu.institution,
      edu.graduation_year || edu.year
    ].filter(Boolean)
    return parts.join(" — ")
  }
  return ""
}

// Transform API profile shape into UI form state
const mapApiProfileToFormData = (profile: any): any => {
  if (!profile) return {}

  // Parse JSON fields
  const caseStudies = parseJsonField(profile.case_studies).map((item: any, index: number) => ({
    id: item.id || `cs-${index}`,
    title: item.title || "",
    description: item.description || "",
    outcome: item.outcome || "",
    image_url: item.image_url || "",
    image_path: item.image_path || "",
    project_url: item.project_url || "",
    category: item.category || "Web Development",
    technologies: Array.isArray(item.technologies) ? item.technologies : [],
  }))

  const testimonials = parseJsonField(profile.testimonials).map((item: any, index: number) => ({
    id: item.id || `test-${index}`,
    client_name: item.client_name || "",
    company: item.company || "",
    content: item.content || "",
    rating: item.rating || 5,
    date: item.date || "",
    linkedin_url: item.linkedin_url || "",
  }))

  const workExperience = parseJsonField(profile.work_experience).map((item: any, index: number) => ({
    id: item.id || `exp-${index}`,
    title: item.title || item.role || "",
    company: item.company || "",
    location: item.location || "",
    start_date: item.start_date || item.startDate || "",
    end_date: item.end_date || item.endDate || "",
    current: item.current || item.is_current || false,
    description: item.description || "",
    achievements: Array.isArray(item.achievements) ? item.achievements : [],
  }))

  const education = parseJsonField(profile.education).map((item: any) => formatEducation(item))

  const projects = parseJsonField(profile.projects).map((item: any, index: number) => ({
    id: item.id || `proj-${index}`,
    name: item.name || "",
    description: item.description || "",
    technologies: Array.isArray(item.technologies) ? item.technologies : [],
    project_url: item.project_url || "",
    start_date: item.start_date || "",
    end_date: item.end_date || "",
  }))

  // Parse portfolio_links if it exists
  let otherPortfolioLinks: string[] = []
  if (profile.portfolio_links) {
    if (Array.isArray(profile.portfolio_links)) {
      otherPortfolioLinks = profile.portfolio_links
    } else if (typeof profile.portfolio_links === 'string') {
      try {
        otherPortfolioLinks = JSON.parse(profile.portfolio_links)
      } catch {
        otherPortfolioLinks = []
      }
    } else if (typeof profile.portfolio_links === 'object') {
      otherPortfolioLinks = Object.values(profile.portfolio_links)
    }
  }

  return {
    id: profile.id || "",
    name: profile.name || "",
    email: profile.email || "",
    phone: profile.phone || "",
    title: profile.title || "",
    bio: profile.bio || "",
    skills: Array.isArray(profile.skills) ? profile.skills : [],
    tools_tech_stack: Array.isArray(profile.tools_tech_stack) ? profile.tools_tech_stack : [],
    experience_years: profile.experience_years || 0,
    availability: profile.availability || "full-time",
    primary_category: profile.primary_category || "",
    subcategory: profile.subcategory || "",
    github_url: profile.github_url || "",
    portfolio_url: profile.portfolio_url || "",
    linkedin_url: profile.linkedin_url || "",
    twitter_url: profile.twitter_url || "",
    other_portfolio_links: otherPortfolioLinks,
    hourly_rate: profile.hourly_rate ?? null,
    languages: Array.isArray(profile.languages) ? profile.languages : [],
    education: education,
    certifications: Array.isArray(profile.certifications) ? profile.certifications : [],
    resume_url: profile.resume_url || "",
    projects: projects,
    background_type: profile.background_type || "tech",
    profile_rating: profile.profile_rating ?? null,
    rating_feedback: Array.isArray(profile.rating_feedback) ? profile.rating_feedback : [],
    photo_url: profile.photo_url || "",
    case_studies: caseStudies,
    testimonials: testimonials,
    work_experience: workExperience,
    case_study_count: profile.case_study_count || caseStudies.length,
    case_study_categories: Array.isArray(profile.case_study_categories) ? profile.case_study_categories : [],
    verified: profile.verified || false,
    profile_status: profile.profile_status || "pending",
    review_status: profile.review_status || "pending",
    created_at: profile.created_at || "",
    updated_at: profile.updated_at || "",
  }
}

export default function FreelancerProfilePage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [uploadingImages, setUploadingImages] = useState<Record<string, boolean>>({})
  const [successMessage, setSuccessMessage] = useState("")

  const [showCaseStudyModal, setShowCaseStudyModal] = useState(false)
  const [showTestimonialModal, setShowTestimonialModal] = useState(false)
  const [showExperienceModal, setShowExperienceModal] = useState(false)
  const [savingCaseStudy, setSavingCaseStudy] = useState(false)
  const [savingTestimonial, setSavingTestimonial] = useState(false)
  const [savingExperience, setSavingExperience] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const [newCaseStudyItem, setNewCaseStudyItem] = useState<CaseStudy>({
    id: crypto.randomUUID(),
    title: "",
    description: "",
    outcome: "",
    image_url: "" as string,
    image_path: "",
    project_url: "",
    category: "Web Development",
    technologies: [],
  })

  const [newTestimonial, setNewTestimonial] = useState<Testimonial>({
    id: crypto.randomUUID(),
    client_name: "",
    company: "",
    content: "",
    rating: 5,
    date: new Date().toISOString().split('T')[0],
  })

  const [newExperience, setNewExperience] = useState<WorkExperience>({
    id: crypto.randomUUID() || `exp-${Date.now()}`,
    title: "",
    company: "",
    location: "",
    start_date: "",
    end_date: "",
    current: false,
    description: "",
    achievements: [],
  })

  const { data: profileData, mutate, isLoading } = useSWR("/api/freelancer/profile", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  const [formData, setFormData] = useState<any>({
    name: "",
    email: "",
    phone: "",
    title: "",
    bio: "",
    skills: [],
    tools_tech_stack: [],
    experience_years: 0,
    availability: "full-time",
    primary_category: "",
    subcategory: "",
    github_url: "",
    portfolio_url: "",
    linkedin_url: "",
    twitter_url: "",
    other_portfolio_links: [],
    hourly_rate: null,
    languages: [],
    education: [],
    certifications: [],
    resume_url: "",
    projects: [],
    background_type: "tech",
    profile_rating: null,
    rating_feedback: [],
    photo_url: "",
    case_studies: [],
    testimonials: [],
    work_experience: [],
    case_study_count: 0,
    case_study_categories: [],
    verified: false,
    profile_status: "pending",
    review_status: "pending",
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

  // Clear messages after 3 seconds
  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        setError("")
        setSuccessMessage("")
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [error, successMessage])

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
          image_url: result.imageUrl || "",
          image_path: result.imagePath || "",
        }))
      } else {
        // Update existing case study in the database
        const caseStudy = formData.case_studies.find((cs: CaseStudy) => cs.id === itemId)
        if (caseStudy) {
          const updatedCaseStudy = {
            ...caseStudy,
            image_url: result.imageUrl,
            image_path: result.imagePath
          }
          await freelancerApi.updateCaseStudy(itemId, updatedCaseStudy)
          
          // Refresh data
          mutate()
          setSuccessMessage("Image uploaded successfully")
        }
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
      const result = await freelancerApi.deleteCaseStudyImage(imagePath, itemId)

      if (result.success) {
        if (itemId === "new-case-study") {
          setNewCaseStudyItem((prev) => ({
            ...prev,
            image_url: "",
            image_path: "",
          }))
        } else {
          // Refresh data
          mutate()
          setSuccessMessage("Image deleted successfully")
        }
      }
    } catch (err) {
      console.error("Failed to delete image:", err)
      setError("Failed to delete image")
    }
  }

  // -----------------------
  // Remove case study
  // -----------------------
  const removeCaseStudyItem = async (id: string) => {
    try {
      const result = await freelancerApi.deleteCaseStudy(id)

      if (result.success) {
        setSuccessMessage("Case study deleted successfully")
        mutate() // Refresh data
      } else {
        setError(result.error || "Failed to delete case study")
      }
    } catch (err) {
      console.error("Failed to delete case study:", err)
      setError("Failed to delete case study")
    }
  }

  // -----------------------
  // Remove testimonial
  // -----------------------
  const removeTestimonial = async (id: string) => {
    try {
      const result = await freelancerApi.deleteTestimonial(id)

      if (result.success) {
        setSuccessMessage("Testimonial deleted successfully")
        mutate() // Refresh data
      } else {
        setError(result.error || "Failed to delete testimonial")
      }
    } catch (err) {
      console.error("Failed to delete testimonial:", err)
      setError("Failed to delete testimonial")
    }
  }

  // -----------------------
  // Remove work experience
  // -----------------------
  const removeWorkExperience = async (id: string) => {
    try {
      const result = await freelancerApi.deleteWorkExperience(id)

      if (result.success) {
        setSuccessMessage("Work experience deleted successfully")
        mutate() // Refresh data
      } else {
        setError(result.error || "Failed to delete work experience")
      }
    } catch (err) {
      console.error("Failed to delete work experience:", err)
      setError("Failed to delete work experience")
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
      outcome: "",
      image_url: "" as string,
      image_path: "",
      project_url: "",
      category: "Web Development",
      technologies: [],
    })
  }

  const resetNewTestimonial = () => {
    setNewTestimonial({
      id: crypto.randomUUID(),
      client_name: "",
      company: "",
      content: "",
      rating: 5,
      date: new Date().toISOString().split('T')[0],
    })
  }

  const resetNewExperience = () => {
    setNewExperience({
      id: crypto.randomUUID() || `exp-${Date.now()}`,
      title: "",
      company: "",
      location: "",
      start_date: "",
      end_date: "",
      current: false,
      description: "",
      achievements: [],
    })
  }

  // -----------------------
  // Handlers for form fields
  // -----------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === 'number' ? (value ? Number.parseFloat(value) : null) : value,
    }))
  }

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "")
    
    setFormData((prev: any) => ({
      ...prev,
      skills,
    }))
  }

  const handleToolsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tools = e.target.value
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t !== "")
    
    setFormData((prev: any) => ({
      ...prev,
      tools_tech_stack: tools,
    }))
  }

  const handleLanguagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const languages = e.target.value
      .split(",")
      .map((l) => l.trim())
      .filter((l) => l !== "")
    
    setFormData((prev: any) => ({
      ...prev,
      languages,
    }))
  }

  const handleCertificationsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const certs = e.target.value
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c !== "")
    
    setFormData((prev: any) => ({
      ...prev,
      certifications: certs,
    }))
  }

  // Save new case study
  const saveNewCaseStudyItem = async () => {
    if (!newCaseStudyItem.title || !newCaseStudyItem.description || !newCaseStudyItem.outcome) {
      setError("Please fill in the title, description, and outcome")
      return
    }

    setSavingCaseStudy(true)
    setError("")

    try {
      const result = await freelancerApi.addCaseStudy(newCaseStudyItem)

      if (result.success) {
        setSuccessMessage("Case study added successfully")
        mutate() // Refresh data
        resetNewCaseStudyItem()
        setShowCaseStudyModal(false)
      } else {
        setError(result.error || "Failed to save case study")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error(err)
    } finally {
      setSavingCaseStudy(false)
    }
  }

  // Save new testimonial
  const saveNewTestimonial = async () => {
    if (!newTestimonial.client_name || !newTestimonial.content) {
      setError("Please fill in the client name and testimonial content")
      return
    }

    setSavingTestimonial(true)
    setError("")

    try {
      const result = await freelancerApi.addTestimonial(newTestimonial)

      if (result.success) {
        setSuccessMessage("Testimonial added successfully")
        mutate() // Refresh data
        resetNewTestimonial()
        setShowTestimonialModal(false)
      } else {
        setError(result.error || "Failed to save testimonial")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error(err)
    } finally {
      setSavingTestimonial(false)
    }
  }

  // Save new experience
  const saveNewExperience = async () => {
    if (!newExperience.title || !newExperience.company || !newExperience.start_date) {
      setError("Please fill in the title, company, and start date")
      return
    }

    setSavingExperience(true)
    setError("")

    try {
      const result = await freelancerApi.addWorkExperience(newExperience)

      if (result.success) {
        setSuccessMessage("Work experience added successfully")
        mutate() // Refresh data
        resetNewExperience()
        setShowExperienceModal(false)
      } else {
        setError(result.error || "Failed to save work experience")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error(err)
    } finally {
      setSavingExperience(false)
    }
  }

  // Submit full profile
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Prepare profile updates
      const profileUpdates = {
        name: formData.name,
        title: formData.title,
        bio: formData.bio,
        phone: formData.phone,
        experience_years: formData.experience_years,
        availability: formData.availability,
        primary_category: formData.primary_category,
        subcategory: formData.subcategory,
        github_url: formData.github_url,
        linkedin_url: formData.linkedin_url,
        twitter_url: formData.twitter_url,
        portfolio_url: formData.portfolio_url,
        hourly_rate: formData.hourly_rate ? Number(formData.hourly_rate) : null,
        background_type: formData.background_type,
        photo_url: formData.photo_url,
        skills: formData.skills,
        tools_tech_stack: formData.tools_tech_stack,
        languages: formData.languages,
        certifications: formData.certifications,
      }

      const response = await freelancerApi.updateProfile(profileUpdates)

      if (response.success) {
        setSuccessMessage("Profile updated successfully")
        mutate() // Refresh data
        setIsEditing(false)
      } else {
        setError(response.error || "Failed to update profile")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Submit for review
  const handleSubmitForReview = async () => {
    setLoading(true)
    setError("")

    try {
      const result = await freelancerApi.submitForReview()

      if (result.success) {
        setSuccessMessage("Profile submitted for review successfully")
        mutate() // Refresh data
      } else {
        setError(result.error || "Failed to submit for review")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Check if profile is complete enough for review
  const canSubmitForReview = () => {
    return (
      formData.name &&
      formData.title &&
      formData.bio &&
      formData.skills.length > 0 &&
      formData.experience_years > 0
    )
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
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-opacity-80 transition-colors shrink-0"
                style={{ color: "#31302f", backgroundColor: "transparent" }}
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
                style={{ color: "#31302f", backgroundColor: "transparent" }}
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
                      <Briefcase className="h-4 w-4" />
                      <span>Add Experience</span>
                    </div>
                    <span className="text-xs bg-[#f7af00] text-[#050504] px-2 py-1 rounded">+</span>
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
                      <BookOpen className="h-4 w-4" />
                      <span>Add Case Study</span>
                    </div>
                    <span className="text-xs bg-[#241C15] text-[#f7af00] px-2 py-1 rounded">+</span>
                  </Button>

                  {/* Add Testimonial Button */}
                  <Button
                    onClick={() => {
                      resetNewTestimonial()
                      setShowTestimonialModal(true)
                      setMobileMenuOpen(false)
                    }}
                    className="flex items-center justify-between w-full font-semibold text-sm px-4 py-3 rounded-lg transition-all"
                    style={{ 
                      backgroundColor: "#241C15", 
                      color: "#f7af00",
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <Star className="h-4 w-4" />
                      <span>Add Testimonial</span>
                    </div>
                    <span className="text-xs bg-[#f7af00] text-[#050504] px-2 py-1 rounded">+</span>
                  </Button>

                  {/* Submit for Review Button */}
                  {formData.review_status === "pending" && canSubmitForReview() && (
                    <Button
                      onClick={() => {
                        handleSubmitForReview()
                        setMobileMenuOpen(false)
                      }}
                      disabled={loading}
                      className="flex items-center justify-center w-full font-semibold text-sm px-4 py-3 rounded-lg transition-all disabled:opacity-50"
                      style={{ 
                        backgroundColor: "#f7af00", 
                        color: "#050504",
                      }}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit for Review"
                      )}
                    </Button>
                  )}

                  {formData.review_status === "pending_review" && (
                    <div className="text-center p-3 rounded-lg" style={{ backgroundColor: "#f0eadd" }}>
                      <p className="text-xs font-medium" style={{ color: "#241C15" }}>
                        Profile under review
                      </p>
                    </div>
                  )}

                  {formData.verified && (
                    <div className="text-center p-3 rounded-lg" style={{ backgroundColor: "#f0eadd" }}>
                      <p className="text-xs font-medium flex items-center justify-center space-x-1" style={{ color: "#241C15" }}>
                        <Star className="h-3 w-3 fill-[#f7af00]" style={{ color: "#f7af00" }} />
                        <span>Verified Freelancer</span>
                      </p>
                    </div>
                  )}
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
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-opacity-80 transition-colors"
                style={{ color: "#31302f", backgroundColor: "transparent" }}
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
                {formData.verified && (
                  <span className="px-2 py-1 text-xs font-semibold rounded-full" style={{ backgroundColor: "#f7af00", color: "#050504" }}>
                    Verified
                  </span>
                )}
                {formData.profile_rating && (
                  <div className="flex items-center space-x-1 px-2 py-1 rounded-full" style={{ backgroundColor: "#241C15" }}>
                    <Star className="h-3 w-3 fill-[#f7af00]" style={{ color: "#f7af00" }} />
                    <span className="text-xs font-medium" style={{ color: "#f7af00" }}>{formData.profile_rating}</span>
                  </div>
                )}
                {formData.review_status === "pending_review" && (
                  <span className="px-2 py-1 text-xs font-semibold rounded-full" style={{ backgroundColor: "#f0eadd", color: "#241C15" }}>
                    Under Review
                  </span>
                )}
              </div>
            </div>

            {/* Right: Action Buttons */}
            <ProfileHeaderButtons
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              showExperienceModal={showExperienceModal}
              setShowExperienceModal={setShowExperienceModal}
              showCaseStudyModal={showCaseStudyModal}
              setShowCaseStudyModal={setShowCaseStudyModal}
              showTestimonialModal={showTestimonialModal}
              setShowTestimonialModal={setShowTestimonialModal}
              newExperience={newExperience}
              setNewExperience={setNewExperience}
              newCaseStudyItem={newCaseStudyItem}
              setNewCaseStudyItem={setNewCaseStudyItem}
              newTestimonial={newTestimonial}
              setNewTestimonial={setNewTestimonial}
              uploadingImages={uploadingImages}
              error={error}
              savingCaseStudy={savingCaseStudy}
              savingTestimonial={savingTestimonial}
              savingExperience={savingExperience}
              handleAddExperience={saveNewExperience}
              handleAddCaseStudyItem={saveNewCaseStudyItem}
              handleAddTestimonial={saveNewTestimonial}
              handleImageUpload={handleCaseStudyImageUpload}
              handleImageDelete={handleCaseStudyImageDelete}
              resetNewExperience={resetNewExperience}
              resetNewCaseStudyItem={resetNewCaseStudyItem}
              resetNewTestimonial={resetNewTestimonial}
              onSubmitForReview={handleSubmitForReview}
              reviewStatus={formData.review_status}
              canSubmitForReview={canSubmitForReview()}
              loading={loading}
            />
          </div>
        </div>
      </header>

      {/* Messages */}
      {(error || successMessage) && (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 mt-4">
          <div
            className={`p-4 rounded-lg border ${
              error ? "border-red-500 bg-red-50" : "border-green-500 bg-green-50"
            }`}
            style={{
              backgroundColor: error ? "#fee" : "#f0f9f0",
              borderColor: error ? "#f00" : "#0a0",
            }}
          >
            <p className="text-sm" style={{ color: error ? "#c00" : "#060" }}>
              {error || successMessage}
            </p>
          </div>
        </div>
      )}

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: "#f7af00" }}></div>
          </div>
        ) : (
          <ProfileContent
            isEditing={isEditing}
            formData={formData}
            profile={profile}
            loading={loading}
            error={error}
            handleChange={handleChange}
            handleSkillsChange={handleSkillsChange}
            handleToolsChange={handleToolsChange}
            handleLanguagesChange={handleLanguagesChange}
            handleCertificationsChange={handleCertificationsChange}
            handleSubmit={handleSubmit}
            setFormData={setFormData}
            removeWorkExperience={removeWorkExperience}
            removeCaseStudyItem={removeCaseStudyItem}
            removeTestimonial={removeTestimonial}
            onAddExperience={() => {
              resetNewExperience()
              setShowExperienceModal(true)
            }}
            onAddCaseStudy={() => {
              resetNewCaseStudyItem()
              setShowCaseStudyModal(true)
            }}
            onAddTestimonial={() => {
              resetNewTestimonial()
              setShowTestimonialModal(true)
            }}
            onStartEditing={() => setIsEditing(true)}
          />
        )}
      </main>

      {/* Mobile Modals */}
      {showExperienceModal && (
        <div className="sm:hidden fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(36, 28, 21, 0.5)" }}>
          <div className="w-full max-w-md rounded-xl border" style={{ backgroundColor: "#faf4e5", borderColor: "#241C15" }}>
            <div className="p-4 space-y-4">
              <h3 className="text-lg font-bold" style={{ color: "#050504" }}>Add Experience</h3>
              
              <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#31302f" }}>Job Title *</label>
                  <input
                    type="text"
                    value={newExperience.title}
                    onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
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
                  <label className="block text-sm font-medium mb-1" style={{ color: "#31302f" }}>Company *</label>
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

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#31302f" }}>Location</label>
                  <input
                    type="text"
                    value={newExperience.location}
                    onChange={(e) => setNewExperience({ ...newExperience, location: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    style={{ 
                      borderColor: "#241C15", 
                      color: "#31302f",
                      backgroundColor: "#f0eadd"
                    }}
                    placeholder="City, Country"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#31302f" }}>Start Date *</label>
                  <input
                    type="month"
                    value={newExperience.start_date}
                    onChange={(e) => setNewExperience({ ...newExperience, start_date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    style={{ 
                      borderColor: "#241C15", 
                      color: "#31302f",
                      backgroundColor: "#f0eadd"
                    }}
                  />
                </div>

                {!newExperience.current && (
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: "#31302f" }}>End Date</label>
                    <input
                      type="month"
                      value={newExperience.end_date}
                      onChange={(e) => setNewExperience({ ...newExperience, end_date: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      style={{ 
                        borderColor: "#241C15", 
                        color: "#31302f",
                        backgroundColor: "#f0eadd"
                      }}
                    />
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="current-job-mobile"
                    checked={newExperience.current}
                    onChange={(e) => setNewExperience({ ...newExperience, current: e.target.checked })}
                    className="w-4 h-4"
                    style={{ accentColor: "#f7af00" }}
                  />
                  <label htmlFor="current-job-mobile" className="text-sm" style={{ color: "#31302f" }}>
                    I currently work here
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#31302f" }}>Description</label>
                  <textarea
                    value={newExperience.description}
                    onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
                    style={{ 
                      borderColor: "#241C15", 
                      color: "#31302f",
                      backgroundColor: "#f0eadd"
                    }}
                    placeholder="Describe your responsibilities and achievements..."
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setShowExperienceModal(false)
                    resetNewExperience()
                  }}
                  className="flex-1 text-sm px-4 py-2 rounded-lg"
                  style={{ 
                    color: "#31302f", 
                    border: "1px solid #241C15",
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
                  {savingExperience ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
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
              
              <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#31302f" }}>Title *</label>
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
                  <label className="block text-sm font-medium mb-1" style={{ color: "#31302f" }}>Description *</label>
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

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#31302f" }}>Outcome *</label>
                  <input
                    type="text"
                    value={newCaseStudyItem.outcome}
                    onChange={(e) => setNewCaseStudyItem({ ...newCaseStudyItem, outcome: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    style={{ 
                      borderColor: "#241C15", 
                      color: "#31302f",
                      backgroundColor: "#f0eadd"
                    }}
                    placeholder="e.g., Increased sales by 50%"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#31302f" }}>Category</label>
                  <select
                    value={newCaseStudyItem.category}
                    onChange={(e) => setNewCaseStudyItem({ ...newCaseStudyItem, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    style={{ 
                      borderColor: "#241C15", 
                      color: "#31302f",
                      backgroundColor: "#f0eadd"
                    }}
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="Shopify">Shopify</option>
                    <option value="SEO">SEO</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#31302f" }}>Project URL</label>
                  <input
                    type="url"
                    value={newCaseStudyItem.project_url}
                    onChange={(e) => setNewCaseStudyItem({ ...newCaseStudyItem, project_url: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    style={{ 
                      borderColor: "#241C15", 
                      color: "#31302f",
                      backgroundColor: "#f0eadd"
                    }}
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#31302f" }}>Technologies (comma-separated)</label>
                  <input
                    type="text"
                    value={newCaseStudyItem.technologies?.join(", ")}
                    onChange={(e) => setNewCaseStudyItem({ 
                      ...newCaseStudyItem, 
                      technologies: e.target.value.split(",").map(t => t.trim()).filter(Boolean)
                    })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    style={{ 
                      borderColor: "#241C15", 
                      color: "#31302f",
                      backgroundColor: "#f0eadd"
                    }}
                    placeholder="React, Node.js, MongoDB"
                  />
                </div>

                {/* Image Upload Section */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#31302f" }}>
                    Cover Image
                  </label>
                  {newCaseStudyItem.image_url ? (
                    <div className="relative">
                      <img
                        src={newCaseStudyItem.image_url}
                        alt="Case study cover"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => handleCaseStudyImageDelete("new-case-study", newCaseStudyItem.image_path || "")}
                        className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="case-study-image-mobile"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer"
                        style={{ borderColor: "#241C15", backgroundColor: "#f0eadd" }}
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 mb-3" style={{ color: "#241C15" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-xs" style={{ color: "#241C15" }}>
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs" style={{ color: "#31302f" }}>PNG, JPG, GIF, WebP (Max 5MB)</p>
                        </div>
                        <input
                          id="case-study-image-mobile"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              handleCaseStudyImageUpload("new-case-study", file)
                            }
                          }}
                        />
                      </label>
                    </div>
                  )}
                  {uploadingImages["new-case-study"] && (
                    <div className="mt-2 flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin" style={{ color: "#f7af00" }} />
                      <span className="text-xs ml-2" style={{ color: "#31302f" }}>Uploading...</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setShowCaseStudyModal(false)
                    resetNewCaseStudyItem()
                  }}
                  className="flex-1 text-sm px-4 py-2 rounded-lg"
                  style={{ 
                    color: "#31302f", 
                    border: "1px solid #241C15",
                    backgroundColor: "transparent"
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveNewCaseStudyItem}
                  disabled={savingCaseStudy || uploadingImages["new-case-study"]}
                  className="flex-1 text-sm px-4 py-2 rounded-lg"
                  style={{ 
                    backgroundColor: "#f7af00", 
                    color: "#050504"
                  }}
                >
                  {savingCaseStudy ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Testimonial Modal for Mobile */}
      {showTestimonialModal && (
        <div className="sm:hidden fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(36, 28, 21, 0.5)" }}>
          <div className="w-full max-w-md rounded-xl border" style={{ backgroundColor: "#faf4e5", borderColor: "#241C15" }}>
            <div className="p-4 space-y-4">
              <h3 className="text-lg font-bold" style={{ color: "#050504" }}>Add Testimonial</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#31302f" }}>Client Name *</label>
                  <input
                    type="text"
                    value={newTestimonial.client_name}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, client_name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    style={{ 
                      borderColor: "#241C15", 
                      color: "#31302f",
                      backgroundColor: "#f0eadd"
                    }}
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#31302f" }}>Company</label>
                  <input
                    type="text"
                    value={newTestimonial.company}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, company: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    style={{ 
                      borderColor: "#241C15", 
                      color: "#31302f",
                      backgroundColor: "#f0eadd"
                    }}
                    placeholder="Company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#31302f" }}>Testimonial *</label>
                  <textarea
                    value={newTestimonial.content}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, content: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
                    style={{ 
                      borderColor: "#241C15", 
                      color: "#31302f",
                      backgroundColor: "#f0eadd"
                    }}
                    placeholder="What did the client say about your work?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#31302f" }}>Rating</label>
                  <select
                    value={newTestimonial.rating}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, rating: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    style={{ 
                      borderColor: "#241C15", 
                      color: "#31302f",
                      backgroundColor: "#f0eadd"
                    }}
                  >
                    {[5, 4, 3, 2, 1].map(num => (
                      <option key={num} value={num}>{num} Star{num !== 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#31302f" }}>Date</label>
                  <input
                    type="date"
                    value={newTestimonial.date}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    style={{ 
                      borderColor: "#241C15", 
                      color: "#31302f",
                      backgroundColor: "#f0eadd"
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#31302f" }}>LinkedIn URL (optional)</label>
                  <input
                    type="url"
                    value={newTestimonial.linkedin_url}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, linkedin_url: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    style={{ 
                      borderColor: "#241C15", 
                      color: "#31302f",
                      backgroundColor: "#f0eadd"
                    }}
                    placeholder="https://linkedin.com/in/client"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setShowTestimonialModal(false)
                    resetNewTestimonial()
                  }}
                  className="flex-1 text-sm px-4 py-2 rounded-lg"
                  style={{ 
                    color: "#31302f", 
                    border: "1px solid #241C15",
                    backgroundColor: "transparent"
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveNewTestimonial}
                  disabled={savingTestimonial}
                  className="flex-1 text-sm px-4 py-2 rounded-lg"
                  style={{ 
                    backgroundColor: "#f7af00", 
                    color: "#050504"
                  }}
                >
                  {savingTestimonial ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}