"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Briefcase,
  User,
  LogOut,
  FileText,
  Clock,
  CheckCircle,
  TrendingUp,
  MapPin,
  DollarSign,
  Calendar,
  Building2,
  ArrowRight,
  Menu,
  X,
} from "lucide-react"

const fetcher = (url: string) => fetch(url, { credentials: "include" }).then((res) => res.json())

export default function FreelancerDashboardPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const { data: meData, isLoading: meLoading } = useSWR("/api/freelancer/me", fetcher)
  const { data: submissionsData, isLoading: submissionsLoading } = useSWR("/api/freelancer/submissions", fetcher)
  const { data: formsData, isLoading: formsLoading } = useSWR("/api/freelancer/available-forms", fetcher)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  const freelancer = meData?.freelancer
  const submissions = submissionsData?.submissions || []
  const availableForms = formsData?.forms || []

  console.log("form data available:", availableForms)

  const stats = {
    totalApplications: submissions.length,
    pendingReview: submissions.filter((s: any) => s.status === "new").length,
    accepted: submissions.filter((s: any) => s.status === "accepted").length,
    availableOpportunities: availableForms.length,
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleLogout = async () => {
    await fetch("/api/freelancer/logout", {
      method: "POST",
      credentials: "include",
    })
    router.push("/get-hired/freelancer")
  }

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

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#faf4e5" }}>
      {/* Professional Header - Fully Responsive */}
      <header className="bg-[#f0eadd]" style={{ borderBottom: "2px solid #f7af00" }}>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between h-16 md:h-20 lg:h-24">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3 lg:space-x-4">
              <div className="flex items-center space-x-2 lg:space-x-3">
                <div
                  className="p-2 rounded-lg transition-all duration-200"
                  style={{ backgroundColor: "#f7af00" }}
                >
                  <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 xl:h-8 xl:w-8" style={{ color: "#050504" }} />
                </div>
                <div>
                  <h1 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold" style={{ color: "#050504" }}>
                    Freelancer Dashboard
                  </h1>
                  <p className="text-xs sm:text-sm lg:text-base hidden sm:block" style={{ color: "#31302f" }}>
                    {freelancer?.name || freelancer?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop Navigation - Show on lg screens and up */}
            <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
              <Link href="/get-hired/freelancer/applications">
                <Button
                  variant="ghost"
                  size="lg"
                  className="flex items-center space-x-2 transition-all hover:bg-f0eadd rounded-lg text-sm xl:text-base"
                  style={{ color: "#31302f" }}
                  onMouseEnter={handleButtonHover}
                  onMouseLeave={handleButtonLeave}
                >
                  <FileText className="h-4 w-4 xl:h-5 xl:w-5" style={{ color: "#31302f" }} />
                  <span>Applications</span>
                </Button>
              </Link>
              <Link href="/get-hired/freelancer/profile">
                <Button
                  variant="ghost"
                  size="lg"
                  className="flex items-center space-x-2 transition-all hover:bg-f0eadd rounded-lg text-sm xl:text-base"
                  style={{ color: "#31302f" }}
                  onMouseEnter={handleButtonHover}
                  onMouseLeave={handleButtonLeave}
                >
                  <User className="h-4 w-4 xl:h-5 xl:w-5" style={{ color: "#31302f" }} />
                  <span>Profile</span>
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="lg"
                onClick={handleLogout}
                className="flex items-center space-x-2 transition-all hover:bg-faf4e5 rounded-lg text-sm xl:text-base"
                style={{ color: "#31302f" }}
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonLeave}
              >
                <LogOut className="h-3 w-3 xl:h-4 xl:w-4" style={{ color: "#31302f" }} />
                <span>Logout</span>
              </Button>
            </div>

            {/* Tablet Navigation - Show on md screens, hide on lg and up */}
            <div className="hidden md:flex lg:hidden items-center space-x-2">
              <Link href="/get-hired/freelancer/applications">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1 transition-all hover:bg-faf4e5 rounded-lg p-2"
                  style={{ color: "#31302f" }}
                  onMouseEnter={handleButtonHover}
                  onMouseLeave={handleButtonLeave}
                >
                  <FileText className="h-4 w-4" style={{ color: "#31302f" }} />
                </Button>
              </Link>
              <Link href="/get-hired/freelancer/profile">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1 transition-all hover:bg-faf4e5 rounded-lg p-2"
                  style={{ color: "#31302f" }}
                  onMouseEnter={handleButtonHover}
                  onMouseLeave={handleButtonLeave}
                >
                  <User className="h-4 w-4" style={{ color: "#31302f" }} />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-1 transition-all hover:bg-faf4e5 rounded-lg p-2"
                style={{ color: "#31302f" }}
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonLeave}
              >
                <LogOut className="h-4 w-4" style={{ color: "#31302f" }} />
              </Button>
            </div>

            {/* Mobile Menu Button - Show on small screens only */}
            <div className="flex md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg"
                style={{ color: "#31302f" }}
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonLeave}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation - Show on small screens only */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t" style={{ borderColor: "#f7af00" }}>
              <div className="flex flex-col space-y-3">
                <Link href="/get-hired/freelancer/applications">
                  <Button
                    variant="ghost"
                    className="w-full justify-start space-x-3 text-base rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{ color: "#31302f" }}
                    onMouseEnter={handleButtonHover}
                    onMouseLeave={handleButtonLeave}
                  >
                    <FileText className="h-4 w-4" style={{ color: "#31302f" }} />
                    <span>Applications</span>
                  </Button>
                </Link>
                <Link href="/get-hired/freelancer/profile">
                  <Button
                    variant="ghost"
                    className="w-full justify-start space-x-3 text-base rounded-lg"
                    style={{ color: "#31302f" }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    onMouseEnter={handleButtonHover}
                    onMouseLeave={handleButtonLeave}
                  >
                    <User className="h-4 w-4" style={{ color: "#31302f" }} />
                    <span>Profile</span>
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full justify-start space-x-3 text-base rounded-lg"
                  style={{ color: "#31302f" }}
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    handleLogout()
                  }}
                  onMouseEnter={handleButtonHover}
                  onMouseLeave={handleButtonLeave}
                >
                  <LogOut className="h-4 w-4" style={{ color: "#31302f" }} />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content - Responsive Layout */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8">
        {/* Stats Grid - Responsive */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-6 sm:mb-8">
          <Card
            className="border shadow-sm rounded-xl hover:shadow-md transition-shadow duration-200"
            style={{ backgroundColor: "#faf4e5", borderColor: "#241C15" }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium" style={{ color: "#31302f" }}>Total Applications</CardTitle>
              <div className="p-1.5 sm:p-2 rounded-md" style={{ backgroundColor: "#f7af00" }}>
                <FileText className="h-3 w-3 sm:h-4 sm:w-4" style={{ color: "#050504" }} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1" style={{ color: "#050504" }}>{stats.totalApplications}</div>
              <p className="text-xs" style={{ color: "#31302f" }}>All-time submissions</p>
            </CardContent>
          </Card>

          <Card
            className="border shadow-sm rounded-xl hover:shadow-md transition-shadow duration-200"
            style={{ backgroundColor: "#faf4e5", borderColor: "#241C15" }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium" style={{ color: "#31302f" }}>Pending Review</CardTitle>
              <div className="p-1.5 sm:p-2 rounded-md" style={{ backgroundColor: "#f7af00" }}>
                <Clock className="h-3 w-3 sm:h-4 sm:w-4" style={{ color: "#050504" }} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1" style={{ color: "#050504" }}>{stats.pendingReview}</div>
              <p className="text-xs" style={{ color: "#31302f" }}>Awaiting decision</p>
            </CardContent>
          </Card>

          <Card
            className="border shadow-sm rounded-xl hover:shadow-md transition-shadow duration-200"
            style={{ backgroundColor: "#faf4e5", borderColor: "#241C15" }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium" style={{ color: "#31302f" }}>Accepted</CardTitle>
              <div className="p-1.5 sm:p-2 rounded-md" style={{ backgroundColor: "#f7af00" }}>
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" style={{ color: "#050504" }} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1" style={{ color: "#050504" }}>{stats.accepted}</div>
              <p className="text-xs" style={{ color: "#31302f" }}>Successful applications</p>
            </CardContent>
          </Card>

          <Card
            className="border shadow-sm rounded-xl hover:shadow-md transition-shadow duration-200"
            style={{ backgroundColor: "#faf4e5", borderColor: "#241C15" }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium" style={{ color: "#31302f" }}>Open Opportunities</CardTitle>
              <div className="p-1.5 sm:p-2 rounded-md" style={{ backgroundColor: "#f7af00" }}>
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" style={{ color: "#050504" }} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1" style={{ color: "#050504" }}>{stats.availableOpportunities}</div>
              <p className="text-xs" style={{ color: "#31302f" }}>Available positions</p>
            </CardContent>
          </Card>
        </div>

        {/* Available Opportunities - Responsive Layout */}
        <Card className="border shadow-sm rounded-xl" style={{ backgroundColor: "#faf4e5", borderColor: "#241C15" }}>
          <CardHeader className="border-b pb-4" style={{ borderBottomColor: "#f7af00" }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1">
                <CardTitle className="text-base sm:text-lg lg:text-xl font-bold flex items-center space-x-2" style={{ color: "#050504" }}>
                  <Briefcase className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: "#f7af00" }} />
                  <span>Available Opportunities</span>
                </CardTitle>
                <CardDescription className="mt-1 text-xs sm:text-sm lg:text-base" style={{ color: "#31302f" }}>
                  Browse and apply to opportunities that match your skills
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                className="text-xs sm:text-sm font-medium px-3 py-1 border rounded-full w-fit"
                style={{ borderColor: "#f7af00", color: "#241C15", backgroundColor: "#f0eadd" }}
              >
                {availableForms.length} positions
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-5 lg:p-6">
            <div className="space-y-4">
              {formsLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="p-4 sm:p-5 border rounded-lg animate-pulse"
                    style={{ borderColor: "#241C15", backgroundColor: "#faf4e5" }}
                  >
                    <div className="flex space-x-3 sm:space-x-4">
                      <Skeleton className="h-12 w-12 sm:h-14 sm:w-14 rounded-lg" style={{ backgroundColor: "#f0eadd" }} />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-5 w-2/3" style={{ backgroundColor: "#f0eadd" }} />
                        <Skeleton className="h-4 w-1/2" style={{ backgroundColor: "#f0eadd" }} />
                        <Skeleton className="h-4 w-3/4" style={{ backgroundColor: "#f0eadd" }} />
                      </div>
                    </div>
                  </div>
                ))
              ) : availableForms.length === 0 ? (
                <div className="text-center py-8 sm:py-12 lg:py-16">
                  <div className="inline-flex p-3 sm:p-4 rounded-full mb-4" style={{ backgroundColor: "#f0eadd" }}>
                    <Briefcase className="h-6 w-6 sm:h-8 sm:w-8 lg:h-12 lg:w-12" style={{ color: "#f7af00" }} />
                  </div>
                  <h3 className="text-sm sm:text-base lg:text-lg font-medium mb-2" style={{ color: "#050504" }}>
                    No opportunities available
                  </h3>
                  <p className="text-xs sm:text-sm max-w-md mx-auto" style={{ color: "#31302f" }}>
                    Check back later for new job opportunities that match your profile.
                  </p>
                </div>
              ) : (
                availableForms.map((form: any) => (
                  <Card
                    key={form.id}
                    className="border hover:shadow-md transition-all duration-200 group rounded-xl"
                    style={{ backgroundColor: "#faf4e5", borderColor: "#241C15" }}
                  >
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        <div className="flex gap-3 sm:gap-4 flex-1">
                          {/* Company Logo */}
                          <div
                            className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: "#f7af00" }}
                          >
                            <Building2 className="h-4 w-4 sm:h-5 sm:w-5 lg:h-7 lg:w-7" style={{ color: "#050504" }} />
                          </div>

                          {/* Job Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                              <h3 className="font-bold text-sm sm:text-base lg:text-lg leading-tight" style={{ color: "#050504" }}>
                                {form.form_name}
                              </h3>
                              <Badge 
                                variant="secondary" 
                                className="text-xs font-medium px-2 py-1 w-fit mt-1 sm:mt-0 rounded-full"
                                style={{ backgroundColor: "#f0eadd", color: "#241C15" }}
                              >
                                {form.category}
                              </Badge>
                            </div>
                            <p className="text-xs sm:text-sm leading-relaxed mb-2 line-clamp-2" style={{ color: "#31302f" }}>
                              {form.form_description}
                            </p>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                              <p className="text-xs sm:text-sm font-medium" style={{ color: "#050504" }}>
                                {form.client_table?.company_name}
                              </p>
                              <p className="text-xs sm:text-sm" style={{ color: "#31302f" }}>
                                {form.client_table?.industry}
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm mb-3">
                              <div className="flex items-center gap-1" style={{ color: "#31302f" }}>
                                <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5" style={{ color: "#31302f" }} />
                                <span>{form.location || "Remote"}</span>
                              </div>
                              {form.budget && (
                                <div className="flex items-center gap-1" style={{ color: "#31302f" }}>
                                  <DollarSign className="h-3 w-3 sm:h-3.5 sm:w-3.5" style={{ color: "#31302f" }} />
                                  <span>{form.budget}</span>
                                </div>
                              )}
                              {form.deadline && (
                                <div className="flex items-center gap-1" style={{ color: "#31302f" }}>
                                  <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" style={{ color: "#31302f" }} />
                                  <span>Due {formatDate(form.deadline)}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1" style={{ color: "#31302f" }}>
                                <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" style={{ color: "#31302f" }} />
                                <span>Posted {formatDate(form.created_at)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Apply Button */}
                        <Link href={`/form/${form.id}`} className="flex-shrink-0 self-start lg:self-center">
                          <Button
                            size="sm"
                            className="font-medium transition-all duration-200 hover:shadow-md group-hover:translate-x-1 flex items-center gap-2 w-full lg:w-auto text-xs sm:text-sm rounded-lg"
                            style={{
                              backgroundColor: "#f7af00",
                              color: "#050504",
                              boxShadow: "0 2px 6px rgba(36, 28, 21, 0.05)"
                            }}
                            onMouseEnter={handleButtonHover}
                            onMouseLeave={handleButtonLeave}
                          >
                            Apply Now
                            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}