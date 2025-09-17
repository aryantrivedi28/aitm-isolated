"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "../../../lib/SupabaseAuthClient"
import { CheckCircle, Clock, XCircle, User, Briefcase, Mail, Phone, Globe, Building, Factory  } from "lucide-react"

type Client = {
  id: string
  email?: string | null
  name?: string | null
  company_name?: string | null
  website?: string | null
  industry?: string | null
  phone?: string | null
  country?: string | null
  created_at?: string | null
}

type ClientRequest = {
  id: string
  full_name: string
  email: string
  phone: string
  company?: string | null
  services?: string[] | null
  requirement: string
  budget?: string | null
  timeline?: string | null
  notes?: string | null
  status?: string | null
  assigned_freelancer_id?: string | null
  created_at?: string | null
}

type HiringRequest = {
  id: string
  client_id: string
  role_type?: string | null
  job_title?: string | null
  description?: string | null
  budget_range?: string | null
  category?: string[] | null  // Fixed: changed from string to string[]
  subcategory?: string[] | null  // Fixed: changed from string to string[]
  tools?: string[] | null
  status?: string | null
  created_at?: string | null
}

// ✅ Date formatter
function formatDate(dateString?: string | null) {
  if (!dateString) return ""
  return new Date(dateString).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// ✅ Status badge with colors + icons
function StatusBadge({ status }: { status?: string | null }) {
  const s = status?.toLowerCase() || "pending"
  let classes = ""
  let Icon = Clock

  if (s === "approved" || s === "completed") {
    classes = "bg-green-100 text-green-700 border-green-300"
    Icon = CheckCircle
  } else if (s === "pending" || s === "in_review") {
    classes = "bg-yellow-100 text-yellow-700 border-yellow-300"
    Icon = Clock
  } else if (s === "rejected" || s === "cancelled") {
    classes = "bg-red-100 text-red-700 border-red-300"
    Icon = XCircle
  } else {
    classes = "bg-gray-100 text-gray-700 border-gray-300"
    Icon = Clock
  }

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${classes}`}>
      <Icon size={16} /> {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Pending"}
    </span>
  )
}

// ✅ RoleBadge component (was missing)
const RoleBadge = ({ roleType }: { roleType: string | null | undefined }) => {
  if (!roleType) return null;

  const roleConfig = {
    freelancer: { color: 'bg-orange-100 text-orange-800', label: 'Freelancer', icon: '👨‍💻' },
    intern: { color: 'bg-blue-100 text-blue-800', label: 'Intern', icon: '🎓' },
    fulltime: { color: 'bg-green-100 text-green-800', label: 'Full-time', icon: '💼' }
  };

  const config = roleConfig[roleType as keyof typeof roleConfig] || 
                { color: 'bg-gray-100 text-gray-800', label: roleType, icon: '👤' };

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${config.color}`}>
      <span>{config.icon}</span>
      {config.label}
    </span>
  );
};

// ✅ Array display component for better handling
const ArrayDisplay = ({ items, label, icon, maxItems = 3 }: { 
  items: any[] | null | undefined, 
  label: string, 
  icon: string,
  maxItems?: number 
}) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="flex items-start gap-2 mb-2">
      <span className="text-gray-500 mt-1">{icon}</span>
      <div className="flex flex-wrap gap-1">
        <span className="text-sm text-gray-600 font-medium">{label}:</span>
        {items.slice(0, maxItems).map((item, index) => (
          <span
            key={index}
            className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded"
          >
            {item}
          </span>
        ))}
        {items.length > maxItems && (
          <span className="text-sm text-gray-500">
            +{items.length - maxItems} more
          </span>
        )}
      </div>
    </div>
  );
};

export default function NotificationsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [clientRequests, setClientRequests] = useState<ClientRequest[]>([])
  const [hiringRequests, setHiringRequests] = useState<HiringRequest[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"clients" | "clientRequests" | "hiringRequests">("clients")

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [{ data: clientsData, error: cErr }, { data: crData, error: crErr }, { data: hrData, error: hrErr }] =
        await Promise.all([
          supabase.from("client_table").select("*").order("created_at", { ascending: false }).limit(50),
          supabase.from("client_requests").select("*").order("created_at", { ascending: false }).limit(50),
          supabase.from("hiring_requests").select("*").order("created_at", { ascending: false }).limit(50),
        ])

      if (cErr) throw cErr
      if (crErr) throw crErr
      if (hrErr) throw hrErr

      setClients(clientsData || [])
      setClientRequests(crData || [])
      setHiringRequests(hrData || [])
    } catch (e: any) {
      console.error("Error loading notifications:", e)
      setError(e?.message || "Failed to load notifications.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <main className="min-h-screen bg-[#1A1410] text-white pt-[50px] sm:pt-[80px] lg:pt-[100px]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-bold">Notifications</h1>
          <div className="flex gap-3">
            <Link
              href="/admin-panel"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition"
            >
              Back to Admin Panel
            </Link>
            <button
              onClick={loadData}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-[#FFE01B] text-black font-semibold hover:bg-[#FCD34D] disabled:opacity-50 transition"
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-10">
          {[
            { key: "clients", label: `Clients (${clients.length})`, icon: <User size={16} /> },
            { key: "clientRequests", label: `Client Requests (${clientRequests.length})`, icon: <Mail size={16} /> },
            { key: "hiringRequests", label: `Hiring Requests (${hiringRequests.length})`, icon: <Briefcase size={16} /> },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl font-medium transition ${activeTab === tab.key
                  ? "bg-[#FFE01B] text-black shadow-md"
                  : "bg-white/10 text-gray-200 hover:bg-white/20"
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-xl text-red-200">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFE01B] mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading notifications...</p>
          </div>
        )}

        {/* Section Content */}
        <div className="relative space-y-6">
          <AnimatePresence mode="wait">
            {/* Clients */}
            {activeTab === "clients" && !loading && (
              <motion.div
                key="clients"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                {clients.length === 0 ? (
                  <div className="text-center py-10">
                    <User size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-400 text-lg">No clients found</p>
                  </div>
                ) : (
                  clients.map((c) => (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white text-black rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="font-semibold text-lg">{c.name || "Unnamed Client"}</h3>
                            <StatusBadge status="active" />
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            {c.email && (
                              <div className="flex items-center gap-2 text-gray-700">
                                <Mail size={16} />
                                {c.email}
                              </div>
                            )}
                            {c.phone && (
                              <div className="flex items-center gap-2 text-gray-700">
                                <Phone size={16} />
                                {c.phone}
                              </div>
                            )}
                            {c.company_name && (
                              <div className="flex items-center gap-2 text-gray-700">
                                <Building size={16} />
                                {c.company_name}
                              </div>
                            )}
                            {c.industry && (
                              <div className="flex items-center gap-2 text-gray-700">
                                <Factory  size={16} />
                                {c.industry}
                              </div>
                            )}
                            {c.website && (
                              <div className="flex items-center gap-2 text-gray-700">
                                <Globe size={16} />
                                <a href={c.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                  {c.website}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <span className="text-sm text-gray-500">
                          Joined: {formatDate(c.created_at)}
                        </span>
                        <span className="text-xs text-gray-400">
                          ID: {c.id.slice(0, 8)}...
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}

            {/* Client Requests */}
            {activeTab === "clientRequests" && !loading && (
              <motion.div
                key="clientRequests"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                {clientRequests.length === 0 ? (
                  <div className="text-center py-10">
                    <Mail size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-400 text-lg">No client requests</p>
                  </div>
                ) : (
                  clientRequests.map((r) => (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white text-black rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{r.full_name}</h3>
                            <StatusBadge status={r.status} />
                          </div>
                          
                          <div className="space-y-2 text-sm mb-3">
                            <div className="flex items-center gap-2 text-gray-700">
                              <Mail size={16} />
                              {r.email}
                            </div>
                            {r.phone && (
                              <div className="flex items-center gap-2 text-gray-700">
                                <Phone size={16} />
                                {r.phone}
                              </div>
                            )}
                            {r.company && (
                              <div className="flex items-center gap-2 text-gray-700">
                                <Building size={16} />
                                {r.company}
                              </div>
                            )}
                          </div>

                          <p className="text-gray-700 mb-3">
                            <strong>Requirement:</strong> {r.requirement}
                          </p>

                          <div className="flex flex-wrap gap-4 text-sm">
                            {r.budget && (
                              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded">
                                💰 Budget: {r.budget}
                              </span>
                            )}
                            {r.timeline && (
                              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded">
                                ⏰ Timeline: {r.timeline}
                              </span>
                            )}
                          </div>

                          {r.services && r.services.length > 0 && (
                            <ArrayDisplay items={r.services} label="Services" icon="🎯" />
                          )}
                          
                          {r.notes && (
                            <div className="mt-3 p-3 bg-gray-50 rounded">
                              <strong>Notes:</strong> {r.notes}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <span className="text-sm text-gray-500">
                          Submitted: {formatDate(r.created_at)}
                        </span>
                        <div className="flex gap-2">
                          <button className="text-xs text-blue-600 hover:text-blue-800 font-medium px-3 py-1 hover:bg-blue-50 rounded">
                            View Details
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}

            {/* Hiring Requests */}
            {activeTab === "hiringRequests" && !loading && (
              <motion.div
                key="hiringRequests"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                {hiringRequests.length === 0 ? (
                  <div className="text-center py-10">
                    <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-400 text-lg">No hiring requests</p>
                  </div>
                ) : (
                  hiringRequests.map((h) => (
                    <motion.div
                      key={h.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg text-gray-900">
                              {h.job_title || "Untitled Position"}
                            </h3>
                            <RoleBadge roleType={h.role_type} />
                            <StatusBadge status={h.status} />
                          </div>

                          <p className="text-gray-600 text-sm mb-3">
                            {h.description || "No description provided"}
                          </p>

                          {h.budget_range && (
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-gray-500">💰</span>
                              <span className="text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                                Budget: {h.budget_range}
                              </span>
                            </div>
                          )}

                          {/* Fixed array handling */}
                          {h.category && h.category.length > 0 && (
                            <ArrayDisplay items={h.category} label="Categories" icon="🏷️" />
                          )}
                          
                          {h.subcategory && h.subcategory.length > 0 && (
                            <ArrayDisplay items={h.subcategory} label="Subcategories" icon="📂" />
                          )}
                          
                          {h.tools && h.tools.length > 0 && (
                            <ArrayDisplay items={h.tools} label="Tools" icon="🛠️" />
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <div className="text-xs text-gray-500">
                          Created: {formatDate(h.created_at)}
                        </div>
                        
                        <div className="flex gap-2">
                          <button className="text-xs text-blue-600 hover:text-blue-800 font-medium px-3 py-1 hover:bg-blue-50 rounded">
                            View Details
                          </button>
                          <button className="text-xs text-gray-600 hover:text-gray-800 font-medium px-3 py-1 hover:bg-gray-100 rounded">
                            Edit
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  )
}