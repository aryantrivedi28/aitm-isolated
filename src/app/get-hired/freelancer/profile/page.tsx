"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  User,
  ArrowLeft,
  Edit3,
  X,
  Save,
  Briefcase,
  Award,
  GraduationCap,
  Github,
  Globe,
  Calendar,
  CheckCircle,
  TrendingUp,
  FileText,
  ExternalLink,
  Plus,
  Trash2,
  FolderOpen,
  Menu,
} from "lucide-react"

const fetcher = (url: string) => fetch(url, { credentials: "include" }).then((res) => res.json())

interface Project {
  name: string
  description: string
  technologies?: string[]
  project_url?: string
  start_date?: string
  end_date?: string
}

export default function FreelancerProfilePage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { data: profileData, mutate } = useSWR("/api/freelancer/profile", fetcher)
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    bio: "",
    skills: [] as string[],
    experience_years: 0,
    hourly_rate: 0,
    availability: "full-time",
    github_url: "",
    portfolio_url: "",
    education: [] as string[],
    certifications: [] as string[],
    resume_url: "",
    projects: [] as Project[],
  })

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (profileData?.profile) {
      setFormData({
        name: profileData.profile.name || "",
        title: profileData.profile.title || "",
        bio: profileData.profile.bio || "",
        skills: Array.isArray(profileData.profile.skills) ? profileData.profile.skills : [],
        experience_years: profileData.profile.experience_years || 0,
        hourly_rate: profileData.profile.hourly_rate || 0,
        availability: profileData.profile.availability || "full-time",
        github_url: profileData.profile.github_url || "",
        portfolio_url: profileData.profile.portfolio_url || "",
        education: Array.isArray(profileData.profile.education) ? profileData.profile.education : [],
        certifications: Array.isArray(profileData.profile.certifications) ? profileData.profile.certifications : [],
        resume_url: profileData.profile.resume_url || "",
        projects: Array.isArray(profileData.profile.projects) ? profileData.profile.projects : [],
      })
    }
  }, [profileData])

  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      setPreviewImage(URL.createObjectURL(file))
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "experience_years" || name === "hourly_rate" ? Number.parseFloat(value) || 0 : value,
    }))
  }

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      skills: e.target.value.split(",").map((s) => s.trim()).filter(s => s !== ""),
    }))
  }

  // Project management functions
  const addProject = () => {
    setFormData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          name: "",
          description: "",
          technologies: [],
          project_url: "",
          start_date: "",
          end_date: ""
        }
      ]
    }))
  }

  const updateProject = (index: number, field: string, value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.map((project, i) =>
        i === index ? { ...project, [field]: value } : project
      )
    }))
  }

  const removeProject = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/freelancer/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to update profile")
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
    <div className="min-h-screen" style={{ backgroundColor: '#241C15' }}>
      {/* Professional Header */}
      <header className="bg-white shadow-sm" style={{ borderBottom: '3px solid #FFE01B' }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="flex items-center space-x-2 hover:bg-transparent p-2 sm:p-2"
                style={{ color: '#241C15' }}
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              <div className="h-6 w-px hidden sm:block" style={{ backgroundColor: '#FFE01B' }}></div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-1.5 sm:p-2 rounded-lg" style={{ backgroundColor: '#FFE01B' }}>
                  <User className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: '#241C15' }} />
                </div>
                <h1 className="text-lg sm:text-xl font-bold" style={{ color: '#241C15' }}>
                  My Profile
                </h1>
              </div>
            </div>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center space-x-2 font-semibold transition-all duration-200 text-sm sm:text-base p-2 sm:px-4 sm:py-2"
              style={{
                backgroundColor: isEditing ? 'transparent' : '#FFE01B',
                color: '#241C15',
                border: isEditing ? '2px solid #FFE01B' : 'none'
              }}
            >
              {isEditing ? (
                <>
                  <X className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Cancel</span>
                </>
              ) : (
                <>
                  <Edit3 className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Edit Profile</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Profile Summary */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            {/* Profile Card */}
            <Card className="bg-white border shadow-sm" style={{ borderColor: '#FFE01B' }}>
              <CardContent className="pt-4 sm:pt-6">
                <div className="text-center">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mx-auto mb-3 sm:mb-4">
                    <img
                      src={previewImage || profile?.photo_url || "/default-avatar.png"}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover border-4"
                      style={{ borderColor: '#FFE01B' }}
                    />
                    {isEditing && (
                      <label className="absolute bottom-0 right-0 bg-[#FFE01B] p-1.5 sm:p-2 rounded-full cursor-pointer">
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        <Edit3 className="h-3 w-3 sm:h-4 sm:w-4 text-[#241C15]" />
                      </label>
                    )}
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold mb-1" style={{ color: '#241C15' }}>
                    {profile?.name || "Your Name"}
                  </h2>
                  <p className="text-xs sm:text-sm mb-2" style={{ color: '#241C15', opacity: 0.6 }}>
                    {profile?.email}
                  </p>
                  {profile?.title && (
                    <p className="text-xs sm:text-sm mb-3 sm:mb-4 font-medium" style={{ color: '#FFE01B' }}>
                      {profile.title}
                    </p>
                  )}
                  {profile?.email_verified && (
                    <div className="inline-flex items-center space-x-1 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold mb-3 sm:mb-4" style={{ backgroundColor: '#fbf5e5', color: '#241C15' }}>
                      <CheckCircle className="h-3 w-3" style={{ color: '#FFE01B' }} />
                      <span>Verified</span>
                    </div>
                  )}
                </div>

                {/* Resume Download Button */}
                {profile?.resume_url && (
                  <div className="mt-3 sm:mt-4">
                    <Button
                      onClick={() => window.open(profile.resume_url, '_blank')}
                      className="w-full flex items-center justify-center space-x-2 font-semibold text-xs sm:text-sm"
                      style={{ backgroundColor: '#FFE01B', color: '#241C15' }}
                    >
                      <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>View Resume</span>
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Profile Rating */}
            {profile?.profile_rating && (
              <Card className="bg-white border shadow-sm" style={{ borderColor: '#FFE01B' }}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm sm:text-base flex items-center space-x-2" style={{ color: '#241C15' }}>
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Profile Strength</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center mb-3 sm:mb-4">
                    <div className="text-center">
                      <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-1" style={{ color: '#FFE01B' }}>
                        {profile.profile_rating}
                      </div>
                      <div className="text-xs sm:text-sm" style={{ color: '#241C15', opacity: 0.6 }}>out of 10</div>
                    </div>
                  </div>
                  {profile.rating_feedback && profile.rating_feedback.length > 0 && (
                    <div className="space-y-2 pt-3 sm:pt-4 border-t" style={{ borderTopColor: '#FFE01B' }}>
                      <p className="text-xs font-semibold mb-2" style={{ color: '#241C15' }}>
                        Improvement Tips:
                      </p>
                      {profile.rating_feedback.map((feedback: string, idx: number) => (
                        <div key={idx} className="flex items-start space-x-2">
                          <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#FFE01B' }}></div>
                          <p className="text-xs leading-relaxed" style={{ color: '#241C15', opacity: 0.7 }}>
                            {feedback}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <Card className="bg-white border shadow-sm" style={{ borderColor: '#FFE01B' }}>
              <CardContent className="pt-4 sm:pt-6 space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-3 w-3 sm:h-4 sm:w-4" style={{ color: '#FFE01B' }} />
                    <span className="text-xs sm:text-sm font-medium" style={{ color: '#241C15' }}>Experience</span>
                  </div>
                  <span className="text-xs sm:text-sm font-bold" style={{ color: '#241C15' }}>
                    {profile?.experience_years || 0} {profile?.experience_years === 1 ? 'year' : 'years'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4" style={{ color: '#FFE01B' }} />
                    <span className="text-xs sm:text-sm font-medium" style={{ color: '#241C15' }}>Availability</span>
                  </div>
                  <span className="text-xs sm:text-sm font-bold capitalize" style={{ color: '#241C15' }}>
                    {profile?.availability ? profile.availability.replace('-', ' ') : "Not set"}
                  </span>
                </div>
                {profile?.hourly_rate && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" style={{ color: '#FFE01B' }} />
                      <span className="text-xs sm:text-sm font-medium" style={{ color: '#241C15' }}>Hourly Rate</span>
                    </div>
                    <span className="text-xs sm:text-sm font-bold" style={{ color: '#241C15' }}>
                      ${profile.hourly_rate}/hr
                    </span>
                  </div>
                )}
                {profile?.projects && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FolderOpen className="h-3 w-3 sm:h-4 sm:w-4" style={{ color: '#FFE01B' }} />
                      <span className="text-xs sm:text-sm font-medium" style={{ color: '#241C15' }}>Projects</span>
                    </div>
                    <span className="text-xs sm:text-sm font-bold" style={{ color: '#241C15' }}>
                      {profile.projects.length}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2">
            <Card className="bg-white border shadow-sm" style={{ borderColor: '#FFE01B' }}>
              <CardContent className="p-4 sm:p-5 lg:p-6">
                {error && (
                  <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg border" style={{ backgroundColor: '#fbf5e5', borderColor: '#FFE01B' }}>
                    <p className="text-xs sm:text-sm font-medium" style={{ color: '#241C15' }}>{error}</p>
                  </div>
                )}

                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold mb-2" style={{ color: '#241C15' }}>
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all text-sm sm:text-base"
                          style={{ borderColor: '#FFE01B', color: '#241C15' }}
                        />
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-semibold mb-2" style={{ color: '#241C15' }}>
                          Professional Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all text-sm sm:text-base"
                          style={{ borderColor: '#FFE01B', color: '#241C15' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold mb-2" style={{ color: '#241C15' }}>
                        Professional Bio
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all text-sm sm:text-base"
                        style={{ borderColor: '#FFE01B', color: '#241C15' }}
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold mb-2" style={{ color: '#241C15' }}>
                        Skills (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={formData.skills.join(", ")}
                        onChange={handleSkillsChange}
                        className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all text-sm sm:text-base"
                        style={{ borderColor: '#FFE01B', color: '#241C15' }}
                        placeholder="JavaScript, React, Node.js, etc."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold mb-2" style={{ color: '#241C15' }}>
                          Years of Experience
                        </label>
                        <input
                          type="number"
                          name="experience_years"
                          value={formData.experience_years}
                          onChange={handleChange}
                          min="0"
                          className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all text-sm sm:text-base"
                          style={{ borderColor: '#FFE01B', color: '#241C15' }}
                        />
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-semibold mb-2" style={{ color: '#241C15' }}>
                          Hourly Rate ($)
                        </label>
                        <input
                          type="number"
                          name="hourly_rate"
                          value={formData.hourly_rate}
                          onChange={handleChange}
                          min="0"
                          step="0.01"
                          className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all text-sm sm:text-base"
                          style={{ borderColor: '#FFE01B', color: '#241C15' }}
                        />
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-semibold mb-2" style={{ color: '#241C15' }}>
                          Availability
                        </label>
                        <select
                          name="availability"
                          value={formData.availability}
                          onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all text-sm sm:text-base"
                          style={{ borderColor: '#FFE01B', color: '#241C15' }}
                        >
                          <option value="full-time">Full-time</option>
                          <option value="part-time">Part-time</option>
                          <option value="contract">Contract</option>
                          <option value="freelance">Freelance</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="text-xs sm:text-sm font-semibold mb-2 flex items-center space-x-2" style={{ color: '#241C15' }}>
                          <Github className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>GitHub URL</span>
                        </label>
                        <input
                          type="url"
                          name="github_url"
                          value={formData.github_url}
                          onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all text-sm sm:text-base"
                          style={{ borderColor: '#FFE01B', color: '#241C15' }}
                          placeholder="https://github.com/username"
                        />
                      </div>

                      <div>
                        <label className="text-xs sm:text-sm font-semibold mb-2 flex items-center space-x-2" style={{ color: '#241C15' }}>
                          <Globe className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>Portfolio URL</span>
                        </label>
                        <input
                          type="url"
                          name="portfolio_url"
                          value={formData.portfolio_url}
                          onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all text-sm sm:text-base"
                          style={{ borderColor: '#FFE01B', color: '#241C15' }}
                          placeholder="https://yourportfolio.com"
                        />
                      </div>
                    </div>

                    {/* Projects Section */}
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 sm:mb-4">
                        <label className="text-xs sm:text-sm font-semibold flex items-center space-x-2" style={{ color: '#241C15' }}>
                          <FolderOpen className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>Projects</span>
                        </label>
                        <Button
                          type="button"
                          onClick={addProject}
                          className="flex items-center space-x-2 text-xs sm:text-sm"
                          style={{ backgroundColor: '#FFE01B', color: '#241C15' }}
                        >
                          <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>Add Project</span>
                        </Button>
                      </div>

                      <div className="space-y-3 sm:space-y-4">
                        {formData.projects.map((project, index) => (
                          <div key={index} className="p-3 sm:p-4 border rounded-lg" style={{ borderColor: '#FFE01B' }}>
                            <div className="flex items-center justify-between mb-2 sm:mb-3">
                              <h4 className="font-semibold text-sm sm:text-base" style={{ color: '#241C15' }}>
                                Project {index + 1}
                              </h4>
                              <Button
                                type="button"
                                onClick={() => removeProject(index)}
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 sm:p-2"
                              >
                                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-1 gap-2 sm:gap-3">
                              <div>
                                <label className="block text-xs font-medium mb-1" style={{ color: '#241C15' }}>
                                  Project Name
                                </label>
                                <input
                                  type="text"
                                  value={project.name}
                                  onChange={(e) => updateProject(index, 'name', e.target.value)}
                                  className="w-full px-3 py-2 border rounded text-sm"
                                  style={{ borderColor: '#FFE01B', color: '#241C15' }}
                                  placeholder="Project Name"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-medium mb-1" style={{ color: '#241C15' }}>
                                  Description
                                </label>
                                <textarea
                                  value={project.description}
                                  onChange={(e) => updateProject(index, 'description', e.target.value)}
                                  rows={2}
                                  className="w-full px-3 py-2 border rounded text-sm"
                                  style={{ borderColor: '#FFE01B', color: '#241C15' }}
                                  placeholder="Project description..."
                                />
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                                <div>
                                  <label className="block text-xs font-medium mb-1" style={{ color: '#241C15' }}>
                                    Start Date
                                  </label>
                                  <input
                                    type="text"
                                    value={project.start_date || ''}
                                    onChange={(e) => updateProject(index, 'start_date', e.target.value)}
                                    className="w-full px-3 py-2 border rounded text-sm"
                                    style={{ borderColor: '#FFE01B', color: '#241C15' }}
                                    placeholder="MM/YYYY"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium mb-1" style={{ color: '#241C15' }}>
                                    End Date
                                  </label>
                                  <input
                                    type="text"
                                    value={project.end_date || ''}
                                    onChange={(e) => updateProject(index, 'end_date', e.target.value)}
                                    className="w-full px-3 py-2 border rounded text-sm"
                                    style={{ borderColor: '#FFE01B', color: '#241C15' }}
                                    placeholder="MM/YYYY or Present"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-xs font-medium mb-1" style={{ color: '#241C15' }}>
                                  Project URL
                                </label>
                                <input
                                  type="url"
                                  value={project.project_url || ''}
                                  onChange={(e) => updateProject(index, 'project_url', e.target.value)}
                                  className="w-full px-3 py-2 border rounded text-sm"
                                  style={{ borderColor: '#FFE01B', color: '#241C15' }}
                                  placeholder="https://project-demo.com"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs sm:text-sm font-semibold mb-2 flex items-center space-x-2" style={{ color: '#241C15' }}>
                        <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>Education (one per line)</span>
                      </label>
                      <textarea
                        name="education"
                        value={formData.education.join("\n")}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            education: e.target.value.split("\n").map((edu) => edu.trim()).filter(edu => edu !== ""),
                          }))
                        }
                        rows={2}
                        className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all text-sm sm:text-base"
                        style={{ borderColor: '#FFE01B', color: '#241C15' }}
                        placeholder="B.Sc. Computer Science - University Name (2020)"
                      />
                    </div>

                    <div>
                      <label className="text-xs sm:text-sm font-semibold mb-2 flex items-center space-x-2" style={{ color: '#241C15' }}>
                        <Award className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>Certifications (one per line)</span>
                      </label>
                      <textarea
                        name="certifications"
                        value={formData.certifications.join("\n")}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            certifications: e.target.value.split("\n").map((cert) => cert.trim()).filter(cert => cert !== ""),
                          }))
                        }
                        rows={2}
                        className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all text-sm sm:text-base"
                        style={{ borderColor: '#FFE01B', color: '#241C15' }}
                        placeholder="AWS Certified Developer"
                      />
                    </div>

                    <div>
                      <label className="text-xs sm:text-sm font-semibold mb-2 flex items-center space-x-2" style={{ color: '#241C15' }}>
                        <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>Resume URL</span>
                      </label>
                      <input
                        type="url"
                        name="resume_url"
                        value={formData.resume_url}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all text-sm sm:text-base"
                        style={{ borderColor: '#FFE01B', color: '#241C15' }}
                        placeholder="https://yourresume.com"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center space-x-2 font-semibold text-sm sm:text-base py-2 sm:py-3"
                      style={{ backgroundColor: '#FFE01B', color: '#241C15' }}
                    >
                      <Save className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{loading ? "Saving..." : "Save Changes"}</span>
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-6 sm:space-y-8">
                    {/* Professional Title */}
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Briefcase className="h-3 w-3 sm:h-4 sm:w-4" style={{ color: '#FFE01B' }} />
                        <h3 className="text-xs sm:text-sm font-semibold" style={{ color: '#241C15', opacity: 0.6 }}>
                          Professional Title
                        </h3>
                      </div>
                      <p className="text-base sm:text-lg font-semibold" style={{ color: '#241C15' }}>
                        {profile?.title || "Not set"}
                      </p>
                    </div>

                    {profile?.bio && (
                      <div>
                        <h3 className="text-xs sm:text-sm font-semibold mb-2" style={{ color: '#241C15', opacity: 0.6 }}>
                          About Me
                        </h3>
                        <p className="text-sm sm:text-base leading-relaxed whitespace-pre-line" style={{ color: '#241C15' }}>
                          {profile.bio}
                        </p>
                      </div>
                    )}

                    {/* Skills */}
                    <div>
                      <h3 className="text-xs sm:text-sm font-semibold mb-3" style={{ color: '#241C15', opacity: 0.6 }}>
                        Skills & Expertise
                      </h3>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {Array.isArray(profile?.skills) && profile.skills.length > 0 ? (
                          profile.skills.map((skill: string, idx: number) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="px-2 sm:px-3 py-1 font-medium text-xs sm:text-sm"
                              style={{ backgroundColor: '#fbf5e5', color: '#241C15', border: '1px solid #FFE01B' }}
                            >
                              {skill}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-xs sm:text-sm" style={{ color: '#241C15', opacity: 0.5 }}>No skills added yet</p>
                        )}
                      </div>
                    </div>

                    {/* Projects Display */}
                    {profile?.projects && profile.projects.length > 0 && (
                      <div>
                        <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                          <FolderOpen className="h-3 w-3 sm:h-4 sm:w-4" style={{ color: '#FFE01B' }} />
                          <h3 className="text-xs sm:text-sm font-semibold" style={{ color: '#241C15', opacity: 0.6 }}>
                            Projects
                          </h3>
                        </div>
                        <div className="space-y-3 sm:space-y-4">
                          {profile.projects.map((project: Project, idx: number) => (
                            <Card key={idx} className="border" style={{ borderColor: '#FFE01B' }}>
                              <CardContent className="p-3 sm:p-4">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                                  <h4 className="font-semibold text-base sm:text-lg" style={{ color: '#241C15' }}>
                                    {project.name}
                                  </h4>
                                  {(project.start_date || project.end_date) && (
                                    <p className="text-xs font-medium" style={{ color: '#241C15', opacity: 0.6 }}>
                                      {project.start_date} {project.end_date && `- ${project.end_date}`}
                                    </p>
                                  )}
                                </div>
                                <p className="text-xs sm:text-sm mb-3 leading-relaxed" style={{ color: '#241C15', opacity: 0.8 }}>
                                  {project.description}
                                </p>
                                {project.project_url && (
                                  <a
                                    href={project.project_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center space-x-1 text-xs sm:text-sm font-medium"
                                    style={{ color: '#FFE01B' }}
                                  >
                                    <span>View Project</span>
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Links */}
                    {(profile?.github_url || profile?.portfolio_url) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        {profile?.github_url && (
                          <a
                            href={profile.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 p-3 rounded-lg border transition-all hover:shadow-sm"
                            style={{ borderColor: '#FFE01B', color: '#241C15' }}
                          >
                            <Github className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: '#FFE01B' }} />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold" style={{ color: '#241C15', opacity: 0.6 }}>GitHub</p>
                              <p className="text-xs sm:text-sm font-medium truncate">{profile.github_url}</p>
                            </div>
                          </a>
                        )}
                        {profile?.portfolio_url && (
                          <a
                            href={profile.portfolio_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 p-3 rounded-lg border transition-all hover:shadow-sm"
                            style={{ borderColor: '#FFE01B', color: '#241C15' }}
                          >
                            <Globe className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: '#FFE01B' }} />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold" style={{ color: '#241C15', opacity: 0.6 }}>Portfolio</p>
                              <p className="text-xs sm:text-sm font-medium truncate">{profile.portfolio_url}</p>
                            </div>
                          </a>
                        )}
                      </div>
                    )}

                    {/* Education */}
                    {profile?.education && profile.education.length > 0 && (
                      <div>
                        <div className="flex items-center space-x-2 mb-3">
                          <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4" style={{ color: '#FFE01B' }} />
                          <h3 className="text-xs sm:text-sm font-semibold" style={{ color: '#241C15', opacity: 0.6 }}>
                            Education
                          </h3>
                        </div>
                        <div className="space-y-2">
                          {profile.education.map((edu: string, idx: number) => (
                            <div key={idx} className="flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#FFE01B' }}></div>
                              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: '#241C15' }}>{edu}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Certifications */}
                    {profile?.certifications && profile.certifications.length > 0 && (
                      <div>
                        <div className="flex items-center space-x-2 mb-3">
                          <Award className="h-3 w-3 sm:h-4 sm:w-4" style={{ color: '#FFE01B' }} />
                          <h3 className="text-xs sm:text-sm font-semibold" style={{ color: '#241C15', opacity: 0.6 }}>
                            Certifications
                          </h3>
                        </div>
                        <div className="space-y-2">
                          {profile.certifications.map((cert: string, idx: number) => (
                            <div key={idx} className="flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#FFE01B' }}></div>
                              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: '#241C15' }}>{cert}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}