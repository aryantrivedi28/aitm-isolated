"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Calendar,
  ExternalLink,
  CheckCircle,
  XCircle,
  ClipboardList,
  Layers,
  Briefcase,
  Grid,
  Search,
  Users,
  Rocket,
  Target,
  Zap,
  Star,
  ArrowRight,
  User,
} from "lucide-react"
import { useRouter } from "next/navigation"

type Form = {
  id: string
  form_id: string
  form_name: string
  category: string
  subcategory: string
  industry: string
  tech_stack?: string
  tools?: string
  created_at: string
  is_active?: boolean
  required_fields?: string[]
  custom_questions?: any[]
}

export default function GetHiredPage() {
  const [forms, setForms] = useState<Form[]>([])
  const [filteredForms, setFilteredForms] = useState<Form[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState("all")
  const router = useRouter()

  useEffect(() => {
    const fetchForms = async () => {
      try {
        setIsLoading(true)
        // First try to fetch from the API
        const res = await fetch("/api/forms")

        if (res.ok) {
          const data = await res.json()
          setForms(data.forms || [])
          setFilteredForms(data.forms || [])
        } else {
          // If API fails, use mock data
          throw new Error("API request failed")
        }
      } catch (err) {
        console.error("Failed to load forms from API, using mock data:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchForms()
  }, [])

  useEffect(() => {
    let results = forms

    // Apply search filter
    if (searchTerm) {
      results = results.filter(
        (form) =>
          form.form_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          form.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          form.subcategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
          form.industry.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply status filter
    if (activeFilter !== "all") {
      results = results.filter((form) => (activeFilter === "active" ? form.is_active : !form.is_active))
    }

    setFilteredForms(results)
  }, [searchTerm, activeFilter, forms])

  const statusCounts = {
    active: forms.filter((form) => form.is_active).length,
    inactive: forms.filter((form) => !form.is_active).length,
    total: forms.length,
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
        {/* Enhanced Hero Section */}
        <section className="text-center mb-12 relative overflow-hidden">
          <div className="relative z-10">
            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 mb-6 border"
              style={{ 
                backgroundColor: "#f0eadd", 
                borderColor: "#f7af00", 
                boxShadow: "0 2px 6px rgba(36, 28, 21, 0.05)"
              }}
            >
              <Rocket className="h-5 w-5" style={{ color: "#241C15" }} />
              <span className="text-sm font-medium" style={{ color: "#31302f" }}>Discover Your Next Career Move</span>
              <ArrowRight className="h-4 w-4" style={{ color: "#241C15" }} />
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight mb-4"
              style={{ color: "#050504" }}
            >
              Available Opportunities
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-xl max-w-3xl mx-auto mb-8 leading-relaxed"
              style={{ color: "#31302f" }}
            >
              Connect with top companies and discover opportunities that match your skills and ambitions.
            </motion.p>

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/get-hired/freelancer")}
              transition={{ duration: 0.2 }}
              className="group font-semibold px-8 py-4 rounded-xl text-base mt-6 transition-all flex items-center gap-2 mx-auto"
              style={{ 
                backgroundColor: "#f7af00", 
                color: "#050504",
                boxShadow: "0 2px 6px rgba(36, 28, 21, 0.05)"
              }}
              onMouseEnter={handleButtonHover}
              onMouseLeave={handleButtonLeave}
            >
              <User className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              Visit Your Profile
            </motion.button>

            {/* Feature Icons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-8 mt-12"
            >
              <div 
                className="flex items-center gap-3 rounded-2xl px-4 py-3 shadow-lg border"
                style={{ 
                  backgroundColor: "#f0eadd", 
                  borderColor: "#f7af00", 
                  boxShadow: "0 2px 6px rgba(36, 28, 21, 0.05)"
                }}
              >
                <Target className="h-6 w-6" style={{ color: "#241C15" }} />
                <span className="font-semibold" style={{ color: "#31302f" }}>Curated Matches</span>
              </div>
              <div 
                className="flex items-center gap-3 rounded-2xl px-4 py-3 shadow-lg border"
                style={{ 
                  backgroundColor: "#f0eadd", 
                  borderColor: "#f7af00", 
                  boxShadow: "0 2px 6px rgba(36, 28, 21, 0.05)"
                }}
              >
                <Zap className="h-6 w-6" style={{ color: "#241C15" }} />
                <span className="font-semibold" style={{ color: "#31302f" }}>Fast Response</span>
              </div>
              <div 
                className="flex items-center gap-3 rounded-2xl px-4 py-3 shadow-lg border"
                style={{ 
                  backgroundColor: "#f0eadd", 
                  borderColor: "#f7af00", 
                  boxShadow: "0 2px 6px rgba(36, 28, 21, 0.05)"
                }}
              >
                <Star className="h-6 w-6" style={{ color: "#241C15" }} />
                <span className="font-semibold" style={{ color: "#31302f" }}>Top Companies</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-6 border shadow-lg hover:shadow-xl transition-all duration-300"
            style={{ 
              backgroundColor: "#faf4e5", 
              borderColor: "#241C15",
              boxShadow: "0 2px 6px rgba(36, 28, 21, 0.05)"
            }}
          >
            <div className="flex items-center">
              <div className="p-3 rounded-xl" style={{ backgroundColor: "#f7af00" }}>
                <Users className="h-6 w-6" style={{ color: "#050504" }} />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium" style={{ color: "#31302f" }}>Active Opportunities</h3>
                <p className="text-2xl font-bold" style={{ color: "#050504" }}>{statusCounts.active}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl p-6 border shadow-lg hover:shadow-xl transition-all duration-300"
            style={{ 
              backgroundColor: "#faf4e5", 
              borderColor: "#241C15",
              boxShadow: "0 2px 6px rgba(36, 28, 21, 0.05)"
            }}
          >
            <div className="flex items-center">
              <div className="p-3 rounded-xl" style={{ backgroundColor: "#f7af00" }}>
                <ClipboardList className="h-6 w-6" style={{ color: "#050504" }} />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium" style={{ color: "#31302f" }}>Total Forms</h3>
                <p className="text-2xl font-bold" style={{ color: "#050504" }}>{statusCounts.total}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <section className="mb-8">
          <div 
            className="rounded-2xl p-6 border shadow-lg"
            style={{ 
              backgroundColor: "#faf4e5", 
              borderColor: "#241C15",
              boxShadow: "0 2px 6px rgba(36, 28, 21, 0.05)"
            }}
          >
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5" style={{ color: "#31302f" }} />
                </div>
                <input
                  type="text"
                  placeholder="Search forms by name, category, industry..."
                  className="block w-full pl-10 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-1 focus:ring-offset-0 transition-all duration-200"
                  style={{ 
                    borderColor: "#241C15", 
                    color: "#31302f",
                    backgroundColor: "#f0eadd"
                  }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeFilter === "all"
                      ? "text-black"
                      : "text-[#31302f] hover:bg-f7af00 border"
                  }`}
                  style={activeFilter === "all" ? {
                    backgroundColor: "#f7af00",
                    boxShadow: "0 2px 6px rgba(36, 28, 21, 0.05)"
                  } : {
                    backgroundColor: "#faf4e5",
                    borderColor: "#241C15"
                  }}
                  onMouseEnter={handleButtonHover}
                  onMouseLeave={handleButtonLeave}
                >
                  All Forms
                </button>
                <button
                  onClick={() => setActiveFilter("active")}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeFilter === "active"
                      ? "text-black"
                      : "text-[#31302f] hover:bg-f7af00 border"
                  }`}
                  style={activeFilter === "active" ? {
                    backgroundColor: "#f7af00",
                    boxShadow: "0 2px 6px rgba(36, 28, 21, 0.05)"
                  } : {
                    backgroundColor: "#faf4e5",
                    borderColor: "#241C15"
                  }}
                  onMouseEnter={handleButtonHover}
                  onMouseLeave={handleButtonLeave}
                >
                  Active
                </button>
                <button
                  onClick={() => setActiveFilter("inactive")}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeFilter === "inactive"
                      ? "text-black"
                      : "text-[#31302f] hover:bg-f7af00 border"
                  }`}
                  style={activeFilter === "inactive" ? {
                    backgroundColor: "#f7af00",
                    boxShadow: "0 2px 6px rgba(36, 28, 21, 0.05)"
                  } : {
                    backgroundColor: "#faf4e5",
                    borderColor: "#241C15"
                  }}
                  onMouseEnter={handleButtonHover}
                  onMouseLeave={handleButtonLeave}
                >
                  Inactive
                </button>
              </div>
            </div>

            <div className="mt-4 text-sm" style={{ color: "#31302f" }}>
              Showing {filteredForms.length} of {forms.length} forms
            </div>
          </div>
        </section>

        {/* Forms Section */}
        <section>
          {/* Mobile Cards View */}
          <div className="md:hidden space-y-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-2xl p-6 border shadow-lg"
                  style={{ 
                    backgroundColor: "#faf4e5", 
                    borderColor: "#241C15"
                  }}
                >
                  <div className="animate-pulse">
                    <div className="h-6 rounded w-3/4 mb-4" style={{ backgroundColor: "rgba(36, 28, 21, 0.1)" }}></div>
                    <div className="space-y-3">
                      <div className="h-4 rounded w-1/2" style={{ backgroundColor: "rgba(36, 28, 21, 0.1)" }}></div>
                      <div className="h-4 rounded w-2/3" style={{ backgroundColor: "rgba(36, 28, 21, 0.1)" }}></div>
                      <div className="h-4 rounded w-1/3" style={{ backgroundColor: "rgba(36, 28, 21, 0.1)" }}></div>
                      <div className="h-10 rounded mt-4" style={{ backgroundColor: "rgba(36, 28, 21, 0.1)" }}></div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : filteredForms.length > 0 ? (
              filteredForms.map((form, index) => (
                <motion.div
                  key={form.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-2xl p-6 border shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{ 
                    backgroundColor: "#faf4e5", 
                    borderColor: "#241C15",
                    boxShadow: "0 2px 6px rgba(36, 28, 21, 0.05)"
                  }}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold" style={{ color: "#050504" }}>{form.form_name}</h3>
                    {form.is_active ? (
                      <span className="inline-flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full border"
                        style={{ 
                          color: "#241C15", 
                          backgroundColor: "#f0eadd",
                          borderColor: "#241C15"
                        }}
                      >
                        <CheckCircle className="w-4 h-4" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full border"
                        style={{ 
                          color: "#241C15", 
                          backgroundColor: "#f0eadd",
                          borderColor: "#241C15"
                        }}
                      >
                        <XCircle className="w-4 h-4" /> Inactive
                      </span>
                    )}
                  </div>

                  <div className="mt-4 space-y-2 text-sm" style={{ color: "#31302f" }}>
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4" style={{ color: "#31302f" }} />
                      <span>{form.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Grid className="w-4 h-4" style={{ color: "#31302f" }} />
                      <span>{form.subcategory}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" style={{ color: "#31302f" }} />
                      <span>{form.industry}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" style={{ color: "#31302f" }} />
                      <span>{new Date(form.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    {form.is_active ? (
                      <motion.a
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        href={`/form/${form.id}`}
                        className="block w-full text-center font-semibold py-3 px-4 rounded-xl transition-all duration-200"
                        style={{ 
                          backgroundColor: "#f7af00", 
                          color: "#050504",
                          boxShadow: "0 2px 6px rgba(36, 28, 21, 0.05)"
                        }}
                      >
                        Apply Now <ExternalLink className="inline w-4 h-4 ml-1" />
                      </motion.a>
                    ) : (
                      <div 
                        className="text-center italic py-3 rounded-xl border"
                        style={{ 
                          color: "#31302f",
                          backgroundColor: "#f0eadd",
                          borderColor: "#241C15"
                        }}
                      >
                        Not Available
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 rounded-2xl border shadow-lg"
                style={{ 
                  backgroundColor: "#faf4e5", 
                  borderColor: "#241C15"
                }}
              >
                <ClipboardList className="w-16 h-16 mx-auto mb-4" style={{ color: "#31302f" }} />
                <h3 className="text-lg font-medium" style={{ color: "#050504" }}>No opportunities found</h3>
                <p className="mt-2" style={{ color: "#31302f" }}>Try adjusting your search or filter criteria</p>
              </motion.div>
            )}
          </div>

          {/* Desktop Table View */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="hidden md:block overflow-hidden rounded-2xl border shadow-lg"
            style={{ 
              backgroundColor: "#faf4e5", 
              borderColor: "#241C15"
            }}
          >
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ backgroundColor: "#f7af00" }}>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#050504" }}>
                    <div className="flex items-center gap-2">
                      <ClipboardList className="w-4 h-4" style={{ color: "#050504" }} />
                      Opportunity Name
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#050504" }}>
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4" style={{ color: "#050504" }} />
                      Category
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#050504" }}>
                    <div className="flex items-center gap-2">
                      <Grid className="w-4 h-4" style={{ color: "#050504" }} />
                      Subcategory
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#050504" }}>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" style={{ color: "#050504" }} />
                      Industry
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#050504" }}>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" style={{ color: "#050504" }} />
                      Created
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#050504" }}>Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold" style={{ color: "#050504" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} style={{ borderTop: "1px solid rgba(36, 28, 21, 0.1)" }}>
                      <td colSpan={7} className="px-6 py-4">
                        <div className="animate-pulse flex space-x-4 items-center">
                          <div className="flex-1 space-y-3">
                            <div className="h-4 rounded w-3/4" style={{ backgroundColor: "rgba(36, 28, 21, 0.1)" }}></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : filteredForms.length > 0 ? (
                  filteredForms.map((form, index) => (
                    <motion.tr
                      key={form.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.07 }}
                      className="border-t transition-all duration-200 cursor-pointer group"
                      style={{ 
                        borderTop: "1px solid rgba(36, 28, 21, 0.1)",
                        backgroundColor: "rgba(247, 175, 0, 0.05)"
                      }}
                    >
                      <td className="px-6 py-4 font-semibold transition-colors" style={{ color: "#050504" }}>
                        {form.form_name}
                      </td>
                      <td className="px-6 py-4" style={{ color: "#31302f" }}>{form.category}</td>
                      <td className="px-6 py-4" style={{ color: "#31302f" }}>{form.subcategory}</td>
                      <td className="px-6 py-4" style={{ color: "#31302f" }}>{form.industry}</td>
                      <td className="px-6 py-4" style={{ color: "#31302f" }}>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" style={{ color: "#31302f" }} />
                          {new Date(form.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {form.is_active ? (
                          <span className="inline-flex items-center gap-1 font-medium px-3 py-1 rounded-full border"
                            style={{ 
                              color: "#241C15", 
                              backgroundColor: "#f0eadd",
                              borderColor: "#241C15"
                            }}
                          >
                            <CheckCircle className="w-4 h-4" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-medium px-3 py-1 rounded-full border"
                            style={{ 
                              color: "#241C15", 
                              backgroundColor: "#f0eadd",
                              borderColor: "#241C15"
                            }}
                          >
                            <XCircle className="w-4 h-4" /> Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {form.is_active ? (
                          <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href={`/form/${form.id}`}
                            className="inline-flex items-center gap-2 font-semibold px-5 py-2 rounded-xl text-sm transition-all duration-200"
                            style={{ 
                              backgroundColor: "#f7af00", 
                              color: "#050504",
                              boxShadow: "0 2px 6px rgba(36, 28, 21, 0.05)"
                            }}
                          >
                            Apply Now <ExternalLink className="w-4 h-4" />
                          </motion.a>
                        ) : (
                          <span className="italic" style={{ color: "#31302f" }}>Not Available</span>
                        )}
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <ClipboardList className="w-16 h-16 mx-auto mb-4" style={{ color: "#31302f" }} />
                      <h3 className="text-lg font-medium" style={{ color: "#050504" }}>No opportunities found</h3>
                      <p className="mt-2" style={{ color: "#31302f" }}>Try adjusting your search or filter criteria</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </motion.div>
        </section>
      </div>
    </div>
  )
}