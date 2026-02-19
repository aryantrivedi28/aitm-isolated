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
  Globe
} from "lucide-react"

// Define the form data structure matching your table
interface CaseStudy {
  title: string
  description: string
  outcome: string
  technologies?: string[]
  category?: string
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
}

interface WorkExperience {
  title: string
  company: string
  start_date: string
  end_date?: string
  current: boolean
  description: string
}

interface Education {
  degree: string
  institution: string
  graduation_year: number
  field_of_study?: string
}

interface FormData {
  name: string
  email: string
  phone?: string
  title: string
  bio: string
  primary_category: string
  subcategory: string
  experience_years: number
  skills: string[]
  tools_tech_stack: string[]
  portfolio_links: {
    website?: string
    github?: string
    linkedin?: string
    twitter?: string
    other?: string[]
  }
  case_studies: CaseStudy[]
  testimonials: Testimonial[]
  work_experience: WorkExperience[]
  education: Education[]
  languages: string[]
  certifications: string[]
  availability: string
  photo_url?: string
  github_url?: string
  linkedin_url?: string
  twitter_url?: string
  portfolio_url?: string
}

export default function FreelancerOnboarding() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [toolInput, setToolInput] = useState("")
  const [skillInput, setSkillInput] = useState("")
  const [languageInput, setLanguageInput] = useState("")
  const [certificationInput, setCertificationInput] = useState("")
  const [showToolInput, setShowToolInput] = useState(false)
  const [showSkillInput, setShowSkillInput] = useState(false)
  const [showLanguageInput, setShowLanguageInput] = useState(false)
  const [showCertificationInput, setShowCertificationInput] = useState(false)

  // Initialize form data
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    title: "",
    bio: "",
    primary_category: "",
    subcategory: "",
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
    case_studies: [
      { title: "", description: "", outcome: "" }
    ],
    testimonials: [
      { client_name: "", company: "", content: "", rating: 5 }
    ],
    work_experience: [],
    education: [],
    languages: [],
    certifications: [],
    availability: "full-time",
    github_url: "",
    linkedin_url: "",
    twitter_url: "",
    portfolio_url: ""
  })

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/freelancer/auth/me")
        const data = await response.json()

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

  // Categories options
  const primaryCategories = [
    "Web Development",
    "Shopify Development",
    "SEO Optimization",
    "UI/UX Design",
    "Content Writing",
    "Digital Marketing",
    "Mobile App Development",
    "E-commerce Development",
    "WordPress Development",
    "Graphic Design"
  ]

  const subcategories: Record<string, string[]> = {
    "Web Development": ["Frontend", "Backend", "Full Stack", "React/Next.js", "Node.js", "Python/Django"],
    "Shopify Development": ["Theme Development", "App Development", "Store Setup", "Migration", "Customization"],
    "SEO Optimization": ["Technical SEO", "On-page SEO", "Off-page SEO", "Local SEO", "E-commerce SEO"],
    "UI/UX Design": ["Web Design", "Mobile Design", "User Research", "Prototyping", "Design Systems"],
    "Content Writing": ["Blog Posts", "Technical Writing", "Copywriting", "SEO Content", "Ghostwriting"],
    "Digital Marketing": ["Social Media", "Email Marketing", "PPC Advertising", "Analytics", "Strategy"],
    "Mobile App Development": ["iOS", "Android", "React Native", "Flutter", "Cross-platform"],
    "E-commerce Development": ["WooCommerce", "Magento", "BigCommerce", "Custom Solutions"],
    "WordPress Development": ["Theme Development", "Plugin Development", "Custom CMS", "WooCommerce"],
    "Graphic Design": ["Brand Identity", "Logo Design", "Print Design", "Social Media Graphics"]
  }

  const availabilityOptions = [
    "full-time",
    "part-time",
    "contract",
    "freelance",
    "available"
  ]

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Handle skills
  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }))
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
    if (toolInput.trim() && !formData.tools_tech_stack.includes(toolInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tools_tech_stack: [...prev.tools_tech_stack, toolInput.trim()]
      }))
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

  // Handle languages
  const addLanguage = () => {
    if (languageInput.trim() && !formData.languages.includes(languageInput.trim())) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, languageInput.trim()]
      }))
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
    if (certificationInput.trim() && !formData.certifications.includes(certificationInput.trim())) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, certificationInput.trim()]
      }))
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
    if (formData.portfolio_links.other) {
      setFormData(prev => ({
        ...prev,
        portfolio_links: {
          ...prev.portfolio_links,
          other: [...(prev.portfolio_links.other || []), ""]
        }
      }))
    }
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

  // Handle case studies
  const updateCaseStudy = (index: number, field: keyof CaseStudy, value: string) => {
    setFormData(prev => ({
      ...prev,
      case_studies: prev.case_studies.map((cs, i) =>
        i === index ? { ...cs, [field]: value } : cs
      )
    }))
  }

  const addCaseStudy = () => {
    if (formData.case_studies.length < 3) {
      setFormData(prev => ({
        ...prev,
        case_studies: [...prev.case_studies, { title: "", description: "", outcome: "" }]
      }))
    }
  }

  const removeCaseStudy = (index: number) => {
    setFormData(prev => ({
      ...prev,
      case_studies: prev.case_studies.filter((_, i) => i !== index)
    }))
  }

  // Handle testimonials
  const updateTestimonial = (index: number, field: keyof Testimonial, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      testimonials: prev.testimonials.map((t, i) =>
        i === index ? { ...t, [field]: value } : t
      )
    }))
  }

  const addTestimonial = () => {
    if (formData.testimonials.length < 3) {
      setFormData(prev => ({
        ...prev,
        testimonials: [...prev.testimonials, { client_name: "", company: "", content: "", rating: 5 }]
      }))
    }
  }

  const removeTestimonial = (index: number) => {
    setFormData(prev => ({
      ...prev,
      testimonials: prev.testimonials.filter((_, i) => i !== index)
    }))
  }

  // Handle work experience
  const addWorkExperience = () => {
    setFormData(prev => ({
      ...prev,
      work_experience: [
        ...prev.work_experience,
        {
          title: "",
          company: "",
          start_date: "",
          end_date: "",
          current: false,
          description: ""
        }
      ]
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
    setFormData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          degree: "",
          institution: "",
          graduation_year: new Date().getFullYear(),
          field_of_study: ""
        }
      ]
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
    switch (step) {
      case 1: // Basic Info
        return !!(
          formData.name &&
          formData.title &&
          formData.primary_category &&
          formData.experience_years > 0
        )
      case 2: // Professional Details
        return !!(formData.skills.length > 0 && formData.bio)
      case 3: // Portfolio & Social
        return true // Optional
      case 4: // Case Studies & Testimonials
        return formData.case_studies.every(cs => cs.title && cs.description && cs.outcome)
      case 5: // Experience & Education
        return true // Optional but recommended
      default:
        return true
    }
  }

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true)
    setError("")

    try {
      // Prepare data for submission
      const submitData = {
        ...formData,
        // Ensure arrays are properly formatted
        skills: formData.skills,
        tools_tech_stack: formData.tools_tech_stack,
        languages: formData.languages,
        certifications: formData.certifications,
        testimonials: formData.testimonials,
        work_experience: formData.work_experience,
        education: formData.education,
        // Portfolio links as separate fields
        github_url: formData.portfolio_links.github,
        linkedin_url: formData.portfolio_links.linkedin,
        twitter_url: formData.portfolio_links.twitter,
        portfolio_url: formData.portfolio_links.website,
        // Additional portfolio links as JSON
        portfolio_links: JSON.stringify(formData.portfolio_links.other || [])
      }

      const response = await fetch("/api/freelancer/onboarding/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
        credentials: "include"
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to submit profile")
        return
      }

      // Save case studies separately
      for (const study of formData.case_studies) {
        if (!study.title || !study.description) continue

        await fetch("/api/freelancer/case-studies", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            title: study.title,
            description: study.description,
            category: formData.primary_category
              .toLowerCase()
              .replace(/\s+/g, "-"), // convert to slug
            outcome: study.outcome || "",
            technologies: study.technologies || [],
            project_url: study.project_url || ""
          })
        })
      }



      setSuccess(true)

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push("/get-hired/freelancer/dashboard")
      }, 2000)

    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Steps configuration
  const steps = [
    { number: 1, title: "Basic Info", icon: User },
    { number: 2, title: "Professional Details", icon: Briefcase },
    { number: 3, title: "Portfolio & Social", icon: Globe },
    { number: 4, title: "Case Studies", icon: FileText },
    { number: 5, title: "Experience", icon: Layers },
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
                  <p className="text-sm mt-2 font-medium" style={{ color: '#31302f' }}>
                    {step.title}
                  </p>
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
              {currentStep === 1 && "Let's start with your basic professional information"}
              {currentStep === 2 && "Add your skills, bio, and professional details"}
              {currentStep === 3 && "Connect your portfolio and social profiles"}
              {currentStep === 4 && "Share case studies that showcase your expertise"}
              {currentStep === 5 && "Add your work experience and education"}
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
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1"
                      style={{ borderColor: '#241C15', backgroundColor: '#faf4e5', color: '#31302f' }}
                      placeholder="John Doe"
                    />
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
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1"
                      style={{ borderColor: '#241C15', backgroundColor: '#faf4e5', color: '#31302f' }}
                      placeholder="e.g., Senior Web Developer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: '#31302f' }}>
                      Primary Category *
                    </label>
                    <select
                      name="primary_category"
                      value={formData.primary_category}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1"
                      style={{ borderColor: '#241C15', backgroundColor: '#faf4e5', color: '#31302f' }}
                    >
                      <option value="">Select a category</option>
                      {primaryCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {formData.primary_category && (
                    <div>
                      <label className="block text-sm font-medium mb-1" style={{ color: '#31302f' }}>
                        Subcategory
                      </label>
                      <select
                        name="subcategory"
                        value={formData.subcategory}
                        onChange={handleInputChange}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1"
                        style={{ borderColor: '#241C15', backgroundColor: '#faf4e5', color: '#31302f' }}
                      >
                        <option value="">Select a subcategory</option>
                        {subcategories[formData.primary_category]?.map(sub => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))}
                      </select>
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
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1"
                      style={{ borderColor: '#241C15', backgroundColor: '#faf4e5', color: '#31302f' }}
                      placeholder="5"
                    />
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
                        <option key={opt} value={opt}>{opt.replace('-', ' ').toUpperCase()}</option>
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
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1"
                      style={{ borderColor: '#241C15', backgroundColor: '#faf4e5', color: '#31302f' }}
                      placeholder="Tell us about yourself, your expertise, and what makes you unique..."
                    />
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

              {/* Step 4: Case Studies */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  {formData.case_studies.map((study, index) => (
                    <div key={index} className="p-4 rounded-lg border relative" style={{ borderColor: '#241C15' }}>
                      {index > 0 && (
                        <button
                          onClick={() => removeCaseStudy(index)}
                          className="absolute -top-2 -right-2 p-1 rounded-full bg-[#f7af00] hover:opacity-70"
                        >
                          <X className="h-4 w-4" style={{ color: '#050504' }} />
                        </button>
                      )}
                      <h3 className="text-lg font-medium mb-3" style={{ color: '#050504' }}>
                        Case Study {index + 1}
                      </h3>
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Project Title"
                          value={study.title}
                          onChange={(e) => updateCaseStudy(index, 'title', e.target.value)}
                          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1"
                          style={{ borderColor: '#241C15', backgroundColor: '#faf4e5', color: '#31302f' }}
                        />
                        <textarea
                          placeholder="Project Description"
                          value={study.description}
                          onChange={(e) => updateCaseStudy(index, 'description', e.target.value)}
                          rows={3}
                          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1"
                          style={{ borderColor: '#241C15', backgroundColor: '#faf4e5', color: '#31302f' }}
                        />
                        <input
                          type="text"
                          placeholder="Key Outcome/Result"
                          value={study.outcome}
                          onChange={(e) => updateCaseStudy(index, 'outcome', e.target.value)}
                          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1"
                          style={{ borderColor: '#241C15', backgroundColor: '#faf4e5', color: '#31302f' }}
                        />
                      </div>
                    </div>
                  ))}

                  {formData.case_studies.length < 3 && (
                    <Button
                      onClick={addCaseStudy}
                      className="w-full p-3 rounded-lg flex items-center justify-center space-x-2"
                      style={{ backgroundColor: 'transparent', border: '2px dashed #241C15', color: '#31302f' }}
                    >
                      <Plus className="h-5 w-5" />
                      <span>Add Another Case Study</span>
                    </Button>
                  )}

                  {/* Testimonials Section */}
                  <div className="mt-8">
                    <h3 className="text-xl font-medium mb-4" style={{ color: '#050504' }}>
                      Client Testimonials
                    </h3>

                    {formData.testimonials.map((testimonial, index) => (
                      <div key={index} className="p-4 rounded-lg border relative mb-4" style={{ borderColor: '#241C15' }}>
                        {index > 0 && (
                          <button
                            onClick={() => removeTestimonial(index)}
                            className="absolute -top-2 -right-2 p-1 rounded-full bg-[#f7af00] hover:opacity-70"
                          >
                            <X className="h-4 w-4" style={{ color: '#050504' }} />
                          </button>
                        )}
                        <h4 className="text-lg font-medium mb-3" style={{ color: '#050504' }}>
                          Testimonial {index + 1}
                        </h4>
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
                            <select
                              value={testimonial.rating}
                              onChange={(e) => updateTestimonial(index, 'rating', parseInt(e.target.value))}
                              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1"
                              style={{ borderColor: '#241C15', backgroundColor: '#faf4e5', color: '#31302f' }}
                            >
                              {[1, 2, 3, 4, 5].map(num => (
                                <option key={num} value={num}>{num} Star{num !== 1 ? 's' : ''}</option>
                              ))}
                            </select>
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
                              value={edu.field_of_study}
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
                    onClick={() => setCurrentStep(prev => prev + 1)}
                    disabled={!validateStep(currentStep)}
                    className="px-6 py-3 rounded-lg flex items-center space-x-2 disabled:opacity-50"
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
                    disabled={loading || !validateStep(currentStep)}
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