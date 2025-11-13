"use client"

import useSWR from "swr"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Calendar,
  ClipboardList,
  Users2,
  Plus,
  TrendingUp,
  Clock,
  FileText,
  ChevronDown,
  ChevronUp,
  Building2,
  Search,
  Filter,
  Download,
  Briefcase,
  ExternalLink,
  Star,
  AlertCircle,
  Award,
  Video,
  X,
  User,
  MapPin,
  Globe,
  Github,
  FileCode,
  MessageSquare,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkle,
  Sparkles,
} from "lucide-react"
import { SubmissionDetailCard } from "./components/submission-detail-card"
import toast from "react-hot-toast"
import CalendlyMeetingModal from "../../../../components/calendly-meeting-model"

const fetcher = async (url: string) => {
  const res = await fetch(url, { credentials: "include" })
  if (!res.ok) throw new Error("Failed to fetch")
  return res.json()
}

interface FreelancerSubmission {
  id: string
  form_id: string
  name: string
  email: string
  phone: string | null
  portfolio_link: string | null
  github_link: string | null
  resume_link: string | null
  years_experience: number | null
  proposal_link: string | null
  created_at: string
  custom_responses: any
  profile_rating: number | null
  updated_at: string | null
  is_selected: boolean | null
  selection_notes: string | null
  selection_date: string | null
  selected_by: string | null
  freelancer_id: string | null
  meeting_scheduled: boolean | null
  meeting_id: string | null
}

interface ViewAllModalData {
  form: any
  submissions: FreelancerSubmission[]
}

export default function ClientDashboardPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [expandedForm, setExpandedForm] = useState<string | null>(null)
  const [directSubmissions, setDirectSubmissions] = useState<FreelancerSubmission[]>([])
  const [loadingSubmissions, setLoadingSubmissions] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedSubmission, setSelectedSubmission] = useState<FreelancerSubmission | null>(null)
  const [form, setForms] = useState<any[]>([])

  const [showCalendlyModal, setShowCalendlyModal] = useState(false)
  const [selectedFreelancer, setSelectedFreelancer] = useState<FreelancerSubmission | null>(null)
  const [viewAllModal, setViewAllModal] = useState<ViewAllModalData | null>(null)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const [stats, setStats] = useState({
    totalForms: 0,
    totalSubmissions: 0,
    activeHirings: 0,
    pendingReview: 0,
  })

  useEffect(() => {
    setIsClient(true)
  }, [])

  const { data: serverForms, isLoading: loadingForms } = useSWR(isClient ? "/api/client/hirings" : null, fetcher, {
    onSuccess: (data) => {
      console.log("📋 Forms fetched:", data?.forms?.length)
    },
    onError: (error) => {
      console.error("❌ Error fetching forms:", error)
    },
  })

  useEffect(() => {
    if (!isClient) {
      return
    }

    const fetchSubmissions = async () => {
      setLoadingSubmissions(true)
      try {
        const response = await fetch("/api/client/submissions", { credentials: "include" })
        if (!response.ok) {
          setDirectSubmissions([])
          return
        }
        const result = await response.json()
        if (!result.success) {
          setDirectSubmissions([])
          return
        }
        setDirectSubmissions(result.submissions || [])
      } catch (err) {
        setDirectSubmissions([])
      } finally {
        setLoadingSubmissions(false)
      }
    }

    fetchSubmissions()
  }, [isClient])

  const forms = serverForms?.forms || []
  const submissions = directSubmissions

  useEffect(() => {
    if (!isClient || !serverForms) return

    const formsArray = serverForms?.forms || []
    const submissionsArray = directSubmissions || []

    const activeForms = Array.isArray(formsArray)
      ? formsArray.filter((f: any) => f.status === "active" || f.is_active === true).length
      : 0

    const pendingSubs = Array.isArray(submissionsArray)
      ? submissionsArray.filter((s: any) => s.status === "new").length
      : 0

    setStats({
      totalForms: Array.isArray(formsArray) ? formsArray.length : 0,
      totalSubmissions: Array.isArray(submissionsArray) ? submissionsArray.length : 0,
      activeHirings: activeForms,
      pendingReview: pendingSubs,
    })
  }, [serverForms, directSubmissions, isClient])

  const toggleForm = (id: string) => {
    console.log("📋 Toggling form:", id)
    setExpandedForm(expandedForm === id ? null : id)
  }

  const getFormSubmissions = (formId: string) => {
    const formSubs = submissions.filter((s) => s.form_id === formId)

    const sortedSubs = formSubs.sort((a, b) => {
      if (a.is_selected !== b.is_selected) {
        return a.is_selected ? -1 : 1
      }

      const ratingA = a.profile_rating || 0
      const ratingB = b.profile_rating || 0
      return ratingB - ratingA
    })
    return sortedSubs
  }

  const handleViewAllSubmissions = (form: any) => {
    const formSubs = getFormSubmissions(form.id)
    setViewAllModal({
      form: form,
      submissions: formSubs
    })
  }

  const handleSelectCandidate = async (sub: FreelancerSubmission, formId: string) => {
    try {
      const res = await fetch("/api/client/select-candidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submission_id: sub.id,
          notes: "Client selected this candidate",
        }),
        credentials: "include",
      })

      const result = await res.json()
      if (result.success) {
        setForms((prev: any[]) =>
          prev.map((f) =>
            f.id === formId
              ? {
                ...f,
                submissions: f.submissions?.map((s: any) => (s.id === sub.id ? { ...s, is_selected: true } : s)),
              }
              : f,
          ),
        )

        setDirectSubmissions((prev: FreelancerSubmission[]) => prev.map((s) => (s.id === sub.id ? { ...s, is_selected: true } : s)))

        // Update modal state if open
        if (viewAllModal && viewAllModal.form.id === formId) {
          setViewAllModal((prev: ViewAllModalData | null) => ({
            ...prev!,
            submissions: prev!.submissions.map((s: FreelancerSubmission) => s.id === sub.id ? { ...s, is_selected: true } : s)
          }))
        }

        toast.success(`${sub.name} selected successfully ✅`)
      } else {
        toast.error(result.error || "Failed to select candidate")
      }
    } catch (err) {
      console.error(err)
      toast.error("Something went wrong")
    }
  }

  const handleDeselectCandidate = async (sub: FreelancerSubmission, formId: string) => {
    try {
      const res = await fetch("/api/client/deselect-candidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submission_id: sub.id,
        }),
        credentials: "include",
      })

      const result = await res.json()
      if (result.success) {
        setForms((prev: any[]) =>
          prev.map((f) =>
            f.id === formId
              ? {
                ...f,
                submissions: f.submissions?.map((s: any) => (s.id === sub.id ? { ...s, is_selected: false } : s)),
              }
              : f,
          ),
        )

        setDirectSubmissions((prev: FreelancerSubmission[]) => prev.map((s) => (s.id === sub.id ? { ...s, is_selected: false } : s)))

        // Update modal state if open
        if (viewAllModal && viewAllModal.form.id === formId) {
          setViewAllModal((prev: ViewAllModalData | null) => ({
            ...prev!,
            submissions: prev!.submissions.map((s: FreelancerSubmission) => s.id === sub.id ? { ...s, is_selected: false } : s)
          }))
        }

        toast.success(`${sub.name} deselected`)
      } else {
        toast.error(result.error || "Failed to deselect candidate")
      }
    } catch (err) {
      console.error(err)
      toast.error("Something went wrong")
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Check if submission is new (within last 7 days)
  const isNewSubmission = (createdAt: string) => {
    const created = new Date(createdAt)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - created.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7
  }

  if (!isClient || loadingForms) {
    return (
      <main className="min-h-screen bg-[#241C15] flex items-center justify-center">
        <div className="text-gray-300">Loading your dashboard...</div>
      </main>
    )
  }

  const filteredForms = forms.filter((form: any) => {
    const matchesSearch =
      form.form_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.job_title?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === "all" || form.status?.toLowerCase() === filterStatus.toLowerCase()

    return matchesSearch && matchesStatus
  })

  return (
    <>
      <style jsx global>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        .animate-slideInUp {
          animation: slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(36, 28, 21, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 224, 27, 0.4);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 224, 27, 0.6);
        }

        .stat-card {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .stat-card:hover {
          transform: translateY(-8px);
        }

        .form-card {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .form-card:hover {
          transform: translateY(-2px);
        }

        .button-primary {
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .button-primary::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          transition: left 0.5s;
        }

        .button-primary:hover::before {
          left: 100%;
        }

        .button-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(255, 224, 27, 0.4);
        }

        .button-secondary {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .button-secondary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px -5px rgba(36, 28, 21, 0.15);
        }

        .badge {
          transition: all 0.2s ease;
        }

        .badge:hover {
          transform: scale(1.05);
        }
      `}</style>

      <main className="min-h-screen bg-gradient-to-br from-[#fbf5e5] via-[#fef9ed] to-[#fbf5e5] text-[#241C15] relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#FFE01B]/10 to-transparent rounded-full blur-3xl animate-float" />
          <div
            className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-[#FCD34D]/10 to-transparent rounded-full blur-3xl animate-float"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#FFE01B]/5 to-[#FCD34D]/5 rounded-full blur-3xl"
            style={{ animationDelay: "4s" }}
          />
        </div>

        {/* Enhanced Header */}
        <div className="border-b border-[#241C15]/10 bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className={isLoaded ? "animate-slideInLeft" : "opacity-0"}>
                <div className="flex items-center gap-4">
                  <div className="relative p-3 bg-gradient-to-br from-[#FFE01B] via-[#FFE01B] to-[#FCD34D] rounded-2xl shadow-lg">
                    <Building2 className="w-7 h-7 text-[#241C15]" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-black text-[#241C15] tracking-tight">
                      Client Dashboard
                    </h1>
                    <p className="text-sm text-[#241C15]/60 font-medium mt-0.5">
                      Manage your hiring pipeline efficiently
                    </p>
                  </div>
                </div>
              </div>
              <div
                className={`flex flex-wrap items-center gap-3 w-full sm:w-auto ${isLoaded ? "animate-slideInUp" : "opacity-0"
                  }`}
              >
                <button className="button-primary flex-1 sm:flex-none px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-[#FFE01B] to-[#FCD34D] text-[#241C15] shadow-md flex items-center justify-center gap-2 text-sm">
                  <Plus className="w-5 h-5" strokeWidth={2.5} />
                  <span>New Hiring</span>
                </button>
                <button className="button-secondary flex-1 sm:flex-none px-6 py-3 rounded-xl font-semibold bg-white border-2 border-[#241C15]/10 text-[#241C15] hover:border-[#FFE01B]/50 hover:bg-[#fbf5e5]/50 flex items-center justify-center gap-2 text-sm">
                  <Sparkles className="w-5 h-5" strokeWidth={2} />
                  <span>Assisted Hiring</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            {[
              {
                label: "Active Hirings",
                value: stats.activeHirings,
                icon: ClipboardList,
                gradient: "from-[#FFE01B] to-[#FCD34D]",
                iconBg: "bg-[#FFE01B]/10",
                textColor: "text-[#FFE01B]",
              },
              {
                label: "Total Submissions",
                value: stats.totalSubmissions,
                icon: Users2,
                gradient: "from-emerald-400 to-emerald-600",
                iconBg: "bg-emerald-500/10",
                textColor: "text-emerald-600",
              },
              {
                label: "Pending Review",
                value: stats.pendingReview,
                icon: Clock,
                gradient: "from-orange-400 to-orange-600",
                iconBg: "bg-orange-500/10",
                textColor: "text-orange-600",
              },
              {
                label: "Total Forms",
                value: stats.totalForms,
                icon: FileText,
                gradient: "from-purple-400 to-purple-600",
                iconBg: "bg-purple-500/10",
                textColor: "text-purple-600",
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className={`stat-card bg-[#241C15] rounded-2xl p-6 border border-[#241C15]/10 hover:border-[#FFE01B]/30 shadow-sm hover:shadow-xl ${isLoaded ? "animate-slideInUp" : "opacity-0"
                  }`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.iconBg}`}>
                    <stat.icon className={`w-6 h-6 ${stat.textColor}`} strokeWidth={2} />
                  </div>
                  <div className="flex items-center gap-1 px-1 py-1 bg-green-300/20 rounded-full">
                    <TrendingUp className="w-5 h-5 text-green-600" strokeWidth={2.5} />
                  </div>
                </div>
                <div className="text-3xl font-black text-[#FBF5E5] mb-1">{stat.value}</div>
                <div className="text-sm font-semibold text-[#FBF5E5]/60">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Enhanced Search and Filter */}
          <div
            className={`bg-[#241C15] rounded-2xl border border-[#241C15]/10 p-5 mb-8 shadow-sm ${isLoaded ? "animate-fadeIn" : "opacity-0"
              }`}
            style={{ animationDelay: "0.4s" }}
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#241C15]" />
                <input
                  type="text"
                  placeholder="Search hiring forms by title or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-[#241C15]/10 focus:border-[#FFE01B] focus:ring-4 focus:ring-[#FFE01B]/10 outline-none transition-all bg-[#fbf5e5]/60 text-[#241C15] placeholder:text-[#241C15]/40 font-medium"
                />
              </div>
              <div className="flex gap-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-5 py-3.5 rounded-xl border-2 border-[#241C15]/10 focus:border-[#FFE01B] focus:ring-4 focus:ring-[#FFE01B]/10 outline-none bg-[#FBF5E5] font-semibold text-[#241C15] cursor-pointer transition-all"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                </select>
                <button className="px-5 py-3.5 rounded-xl bg-[#FBF5E5] text-[#241C15] hover:bg-[#241C15]/90 transition-all flex items-center gap-2 font-semibold shadow-md hover:shadow-lg">
                  <Filter className="w-5 h-5" strokeWidth={2} />
                  <span className="hidden sm:inline">Filters</span>
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Forms Section */}
          <div>
            <div
              className={`bg-[#241C15] rounded-2xl border border-[#241C15]/10 p-6 shadow-sm ${isLoaded ? "animate-slideInLeft" : "opacity-0"
                }`}
              style={{ animationDelay: "0.5s" }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#FFE01B] to-[#FCD34D]">
                    <ClipboardList className="w-6 h-6 text-[#241C15]" strokeWidth={2} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-[#FBF5E5]">Your Hiring Requests</h2>
                    <p className="text-xs text-[#FBF5E5]/60">
                      {filteredForms.length} of {forms.length} Request
                      {searchTerm && ` matching "${searchTerm}"`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {filteredForms.map((form: any, idx: number) => {
                  const formSubs = getFormSubmissions(form.id)
                  return (
                    <div
                      key={form.id}
                      className="form-card rounded-xl border-2 border-[#241C15]/10 hover:border-[#FFE01B]/40 bg-[#FBF5E5] p-5 shadow-sm hover:shadow-md"
                      style={{ animationDelay: `${0.6 + idx * 0.1}s` }}
                    >
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <h3 className="font-black text-lg text-[#241C15]">{form.form_name}</h3>
                            <span
                              className={`badge px-3 py-1 rounded-full text-xs font-bold ${form.status === "active"
                                ? "bg-green-100 text-green-700 border border-green-300"
                                : "bg-gray-100 text-gray-700 border border-gray-300"
                                }`}
                            >
                              {form.status}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm text-[#241C15]/70 mb-3">
                            <span className="flex items-center gap-2 font-medium">
                              <Briefcase className="w-4 h-4" strokeWidth={2} />
                              {form.role_type}
                            </span>
                            <span className="flex items-center gap-2 font-medium">
                              <Users2 className="w-4 h-4" strokeWidth={2} />
                              {formSubs.length} submissions
                            </span>
                            <span className="flex items-center gap-2 font-medium">
                              <Calendar className="w-4 h-4" strokeWidth={2} />
                              {formatDate(form.created_at)}
                            </span>
                          </div>

                          {form.category && (
                            <div className="flex flex-wrap gap-2">
                              {Array.isArray(form.category) ? (
                                form.category.map((cat: string, i: number) => (
                                  <span
                                    key={i}
                                    className="badge px-3 py-1.5 bg-[#FFE01B]/10 rounded-lg text-xs font-bold border border-[#FFE01B]/30 text-[#241C15]"
                                  >
                                    {cat}
                                  </span>
                                ))
                              ) : (
                                <span className="badge px-3 py-1.5 bg-[#FFE01B]/10 rounded-lg text-xs font-bold border border-[#FFE01B]/30 text-[#241C15]">
                                  {form.category}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => setExpandedForm(expandedForm === form.id ? null : form.id)}
                          className="p-2.5 rounded-xl border-2 border-[#241C15]/10 hover:bg-[#FFE01B]/10 hover:border-[#FFE01B]/40 transition-all"
                        >
                          {expandedForm === form.id ? (
                            <ChevronUp className="w-5 h-5 text-[#241C15]" strokeWidth={2.5} />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-[#241C15]" strokeWidth={2.5} />
                          )}
                        </button>
                      </div>

                      {/* Enhanced Expanded View */}
                      {expandedForm === form.id && (
                        <div className="mt-5 bg-[#241C15] rounded-xl p-5 border-2 border-[#241C15]/10 animate-slideInUp">
                          <div className="flex items-center justify-between mb-5">
                            <h4 className="text-base font-bold text-[#FBF5E5] flex items-center gap-2">
                              <Users2 className="w-5 h-5 text-[#FFE01B]" strokeWidth={2} />
                              Submissions ({formSubs.length})
                            </h4>
                            {formSubs.length > 0 && (
                              <button
                                onClick={() => setViewAllModal({ form, submissions: formSubs })}
                                className="text-sm text-[#FFE01B] font-bold hover:text-[#FCD34D] flex items-center gap-1 transition-all"
                              >
                                View All
                                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                              </button>
                            )}
                          </div>
                          {formSubs.length > 0 ? (
                            <div className="space-y-3">
                              {formSubs.slice(0, 3).map((sub: any) => (
                                <div
                                  key={sub.id}
                                  className="border-2 border-[#241C15]/10 rounded-xl p-4 hover:border-[#FFE01B]/40 transition-all bg-[#fbf5e5] cursor-pointer hover:shadow-md"
                                  onClick={() => setSelectedSubmission(sub)}
                                >
                                  <div className="flex justify-between items-start gap-3 mb-3">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <div className="p-2 bg-[#FFE01B]/10 rounded-lg">
                                          <User className="w-4 h-4 text-[#241C15]" strokeWidth={2} />
                                        </div>
                                        <p className="font-bold text-base text-[#241C15]">{sub.name}</p>
                                        {isNewSubmission(sub.created_at) && (
                                          <span className="badge px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-300">
                                            New
                                          </span>
                                        )}
                                        {sub.meeting_scheduled && (
                                          <span className="badge px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold border border-blue-300">
                                            Meeting Set
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex flex-wrap gap-3 text-sm text-[#241C15]/60 font-medium">
                                        {sub.years_experience && (
                                          <span className="flex items-center gap-1.5">
                                            <Award className="w-4 h-4" strokeWidth={2} />
                                            {sub.years_experience} years
                                          </span>
                                        )}
                                        <span className="flex items-center gap-1.5">
                                          <Calendar className="w-4 h-4" strokeWidth={2} />
                                          {formatDate(sub.created_at)}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#FFE01B]/10 rounded-lg border border-[#FFE01B]/30">
                                        <Star
                                          className="w-4 h-4 text-[#FFE01B] fill-current"
                                          strokeWidth={2}
                                        />
                                        <span className="text-sm font-black text-[#241C15]">
                                          {sub.profile_rating?.toFixed(1) || "N/A"}
                                        </span>
                                      </div>

                                      {sub.is_selected ? (
                                        <div className="flex flex-col gap-2">
                                          <button className="px-4 py-2 text-xs font-bold rounded-lg bg-red-50 text-red-700 border-2 border-red-200 hover:bg-red-100 transition-all flex items-center gap-1.5">
                                            <XCircle className="w-4 h-4" strokeWidth={2} />
                                            Deselect
                                          </button>
                                          <button className="px-4 py-2 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-700 border-2 border-emerald-200 hover:bg-emerald-100 transition-all flex items-center gap-1.5">
                                            <Video className="w-4 h-4" strokeWidth={2} />
                                            Schedule
                                          </button>
                                        </div>
                                      ) : (
                                        <button className="px-4 py-2 text-xs font-bold rounded-lg bg-[#FFE01B]/20 border-2 border-[#FFE01B]/40 hover:bg-[#FFE01B]/40 text-[#241C15] transition-all flex items-center gap-1.5">
                                          <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
                                          Select
                                        </button>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex gap-2 flex-wrap">
                                    {sub.portfolio_link && (
                                      <span className="badge px-2.5 py-1.5 bg-white rounded-lg text-xs font-bold border border-[#241C15]/10 flex items-center gap-1.5">
                                        <Globe className="w-3.5 h-3.5" strokeWidth={2} />
                                        Portfolio
                                      </span>
                                    )}
                                    {sub.github_link && (
                                      <span className="badge px-2.5 py-1.5 bg-white rounded-lg text-xs font-bold border border-[#241C15]/10 flex items-center gap-1.5">
                                        <Github className="w-3.5 h-3.5" strokeWidth={2} />
                                        GitHub
                                      </span>
                                    )}
                                    {sub.resume_link && (
                                      <span className="badge px-2.5 py-1.5 bg-white rounded-lg text-xs font-bold border border-[#241C15]/10 flex items-center gap-1.5">
                                        <FileCode className="w-3.5 h-3.5" strokeWidth={2} />
                                        Resume
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-12 bg-[#fbf5e5]/30 rounded-xl">
                              <AlertCircle className="w-12 h-12 text-[#241C15]/20 mx-auto mb-3" />
                              <p className="text-sm font-semibold text-[#241C15]/40">
                                No submissions yet
                              </p>
                              <p className="text-xs text-[#241C15]/30 mt-1">
                                Candidates will appear here when they apply
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced View All Modal */}
        {viewAllModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden border-2 border-[#241C15]/10 shadow-2xl">
              <div className="flex items-center justify-between p-6 border-b-2 border-[#241C15]/10 bg-gradient-to-r from-[#fbf5e5] to-white">
                <div>
                  <h2 className="text-2xl font-black text-[#241C15]">
                    All Submissions
                  </h2>
                  <p className="text-sm text-[#241C15]/60 font-medium mt-1">
                    {viewAllModal.form.form_name} • {viewAllModal.submissions.length} candidates
                  </p>
                </div>
                <button
                  onClick={() => setViewAllModal(null)}
                  className="p-2.5 rounded-xl hover:bg-[#241C15]/10 transition-all"
                >
                  <X className="w-6 h-6 text-[#241C15]" strokeWidth={2.5} />
                </button>
              </div>

              <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {viewAllModal.submissions.length > 0 ? (
                  <div className="grid gap-5">
                    {viewAllModal.submissions.map((sub: any) => (
                      <div
                        key={sub.id}
                        className="border-2 border-[#241C15]/10 rounded-xl p-5 hover:border-[#FFE01B]/40 transition-all bg-gradient-to-br from-[#fbf5e5]/30 to-white hover:shadow-lg"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="p-3 bg-gradient-to-br from-[#FFE01B]/20 to-[#FCD34D]/20 rounded-xl border border-[#FFE01B]/30">
                                <User className="w-6 h-6 text-[#241C15]" strokeWidth={2} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-black text-xl text-[#241C15]">{sub.name}</h3>
                                  {isNewSubmission(sub.created_at) && (
                                    <span className="badge px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-300">
                                      New
                                    </span>
                                  )}
                                  {sub.meeting_scheduled && (
                                    <span className="badge px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold border border-blue-300">
                                      Meeting Scheduled
                                    </span>
                                  )}
                                </div>
                                {sub.profile_rating && (
                                  <div className="flex items-center gap-2 mt-2">
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFE01B]/10 rounded-lg border border-[#FFE01B]/30">
                                      <Star
                                        className="w-4 h-4 text-[#FFE01B] fill-current"
                                        strokeWidth={2}
                                      />
                                      <span className="text-sm font-black text-[#241C15]">
                                        {sub.profile_rating.toFixed(1)}
                                      </span>
                                    </div>
                                    <span className="text-sm font-semibold text-[#241C15]/60">
                                      Profile Rating
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                              {sub.years_experience && (
                                <div className="flex items-center gap-2.5 p-3 bg-white rounded-lg border border-[#241C15]/10">
                                  <Award className="w-5 h-5 text-[#FFE01B]" strokeWidth={2} />
                                  <div>
                                    <span className="font-black text-[#241C15]">
                                      {sub.years_experience} years
                                    </span>
                                    <span className="text-[#241C15]/60 font-medium"> of experience</span>
                                  </div>
                                </div>
                              )}
                              <div className="flex items-center gap-2.5 p-3 bg-white rounded-lg border border-[#241C15]/10">
                                <Calendar className="w-5 h-5 text-[#FFE01B]" strokeWidth={2} />
                                <div>
                                  <span className="text-[#241C15]/60 font-medium">Applied on </span>
                                  <span className="font-black text-[#241C15]">
                                    {formatDate(sub.created_at)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 flex-shrink-0 lg:min-w-[160px]">
                            {sub.is_selected ? (
                              <>
                                <div className="px-4 py-2.5 text-sm font-bold rounded-xl bg-green-100 text-green-700 border-2 border-green-300 text-center flex items-center justify-center gap-2">
                                  <CheckCircle2 className="w-4 h-4" strokeWidth={2.5} />
                                  Selected
                                </div>
                                <button className="px-4 py-2.5 text-sm font-bold rounded-xl bg-red-50 text-red-700 border-2 border-red-200 hover:bg-red-100 transition-all flex items-center justify-center gap-2">
                                  <XCircle className="w-4 h-4" strokeWidth={2} />
                                  Deselect
                                </button>
                                <button className="px-4 py-2.5 text-sm font-bold rounded-xl bg-blue-50 text-blue-700 border-2 border-blue-200 hover:bg-blue-100 transition-all flex items-center justify-center gap-2">
                                  <Video className="w-4 h-4" strokeWidth={2} />
                                  Schedule
                                </button>
                              </>
                            ) : (
                              <button className="px-4 py-2.5 text-sm font-bold rounded-xl bg-[#FFE01B]/20 border-2 border-[#FFE01B]/40 hover:bg-[#FFE01B]/40 text-[#241C15] transition-all flex items-center justify-center gap-2">
                                <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
                                Select
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2.5 mt-4 pt-4 border-t border-[#241C15]/10">
                          {sub.portfolio_link && (
                            <a
                              href={sub.portfolio_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="badge px-4 py-2.5 bg-white rounded-xl text-sm font-bold border-2 border-[#241C15]/10 hover:border-[#FFE01B]/40 hover:bg-[#fbf5e5]/50 transition-all flex items-center gap-2"
                            >
                              <Globe className="w-4 h-4" strokeWidth={2} />
                              Portfolio
                              <ExternalLink className="w-3.5 h-3.5" strokeWidth={2} />
                            </a>
                          )}
                          {sub.github_link && (
                            <a
                              href={sub.github_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="badge px-4 py-2.5 bg-white rounded-xl text-sm font-bold border-2 border-[#241C15]/10 hover:border-[#FFE01B]/40 hover:bg-[#fbf5e5]/50 transition-all flex items-center gap-2"
                            >
                              <Github className="w-4 h-4" strokeWidth={2} />
                              GitHub
                              <ExternalLink className="w-3.5 h-3.5" strokeWidth={2} />
                            </a>
                          )}
                          {sub.resume_link && (
                            <a
                              href={sub.resume_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="badge px-4 py-2.5 bg-white rounded-xl text-sm font-bold border-2 border-[#241C15]/10 hover:border-[#FFE01B]/40 hover:bg-[#fbf5e5]/50 transition-all flex items-center gap-2"
                            >
                              <FileCode className="w-4 h-4" strokeWidth={2} />
                              Resume
                              <ExternalLink className="w-3.5 h-3.5" strokeWidth={2} />
                            </a>
                          )}
                          {sub.proposal_link && (
                            <a
                              href={sub.proposal_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="badge px-4 py-2.5 bg-white rounded-xl text-sm font-bold border-2 border-[#241C15]/10 hover:border-[#FFE01B]/40 hover:bg-[#fbf5e5]/50 transition-all flex items-center gap-2"
                            >
                              <MessageSquare className="w-4 h-4" strokeWidth={2} />
                              Proposal
                              <ExternalLink className="w-3.5 h-3.5" strokeWidth={2} />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <AlertCircle className="w-16 h-16 text-[#241C15]/20 mx-auto mb-4" />
                    <p className="text-xl font-bold text-[#241C15]/50">No submissions found</p>
                    <p className="text-sm text-[#241C15]/40 mt-2">
                      This hiring form doesn't have any submissions yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  )
}