"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Calendar, ExternalLink, CheckCircle, XCircle,
  ClipboardList, Layers, Briefcase, Grid,
  Search, Filter, Users, BarChart3,
  Rocket, Target, Zap, Star, ArrowRight
} from "lucide-react"

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
      results = results.filter(form => 
        form.form_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.subcategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.industry.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Apply status filter
    if (activeFilter !== "all") {
      results = results.filter(form => 
        activeFilter === "active" ? form.is_active : !form.is_active
      )
    }
    
    setFilteredForms(results)
  }, [searchTerm, activeFilter, forms])

  const statusCounts = {
    active: forms.filter(form => form.is_active).length,
    inactive: forms.filter(form => !form.is_active).length,
    total: forms.length
  }

  return (
    <div className="min-h-screen bg-[#fbf5e5] text-[#241C15] overflow-hidden pt-[100px] sm:pt-[120px] lg:pt-[120px]">
      {/* Navigation - commented but kept as is */}
      {/* <nav className="border-b border-gray-700 bg-[#241C15]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-shrink-0 font-bold text-xl text-[#FFE01B]"
              >
                TalentConnect
              </motion.div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <button className="bg-[#FFE01B] hover:bg-yellow-300 text-black font-medium py-2 px-4 rounded-lg text-sm transition-colors">
                  Create Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Hero Section */}
        <section className="text-center mb-12 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#FFE01B] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#FFE01B] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-[#FFE01B] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
          
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-[#FFE01B] shadow-lg"
            >
              <Rocket className="h-5 w-5 text-[#241C15]" />
              <span className="text-sm font-medium text-[#241C15]">Discover Your Next Career Move</span>
              <ArrowRight className="h-4 w-4 text-[#241C15]" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#241C15] mb-4"
            >
              Available Opportunities
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-xl text-[#241C15] max-w-3xl mx-auto mb-8 leading-relaxed"
            >
              Connect with top companies and discover opportunities that match your skills and ambitions
            </motion.p>

            {/* Feature Icons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-8 mt-12"
            >
              <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg border border-[#FFE01B]">
                <Target className="h-6 w-6 text-[#241C15]" />
                <span className="font-semibold text-[#241C15]">Curated Matches</span>
              </div>
              <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg border border-[#FFE01B]">
                <Zap className="h-6 w-6 text-[#241C15]" />
                <span className="font-semibold text-[#241C15]">Fast Response</span>
              </div>
              <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg border border-[#FFE01B]">
                <Star className="h-6 w-6 text-[#241C15]" />
                <span className="font-semibold text-[#241C15]">Top Companies</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 border border-[#241C15]/10 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-[#FFE01B]">
                <Users className="h-6 w-6 text-[#241C15]" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-[#241C15]">Active Opportunities</h3>
                <p className="text-2xl font-bold text-[#241C15]">{statusCounts.active}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 border border-[#241C15]/10 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-[#FFE01B]">
                <ClipboardList className="h-6 w-6 text-[#241C15]" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-[#241C15]">Total Forms</h3>
                <p className="text-2xl font-bold text-[#241C15]">{statusCounts.total}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <section className="mb-8">
          <div className="bg-white rounded-2xl p-6 border border-[#241C15]/10 shadow-lg">
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-[#241C15]/60" />
                </div>
                <input
                  type="text"
                  placeholder="Search forms by name, category, industry..."
                  className="block w-full pl-10 pr-3 py-3 border border-[#241C15]/20 rounded-xl bg-white text-[#241C15] placeholder-[#241C15]/60 focus:outline-none focus:ring-2 focus:ring-[#FFE01B] focus:border-transparent transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeFilter === "all" 
                      ? 'bg-[#FFE01B] text-black shadow-lg shadow-[#FFE01B]/25' 
                      : 'bg-white text-[#241C15] hover:bg-[#FFE01B] border border-[#241C15]/20'
                  }`}
                >
                  All Forms
                </button>
                <button
                  onClick={() => setActiveFilter("active")}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeFilter === "active" 
                      ? 'bg-[#FFE01B] text-black shadow-lg shadow-[#FFE01B]/25' 
                      : 'bg-white text-[#241C15] hover:bg-[#FFE01B] border border-[#241C15]/20'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setActiveFilter("inactive")}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeFilter === "inactive" 
                      ? 'bg-[#FFE01B] text-black shadow-lg shadow-[#FFE01B]/25' 
                      : 'bg-white text-[#241C15] hover:bg-[#FFE01B] border border-[#241C15]/20'
                  }`}
                >
                  Inactive
                </button>
              </div>
            </div>
            
            <div className="mt-4 text-sm text-[#241C15]/70">
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
                  className="bg-white rounded-2xl p-6 border border-[#241C15]/10 shadow-lg"
                >
                  <div className="animate-pulse">
                    <div className="h-6 bg-[#241C15]/10 rounded w-3/4 mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-[#241C15]/10 rounded w-1/2"></div>
                      <div className="h-4 bg-[#241C15]/10 rounded w-2/3"></div>
                      <div className="h-4 bg-[#241C15]/10 rounded w-1/3"></div>
                      <div className="h-10 bg-[#241C15]/10 rounded mt-4"></div>
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
                  className="bg-white rounded-2xl p-6 border border-[#241C15]/10 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-[#241C15]">{form.form_name}</h3>
                    {form.is_active ? (
                      <span className="inline-flex items-center gap-1 text-green-600 text-sm font-medium bg-green-50 px-3 py-1 rounded-full border border-green-200">
                        <CheckCircle className="w-4 h-4" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-600 text-sm font-medium bg-red-50 px-3 py-1 rounded-full border border-red-200">
                        <XCircle className="w-4 h-4" /> Inactive
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-4 space-y-2 text-sm text-[#241C15]/80">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#241C15]/60" />
                      <span>{form.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Grid className="w-4 h-4 text-[#241C15]/60" />
                      <span>{form.subcategory}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-[#241C15]/60" />
                      <span>{form.industry}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#241C15]/60" />
                      <span>{new Date(form.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    {form.is_active ? (
                      <motion.a
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        href={`/form/${form.id}`}
                        className="block w-full text-center bg-[#FFE01B] hover:bg-yellow-300 text-black font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        Apply Now <ExternalLink className="inline w-4 h-4 ml-1" />
                      </motion.a>
                    ) : (
                      <div className="text-center text-[#241C15]/50 italic py-3 bg-[#241C15]/5 rounded-xl border border-[#241C15]/10">
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
                className="text-center py-12 bg-white rounded-2xl border border-[#241C15]/10 shadow-lg"
              >
                <ClipboardList className="w-16 h-16 text-[#241C15]/40 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[#241C15]">No opportunities found</h3>
                <p className="mt-2 text-[#241C15]/60">Try adjusting your search or filter criteria</p>
              </motion.div>
            )}
          </div>

          {/* Desktop Table View */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="hidden md:block overflow-hidden rounded-2xl border border-[#241C15]/10 bg-white shadow-lg"
          >
            <table className="w-full border-collapse">
              <thead className="bg-[#FFE01B]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#241C15]">
                    <div className="flex items-center gap-2">
                      <ClipboardList className="w-4 h-4 text-[#241C15]" /> 
                      Opportunity Name
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#241C15]">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#241C15]" /> 
                      Category
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#241C15]">
                    <div className="flex items-center gap-2">
                      <Grid className="w-4 h-4 text-[#241C15]" /> 
                      Subcategory
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#241C15]">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-[#241C15]" /> 
                      Industry
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#241C15]">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#241C15]" /> 
                      Created
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#241C15]">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-[#241C15]">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="border-t border-[#241C15]/10">
                      <td colSpan={7} className="px-6 py-4">
                        <div className="animate-pulse flex space-x-4 items-center">
                          <div className="flex-1 space-y-3">
                            <div className="h-4 bg-[#241C15]/10 rounded w-3/4"></div>
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
                      className="border-t border-[#241C15]/10 hover:bg-[#FFE01B]/10 transition-all duration-200 cursor-pointer group"
                    >
                      <td className="px-6 py-4 font-semibold text-[#241C15] group-hover:text-[#241C15] transition-colors">
                        {form.form_name}
                      </td>
                      <td className="px-6 py-4 text-[#241C15]/80">{form.category}</td>
                      <td className="px-6 py-4 text-[#241C15]/80">{form.subcategory}</td>
                      <td className="px-6 py-4 text-[#241C15]/80">{form.industry}</td>
                      <td className="px-6 py-4 text-[#241C15]/70">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#241C15]/60" />
                          {new Date(form.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {form.is_active ? (
                          <span className="inline-flex items-center gap-1 text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full border border-green-200">
                            <CheckCircle className="w-4 h-4" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-600 font-medium bg-red-50 px-3 py-1 rounded-full border border-red-200">
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
                            className="inline-flex items-center gap-2 bg-[#FFE01B] hover:bg-yellow-300 text-black font-semibold px-5 py-2 rounded-xl text-sm transition-all duration-200 shadow-md hover:shadow-lg"
                          >
                            Apply Now <ExternalLink className="w-4 h-4" />
                          </motion.a>
                        ) : (
                          <span className="text-[#241C15]/50 italic">Not Available</span>
                        )}
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <ClipboardList className="w-16 h-16 text-[#241C15]/40 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-[#241C15]">No opportunities found</h3>
                      <p className="mt-2 text-[#241C15]/60">Try adjusting your search or filter criteria</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </motion.div>
        </section>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}