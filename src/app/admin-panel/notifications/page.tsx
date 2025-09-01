"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "../../../lib/SupabaseAuthClient"
import { CheckCircle, Clock, XCircle } from "lucide-react" // Status icons

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
  category?: string | null
  subcategory?: string | null
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

  if (s === "approved") {
    classes = "bg-green-100 text-green-700 border-green-300"
    Icon = CheckCircle
  } else if (s === "pending") {
    classes = "bg-yellow-100 text-yellow-700 border-yellow-300"
    Icon = Clock
  } else if (s === "rejected") {
    classes = "bg-red-100 text-red-700 border-red-300"
    Icon = XCircle
  } else {
    classes = "bg-gray-100 text-gray-700 border-gray-300"
    Icon = Clock
  }

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${classes}`}>
      <Icon size={16} /> {status || "Pending"}
    </span>
  )
}

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
      console.log("[v0] notifications load error:", e?.message)
      setError(e?.message || "Failed to load notifications.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <main className="min-h-screen bg-[#1A1410] text-white">
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
              className="px-4 py-2 rounded-xl bg-[#FFE01B] text-black font-semibold hover:bg-[#FCD34D] transition"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-10">
          {[
            { key: "clients", label: "Clients" },
            { key: "clientRequests", label: "Client Requests" },
            { key: "hiringRequests", label: "Hiring Requests" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-6 py-2 rounded-xl font-medium transition ${
                activeTab === tab.key
                  ? "bg-[#FFE01B] text-black shadow-md"
                  : "bg-white/10 text-gray-200 hover:bg-white/20"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {error && <div className="mb-6 text-red-400">{error}</div>}

        {/* Section Content */}
        <div className="relative space-y-6">
          <AnimatePresence mode="wait">
            {/* Clients */}
            {activeTab === "clients" && (
              <motion.div
                key="clients"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                {clients.length === 0 && <p className="text-gray-400">No recent clients.</p>}
                {clients.map((c) => (
                  <div
                    key={c.id}
                    className="bg-white text-black rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-lg">{c.name || "Unnamed"}</p>
                        <p className="text-sm text-gray-700">{c.email}</p>
                        <p className="text-sm text-gray-600 mt-1">{c.company_name || "—"} • {c.industry || "—"}</p>
                      </div>
                      <StatusBadge status={"approved"} />
                    </div>
                    <p className="text-base font-medium text-gray-700 mt-3">{formatDate(c.created_at)}</p>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Client Requests */}
            {activeTab === "clientRequests" && (
              <motion.div
                key="clientRequests"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                {clientRequests.length === 0 && <p className="text-gray-400">No recent requests.</p>}
                {clientRequests.map((r) => (
                  <div
                    key={r.id}
                    className="bg-white text-black rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-lg">{r.full_name}</p>
                        <p className="text-sm text-gray-700">{r.email}</p>
                        <p className="text-sm text-gray-700 mt-1">{r.requirement}</p>
                      </div>
                      <StatusBadge status={r.status} />
                    </div>
                    <p className="text-base font-medium text-gray-700 mt-3">{formatDate(r.created_at)}</p>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Hiring Requests */}
            {activeTab === "hiringRequests" && (
              <motion.div
                key="hiringRequests"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                {hiringRequests.length === 0 && <p className="text-gray-400">No recent hiring requests.</p>}
                {hiringRequests.map((h) => (
                  <div
                    key={h.id}
                    className="bg-white text-black rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-lg">{h.job_title || "Untitled role"}</p>
                        <p className="text-sm text-gray-700">{h.role_type || "Role"}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {h.category || "—"} {h.subcategory ? `• ${h.subcategory}` : ""}{" "}
                          {h.tools?.length ? `• ${h.tools.join(", ")}` : ""}
                        </p>
                      </div>
                      <StatusBadge status={h.status} />
                    </div>
                    <p className="text-base font-medium text-gray-700 mt-3">{formatDate(h.created_at)}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  )
}
