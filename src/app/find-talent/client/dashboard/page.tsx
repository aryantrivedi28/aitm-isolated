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
  Mail,
  Search,
  Filter,
  Download,
  Briefcase,
  ExternalLink,
  Star,
  AlertCircle,
  Phone,
  Award,
} from "lucide-react"
import { SubmissionDetailCard } from "./components/submission-detail-card"
import toast from "react-hot-toast"

const fetcher = async (url: string) => {
  const res = await fetch(url, { credentials: "include" })
  if (!res.ok) throw new Error("Failed to fetch")
  return res.json()
}

export default function ClientDashboardPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [expandedForm, setExpandedForm] = useState<string | null>(null)
  const [directSubmissions, setDirectSubmissions] = useState<any[]>([])
  const [loadingSubmissions, setLoadingSubmissions] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null)
  const [submissionPage, setSubmissionPage] = useState(1)
  const [form, setForms] = useState<any[]>([])

  const [selectedFormFilter, setSelectedFormFilter] = useState<string | null>(null)
  const SUBMISSIONS_PER_PAGE = 5

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

  const getFilteredSubmissions = () => {
    let filtered = submissions

    if (selectedFormFilter) {
      filtered = filtered.filter((s) => s.form_id === selectedFormFilter)
    }

    const sortedSubs = filtered.sort((a, b) => {
      if (a.is_selected !== b.is_selected) {
        return a.is_selected ? -1 : 1
      }

      const ratingA = a.profile_rating || 0
      const ratingB = b.profile_rating || 0
      return ratingB - ratingA
    })

    return sortedSubs
  }

  const filteredSubmissions = getFilteredSubmissions()
  const totalPages = Math.ceil(filteredSubmissions.length / SUBMISSIONS_PER_PAGE)
  const paginatedSubmissions = filteredSubmissions.slice(
    (submissionPage - 1) * SUBMISSIONS_PER_PAGE,
    submissionPage * SUBMISSIONS_PER_PAGE,
  )

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

  const handleSelectCandidate = async (sub: any, formId: string) => {
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

        setDirectSubmissions((prev: any[]) => prev.map((s) => (s.id === sub.id ? { ...s, is_selected: true } : s)))

        toast.success(`${sub.name} selected successfully ✅`)
      } else {
        toast.error(result.error || "Failed to select candidate")
      }
    } catch (err) {
      console.error(err)
      toast.error("Something went wrong")
    }
  }

  const handleDeselectCandidate = async (sub: any, formId: string) => {
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

        setDirectSubmissions((prev: any[]) => prev.map((s) => (s.id === sub.id ? { ...s, is_selected: false } : s)))

        toast.success(`${sub.name} deselected`)
      } else {
        toast.error(result.error || "Failed to deselect candidate")
      }
    } catch (err) {
      console.error(err)
      toast.error("Something went wrong")
    }
  }

  return (
    <>
      <style jsx global>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        .animate-slideInUp { animation: slideInUp 0.5s ease-out; }
        .animate-slideInLeft { animation: slideInLeft 0.5s ease-out; }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse 2s ease-in-out infinite; }
        
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(36,28,21,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,224,27,0.4); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,224,27,0.6); }

        .stat-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .stat-card:hover { transform: translateY(-8px) scale(1.02); }
        
        .form-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .form-card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px -12px rgba(255, 224, 27, 0.3); }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      <main className="min-h-screen bg-[#fbf5e5] text-[#241C15] relative overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFE01B]/5 rounded-full blur-3xl animate-float" />
          <div
            className="absolute bottom-0 left-0 w-96 h-96 bg-[#FCD34D]/5 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "1s" }}
          />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#FFE01B]/3 rounded-full blur-3xl animate-pulse-slow" />
        </div>

        {/* Header */}
        <div className="border-b-2 border-[#241C15]/10 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className={isLoaded ? "animate-slideInLeft" : "opacity-0"}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 sm:p-2.5 bg-gradient-to-br from-[#FFE01B] to-[#FCD34D] rounded-xl shadow-lg animate-float">
                    <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#241C15]" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#241C15]">Client Dashboard</h1>
                    <p className="text-xs sm:text-sm text-[#241C15]/60 font-medium">
                      {forms.length} hiring forms • {submissions.length} submissions
                    </p>
                  </div>
                </div>
              </div>
              <div
                className={`flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto ${isLoaded ? "animate-slideInUp" : "opacity-0"}`}
              >
                <button
                  className="flex-1 sm:flex-none px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-bold bg-gradient-to-r from-[#FFE01B] to-[#FCD34D] text-[#241C15] hover:shadow-xl transition-all flex items-center justify-center gap-2 hover:scale-105 text-sm sm:text-base"
                  onClick={() => router.push("/find-talent/direct-hiring")}
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden xs:inline">New Hiring</span>
                  <span className="xs:hidden">Direct Hiring</span>
                </button>
                <button
                  className="flex-1 sm:flex-none px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-semibold bg-white border-2 border-[#241C15]/20 text-[#241C15] hover:border-[#FFE01B] hover:bg-[#fbf5e5] transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                  onClick={() => router.push("/find-talent/assisted-hiring")}
                >
                  <span className="">Assisted Hiring</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
            {[
              {
                label: "Active",
                fullLabel: "Active Hirings",
                value: stats.activeHirings,
                icon: ClipboardList,
                bg: "bg-[#FFE01B]/10",
                color: "#FFE01B",
                iconBg: "from-[#FFE01B] to-[#FCD34D]",
              },
              {
                label: "Submissions",
                fullLabel: "Total Submissions",
                value: stats.totalSubmissions,
                icon: Users2,
                bg: "bg-green-500/10",
                color: "#10B981",
                iconBg: "from-green-400 to-green-600",
              },
              {
                label: "Pending",
                fullLabel: "Pending Review",
                value: stats.pendingReview,
                icon: Clock,
                bg: "bg-orange-500/10",
                color: "#F59E0B",
                iconBg: "from-orange-400 to-orange-600",
              },
              {
                label: "Total",
                fullLabel: "Total Forms",
                value: stats.totalForms,
                icon: FileText,
                bg: "bg-purple-500/10",
                color: "#8B5CF6",
                iconBg: "from-purple-400 to-purple-600",
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className={`stat-card bg-white rounded-2xl p-4 sm:p-5 lg:p-6 border-2 border-[#241C15]/10 hover:border-[#FFE01B]/50 shadow-md ${isLoaded ? "animate-slideInUp" : "opacity-0"}`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className={`p-2 sm:p-2.5 lg:p-3 rounded-xl bg-gradient-to-br ${stat.iconBg} shadow-lg`}>
                    <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className="p-1.5 sm:p-2 rounded-lg bg-green-500/10">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black mb-1 bg-gradient-to-br from-[#241C15] to-[#241C15]/70 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-[#241C15]/70 font-semibold">
                  <span className="hidden sm:inline">{stat.fullLabel}</span>
                  <span className="sm:hidden">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Search and Filter */}
          <div
            className={`bg-white rounded-2xl border-2 border-[#241C15]/10 p-4 sm:p-5 mb-6 shadow-md ${isLoaded ? "animate-fadeIn" : "opacity-0"}`}
            style={{ animationDelay: "0.4s" }}
          >
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#241C15]/40" />
                <input
                  type="text"
                  placeholder="Search hiring forms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-xl border-2 border-[#241C15]/20 focus:border-[#FFE01B] focus:ring-2 focus:ring-[#FFE01B]/20 outline-none transition-all bg-[#fbf5e5] text-sm sm:text-base"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 border-[#241C15]/20 focus:border-[#FFE01B] outline-none bg-white font-semibold text-sm sm:text-base"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                </select>
                <button className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-[#241C15] text-white hover:bg-[#241C15]/90 transition-all flex items-center gap-2 font-semibold text-sm sm:text-base">
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">Filter</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Forms */}
            <div className="lg:col-span-2">
              <div
                className={`bg-white rounded-2xl border-2 border-[#241C15]/10 p-4 sm:p-5 lg:p-6 shadow-lg ${isLoaded ? "animate-slideInLeft" : "opacity-0"}`}
                style={{ animationDelay: "0.5s" }}
              >
                <div className="flex items-center justify-between mb-5 sm:mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-[#FFE01B] to-[#FCD34D]">
                      <ClipboardList className="w-5 h-5 text-[#241C15]" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-black">Your Hiring Request</h2>
                      <p className="text-xs text-[#241C15]/60">
                        {filteredForms.length} of {forms.length} Request
                        {searchTerm && ` matching "${searchTerm}"`}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 rounded-lg hover:bg-[#fbf5e5] transition-all">
                    <Download className="w-4 h-4 sm:w-5 sm:h-5 text-[#241C15]/70" />
                  </button>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {filteredForms.map((form: any, idx: number) => {
                    const formSubs = getFormSubmissions(form.id)
                    return (
                      <div
                        key={form.id || idx}
                        className="form-card p-4 sm:p-5 rounded-xl border-2 border-[#241C15]/10 hover:border-[#FFE01B]/50 bg-gradient-to-br from-[#fbf5e5] to-white"
                        style={{ animationDelay: `${0.6 + idx * 0.1}s` }}
                      >
                        <div className="flex items-start justify-between gap-3 sm:gap-4 mb-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <h3 className="font-black text-base sm:text-lg text-[#241C15] truncate">
                                {form.form_name || form.job_title || "Untitled Form"}
                              </h3>
                              <span
                                className={`px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                                  form.status === "active" || form.is_active
                                    ? "bg-green-500/20 text-green-700 border-2 border-green-500/30"
                                    : "bg-gray-500/20 text-gray-700 border-2 border-gray-500/30"
                                }`}
                              >
                                {form.status || (form.is_active ? "active" : "closed")}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-[#241C15]/70 mb-3">
                              <span className="flex items-center gap-1.5">
                                <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                <span className="truncate">{form.role_type || form.role || "Not specified"}</span>
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Users2 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                {formSubs.length} submissions
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                <span className="truncate">
                                  {form.created_at ? new Date(form.created_at).toLocaleDateString() : "Unknown date"}
                                </span>
                              </span>
                            </div>

                            {form.category && (
                              <div className="flex flex-wrap gap-2">
                                {Array.isArray(form.category) ? (
                                  form.category.map((cat: string, i: number) => (
                                    <span
                                      key={i}
                                      className="px-2.5 py-1 bg-[#FFE01B]/20 rounded-lg text-xs font-bold border border-[#FFE01B]/30"
                                    >
                                      {cat}
                                    </span>
                                  ))
                                ) : (
                                  <span className="px-2.5 py-1 bg-[#FFE01B]/20 rounded-lg text-xs font-bold border border-[#FFE01B]/30">
                                    {form.category}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => toggleForm(form.id)}
                            className="p-2 rounded-lg border-2 border-[#241C15]/20 hover:bg-[#FFE01B]/10 hover:border-[#FFE01B] transition-all flex-shrink-0"
                          >
                            {expandedForm === form.id ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        {/* Expanded View - Enhanced with more submission details */}
                        {expandedForm === form.id && (
                          <div className="mt-4 bg-white rounded-xl p-3 sm:p-4 border-2 border-[#241C15]/10 animate-slideInUp">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-sm font-black flex items-center gap-2">
                                <Users2 className="w-4 h-4" />
                                Submissions ({formSubs.length})
                              </h4>
                              <button
                                onClick={() => {
                                  setSelectedFormFilter(form.id)
                                  setSubmissionPage(1)
                                }}
                                className="text-xs text-[#FFE01B] font-bold hover:underline flex items-center gap-1"
                              >
                                View All <ExternalLink className="w-3 h-3" />
                              </button>
                            </div>
                            {formSubs.length > 0 ? (
                              <div className="space-y-2">
                                {formSubs.slice(0, 3).map((sub: any) => (
                                  <div
                                    key={sub.id}
                                    className="border-2 border-[#241C15]/10 rounded-lg p-3 hover:border-[#FFE01B]/50 transition-all bg-[#fbf5e5] cursor-pointer hover:shadow-md"
                                    onClick={() => setSelectedSubmission(sub)}
                                  >
                                    <div className="flex justify-between items-start gap-2 mb-2">
                                      <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm truncate">{sub.name}</p>
                                        <p className="text-xs text-[#241C15]/70 flex items-center gap-1 mt-1 truncate">
                                          <Mail className="w-3 h-3 flex-shrink-0" />
                                          {sub.email}
                                        </p>
                                        {sub.phone && (
                                          <p className="text-xs text-[#241C15]/70 flex items-center gap-1 mt-1 truncate">
                                            <Phone className="w-3 h-3 flex-shrink-0" />
                                            {sub.phone}
                                          </p>
                                        )}
                                      </div>

                                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                        <div className="flex items-center gap-1">
                                          <Star className="w-3 h-3 text-[#FFE01B] fill-current" />
                                          <span
                                            className={`text-xs font-bold ${sub.profile_rating >= 4 ? "text-green-600" : sub.profile_rating >= 3 ? "text-yellow-600" : "text-gray-600"}`}
                                          >
                                            {sub.profile_rating ? sub.profile_rating.toFixed(1) : "N/A"}
                                          </span>
                                        </div>

                                        {sub.is_selected ? (
                                          <button
                                            onClick={async (e) => {
                                              e.stopPropagation()
                                              await handleDeselectCandidate(sub, form.id)
                                            }}
                                            className="px-3 py-1.5 text-xs font-bold rounded-lg border-2 bg-red-100 text-red-700 border-red-400 hover:bg-red-200 transition-all"
                                          >
                                            Deselect
                                          </button>
                                        ) : (
                                          <button
                                            onClick={async (e) => {
                                              e.stopPropagation()
                                              await handleSelectCandidate(sub, form.id)
                                            }}
                                            className="px-3 py-1.5 text-xs font-bold rounded-lg border-2 bg-[#FFE01B]/20 border-[#FFE01B]/30 hover:bg-[#FFE01B]/40 text-[#241C15] transition-all"
                                          >
                                            Select
                                          </button>
                                        )}
                                      </div>
                                    </div>

                                    <div className="flex gap-1.5 flex-wrap mt-2">
                                      {sub.portfolio_link && (
                                        <span className="px-2 py-0.5 bg-[#FFE01B]/20 rounded text-xs font-bold border border-[#FFE01B]/30">
                                          Portfolio
                                        </span>
                                      )}
                                      {sub.github_link && (
                                        <span className="px-2 py-0.5 bg-[#FFE01B]/20 rounded text-xs font-bold border border-[#FFE01B]/30">
                                          GitHub
                                        </span>
                                      )}
                                      {sub.resume_link && (
                                        <span className="px-2 py-0.5 bg-[#FFE01B]/20 rounded text-xs font-bold border border-[#FFE01B]/30">
                                          Resume
                                        </span>
                                      )}
                                      {sub.proposal_link && (
                                        <span className="px-2 py-0.5 bg-[#FFE01B]/20 rounded text-xs font-bold border border-[#FFE01B]/30">
                                          Proposal
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-8 bg-[#fbf5e5] rounded-lg">
                                <AlertCircle className="w-8 h-8 text-[#241C15]/30 mx-auto mb-2" />
                                <p className="text-xs text-[#241C15]/50">No submissions yet</p>
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

            {/* Recent Submissions Sidebar - Enhanced */}
            <div className={`${isLoaded ? "animate-slideInUp" : "opacity-0"}`} style={{ animationDelay: "0.7s" }}>
              {selectedSubmission ? (
                <div className="sticky top-24">
                  <button
                    onClick={() => setSelectedSubmission(null)}
                    className="mb-4 px-4 py-2 rounded-xl bg-[#241C15] text-white hover:bg-[#241C15]/90 transition-all font-semibold text-sm flex items-center gap-2"
                  >
                    ← Back to List
                  </button>
                  <SubmissionDetailCard
                    submission={selectedSubmission}
                    formName={forms.find((f: any) => f.id === selectedSubmission.form_id)?.form_name || "Hiring Form"}
                  />
                </div>
              ) : (
                <div className="bg-white rounded-2xl border-2 border-[#241C15]/10 p-4 sm:p-5 lg:p-6 shadow-lg sticky top-24">
                  <div className="flex items-center gap-3 mb-5 sm:mb-6">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-green-400 to-green-600">
                      <Users2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-black">Recent Submissions</h2>
                      <p className="text-xs text-[#241C15]/60">
                        {selectedFormFilter
                          ? `${filteredSubmissions.length} from selected form`
                          : `${submissions.length} total submissions`}
                      </p>
                    </div>
                  </div>

                  {!selectedFormFilter && forms.length > 1 && (
                    <div className="mb-4">
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            setSelectedFormFilter(e.target.value)
                            setSubmissionPage(1)
                          }
                        }}
                        className="w-full px-3 py-2 rounded-lg border-2 border-[#241C15]/20 focus:border-[#FFE01B] outline-none bg-[#fbf5e5] text-sm font-semibold"
                      >
                        <option value="">All Forms</option>
                        {forms.map((form: any) => (
                          <option key={form.id} value={form.id}>
                            {form.form_name || form.job_title || "Untitled Form"}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="space-y-3 max-h-[calc(100vh-450px)] sm:max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {paginatedSubmissions.length > 0 ? (
                      paginatedSubmissions.map((sub: any, idx: number) => (
                        <button
                          key={sub.id || idx}
                          onClick={() => setSelectedSubmission(sub)}
                          className="w-full text-left p-3 sm:p-4 rounded-xl border-2 border-[#241C15]/10 hover:border-[#FFE01B]/50 bg-gradient-to-br from-[#fbf5e5] to-white hover:shadow-md transition-all"
                          style={{ animationDelay: `${0.8 + idx * 0.1}s` }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-bold text-sm truncate flex-1">{sub.name}</h4>
                            {sub.profile_rating && (
                              <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                                <Star className="w-3 h-3 text-[#FFE01B] fill-current" />
                                <span className="text-xs font-bold">{sub.profile_rating.toFixed(1)}</span>
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-[#241C15]/70 space-y-1">
                            <p className="flex items-center gap-1.5 truncate">
                              <Mail className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{sub.email}</span>
                            </p>
                            {sub.phone && (
                              <p className="flex items-center gap-1.5 truncate">
                                <Phone className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{sub.phone}</span>
                              </p>
                            )}
                            {sub.years_experience && (
                              <p className="flex items-center gap-1.5">
                                <Award className="w-3 h-3 flex-shrink-0" />
                                <span>{sub.years_experience} years exp.</span>
                              </p>
                            )}
                          </div>
                          <div className="flex gap-1.5 mt-3 flex-wrap">
                            {sub.portfolio_link && (
                              <span className="px-2 py-1 bg-[#FFE01B]/20 rounded text-xs font-bold border border-[#FFE01B]/30">
                                Portfolio
                              </span>
                            )}
                            {sub.github_link && (
                              <span className="px-2 py-1 bg-[#FFE01B]/20 rounded text-xs font-bold border border-[#FFE01B]/30">
                                GitHub
                              </span>
                            )}
                            {sub.resume_link && (
                              <span className="px-2 py-1 bg-[#FFE01B]/20 rounded text-xs font-bold border border-[#FFE01B]/30">
                                Resume
                              </span>
                            )}
                            {sub.proposal_link && (
                              <span className="px-2 py-1 bg-[#FFE01B]/20 rounded text-xs font-bold border border-[#FFE01B]/30">
                                Proposal
                              </span>
                            )}
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <AlertCircle className="w-8 h-8 text-[#241C15]/30 mx-auto mb-2" />
                        <p className="text-xs text-[#241C15]/50">
                          {selectedFormFilter ? "No submissions for this form" : "No submissions yet"}
                        </p>
                      </div>
                    )}
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-4 pt-4 border-t-2 border-[#241C15]/10 flex items-center justify-between">
                      <button
                        onClick={() => setSubmissionPage(Math.max(1, submissionPage - 1))}
                        disabled={submissionPage === 1}
                        className="px-3 py-1.5 rounded-lg bg-[#241C15]/10 text-[#241C15] disabled:opacity-50 hover:bg-[#241C15]/20 transition-all text-xs font-bold"
                      >
                        ← Prev
                      </button>
                      <span className="text-xs font-bold text-[#241C15]/70">
                        {submissionPage} / {totalPages}
                      </span>
                      <button
                        onClick={() => setSubmissionPage(Math.min(totalPages, submissionPage + 1))}
                        disabled={submissionPage === totalPages}
                        className="px-3 py-1.5 rounded-lg bg-[#241C15]/10 text-[#241C15] disabled:opacity-50 hover:bg-[#241C15]/20 transition-all text-xs font-bold"
                      >
                        Next →
                      </button>
                    </div>
                  )}

                  {selectedFormFilter && (
                    <button
                      onClick={() => {
                        setSelectedFormFilter(null)
                        setSubmissionPage(1)
                      }}
                      className="w-full mt-4 px-3 py-2 rounded-lg bg-[#FFE01B]/20 text-[#241C15] hover:bg-[#FFE01B]/30 transition-all text-xs font-bold border border-[#FFE01B]/30"
                    >
                      Clear Filter
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
