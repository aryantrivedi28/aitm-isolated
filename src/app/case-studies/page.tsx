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
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Gaming",
    "Education",
    "Arts & Entertainment",
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
    "Healthcare Services", // new
    // "Wellness Services", // new
    "Predictive Modeling", // new
    "Artificial Intelligence", // new
    "Machine Learning", // new
    "Flutter Development", // new
    "Firebase Integration", // new
    // "State Management", // new
    "UI/UX Overhaul", // new
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
    <div className="min-h-screen bg-[#faf4e5] text-[#050504] pt-[140px]">

      {/* HERO SECTION */}
      <section className="relative bg-[#faf4e5] overflow-hidden">
        <div className="relative max-w-full mx-auto px-6 py-28 grid grid-cols-1 items-center">

          {/* CENTERED CONTENT */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-8 text-center flex flex-col items-center"
          >
            <motion.h1
              variants={fadeUp}
              className="text-4xl md:text-6xl font-medium leading-tight"
            >
              Stories Behind
              <br />
              Products That
              <span className="relative inline-block ml-3">
                Scaled
                <span className="absolute left-0 -bottom-2 w-full h-[6px] bg-[#f7af00] rounded-full" />
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg md:text-xl text-[#31302f] max-w-xl mx-auto"
            >
              Explore real-world case studies showcasing how thoughtful design,
              technology, and strategy helped teams grow faster and smarter.
            </motion.p>
          </motion.div>

        </div>
      </section>




      {/* SEARCH & FILTER (KEPT + IMPROVED) */}
      <section className="max-w-6xl mx-auto px-4 mb-20">
        <div className="bg-[#f0eadd] rounded-2xl p-6 border border-[#050504]/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label className="block text-sm font-semibold mb-2">
                Industry
              </label>
              <select
                value={selectedIndustry || ""}
                onChange={(e) => setSelectedIndustry(e.target.value || null)}
                className="
                w-full
                px-4 py-3
                rounded-xl
                bg-[#faf4e5]
                border border-[#050504]/20
                text-[#050504]
                focus:outline-none
                focus:border-[#f7af00]
              "
              >
                <option value="">All Industries</option>
                {industries.map(i => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Service
              </label>
              <select
                value={selectedService || ""}
                onChange={(e) => setSelectedService(e.target.value || null)}
                className="
                w-full
                px-4 py-3
                rounded-xl
                bg-[#faf4e5]
                border border-[#050504]/20
                text-[#050504]
                focus:outline-none
                focus:border-[#f7af00]
              "
              >
                <option value="">All Services</option>
                {services.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

          </div>
        </div>
      </section>

      {/* CASE STUDY GRID */}
      <section className="max-w-7xl mx-auto px-4 pb-24">
        {filteredCaseStudies.length === 0 ? (
          <div className="text-center py-20">
            <Search className="w-10 h-10 mx-auto mb-4 text-[#31302f]" />
            <p className="text-[#31302f]">
              No case studies match your filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCaseStudies.map((study, i) => (
              <motion.article
                key={study._id}
                variants={scaleIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="
                bg-[#f0eadd]
                rounded-2xl
                overflow-hidden
                border border-[#050504]/10
                hover:border-[#f7af00]
                transition-all
                hover:-translate-y-1
              "
              >
                {/* IMAGE */}
                <div className="relative h-48">
                  {study.mainImage?.asset?.url ? (
                    <Image
                      src={study.mainImage.asset.url}
                      alt={study.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full bg-[#faf4e5]" />
                  )}
                </div>

                {/* CONTENT */}
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold leading-snug">
                    {study.title}
                  </h3>

                  <p className="text-sm text-[#31302f] line-clamp-2">
                    {study.description}
                  </p>

                  {/* TAGS */}
                  {study.tags && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {study.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="
                          text-xs
                          px-3 py-1
                          rounded-full
                          bg-[#faf4e5]
                          border border-[#050504]/10
                          text-[#050504]
                        "
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <Link
                    href={`/case-studies/${study.slug.current}`}
                    className="
                    inline-flex
                    items-center
                    gap-2
                    pt-4
                    font-semibold
                    text-[#050504]
                    hover:gap-3
                    transition-all
                  "
                  >
                    View Case Study
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
