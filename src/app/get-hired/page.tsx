"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Calendar, ExternalLink, CheckCircle, XCircle,
  ClipboardList, Layers, Briefcase, Grid,
  Search, Filter, Users, BarChart3
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

// Mock data for demonstration
const mockForms: Form[] = [
  {
    id: "1",
    form_id: "form_001",
    form_name: "Frontend Developer Application",
    category: "Technology",
    subcategory: "Web Development",
    industry: "Tech",
    created_at: "2023-10-15T12:00:00Z",
    is_active: true,
    tech_stack: "React, TypeScript, Next.js",
    required_fields: ["name", "email", "portfolio", "experience"]
  },
  {
    id: "2",
    form_id: "form_002",
    form_name: "UX Designer Questionnaire",
    category: "Design",
    subcategory: "User Experience",
    industry: "Tech",
    created_at: "2023-09-22T09:30:00Z",
    is_active: true,
    tools: "Figma, Sketch, Adobe XD",
    required_fields: ["name", "email", "portfolio", "case_studies"]
  },
  {
    id: "3",
    form_id: "form_003",
    form_name: "Data Scientist Assessment",
    category: "Data",
    subcategory: "Machine Learning",
    industry: "Finance",
    created_at: "2023-11-05T14:15:00Z",
    is_active: false,
    tech_stack: "Python, R, SQL, TensorFlow",
    required_fields: ["name", "email", "github", "publications"]
  },
  {
    id: "4",
    form_id: "form_004",
    form_name: "DevOps Engineer Application",
    category: "Technology",
    subcategory: "Infrastructure",
    industry: "Tech",
    created_at: "2023-10-28T16:45:00Z",
    is_active: true,
    tech_stack: "AWS, Docker, Kubernetes, Terraform",
    required_fields: ["name", "email", "certifications", "experience"]
  }
];

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
        // Use mock data as fallback
        setForms(mockForms)
        setFilteredForms(mockForms)
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
    <div className="min-h-screen bg-[#241C15] text-white overflow-hidden pt-[60px] sm:pt-[100px] lg:pt-[120px]">
      {/* Navigation */}
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


        {/* Header Section */}
        <section className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-3xl font-bold tracking-tight sm:text-4xl text-[#FFE01B]"
          >
            Available Opportunities
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-2 text-gray-300 sm:text-lg max-w-3xl mx-auto"
          >
            Apply to vetted opportunities and land your next role
          </motion.p>
        </section>

                {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1A1410] rounded-xl p-5 border border-gray-700"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-[#FFE01B]/10">
                <Users className="h-6 w-6 text-[#FFE01B]" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-300">Active Opportunities</h3>
                <p className="text-2xl font-bold text-white">{statusCounts.active}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#1A1410] rounded-xl p-5 border border-gray-700"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-[#FFE01B]/10">
                <ClipboardList className="h-6 w-6 text-[#FFE01B]" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-300">Total Forms</h3>
                <p className="text-2xl font-bold text-white">{statusCounts.total}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <section className="mb-8">
          <div className="bg-[#1A1410] rounded-xl p-4 border border-gray-700">
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search forms by name, category, industry..."
                  className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg bg-[#2a2018] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFE01B] focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeFilter === "all" ? 'bg-[#FFE01B] text-black' : 'bg-[#2a2018] text-gray-300 hover:bg-[#3E3124]'}`}
                >
                  All Forms
                </button>
                <button
                  onClick={() => setActiveFilter("active")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeFilter === "active" ? 'bg-green-700 text-white' : 'bg-[#2a2018] text-gray-300 hover:bg-[#3E3124]'}`}
                >
                  Active
                </button>
                <button
                  onClick={() => setActiveFilter("inactive")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeFilter === "inactive" ? 'bg-red-700 text-white' : 'bg-[#2a2018] text-gray-300 hover:bg-[#3E3124]'}`}
                >
                  Inactive
                </button>
              </div>
            </div>
            
            <div className="mt-4 text-sm text-gray-400">
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
                  className="bg-[#1A1410] rounded-xl p-5 border border-gray-700"
                >
                  <div className="animate-pulse">
                    <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                      <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                      <div className="h-10 bg-gray-700 rounded mt-4"></div>
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
                  className="bg-[#1A1410] rounded-xl p-5 border border-gray-700"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-white">{form.form_name}</h3>
                    {form.is_active ? (
                      <span className="inline-flex items-center gap-1 text-green-400 text-sm font-medium bg-green-900/30 px-2 py-1 rounded-full">
                        <CheckCircle className="w-4 h-4" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-400 text-sm font-medium bg-red-900/30 px-2 py-1 rounded-full">
                        <XCircle className="w-4 h-4" /> Inactive
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-4 space-y-2 text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-gray-500" />
                      <span>{form.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Grid className="w-4 h-4 text-gray-500" />
                      <span>{form.subcategory}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-gray-500" />
                      <span>{form.industry}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>{new Date(form.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    {form.is_active ? (
                      <motion.a
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        href={`/form/${form.id}`}
                        className="block w-full text-center bg-[#FFE01B] hover:bg-yellow-300 text-black font-semibold py-2 px-4 rounded-lg transition-colors"
                      >
                        Fill Form <ExternalLink className="inline w-4 h-4 ml-1" />
                      </motion.a>
                    ) : (
                      <div className="text-center text-gray-500 italic py-2">
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
                className="text-center py-10 bg-[#1A1410] rounded-xl border border-gray-700"
              >
                <ClipboardList className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-300">No forms found</h3>
                <p className="mt-2 text-gray-500">Try adjusting your search or filter criteria</p>
              </motion.div>
            )}
          </div>

          {/* Desktop Table View */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="hidden md:block overflow-hidden rounded-xl border border-gray-700"
          >
            <table className="w-full border-collapse">
              <thead className="bg-[#1A1410]">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                    <div className="flex items-center gap-2">
                      <ClipboardList className="w-4 h-4" /> 
                      Form Name
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4" /> 
                      Category
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                    <div className="flex items-center gap-2">
                      <Grid className="w-4 h-4" /> 
                      Subcategory
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" /> 
                      Industry
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> 
                      Created
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Status</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="border-t border-gray-700">
                      <td colSpan={7} className="px-4 py-4">
                        <div className="animate-pulse flex space-x-4 items-center">
                          <div className="flex-1 space-y-3">
                            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
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
                      className="border-t border-gray-700 hover:bg-[#2a2018] transition-all cursor-pointer"
                    >
                      <td className="px-4 py-4 font-medium text-white">{form.form_name}</td>
                      <td className="px-4 py-4 text-gray-300">{form.category}</td>
                      <td className="px-4 py-4 text-gray-300">{form.subcategory}</td>
                      <td className="px-4 py-4 text-gray-300">{form.industry}</td>
                      <td className="px-4 py-4 text-gray-300">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          {new Date(form.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {form.is_active ? (
                          <span className="inline-flex items-center gap-1 text-green-400 font-medium bg-green-900/30 px-2 py-1 rounded-full">
                            <CheckCircle className="w-4 h-4" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-400 font-medium bg-red-900/30 px-2 py-1 rounded-full">
                            <XCircle className="w-4 h-4" /> Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {form.is_active ? (
                          <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href={`/form/${form.id}`}
                            className="inline-flex items-center gap-1 bg-[#FFE01B] hover:bg-yellow-300 text-black font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
                          >
                            Fill Form <ExternalLink className="w-4 h-4" />
                          </motion.a>
                        ) : (
                          <span className="text-gray-500 italic">Not Available</span>
                        )}
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center">
                      <ClipboardList className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-300">No forms found</h3>
                      <p className="mt-2 text-gray-500">Try adjusting your search or filter criteria</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </motion.div>
        </section>

        {/* Footer */}
        {/* <footer className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <div className="font-bold text-lg text-[#FFE01B]">TalentConnect</div>
              <p className="text-sm text-gray-400 mt-1">Connecting talent with opportunity</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
              <a href="#" className="text-gray-400 hover:text-white text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm">Contact Us</a>
            </div>
            
            <div className="mt-4 md:mt-0 text-sm text-gray-500">
              © {new Date().getFullYear()} TalentConnect. All rights reserved.
            </div>
          </div>
        </footer> */}
      </div>
    </div>
  )
}