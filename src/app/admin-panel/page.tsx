"use client"

import { useState } from "react"
import { motion, type Variants } from "framer-motion"
import { Search, Download, Users, Filter, Database, FileText, Zap, Eye, Star, DollarSign, Clock, MapPin } from "lucide-react"

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
  name: string
  skills: string[]
  tags: string[]
  experience_years: number
  rate: number
  whatsapp: string
  status: string
  location?: string
  rating?: number
  [key: string]: any
}

type SearchFilters = {
  skills: string[]
  minExperience: number
  maxExperience: number
  minRate: number
  maxRate: number
  status: string
  location: string
}

export default function AdminQueryPanel() {
   const [filters, setFilters] = useState<SearchFilters>({
    skills: [],
    minExperience: 0,
    maxExperience: 10,
    minRate: 0,
    maxRate: 200,
    status: "",
    location: "",
  })
  const [freelancers, setFreelancers] = useState<Freelancer[]>([])
  const [loading, setLoading] = useState(false)
  const [skillInput, setSkillInput] = useState("")

  // Available options for dropdowns
  const availableSkills = [
    "React",
    "Node.js",
    "Python",
    "Java",
    "TypeScript",
    "JavaScript",
    "PHP",
    "Ruby",
    "Go",
    "Rust",
    "Vue.js",
    "Angular",
    "Django",
    "Flask",
    "Laravel",
    "Spring",
    "Express",
    "MongoDB",
    "PostgreSQL",
    "MySQL",
    "AWS",
    "Docker",
    "Kubernetes",
    "Git",
    "GraphQL",
    "REST API",
    "Figma",
    "Adobe XD",
    "Photoshop",
    "Illustrator",
    "UI/UX",
    "SEO",
    "Digital Marketing",
    "Content Writing",
    "Video Editing",
    "3D Modeling",
    "Animation",
  ]

  const statusOptions = ["", "Available", "Busy", "Offline"]
  const locationOptions = ["", "USA", "Canada", "UK", "Germany", "India", "Australia", "Remote"]

  // Mock data for demonstration
  const mockFreelancers: Freelancer[] = [
    {
      id: "1",
      name: "Kunal",
      skills: ["React", "Node.js", "TypeScript"],
      tags: ["Frontend", "Backend"],
      experience_years: 5,
      rate: 75,
      whatsapp: "+1234567890",
      status: "Available",
      location: "USA",
      rating: 4.8,
    },
    {
      id: "2",
      name: "raj",
      skills: ["Python", "Django", "PostgreSQL"],
      tags: ["Backend", "Database"],
      experience_years: 3,
      rate: 65,
      whatsapp: "+1234567891",
      status: "Busy",
      location: "Canada",
      rating: 4.9,
    },
    {
      id: "3",
      name: "prabhat",
      skills: ["Figma", "Adobe XD", "UI/UX"],
      tags: ["Design", "UI/UX"],
      experience_years: 4,
      rate: 60,
      whatsapp: "+1234567892",
      status: "Available",
      location: "UK",
      rating: 4.7,
    },
    {
      id: "4",
      name: "manish",
      skills: ["Vue.js", "Laravel", "MySQL"],
      tags: ["Frontend", "Backend"],
      experience_years: 6,
      rate: 80,
      whatsapp: "+1234567893",
      status: "Available",
      location: "Germany",
      rating: 4.6,
    },
    {
      id: "5",
      name: "Anurag",
      skills: ["React", "GraphQL", "AWS"],
      tags: ["Frontend", "Cloud"],
      experience_years: 7,
      rate: 90,
      whatsapp: "+1234567894",
      status: "Offline",
      location: "Remote",
      rating: 4.9,
    },
  ]

  const handleSearch = async () => {
    setLoading(true)

    // Simulate API call to Supabase
    setTimeout(() => {
      // Filter mock data based on form criteria
      const filteredData = mockFreelancers.filter((freelancer) => {
        // Skills filter
        if (filters.skills.length > 0) {
          const hasMatchingSkill = filters.skills.some((skill) =>
            freelancer.skills.some((fSkill) => fSkill.toLowerCase().includes(skill.toLowerCase())),
          )
          if (!hasMatchingSkill) return false
        }

        // Experience filter
        if (
          freelancer.experience_years < filters.minExperience ||
          freelancer.experience_years > filters.maxExperience
        ) {
          return false
        }

        // Rate filter
        if (freelancer.rate < filters.minRate || freelancer.rate > filters.maxRate) {
          return false
        }

        // Status filter
        if (filters.status && freelancer.status !== filters.status) {
          return false
        }

        // Location filter
        if (filters.location && freelancer.location !== filters.location) {
          return false
        }

        return true
      })

      setFreelancers(filteredData)
      setLoading(false)
    }, 1500)

    // Real Supabase implementation would be:
    // const { data, error } = await supabase
    //   .from('freelancers')
    //   .select('*')
    //   .contains('skills', filters.skills)
    //   .gte('experience_years', filters.minExperience)
    //   .lte('experience_years', filters.maxExperience)
    //   .gte('rate', filters.minRate)
    //   .lte('rate', filters.maxRate)
    //   .eq('status', filters.status || undefined)
    //   .eq('location', filters.location || undefined)
    //   .limit(50)
  }

  const addSkill = () => {
    if (skillInput.trim() && !filters.skills.includes(skillInput.trim())) {
      setFilters((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }))
      setSkillInput("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setFilters((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }))
  }

  const resetFilters = () => {
    setFilters({
      skills: [],
      minExperience: 0,
      maxExperience: 10,
      minRate: 0,
      maxRate: 200,
      status: "",
      location: "",
    })
    setFreelancers([])
  }

  const downloadCSV = () => {
    if (freelancers.length === 0) return alert("No data to download.")
    const headers = Object.keys(freelancers[0])
    const rows = [headers.join(",")]
    freelancers.forEach((f) => {
      const row = headers.map((h) => (Array.isArray(f[h]) ? `"${f[h].join(", ")}"` : `"${f[h] ?? ""}"`))
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
          className="absolute top-1/2 -left-40 w-64 h-64 bg-[#FFE01B] opacity-5 rounded-full"
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
          className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#FFE01B] opacity-5 rounded-full"
        />
      </div>

      {/* Header Section */}
      <section className="relative py-28 px-4 z-10">
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
                Freelancer Search
              </span>
            </motion.h1>

            {/* <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              Advanced AI-powered search to find the perfect freelancers for your projects
            </motion.p>

            {/* Stats *
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
                <h3 className="text-2xl font-bold text-white">500+</h3>
                <p className="text-gray-400 text-sm">Active Freelancers</p>
              </motion.div>

              <motion.div
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                initial="hidden"
                animate="visible"
                variants={scaleIn}
              >
                <div className="flex items-center justify-center mb-3">
                  <Zap className="w-8 h-8 text-[#FFE01B]" />
                </div>
                <h3 className="text-2xl font-bold text-white">AI</h3>
                <p className="text-gray-400 text-sm">Powered Search</p>
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
                <h3 className="text-2xl font-bold text-white">Smart</h3>
                <p className="text-gray-400 text-sm">Filtering</p>
              </motion.div>
            </motion.div> */}
          </div>
        </motion.div>
      </section>

      {/* Search Section */}
      {/* <section className="relative py-12 px-4 z-10">
        <motion.div
          className="max-w-4xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
            <motion.div className="space-y-6" initial="hidden" animate="visible" variants={fadeInLeft}>
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  className="w-10 h-10 bg-[#FFE01B]/20 rounded-xl flex items-center justify-center border border-[#FFE01B]/30"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Search className="w-5 h-5 text-[#FFE01B]" />
                </motion.div>
                <h2 className="text-2xl font-bold text-white">Search Query</h2>
              </div>

              <div className="relative">
                <textarea
                  className="w-full bg-white/10 border border-white/20 rounded-2xl p-6 text-white placeholder-gray-400 focus:outline-none focus:border-[#FFE01B] transition-colors duration-300 resize-none"
                  rows={4}
                  placeholder="Type your search prompt here... (e.g., Looking for React developers with 3+ years experience, available for full-time projects)"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <div className="absolute bottom-4 right-4">
                  <motion.div
                    className="w-8 h-8 bg-[#FFE01B]/20 rounded-lg flex items-center justify-center"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <Zap className="w-4 h-4 text-[#FFE01B]" />
                  </motion.div>
                </div>
              </div>

              <motion.button
                onClick={handleSearch}
                disabled={loading}
                className="w-full bg-[#FFE01B] hover:bg-yellow-300 text-[#241C15] font-bold py-4 px-8 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
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
                    Searching Freelancers...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Search Freelancers
                  </>
                )}
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </section> */}
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
                {/* Skills Section */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-[#FFE01B]">Skills Required</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addSkill()}
                      placeholder="Add skill..."
                      className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#FFE01B] transition-colors duration-300"
                    />
                    <motion.button
                      onClick={addSkill}
                      className="bg-[#FFE01B] hover:bg-yellow-300 text-[#241C15] font-semibold px-6 py-3 rounded-xl transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Add
                    </motion.button>
                  </div>

                  {/* Skills Tags */}
                  {filters.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {filters.skills.map((skill, idx) => (
                        <motion.span
                          key={idx}
                          className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFE01B]/20 text-[#FFE01B] text-sm rounded-lg border border-[#FFE01B]/30"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          {skill}
                          <button
                            onClick={() => removeSkill(skill)}
                            className="text-[#FFE01B] hover:text-red-400 transition-colors duration-200"
                          >
                            ×
                          </button>
                        </motion.span>
                      ))}
                    </div>
                  )}

                  {/* Skill Suggestions */}
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400">Popular Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {availableSkills.slice(0, 8).map((skill, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            if (!filters.skills.includes(skill)) {
                              setFilters((prev) => ({
                                ...prev,
                                skills: [...prev.skills, skill],
                              }))
                            }
                          }}
                          className="px-3 py-1 bg-white/10 hover:bg-[#FFE01B]/20 text-gray-300 hover:text-[#FFE01B] text-sm rounded-lg transition-all duration-300 border border-white/10 hover:border-[#FFE01B]/30"
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Experience & Rate Section */}
                <div className="space-y-6">
                  {/* Experience Range */}
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-[#FFE01B]">Experience (Years)</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-400 mb-2">Minimum</label>
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={filters.minExperience}
                          onChange={(e) =>
                            setFilters((prev) => ({ ...prev, minExperience: Number.parseInt(e.target.value) || 0 }))
                          }
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFE01B] transition-colors duration-300"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-2">Maximum</label>
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={filters.maxExperience}
                          onChange={(e) =>
                            setFilters((prev) => ({ ...prev, maxExperience: Number.parseInt(e.target.value) || 20 }))
                          }
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFE01B] transition-colors duration-300"
                        />
                      </div>
                    </div>
                  </div>
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
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-[#FFE01B] transition-colors duration-300">
                          {freelancer.name}
                        </h3>
                        <div className="flex items-center gap-1 text-gray-400 text-sm mt-1">
                          <MapPin className="w-3 h-3" />
                          {freelancer.location}
                        </div>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          freelancer.status === "Available"
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : freelancer.status === "Busy"
                              ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                              : "bg-red-500/20 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {freelancer.status}
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(freelancer.rating || 0) ? "fill-[#FFE01B] text-[#FFE01B]" : "text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-gray-400 text-sm">({freelancer.rating})</span>
                    </div>

                    {/* Skills */}
                    <div>
                      <p className="text-gray-400 text-sm mb-2">Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {freelancer.skills.slice(0, 3).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-[#FFE01B]/20 text-[#FFE01B] text-xs rounded-lg border border-[#FFE01B]/30"
                          >
                            {skill}
                          </span>
                        ))}
                        {freelancer.skills.length > 3 && (
                          <span className="px-2 py-1 bg-white/10 text-gray-400 text-xs rounded-lg">
                            +{freelancer.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-gray-400 text-xs">Experience</p>
                          <p className="text-white font-semibold">{freelancer.experience_years} years</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-gray-400 text-xs">Rate</p>
                          <p className="text-white font-semibold">${freelancer.rate}/hr</p>
                        </div>
                      </div>
                    </div>

                    {/* Contact */}
                    <motion.button
                      className="w-full bg-[#FFE01B]/10 hover:bg-[#FFE01B]/20 text-[#FFE01B] font-semibold py-2 px-4 rounded-xl transition-all duration-300 border border-[#FFE01B]/30 hover:border-[#FFE01B]"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Contact: {freelancer.whatsapp}
                    </motion.button>
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
                      {Object.keys(freelancers[0]).map((header) => (
                        <th key={header} className="text-left py-3 px-4 text-[#FFE01B] font-semibold capitalize">
                          {header.replace("_", " ")}
                        </th>
                      ))}
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
                        {Object.values(freelancer).map((val, i) => (
                          <td key={i} className="py-3 px-4 text-gray-300">
                            {Array.isArray(val) ? (
                              <div className="flex flex-wrap gap-1">
                                {val.map((item, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-[#FFE01B]/10 text-[#FFE01B] text-xs rounded">
                                    {item}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              String(val)
                            )}
                          </td>
                        ))}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        </section>
      )}

      {/* Empty State
      {!loading && freelancers.length === 0 && (
        <section className="relative py-20 px-4 z-10">
          <motion.div className="max-w-2xl mx-auto text-center" initial="hidden" animate="visible" variants={fadeUp}>
            <div className="w-20 h-20 bg-[#FFE01B]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-[#FFE01B]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Search</h3>
            <p className="text-gray-400 mb-8">Use the filters above to find freelancers that match your requirements</p>
          </motion.div>
        </section>
      )} */}
    </div>
  )
}
