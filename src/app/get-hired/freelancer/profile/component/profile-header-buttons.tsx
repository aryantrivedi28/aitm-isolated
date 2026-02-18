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
} from "lucide-react"
import { ImageUpload } from "../../../../../components/freelancer/portfolio-image-upload"
import { DialogTrigger, DialogOverlay } from "@radix-ui/react-dialog"
import { useState, useEffect } from "react"

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
}

interface CaseStudyItem {
  id?: string
  title: string
  description: string
  outcome: string
  image_url: string
  image_path?: string
  project_url?: string
  category?: string
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
  newCaseStudyItem: CaseStudyItem
  setNewCaseStudyItem: (item: CaseStudyItem) => void
  newTestimonial?: any
  setNewTestimonial?: (testimonial: any) => void
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
}

const CASE_STUDY_CATEGORIES = [
  { value: "Web Development", label: "Web Development", icon: Code2 },
  { value: "Shopify", label: "Shopify", icon: ShoppingBag },
  { value: "SEO", label: "SEO", icon: Target },
  { value: "UI/UX Design", label: "UI/UX Design", icon: Layout },
  { value: "Marketing", label: "Marketing", icon: Megaphone },
  { value: "Social Media", label: "Social Media", icon: TrendingUp },
  { value: "Email Marketing", label: "Email Marketing", icon: Mail },
  { value: "Content Writing", label: "Content Writing", icon: FileText },
  { value: "Brand Strategy", label: "Brand Strategy", icon: Palette },
  { value: "Analytics", label: "Analytics", icon: BarChart },
  { value: "Growth", label: "Growth", icon: Rocket },
  { value: "Automation", label: "Automation", icon: Zap },
  { value: "Video Editing", label: "Video Editing", icon: Video },
  { value: "No-Code", label: "No-Code", icon: Globe },
  { value: "Other", label: "Other", icon: FolderOpen },
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
}: ProfileHeaderButtonsProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [localError, setLocalError] = useState("")
  const [localSuccess, setLocalSuccess] = useState("")

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

  // Handle case study form validation
  const validateCaseStudyForm = () => {
    if (!newCaseStudyItem.title) return "Project title is required"
    if (!newCaseStudyItem.description) return "Description is required"
    if (!newCaseStudyItem.outcome) return "Outcome is required"
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

  // Wrapper for add case study with validation
  const handleAddCaseStudyWithValidation = async () => {
    const validationError = validateCaseStudyForm()
    if (validationError) {
      setLocalError(validationError)
      return
    }
    await handleAddCaseStudyItem()
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

        {/* Add Case Study Button */}
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
              <span>Case Study</span>
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent 
            className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-1.5rem)] sm:max-w-[800px] max-h-[90vh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border"
            style={{ 
              backgroundColor: "#faf4e5",
              borderColor: "#241C15"
            }}
          >
            <DialogHeader className="space-y-2">
              <DialogTitle className="flex items-center space-x-2 text-xl" style={{ color: "#050504" }}>
                <FolderOpen className="h-5 w-5" style={{ color: "#f7af00" }} />
                <span>Add Case Study</span>
              </DialogTitle>
              <DialogDescription className="text-sm" style={{ color: "#31302f" }}>
                Showcase your best work with project details, outcomes, and screenshots.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#31302f" }}>
                  Case Study Category <span style={{ color: "#241C15" }}>*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-60 overflow-y-auto p-1">
                  {CASE_STUDY_CATEGORIES.map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setNewCaseStudyItem({ ...newCaseStudyItem, category: value })}
                      className={`flex flex-col items-center space-y-2 p-3 rounded-lg border text-center transition-all ${
                        newCaseStudyItem.category === value ? "ring-2" : ""
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

              {/* Screenshot Upload */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#31302f" }}>
                  Project Screenshot
                </label>
                <ImageUpload
                  itemId="new-case-study"
                  onUpload={(itemId, file) => handleImageUpload(itemId, file)}
                  isUploading={uploadingImages["new-case-study"] || false}
                  imageUrl={newCaseStudyItem.image_url}
                  onDelete={() => {
                    if (handleImageDelete && newCaseStudyItem.image_path) {
                      handleImageDelete("new-case-study", newCaseStudyItem.image_path)
                    } else {
                      setNewCaseStudyItem({
                        ...newCaseStudyItem,
                        image_url: "",
                        image_path: "",
                      })
                    }
                  }}
                  accentColor="#f7af00"
                  bgColor="#faf4e5"
                />
              </div>

              {/* Project Details */}
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
                    placeholder="e.g., E-Commerce Platform"
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

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#31302f" }}>
                  Project Description <span style={{ color: "#241C15" }}>*</span>
                </label>
                <textarea
                  value={newCaseStudyItem.description}
                  onChange={(e) => setNewCaseStudyItem({ ...newCaseStudyItem, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 resize-none"
                  style={{ 
                    borderColor: "#241C15", 
                    color: "#31302f",
                    backgroundColor: "#f0eadd"
                  }}
                  placeholder="Describe your project, what you built, and the approach..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#31302f" }}>
                  Outcome / Results <span style={{ color: "#241C15" }}>*</span>
                </label>
                <input
                  type="text"
                  value={newCaseStudyItem.outcome}
                  onChange={(e) => setNewCaseStudyItem({ ...newCaseStudyItem, outcome: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-offset-0"
                  style={{ 
                    borderColor: "#241C15", 
                    color: "#31302f",
                    backgroundColor: "#f0eadd"
                  }}
                  placeholder="e.g., Increased conversion by 50%, Reduced load time by 40%"
                />
              </div>

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
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    <span>Add Case Study</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Testimonial Button (if props provided) */}
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
                {/* Testimonial form fields would go here */}
                <p className="text-sm" style={{ color: "#31302f" }}>Testimonial form implementation...</p>
              </div>
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

              {/* Add Testimonial Button (if available) */}
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