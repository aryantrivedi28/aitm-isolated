"use client"

import { useState, useEffect } from "react"
import { motion, type Variants } from "framer-motion"
import {
  Search,
  Download,
  Users,
  Filter,
  Database,
  FileText,
  Eye,
  Mail,
  Phone,
  Linkedin,
  ExternalLink,
  FileDown,
  Calendar,
} from "lucide-react"
import { supabase } from "@/src/lib/SupabaseAuthClient"

// Animation variants
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
}

const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
}

type Freelancer = {
  id: string
  created_at: string
  full_name: string
  email: string
  phone: string
  resume_url?: string
  linkedin_url?: string
  portfolio_url?: string
  category: string
  category_other?: string
  domains: string[]
  domains_other?: string
  tech_stack: string[]
  tech_other?: string
  tools: string[]
  tools_other?: string
  employment_status?: string
  employment_other?: string
  experience_level?: string
  experience_other?: string
  updated_at: string
  [key: string]: any
}

type SearchFilters = {
  category: string
  experience_level: string
  search_text: string
}

export default function AdminQueryPanel() {
  const [mounted, setMounted] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    category: "",
    experience_level: "",
    search_text: "",
  })
  const [freelancers, setFreelancers] = useState<Freelancer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      loadAllFreelancers()
    }
  }, [mounted])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#241C15] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#FFE01B] border-t-transparent rounded-full"
        />
      </div>
    )
  }

  // Available options for dropdowns
  const categoryOptions = [
    "",
    "Developers",
    "Design",
    "Marketing",
    "Video Editing",
    "AI",
    "Content Writing",
    "Data Science",
    "Mobile Development",
    "DevOps",
    "UI/UX Design",
    "Other",
  ]

  const experienceLevelOptions = [
    "",
    "Less than 1 Year of Experience",
    "1-3 Years of Experience",
    "3-5 Years of Experience",
    "5+ Years of Experience",
    "Fresher",
  ]

  const handleSearch = async () => {
    if (typeof window === "undefined") return // Prevent server-side execution

    setLoading(true)
    setError(null)

    try {
      // Use the correct table name with hyphen
      if (!supabase) {
        setError("Database client is not initialized.")
        setFreelancers([])
        setLoading(false)
        return
      }
      let query = supabase.from("all-freelancer").select("*")

      // Apply filters based on form inputs
      if (filters.category) {
        query = query.eq("category", filters.category)
      }

      if (filters.experience_level) {
        query = query.eq("experience_level", filters.experience_level)
      }

      // Text search across name and email
      if (filters.search_text.trim()) {
        query = query.or(`full_name.ilike.%${filters.search_text}%,email.ilike.%${filters.search_text}%`)
      }

      const { data, error } = await query.limit(100).order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching freelancers:", error)
        setError("Error fetching data from database: " + error.message)
        setFreelancers([])
      } else {
        if (data && data.length > 0) {
          setFreelancers(data)
        } else {
          setFreelancers([])
          setError("No freelancers found matching your criteria")
        }
      }
    } catch (err: any) {
      console.error("Unexpected error:", err)
      setError("Unexpected error occurred: " + (err.message || "Unknown error"))
      setFreelancers([])
    } finally {
      setLoading(false)
    }
  }

  const loadAllFreelancers = async () => {
    if (typeof window === "undefined") return // Prevent server-side execution

    setLoading(true)
    setError(null)
    try {
      // Use the correct table name with hyphen
      if (!supabase) {
        setError("Database client is not initialized.")
        setFreelancers([])
        setLoading(false)
        return
      }
      const { data, error } = await supabase
        .from("all-freelancer")
        .select("*")
        .limit(100)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error loading freelancers:", error)
        setError("Error loading freelancers: " + error.message)
        setFreelancers([])
      } else {
        if (data && data.length > 0) {
          setFreelancers(data)
        } else {
          setFreelancers([])
          setError("No freelancers found in the database")
        }
      }
    } catch (err: any) {
      console.error("Unexpected error:", err)
      setError("Unexpected error occurred: " + (err.message || "Unknown error"))
      setFreelancers([])
    } finally {
      setLoading(false)
    }
  }

  const resetFilters = () => {
    setFilters({
      category: "",
      experience_level: "",
      search_text: "",
    })
    loadAllFreelancers()
  }

  const downloadCSV = () => {
    if (freelancers.length === 0) return alert("No data to download.")
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Category",
      "Employment Status",
      "Experience Level",
      "Domains",
      "Tech Stack",
      "Tools",
      "Portfolio",
      "LinkedIn",
      "Resume",
      "Created At",
    ]
    const rows = [headers.join(",")]
    freelancers.forEach((f) => {
      const row = [
        `"${f.full_name || ""}"`,
        `"${f.email || ""}"`,
        `"${f.phone || ""}"`,
        `"${f.category || ""}"`,
        `"${f.employment_status || ""}"`,
        `"${f.experience_level || ""}"`,
        `"${Array.isArray(f.domains) ? f.domains.join(", ") : ""}"`,
        `"${Array.isArray(f.tech_stack) ? f.tech_stack.join(", ") : ""}"`,
        `"${Array.isArray(f.tools) ? f.tools.join(", ") : ""}"`,
        `"${f.portfolio_url || ""}"`,
        `"${f.linkedin_url || ""}"`,
        `"${f.resume_url || ""}"`,
        `"${new Date(f.created_at).toLocaleDateString()}"`,
      ]
      rows.push(row.join(","))
    })
    const blob = new Blob([rows.join("\n")], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "freelancers.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "student":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/30"
      case "fresher":
        return "bg-green-500/20 text-green-400 border border-green-500/30"
      case "full time":
        return "bg-purple-500/20 text-purple-400 border border-purple-500/30"
      case "part time":
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border border-gray-500/30"
    }
  }

  const getExperienceColor = (level: string) => {
    if (!level) return "bg-gray-500/20 text-gray-400"

    if (level.includes("Less than 1")) {
      return "bg-blue-500/20 text-blue-400"
    } else if (level.includes("1-2")) {
      return "bg-yellow-500/20 text-yellow-400"
    } else if (level.includes("3-5")) {
      return "bg-orange-500/20 text-orange-400"
    } else if (level.includes("5+")) {
      return "bg-green-500/20 text-green-400"
    } else if (level.toLowerCase().includes("fresher")) {
      return "bg-purple-500/20 text-purple-400"
    } else {
      return "bg-gray-500/20 text-gray-400"
    }
  }

  return (
    <div className="min-h-screen bg-[#241C15] text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
            scale: { duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-[#FFE01B] opacity-5 rounded-full"
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
            scale: { duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
          }}
          className="absolute top-1/2 -left-40 w-64 h-64 bg-[#FFE01B] opacity-3 rounded-full"
        />
        <motion.div
          animate={{
            rotate: 180,
            scale: [1, 1.3, 1],
          }}
          transition={{
            rotate: { duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
            scale: { duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
          }}
          className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#FFE01B] opacity-4 rounded-full"
        />
      </div>

      {/* Header Section */}
      <section className="relative py-20 px-4 z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#241C15] via-[#2a1f16] to-[#241C15]" />

        <motion.div
          className="relative max-w-6xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <div className="text-center space-y-8">
            <motion.div
              className="flex items-center justify-center gap-3 mb-6"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <motion.div
                className="w-12 h-12 bg-[#FFE01B]/20 rounded-xl flex items-center justify-center border border-[#FFE01B]/30"
                whileHover={{ scale: 1.1, rotate: 10 }}
              >
                <Database className="w-6 h-6 text-[#FFE01B]" />
              </motion.div>
              <span className="text-[#FFE01B] font-semibold text-lg">Admin Panel</span>
            </motion.div>

            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-5xl lg:text-7xl font-bold leading-tight"
            >
              <span className="bg-gradient-to-r from-white to-[#FFE01B] bg-clip-text text-transparent">
                Freelancer Database
              </span>
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              Search and filter freelancer profiles by category and experience level
            </motion.p>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto mt-12"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                initial="hidden"
                animate="visible"
                variants={scaleIn}
              >
                <div className="flex items-center justify-center mb-3">
                  <Users className="w-8 h-8 text-[#FFE01B]" />
                </div>
                <h3 className="text-2xl font-bold text-white">{freelancers.length}</h3>
                <p className="text-gray-400 text-sm">Total Freelancers</p>
              </motion.div>

              <motion.div
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                initial="hidden"
                animate="visible"
                variants={scaleIn}
              >
                <div className="flex items-center justify-center mb-3">
                  <Filter className="w-8 h-8 text-[#FFE01B]" />
                </div>
                <h3 className="text-2xl font-bold text-white">Simple</h3>
                <p className="text-gray-400 text-sm">Filtering</p>
              </motion.div>

              <motion.div
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                initial="hidden"
                animate="visible"
                variants={scaleIn}
              >
                <div className="flex items-center justify-center mb-3">
                  <Database className="w-8 h-8 text-[#FFE01B]" />
                </div>
                <h3 className="text-2xl font-bold text-white">Real-time</h3>
                <p className="text-gray-400 text-sm">Database</p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Search Form Section */}
      <section className="relative py-12 px-4 z-10">
        <motion.div
          className="max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
            <motion.div className="space-y-8" initial="hidden" animate="visible" variants={fadeInLeft}>
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  className="w-10 h-10 bg-[#FFE01B]/20 rounded-xl flex items-center justify-center border border-[#FFE01B]/30"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Filter className="w-5 h-5 text-[#FFE01B]" />
                </motion.div>
                <h2 className="text-2xl font-bold text-white">Search Filters</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Category */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-[#FFE01B]">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFE01B] transition-colors duration-300"
                  >
                    <option value="">All Categories</option>
                    {categoryOptions.slice(1).map((category) => (
                      <option key={category} value={category} className="bg-[#241C15]">
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Experience Level */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-[#FFE01B]">Experience Level</label>
                  <select
                    value={filters.experience_level}
                    onChange={(e) => setFilters((prev) => ({ ...prev, experience_level: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFE01B] transition-colors duration-300"
                  >
                    <option value="">All Levels</option>
                    {experienceLevelOptions.slice(1).map((level) => (
                      <option key={level} value={level} className="bg-[#241C15]">
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/10">
                <motion.button
                  onClick={handleSearch}
                  disabled={loading}
                  className="flex-1 bg-[#FFE01B] hover:bg-yellow-300 text-[#241C15] font-bold py-4 px-8 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="w-5 h-5 border-2 border-[#241C15] border-t-transparent rounded-full"
                      />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Search Freelancers
                    </>
                  )}
                </motion.button>

                <motion.button
                  onClick={resetFilters}
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 border border-white/20 hover:border-white/40"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Reset Filters
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Error Message */}
      {error && (
        <section className="relative py-6 px-4 z-10">
          <motion.div
            className="max-w-6xl mx-auto bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-red-300">{error}</p>
          </motion.div>
        </section>
      )}

      {/* Results Section */}
      {freelancers.length > 0 && (
        <section className="relative py-12 px-4 z-10">
          <motion.div
            className="max-w-7xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            {/* Results Header */}
            <motion.div
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <div className="flex items-center gap-3 mb-4 sm:mb-0">
                <motion.div
                  className="w-10 h-10 bg-[#FFE01B]/20 rounded-xl flex items-center justify-center border border-[#FFE01B]/30"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                >
                  <Eye className="w-5 h-5 text-[#FFE01B]" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Search Results</h2>
                  <p className="text-gray-400">Found {freelancers.length} matching freelancers</p>
                </div>
              </div>

              <motion.button
                onClick={downloadCSV}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-5 h-5" />
                Download CSV
              </motion.button>
            </motion.div>

            {/* Freelancer Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {freelancers.map((freelancer, index) => (
                <motion.div
                  key={freelancer.id}
                  initial="hidden"
                  animate="visible"
                  variants={scaleIn}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10 hover:border-[#FFE01B]/50 transition-all duration-500"
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FFE01B]/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white group-hover:text-[#FFE01B] transition-colors duration-300 truncate">
                          {freelancer.full_name}
                        </h3>
                        <p className="text-gray-400 text-sm truncate">{freelancer.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="w-3 h-3 text-gray-500" />
                          <span className="text-gray-500 text-xs">
                            {new Date(freelancer.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          freelancer.employment_status || "N/A",
                        )}`}
                      >
                        {freelancer.employment_status || "N/A"}
                      </div>
                    </div>

                    {/* Category & Experience */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-[#FFE01B]/20 text-[#FFE01B] text-xs rounded-lg border border-[#FFE01B]/30">
                          {freelancer.category}
                        </span>
                        {freelancer.experience_level && (
                          <span
                            className={`px-2 py-1 text-xs rounded-lg ${getExperienceColor(
                              freelancer.experience_level,
                            )}`}
                          >
                            {freelancer.experience_level}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Skills Preview */}
                    <div className="space-y-2">
                      {Array.isArray(freelancer.domains) && freelancer.domains.length > 0 && (
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Domains:</p>
                          <div className="flex flex-wrap gap-1">
                            {freelancer.domains.slice(0, 3).map((domain, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded border border-blue-500/20"
                              >
                                {domain}
                              </span>
                            ))}
                            {freelancer.domains.length > 3 && (
                              <span className="px-2 py-1 bg-white/10 text-gray-400 text-xs rounded">
                                +{freelancer.domains.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {Array.isArray(freelancer.tech_stack) && freelancer.tech_stack.length > 0 && (
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Tech:</p>
                          <div className="flex flex-wrap gap-1">
                            {freelancer.tech_stack.slice(0, 3).map((tech, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded border border-green-500/20"
                              >
                                {tech}
                              </span>
                            ))}
                            {freelancer.tech_stack.length > 3 && (
                              <span className="px-2 py-1 bg-white/10 text-gray-400 text-xs rounded">
                                +{freelancer.tech_stack.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 pt-4 border-t border-white/10">
                      <div className="flex items-center gap-2 text-gray-300 text-sm">
                        <Phone className="w-4 h-4" />
                        <span className="truncate">{freelancer.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300 text-sm">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{freelancer.email}</span>
                      </div>
                    </div>

                    {/* Links */}
                    <div className="flex gap-2 pt-2">
                      {freelancer.portfolio_url && (
                        <motion.a
                          href={freelancer.portfolio_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-semibold py-2 px-3 rounded-xl transition-all duration-300 border border-blue-500/30 hover:border-blue-500 text-center text-sm flex items-center justify-center gap-1"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <ExternalLink className="w-3 h-3" />
                          Portfolio
                        </motion.a>
                      )}
                      {freelancer.linkedin_url && (
                        <motion.a
                          href={freelancer.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-blue-600/10 hover:bg-blue-600/20 text-blue-300 font-semibold py-2 px-3 rounded-xl transition-all duration-300 border border-blue-600/30 hover:border-blue-600 text-center text-sm flex items-center justify-center gap-1"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Linkedin className="w-3 h-3" />
                          LinkedIn
                        </motion.a>
                      )}
                      {freelancer.resume_url && (
                        <motion.a
                          href={freelancer.resume_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 font-semibold py-2 px-3 rounded-xl transition-all duration-300 border border-green-500/30 hover:border-green-500 text-center text-sm flex items-center justify-center gap-1"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <FileDown className="w-3 h-3" />
                          Resume
                        </motion.a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Detailed Table */}
            <motion.div
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10 overflow-hidden"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  className="w-10 h-10 bg-[#FFE01B]/20 rounded-xl flex items-center justify-center border border-[#FFE01B]/30"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <FileText className="w-5 h-5 text-[#FFE01B]" />
                </motion.div>
                <h3 className="text-xl font-bold text-white">Detailed View</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-[#FFE01B] font-semibold">Name</th>
                      <th className="text-left py-3 px-4 text-[#FFE01B] font-semibold">Email</th>
                      <th className="text-left py-3 px-4 text-[#FFE01B] font-semibold">Phone</th>
                      <th className="text-left py-3 px-4 text-[#FFE01B] font-semibold">Category</th>
                      <th className="text-left py-3 px-4 text-[#FFE01B] font-semibold">Status</th>
                      <th className="text-left py-3 px-4 text-[#FFE01B] font-semibold">Experience</th>
                      <th className="text-left py-3 px-4 text-[#FFE01B] font-semibold">Domains</th>
                      <th className="text-left py-3 px-4 text-[#FFE01B] font-semibold">Tech Stack</th>
                      <th className="text-left py-3 px-4 text-[#FFE01B] font-semibold">Links</th>
                    </tr>
                  </thead>
                  <tbody>
                    {freelancers.map((freelancer, idx) => (
                      <motion.tr
                        key={idx}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors duration-300"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <td className="py-3 px-4 text-gray-300 font-medium">{freelancer.full_name}</td>
                        <td className="py-3 px-4 text-gray-300">{freelancer.email}</td>
                        <td className="py-3 px-4 text-gray-300">{freelancer.phone}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-[#FFE01B]/10 text-[#FFE01B] text-xs rounded">
                            {freelancer.category}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 text-xs rounded ${getStatusColor(
                              freelancer.employment_status || "N/A",
                            )}`}
                          >
                            {freelancer.employment_status || "N/A"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {freelancer.experience_level && (
                            <span
                              className={`px-2 py-1 text-xs rounded ${getExperienceColor(freelancer.experience_level)}`}
                            >
                              {freelancer.experience_level}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1 max-w-32">
                            {Array.isArray(freelancer.domains) &&
                              freelancer.domains.slice(0, 2).map((domain, i) => (
                                <span
                                  key={i}
                                  className="px-1 py-0.5 bg-blue-500/10 text-blue-400 text-xs rounded"
                                  title={domain}
                                >
                                  {domain.length > 8 ? `${domain.substring(0, 8)}...` : domain}
                                </span>
                              ))}
                            {Array.isArray(freelancer.domains) && freelancer.domains.length > 2 && (
                              <span className="px-1 py-0.5 bg-white/10 text-gray-400 text-xs rounded">
                                +{freelancer.domains.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1 max-w-32">
                            {Array.isArray(freelancer.tech_stack) &&
                              freelancer.tech_stack.slice(0, 2).map((tech, i) => (
                                <span
                                  key={i}
                                  className="px-1 py-0.5 bg-green-500/10 text-green-400 text-xs rounded"
                                  title={tech}
                                >
                                  {tech.length > 8 ? `${tech.substring(0, 8)}...` : tech}
                                </span>
                              ))}
                            {Array.isArray(freelancer.tech_stack) && freelancer.tech_stack.length > 2 && (
                              <span className="px-1 py-0.5 bg-white/10 text-gray-400 text-xs rounded">
                                +{freelancer.tech_stack.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-1">
                            {freelancer.portfolio_url && (
                              <a
                                href={freelancer.portfolio_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 transition-colors"
                                title="Portfolio"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                            {freelancer.linkedin_url && (
                              <a
                                href={freelancer.linkedin_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-300 hover:text-blue-200 transition-colors"
                                title="LinkedIn"
                              >
                                <Linkedin className="w-4 h-4" />
                              </a>
                            )}
                            {freelancer.resume_url && (
                              <a
                                href={freelancer.resume_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-400 hover:text-green-300 transition-colors"
                                title="Resume"
                              >
                                <FileDown className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        </section>
      )}

      {/* Empty State */}
      {!loading && freelancers.length === 0 && (
        <section className="relative py-20 px-4 z-10">
          <motion.div className="max-w-2xl mx-auto text-center" initial="hidden" animate="visible" variants={fadeUp}>
            <div className="w-20 h-20 bg-[#FFE01B]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-[#FFE01B]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">No Freelancers Found</h3>
            <p className="text-gray-400 mb-8">
              {error || "Try adjusting your search filters or check if data exists in the database"}
            </p>
            <motion.button
              onClick={resetFilters}
              className="bg-[#FFE01B] hover:bg-yellow-300 text-[#241C15] font-bold px-6 py-3 rounded-xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Reset Filters
            </motion.button>
          </motion.div>
        </section>
      )}
    </div>
  )
}
