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
} from "lucide-react"

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
  startDate: string
  endDate?: string
  current: boolean  // Changed from is_current to current
  description: string
  achievements?: string[]
}

interface ProfileContentProps {
  isEditing: boolean
  formData: {
    name: string
    title: string
    bio: string
    skills: string[]
    experience_years: number
    availability: string
    github_url: string
    portfolio_url: string
    education: string[]
    certifications: string[]
    resume_url: string
    projects: Project[]
    background_type: "tech" | "non-tech" | "both"
    case_studies: CaseStudyItem[]
    work_experience: WorkExperience[]
  }
  profile: any
  loading: boolean
  error: string
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  handleSkillsChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  setFormData: (data: any) => void
  removeWorkExperience: (id: string) => void
  removeCaseStudyItem: (id: string) => Promise<void>
  onAddExperience: () => void
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
  handleSubmit,
  setFormData,
  removeWorkExperience,
  removeCaseStudyItem,
  onAddExperience,
  onStartEditing,
}: ProfileContentProps) {
  // Get case studies from formData or profile
  const caseStudies = formData?.case_studies || profile?.case_studies || []

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
        <CardHeader className="pb-3">
          <CardTitle className="text-lg sm:text-xl font-bold flex items-center space-x-2">
            <Edit3 className="h-5 w-5" style={{ color: "#f7af00" }} />
            <span style={{ color: "#050504" }}>Edit Profile</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg border" style={{ backgroundColor: "#faf4e5", borderColor: "#241C15", color: "#241C15" }}>
                {error}
              </div>
            )}

            {/* Basic Info */}
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
            </div>

            {/* Background Type */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: "#31302f" }}>
                Background Type
              </label>
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
              <label className="block text-sm font-medium mb-2" style={{ color: "#31302f" }}>
                Bio
              </label>
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

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#31302f" }}>
                Skills (comma-separated)
              </label>
              <input
                type="text"
                value={formData.skills.join(", ")}
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

            {/* Experience Years & Availability */}
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
                  <option value="not-available">Not Available</option>
                </select>
              </div>
            </div>

            {/* URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#31302f" }}>
                  GitHub URL
                </label>
                <input
                  type="url"
                  name="github_url"
                  value={formData.github_url}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-offset-0"
                  style={{
                    borderColor: "#241C15",
                    color: "#31302f",
                    backgroundColor: "#f0eadd"
                  }}
                  placeholder="https://github.com/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#31302f" }}>
                  Portfolio URL
                </label>
                <input
                  type="url"
                  name="portfolio_url"
                  value={formData.portfolio_url}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-offset-0"
                  style={{
                    borderColor: "#241C15",
                    color: "#31302f",
                    backgroundColor: "#f0eadd"
                  }}
                  placeholder="https://yourportfolio.com"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-5">
              <Button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 font-semibold px-6 py-2.5 rounded-lg transition-all"
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

  if (!profile) {
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
              {/* Profile Photo - Updated Section */}
              {profile?.photo_url ? (
                <div className="w-24 h-24 rounded-full mb-4 overflow-hidden border-4" style={{ borderColor: "#f7af00" }}>
                  <img
                    src={profile.photo_url}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      // Show fallback icon
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                  <div class="w-full h-full flex items-center justify-center" style="background-color: #f7af00;">
                    <svg class="h-12 w-12" fill="#050504" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                `;
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
                {profile.name}
              </h2>
              <p className="text-sm font-medium mb-3" style={{ color: "#31302f" }}>
                {profile.title}
              </p>
              <Badge
                className="mb-5 text-xs px-3 py-1 rounded-full"
                style={{
                  backgroundColor: "#f0eadd",
                  color: "#241C15",
                }}
              >
                {profile.background_type === "tech"
                  ? "Tech Background"
                  : profile.background_type === "non-tech"
                    ? "Creative Background"
                    : "Tech & Creative"}
              </Badge>

              {/* Stats Grid - Fixed Experience Count */}
              <div className="grid grid-cols-3 gap-3 w-full mt-6">
                <div className="text-center p-4 rounded-lg" style={{ backgroundColor: "#f0eadd" }}>
                  <p className="text-2xl font-bold" style={{ color: "#050504" }}>
                    {profile.experience_years || 0}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#31302f" }}>
                    Years Exp.
                  </p>
                </div>
                <div className="text-center p-4 rounded-lg" style={{ backgroundColor: "#f0eadd" }}>
                  <p className="text-2xl font-bold" style={{ color: "#050504" }}>
                    {profile?.case_studies?.length || caseStudies.length || 0}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#31302f" }}>
                    Case Studies
                  </p>
                </div>
                <div className="text-center p-4 rounded-lg" style={{ backgroundColor: "#f0eadd" }}>
                  <p className="text-2xl font-bold" style={{ color: "#050504" }}>
                    {profile?.work_experience?.length || 0}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#31302f" }}>
                    Experience
                  </p>
                </div>
              </div>

              {/* Availability Status */}
              <div
                className="mt-6 p-4 rounded-lg border shadow-sm w-full"
                style={{ backgroundColor: "#f0eadd" }}
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
                    {profile?.availability ? profile.availability.charAt(0).toUpperCase() + profile.availability.slice(1).replace('-', ' ') : "Not Set"}
                  </Badge>
                </div>
              </div>

              {/* Contact Links */}
              <div className="mt-6 space-y-3 w-full">
                {profile?.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex items-center space-x-3 p-3 rounded-lg transition-all hover:bg-f0eadd"
                    style={{ color: "#31302f", backgroundColor: "#faf4e5" }}
                  >
                    <Mail className="h-4 w-4" style={{ color: "#f7af00" }} />
                    <span className="text-sm truncate">{profile.email}</span>
                  </a>
                )}
                {profile?.phone && (
                  <div className="flex items-center space-x-3 p-3 rounded-lg" style={{ color: "#31302f", backgroundColor: "#faf4e5" }}>
                    <Phone className="h-4 w-4" style={{ color: "#f7af00" }} />
                    <span className="text-sm truncate">{profile.phone}</span>
                  </div>
                )}
                {profile?.github_url && (
                  <a
                    href={profile.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 rounded-lg transition-all hover:bg-f0eadd"
                    style={{ color: "#31302f", backgroundColor: "#faf4e5" }}
                  >
                    <Github className="h-4 w-4" style={{ color: "#f7af00" }} />
                    <span className="text-sm truncate">GitHub</span>
                    <ExternalLink className="h-3 w-3 ml-auto" />
                  </a>
                )}
                {profile?.linkedin_url && (
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 rounded-lg transition-all hover:bg-f0eadd"
                    style={{ color: "#31302f", backgroundColor: "#faf4e5" }}
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" style={{ color: "#f7af00" }}>
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    <span className="text-sm truncate">LinkedIn</span>
                    <ExternalLink className="h-3 w-3 ml-auto" />
                  </a>
                )}
                {profile?.portfolio_url && (
                  <a
                    href={profile.portfolio_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 rounded-lg transition-all hover:bg-f0eadd"
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
            {profile?.skills?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill: string, idx: number) => (
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



        {/* Profile Rating */}
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
                {profile?.profile_rating ?? "–"}
              </span>
              <Badge className="text-xs" style={{ backgroundColor: "#f0eadd", color: "#241C15" }}>
                /10
              </Badge>
            </div>
            {profile?.rating_feedback?.length ? (
              <ul className="space-y-2 text-sm" style={{ color: "#31302f" }}>
                {profile.rating_feedback.map((fb: string, idx: number) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: "#f7af00" }} />
                    <span>{fb}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm" style={{ color: "#31302f" }}>
                No feedback yet.
              </p>
            )}
          </CardContent>
        </Card>

        {/*  ✅ Education & Certifications moved here  */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-5">

          {/* Education */}
          <Card className="border-0 shadow-sm rounded-xl" style={{ backgroundColor: "#faf4e5" }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center space-x-2" style={{ color: "#31302f" }}>
                <GraduationCap className="h-5 w-5" style={{ color: "#f7af00" }} />
                <span>Education</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {formData.education.length > 0 ? (
                <ul className="space-y-3">
                  {formData.education.map((edu: string, index: number) => (
                    <li
                      key={index}
                      className="flex items-start space-x-3 text-sm"
                      style={{ color: "#31302f" }}
                    >
                      <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: "#f7af00" }} />
                      <span>{edu}</span> ✅
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
              {profile?.certifications?.length > 0 ? (
                <ul className="space-y-3">
                  {profile.certifications.map((cert: string, index: number) => (
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

        </div>

        {/* Languages */}
        <Card className="border-0 shadow-sm rounded-xl" style={{ backgroundColor: "#faf4e5" }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center space-x-2" style={{ color: "#31302f" }}>
              <Globe className="h-4 w-4" style={{ color: "#f7af00" }} />
              <span>Languages</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.languages?.length ? (
              <div className="flex flex-wrap gap-2">
                {profile.languages.map((lang: string, idx: number) => (
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
              {profile?.bio || "No bio added yet. Click Edit Profile to add your bio."}
            </p>
          </CardContent>
        </Card>

        {/* Projects */}
        <Card className="border-0 shadow-sm rounded-xl" style={{ backgroundColor: "#faf4e5" }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center space-x-2" style={{ color: "#050504" }}>
              <FolderOpen className="h-5 w-5" style={{ color: "#f7af00" }} />
              <span>Projects</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile?.projects?.length ? (
              profile.projects.map((project: Project, idx: number) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg transition-all hover:shadow-sm"
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
            </div>
          </CardHeader>
          <CardContent>
            {profile?.work_experience?.length > 0 ? (  // Changed from formData to profile
              <div className="space-y-5">
                {profile.work_experience.map((exp: WorkExperience) => (  // Changed from formData to profile
                  <div
                    key={exp.id}
                    className="relative pl-8 pb-5 border-l-2 last:pb-0"
                    style={{ borderLeftColor: "#f7af00" }}
                  >
                    <div
                      className="absolute -left-2 top-0 w-4 h-4 rounded-full"
                      style={{ backgroundColor: "#f7af00" }}
                    />
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-base mb-1" style={{ color: "#050504" }}>
                          {exp.role}
                        </h4>
                        <div className="flex items-center space-x-2 mb-2">
                          <Building2 className="h-4 w-4" style={{ color: "#f7af00" }} />
                          <span className="text-sm" style={{ color: "#31302f" }}>{exp.company}</span>
                          {exp.location && (
                            <>
                              <span style={{ color: "#31302f" }}>•</span>
                              <span className="text-sm" style={{ color: "#31302f" }}>{exp.location}</span>
                            </>
                          )}
                        </div>
                        <p className="text-xs mb-3" style={{ color: "#31302f" }}>
                          {exp.startDate} - {exp.current ? "Present" : exp.endDate || "N/A"}  {/* Changed is_current to current */}
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeWorkExperience(exp.id)}
                        className="text-xs hover:bg-f0eadd ml-2 p-2"
                        style={{ color: "#241C15" }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
            </div>
          </CardHeader>
          <CardContent>
            {caseStudies.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {caseStudies.map((item) => (
                  <div
                    key={item.id}
                    className="group rounded-xl border overflow-hidden transition-all hover:shadow-sm"
                    style={{
                      backgroundColor: "#f0eadd"
                    }}
                  >
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
                      <div className="flex items-start justify-between mb-2">
                        <h4
                          className="font-semibold text-base line-clamp-1"
                          style={{ color: "#050504" }}
                        >
                          {item.title}
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCaseStudyItem(item.id)}
                          className="p-1 h-6 w-6 hover:bg-faf4e5"
                          style={{ color: "#241C15" }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p
                        className="text-sm mb-3 line-clamp-2"
                        style={{ color: "#31302f" }}
                      >
                        {item.description}
                      </p>
                      {item.tools && item.tools.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {item.tools.slice(0, 3).map((tool, i) => (
                            <Badge
                              key={i}
                              className="text-xs px-2 py-1 rounded-full"
                              style={{
                                backgroundColor: "#f7af00",
                                color: "#050504"
                              }}
                            >
                              {tool}
                            </Badge>
                          ))}
                          {item.tools.length > 3 && (
                            <Badge
                              className="text-xs px-2 py-1 rounded-full"
                              style={{
                                backgroundColor: "#faf4e5",
                                color: "#241C15"
                              }}
                            >
                              +{item.tools.length - 3}
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
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}