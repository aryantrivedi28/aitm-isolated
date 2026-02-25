"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  User,
  Mail,
  Briefcase,
  Layers,
  Clock,
  Wrench,
  Link as LinkIcon,
  FileText,
  Star,
  ChevronRight,
  ChevronLeft,
  Save,
  Plus,
  X,
  AlertCircle,
  CheckCircle,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Award,
  GraduationCap,
  BookOpen,
  Target,
  TrendingUp,
  DollarSign,
  Calendar
} from "lucide-react"

// Define types matching our database structure
interface CaseStudyMetric {
  label: string
  value: number
  type: 'number' | 'percentage' | 'currency'
}

interface CaseStudy {
  title: string
  short_summary: string
  category: string
  industry: string
  problem_statement: string
  solution_provided: string
  results_overview: string
  metrics: CaseStudyMetric[]
  technologies: string[]
  image_url?: string
  project_url?: string
}

interface Testimonial {
  client_name: string
  company: string
  content: string
  rating: number
  date?: string
  linkedin_url?: string
  role?: string
}

interface WorkExperience {
  title: string
  company: string
  start_date: string
  end_date?: string
  current: boolean
  description: string
  achievements?: string[]
}

interface Education {
  degree: string
  institution: string
  graduation_year: number
  field_of_study?: string
  grade?: string
}

interface FormData {
  // Basic Info
  name: string
  email: string
  phone?: string
  title: string
  bio: string

  // Categories & Expertise
  primary_category: string
  subcategories: string[]
  experience_years: number

  // Skills & Tools
  skills: string[]
  tools_tech_stack: string[]

  // Links
  portfolio_links: {
    website?: string
    github?: string
    linkedin?: string
    twitter?: string
    other: string[]
  }

  // Portfolio Content
  case_studies: CaseStudy[]
  testimonials: Testimonial[]

  // Experience
  work_experience: WorkExperience[]
  education: Education[]

  // Additional
  languages: string[]
  certifications: string[]
  availability: string
  hourly_rate?: number
  preferred_project_size?: string

  // URLs (for backward compatibility)
  photo_url?: string
  github_url?: string
  linkedin_url?: string
  twitter_url?: string
  portfolio_url?: string
}

// Categories with their subcategories
const categoryOptions = [
  {
    name: "Web Development",
    subcategories: ["Frontend", "Backend", "Full Stack", "React/Next.js", "Node.js", "Python/Django", "Ruby on Rails", "PHP/Laravel"],
    industries: ["E-commerce", "SaaS", "Education", "Healthcare", "Finance", "Real Estate", "Travel", "Media"]
  },
  {
    name: "Shopify Development",
    subcategories: ["Theme Development", "App Development", "Store Setup", "Migration", "Customization", "Performance Optimization"],
    industries: ["E-commerce", "Retail", "Fashion", "Electronics", "Home & Garden", "Beauty"]
  },
  {
    name: "SEO Optimization",
    subcategories: ["Technical SEO", "On-page SEO", "Off-page SEO", "Local SEO", "E-commerce SEO", "International SEO"],
    industries: ["E-commerce", "SaaS", "Local Business", "Professional Services", "Publishing", "Travel"]
  },
  {
    name: "UI/UX Design",
    subcategories: ["Web Design", "Mobile Design", "User Research", "Prototyping", "Design Systems", "Wireframing"],
    industries: ["SaaS", "E-commerce", "Mobile Apps", "Enterprise", "Startups"]
  },
  {
    name: "Digital Marketing",
    subcategories: ["Social Media", "Email Marketing", "PPC Advertising", "Content Strategy", "Analytics", "Growth Hacking"],
    industries: ["E-commerce", "SaaS", "B2B", "B2C", "Professional Services"]
  }
]

// Availability options
const availabilityOptions = [
  { value: "full-time", label: "Full Time (40+ hrs/week)" },
  { value: "part-time", label: "Part Time (20-30 hrs/week)" },
  { value: "contract", label: "Contract/Freelance" },
  { value: "available", label: "Available for Work" }
]

// Project size options
const projectSizeOptions = [
  "Small (Under $5,000)",
  "Medium ($5,000 - $20,000)",
  "Large ($20,000 - $50,000)",
  "Enterprise ($50,000+)"
]

export default function FreelancerOnboarding() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Input states for dynamic additions
  const [toolInput, setToolInput] = useState("")
  const [skillInput, setSkillInput] = useState("")
  const [languageInput, setLanguageInput] = useState("")
  const [certificationInput, setCertificationInput] = useState("")
  const [subcategoryInput, setSubcategoryInput] = useState("")

  // UI states
  const [showToolInput, setShowToolInput] = useState(false)
  const [showSkillInput, setShowSkillInput] = useState(false)
  const [showLanguageInput, setShowLanguageInput] = useState(false)
  const [showCertificationInput, setShowCertificationInput] = useState(false)
  const [showSubcategoryInput, setShowSubcategoryInput] = useState(false)

  // Metric input for case studies
  const [newMetric, setNewMetric] = useState<CaseStudyMetric>({ label: "", value: 0, type: "number" })
  const [activeCaseStudyIndex, setActiveCaseStudyIndex] = useState<number | null>(null)

  // Initialize form data
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    title: "",
    bio: "",
    primary_category: "",
    subcategories: [],
    experience_years: 0,
    skills: [],
    tools_tech_stack: [],
    portfolio_links: {
      website: "",
      github: "",
      linkedin: "",
      twitter: "",
      other: []
    },
    case_studies: [],
    testimonials: [],
    work_experience: [],
    education: [],
    languages: [],
    certifications: [],
    availability: "available",
    hourly_rate: undefined,
    preferred_project_size: "",
    github_url: "",
    linkedin_url: "",
    twitter_url: "",
    portfolio_url: ""
  })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/freelancer/me")

        const text = await response.text()

        let data: any = {}

        try {
          data = JSON.parse(text)
        } catch {
          console.error("Auth API returned HTML:", text)
          return
        }

        if (data.user) {
          setFormData(prev => ({
            ...prev,
            name: data.user.name || "",
            email: data.user.email || "",
            phone: data.user.phone || "",
            photo_url: data.user.photo_url || ""
          }))
        }

      } catch (err) {
        console.error("Failed to fetch user data:", err)
      }
    }

    fetchUserData()
  }, [])


  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    // Handle numeric inputs
    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Handle skills
  const addSkill = () => {
    if (skillInput.trim()) {
      if (!formData.skills.includes(skillInput.trim())) {
        setFormData(prev => ({
          ...prev,
          skills: [...prev.skills, skillInput.trim()]
        }))
      }
      setSkillInput("")
      setShowSkillInput(false)
    }
  }

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }))
  }

  // Handle tools/tech stack
  const addTool = () => {
    if (toolInput.trim()) {
      if (!formData.tools_tech_stack.includes(toolInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tools_tech_stack: [...prev.tools_tech_stack, toolInput.trim()]
        }))
      }
      setToolInput("")
      setShowToolInput(false)
    }
  }

  const removeTool = (tool: string) => {
    setFormData(prev => ({
      ...prev,
      tools_tech_stack: prev.tools_tech_stack.filter(t => t !== tool)
    }))
  }

  // Handle subcategories
  const addSubcategory = () => {
    if (subcategoryInput.trim()) {
      if (!formData.subcategories.includes(subcategoryInput.trim())) {
        setFormData(prev => ({
          ...prev,
          subcategories: [...prev.subcategories, subcategoryInput.trim()]
        }))
      }
      setSubcategoryInput("")
      setShowSubcategoryInput(false)
    }
  }

  const removeSubcategory = (subcategory: string) => {
    setFormData(prev => ({
      ...prev,
      subcategories: prev.subcategories.filter(s => s !== subcategory)
    }))
  }

  // Handle languages
  const addLanguage = () => {
    if (languageInput.trim()) {
      if (!formData.languages.includes(languageInput.trim())) {
        setFormData(prev => ({
          ...prev,
          languages: [...prev.languages, languageInput.trim()]
        }))
      }
      setLanguageInput("")
      setShowLanguageInput(false)
    }
  }

  const removeLanguage = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l !== language)
    }))
  }

  // Handle certifications
  const addCertification = () => {
    if (certificationInput.trim()) {
      if (!formData.certifications.includes(certificationInput.trim())) {
        setFormData(prev => ({
          ...prev,
          certifications: [...prev.certifications, certificationInput.trim()]
        }))
      }
      setCertificationInput("")
      setShowCertificationInput(false)
    }
  }

  const removeCertification = (cert: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c !== cert)
    }))
  }

  // Handle portfolio links
  const handlePortfolioLinkChange = (field: keyof typeof formData.portfolio_links, value: string) => {
    setFormData(prev => ({
      ...prev,
      portfolio_links: {
        ...prev.portfolio_links,
        [field]: value
      }
    }))
  }

  const addOtherPortfolioLink = () => {
    setFormData(prev => ({
      ...prev,
      portfolio_links: {
        ...prev.portfolio_links,
        other: [...(prev.portfolio_links.other || []), ""]
      }
    }))
  }

  const updateOtherPortfolioLink = (index: number, value: string) => {
    const otherLinks = [...(formData.portfolio_links.other || [])]
    otherLinks[index] = value
    setFormData(prev => ({
      ...prev,
      portfolio_links: {
        ...prev.portfolio_links,
        other: otherLinks
      }
    }))
  }

  const removeOtherPortfolioLink = (index: number) => {
    const otherLinks = formData.portfolio_links.other?.filter((_, i) => i !== index)
    setFormData(prev => ({
      ...prev,
      portfolio_links: {
        ...prev.portfolio_links,
        other: otherLinks
      }
    }))
  }

  // Handle case studies (updated for new structure)
  const addCaseStudy = () => {
    const newCaseStudy: CaseStudy = {
      title: "",
      short_summary: "",
      category: formData.primary_category,
      industry: "",
      problem_statement: "",
      solution_provided: "",
      results_overview: "",
      metrics: [],
      technologies: [],
      image_url: "",
      project_url: ""
    }

    setFormData(prev => ({
      ...prev,
      case_studies: [...prev.case_studies, newCaseStudy]
    }))
  }

  const updateCaseStudy = (index: number, field: keyof CaseStudy, value: any) => {
    setFormData(prev => ({
      ...prev,
      case_studies: prev.case_studies.map((cs, i) =>
        i === index ? { ...cs, [field]: value } : cs
      )
    }))
  }

  const removeCaseStudy = (index: number) => {
    setFormData(prev => ({
      ...prev,
      case_studies: prev.case_studies.filter((_, i) => i !== index)
    }))
  }

  // Handle metrics for case studies
  const addMetric = (caseStudyIndex: number) => {
    if (newMetric.label && newMetric.value) {
      setFormData(prev => ({
        ...prev,
        case_studies: prev.case_studies.map((cs, i) =>
          i === caseStudyIndex
            ? { ...cs, metrics: [...cs.metrics, { ...newMetric }] }
            : cs
        )
      }))
      setNewMetric({ label: "", value: 0, type: "number" })
      setActiveCaseStudyIndex(null)
    }
  }

  const removeMetric = (caseStudyIndex: number, metricIndex: number) => {
    setFormData(prev => ({
      ...prev,
      case_studies: prev.case_studies.map((cs, i) =>
        i === caseStudyIndex
          ? { ...cs, metrics: cs.metrics.filter((_, mi) => mi !== metricIndex) }
          : cs
      )
    }))
  }

  // Handle technologies for case studies
  const addCaseStudyTechnology = (caseStudyIndex: number, tech: string) => {
    if (tech.trim()) {
      setFormData(prev => ({
        ...prev,
        case_studies: prev.case_studies.map((cs, i) =>
          i === caseStudyIndex
            ? { ...cs, technologies: [...cs.technologies, tech.trim()] }
            : cs
        )
      }))
    }
  }

  const removeCaseStudyTechnology = (caseStudyIndex: number, tech: string) => {
    setFormData(prev => ({
      ...prev,
      case_studies: prev.case_studies.map((cs, i) =>
        i === caseStudyIndex
          ? { ...cs, technologies: cs.technologies.filter(t => t !== tech) }
          : cs
      )
    }))
  }

  // Handle testimonials
  const addTestimonial = () => {
    const newTestimonial: Testimonial = {
      client_name: "",
      company: "",
      content: "",
      rating: 5,
      date: new Date().toISOString().split('T')[0],
      role: ""
    }

    setFormData(prev => ({
      ...prev,
      testimonials: [...prev.testimonials, newTestimonial]
    }))
  }

  const updateTestimonial = (index: number, field: keyof Testimonial, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      testimonials: prev.testimonials.map((t, i) =>
        i === index ? { ...t, [field]: value } : t
      )
    }))
  }

  const removeTestimonial = (index: number) => {
    setFormData(prev => ({
      ...prev,
      testimonials: prev.testimonials.filter((_, i) => i !== index)
    }))
  }

  // Handle work experience
  const addWorkExperience = () => {
    const newExp: WorkExperience = {
      title: "",
      company: "",
      start_date: "",
      end_date: "",
      current: false,
      description: "",
      achievements: []
    }

    setFormData(prev => ({
      ...prev,
      work_experience: [...prev.work_experience, newExp]
    }))
  }

  const updateWorkExperience = (index: number, field: keyof WorkExperience, value: any) => {
    setFormData(prev => ({
      ...prev,
      work_experience: prev.work_experience.map((we, i) =>
        i === index ? { ...we, [field]: value } : we
      )
    }))
  }

  const removeWorkExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      work_experience: prev.work_experience.filter((_, i) => i !== index)
    }))
  }

  // Handle education
  const addEducation = () => {
    const newEdu: Education = {
      degree: "",
      institution: "",
      graduation_year: new Date().getFullYear(),
      field_of_study: "",
      grade: ""
    }

    setFormData(prev => ({
      ...prev,
      education: [...prev.education, newEdu]
    }))
  }

  const updateEducation = (index: number, field: keyof Education, value: any) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      )
    }))
  }

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }))
  }

  // Validate current step
  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {}

    switch (step) {
      case 1: // Basic Info
        if (!formData.name) errors.name = "Name is required"
        if (!formData.title) errors.title = "Professional title is required"
        if (!formData.primary_category) errors.primary_category = "Primary category is required"
        if (formData.experience_years <= 0) errors.experience_years = "Experience years must be greater than 0"
        break

      case 2: // Professional Details
        if (formData.skills.length === 0) errors.skills = "At least one skill is required"
        if (!formData.bio) errors.bio = "Bio is required"
        if (formData.bio && formData.bio.length < 50) errors.bio = "Bio should be at least 50 characters"
        break

      case 3: // Portfolio & Social
        // Optional - no validation needed
        break

      case 4: // Case Studies
        if (formData.case_studies.length === 0) {
          errors.case_studies = "At least one case study is recommended"
        } else {
          formData.case_studies.forEach((cs, index) => {
            if (!cs.title) errors[`case_study_${index}_title`] = `Case study ${index + 1} title is required`
            if (!cs.short_summary) errors[`case_study_${index}_summary`] = `Case study ${index + 1} summary is required`
            if (cs.metrics.length === 0) errors[`case_study_${index}_metrics`] = `Case study ${index + 1} should have at least one metric`
          })
        }
        break

      case 5: // Experience
        // Optional - no validation needed
        break
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateStep(5)) {
      setError("Please fill in all required fields")
      return
    }

    setLoading(true)
    setError("")

    try {
      // Prepare data for submission
      const submitData = {
        // Basic Info
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        title: formData.title,
        bio: formData.bio,

        // Categories
        primary_category: formData.primary_category,
        subcategories: formData.subcategories,
        experience_years: formData.experience_years,

        // Skills & Tools
        skills: formData.skills,
        tools_tech_stack: formData.tools_tech_stack,

        // Links
        github_url: formData.portfolio_links.github || formData.github_url,
        linkedin_url: formData.portfolio_links.linkedin || formData.linkedin_url,
        twitter_url: formData.portfolio_links.twitter || formData.twitter_url,
        portfolio_url: formData.portfolio_links.website || formData.portfolio_url,
        other_links: formData.portfolio_links.other,

        // Portfolio
        case_studies: JSON.stringify(formData.case_studies),
        testimonials: JSON.stringify(formData.testimonials),

        // Experience
        work_experience: JSON.stringify(formData.work_experience),
        education: JSON.stringify(formData.education),

        // Additional
        languages: formData.languages,
        certifications: formData.certifications,
        availability: formData.availability,
        preferred_project_size: formData.preferred_project_size
      }

      const response = await fetch("/api/freelancer/onboarding/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
        credentials: "include"
      })

      // Read as text first
      const text = await response.text()

      let data

      try {
        data = JSON.parse(text)
      } catch {
        console.error("API returned HTML:", text)
        throw new Error("Server error. API returned invalid response.")
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit profile")
      }

      // Save case studies separately using our new API
      for (const study of formData.case_studies) {
        if (!study.title || !study.short_summary) continue

        await fetch("/api/freelancer/case-studies", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            title: study.title,
            short_summary: study.short_summary,
            category: study.category || formData.primary_category,
            industry: study.industry || "",
            problem_statement: study.problem_statement,
            solution_provided: study.solution_provided,
            results_overview: study.results_overview,
            metrics: study.metrics,
            technologies: study.technologies,
            image_url: study.image_url,
            project_url: study.project_url,
            status: "pending" // Requires admin approval
          })
        })
      }

      setSuccess(true)

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push("/get-hired/freelancer/dashboard")
      }, 2000)

    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Get current category's subcategories
  const currentSubcategories = categoryOptions.find(
    cat => cat.name === formData.primary_category
  )?.subcategories || []

  // Get current category's industries
  const currentIndustries = categoryOptions.find(
    cat => cat.name === formData.primary_category
  )?.industries || []

  // Steps configuration
  const steps = [
    { number: 1, title: "Basic Info", icon: User, description: "Tell us who you are" },
    { number: 2, title: "Professional Details", icon: Briefcase, description: "Your skills and expertise" },
    { number: 3, title: "Portfolio & Social", icon: Globe, description: "Connect your online presence" },
    { number: 4, title: "Case Studies", icon: FileText, description: "Showcase your best work" },
    { number: 5, title: "Experience", icon: Layers, description: "Your professional journey" },
  ]

  // Button hover handler
  const handleButtonHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget
    target.style.transform = 'scale(1.03)'
    target.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease'
    target.style.boxShadow = '0 4px 12px rgba(36, 28, 21, 0.1)'
  }

  const handleButtonLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget
    target.style.transform = 'scale(1)'
    target.style.boxShadow = '0 2px 6px rgba(36, 28, 21, 0.05)'
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#faf4e5' }}>
        <Card className="w-full max-w-lg border shadow-sm rounded-lg" style={{ backgroundColor: '#f0eadd' }}>
          <CardContent className="pt-8 pb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full" style={{ backgroundColor: '#f7af00' }}>
                <CheckCircle className="h-12 w-12" style={{ color: '#050504' }} />
              </div>
            </div>
            <h2 className="text-2xl font-medium mb-2" style={{ color: '#050504' }}>
              Profile Submitted Successfully!
            </h2>
            <p className="text-lg mb-4" style={{ color: '#31302f' }}>
              Your profile is now under review. You'll be notified once it's verified.
            </p>
            <p className="text-sm" style={{ color: '#31302f' }}>
              Redirecting to dashboard...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#faf4e5' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 rounded-full mb-4" style={{ backgroundColor: '#f7af00' }}>
            <Briefcase className="h-10 w-10" style={{ color: '#050504' }} />
          </div>
          <h1 className="text-4xl font-medium mb-2" style={{ color: '#050504' }}>
            Complete Your Profile
          </h1>
          <p className="text-xl" style={{ color: '#31302f' }}>
            Tell us about your expertise and experience
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const StepIcon = step.icon
              const isActive = currentStep === step.number
              const isCompleted = currentStep > step.number

              return (
                <div key={step.number} className="flex-1 relative">
                  <div className="flex items-center">
                    <div className="relative z-10">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isActive || isCompleted ? 'bg-[#f7af00]' : 'bg-[#f0eadd]'
                          }`}
                        style={{ border: '2px solid #241C15' }}
                      >
                        <StepIcon className="h-6 w-6" style={{ color: '#050504' }} />
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`flex-1 h-1 mx-2 ${isCompleted ? 'bg-[#f7af00]' : 'bg-[#f0eadd]'
                          }`}
                        style={{ backgroundColor: isCompleted ? '#f7af00' : '#241C15' }}
                      />
                    )}
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-medium" style={{ color: '#31302f' }}>
                      {step.title}
                    </p>
                    <p className="text-xs" style={{ color: '#31302f', opacity: 0.7 }}>
                      {step.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Main Form */}
        <Card className="border shadow-sm rounded-lg" style={{ backgroundColor: '#f0eadd' }}>
          <CardHeader className="border-b pb-6" style={{ borderBottomColor: '#f7af00' }}>
            <CardTitle className="text-2xl font-medium" style={{ color: '#050504' }}>
              Step {currentStep}: {steps[currentStep - 1].title}
            </CardTitle>
            <CardDescription className="text-base" style={{ color: '#31302f' }}>
              {steps[currentStep - 1].description}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            {error && (
              <div className="mb-6 p-4 rounded-lg border flex items-start space-x-3" style={{ backgroundColor: '#f0eadd', borderColor: '#241C15' }}>
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: '#241C15' }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: '#31302f' }}>Error</p>
                  <p className="text-sm" style={{ color: '#31302f' }}>{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: '#31302f' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-1 ${validationErrors.name ? 'border-red-500' : ''
                        }`}
                      style={{ borderColor: validationErrors.name ? '#EF4444' : '#241C15', backgroundColor: '#faf4e5', color: '#31302f' }}
                      placeholder="John Doe"
                    />
                    {validationErrors.name && (
                      <p className="mt-1 text-xs text-red-500">{validationErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: '#31302f' }}>
                      Professional Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-1 ${validationErrors.title ? 'border-red-500' : ''
                        }`}
                      style={{ borderColor: validationErrors.title ? '#EF4444' : '#241C15', backgroundColor: '#faf4e5', color: '#31302f' }}
                      placeholder="e.g., Senior Web Developer"
                    />
                    {validationErrors.title && (
                      <p className="mt-1 text-xs text-red-500">{validationErrors.title}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: '#31302f' }}>
                      Primary Category *
                    </label>
                    <select
                      name="primary_category"
                      value={formData.primary_category}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-1 ${validationErrors.primary_category ? 'border-red-500' : ''
                        }`}
                      style={{ borderColor: validationErrors.primary_category ? '#EF4444' : '#241C15', backgroundColor: '#faf4e5', color: '#31302f' }}
                    >
                      <option value="">Select a category</option>
                      {categoryOptions.map(cat => (
                        <option key={cat.name} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                    {validationErrors.primary_category && (
                      <p className="mt-1 text-xs text-red-500">{validationErrors.primary_category}</p>
                    )}
                  </div>

                  {formData.primary_category && (
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#31302f' }}>
                        Subcategories (Optional - select your specialties)
                      </label>

                      {/* Display selected subcategories */}
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.subcategories.map(sub => (
                          <span
                            key={sub}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm"
                            style={{ backgroundColor: '#f7af00', color: '#050504' }}
                          >
                            {sub}
                            <button
                              onClick={() => removeSubcategory(sub)}
                              className="ml-2 hover:opacity-70"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>

                      {/* Show available subcategories */}
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {currentSubcategories
                          .filter(sub => !formData.subcategories.includes(sub))
                          .slice(0, 6)
                          .map(sub => (
                            <button
                              key={sub}
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  subcategories: [...prev.subcategories, sub]
                                }))
                              }}
                              className="text-left px-3 py-2 rounded-lg text-sm hover:bg-[#f7af00]/20"
                              style={{ border: '1px solid #241C15' }}
                            >
                              {sub}
                            </button>
                          ))}
                      </div>

                      {/* Custom subcategory input */}
                      {showSubcategoryInput ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={subcategoryInput}
                            onChange={(e) => setSubcategoryInput(e.target.value)}
                            placeholder="Enter custom subcategory"
                            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-1"
                            style={{ borderColor: '#241C15', backgroundColor: '#faf4e5', color: '#31302f' }}
                            onKeyPress={(e) => e.key === 'Enter' && addSubcategory()}
                          />
                          <Button
                            onClick={addSubcategory}
                            className="p-3 rounded-lg"
                            style={{ backgroundColor: '#f7af00', color: '#050504' }}
                          >
                            Add
                          </Button>
                          <Button
                            onClick={() => setShowSubcategoryInput(false)}
                            className="p-3 rounded-lg"
                            style={{ backgroundColor: 'transparent', border: '1px solid #241C15', color: '#31302f' }}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => setShowSubcategoryInput(true)}
                          className="w-full p-3 rounded-lg flex items-center justify-center space-x-2"
                          style={{ backgroundColor: 'transparent', border: '2px dashed #241C15', color: '#31302f' }}
                        >
                          <Plus className="h-5 w-5" />
                          <span>Add Custom Subcategory</span>
                        </Button>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: '#31302f' }}>
                      Years of Experience *
                    </label>
                    <input
                      type="number"
                      name="experience_years"
                      value={formData.experience_years}
                      onChange={handleInputChange}
                      min="0"
                      max="50"
                      step="0.5"
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-1 ${validationErrors.experience_years ? 'border-red-500' : ''
                        }`}
                      style={{ borderColor: validationErrors.experience_years ? '#EF4444' : '#241C15', backgroundColor: '#faf4e5', color: '#31302f' }}
                      placeholder="5"
                    />
                    {validationErrors.experience_years && (
                      <p className="mt-1 text-xs text-red-500">{validationErrors.experience_years}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: '#31302f' }}>
                      Availability
                    </label>
                    <select
                      name="availability"
                      value={formData.availability}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1"
                      style={{ borderColor: '#241C15', backgroundColor: '#faf4e5', color: '#31302f' }}
                    >
                      {availabilityOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: '#31302f' }}>
                      Preferred Project Size - Optional
                    </label>
                    <select
                      name="preferred_project_size"
                      value={formData.preferred_project_size}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1"
                      style={{ borderColor: '#241C15', backgroundColor: '#faf4e5', color: '#31302f' }}
                    >
                      <option value="">Select project size</option>
                      {projectSizeOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: '#31302f' }}>
                      Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1"
                      style={{ borderColor: '#241C15', backgroundColor: '#faf4e5', color: '#31302f' }}
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Professional Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: '#31302f' }}>
                      Bio/Summary *
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={5}
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-1 ${validationErrors.bio ? 'border-red-500' : ''
                        }`}
                      style={{ borderColor: validationErrors.bio ? '#EF4444' : '#241C15', backgroundColor: '#faf4e5', color: '#31302f' }}
                      placeholder="Tell us about yourself, your expertise, and what makes you unique..."
                    />
                    {validationErrors.bio && (
                      <p className="mt-1 text-xs text-red-500">{validationErrors.bio}</p>
                    )}
                    {formData.bio && (
                      <p className="mt-1 text-xs" style={{ color: '#31302f' }}>
                        {formData.bio.length} characters {formData.bio.length < 50 ? '(minimum 50 recommended)' : ''}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#31302f' }}>
                      Skills *
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.skills.map(skill => (
                        <span
                          key={skill}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm"
                          style={{ backgroundColor: '#f7af00', color: '#050504' }}
                        >
                          {skill}
                          <button
                            onClick={() => removeSkill(skill)}
                            className="ml-2 hover:opacity-70"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    {validationErrors.skills && (
                      <p className="mt-1 text-xs text-red-500">{validationErrors.skills}</p>
                    )}

                    {showSkillInput ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          placeholder="e.g., React, Node.js, UI Design"
                          className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-1"
                          style={{ borderColor: '#241C15', backgroundColor: '#faf4e5', color: '#31302f' }}
                          onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                        />
                        <Button
                          onClick={addSkill}
                          className="p-3 rounded-lg"
                          style={{ backgroundColor: '#f7af00', color: '#050504' }}
                        >
                          Add
                        </Button>
                        <Button
                          onClick={() => setShowSkillInput(false)}
                          className="p-3 rounded-lg"
                          style={{ backgroundColor: 'transparent', border: '1px solid #241C15', color: '#31302f' }}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => setShowSkillInput(true)}
                        className="w-full p-3 rounded-lg flex items-center justify-center space-x-2"
                        style={{ backgroundColor: 'transparent', border: '2px dashed #241C15', color: '#31302f' }}
                      >
                        <Plus className="h-5 w-5" />
                        <span>Add Skill</span>
                      </Button>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#31302f' }}>
                      Tools & Technologies
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.tools_tech_stack.map(tool => (
                        <span
                          key={tool}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm"
                          style={{ backgroundColor: '#f7af00', color: '#050504' }}
                        >
                          {tool}
                          <button
                            onClick={() => removeTool(tool)}
                            className="ml-2 hover:opacity-70"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>

                    {showToolInput ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={toolInput}
                          onChange={(e) => setToolInput(e.target.value)}
                          placeholder="e.g., React, Node.js, Photoshop"
                          className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-1"
                          style={{ borderColor: '#241C15', backgroundColor: '#faf4e5', color: '#31302f' }}
                          onKeyPress={(e) => e.key === 'Enter' && addTool()}
                        />
                        <Button
                          onClick={addTool}
                          className="p-3 rounded-lg"
                          style={{ backgroundColor: '#f7af00', color: '#050504' }}
                        >
                          Add
                        </Button>
                        <Button
                          onClick={() => setShowToolInput(false)}
                          className="p-3 rounded-lg"
                          style={{ backgroundColor: 'transparent', border: '1px solid #241C15', color: '#31302f' }}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => setShowToolInput(true)}
                        className="w-full p-3 rounded-lg flex items-center justify-center space-x-2"
                        style={{ backgroundColor: 'transparent', border: '2px dashed #241C15', color: '#31302f' }}
                      >
                        <Plus className="h-5 w-5" />
                        <span>Add Tool/Technology</span>
                      </Button>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#31302f' }}>
                      Languages
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.languages.map(lang => (
                        <span
                          key={lang}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm"
                          style={{ backgroundColor: '#f7af00', color: '#050504' }}
                        >
                          {lang}
                          <button
                            onClick={() => removeLanguage(lang)}
                            className="ml-2 hover:opacity-70"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>

                    {showLanguageInput ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={languageInput}
                          onChange={(e) => setLanguageInput(e.target.value)}
                          placeholder="e.g., English, Spanish, French"
                          className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-1"
                          style={{ borderColor: '#241C15', backgroundColor: '#faf4e5', color: '#31302f' }}
                          onKeyPress={(e) => e.key === 'Enter' && addLanguage()}
                        />
                        <Button
                          onClick={addLanguage}
                          className="p-3 rounded-lg"
                          style={{ backgroundColor: '#f7af00', color: '#050504' }}
                        >
                          Add
                        </Button>
                        <Button
                          onClick={() => setShowLanguageInput(false)}
                          className="p-3 rounded-lg"
                          style={{ backgroundColor: 'transparent', border: '1px solid #241C15', color: '#31302f' }}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => setShowLanguageInput(true)}
                        className="w-full p-3 rounded-lg flex items-center justify-center space-x-2"
                        style={{ backgroundColor: 'transparent', border: '2px dashed #241C15', color: '#31302f' }}
                      >
                        <Plus className="h-5 w-5" />
                        <span>Add Language</span>
                      </Button>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#31302f' }}>
                      Certifications
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.certifications.map(cert => (
                        <span
                          key={cert}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm"
                          style={{ backgroundColor: '#f7af00', color: '#050504' }}
                        >
                          {cert}
                          <button
                            onClick={() => removeCertification(cert)}
                            className="ml-2 hover:opacity-70"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>

                    {showCertificationInput ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={certificationInput}
                          onChange={(e) => setCertificationInput(e.target.value)}
                          placeholder="e.g., AWS Certified, Google Analytics"
                          className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-1"
                          style={{ borderColor: '#241C15', backgroundColor: '#faf4e5', color: '#31302f' }}
                          onKeyPress={(e) => e.key === 'Enter' && addCertification()}
                        />
                        <Button
                          onClick={addCertification}
                          className="p-3 rounded-lg"
                          style={{ backgroundColor: '#f7af00', color: '#050504' }}
                        >
                          Add
                        </Button>
                        <Button
                          onClick={() => setShowCertificationInput(false)}
                          className="p-3 rounded-lg"
                          style={{ backgroundColor: 'transparent', border: '1px solid #241C15', color: '#31302f' }}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => setShowCertificationInput(true)}
                        className="w-full p-3 rounded-lg flex items-center justify-center space-x-2"
                        style={{ backgroundColor: 'transparent', border: '2px dashed #241C15', color: '#31302f' }}
                      >
                        <Plus className="h-5 w-5" />
                        <span>Add Certification</span>
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Portfolio & Social */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: '#31302f' }}>
                      Portfolio Website
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 h-5 w-5" style={{ color: '#31302f' }} />
                      <input
                        type="url"
                        value={formData.portfolio_links.website}
                        onChange={(e) => handlePortfolioLinkChange('website', e.target.value)}
                        placeholder="https://yourportfolio.com"
                        className="w-full pl-11 p-3 border rounded-lg focus:outline-none focus:ring-1"
                        style={{ borderColor: '#241C15', backgroundColor: '#faf4e5', color: '#31302f' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: '#31302f' }}>
                      GitHub Profile
                    </label>
                    <div className="relative">
                      <Github className="absolute left-3 top-3 h-5 w-5" style={{ color: '#31302f' }} />
                      <input
                        type="url"
                        value={formData.portfolio_links.github}
                        onChange={(e) => handlePortfolioLinkChange('github', e.target.value)}
                        placeholder="https://github.com/username"
                        className="w-full pl-11 p-3 border rounded-lg focus:outline-none focus:ring-1"
                        style={{ borderColor: '#241C15', backgroundColor: '#faf4e5', color: '#31302f' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: '#31302f' }}>
                      LinkedIn Profile
                    </label>
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-3 h-5 w-5" style={{ color: '#31302f' }} />
                      <input
                        type="url"
                        value={formData.portfolio_links.linkedin}
                        onChange={(e) => handlePortfolioLinkChange('linkedin', e.target.value)}
                        placeholder="https://linkedin.com/in/username"
                        className="w-full pl-11 p-3 border rounded-lg focus:outline-none focus:ring-1"
                        style={{ borderColor: '#241C15', backgroundColor: '#faf4e5', color: '#31302f' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: '#31302f' }}>
                      Twitter/X Profile
                    </label>
                    <div className="relative">
                      <Twitter className="absolute left-3 top-3 h-5 w-5" style={{ color: '#31302f' }} />
                      <input
                        type="url"
                        value={formData.portfolio_links.twitter}
                        onChange={(e) => handlePortfolioLinkChange('twitter', e.target.value)}
                        placeholder="https://twitter.com/username"
                        className="w-full pl-11 p-3 border rounded-lg focus:outline-none focus:ring-1"
                        style={{ borderColor: '#241C15', backgroundColor: '#faf4e5', color: '#31302f' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#31302f' }}>
                      Other Portfolio Links
                    </label>
                    {formData.portfolio_links.other?.map((link, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <input
                          type="url"
                          value={link}
                          onChange={(e) => updateOtherPortfolioLink(index, e.target.value)}
                          placeholder="https://..."
                          className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-1"
                          style={{ borderColor: '#241C15', backgroundColor: '#faf4e5', color: '#31302f' }}
                        />
                        <button
                          onClick={() => removeOtherPortfolioLink(index)}
                          className="p-2 hover:opacity-70"
                        >
                          <X className="h-5 w-5" style={{ color: '#31302f' }} />
                        </button>
                      </div>
                    ))}
                    <Button
                      onClick={addOtherPortfolioLink}
                      className="w-full p-3 rounded-lg flex items-center justify-center space-x-2"
                      style={{ backgroundColor: 'transparent', border: '2px dashed #241C15', color: '#31302f' }}
                    >
                      <Plus className="h-5 w-5" />
                      <span>Add Another Link</span>
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: Case Studies - Updated to match new structure */}
              {currentStep === 4 && (
                <div className="space-y-8">
                  {formData.case_studies.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-16 w-16 mx-auto mb-4" style={{ color: '#31302f' }} />
                      <h3 className="text-xl font-medium mb-2" style={{ color: '#050504' }}>
                        No Case Studies Yet
                      </h3>
                      <p className="mb-4" style={{ color: '#31302f' }}>
                        Add your first case study to showcase your best work
                      </p>
                      <Button
                        onClick={addCaseStudy}
                        className="px-6 py-3 rounded-lg"
                        style={{ backgroundColor: '#f7af00', color: '#050504' }}
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Add Case Study
                      </Button>
                    </div>
                  ) : (
                    <>
                      {formData.case_studies.map((study, index) => (
                        <div key={index} className="p-6 rounded-lg border relative" style={{ borderColor: '#241C15' }}>
                          <button
                            onClick={() => removeCaseStudy(index)}
                            className="absolute -top-2 -right-2 p-1 rounded-full bg-[#f7af00] hover:opacity-70"
                          >
                            <X className="h-4 w-4" style={{ color: '#050504' }} />
                          </button>

                          <h3 className="text-lg font-medium mb-4" style={{ color: '#050504' }}>
                            Case Study {index + 1}
                          </h3>

                          <div className="space-y-4">
                            {/* Title */}
                            <div>
                              <label className="block text-sm font-medium mb-1" style={{ color: '#31302f' }}>
                                Project Title *
                              </label>
                              <input
                                type="text"
                                value={study.title}
                                onChange={(e) => updateCaseStudy(index, 'title', e.target.value)}
                                placeholder="e.g., E-commerce Platform Redesign"
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1"
                                style={{ borderColor: '#241C15', backgroundColor: '#faf4e5', color: '#31302f' }}
                              />
                            </div>

                            {/* Short Summary */}
                            <div>
                              <label className="block text-sm font-medium mb-1" style={{ color: '#31302f' }}>
                                Short Summary *
                              </label>
                              <input
                                type="text"
                                value={study.short_summary}
                                onChange={(e) => updateCaseStudy(index, 'short_summary', e.target.value)}
                                placeholder="Brief overview of the project (1-2 sentences)"
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1"
                                style={{ borderColor: '#241C15', backgroundColor: '#faf4e5', color: '#31302f' }}
                              />
                            </div>

                            {/* Industry */}
                            <div>
                              <label className="block text-sm font-medium mb-1" style={{ color: '#31302f' }}>
                                Industry
                              </label>
                              <select
                                value={study.industry}
                                onChange={(e) => updateCaseStudy(index, 'industry', e.target.value)}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1"
                                style={{ borderColor: '#241C15', backgroundColor: '#faf4e5', color: '#31302f' }}
                              >
                                <option value="">Select industry</option>
                                {currentIndustries.map(industry => (
                                  <option key={industry} value={industry}>{industry}</option>
                                ))}
                              </select>
                            </div>

                            {/* Problem Statement */}
                            <div>
                              <label className="block text-sm font-medium mb-1" style={{ color: '#31302f' }}>
                                Problem Statement
                              </label>
                              <textarea
                                value={study.problem_statement}
                                onChange={(e) => updateCaseStudy(index, 'problem_statement', e.target.value)}
                                rows={3}
                                placeholder="What challenge did the client face?"
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1"
                                style={{ borderColor: '#241C15', backgroundColor: '#faf4e5', color: '#31302f' }}
                              />
                            </div>

                            {/* Solution */}
                            <div>
                              <label className="block text-sm font-medium mb-1" style={{ color: '#31302f' }}>
                                Solution Provided
                              </label>
                              <textarea
                                value={study.solution_provided}
                                onChange={(e) => updateCaseStudy(index, 'solution_provided', e.target.value)}
                                rows={3}
                                placeholder="How did you solve the problem?"
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1"
                                style={{ borderColor: '#241C15', backgroundColor: '#faf4e5', color: '#31302f' }}
                              />
                            </div>

                            {/* Metrics */}
                            <div>
                              <label className="block text-sm font-medium mb-2" style={{ color: '#31302f' }}>
                                Key Metrics *
                              </label>

                              {/* Display existing metrics */}
                              <div className="space-y-2 mb-3">
                                {study.metrics.map((metric, mi) => (
                                  <div key={mi} className="flex items-center justify-between p-2 bg-[#faf4e5] rounded-lg">
                                    <div>
                                      <span className="font-medium">{metric.label}: </span>
                                      <span>
                                        {metric.type === 'percentage' ? `${metric.value}%` :
                                          metric.type === 'currency' ? `$${metric.value}` :
                                            metric.value}
                                      </span>
                                    </div>
                                    <button
                                      onClick={() => removeMetric(index, mi)}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  </div>
                                ))}
                              </div>

                              {/* Add new metric */}
                              {activeCaseStudyIndex === index ? (
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    placeholder="Metric label (e.g., ROAS)"
                                    value={newMetric.label}
                                    onChange={(e) => setNewMetric({ ...newMetric, label: e.target.value })}
                                    className="flex-1 p-2 border rounded-lg"
                                    style={{ borderColor: '#241C15', backgroundColor: '#faf4e5' }}
                                  />
                                  <input
                                    type="number"
                                    placeholder="Value"
                                    value={newMetric.value}
                                    onChange={(e) => setNewMetric({ ...newMetric, value: parseFloat(e.target.value) || 0 })}
                                    className="w-24 p-2 border rounded-lg"
                                    style={{ borderColor: '#241C15', backgroundColor: '#faf4e5' }}
                                  />
                                  <select
                                    value={newMetric.type}
                                    onChange={(e) => setNewMetric({ ...newMetric, type: e.target.value as any })}
                                    className="w-24 p-2 border rounded-lg"
                                    style={{ borderColor: '#241C15', backgroundColor: '#faf4e5' }}
                                  >
                                    <option value="number">Number</option>
                                    <option value="percentage">%</option>
                                    <option value="currency">$</option>
                                  </select>
                                  <Button
                                    onClick={() => addMetric(index)}
                                    className="p-2 rounded-lg"
                                    style={{ backgroundColor: '#f7af00', color: '#050504' }}
                                  >
                                    Add
                                  </Button>
                                  <Button
                                    onClick={() => setActiveCaseStudyIndex(null)}
                                    className="p-2 rounded-lg"
                                    style={{ backgroundColor: 'transparent', border: '1px solid #241C15', color: '#31302f' }}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  onClick={() => setActiveCaseStudyIndex(index)}
                                  className="w-full p-2 rounded-lg flex items-center justify-center space-x-2"
                                  style={{ backgroundColor: 'transparent', border: '2px dashed #241C15', color: '#31302f' }}
                                >
                                  <Plus className="h-4 w-4" />
                                  <span>Add Metric</span>
                                </Button>
                              )}
                            </div>

                            {/* Results Overview */}
                            <div>
                              <label className="block text-sm font-medium mb-1" style={{ color: '#31302f' }}>
                                Results Overview
                              </label>
                              <textarea
                                value={study.results_overview}
                                onChange={(e) => updateCaseStudy(index, 'results_overview', e.target.value)}
                                rows={2}
                                placeholder="Summary of the results achieved"
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1"
                                style={{ borderColor: '#241C15', backgroundColor: '#faf4e5', color: '#31302f' }}
                              />
                            </div>

                            {/* Technologies */}
                            <div>
                              <label className="block text-sm font-medium mb-2" style={{ color: '#31302f' }}>
                                Technologies Used
                              </label>
                              <div className="flex flex-wrap gap-2 mb-2">
                                {study.technologies.map(tech => (
                                  <span
                                    key={tech}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm"
                                    style={{ backgroundColor: '#f7af00', color: '#050504' }}
                                  >
                                    {tech}
                                    <button
                                      onClick={() => removeCaseStudyTechnology(index, tech)}
                                      className="ml-2 hover:opacity-70"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </span>
                                ))}
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  placeholder="Add technology"
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      addCaseStudyTechnology(index, (e.target as HTMLInputElement).value)
                                        ; (e.target as HTMLInputElement).value = ''
                                    }
                                  }}
                                  className="flex-1 p-2 border rounded-lg"
                                  style={{ borderColor: '#241C15', backgroundColor: '#faf4e5' }}
                                />
                              </div>
                            </div>

                            {/* Project URL */}
                            <div>
                              <label className="block text-sm font-medium mb-1" style={{ color: '#31302f' }}>
                                Project URL
                              </label>
                              <input
                                type="url"
                                value={study.project_url || ''}
                                onChange={(e) => updateCaseStudy(index, 'project_url', e.target.value)}
                                placeholder="https://..."
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1"
                                style={{ borderColor: '#241C15', backgroundColor: '#faf4e5', color: '#31302f' }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      {formData.case_studies.length < 3 && (
                        <Button
                          onClick={addCaseStudy}
                          className="w-full p-4 rounded-lg flex items-center justify-center space-x-2"
                          style={{ backgroundColor: 'transparent', border: '2px dashed #241C15', color: '#31302f' }}
                        >
                          <Plus className="h-5 w-5" />
                          <span>Add Another Case Study</span>
                        </Button>
                      )}
                    </>
                  )}

                  {/* Testimonials Section */}
                  <div className="mt-8">
                    <h3 className="text-xl font-medium mb-4" style={{ color: '#050504' }}>
                      Client Testimonials
                    </h3>

                    {formData.testimonials.map((testimonial, index) => (
                      <div key={index} className="p-4 rounded-lg border relative mb-4" style={{ borderColor: '#241C15' }}>
                        <button
                          onClick={() => removeTestimonial(index)}
                          className="absolute -top-2 -right-2 p-1 rounded-full bg-[#f7af00] hover:opacity-70"
                        >
                          <X className="h-4 w-4" style={{ color: '#050504' }} />
                        </button>

                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="text"
                              placeholder="Client Name"
                              value={testimonial.client_name}
                              onChange={(e) => updateTestimonial(index, 'client_name', e.target.value)}
                              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1"
                              style={{ borderColor: '#241C15', backgroundColor: '#faf4e5', color: '#31302f' }}
                            />
                            <input
                              type="text"
                              placeholder="Company"
                              value={testimonial.company}
                              onChange={(e) => updateTestimonial(index, 'company', e.target.value)}
                              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1"
                              style={{ borderColor: '#241C15', backgroundColor: '#faf4e5', color: '#31302f' }}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="text"
                              placeholder="Client Role (e.g., CEO)"
                              value={testimonial.role || ''}
                              onChange={(e) => updateTestimonial(index, 'role', e.target.value)}
                              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1"
                              style={{ borderColor: '#241C15', backgroundColor: '#faf4e5', color: '#31302f' }}
                            />
                            <input
                              type="date"
                              value={testimonial.date || ''}
                              onChange={(e) => updateTestimonial(index, 'date', e.target.value)}
                              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1"
                              style={{ borderColor: '#241C15', backgroundColor: '#faf4e5', color: '#31302f' }}
                            />
                          </div>

                          <textarea
                            placeholder="Testimonial Content"
                            value={testimonial.content}
                            onChange={(e) => updateTestimonial(index, 'content', e.target.value)}
                            rows={3}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1"
                            style={{ borderColor: '#241C15', backgroundColor: '#faf4e5', color: '#31302f' }}
                          />

                          <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: '#31302f' }}>
                              Rating (1-5)
                            </label>
                            <div className="flex items-center space-x-2">
                              {[1, 2, 3, 4, 5].map(rating => (
                                <button
                                  key={rating}
                                  type="button"
                                  onClick={() => updateTestimonial(index, 'rating', rating)}
                                  className="focus:outline-none"
                                >
                                  <Star
                                    className={`h-6 w-6 ${rating <= testimonial.rating
                                      ? 'fill-current text-[#f7af00]'
                                      : 'text-gray-400'
                                      }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {formData.testimonials.length < 3 && (
                      <Button
                        onClick={addTestimonial}
                        className="w-full p-3 rounded-lg flex items-center justify-center space-x-2"
                        style={{ backgroundColor: 'transparent', border: '2px dashed #241C15', color: '#31302f' }}
                      >
                        <Plus className="h-5 w-5" />
                        <span>Add Another Testimonial</span>
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Step 5: Experience & Education */}
              {currentStep === 5 && (
                <div className="space-y-8">
                  {/* Work Experience */}
                  <div>
                    <h3 className="text-xl font-medium mb-4" style={{ color: '#050504' }}>
                      Work Experience
                    </h3>

                    {formData.work_experience.map((exp, index) => (
                      <div key={index} className="p-4 rounded-lg border relative mb-4" style={{ borderColor: '#241C15' }}>
                        <button
                          onClick={() => removeWorkExperience(index)}
                          className="absolute -top-2 -right-2 p-1 rounded-full bg-[#f7af00] hover:opacity-70"
                        >
                          <X className="h-4 w-4" style={{ color: '#050504' }} />
                        </button>

                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="Job Title"
                            value={exp.title}
                            onChange={(e) => updateWorkExperience(index, 'title', e.target.value)}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1"
                            style={{ borderColor: '#241C15', backgroundColor: '#faf4e5', color: '#31302f' }}
                          />

                          <input
                            type="text"
                            placeholder="Company"
                            value={exp.company}
                            onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1"
                            style={{ borderColor: '#241C15', backgroundColor: '#faf4e5', color: '#31302f' }}
                          />

                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="text"
                              placeholder="Start Date (e.g., 2020-01)"
                              value={exp.start_date}
                              onChange={(e) => updateWorkExperience(index, 'start_date', e.target.value)}
                              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1"
                              style={{ borderColor: '#241C15', backgroundColor: '#faf4e5', color: '#31302f' }}
                            />
                            <input
                              type="text"
                              placeholder="End Date (or leave blank if current)"
                              value={exp.end_date}
                              onChange={(e) => updateWorkExperience(index, 'end_date', e.target.value)}
                              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1"
                              style={{ borderColor: '#241C15', backgroundColor: '#faf4e5', color: '#31302f' }}
                              disabled={exp.current}
                            />
                          </div>

                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`current-job-${index}`}
                              checked={exp.current}
                              onChange={(e) => updateWorkExperience(index, 'current', e.target.checked)}
                              className="w-4 h-4"
                              style={{ accentColor: '#f7af00' }}
                            />
                            <label htmlFor={`current-job-${index}`} style={{ color: '#31302f' }}>
                              I currently work here
                            </label>
                          </div>

                          <textarea
                            placeholder="Job Description"
                            value={exp.description}
                            onChange={(e) => updateWorkExperience(index, 'description', e.target.value)}
                            rows={3}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1"
                            style={{ borderColor: '#241C15', backgroundColor: '#faf4e5', color: '#31302f' }}
                          />
                        </div>
                      </div>
                    ))}

                    <Button
                      onClick={addWorkExperience}
                      className="w-full p-3 rounded-lg flex items-center justify-center space-x-2"
                      style={{ backgroundColor: 'transparent', border: '2px dashed #241C15', color: '#31302f' }}
                    >
                      <Plus className="h-5 w-5" />
                      <span>Add Work Experience</span>
                    </Button>
                  </div>

                  {/* Education */}
                  <div>
                    <h3 className="text-xl font-medium mb-4" style={{ color: '#050504' }}>
                      Education
                    </h3>

                    {formData.education.map((edu, index) => (
                      <div key={index} className="p-4 rounded-lg border relative mb-4" style={{ borderColor: '#241C15' }}>
                        <button
                          onClick={() => removeEducation(index)}
                          className="absolute -top-2 -right-2 p-1 rounded-full bg-[#f7af00] hover:opacity-70"
                        >
                          <X className="h-4 w-4" style={{ color: '#050504' }} />
                        </button>

                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="Degree"
                            value={edu.degree}
                            onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1"
                            style={{ borderColor: '#241C15', backgroundColor: '#faf4e5', color: '#31302f' }}
                          />

                          <input
                            type="text"
                            placeholder="Institution"
                            value={edu.institution}
                            onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1"
                            style={{ borderColor: '#241C15', backgroundColor: '#faf4e5', color: '#31302f' }}
                          />

                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="text"
                              placeholder="Field of Study"
                              value={edu.field_of_study || ''}
                              onChange={(e) => updateEducation(index, 'field_of_study', e.target.value)}
                              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1"
                              style={{ borderColor: '#241C15', backgroundColor: '#faf4e5', color: '#31302f' }}
                            />
                            <input
                              type="number"
                              placeholder="Graduation Year"
                              value={edu.graduation_year}
                              onChange={(e) => updateEducation(index, 'graduation_year', parseInt(e.target.value))}
                              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1"
                              style={{ borderColor: '#241C15', backgroundColor: '#faf4e5', color: '#31302f' }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <Button
                      onClick={addEducation}
                      className="w-full p-3 rounded-lg flex items-center justify-center space-x-2"
                      style={{ backgroundColor: 'transparent', border: '2px dashed #241C15', color: '#31302f' }}
                    >
                      <Plus className="h-5 w-5" />
                      <span>Add Education</span>
                    </Button>
                  </div>
                </div>
              )}

              {/* Validation Summary */}
              {Object.keys(validationErrors).length > 0 && (
                <div className="p-4 rounded-lg border" style={{ backgroundColor: '#f0eadd', borderColor: '#241C15' }}>
                  <h4 className="font-medium mb-2" style={{ color: '#31302f' }}>Please fix the following:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {Object.values(validationErrors).map((error, index) => (
                      <li key={index} className="text-sm text-red-600">{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t" style={{ borderTopColor: '#f7af00' }}>
                <Button
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  disabled={currentStep === 1}
                  className="px-6 py-3 rounded-lg flex items-center space-x-2 disabled:opacity-50"
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid #241C15',
                    color: '#31302f'
                  }}
                  onMouseEnter={handleButtonHover}
                  onMouseLeave={handleButtonLeave}
                >
                  <ChevronLeft className="h-5 w-5" />
                  <span>Back</span>
                </Button>

                {currentStep < 5 ? (
                  <Button
                    onClick={() => {
                      if (validateStep(currentStep)) {
                        setCurrentStep(prev => prev + 1)
                      }
                    }}
                    className="px-6 py-3 rounded-lg flex items-center space-x-2"
                    style={{
                      backgroundColor: '#f7af00',
                      color: '#050504'
                    }}
                    onMouseEnter={handleButtonHover}
                    onMouseLeave={handleButtonLeave}
                  >
                    <span>Next</span>
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-8 py-3 rounded-lg flex items-center space-x-2 disabled:opacity-50"
                    style={{
                      backgroundColor: '#f7af00',
                      color: '#050504'
                    }}
                    onMouseEnter={handleButtonHover}
                    onMouseLeave={handleButtonLeave}
                  >
                    <Save className="h-5 w-5" />
                    <span>{loading ? "Submitting..." : "Submit for Review"}</span>
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Progress Indicator */}
        <div className="mt-4 text-center">
          <p className="text-sm" style={{ color: '#31302f' }}>
            Step {currentStep} of 5 • {Math.round((currentStep / 5) * 100)}% Complete
          </p>
        </div>
      </div>
    </div>
  )
}