"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  User,
  Edit3,
  Save,
  Briefcase,
  Award,
  GraduationCap,
  Github,
  Globe,
  CheckCircle,
  TrendingUp,
  FileText,
  ExternalLink,
  Plus,
  Trash2,
  FolderOpen,
  Building2,
  Code2,
  Palette,
  Loader2,
  Mail,
  Phone,
  Linkedin,
  Twitter,
  Calendar,
  MapPin,
  X,
  AlertCircle,
  Star,
  Wrench
} from "lucide-react"

// Update interfaces to match your data structure
interface CaseStudy {
  id?: string
  title: string
  description: string
  outcome: string
  technologies?: string[]
  category?: string
  image_url?: string
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
  id?: string
  title: string
  company: string
  location?: string
  start_date: string
  end_date?: string
  current: boolean
  description: string
  achievements?: string[]
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

interface ProfileContentProps {
  isEditing: boolean
  formData: {
    id?: string
    name: string
    email: string
    phone: string
    title: string
    bio: string
    skills: string[]
    tools_tech_stack: string[]
    experience_years: number
    availability: string
    primary_category: string
    subcategory: string
    github_url: string
    linkedin_url: string
    twitter_url: string
    portfolio_url: string
    other_portfolio_links: string[]
    hourly_rate: number | null
    languages: string[]
    education: string[]
    certifications: string[]
    resume_url: string
    projects: Project[]
    background_type: "tech" | "non-tech" | "both"
    profile_rating: number | null
    rating_feedback: string[]
    photo_url: string
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
  profile: any
  loading: boolean
  error: string
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  handleSkillsChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleToolsChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleLanguagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleCertificationsChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  setFormData: (data: any) => void
  removeWorkExperience: (id: string) => void
  removeCaseStudyItem: (id: string) => Promise<void>
  removeTestimonial: (id: string) => void
  onAddExperience: () => void
  onAddCaseStudy: () => void
  onAddTestimonial: () => void
  onStartEditing: () => void
}

export function ProfileContent({
  isEditing,
  formData,
  profile,
  loading,
  error,
  handleChange,
  handleSkillsChange,
  handleToolsChange,
  handleLanguagesChange,
  handleCertificationsChange,
  handleSubmit,
  setFormData,
  removeWorkExperience,
  removeCaseStudyItem,
  removeTestimonial,
  onAddExperience,
  onAddCaseStudy,
  onAddTestimonial,
  onStartEditing,
}: ProfileContentProps) {
  // Get data from formData or profile
  const caseStudies = formData?.case_studies || profile?.case_studies || []
  const workExperience = formData?.work_experience || profile?.work_experience || []
  const testimonials = formData?.testimonials || profile?.testimonials || []
  const skills = formData?.skills || profile?.skills || []
  const tools = formData?.tools_tech_stack || profile?.tools_tech_stack || []
  const languages = formData?.languages || profile?.languages || []
  const certifications = formData?.certifications || profile?.certifications || []
  const education = formData?.education || profile?.education || []
  const projects = formData?.projects || profile?.projects || []

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

  if (isEditing) {
    return (
      <Card className="border-0 shadow-sm rounded-xl" style={{ backgroundColor: "#faf4e5" }}>
        <CardHeader className="pb-3 border-b" style={{ borderBottomColor: "#f7af00" }}>
          <CardTitle className="text-lg sm:text-xl font-bold flex items-center space-x-2">
            <Edit3 className="h-5 w-5" style={{ color: "#f7af00" }} />
            <span style={{ color: "#050504" }}>Edit Profile</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-lg border flex items-start space-x-3" style={{ backgroundColor: "#f0eadd", borderColor: "#241C15" }}>
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: "#241C15" }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: "#31302f" }}>Error</p>
                  <p className="text-sm" style={{ color: "#31302f" }}>{error}</p>
                </div>
              </div>
            )}

            {/* Basic Info Section */}
            <div>
              <h3 className="text-md font-semibold mb-4 pb-2 border-b" style={{ color: "#050504", borderBottomColor: "#f7af00" }}>
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#31302f" }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-offset-0"
                    style={{
                      borderColor: "#241C15",
                      color: "#31302f",
                      backgroundColor: "#f0eadd"
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#31302f" }}>
                    Professional Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-offset-0"
                    style={{
                      borderColor: "#241C15",
                      color: "#31302f",
                      backgroundColor: "#f0eadd"
                    }}
                    placeholder="e.g., Full Stack Developer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#31302f" }}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-offset-0"
                    style={{
                      borderColor: "#241C15",
                      color: "#31302f",
                      backgroundColor: "#f0eadd"
                    }}
                    placeholder="+1 234 567 8900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#31302f" }}>
                    Primary Category
                  </label>
                  <select
                    name="primary_category"
                    value={formData.primary_category}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-offset-0"
                    style={{
                      borderColor: "#241C15",
                      color: "#31302f",
                      backgroundColor: "#f0eadd"
                    }}
                  >
                    <option value="">Select Category</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Shopify Development">Shopify Development</option>
                    <option value="SEO Optimization">SEO Optimization</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Content Writing">Content Writing</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Background Type */}
            <div>
              <h3 className="text-md font-semibold mb-4 pb-2 border-b" style={{ color: "#050504", borderBottomColor: "#f7af00" }}>
                Background Type
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "tech", label: "Tech", icon: Code2 },
                  { value: "non-tech", label: "Creative", icon: Palette },
                  { value: "both", label: "Both", icon: TrendingUp },
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setFormData((prev: any) => ({
                        ...prev,
                        background_type: value,
                      }))
                    }
                    className={`flex flex-col items-center p-4 rounded-lg border transition-all ${formData.background_type === value ? "ring-2" : ""
                      }`}
                    style={{
                      borderColor: formData.background_type === value ? "#f7af00" : "#241C15",
                      backgroundColor: formData.background_type === value ? "#f0eadd" : "#faf4e5",
                      color: "#31302f"
                    }}
                    onMouseEnter={handleButtonHover}
                    onMouseLeave={handleButtonLeave}
                  >
                    <Icon className="h-5 w-5 mb-2" style={{ color: "#f7af00" }} />
                    <span className="text-xs font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div>
              <h3 className="text-md font-semibold mb-4 pb-2 border-b" style={{ color: "#050504", borderBottomColor: "#f7af00" }}>
                Bio
              </h3>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-offset-0 resize-none"
                style={{
                  borderColor: "#241C15",
                  color: "#31302f",
                  backgroundColor: "#f0eadd"
                }}
                placeholder="Tell us about yourself..."
              />
            </div>

            {/* Skills & Tools */}
            <div>
              <h3 className="text-md font-semibold mb-4 pb-2 border-b" style={{ color: "#050504", borderBottomColor: "#f7af00" }}>
                Skills & Technologies
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#31302f" }}>
                    Skills (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.skills?.join(", ")}
                    onChange={handleSkillsChange}
                    className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-offset-0"
                    style={{
                      borderColor: "#241C15",
                      color: "#31302f",
                      backgroundColor: "#f0eadd"
                    }}
                    placeholder="React, Node.js, Python"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#31302f" }}>
                    Tools & Tech Stack (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tools_tech_stack?.join(", ")}
                    onChange={handleToolsChange}
                    className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-offset-0"
                    style={{
                      borderColor: "#241C15",
                      color: "#31302f",
                      backgroundColor: "#f0eadd"
                    }}
                    placeholder="VS Code, Git, Docker"
                  />
                </div>
              </div>
            </div>

            {/* Languages & Certifications */}
            <div>
              <h3 className="text-md font-semibold mb-4 pb-2 border-b" style={{ color: "#050504", borderBottomColor: "#f7af00" }}>
                Languages & Certifications
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#31302f" }}>
                    Languages (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.languages?.join(", ")}
                    onChange={handleLanguagesChange}
                    className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-offset-0"
                    style={{
                      borderColor: "#241C15",
                      color: "#31302f",
                      backgroundColor: "#f0eadd"
                    }}
                    placeholder="English, Spanish, French"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#31302f" }}>
                    Certifications (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.certifications?.join(", ")}
                    onChange={handleCertificationsChange}
                    className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-offset-0"
                    style={{
                      borderColor: "#241C15",
                      color: "#31302f",
                      backgroundColor: "#f0eadd"
                    }}
                    placeholder="AWS Certified, Google Analytics"
                  />
                </div>
              </div>
            </div>

            {/* Experience & Availability */}
            <div>
              <h3 className="text-md font-semibold mb-4 pb-2 border-b" style={{ color: "#050504", borderBottomColor: "#f7af00" }}>
                Experience & Availability
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#31302f" }}>
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    name="experience_years"
                    value={formData.experience_years}
                    onChange={handleChange}
                    min="0"
                    step="0.5"
                    className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-offset-0"
                    style={{
                      borderColor: "#241C15",
                      color: "#31302f",
                      backgroundColor: "#f0eadd"
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#31302f" }}>
                    Availability
                  </label>
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-offset-0"
                    style={{
                      borderColor: "#241C15",
                      color: "#31302f",
                      backgroundColor: "#f0eadd"
                    }}
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="freelance">Freelance</option>
                    <option value="not-available">Not Available</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#31302f" }}>
                    Hourly Rate ($)
                  </label>
                  <input
                    type="number"
                    name="hourly_rate"
                    value={formData.hourly_rate || ""}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-offset-0"
                    style={{
                      borderColor: "#241C15",
                      color: "#31302f",
                      backgroundColor: "#f0eadd"
                    }}
                    placeholder="50"
                  />
                </div>
              </div>
            </div>

            {/* Social & Portfolio Links */}
            <div>
              <h3 className="text-md font-semibold mb-4 pb-2 border-b" style={{ color: "#050504", borderBottomColor: "#f7af00" }}>
                Social & Portfolio Links
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#31302f" }}>
                      GitHub URL
                    </label>
                    <div className="relative">
                      <Github className="absolute left-3 top-3 h-4 w-4" style={{ color: "#f7af00" }} />
                      <input
                        type="url"
                        name="github_url"
                        value={formData.github_url}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-offset-0"
                        style={{
                          borderColor: "#241C15",
                          color: "#31302f",
                          backgroundColor: "#f0eadd"
                        }}
                        placeholder="https://github.com/username"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#31302f" }}>
                      LinkedIn URL
                    </label>
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-3 h-4 w-4" style={{ color: "#f7af00" }} />
                      <input
                        type="url"
                        name="linkedin_url"
                        value={formData.linkedin_url}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-offset-0"
                        style={{
                          borderColor: "#241C15",
                          color: "#31302f",
                          backgroundColor: "#f0eadd"
                        }}
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#31302f" }}>
                      Twitter/X URL
                    </label>
                    <div className="relative">
                      <Twitter className="absolute left-3 top-3 h-4 w-4" style={{ color: "#f7af00" }} />
                      <input
                        type="url"
                        name="twitter_url"
                        value={formData.twitter_url}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-offset-0"
                        style={{
                          borderColor: "#241C15",
                          color: "#31302f",
                          backgroundColor: "#f0eadd"
                        }}
                        placeholder="https://twitter.com/username"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#31302f" }}>
                      Portfolio URL
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 h-4 w-4" style={{ color: "#f7af00" }} />
                      <input
                        type="url"
                        name="portfolio_url"
                        value={formData.portfolio_url}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-offset-0"
                        style={{
                          borderColor: "#241C15",
                          color: "#31302f",
                          backgroundColor: "#f0eadd"
                        }}
                        placeholder="https://yourportfolio.com"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t" style={{ borderTopColor: "#f7af00" }}>
              <Button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 font-semibold px-8 py-2.5 rounded-lg transition-all disabled:opacity-50"
                style={{
                  backgroundColor: "#f7af00",
                  color: "#050504",
                  boxShadow: "0 2px 6px rgba(36, 28, 21, 0.05)"
                }}
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonLeave}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    )
  }

  if (!profile && !formData.name) {
    return (
      <Card className="border-0 shadow-sm rounded-xl flex items-center justify-center min-h-[400px]" style={{ backgroundColor: "#faf4e5" }}>
        <CardContent className="py-10 flex flex-col items-center justify-center text-center space-y-5">
          <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: "#f7af00" }}>
            <User className="h-10 w-10" style={{ color: "#050504" }} />
          </div>
          <div className="space-y-3">
            <h2 className="text-xl font-bold" style={{ color: "#050504" }}>
              No profile details yet
            </h2>
            <p className="text-sm" style={{ color: "#31302f" }}>
              Add your background, links, and case studies so clients can learn more about you.
            </p>
          </div>
          <Button
            onClick={onStartEditing}
            className="font-semibold px-6 py-2.5 rounded-lg transition-all"
            style={{
              backgroundColor: "#f7af00",
              color: "#050504",
              boxShadow: "0 2px 6px rgba(36, 28, 21, 0.05)"
            }}
            onMouseEnter={handleButtonHover}
            onMouseLeave={handleButtonLeave}
          >
            Add profile details
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
      {/* Left Column - Profile Card */}
      <div className="lg:col-span-1 space-y-5 sm:space-y-6">
        <Card className="border-0 shadow-sm rounded-xl" style={{ backgroundColor: "#faf4e5" }}>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              {/* Profile Photo */}
              {formData?.photo_url ? (
                <div className="w-24 h-24 rounded-full mb-4 overflow-hidden border-4" style={{ borderColor: "#f7af00" }}>
                  <img
                    src={formData.photo_url}
                    alt={formData.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const parent = target.parentElement
                      if (parent) {
                        const fallback = document.createElement('div')
                        fallback.className = 'w-full h-full flex items-center justify-center'
                        fallback.style.backgroundColor = '#f7af00'
                        fallback.innerHTML = '<svg class="h-12 w-12" fill="#050504" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>'
                        parent.appendChild(fallback)
                      }
                    }}
                  />
                </div>
              ) : (
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: "#f7af00" }}
                >
                  <User className="h-12 w-12" style={{ color: "#050504" }} />
                </div>
              )}

              <h2 className="text-xl font-bold mb-2" style={{ color: "#050504" }}>
                {formData.name}
              </h2>
              <p className="text-sm font-medium mb-3" style={{ color: "#31302f" }}>
                {formData.title}
              </p>
              
              {formData.primary_category && (
                <Badge
                  className="mb-2 text-xs px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: "#f0eadd",
                    color: "#241C15",
                  }}
                >
                  {formData.primary_category}
                  {formData.subcategory && ` • ${formData.subcategory}`}
                </Badge>
              )}

              <Badge
                className="mb-5 text-xs px-3 py-1 rounded-full"
                style={{
                  backgroundColor: "#f0eadd",
                  color: "#241C15",
                }}
              >
                {formData.background_type === "tech"
                  ? "Tech Background"
                  : formData.background_type === "non-tech"
                    ? "Creative Background"
                    : "Tech & Creative"}
              </Badge>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 w-full mt-6">
                <div className="text-center p-4 rounded-lg" style={{ backgroundColor: "#f0eadd" }}>
                  <p className="text-2xl font-bold" style={{ color: "#050504" }}>
                    {formData.experience_years || 0}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#31302f" }}>
                    Years Exp.
                  </p>
                </div>
                <div className="text-center p-4 rounded-lg" style={{ backgroundColor: "#f0eadd" }}>
                  <p className="text-2xl font-bold" style={{ color: "#050504" }}>
                    {caseStudies.length || 0}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#31302f" }}>
                    Case Studies
                  </p>
                </div>
                <div className="text-center p-4 rounded-lg" style={{ backgroundColor: "#f0eadd" }}>
                  <p className="text-2xl font-bold" style={{ color: "#050504" }}>
                    {workExperience.length || 0}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#31302f" }}>
                    Experience
                  </p>
                </div>
              </div>

              {/* Availability Status */}
              <div
                className="mt-6 p-4 rounded-lg border shadow-sm w-full"
                style={{ backgroundColor: "#f0eadd", borderColor: "#241C15" }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: "#31302f" }}>
                    Availability
                  </span>
                  <Badge
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: "#f7af00",
                      color: "#050504",
                    }}
                  >
                    {formData?.availability ? formData.availability.charAt(0).toUpperCase() + formData.availability.slice(1).replace('-', ' ') : "Not Set"}
                  </Badge>
                </div>
                {formData.hourly_rate && (
                  <div className="mt-2 text-center">
                    <span className="text-sm font-medium" style={{ color: "#050504" }}>
                      ${formData.hourly_rate}/hour
                    </span>
                  </div>
                )}
              </div>

              {/* Contact Links */}
              <div className="mt-6 space-y-3 w-full">
                {formData?.email && (
                  <a
                    href={`mailto:${formData.email}`}
                    className="flex items-center space-x-3 p-3 rounded-lg transition-all hover:bg-[#f0eadd]"
                    style={{ color: "#31302f", backgroundColor: "#faf4e5" }}
                  >
                    <Mail className="h-4 w-4" style={{ color: "#f7af00" }} />
                    <span className="text-sm truncate">{formData.email}</span>
                  </a>
                )}
                {formData?.phone && (
                  <div className="flex items-center space-x-3 p-3 rounded-lg" style={{ color: "#31302f", backgroundColor: "#faf4e5" }}>
                    <Phone className="h-4 w-4" style={{ color: "#f7af00" }} />
                    <span className="text-sm truncate">{formData.phone}</span>
                  </div>
                )}
                {formData?.github_url && (
                  <a
                    href={formData.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 rounded-lg transition-all hover:bg-[#f0eadd]"
                    style={{ color: "#31302f", backgroundColor: "#faf4e5" }}
                  >
                    <Github className="h-4 w-4" style={{ color: "#f7af00" }} />
                    <span className="text-sm truncate">GitHub</span>
                    <ExternalLink className="h-3 w-3 ml-auto" />
                  </a>
                )}
                {formData?.linkedin_url && (
                  <a
                    href={formData.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 rounded-lg transition-all hover:bg-[#f0eadd]"
                    style={{ color: "#31302f", backgroundColor: "#faf4e5" }}
                  >
                    <Linkedin className="h-4 w-4" style={{ color: "#f7af00" }} />
                    <span className="text-sm truncate">LinkedIn</span>
                    <ExternalLink className="h-3 w-3 ml-auto" />
                  </a>
                )}
                {formData?.portfolio_url && (
                  <a
                    href={formData.portfolio_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 rounded-lg transition-all hover:bg-[#f0eadd]"
                    style={{ color: "#31302f", backgroundColor: "#faf4e5" }}
                  >
                    <Globe className="h-4 w-4" style={{ color: "#f7af00" }} />
                    <span className="text-sm truncate">Portfolio</span>
                    <ExternalLink className="h-3 w-3 ml-auto" />
                  </a>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card className="border-0 shadow-sm rounded-xl" style={{ backgroundColor: "#faf4e5" }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center space-x-2" style={{ color: "#050504" }}>
              <Award className="h-5 w-5" style={{ color: "#f7af00" }} />
              <span>Skills</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill: string, idx: number) => (
                  <Badge
                    key={idx}
                    className="text-sm py-1.5 px-4 rounded-full"
                    style={{ backgroundColor: "#f7af00", color: "#050504" }}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm" style={{ color: "#31302f" }}>
                No skills added yet.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Tools & Tech Stack */}
        <Card className="border-0 shadow-sm rounded-xl" style={{ backgroundColor: "#faf4e5" }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center space-x-2" style={{ color: "#050504" }}>
              <Wrench className="h-5 w-5" style={{ color: "#f7af00" }} />
              <span>Tools & Tech Stack</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tools.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {tools.map((tool: string, idx: number) => (
                  <Badge
                    key={idx}
                    className="text-sm py-1.5 px-4 rounded-full"
                    style={{ backgroundColor: "#f0eadd", color: "#241C15" }}
                  >
                    {tool}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm" style={{ color: "#31302f" }}>
                No tools added yet.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Profile Rating */}
        {formData.profile_rating && (
          <Card className="border-0 shadow-sm rounded-xl" style={{ backgroundColor: "#faf4e5" }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center space-x-2" style={{ color: "#31302f" }}>
                <TrendingUp className="h-4 w-4" style={{ color: "#f7af00" }} />
                <span>Profile Rating</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold" style={{ color: "#050504" }}>
                  {formData.profile_rating}
                </span>
                <Badge className="text-xs" style={{ backgroundColor: "#f0eadd", color: "#241C15" }}>
                  /100
                </Badge>
              </div>
              {formData.rating_feedback?.length > 0 && (
                <ul className="space-y-2 text-sm" style={{ color: "#31302f" }}>
                  {formData.rating_feedback.map((fb: string, idx: number) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: "#f7af00" }} />
                      <span>{fb}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        )}

        {/* Education */}
        <Card className="border-0 shadow-sm rounded-xl" style={{ backgroundColor: "#faf4e5" }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center space-x-2" style={{ color: "#31302f" }}>
              <GraduationCap className="h-5 w-5" style={{ color: "#f7af00" }} />
              <span>Education</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {education.length > 0 ? (
              <ul className="space-y-3">
                {education.map((edu: string, index: number) => (
                  <li
                    key={index}
                    className="flex items-start space-x-3 text-sm"
                    style={{ color: "#31302f" }}
                  >
                    <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: "#f7af00" }} />
                    <span>{edu}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm" style={{ color: "#31302f" }}>
                No education added yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card className="border-0 shadow-sm rounded-xl" style={{ backgroundColor: "#faf4e5" }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center space-x-2" style={{ color: "#31302f" }}>
              <Award className="h-5 w-5" style={{ color: "#f7af00" }} />
              <span>Certifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {certifications.length > 0 ? (
              <ul className="space-y-3">
                {certifications.map((cert: string, index: number) => (
                  <li key={index} className="flex items-start space-x-3 text-sm" style={{ color: "#31302f" }}>
                    <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: "#f7af00" }} />
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm" style={{ color: "#31302f" }}>No certifications added yet</p>
            )}
          </CardContent>
        </Card>

        {/* Languages */}
        <Card className="border-0 shadow-sm rounded-xl" style={{ backgroundColor: "#faf4e5" }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center space-x-2" style={{ color: "#31302f" }}>
              <Globe className="h-4 w-4" style={{ color: "#f7af00" }} />
              <span>Languages</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {languages.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {languages.map((lang: string, idx: number) => (
                  <Badge
                    key={idx}
                    className="text-xs px-3 py-1 rounded-full"
                    style={{ backgroundColor: "#f0eadd", color: "#241C15" }}
                  >
                    {lang}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm" style={{ color: "#31302f" }}>
                No languages added yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Main Content */}
      <div className="lg:col-span-2 space-y-5 sm:space-y-6">
        {/* Bio Section */}
        <Card className="border-0 shadow-sm rounded-xl" style={{ backgroundColor: "#faf4e5" }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center space-x-2" style={{ color: "#050504" }}>
              <FileText className="h-5 w-5" style={{ color: "#f7af00" }} />
              <span>About Me</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed" style={{ color: "#31302f" }}>
              {formData?.bio || "No bio added yet. Click Edit Profile to add your bio."}
            </p>
          </CardContent>
        </Card>

        {/* Testimonials Section */}
        {testimonials.length > 0 && (
          <Card className="border-0 shadow-sm rounded-xl" style={{ backgroundColor: "#faf4e5" }}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold flex items-center space-x-2" style={{ color: "#050504" }}>
                  <Star className="h-5 w-5" style={{ color: "#f7af00" }} />
                  <span>Testimonials</span>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onAddTestimonial}
                  className="text-xs hover:bg-[#f0eadd]"
                  style={{ color: "#241C15" }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {testimonials.map((testimonial: Testimonial) => (
                <div
                  key={testimonial.id}
                  className="p-4 rounded-lg relative group"
                  style={{ backgroundColor: "#f0eadd" }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => testimonial.id && removeTestimonial(testimonial.id)}
                    className="absolute top-2 right-2 p-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: "#241C15" }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "#f7af00" }}>
                        <User className="h-5 w-5" style={{ color: "#050504" }} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-sm" style={{ color: "#050504" }}>
                            {testimonial.client_name}
                          </h4>
                          {testimonial.company && (
                            <p className="text-xs" style={{ color: "#31302f" }}>{testimonial.company}</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${i < testimonial.rating ? 'fill-current' : ''}`}
                              style={{ color: i < testimonial.rating ? '#f7af00' : '#31302f' }}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm" style={{ color: "#31302f" }}>"{testimonial.content}"</p>
                      {testimonial.date && (
                        <p className="text-xs mt-2" style={{ color: "#31302f", opacity: 0.7 }}>
                          {new Date(testimonial.date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Projects */}
        <Card className="border-0 shadow-sm rounded-xl" style={{ backgroundColor: "#faf4e5" }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center space-x-2" style={{ color: "#050504" }}>
              <FolderOpen className="h-5 w-5" style={{ color: "#f7af00" }} />
              <span>Projects</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {projects.length > 0 ? (
              projects.map((project: Project, idx: number) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg transition-all hover:shadow-sm"
                  style={{ backgroundColor: "#f0eadd" }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-base mb-2" style={{ color: "#050504" }}>
                        {project.name}
                      </h4>
                      <p className="text-sm mb-3" style={{ color: "#31302f" }}>
                        {project.description}
                      </p>
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, i) => (
                            <Badge
                              key={i}
                              className="text-xs px-3 py-1 rounded-full"
                              style={{ backgroundColor: "#faf4e5", color: "#241C15" }}
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {project.project_url && (
                        <a
                          href={project.project_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 mt-3 text-sm hover:underline"
                          style={{ color: "#241C15" }}
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span>View Project</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm" style={{ color: "#31302f" }}>
                No projects added yet.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Work Experience Section */}
        <Card className="border-0 shadow-sm rounded-xl" style={{ backgroundColor: "#faf4e5" }}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold flex items-center space-x-2" style={{ color: "#050504" }}>
                <Briefcase className="h-5 w-5" style={{ color: "#f7af00" }} />
                <span>Work Experience</span>
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onAddExperience}
                className="text-xs hover:bg-[#f0eadd]"
                style={{ color: "#241C15" }}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {workExperience.length > 0 ? (
              <div className="space-y-5">
                {workExperience.map((exp: WorkExperience) => (
                  <div
                    key={exp.id}
                    className="relative pl-8 pb-5 border-l-2 last:pb-0 group"
                    style={{ borderLeftColor: "#f7af00" }}
                  >
                    <div
                      className="absolute -left-2 top-0 w-4 h-4 rounded-full"
                      style={{ backgroundColor: "#f7af00" }}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => exp.id && removeWorkExperience(exp.id)}
                      className="absolute -right-2 top-0 p-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: "#241C15" }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="flex-1">
                      <h4 className="font-semibold text-base mb-1" style={{ color: "#050504" }}>
                        {exp.title}
                      </h4>
                      <div className="flex items-center space-x-2 mb-2">
                        <Building2 className="h-4 w-4" style={{ color: "#f7af00" }} />
                        <span className="text-sm" style={{ color: "#31302f" }}>{exp.company}</span>
                        {exp.location && (
                          <>
                            <span style={{ color: "#31302f" }}>•</span>
                            <MapPin className="h-3 w-3" style={{ color: "#f7af00" }} />
                            <span className="text-sm" style={{ color: "#31302f" }}>{exp.location}</span>
                          </>
                        )}
                      </div>
                      <p className="text-xs mb-3 flex items-center space-x-2" style={{ color: "#31302f" }}>
                        <Calendar className="h-3 w-3" style={{ color: "#f7af00" }} />
                        <span>
                          {exp.start_date} - {exp.current ? "Present" : exp.end_date || "N/A"}
                        </span>
                      </p>
                      {exp.description && (
                        <p className="text-sm mb-3" style={{ color: "#31302f" }}>
                          {exp.description}
                        </p>
                      )}
                      {exp.achievements && exp.achievements.length > 0 && (
                        <ul className="space-y-2">
                          {exp.achievements.map((achievement: string, i: number) => (
                            <li
                              key={i}
                              className="text-sm flex items-start space-x-2"
                              style={{ color: "#31302f" }}
                            >
                              <CheckCircle
                                className="h-4 w-4 mt-0.5 flex-shrink-0"
                                style={{ color: "#f7af00" }}
                              />
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 rounded-lg" style={{ backgroundColor: "#f0eadd" }}>
                <Briefcase className="h-12 w-12 mx-auto mb-4" style={{ color: "#f7af00" }} />
                <p className="text-sm mb-4" style={{ color: "#31302f" }}>
                  No work experience added yet.
                </p>
                <Button
                  onClick={onAddExperience}
                  className="px-4 py-2 rounded-lg transition-all"
                  style={{
                    backgroundColor: "#241C15",
                    color: "#f7af00",
                    boxShadow: "0 2px 6px rgba(36, 28, 21, 0.05)"
                  }}
                  onMouseEnter={handleButtonHover}
                  onMouseLeave={handleButtonLeave}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Experience
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Case Studies Section */}
        <Card className="border-0 shadow-sm rounded-xl" style={{ backgroundColor: "#faf4e5" }}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold flex items-center space-x-2" style={{ color: "#050504" }}>
                <FolderOpen className="h-5 w-5" style={{ color: "#f7af00" }} />
                <span>Case Studies</span>
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onAddCaseStudy}
                className="text-xs hover:bg-[#f0eadd]"
                style={{ color: "#241C15" }}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {caseStudies.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {caseStudies.map((item: CaseStudy) => (
                  <div
                    key={item.id}
                    className="group rounded-xl border overflow-hidden transition-all hover:shadow-sm relative"
                    style={{
                      backgroundColor: "#f0eadd",
                      borderColor: "#241C15"
                    }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => item.id && removeCaseStudyItem(item.id)}
                      className="absolute top-2 right-2 p-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      style={{ color: "#241C15", backgroundColor: "#faf4e5" }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    {item.image_url && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={item.image_url || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h4
                        className="font-semibold text-base line-clamp-1 mb-2"
                        style={{ color: "#050504" }}
                      >
                        {item.title}
                      </h4>
                      <p
                        className="text-sm mb-3 line-clamp-2"
                        style={{ color: "#31302f" }}
                      >
                        {item.description}
                      </p>
                      <p
                        className="text-sm font-medium mb-3"
                        style={{ color: "#f7af00" }}
                      >
                        Outcome: {item.outcome}
                      </p>
                      {item.technologies && item.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {item.technologies.slice(0, 3).map((tech, i) => (
                            <Badge
                              key={i}
                              className="text-xs px-2 py-1 rounded-full"
                              style={{
                                backgroundColor: "#f7af00",
                                color: "#050504"
                              }}
                            >
                              {tech}
                            </Badge>
                          ))}
                          {item.technologies.length > 3 && (
                            <Badge
                              className="text-xs px-2 py-1 rounded-full"
                              style={{
                                backgroundColor: "#faf4e5",
                                color: "#241C15"
                              }}
                            >
                              +{item.technologies.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                      {item.project_url && (
                        <a
                          href={item.project_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 mt-3 text-sm hover:underline"
                          style={{ color: "#241C15" }}
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span>View Project</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 rounded-lg" style={{ backgroundColor: "#f0eadd" }}>
                <FolderOpen
                  className="h-12 w-12 mx-auto mb-4"
                  style={{ color: "#f7af00" }}
                />
                <p
                  className="text-sm font-medium mb-2"
                  style={{ color: "#31302f" }}
                >
                  Add your Case Studies
                </p>
                <p className="text-sm" style={{ color: "#31302f", opacity: 0.8 }}>
                  Showcase your best work with detailed case studies
                </p>
                <Button
                  onClick={onAddCaseStudy}
                  className="mt-4 px-4 py-2 rounded-lg transition-all"
                  style={{
                    backgroundColor: "#241C15",
                    color: "#f7af00",
                    boxShadow: "0 2px 6px rgba(36, 28, 21, 0.05)"
                  }}
                  onMouseEnter={handleButtonHover}
                  onMouseLeave={handleButtonLeave}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Case Study
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}