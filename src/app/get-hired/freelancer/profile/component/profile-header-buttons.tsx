"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Plus,
  Edit3,
  X,
  Briefcase,
  FolderOpen,
  Save,
  Loader2,
  Upload,
  Code2,
  Palette,
  Megaphone,
  TrendingUp,
  Mail,
  Users,
  Target,
  BarChart,
  Rocket,
  Gauge,
  ShoppingBag,
  Crown,
  Video,
  Palette as PaletteIcon,
  Layout,
  Globe,
  Zap,
  Menu,
  Star,
  CheckCircle,
  AlertCircle,
  FileText,
  Percent,
  DollarSign,
  Image as ImageIcon,
  Link as LinkIcon,
  ChevronDown,
  ChevronUp,
  PlusCircle,
  Trash2
} from "lucide-react"
import { DialogTrigger, DialogOverlay } from "@radix-ui/react-dialog"
import { useState, useEffect } from "react"

// Updated interfaces to match database structure
interface CaseStudyMetric {
  label: string
  value: number
  type: 'number' | 'percentage' | 'currency'
  trend?: 'up' | 'down' | 'neutral'
}

interface CaseStudy {
  id: string
  title: string
  short_summary: string
  category: string
  industry: string
  problem_statement: string
  solution_provided: string
  strategy?: string
  implementation?: string
  results_overview: string
  metrics: CaseStudyMetric[]
  technologies: string[]
  tags: string[]
  image_url: string
  gallery_images: string[]
  project_url?: string
  testimonial?: {
    content: string
    author?: string
    role?: string
  }
  status: 'draft' | 'pending' | 'approved' | 'rejected'
  is_featured: boolean
  view_count: number
  created_at: string
}
interface Testimonial {
  id?: string
  client_name: string
  company: string
  content: string
  rating: number
  date?: string
  linkedin_url?: string
  role?: string
  avatar_url?: string
}

interface WorkExperience {
  id: string
  title: string
  company: string
  location?: string
  start_date: string
  end_date?: string
  current: boolean
  description: string
  achievements?: string[]
  technologies?: string[]
}

interface ProfileHeaderButtonsProps {
  isEditing: boolean
  setIsEditing: (value: boolean) => void
  showExperienceModal: boolean
  setShowExperienceModal: (value: boolean) => void
  showCaseStudyModal: boolean
  setShowCaseStudyModal: (value: boolean) => void
  showTestimonialModal: boolean
  setShowTestimonialModal: (value: boolean) => void
  newExperience: WorkExperience
  setNewExperience: (experience: WorkExperience) => void
  newCaseStudyItem: CaseStudy
  setNewCaseStudyItem: React.Dispatch<React.SetStateAction<CaseStudy>>
  newTestimonial?: Testimonial
  setNewTestimonial?: (testimonial: Testimonial) => void
  uploadingImages: Record<string, boolean>
  error: string
  savingCaseStudy: boolean
  savingTestimonial?: boolean
  savingExperience: boolean
  handleAddExperience: () => Promise<void>
  handleAddCaseStudyItem: () => Promise<void>
  handleAddTestimonial?: () => Promise<void>
  handleImageUpload: (itemId: string, file: File) => Promise<void>
  handleImageDelete?: (itemId: string, imagePath: string) => Promise<void>
  resetNewExperience: () => void
  resetNewCaseStudyItem: () => void
  resetNewTestimonial?: () => void
  onSubmitForReview?: () => Promise<void>
  reviewStatus?: string
  canSubmitForReview?: boolean
  loading?: boolean
  editingCaseStudyId?: string | null
}

// Category options with icons and industries
const CASE_STUDY_CATEGORIES = [
  {
    value: "Web Development",
    label: "Web Development",
    icon: Code2,
    industries: ["E-commerce", "SaaS", "Education", "Healthcare", "Finance", "Real Estate", "Travel", "Media"]
  },
  {
    value: "Shopify Development",
    label: "Shopify",
    icon: ShoppingBag,
    industries: ["E-commerce", "Retail", "Fashion", "Electronics", "Home & Garden", "Beauty"]
  },
  {
    value: "SEO Optimization",
    label: "SEO",
    icon: Target,
    industries: ["E-commerce", "SaaS", "Local Business", "Professional Services", "Publishing", "Travel"]
  },
  {
    value: "UI/UX Design",
    label: "UI/UX Design",
    icon: Layout,
    industries: ["SaaS", "E-commerce", "Mobile Apps", "Enterprise", "Startups"]
  },
  {
    value: "Digital Marketing",
    label: "Marketing",
    icon: Megaphone,
    industries: ["E-commerce", "SaaS", "B2B", "B2C", "Professional Services"]
  },
  {
    value: "Social Media",
    label: "Social Media",
    icon: TrendingUp,
    industries: ["E-commerce", "Retail", "Fashion", "Beauty", "Entertainment"]
  },
  {
    value: "Email Marketing",
    label: "Email Marketing",
    icon: Mail,
    industries: ["E-commerce", "SaaS", "Education", "Professional Services"]
  },
  {
    value: "Content Writing",
    label: "Content Writing",
    icon: FileText,
    industries: ["Publishing", "Education", "Marketing", "Corporate"]
  },
  {
    value: "Brand Strategy",
    label: "Brand Strategy",
    icon: Palette,
    industries: ["Corporate", "Startups", "Retail", "Luxury"]
  },
  {
    value: "Analytics",
    label: "Analytics",
    icon: BarChart,
    industries: ["E-commerce", "SaaS", "Finance", "Enterprise"]
  },
  {
    value: "Growth",
    label: "Growth",
    icon: Rocket,
    industries: ["Startups", "SaaS", "E-commerce"]
  },
  {
    value: "Automation",
    label: "Automation",
    icon: Zap,
    industries: ["Enterprise", "Manufacturing", "Tech"]
  },
  {
    value: "Video Editing",
    label: "Video Editing",
    icon: Video,
    industries: ["Media", "Entertainment", "Marketing"]
  },
  {
    value: "No-Code",
    label: "No-Code",
    icon: Globe,
    industries: ["Startups", "SaaS", "E-commerce"]
  },
  {
    value: "Other",
    label: "Other",
    icon: FolderOpen,
    industries: ["Other"]
  },
]

export function ProfileHeaderButtons({
  isEditing,
  setIsEditing,
  showExperienceModal,
  setShowExperienceModal,
  showCaseStudyModal,
  setShowCaseStudyModal,
  showTestimonialModal,
  setShowTestimonialModal,
  newExperience,
  setNewExperience,
  newCaseStudyItem,
  setNewCaseStudyItem,
  newTestimonial,
  setNewTestimonial,
  uploadingImages,
  error,
  savingCaseStudy,
  savingExperience,
  savingTestimonial,
  handleAddExperience,
  handleAddCaseStudyItem,
  handleAddTestimonial,
  handleImageUpload,
  handleImageDelete,
  resetNewExperience,
  resetNewCaseStudyItem,
  resetNewTestimonial,
  onSubmitForReview,
  reviewStatus,
  canSubmitForReview,
  loading,
  editingCaseStudyId
}: ProfileHeaderButtonsProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [localError, setLocalError] = useState("")
  const [localSuccess, setLocalSuccess] = useState("")
  const [showMetrics, setShowMetrics] = useState(false)
  const [newMetric, setNewMetric] = useState<CaseStudyMetric>({
    label: "",
    value: 0,
    type: "number"
  })

  // Sync with parent error
  useEffect(() => {
    if (error) {
      setLocalError(error)
      const timer = setTimeout(() => setLocalError(""), 3000)
      return () => clearTimeout(timer)
    }
  }, [error])

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

  // Handle experience form validation
  const validateExperienceForm = () => {
    if (!newExperience.title) return "Job title is required"
    if (!newExperience.company) return "Company is required"
    if (!newExperience.start_date) return "Start date is required"
    return null
  }

  // Handle case study form validation - UPDATED for new structure
  const validateCaseStudyForm = () => {
    if (!newCaseStudyItem.title) return "Project title is required"
    if (!newCaseStudyItem.short_summary) return "Short summary is required"
    if (!newCaseStudyItem.category) return "Category is required"
    if (newCaseStudyItem.metrics.length === 0) return "At least one metric is required"
    return null
  }

  // Handle testimonial form validation
  const validateTestimonialForm = () => {
    if (!newTestimonial?.client_name) return "Client name is required"
    if (!newTestimonial?.content) return "Testimonial content is required"
    return null
  }

  // Wrapper for add experience with validation
  const handleAddExperienceWithValidation = async () => {
    const validationError = validateExperienceForm()
    if (validationError) {
      setLocalError(validationError)
      return
    }
    await handleAddExperience()
  }

  // Wrapper for add case study with validation - UPDATED
  const handleAddCaseStudyWithValidation = async () => {
    const validationError = validateCaseStudyForm()
    if (validationError) {
      setLocalError(validationError)
      return
    }
    await handleAddCaseStudyItem()
  }

  // Wrapper for add testimonial with validation
  const handleAddTestimonialWithValidation = async () => {
    if (!handleAddTestimonial) return
    const validationError = validateTestimonialForm()
    if (validationError) {
      setLocalError(validationError)
      return
    }
    await handleAddTestimonial()
  }

  // Add metric to case study
  const addMetric = () => {
    if (newMetric.label && newMetric.value) {
      setNewCaseStudyItem({
        ...newCaseStudyItem,
        metrics: [...newCaseStudyItem.metrics, { ...newMetric }]
      })
      setNewMetric({ label: "", value: 0, type: "number" })
    }
  }

  // Remove metric from case study
  const removeMetric = (index: number) => {
    setNewCaseStudyItem({
      ...newCaseStudyItem,
      metrics: newCaseStudyItem.metrics.filter((_, i) => i !== index)
    })
  }

  // Get metric icon
  const getMetricIcon = (type: string) => {
    switch (type) {
      case 'percentage': return <Percent className="h-4 w-4" />
      case 'currency': return <DollarSign className="h-4 w-4" />
      default: return <TrendingUp className="h-4 w-4" />
    }
  }

  // Format metric value
  const formatMetricValue = (metric: CaseStudyMetric): string => {
    switch (metric.type) {
      case 'percentage':
        return `${metric.value}%`
      case 'currency':
        return `$${metric.value.toLocaleString()}`
      default:
        return metric.value.toLocaleString()
    }
  }

  return (
    <div className="relative">
      {/* Desktop Buttons - Hidden on Mobile */}
      <div className="hidden sm:flex items-center gap-2">
        {/* Edit Profile Button */}
        <Button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center space-x-2 font-semibold text-sm px-4 py-2.5 rounded-lg transition-all"
          style={{
            backgroundColor: isEditing ? "transparent" : "#f7af00",
            color: isEditing ? "#31302f" : "#050504",
            border: isEditing ? "2px solid #f7af00" : "none",
            boxShadow: "0 2px 6px rgba(36, 28, 21, 0.05)"
          }}
          onMouseEnter={handleButtonHover}
          onMouseLeave={handleButtonLeave}
        >
          {isEditing ? (
            <>
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </>
          ) : (
            <>
              <Edit3 className="h-4 w-4" />
              <span>Edit</span>
            </>
          )}
        </Button>

        {/* Add Work Experience Button */}
        <Dialog open={showExperienceModal} onOpenChange={setShowExperienceModal}>
          <DialogOverlay className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" />
          <DialogTrigger asChild>
            <Button
              className="flex items-center space-x-2 font-semibold text-sm px-4 py-2.5 rounded-lg transition-all"
              style={{
                backgroundColor: "#241C15",
                color: "#f7af00",
                boxShadow: "0 2px 6px rgba(36, 28, 21, 0.05)"
              }}
              onMouseEnter={handleButtonHover}
              onMouseLeave={handleButtonLeave}
            >
              <Briefcase className="h-4 w-4" />
              <span>Experience</span>
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent
            className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-1.5rem)] sm:max-w-[600px] max-h-[90vh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border"
            style={{
              backgroundColor: "#faf4e5",
              borderColor: "#241C15"
            }}
          >
            <DialogHeader className="space-y-2">
              <DialogTitle className="flex items-center space-x-2 text-xl" style={{ color: "#050504" }}>
                <Briefcase className="h-5 w-5" style={{ color: "#f7af00" }} />
                <span>Add Work Experience</span>
              </DialogTitle>
              <DialogDescription className="text-sm" style={{ color: "#31302f" }}>
                Share your professional experience to showcase your career background.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#31302f" }}>
                    Job Title <span style={{ color: "#241C15" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={newExperience.title}
                    onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-offset-0"
                    style={{
                      borderColor: "#241C15",
                      color: "#31302f",
                      backgroundColor: "#f0eadd"
                    }}
                    placeholder="e.g., Senior Developer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#31302f" }}>
                    Company <span style={{ color: "#241C15" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={newExperience.company}
                    onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-offset-0"
                    style={{
                      borderColor: "#241C15",
                      color: "#31302f",
                      backgroundColor: "#f0eadd"
                    }}
                    placeholder="Company name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#31302f" }}>
                    Location
                  </label>
                  <input
                    type="text"
                    value={newExperience.location}
                    onChange={(e) => setNewExperience({ ...newExperience, location: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-offset-0"
                    style={{
                      borderColor: "#241C15",
                      color: "#31302f",
                      backgroundColor: "#f0eadd"
                    }}
                    placeholder="City, Country"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#31302f" }}>
                    Start Date <span style={{ color: "#241C15" }}>*</span>
                  </label>
                  <input
                    type="month"
                    value={newExperience.start_date}
                    onChange={(e) => setNewExperience({ ...newExperience, start_date: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-offset-0"
                    style={{
                      borderColor: "#241C15",
                      color: "#31302f",
                      backgroundColor: "#f0eadd"
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#31302f" }}>
                    End Date
                  </label>
                  <input
                    type="month"
                    value={newExperience.end_date}
                    onChange={(e) => setNewExperience({ ...newExperience, end_date: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-offset-0"
                    style={{
                      borderColor: "#241C15",
                      color: "#31302f",
                      backgroundColor: "#f0eadd"
                    }}
                    disabled={newExperience.current}
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center space-x-2 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newExperience.current}
                      onChange={(e) =>
                        setNewExperience({
                          ...newExperience,
                          current: e.target.checked,
                          end_date: e.target.checked ? "" : newExperience.end_date,
                        })
                      }
                      className="w-4 h-4 rounded cursor-pointer"
                      style={{ accentColor: "#f7af00" }}
                    />
                    <span style={{ color: "#31302f" }} className="text-sm">
                      Currently here
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#31302f" }}>
                  Description
                </label>
                <textarea
                  value={newExperience.description}
                  onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 resize-none"
                  style={{
                    borderColor: "#241C15",
                    color: "#31302f",
                    backgroundColor: "#f0eadd"
                  }}
                  placeholder="Describe your responsibilities and achievements..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#31302f" }}>
                  Technologies Used (comma-separated)
                </label>
                <input
                  type="text"
                  value={newExperience.technologies?.join(", ") || ""}
                  onChange={(e) => setNewExperience({
                    ...newExperience,
                    technologies: e.target.value.split(",").map(t => t.trim()).filter(Boolean)
                  })}
                  className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-offset-0"
                  style={{
                    borderColor: "#241C15",
                    color: "#31302f",
                    backgroundColor: "#f0eadd"
                  }}
                  placeholder="React, Node.js, Python"
                />
              </div>

              {(localError || error) && (
                <div className="p-3 rounded-lg border flex items-center space-x-2" style={{ backgroundColor: "#f0eadd", borderColor: "#241C15" }}>
                  <AlertCircle className="h-4 w-4" style={{ color: "#241C15" }} />
                  <span className="text-sm" style={{ color: "#241C15" }}>{localError || error}</span>
                </div>
              )}
            </div>

            <DialogFooter className="flex gap-2">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  onClick={resetNewExperience}
                  className="text-sm font-medium px-4 py-2.5 rounded-lg transition-all"
                  style={{
                    color: "#31302f",
                    borderColor: "#241C15",
                    backgroundColor: "transparent"
                  }}
                  onMouseEnter={handleButtonHover}
                  onMouseLeave={handleButtonLeave}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                onClick={handleAddExperienceWithValidation}
                disabled={savingExperience}
                className="text-sm font-medium flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all"
                style={{
                  backgroundColor: "#f7af00",
                  color: "#050504",
                  boxShadow: "0 2px 6px rgba(36, 28, 21, 0.05)"
                }}
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonLeave}
              >
                {savingExperience ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Add Experience</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Case Study Button - UPDATED with new structure */}
        <Dialog open={showCaseStudyModal} onOpenChange={setShowCaseStudyModal}>
          <DialogOverlay className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" />
          <DialogTrigger asChild>
            <Button
              className="flex items-center space-x-2 font-semibold text-sm px-4 py-2.5 rounded-lg transition-all"
              style={{
                backgroundColor: "#f7af00",
                color: "#050504",
                boxShadow: "0 2px 6px rgba(36, 28, 21, 0.05)"
              }}
              onMouseEnter={handleButtonHover}
              onMouseLeave={handleButtonLeave}
            >
              <FolderOpen className="h-4 w-4" />
              <span>{editingCaseStudyId ? "Edit Case Study" : "Case Study"}</span>
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent
            className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-1.5rem)] sm:max-w-[900px] max-h-[90vh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border"
            style={{
              backgroundColor: "#faf4e5",
              borderColor: "#241C15"
            }}
          >
            <DialogHeader className="space-y-2">
              <DialogTitle className="flex items-center space-x-2 text-xl" style={{ color: "#050504" }}>
                <FolderOpen className="h-5 w-5" style={{ color: "#f7af00" }} />
                <span>{editingCaseStudyId ? "Edit Case Study" : "Add Case Study"}</span>
              </DialogTitle>
              <DialogDescription className="text-sm" style={{ color: "#31302f" }}>
                Showcase your best work with detailed project information, metrics, and results.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: "#31302f" }}>
                  Category <span style={{ color: "#241C15" }}>*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-60 overflow-y-auto p-1">
                  {CASE_STUDY_CATEGORIES.map(({ value, label, icon: Icon, industries }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setNewCaseStudyItem({
                        ...newCaseStudyItem,
                        category: value,
                        industry: "" // Reset industry when category changes
                      })}
                      className={`flex flex-col items-center space-y-2 p-3 rounded-lg border text-center transition-all ${newCaseStudyItem.category === value ? "ring-2" : ""
                        }`}
                      style={{
                        borderColor: newCaseStudyItem.category === value ? "#f7af00" : "#241C15",
                        backgroundColor: newCaseStudyItem.category === value ? "#f0eadd" : "#faf4e5",
                        color: "#31302f",
                      }}
                    >
                      <Icon className="h-5 w-5" style={{ color: "#f7af00" }} />
                      <span className="text-xs font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Industry Selection - shown after category */}
              {newCaseStudyItem.category && (
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#31302f" }}>
                    Industry
                  </label>
                  <select
                    value={newCaseStudyItem.industry}
                    onChange={(e) => setNewCaseStudyItem({ ...newCaseStudyItem, industry: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-offset-0"
                    style={{
                      borderColor: "#241C15",
                      color: "#31302f",
                      backgroundColor: "#f0eadd"
                    }}
                  >
                    <option value="">Select industry</option>
                    {CASE_STUDY_CATEGORIES
                      .find(c => c.value === newCaseStudyItem.category)
                      ?.industries.map(ind => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                  </select>
                </div>
              )}

              {/* Screenshot Upload */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#31302f" }}>
                  Cover Image
                </label>
                {newCaseStudyItem.image_url ? (
                  <div className="relative">
                    <img
                      src={newCaseStudyItem.image_url}
                      alt="Case study cover"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => {
                        if (handleImageDelete && newCaseStudyItem.image_url) {
                          handleImageDelete("new-case-study", newCaseStudyItem.image_url)
                        } else {
                          setNewCaseStudyItem({
                            ...newCaseStudyItem,
                            image_url: "",
                          })
                        }
                      }}
                      className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="case-study-image"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer"
                      style={{ borderColor: "#241C15", backgroundColor: "#f0eadd" }}
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <ImageIcon className="w-8 h-8 mb-3" style={{ color: "#241C15" }} />
                        <p className="text-xs" style={{ color: "#241C15" }}>
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs" style={{ color: "#31302f" }}>PNG, JPG, GIF, WebP (Max 5MB)</p>
                      </div>
                      <input
                        id="case-study-image"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            handleImageUpload("new-case-study", file)
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

              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#31302f" }}>
                    Project Title <span style={{ color: "#241C15" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={newCaseStudyItem.title}
                    onChange={(e) => setNewCaseStudyItem({ ...newCaseStudyItem, title: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-offset-0"
                    style={{
                      borderColor: "#241C15",
                      color: "#31302f",
                      backgroundColor: "#f0eadd"
                    }}
                    placeholder="e.g., E-Commerce Platform Redesign"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#31302f" }}>
                    Project URL
                  </label>
                  <input
                    type="url"
                    value={newCaseStudyItem.project_url}
                    onChange={(e) => setNewCaseStudyItem({ ...newCaseStudyItem, project_url: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-offset-0"
                    style={{
                      borderColor: "#241C15",
                      color: "#31302f",
                      backgroundColor: "#f0eadd"
                    }}
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              {/* Short Summary */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#31302f" }}>
                  Short Summary <span style={{ color: "#241C15" }}>*</span>
                </label>
                <input
                  type="text"
                  value={newCaseStudyItem.short_summary}
                  onChange={(e) => setNewCaseStudyItem({ ...newCaseStudyItem, short_summary: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-offset-0"
                  style={{
                    borderColor: "#241C15",
                    color: "#31302f",
                    backgroundColor: "#f0eadd"
                  }}
                  placeholder="Brief overview of the project (1-2 sentences)"
                />
              </div>

              {/* Problem Statement */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#31302f" }}>
                  Problem Statement
                </label>
                <textarea
                  value={newCaseStudyItem.problem_statement}
                  onChange={(e) => setNewCaseStudyItem({ ...newCaseStudyItem, problem_statement: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 resize-none"
                  style={{
                    borderColor: "#241C15",
                    color: "#31302f",
                    backgroundColor: "#f0eadd"
                  }}
                  placeholder="What challenge did the client face?"
                />
              </div>

              {/* Solution */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#31302f" }}>
                  Solution Provided
                </label>
                <textarea
                  value={newCaseStudyItem.solution_provided}
                  onChange={(e) => setNewCaseStudyItem({ ...newCaseStudyItem, solution_provided: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 resize-none"
                  style={{
                    borderColor: "#241C15",
                    color: "#31302f",
                    backgroundColor: "#f0eadd"
                  }}
                  placeholder="How did you solve the problem?"
                />
              </div>

              {/* Strategy & Implementation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#31302f" }}>
                    Strategy (Optional)
                  </label>
                  <textarea
                    value={newCaseStudyItem.strategy || ""}
                    onChange={(e) => setNewCaseStudyItem({ ...newCaseStudyItem, strategy: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 resize-none"
                    style={{
                      borderColor: "#241C15",
                      color: "#31302f",
                      backgroundColor: "#f0eadd"
                    }}
                    placeholder="What was your approach?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#31302f" }}>
                    Implementation (Optional)
                  </label>
                  <textarea
                    value={newCaseStudyItem.implementation || ""}
                    onChange={(e) => setNewCaseStudyItem({ ...newCaseStudyItem, implementation: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 resize-none"
                    style={{
                      borderColor: "#241C15",
                      color: "#31302f",
                      backgroundColor: "#f0eadd"
                    }}
                    placeholder="How was it implemented?"
                  />
                </div>
              </div>

              {/* Metrics Section - NEW */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#31302f" }}>
                  Key Metrics <span style={{ color: "#241C15" }}>*</span>
                </label>

                {/* Display existing metrics */}
                <div className="space-y-2 mb-3">
                  {newCaseStudyItem.metrics.map((metric, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-[#f0eadd] rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getMetricIcon(metric.type)}
                        <div>
                          <span className="font-medium text-sm">{metric.label}: </span>
                          <span className="text-sm" style={{ color: "#050504" }}>
                            {formatMetricValue(metric)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeMetric(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new metric */}
                <div className="border-t pt-3" style={{ borderColor: "#241C15" }}>
                  <button
                    onClick={() => setShowMetrics(!showMetrics)}
                    className="flex items-center space-x-2 text-sm font-medium mb-2"
                    style={{ color: "#241C15" }}
                  >
                    {showMetrics ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    <span>{showMetrics ? "Hide metric form" : "Add a metric"}</span>
                  </button>

                  {showMetrics && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Metric label (e.g., ROAS)"
                          value={newMetric.label}
                          onChange={(e) => setNewMetric({ ...newMetric, label: e.target.value })}
                          className="flex-1 px-3 py-2 border rounded-lg text-sm"
                          style={{ borderColor: "#241C15", backgroundColor: "#f0eadd" }}
                        />
                        <input
                          type="number"
                          placeholder="Value"
                          value={newMetric.value}
                          onChange={(e) => setNewMetric({ ...newMetric, value: parseFloat(e.target.value) || 0 })}
                          className="w-24 px-3 py-2 border rounded-lg text-sm"
                          style={{ borderColor: "#241C15", backgroundColor: "#f0eadd" }}
                        />
                        <select
                          value={newMetric.type}
                          onChange={(e) => setNewMetric({ ...newMetric, type: e.target.value as any })}
                          className="w-24 px-3 py-2 border rounded-lg text-sm"
                          style={{ borderColor: "#241C15", backgroundColor: "#f0eadd" }}
                        >
                          <option value="number">Number</option>
                          <option value="percentage">%</option>
                          <option value="currency">$</option>
                        </select>
                        <Button
                          onClick={addMetric}
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: "#f7af00", color: "#050504" }}
                        >
                          <PlusCircle className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Results Overview */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#31302f" }}>
                  Results Overview
                </label>
                <textarea
                  value={newCaseStudyItem.results_overview}
                  onChange={(e) => setNewCaseStudyItem({ ...newCaseStudyItem, results_overview: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 resize-none"
                  style={{
                    borderColor: "#241C15",
                    color: "#31302f",
                    backgroundColor: "#f0eadd"
                  }}
                  placeholder="Summary of the results achieved"
                />
              </div>

              {/* Technologies */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#31302f" }}>
                  Technologies Used (comma-separated)
                </label>
                <input
                  type="text"
                  value={newCaseStudyItem.technologies?.join(", ") || ""}
                  onChange={(e) =>
                    setNewCaseStudyItem({
                      ...newCaseStudyItem,
                      technologies: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                    })
                  }
                  className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-offset-0"
                  style={{
                    borderColor: "#241C15",
                    color: "#31302f",
                    backgroundColor: "#f0eadd"
                  }}
                  placeholder="React, Node.js, MongoDB"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#31302f" }}>
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={newCaseStudyItem.tags?.join(", ") || ""}
                  onChange={(e) =>
                    setNewCaseStudyItem({
                      ...newCaseStudyItem,
                      tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                    })
                  }
                  className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-offset-0"
                  style={{
                    borderColor: "#241C15",
                    color: "#31302f",
                    backgroundColor: "#f0eadd"
                  }}
                  placeholder="e-commerce, conversion, optimization"
                />
              </div>

              {(localError || error) && (
                <div className="p-3 rounded-lg border flex items-center space-x-2" style={{ backgroundColor: "#f0eadd", borderColor: "#241C15" }}>
                  <AlertCircle className="h-4 w-4" style={{ color: "#241C15" }} />
                  <span className="text-sm" style={{ color: "#241C15" }}>{localError || error}</span>
                </div>
              )}
            </div>

            <DialogFooter className="flex gap-2">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  onClick={resetNewCaseStudyItem}
                  className="text-sm font-medium px-4 py-2.5 rounded-lg transition-all"
                  style={{
                    color: "#31302f",
                    borderColor: "#241C15",
                    backgroundColor: "transparent"
                  }}
                  onMouseEnter={handleButtonHover}
                  onMouseLeave={handleButtonLeave}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                onClick={handleAddCaseStudyWithValidation}
                disabled={savingCaseStudy}
                className="text-sm font-medium flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all"
                style={{
                  backgroundColor: "#f7af00",
                  color: "#050504",
                  boxShadow: "0 2px 6px rgba(36, 28, 21, 0.05)"
                }}
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonLeave}
              >
                {savingCaseStudy ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{editingCaseStudyId ? "Updating..." : "Adding..."}</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>{editingCaseStudyId ? "Update Case Study" : "Add Case Study"}</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Testimonial Button */}
        {setShowTestimonialModal && handleAddTestimonial && (
          <Dialog open={showTestimonialModal} onOpenChange={setShowTestimonialModal}>
            <DialogOverlay className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" />
            <DialogTrigger asChild>
              <Button
                className="flex items-center space-x-2 font-semibold text-sm px-4 py-2.5 rounded-lg transition-all"
                style={{
                  backgroundColor: "#241C15",
                  color: "#f7af00",
                  boxShadow: "0 2px 6px rgba(36, 28, 21, 0.05)"
                }}
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonLeave}
              >
                <Star className="h-4 w-4" />
                <span>Testimonial</span>
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent
              className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-1.5rem)] sm:max-w-[600px] max-h-[90vh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border"
              style={{
                backgroundColor: "#faf4e5",
                borderColor: "#241C15"
              }}
            >
              <DialogHeader className="space-y-2">
                <DialogTitle className="flex items-center space-x-2 text-xl" style={{ color: "#050504" }}>
                  <Star className="h-5 w-5" style={{ color: "#f7af00" }} />
                  <span>Add Testimonial</span>
                </DialogTitle>
                <DialogDescription className="text-sm" style={{ color: "#31302f" }}>
                  Share what clients have said about your work.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#31302f" }}>
                    Client Name <span style={{ color: "#241C15" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={newTestimonial?.client_name || ""}
                    onChange={(e) => setNewTestimonial?.({
                      ...newTestimonial!,
                      client_name: e.target.value
                    })}
                    className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-offset-0"
                    style={{
                      borderColor: "#241C15",
                      color: "#31302f",
                      backgroundColor: "#f0eadd"
                    }}
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#31302f" }}>
                    Company
                  </label>
                  <input
                    type="text"
                    value={newTestimonial?.company || ""}
                    onChange={(e) => setNewTestimonial?.({
                      ...newTestimonial!,
                      company: e.target.value
                    })}
                    className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-offset-0"
                    style={{
                      borderColor: "#241C15",
                      color: "#31302f",
                      backgroundColor: "#f0eadd"
                    }}
                    placeholder="Company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#31302f" }}>
                    Client Role
                  </label>
                  <input
                    type="text"
                    value={newTestimonial?.role || ""}
                    onChange={(e) => setNewTestimonial?.({
                      ...newTestimonial!,
                      role: e.target.value
                    })}
                    className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-offset-0"
                    style={{
                      borderColor: "#241C15",
                      color: "#31302f",
                      backgroundColor: "#f0eadd"
                    }}
                    placeholder="e.g., CEO, Marketing Director"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#31302f" }}>
                    Testimonial <span style={{ color: "#241C15" }}>*</span>
                  </label>
                  <textarea
                    value={newTestimonial?.content || ""}
                    onChange={(e) => setNewTestimonial?.({
                      ...newTestimonial!,
                      content: e.target.value
                    })}
                    rows={4}
                    className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 resize-none"
                    style={{
                      borderColor: "#241C15",
                      color: "#31302f",
                      backgroundColor: "#f0eadd"
                    }}
                    placeholder="What did the client say about your work?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#31302f" }}>
                    Rating
                  </label>
                  <div className="flex items-center space-x-2">
                    {[5, 4, 3, 2, 1].map(rating => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setNewTestimonial?.({
                          ...newTestimonial!,
                          rating
                        })}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`h-6 w-6 ${rating <= (newTestimonial?.rating || 5)
                            ? 'fill-[#f7af00] text-[#f7af00]'
                            : 'text-gray-400'
                            }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#31302f" }}>
                    Date
                  </label>
                  <input
                    type="date"
                    value={newTestimonial?.date || ""}
                    onChange={(e) => setNewTestimonial?.({
                      ...newTestimonial!,
                      date: e.target.value
                    })}
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
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={newTestimonial?.linkedin_url || ""}
                    onChange={(e) => setNewTestimonial?.({
                      ...newTestimonial!,
                      linkedin_url: e.target.value
                    })}
                    className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-offset-0"
                    style={{
                      borderColor: "#241C15",
                      color: "#31302f",
                      backgroundColor: "#f0eadd"
                    }}
                    placeholder="https://linkedin.com/in/client"
                  />
                </div>

                {(localError || error) && (
                  <div className="p-3 rounded-lg border flex items-center space-x-2" style={{ backgroundColor: "#f0eadd", borderColor: "#241C15" }}>
                    <AlertCircle className="h-4 w-4" style={{ color: "#241C15" }} />
                    <span className="text-sm" style={{ color: "#241C15" }}>{localError || error}</span>
                  </div>
                )}
              </div>

              <DialogFooter className="flex gap-2">
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    onClick={resetNewTestimonial}
                    className="text-sm font-medium px-4 py-2.5 rounded-lg transition-all"
                    style={{
                      color: "#31302f",
                      borderColor: "#241C15",
                      backgroundColor: "transparent"
                    }}
                    onMouseEnter={handleButtonHover}
                    onMouseLeave={handleButtonLeave}
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  onClick={handleAddTestimonialWithValidation}
                  disabled={savingTestimonial}
                  className="text-sm font-medium flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all"
                  style={{
                    backgroundColor: "#f7af00",
                    color: "#050504",
                    boxShadow: "0 2px 6px rgba(36, 28, 21, 0.05)"
                  }}
                  onMouseEnter={handleButtonHover}
                  onMouseLeave={handleButtonLeave}
                >
                  {savingTestimonial ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Add Testimonial</span>
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Submit for Review Button */}
        {onSubmitForReview && reviewStatus === "pending" && canSubmitForReview && (
          <Button
            onClick={onSubmitForReview}
            disabled={loading}
            className="flex items-center space-x-2 font-semibold text-sm px-4 py-2.5 rounded-lg transition-all"
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
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                <span>Submit for Review</span>
              </>
            )}
          </Button>
        )}
      </div>

      {/* Mobile Menu Toggle and Buttons */}
      <div className="sm:hidden">
        {/* Mobile Menu Toggle Button */}
        <Button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex items-center space-x-2 font-semibold text-sm px-4 py-2.5 rounded-lg transition-all"
          style={{
            backgroundColor: "#f7af00",
            color: "#050504",
            boxShadow: "0 2px 6px rgba(36, 28, 21, 0.05)"
          }}
          onMouseEnter={handleButtonHover}
          onMouseLeave={handleButtonLeave}
        >
          <Menu className="h-4 w-4" />
          <span>Menu</span>
        </Button>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div
            className="absolute top-full right-0 mt-2 w-64 rounded-xl border shadow-lg z-50 animate-in slide-in-from-top-2 duration-200"
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
                    <X className="h-4 w-4" />
                  ) : (
                    <Edit3 className="h-4 w-4" />
                  )}
                  <span>{isEditing ? "Cancel Edit" : "Edit Profile"}</span>
                </div>
              </Button>

              {/* Add Experience Button */}
              <Button
                onClick={() => {
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
                <Plus className="h-4 w-4" />
              </Button>

              {/* Add Case Study Button */}
              <Button
                onClick={() => {
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
                  <FolderOpen className="h-4 w-4" />
                  <span>Add Case Study</span>
                </div>
                <Plus className="h-4 w-4" />
              </Button>

              {/* Add Testimonial Button */}
              {setShowTestimonialModal && (
                <Button
                  onClick={() => {
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
                  <Plus className="h-4 w-4" />
                </Button>
              )}

              {/* Submit for Review Button (mobile) */}
              {onSubmitForReview && reviewStatus === "pending" && canSubmitForReview && (
                <Button
                  onClick={() => {
                    onSubmitForReview()
                    setMobileMenuOpen(false)
                  }}
                  disabled={loading}
                  className="flex items-center justify-center w-full font-semibold text-sm px-4 py-3 rounded-lg transition-all"
                  style={{
                    backgroundColor: "#f7af00",
                    color: "#050504",
                  }}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  <span>{loading ? "Submitting..." : "Submit for Review"}</span>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}