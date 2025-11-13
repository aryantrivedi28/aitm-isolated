"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import useSWR from "swr"
import { 
  Loader2, Briefcase, Calendar, FileText, ExternalLink, TrendingUp, 
  Clock, CheckCircle, XCircle, Eye, User, LogOut, Menu, X, 
  ChevronRight, Building2, MapPin, DollarSign, Filter, Search,
  Download
} from "lucide-react"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const fetcher = (url: string) => fetch(url, { credentials: "include" }).then(res => res.json())

export default function FreelancerApplications() {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { data: meData, isLoading: meLoading } = useSWR("/api/freelancer/me", fetcher)
  const { data: submissionsData, isLoading: submissionsLoading } = useSWR("/api/freelancer/submissions", fetcher)

  const [applications, setApplications] = useState<any[]>([])
  const [filteredApplications, setFilteredApplications] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    if (submissionsData?.submissions) {
      const apps = submissionsData.submissions
      setApplications(apps)
      setFilteredApplications(apps)
    }
  }, [submissionsData])

  // Filter and search applications
  useEffect(() => {
    let filtered = applications

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.forms?.form_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.forms?.form_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.forms?.client_table?.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(app => {
        const status = app.status?.toLowerCase()
        switch (statusFilter) {
          case "accepted": return ['selected', 'accepted'].includes(status)
          case "reviewed": return status === 'reviewed'
          case "pending": return !status || status === 'submitted'
          case "rejected": return status === 'rejected'
          default: return true
        }
      })
    }

    // Sort applications
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case "rating":
          return (b.profile_rating || 0) - (a.profile_rating || 0)
        case "name":
          return (a.forms?.form_name || "").localeCompare(b.forms?.form_name || "")
        default:
          return 0
      }
    })

    setFilteredApplications(filtered)
  }, [applications, searchTerm, statusFilter, sortBy])

  const getStatusConfig = (status: string) => {
    switch (status?.toLowerCase()) {
      case "selected":
      case "accepted":
        return {
          bg: "#dcfce7",
          color: "#166534",
          icon: CheckCircle,
          label: "Accepted"
        }
      case "reviewed":
        return {
          bg: "#fef3c7",
          color: "#92400e",
          icon: Eye,
          label: "Under Review"
        }
      case "rejected":
        return {
          bg: "#fee2e2",
          color: "#991b1b",
          icon: XCircle,
          label: "Not Selected"
        }
      default:
        return {
          bg: "#fbf5e5",
          color: "#241C15",
          icon: Clock,
          label: "Submitted"
        }
    }
  }

  const handleLogout = async () => {
    await fetch("/api/freelancer/logout", {
      method: "POST",
      credentials: "include",
    })
    router.push("/get-hired/freelancer")
  }

  const exportApplications = () => {
    const csvData = filteredApplications.map(app => ({
      Job: app.forms?.form_name || "Untitled",
      Company: app.forms?.client_table?.company_name || "Unknown",
      Status: app.status || "Submitted",
      "Applied Date": new Date(app.created_at).toLocaleDateString(),
      "Profile Rating": app.profile_rating || "N/A"
    }))

    const headers = ["Job", "Company", "Status", "Applied Date", "Profile Rating"]
    const csvContent = [
      headers.join(","),
      ...csvData.map(row => Object.values(row).map(val => `"${val}"`).join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "my-applications.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (meLoading || submissionsLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center" style={{ backgroundColor: '#fbf5e5' }}>
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <Loader2 className="h-12 w-12 animate-spin" style={{ color: '#FFE01B' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <Briefcase className="h-6 w-6" style={{ color: '#241C15' }} />
            </div>
          </div>
          <p className="text-sm font-medium animate-pulse" style={{ color: '#241C15', opacity: 0.6 }}>
            Loading your applications...
          </p>
        </div>
      </div>
    )
  }

  const freelancer = meData?.freelancer

  const stats = {
    total: applications.length,
    accepted: applications.filter(a => ['selected', 'accepted'].includes(a.status?.toLowerCase())).length,
    reviewed: applications.filter(a => a.status?.toLowerCase() === 'reviewed').length,
    pending: applications.filter(a => !a.status || a.status?.toLowerCase() === 'submitted').length,
    rejected: applications.filter(a => a.status?.toLowerCase() === 'rejected').length
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fbf5e5' }}>
      {/* Professional Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50" style={{ borderBottom: '3px solid #FFE01B' }}>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between h-16 md:h-20 lg:h-24">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3 lg:space-x-4">
              <div className="flex items-center space-x-2 lg:space-x-3">
                <div
                  className="p-1.5 sm:p-2 rounded-lg transition-transform duration-200 hover:scale-110"
                  style={{ backgroundColor: '#FFE01B' }}
                >
                  <FileText className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
                </div>
                <div>
                  <h1 className="text-base sm:text-lg lg:text-xl font-bold">Applications</h1>
                  <p className="text-xs sm:text-sm hidden sm:block" style={{ color: '#241C15', opacity: 0.6 }}>
                    {freelancer?.name || freelancer?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
              <Link href="/get-hired/freelancer/dashboard">
                <Button
                  variant="ghost"
                  size="lg"
                  className="flex items-center space-x-2 transition-colors hover:bg-transparent text-sm xl:text-base"
                >
                  <Briefcase className="h-4 w-4 xl:h-5 xl:w-5" />
                  <span>Dashboard</span>
                </Button>
              </Link>
              <Link href="/get-hired/freelancer/jobs">
                <Button
                  variant="ghost"
                  size="lg"
                  className="flex items-center space-x-2 transition-colors hover:bg-transparent text-sm xl:text-base"
                  style={{ color: '#241C15' }}
                >
                  <Briefcase className="h-4 w-4 xl:h-5 xl:w-5" />
                  <span>Browse Jobs</span>
                </Button>
              </Link>
              <Link href="/get-hired/freelancer/profile">
                <Button
                  variant="ghost"
                  size="lg"
                  className="flex items-center space-x-2 transition-colors hover:bg-transparent text-sm xl:text-base"
                  style={{ color: '#241C15' }}
                >
                  <User className="h-4 w-4 xl:h-5 xl:w-5" />
                  <span>Profile</span>
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="lg"
                onClick={handleLogout}
                className="flex items-center space-x-2 transition-colors hover:bg-transparent text-sm xl:text-base"
                style={{ color: '#241C15' }}
              >
                <LogOut className="h-3 w-3 xl:h-4 xl:w-4" />
                <span>Logout</span>
              </Button>
            </div>

            {/* Tablet Navigation */}
            <div className="hidden md:flex lg:hidden items-center space-x-2">
              <Link href="/get-hired/freelancer/dashboard">
                <Button variant="ghost" size="sm" className="p-2">
                  <Briefcase className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/get-hired/freelancer/jobs">
                <Button variant="ghost" size="sm" className="p-2">
                  <Briefcase className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/get-hired/freelancer/profile">
                <Button variant="ghost" size="sm" className="p-2">
                  <User className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2"
                style={{ color: '#241C15' }}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t" style={{ borderColor: '#FFE01B' }}>
              <div className="flex flex-col space-y-3">
                <Link href="/get-hired/freelancer/dashboard">
                  <Button
                    variant="ghost"
                    className="w-full justify-start space-x-3 text-base"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Briefcase className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Button>
                </Link>
                {/* <Link href="/get-hired/freelancer/jobs">
                  <Button
                    variant="ghost"
                    className="w-full justify-start space-x-3 text-base"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Briefcase className="h-4 w-4" />
                    <span>Browse Jobs</span>
                  </Button>
                </Link> */}
                <Link href="/get-hired/freelancer/profile">
                  <Button
                    variant="ghost"
                    className="w-full justify-start space-x-3 text-base"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full justify-start space-x-3 text-base"
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    handleLogout()
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8 space-y-4 animate-slide-in-top">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 sm:p-3 rounded-lg" style={{ backgroundColor: '#FFE01B' }}>
                <FileText className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: '#241C15' }} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold" style={{ color: '#241C15' }}>
                  Your Applications
                </h1>
                <p className="text-sm sm:text-base mt-1 animate-fade-in" style={{ color: '#241C15', opacity: 0.6 }}>
                  Track and manage all your job applications in one place
                </p>
              </div>
            </div>
            
            {/* {filteredApplications.length > 0 && (
              <Button
                onClick={exportApplications}
                className="flex items-center space-x-2 font-semibold transition-all duration-200 hover:shadow-lg"
                style={{ backgroundColor: '#241C15', color: '#FFE01B' }}
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export CSV</span>
              </Button>
            )} */}
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-white rounded-lg border shadow-sm animate-slide-in-bottom" style={{ borderColor: '#FFE01B', animationDelay: '100ms' }}>
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: '#241C15', opacity: 0.5 }} />
              <Input
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 transition-all"
                style={{ borderColor: '#FFE01B', color: '#241C15' }}
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:ring-2 transition-all text-sm"
                style={{ borderColor: '#FFE01B', color: '#241C15' }}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Under Review</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:ring-2 transition-all text-sm"
                style={{ borderColor: '#FFE01B', color: '#241C15' }}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="rating">Highest Rating</option>
                <option value="name">Job Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card 
            className="bg-white border shadow-sm hover:shadow-md transition-all duration-200 animate-slide-in-bottom cursor-pointer group"
            style={{ borderColor: '#FFE01B', animationDelay: '200ms' }}
            onClick={() => setStatusFilter("all")}
          >
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-semibold mb-1" style={{ color: '#241C15', opacity: 0.6 }}>
                    Total
                  </p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold" style={{ color: '#241C15' }}>
                    {stats.total}
                  </p>
                </div>
                <div className="p-2 sm:p-3 rounded-lg group-hover:scale-110 transition-transform" style={{ backgroundColor: '#fbf5e5' }}>
                  <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" style={{ color: '#FFE01B' }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-white border shadow-sm hover:shadow-md transition-all duration-200 animate-slide-in-bottom cursor-pointer group"
            style={{ borderColor: '#10b981', animationDelay: '250ms' }}
            onClick={() => setStatusFilter("accepted")}
          >
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-semibold mb-1" style={{ color: '#166534' }}>
                    Accepted
                  </p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold" style={{ color: '#166534' }}>
                    {stats.accepted}
                  </p>
                </div>
                <div className="p-2 sm:p-3 rounded-lg group-hover:scale-110 transition-transform" style={{ backgroundColor: '#dcfce7' }}>
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" style={{ color: '#166534' }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-white border shadow-sm hover:shadow-md transition-all duration-200 animate-slide-in-bottom cursor-pointer group"
            style={{ borderColor: '#f59e0b', animationDelay: '300ms' }}
            onClick={() => setStatusFilter("reviewed")}
          >
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-semibold mb-1" style={{ color: '#92400e' }}>
                    Review
                  </p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold" style={{ color: '#92400e' }}>
                    {stats.reviewed}
                  </p>
                </div>
                <div className="p-2 sm:p-3 rounded-lg group-hover:scale-110 transition-transform" style={{ backgroundColor: '#fef3c7' }}>
                  <Eye className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" style={{ color: '#92400e' }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-white border shadow-sm hover:shadow-md transition-all duration-200 animate-slide-in-bottom cursor-pointer group"
            style={{ borderColor: '#FFE01B', animationDelay: '350ms' }}
            onClick={() => setStatusFilter("pending")}
          >
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-semibold mb-1" style={{ color: '#241C15', opacity: 0.6 }}>
                    Pending
                  </p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold" style={{ color: '#241C15' }}>
                    {stats.pending}
                  </p>
                </div>
                <div className="p-2 sm:p-3 rounded-lg group-hover:scale-110 transition-transform" style={{ backgroundColor: '#fbf5e5' }}>
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" style={{ color: '#FFE01B' }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-white border shadow-sm hover:shadow-md transition-all duration-200 animate-slide-in-bottom cursor-pointer group"
            style={{ borderColor: '#ef4444', animationDelay: '400ms' }}
            onClick={() => setStatusFilter("rejected")}
          >
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-semibold mb-1" style={{ color: '#991b1b' }}>
                    Rejected
                  </p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold" style={{ color: '#991b1b' }}>
                    {stats.rejected}
                  </p>
                </div>
                <div className="p-2 sm:p-3 rounded-lg group-hover:scale-110 transition-transform" style={{ backgroundColor: '#fee2e2' }}>
                  <XCircle className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" style={{ color: '#991b1b' }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications Grid */}
        {filteredApplications.length === 0 ? (
          <div className="text-center py-12 sm:py-16 lg:py-24">
            <div className="inline-flex p-4 sm:p-6 rounded-full mb-4 sm:mb-6" style={{ backgroundColor: '#FFE01B' }}>
              <FileText className="h-8 w-8 sm:h-12 sm:w-12 lg:h-16 lg:w-16" style={{ color: '#241C15' }} />
            </div>
            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold animate-fade-in" style={{ color: '#241C15' }}>
                {applications.length === 0 ? "No Applications Yet" : "No Applications Found"}
              </h2>
              <p className="text-sm sm:text-base max-w-md mx-auto animate-fade-in-delayed" style={{ color: '#241C15', opacity: 0.6 }}>
                {applications.length === 0 
                  ? "Start applying to jobs to see your submissions here." 
                  : "Try adjusting your search or filters to find what you're looking for."}
              </p>
            </div>
            <Button
              onClick={() => router.push("/get-hired/freelancer/jobs")}
              className="mt-6 font-semibold px-6 py-3 transition-all duration-200 hover:shadow-lg hover:scale-105"
              style={{ backgroundColor: '#FFE01B', color: '#241C15' }}
            >
              Browse Available Jobs
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredApplications.map((app, index) => {
              const statusConfig = getStatusConfig(app.status)
              const StatusIcon = statusConfig.icon
              
              return (
                <Card
                  key={app.id}
                  className="bg-white border-2 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group animate-fade-in-up cursor-pointer"
                  style={{ 
                    borderColor: '#FFE01B',
                    animationDelay: `${index * 50}ms`
                  }}
                  onClick={() => app.proposal_link && window.open(app.proposal_link, '_blank')}
                >
                  <CardHeader className="border-b pb-3 sm:pb-4" style={{ borderBottomColor: '#fbf5e5' }}>
                    <CardTitle className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base sm:text-lg leading-tight mb-2 transition-colors duration-200 group-hover:opacity-80 line-clamp-2" style={{ color: '#241C15' }}>
                          {app.forms?.form_name || "Untitled Job"}
                        </h3>
                        {app.forms?.client_table?.company_name && (
                          <div className="flex items-center space-x-2 text-xs sm:text-sm">
                            <Building2 className="h-3 w-3 flex-shrink-0" style={{ color: '#FFE01B' }} />
                            <span style={{ color: '#241C15', opacity: 0.7 }}>
                              {app.forms.client_table.company_name}
                            </span>
                          </div>
                        )}
                      </div>
                      <Badge
                        className="flex items-center space-x-1 px-2 py-1 whitespace-nowrap font-semibold text-xs transition-transform duration-200 group-hover:scale-105"
                        style={{ 
                          backgroundColor: statusConfig.bg,
                          color: statusConfig.color,
                          border: 'none'
                        }}
                      >
                        <StatusIcon className="h-3 w-3" />
                        <span className="hidden sm:inline">{statusConfig.label}</span>
                      </Badge>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pt-3 sm:pt-4 space-y-3 sm:space-y-4">
                    <p className="text-xs sm:text-sm line-clamp-2 leading-relaxed" style={{ color: '#241C15', opacity: 0.7 }}>
                      {app.forms?.form_description || "No description provided"}
                    </p>

                    <div className="space-y-2 text-xs sm:text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" style={{ color: '#FFE01B' }} />
                        <span style={{ color: '#241C15', opacity: 0.7 }}>
                          Applied {new Date(app.created_at).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>

                      {app.profile_rating && (
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" style={{ color: '#FFE01B' }} />
                          <span style={{ color: '#241C15', opacity: 0.7 }}>
                            Profile Rating: <strong style={{ color: '#241C15' }}>{app.profile_rating}/10</strong>
                          </span>
                        </div>
                      )}
                    </div>

                    {app.proposal_link && (
                      <div className="flex items-center justify-between pt-2 border-t" style={{ borderTopColor: '#fbf5e5' }}>
                        <span className="text-xs sm:text-sm font-semibold" style={{ color: '#241C15' }}>
                          View Proposal
                        </span>
                        <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1" style={{ color: '#FFE01B' }} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Results Count */}
        {filteredApplications.length > 0 && (
          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-sm sm:text-base" style={{ color: '#241C15', opacity: 0.6 }}>
              Showing {filteredApplications.length} of {applications.length} applications
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideInTop {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInBottom {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-in-top {
          animation: slideInTop 0.6s ease-out forwards;
        }

        .animate-slide-in-bottom {
          animation: slideInBottom 0.6s ease-out forwards;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out 0.3s forwards;
          opacity: 0;
        }

        .animate-fade-in-delayed {
          animation: fadeIn 0.8s ease-out 0.5s forwards;
          opacity: 0;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  )
}