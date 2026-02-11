"use client"

import type React from "react"

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
  Globe,
  Github,
  FileCode,
  MessageSquare,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  Clock3,
  Check,
  Mail,
  Phone,
  Zap,
  RefreshCw,
} from "lucide-react"
import TimeSlotSelectorModal from "../../../../components/client/TimeSlotSelector"

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
  status?: string
  time_slot_selected_at?: string | null
}

interface ViewAllModalData {
  form: any
  submissions: FreelancerSubmission[]
}

const toast = {
  success: (msg: string) => console.log("✅", msg),
  error: (msg: string) => console.error("❌", msg),
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
  const [forms, setForms] = useState<any[]>([])

  const [selectedFreelancer, setSelectedFreelancer] = useState<FreelancerSubmission | null>(null)
  const [viewAllModal, setViewAllModal] = useState<ViewAllModalData | null>(null)
  const [showTimeSlotModal, setShowTimeSlotModal] = useState(false)
  const [refetchTrigger, setRefetchTrigger] = useState(0)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const [stats, setStats] = useState({
    totalForms: 0,
    totalSubmissions: 0,
    activeHirings: 0,
    pendingReview: 0,
    selectedCandidates: 0,
    pendingTimeSlots: 0,
  })

  useEffect(() => {
    setIsClient(true)
  }, [])

  const {
    data: serverForms,
    isLoading: loadingForms,
    mutate: mutateForms,
  } = useSWR(isClient ? "/api/client/hirings" : null, fetcher, {
    onSuccess: (data) => {
      setForms(data?.forms || [])
    },
    onError: (error) => {
      console.error("Error fetching forms:", error)
    },
  })

  useEffect(() => {
    if (!isClient) return

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
        console.error("Error fetching submissions:", err)
        setDirectSubmissions([])
      } finally {
        setLoadingSubmissions(false)
      }
    }

    fetchSubmissions()
  }, [isClient, refetchTrigger])

  const submissions = directSubmissions

  useEffect(() => {
    if (!isClient || !serverForms) return

    const formsArray = forms || []
    const submissionsArray = submissions || []

    const activeForms = formsArray.filter((f: any) => f.status === "active" || f.is_active === true).length
    const pendingSubs = submissionsArray.filter((s: any) => s.status === "new").length
    const selectedCandidates = submissionsArray.filter((s: any) => s.is_selected === true).length
    const pendingTimeSlots = submissionsArray.filter(
      (s: any) => s.is_selected === true && s.status === "selected" && !s.time_slot_selected_at,
    ).length

    setStats({
      totalForms: formsArray.length,
      totalSubmissions: submissionsArray.length,
      activeHirings: activeForms,
      pendingReview: pendingSubs,
      selectedCandidates,
      pendingTimeSlots,
    })
  }, [serverForms, submissions, isClient, forms])

  const toggleForm = (id: string) => {
    setExpandedForm(expandedForm === id ? null : id)
  }

  const getFormSubmissions = (formId: string) => {
    const formSubs = submissions.filter((s) => s.form_id === formId)
    const sortedSubs = formSubs.sort((a, b) => {
      if (a.is_selected !== b.is_selected) {
        return a.is_selected ? -1 : 1
      }
      const aWaitingTimeSlot = a.is_selected && a.status === "selected" && !a.time_slot_selected_at
      const bWaitingTimeSlot = b.is_selected && b.status === "selected" && !b.time_slot_selected_at
      if (aWaitingTimeSlot !== bWaitingTimeSlot) {
        return aWaitingTimeSlot ? -1 : 1
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
      submissions: formSubs,
    })
  }

  const handleSelectCandidate = async (e: React.MouseEvent, sub: FreelancerSubmission, formId: string) => {
    e.stopPropagation()
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
        toast.success(`${sub.name} selected successfully ✅`)
        setRefetchTrigger((prev) => prev + 1)
      } else {
        toast.error(result.error || "Failed to select candidate")
      }
    } catch (err) {
      console.error(err)
      toast.error("Something went wrong")
    }
  }

  const handleDeselectCandidate = async (e: React.MouseEvent, sub: FreelancerSubmission, formId: string) => {
    e.stopPropagation()
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
        toast.success(`${sub.name} deselected`)
        setRefetchTrigger((prev) => prev + 1)
      } else {
        toast.error(result.error || "Failed to deselect candidate")
      }
    } catch (err) {
      console.error(err)
      toast.error("Something went wrong")
    }
  }

  const handleScheduleInterview = (sub: FreelancerSubmission) => {
    setSelectedFreelancer(sub)
    setShowTimeSlotModal(true)
  }

  const handleTimeSlotSuccess = () => {
    toast.success("Time slot selected! Admin has been notified to schedule the meeting.")
    setRefetchTrigger((prev) => prev + 1)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const isNewSubmission = (createdAt: string) => {
    const created = new Date(createdAt)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - created.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 3
  }

  const getStatusBadge = (sub: FreelancerSubmission) => {
    if (sub.meeting_scheduled) {
      return {
        label: "Meeting Scheduled",
        className: "bg-[#241C15]/5 text-[#241C15] border-[#241C15]/20",
        icon: <Video className="w-3 h-3" />,
      }
    }
    if (sub.time_slot_selected_at) {
      return {
        label: "Awaiting Schedule",
        className: "bg-[#f7af00]/10 text-[#241C15] border-[#f7af00]/30",
        icon: <Clock3 className="w-3 h-3" />,
      }
    }
    if (sub.is_selected) {
      return {
        label: "Selected",
        className: "bg-[#f7af00]/20 text-[#241C15] border-[#f7af00]/40",
        icon: <Check className="w-3 h-3" />,
      }
    }
    return null
  }

  if (!isClient || loadingForms) {
    return (
      <div className="min-h-screen bg-[#fbf5e5] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[#f7af00]/30 border-t-[#f7af00] rounded-full animate-spin"></div>
            <Building2 className="w-8 h-8 text-[#241C15] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-[#241C15] font-medium">Loading your dashboard...</p>
        </div>
      </div>
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
    <main className="min-h-screen bg-[#fbf5e5] text-[#241C15]">
      {/* Header */}
      <header className="border-b border-[#241C15]/10 bg-[#f0eadd] backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#f7af00] rounded-xl shadow-sm">
                <Building2 className="w-6 h-6 text-[#241C15]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#241C15]">Client Dashboard</h1>
                <p className="text-sm text-[#241C15]/60 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#f7af00]" />
                  Manage your hiring pipeline
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/find-talent/direct-hiring")}
                className="px-5 py-2.5 bg-[#f7af00] hover:bg-[#f7af00] text-[#241C15] rounded-lg font-semibold flex items-center gap-2 transition-all shadow-sm hover:shadow-md"
              >
                <Plus className="w-4 h-4" strokeWidth={2.5} />
                New Hiring
              </button>
              <button
                onClick={() => router.push("/find-talent/assisted-hiring")}
                className="px-5 py-2.5 bg-[#f0eadd] border border-[#241C15]/15 hover:border-[#f7af00] text-[#241C15] rounded-lg font-semibold flex items-center gap-2 transition-all">
                <Sparkles className="w-4 h-4" />
                Assisted Hiring
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: "Active Hirings", value: stats.activeHirings, icon: ClipboardList, accent: true },
            { label: "Total Submissions", value: stats.totalSubmissions, icon: Users2 },
            { label: "Pending Review", value: stats.pendingReview, icon: Clock },
            { label: "Selected", value: stats.selectedCandidates, icon: CheckCircle2 },
            {
              label: "Awaiting Slots",
              value: stats.pendingTimeSlots,
              icon: Clock3,
              highlight: stats.pendingTimeSlots > 0,
            },
            { label: "Total Forms", value: stats.totalForms, icon: FileText },
          ].map((stat, idx) => (
            <div
              key={idx}
              className={`rounded-xl p-4 border transition-all hover:shadow-md ${stat.accent
                  ? "bg-[#f0eadd] border-[#f0eadd] text-black"
                  : stat.highlight
                    ? "bg-[#f7af00]/10 border-[#f7af00]/30"
                    : "bg-[#f0eadd] border-[#241C15]/10"
                }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${stat.accent ? "bg-[#f7af00]" : "bg-[#fbf5e5]"}`}>
                  <stat.icon className={`w-4 h-4 ${stat.accent ? "text-[#241C15]" : "text-[#241C15]/70"}`} />
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className={`w-3 h-3 ${stat.accent ? "text-[#f7af00]" : "text-[#241C15]/40"}`} />
                </div>
              </div>
              <div className={`text-2xl font-bold mb-0.5 ${stat.accent ? "text-black" : "text-[#241C15]"}`}>
                {stat.value}
              </div>
              <div className={`text-xs font-medium ${stat.accent ? "text-black" : "text-[#241C15]/60"}`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="bg-[#f0eadd] rounded-xl p-4 mb-8 border border-[#241C15]/10 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#241C15]/40" />
              <input
                type="text"
                placeholder="Search hiring forms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-lg border border-[#241C15]/10 focus:border-[#f7af00] focus:ring-2 focus:ring-[#f7af00]/20 outline-none transition-all bg-[#fbf5e5]/50 text-[#241C15] placeholder:text-[#241C15]/40"
              />
            </div>
            <div className="flex gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:flex-none">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#241C15]/40" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full lg:w-40 pl-10 pr-4 py-3 rounded-lg border border-[#241C15]/10 focus:border-[#f7af00] focus:ring-2 focus:ring-[#f7af00]/20 outline-none bg-[#fbf5e5]/50 font-medium text-[#241C15] cursor-pointer appearance-none"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <button className="px-4 py-3 rounded-lg bg-[#241C15] text-white hover:bg-[#241C15]/90 transition-all flex items-center gap-2 font-medium">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Forms Section */}
        <div className="bg-[#f0eadd] rounded-xl border border-[#241C15]/10 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#241C15]/10 bg-[#fbf5e5]/30">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#f7af00] rounded-lg">
                  <ClipboardList className="w-5 h-5 text-[#241C15]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#241C15]">Your Hiring Requests</h2>
                  <p className="text-sm text-[#241C15]/60">
                    {filteredForms.length} of {forms.length} Request{forms.length !== 1 ? "s" : ""}
                    {searchTerm && ` matching "${searchTerm}"`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  mutateForms()
                  setRefetchTrigger((prev) => prev + 1)
                }}
                className="p-2 rounded-lg hover:bg-[#241C15]/5 transition-all"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4 text-[#241C15]/60" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {filteredForms.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 bg-[#fbf5e5] rounded-full flex items-center justify-center">
                  <ClipboardList className="w-10 h-10 text-[#241C15]/30" />
                </div>
                <h3 className="text-lg font-semibold text-[#241C15]/60 mb-2">No hiring forms found</h3>
                <p className="text-[#241C15]/40 mb-6">
                  {searchTerm ? "Try a different search term" : "Create your first hiring request"}
                </p>
                <button
                  onClick={() => router.push("/client/hirings/create")}
                  className="px-6 py-2.5 bg-[#f7af00] hover:bg-[#f7af00] text-[#241C15] rounded-lg font-semibold flex items-center gap-2 mx-auto transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Create Hiring Request
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredForms.map((form: any) => {
                  const formSubs = getFormSubmissions(form.id)
                  const selectedSubs = formSubs.filter((s: any) => s.is_selected)
                  const pendingTimeSlotSubs = selectedSubs.filter((s: any) => !s.time_slot_selected_at)

                  return (
                    <div
                      key={form.id}
                      className="rounded-xl border border-[#241C15]/10 bg-[#f0eadd] hover:border-[#f7af00]/50 transition-all hover:shadow-md"
                    >
                      <div className="p-5">
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <h3 className="font-bold text-lg text-[#241C15]">{form.form_name}</h3>
                              <span
                                className={`px-2.5 py-1 rounded-full text-xs font-semibold ${form.status === "active"
                                    ? "bg-[#f7af00]/20 text-[#241C15] border border-[#f7af00]/40"
                                    : "bg-[#241C15]/5 text-[#241C15]/60 border border-[#241C15]/10"
                                  }`}
                              >
                                {form.status?.toUpperCase()}
                              </span>
                              {pendingTimeSlotSubs.length > 0 && (
                                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#241C15] text-[#f7af00] flex items-center gap-1">
                                  <Clock3 className="w-3 h-3" />
                                  {pendingTimeSlotSubs.length} need slots
                                </span>
                              )}
                            </div>

                            <div className="flex flex-wrap gap-3 text-sm text-[#241C15]/70 mb-3">
                              <span className="flex items-center gap-1.5 bg-[#fbf5e5] px-2.5 py-1 rounded-md">
                                <Briefcase className="w-3.5 h-3.5 text-[#f7af00]" />
                                {form.role_type}
                              </span>
                              <span className="flex items-center gap-1.5 bg-[#fbf5e5] px-2.5 py-1 rounded-md">
                                <Users2 className="w-3.5 h-3.5 text-[#f7af00]" />
                                {formSubs.length} submissions
                              </span>
                              <span className="flex items-center gap-1.5 bg-[#fbf5e5] px-2.5 py-1 rounded-md">
                                <Calendar className="w-3.5 h-3.5 text-[#f7af00]" />
                                {formatDate(form.created_at)}
                              </span>
                            </div>

                            {form.category && (
                              <div className="flex flex-wrap gap-1.5">
                                {(Array.isArray(form.category) ? form.category : [form.category]).map(
                                  (cat: string, i: number) => (
                                    <span
                                      key={i}
                                      className="px-2.5 py-1 bg-[#f7af00]/10 rounded-md text-xs font-medium text-[#241C15] border border-[#f7af00]/20"
                                    >
                                      {cat}
                                    </span>
                                  ),
                                )}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {formSubs.length > 0 && (
                              <button
                                onClick={() => handleViewAllSubmissions(form)}
                                className="px-4 py-2 rounded-lg bg-[#241C15] text-white hover:bg-[#241C15]/90 transition-all text-sm font-medium flex items-center gap-2"
                              >
                                <Users2 className="w-4 h-4" />
                                View All
                              </button>
                            )}
                            <button
                              onClick={() => toggleForm(form.id)}
                              className="p-2 rounded-lg border border-[#241C15]/10 hover:border-[#f7af00]/40 hover:bg-[#f7af00]/10 transition-all"
                            >
                              {expandedForm === form.id ? (
                                <ChevronUp className="w-5 h-5 text-[#241C15]" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-[#241C15]" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Submissions View */}
                      {expandedForm === form.id && (
                        <div className="border-t border-[#241C15]/10 bg-[#f0eadd] p-5">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-semibold text-black flex items-center gap-2">
                              <Users2 className="w-4 h-4 text-[#f7af00]" />
                              Submissions ({formSubs.length})
                            </h4>
                            {formSubs.length > 3 && (
                              <button
                                onClick={() => handleViewAllSubmissions(form)}
                                className="text-sm text-[#241C15] font-medium hover:underline flex items-center gap-1"
                              >
                                View All
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          {formSubs.length > 0 ? (
                            <div className="space-y-3">
                              {formSubs.slice(0, 3).map((sub: any) => {
                                const statusBadge = getStatusBadge(sub)
                                const needsTimeSlot = sub.is_selected && !sub.time_slot_selected_at

                                return (
                                  <div key={sub.id} className="rounded-lg p-4 bg-[#f0eadd] border border-[#241C15]/10">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                      <div className="flex items-start gap-3 flex-1">
                                        <div className="p-2 bg-[#f7af00]/20 rounded-lg">
                                          <User className="w-5 h-5 text-[#241C15]" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <p className="font-semibold text-[#241C15]">{sub.name}</p>
                                            {isNewSubmission(sub.created_at) && (
                                              <span className="px-2 py-0.5 bg-[#f7af00] text-[#241C15] rounded text-xs font-semibold">
                                                New
                                              </span>
                                            )}
                                            {statusBadge && (
                                              <span
                                                className={`px-2 py-0.5 rounded text-xs font-semibold border flex items-center gap-1 ${statusBadge.className}`}
                                              >
                                                {statusBadge.icon}
                                                {statusBadge.label}
                                              </span>
                                            )}
                                          </div>
                                          <div className="flex flex-wrap items-center gap-3 text-xs text-[#241C15]/60">
                                            <span className="flex items-center gap-1">
                                              <Mail className="w-3 h-3" />
                                              {sub.email}
                                            </span>
                                            {sub.years_experience && (
                                              <span className="flex items-center gap-1">
                                                <Award className="w-3 h-3" />
                                                {sub.years_experience} yrs
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1 px-2 py-1 bg-[#f7af00]/10 rounded border border-[#f7af00]/20">
                                          <Star className="w-3 h-3 text-[#f7af00] fill-current" />
                                          <span className="text-sm font-bold text-[#241C15]">
                                            {sub.profile_rating?.toFixed(1) || "N/A"}
                                          </span>
                                        </div>

                                        {sub.is_selected ? (
                                          <div className="flex items-center gap-2">
                                            {needsTimeSlot && (
                                              <button
                                                onClick={() => handleScheduleInterview(sub)}
                                                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#241C15] text-[#f7af00] hover:bg-[#241C15]/90 transition-all flex items-center gap-1"
                                              >
                                                <Clock3 className="w-3 h-3" />
                                                Select Slot
                                              </button>
                                            )}
                                            <button
                                              onClick={(e) => handleDeselectCandidate(e, sub, form.id)}
                                              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#241C15]/5 text-[#241C15]/70 hover:bg-[#241C15]/10 transition-all flex items-center gap-1"
                                            >
                                              <XCircle className="w-3 h-3" />
                                              Deselect
                                            </button>
                                          </div>
                                        ) : (
                                          <button
                                            onClick={(e) => handleSelectCandidate(e, sub, form.id)}
                                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#f7af00] text-[#241C15] hover:bg-[#e6ca18] transition-all flex items-center gap-1"
                                          >
                                            <CheckCircle2 className="w-3 h-3" />
                                            Select
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <AlertCircle className="w-10 h-10 text-white/20 mx-auto mb-2" />
                              <p className="text-sm text-white/60">No submissions yet</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View All Modal */}
      {viewAllModal && (
        <div className="fixed inset-0 bg-[#241C15]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#f0eadd] rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden border border-[#241C15]/10 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-[#241C15]/10 bg-[#fbf5e5]">
              <div>
                <h2 className="text-xl font-bold text-[#241C15]">All Submissions</h2>
                <p className="text-sm text-[#241C15]/60 mt-1">
                  {viewAllModal.form.form_name} • {viewAllModal.submissions.length} candidates
                </p>
              </div>
              <button
                onClick={() => setViewAllModal(null)}
                className="p-2 rounded-lg hover:bg-[#241C15]/10 transition-all"
              >
                <X className="w-5 h-5 text-[#241C15]" />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {viewAllModal.submissions.length > 0 ? (
                <div className="space-y-4">
                  {viewAllModal.submissions.map((sub: any) => {
                    const statusBadge = getStatusBadge(sub)
                    const needsTimeSlot = sub.is_selected && !sub.time_slot_selected_at

                    return (
                      <div
                        key={sub.id}
                        className="rounded-xl p-5 underline underline-offset-2 bg-[#f0eadd] transition-all"
                      >
                        <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-5">
                          <div className="flex-1">
                            <div className="flex items-start gap-4 mb-4">
                              <div className="p-3 bg-[#f7af00] rounded-xl">
                                <User className="w-6 h-6 text-[#241C15]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                  <h3 className="font-bold text-lg text-[#241C15]">{sub.name}</h3>
                                  {isNewSubmission(sub.created_at) && (
                                    <span className="px-2 py-0.5 bg-[#f7af00] text-[#241C15] rounded text-xs font-semibold">
                                      New
                                    </span>
                                  )}
                                  {statusBadge && (
                                    <span
                                      className={`px-2 py-0.5 rounded text-xs font-semibold border flex items-center gap-1 ${statusBadge.className}`}
                                    >
                                      {statusBadge.icon}
                                      {statusBadge.label}
                                    </span>
                                  )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                                  <div className="flex items-center gap-2 p-2 bg-[#fbf5e5] rounded-lg">
                                    <Mail className="w-4 h-4 text-[#f7af00]" />
                                    <span className="text-sm text-[#241C15] truncate">{sub.email}</span>
                                  </div>
                                  {sub.phone && (
                                    <div className="flex items-center gap-2 p-2 bg-[#fbf5e5] rounded-lg">
                                      <Phone className="w-4 h-4 text-[#f7af00]" />
                                      <span className="text-sm text-[#241C15]">{sub.phone}</span>
                                    </div>
                                  )}
                                  {sub.years_experience && (
                                    <div className="flex items-center gap-2 p-2 bg-[#fbf5e5] rounded-lg">
                                      <Award className="w-4 h-4 text-[#f7af00]" />
                                      <span className="text-sm text-[#241C15]">{sub.years_experience} years exp</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {sub.portfolio_link && (
                                <a
                                  href={sub.portfolio_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 bg-white rounded-lg text-xs font-medium border border-[#241C15]/10 hover:border-[#f7af00]/40 hover:bg-[#fbf5e5] transition-all flex items-center gap-1.5"
                                >
                                  <Globe className="w-3.5 h-3.5" />
                                  Portfolio
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                              {sub.github_link && (
                                <a
                                  href={sub.github_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 bg-white rounded-lg text-xs font-medium border border-[#241C15]/10 hover:border-[#f7af00]/40 hover:bg-[#fbf5e5] transition-all flex items-center gap-1.5"
                                >
                                  <Github className="w-3.5 h-3.5" />
                                  GitHub
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                              {sub.resume_link && (
                                <a
                                  href={sub.resume_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 bg-white rounded-lg text-xs font-medium border border-[#241C15]/10 hover:border-[#f7af00]/40 hover:bg-[#fbf5e5] transition-all flex items-center gap-1.5"
                                >
                                  <FileCode className="w-3.5 h-3.5" />
                                  Resume
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                              {sub.proposal_link && (
                                <a
                                  href={sub.proposal_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 bg-white rounded-lg text-xs font-medium border border-[#241C15]/10 hover:border-[#f7af00]/40 hover:bg-[#fbf5e5] transition-all flex items-center gap-1.5"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                  Proposal
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 xl:w-48">
                            <div className="flex items-center gap-2 px-3 py-2 bg-[#f7af00] rounded-lg border border-[#f7af00]/20 mb-2">
                              <Star className="w-4 h-4 text-[#f7af00] fill-current" />
                              <span className="font-medium text-[#241C15]">
                                {sub.profile_rating?.toFixed(1) || "N/A"}
                              </span>
                              <span className="text-base text-[#241C15]/60">/10.0</span>
                            </div>

                            {sub.is_selected ? (
                              <div className="space-y-2">
                                <div className="px-3 py-2 text-sm font-semibold rounded-lg bg-[#f7af00] text-[#241C15] border border-[#f7af00]/40 text-center flex items-center justify-center gap-1.5">
                                  <CheckCircle2 className="w-4 h-4" />
                                  Selected
                                </div>
                                {needsTimeSlot && (
                                  <button
                                    onClick={() => {
                                      handleScheduleInterview(sub)
                                      setViewAllModal(null)
                                    }}
                                    className="w-full px-3 py-2 text-sm font-semibold rounded-lg bg-[#241C15] text-[#f7af00] hover:bg-[#241C15]/90 transition-all flex items-center justify-center gap-1.5"
                                  >
                                    <Clock3 className="w-4 h-4" />
                                    Select Time Slot
                                  </button>
                                )}
                                <button
                                  onClick={(e) => {
                                    handleDeselectCandidate(e, sub, viewAllModal.form.id)
                                    setViewAllModal(null)
                                  }}
                                  className="w-full px-3 py-2 text-sm font-semibold rounded-lg bg-[#fbf5e5] text-[#241C15]/70 hover:bg-[#241C15]/10 transition-all flex items-center justify-center gap-1.5"
                                >
                                  <XCircle className="w-4 h-4" />
                                  Deselect
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={(e) => {
                                  handleSelectCandidate(e, sub, viewAllModal.form.id)
                                  setViewAllModal(null)
                                }}
                                className="w-full px-3 py-2 text-sm font-semibold rounded-lg bg-[#f7af00] text-[#241C15] hover:bg-[#e6ca18] transition-all flex items-center justify-center gap-1.5"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                Select Candidate
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-4 bg-[#fbf5e5] rounded-full flex items-center justify-center">
                    <Users2 className="w-10 h-10 text-[#241C15]/30" />
                  </div>
                  <p className="text-lg font-semibold text-[#241C15]/50 mb-2">No submissions found</p>
                  <p className="text-[#241C15]/40">Share the form link with candidates</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TimeSlotSelectorModal */}
      {showTimeSlotModal && selectedFreelancer && (
        <TimeSlotSelectorModal
          isOpen={showTimeSlotModal}
          onClose={() => {
            setShowTimeSlotModal(false)
            setSelectedFreelancer(null)
          }}
          submissionId={selectedFreelancer.id}
          freelancerName={selectedFreelancer.name}
          freelancerEmail={selectedFreelancer.email}
          onSuccess={handleTimeSlotSuccess}
        />
      )}
    </main>
  )
}
