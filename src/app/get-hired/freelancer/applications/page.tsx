"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import { Loader2, Briefcase, Calendar, FileText, ExternalLink, TrendingUp, Clock, CheckCircle, XCircle, Eye } from "lucide-react"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const fetcher = (url: string) => fetch(url, { credentials: "include" }).then(res => res.json())

export default function FreelancerApplications() {
  const { data: meData, isLoading: meLoading } = useSWR("/api/freelancer/me", fetcher)
  const { data: submissionsData, isLoading: submissionsLoading } = useSWR("/api/freelancer/submissions", fetcher)

  const [applications, setApplications] = useState<any[]>([])

  useEffect(() => {
    if (submissionsData?.submissions) {
      setApplications(submissionsData.submissions)
    }
  }, [submissionsData])

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

  if (!applications || applications.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#fbf5e5' }}>
        <div className="text-center space-y-6 max-w-md">
          <div className="inline-flex p-6 rounded-full animate-bounce" style={{ backgroundColor: '#FFE01B' }}>
            <FileText className="h-12 w-12" style={{ color: '#241C15' }} />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-bold animate-fade-in" style={{ color: '#241C15' }}>
              No Applications Yet
            </h2>
            <p className="text-base animate-fade-in-delayed" style={{ color: '#241C15', opacity: 0.6 }}>
              Start applying to jobs to see your submissions here.
            </p>
          </div>
          <Button
            className="mt-4 font-semibold px-6 py-3 transition-all duration-200 hover:shadow-lg hover:scale-105"
            style={{ backgroundColor: '#FFE01B', color: '#241C15' }}
          >
            Browse Available Jobs
          </Button>
        </div>
      </div>
    )
  }

  const stats = {
    total: applications.length,
    accepted: applications.filter(a => ['selected', 'accepted'].includes(a.status?.toLowerCase())).length,
    reviewed: applications.filter(a => a.status?.toLowerCase() === 'reviewed').length,
    pending: applications.filter(a => !a.status || a.status?.toLowerCase() === 'submitted').length
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fbf5e5' }}>
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-8">
        {/* Header Section with Animation */}
        <div className="mb-8 space-y-4 animate-slide-in-top">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-lg" style={{ backgroundColor: '#FFE01B' }}>
              <FileText className="h-6 w-6" style={{ color: '#241C15' }} />
            </div>
            <h1 className="text-4xl font-bold" style={{ color: '#241C15' }}>
              Your Applications
            </h1>
          </div>
          <p className="text-base animate-fade-in" style={{ color: '#241C15', opacity: 0.6 }}>
            Track and manage all your job applications in one place
          </p>
        </div>

        {/* Stats Cards with Staggered Animation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card 
            className="bg-white border shadow-sm hover:shadow-md transition-all duration-200 animate-slide-in-bottom"
            style={{ borderColor: '#FFE01B', animationDelay: '0ms' }}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ color: '#241C15', opacity: 0.6 }}>
                    Total
                  </p>
                  <p className="text-3xl font-bold" style={{ color: '#241C15' }}>
                    {stats.total}
                  </p>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: '#fbf5e5' }}>
                  <Briefcase className="h-6 w-6" style={{ color: '#FFE01B' }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-white border shadow-sm hover:shadow-md transition-all duration-200 animate-slide-in-bottom"
            style={{ borderColor: '#FFE01B', animationDelay: '100ms' }}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ color: '#166534' }}>
                    Accepted
                  </p>
                  <p className="text-3xl font-bold" style={{ color: '#166534' }}>
                    {stats.accepted}
                  </p>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: '#dcfce7' }}>
                  <CheckCircle className="h-6 w-6" style={{ color: '#166534' }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-white border shadow-sm hover:shadow-md transition-all duration-200 animate-slide-in-bottom"
            style={{ borderColor: '#FFE01B', animationDelay: '200ms' }}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ color: '#92400e' }}>
                    Under Review
                  </p>
                  <p className="text-3xl font-bold" style={{ color: '#92400e' }}>
                    {stats.reviewed}
                  </p>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: '#fef3c7' }}>
                  <Eye className="h-6 w-6" style={{ color: '#92400e' }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-white border shadow-sm hover:shadow-md transition-all duration-200 animate-slide-in-bottom"
            style={{ borderColor: '#FFE01B', animationDelay: '300ms' }}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ color: '#241C15', opacity: 0.6 }}>
                    Pending
                  </p>
                  <p className="text-3xl font-bold" style={{ color: '#241C15' }}>
                    {stats.pending}
                  </p>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: '#fbf5e5' }}>
                  <Clock className="h-6 w-6" style={{ color: '#FFE01B' }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {applications.map((app, index) => {
            const statusConfig = getStatusConfig(app.status)
            const StatusIcon = statusConfig.icon
            
            return (
              <Card
                key={app.id}
                className="bg-white border-2 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group animate-fade-in-up"
                style={{ 
                  borderColor: '#FFE01B',
                  animationDelay: `${index * 50}ms`
                }}
              >
                <CardHeader className="border-b pb-4" style={{ borderBottomColor: '#fbf5e5' }}>
                  <CardTitle className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg leading-tight mb-2 transition-colors duration-200 group-hover:opacity-80" style={{ color: '#241C15' }}>
                        {app.forms?.form_name || "Untitled Job"}
                      </h3>
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
                      <span>{statusConfig.label}</span>
                    </Badge>
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-4 space-y-4">
                  <p className="text-sm line-clamp-2 leading-relaxed" style={{ color: '#241C15', opacity: 0.7 }}>
                    {app.forms?.form_description || "No description provided"}
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 flex-shrink-0" style={{ color: '#FFE01B' }} />
                      <span style={{ color: '#241C15', opacity: 0.7 }}>
                        Applied on {new Date(app.created_at).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>

                    {app.profile_rating && (
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 flex-shrink-0" style={{ color: '#FFE01B' }} />
                        <span style={{ color: '#241C15', opacity: 0.7 }}>
                          Profile Rating: <strong style={{ color: '#241C15' }}>{app.profile_rating}/10</strong>
                        </span>
                      </div>
                    )}
                  </div>

                  {app.proposal_link && (
                    <a
                      href={app.proposal_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-sm font-semibold transition-all duration-200 hover:underline"
                      style={{ color: '#241C15' }}
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>View Proposal</span>
                    </a>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
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