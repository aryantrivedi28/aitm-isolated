"use client"

import { client } from "../../sanity/lib/client"
import Image from "next/image"
import Link from "next/link"
import { motion, type Variants } from "framer-motion"
import { useState, useEffect, useMemo } from "react"
import { Search, ArrowRight, Calendar, Eye, Sparkles, TrendingUp, Users, Target } from "lucide-react"

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

type FilterBarProps = {
  selectedIndustry: string
  setSelectedIndustry: (value: string) => void
  selectedService: string
  setSelectedService: (value: string) => void
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

const industryOptions = [
  "All",
  "Finance",
  "Healthcare",
  "E-commerce",
  "Education",
  "Travel",
  "Technology",
  "Real Estate",
  "Retail",
  "Logistics",
  "Insurance",
  "Entertainment",
  "Automotive",
  "Food & Beverage",
  "Energy",
  "Telecom",
  "Legal",
  "Media",
]

const serviceOptions = [
  "All",
  "Design",
  "Development",
  "AI",
  "Marketing",
  "Video",
  "Branding",
  "Consulting",
  "SEO",
  "Strategy",
]

interface CaseStudy {
  _id: string
  title: string
  description: string
  slug: { current: string }
  tags?: string[]
  mainImage: { asset: { url: string } }
  _createdAt: string
}

export default function CaseStudiesPage() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);

const industries = [
  "Technology", 
  "Healthcare", 
  "Finance", 
  "Gaming", 
  "Education", 
  "Arts & Entertainment",
  // "FMCG", // could be used for future brand growth case studies
  // "Sports, Outdoors & Fitness", // consider later for sports analytics
  // "EdTech Media", // future use
  // "FinTech", // already covered under Finance
  // "Wellness", // could relate to healthcare services
];

const services = [
  "Web Development", 
  "SEO", 
  "CRO", 
  "Social Media Management", 
  // "Email Marketing", 
  "Marketing Strategy", 
  // "SMS Marketing", 
  // "Content Marketing", 
  "Copywriting", 
  "Video Production", 
  "Graphic Design", 
  "UI/UX Design", 
  "App Development",
  // "Instagram Growth", // new
  "Short-form Content", // new
  // "Storytelling", // new
  "Brand Growth", // new
  "Pitch Deck Design", // new
  "Investor Pitch Design", // new
  // "Market Research", // new
  "Business Communication", // new
  // "Fundraising Support", // new
  // "Structured Narrative", // new
  "Real-time Chat", // new
  "Mobile UX", // new
  // "Performance Optimization", // new
  // "Messaging Integration", // new
  // "Content Strategy", // new
  // "Cash Flow Management", // new
  "Healthcare Services", // new
  // "Wellness Services", // new
  "Predictive Modeling", // new
  "Artificial Intelligence", // new
  "Machine Learning", // new
  "Flutter Development", // new
  "Firebase Integration", // new
  // "State Management", // new
  "UI/UX Overhaul", // new
  // "Conversion Optimization", // new
  // "Apple Optimization", // future
  // "Public Relations", // future
  // "Paid Ads", // future
  // "Google Shopping", // future
];



  // Filtering logic
  const filteredCaseStudies = caseStudies.filter(study => {
    const matchesIndustry = selectedIndustry
      ? (
        study.tags?.some(tag => tag.toLowerCase().includes(selectedIndustry.toLowerCase())) ||
        study.title?.toLowerCase().includes(selectedIndustry.toLowerCase()) ||
        study.description?.toLowerCase().includes(selectedIndustry.toLowerCase())
      )
      : true;

    const matchesService = selectedService
      ? (
        study.tags?.some(tag => tag.toLowerCase().includes(selectedService.toLowerCase())) ||
        study.title?.toLowerCase().includes(selectedService.toLowerCase()) ||
        study.description?.toLowerCase().includes(selectedService.toLowerCase())
      )
      : true;

    return matchesIndustry && matchesService;
  });


useEffect(() => {
  async function fetchCaseStudies() {
    try {
      const studies = await client.fetch(`
        *[_type == "caseStudy" && isHidden != true] 
          | order(order asc, ranking asc, _createdAt desc) {
            _id,
            title,
            description,
            slug,
            tags,
            _createdAt,
            order,
            ranking,
            isHidden,
            mainImage {
              asset -> {
                url
              }
            }
          }
      `)
      setCaseStudies(studies || [])
    } catch (error) {
      console.error("Error fetching case studies:", error)
    } finally {
      setLoading(false)
    }
  }

  fetchCaseStudies()
}, [])

  if (loading) {
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

  if (!caseStudies || caseStudies.length === 0) {
    return (
      <div className="min-h-screen bg-[#fbf5e5] text-white overflow-hidden ">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              rotate: { duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
              scale: { duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
            }}
            className="absolute -top-40 -right-40 w-80 h-80 bg-[#FFE01B] opacity-10 rounded-full"
          />
        </div>

        <div className="relative max-w-5xl mx-auto py-20 px-4 text-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-8">
            <motion.h1 variants={fadeUp} className="text-4xl lg:text-6xl font-bold mb-4">
              Case Studies
            </motion.h1>
            <motion.p variants={fadeUp} className="text-xl text-gray-400">
              No case studies found. Please check back later.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link href="/">
                <motion.div
                  className="inline-flex items-center gap-2 bg-[#FFE01B] text-[#241C15] font-bold px-8 py-4 rounded-2xl hover:bg-yellow-300 transition-all duration-300 cursor-pointer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Back to Home
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fbf5e5] text-white overflow-hidden pt-[60px] sm:pt-[100px] lg:pt-[120px]">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
            scale: { duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-[#FFE01B] opacity-10 rounded-full"
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
          className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#FFE01B] opacity-10 rounded-full"
        />
      </div>

      {/* Hero Section */}
      <section className="relative py-12 px-4">
        <motion.div
          className="relative max-w-6xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <div className="text-center space-y-4">
            <motion.div
              className="flex items-center justify-center gap-3 mb-6"
              variants={fadeUp}
            >
              <div className="w-12 h-12 bg-[#FFE01B]/20 rounded-xl flex items-center justify-center border border-[#FFE01B]/30">
                <Sparkles className="w-6 h-6 text-[#FFE01B]" />
              </div>
              <span className="text-[#241C15] font-semibold text-lg">Portfolio</span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-5xl lg:text-7xl font-bold leading-tight"
            >
              <span className="bg-gradient-to-r from-yellow-400 to-[#FFE01B] bg-clip-text text-transparent">
                Case Studies
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            >
              Discover how Finzie transforms startups through design, engineering, and real client stories.
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* Search and Filter Section */}
      <section className="relative py-12 px-4">
        <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-3xl p-8 border border-gray-200">
          <div className="grid grid-cols-2 gap-6">
            {/* Industry Dropdown */}
            <select
              value={selectedIndustry || ""}
              onChange={(e) => setSelectedIndustry(e.target.value || null)}
              className="px-4 py-2 rounded-xl bg-gray-50 text-gray-800 border border-gray-300 focus:outline-none focus:border-[#FFE01B]"
            >
              <option value="">Industries</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>

            {/* Services Dropdown */}
            <select
              value={selectedService || ""}
              onChange={(e) => setSelectedService(e.target.value || null)}
              className="px-4 py-2 rounded-xl bg-gray-50 text-gray-800 border border-gray-300 focus:outline-none focus:border-[#FFE01B]"
            >
              <option value="">Services</option>
              {services.map(service => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
          </div>
        </div>
      </section>



      {/* Case Studies Grid */}
      <section className="relative py-12 px-4">
        <motion.div
          className="max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          {filteredCaseStudies.length === 0 ? (
            <motion.div className="text-center py-20" initial="hidden" animate="visible" variants={fadeUp}>
              <div className="w-20 h-20 bg-[#FFE01B]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-[#FFE01B]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">No Results Found</h3>
              <p className="text-gray-400 mb-8">Try adjusting your search or filter criteria</p>
              <motion.button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("All")
                }}
                className="bg-[#FFE01B] text-[#241C15] font-bold px-6 py-3 rounded-xl hover:bg-yellow-300 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Clear Filters
              </motion.button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCaseStudies.map((study, index) => (
                <motion.div
                  key={study._id}
                  initial="hidden"
                  animate="visible"
                  variants={scaleIn}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-white/30 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10 hover:border-[#FFE01B]/50 transition-all duration-500"
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FFE01B]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    {study.mainImage?.asset?.url ? (
                      <Image
                        src={study.mainImage.asset.url || "/placeholder.svg"}
                        alt={study.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gradient-to-br from-[#FFE01B]/20 to-yellow-400/20">
                        <Eye className="w-12 h-12 text-[#FFE01B]" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                    {/* Tags */}
                    {study.tags && study.tags.length > 0 && (
                      <div className="absolute top-4 left-4 flex gap-2">
                        {study.tags.slice(0, 2).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-[#FFE01B]/90 text-[#241C15] text-xs font-semibold rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="relative p-6 space-y-4">

                    <h2 className="text-xl font-bold text-black group-hover:text-[#FFE01B] transition-colors duration-300 line-clamp-2">
                      {study.title}
                    </h2>

                    <p className="text-gray-900 text-sm leading-relaxed line-clamp-3 group-hover:text-gray-300 transition-colors duration-300">
                      {study.description}
                    </p>

                    <Link href={`/case-studies/${study.slug.current}`}>
                      <motion.div
                        className="inline-flex items-center gap-2 text-[#FFE01B] font-semibold hover:gap-3 transition-all duration-300 cursor-pointer"
                        whileHover={{ x: 5 }}
                      >
                        View Case Study
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <div className="relative bg-gradient-to-r from-[#FFE01B] to-yellow-400 rounded-3xl p-16 text-[#241C15] overflow-hidden">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="absolute -bottom-20 -left-20 w-32 h-32 bg-[#241C15]/10 rounded-full"
            />

            <div className="relative z-10">
              <motion.h3
                className="text-3xl lg:text-4xl font-bold mb-6"
                initial="hidden"
                animate="visible"
                variants={fadeUp}
              >
                Ready to Create Your Success Story?
              </motion.h3>
              <motion.p
                className="text-xl opacity-80 mb-10 max-w-2xl mx-auto"
                initial="hidden"
                animate="visible"
                variants={fadeUp}
              >
                Join the ranks of successful startups who've transformed their business with Finzie's expert talent.
              </motion.p>
              <motion.div initial="hidden" animate="visible" variants={fadeUp}>
                <Link href="/client-request">
                  <motion.div
                    className="inline-flex items-center gap-3 bg-[#241C15] text-[#FFE01B] font-bold px-10 py-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Start Your Project
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    >
                      <ArrowRight className="w-6 h-6" />
                    </motion.div>
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
