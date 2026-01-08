"use client"

import { client } from "../../sanity/lib/client"
import Image from "next/image"
import Link from "next/link"
import { motion, type Variants } from "framer-motion"
import { useState, useEffect } from "react"
import { Search, ArrowRight } from "lucide-react"

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

// Category and Subcategory data structure
const categoryData = {
  "Marketing": [
    "Meta Ads (Facebook & Instagram Ads)",
    "Google Ads (Search, Display, YouTube)",
    "TikTok Ads",
    "LinkedIn Ads",
    "Media Buying",
    "Conversion Optimisation"
  ],
  "Social Media Marketing": [
    "Social Media Management",
    "Content Strategy",
    "Content Calendar",
    "Engagement Growth",
    "Community Management"
  ],
  "SEO & Content": [
    "SEO (Technical, On-page, Off-page)",
    "Keyword Research",
    "Blog Writing",
    "Website Copywriting",
    "Link Building",
    "Local SEO",
    "Ecommerce SEO"
  ],
  "Email & CRM": [
    "Email Marketing",
    "Automation & Flows (Klaviyo, Mailchimp, Hubspot, GHL)",
    "Lead Nurturing",
    "CRM Setup",
    "Drip Campaigns"
  ],
  "Influencer & Partnerships": [
    "Influencer Outreach",
    "Partnership Strategy",
    "Affiliate Marketing"
  ],
  "Brand & Creative Strategy": [
    "Brand Positioning",
    "Campaign Strategy",
    "Marketing Research",
    "Competitor Analysis"
  ],
  "Analytics & Data": [
    "GA4",
    "GTM",
    "Dashboard & Reporting",
    "Attribution & Tracking",
    "CRO Audit"
  ],
  "Growth & GTM": [
    "Growth Strategy",
    "Product Launch Strategy",
    "Funnel Setup",
    "Cold Email Outreach",
    "Lead Generation"
  ],
  "GoHighLevel": [
    "GHL Setup",
    "Workflow Automations",
    "Pipelines & CRM Setup",
    "Funnel Building",
    "Calendar & Appointment Setup",
    "Email & SMS Automation",
    "Form & Survey Setup",
    "Memberships & Courses Setup",
    "Integrations & API",
    "Snapshots Creation",
    "White-label Support"
  ],
  "Shopify": [
    "Store Setup",
    "Theme Customisation",
    "Shopify Liquid Development",
    "App Integrations",
    "Checkout & Cart Optimisation",
    "Speed Optimisation",
    "Product & Collection Setup",
    "Store Migration",
    "Conversion Rate Optimisation",
    "Landing Page Development",
    "Shopify Analytics & Reporting"
  ],
  "Fractional CMO": [
    "Marketing Strategy",
    "GTM Planning",
    "Team & Budget Management",
    "Brand Positioning & Messaging",
    "Performance Team Oversight",
    "Marketing Audits",
    "Growth Roadmaps",
    "Campaign Planning",
    "OKRs & KPI Tracking"
  ],
  "Video Editing": [
    "Short-form Editing (Reels & TikTok)",
    "Long-form Editing (YouTube)",
    "Cinematic Commercials",
    "Podcast Editing",
    "Motion Graphics",
    "Color Grading",
    "Sound Design",
    "Text & Captions",
    "Product & UGC Editing",
    "VFX & Compositing"
  ],
  "Creatives": [
    "Static Graphic Design",
    "Ad Creatives",
    "Social Media Creatives",
    "Brand Identity",
    "Infographics",
    "Pitch Deck Design",
    "Website UI Design",
    "Presentation Design",
    "Print & Packaging Design",
    "Illustration"
  ],
  "UI UX Design": [
    "User Interface Design",
    "User Experience Design",
    "Wireframing",
    "Prototyping",
    "Design Systems",
    "Mobile App Design",
    "Web App Design",
    "User Research",
    "Usability Testing",
    "Figma Design",
    "Interaction Design"
  ],
  "Website Development": [
    "Frontend Development",
    "Backend Development",
    "Full Stack Development",
    "WordPress Development",
    "Landing Page Development",
    "Webflow Development",
    "Custom Web Apps",
    "API Integrations",
    "Database Setup",
    "Hosting & Deployment",
    "Bug Fixes & Maintenance"
  ],
  "No-code & Automation": [
    "Make.com",
    "Zapier",
    "Bubble.io",
    "Webflow Automations",
    "Airtable Workflows",
    "Notion Workspaces",
    "CRM Automations",
    "WhatsApp Automation",
    "Workflow Mapping",
    "Internal Tool Building",
    "Automation Dashboards",
    "n8n Automations"
  ]
}

// Get all categories
const categories = Object.keys(categoryData)

// Get all subcategories (flattened for "All Subcategories")
const allSubcategories = Array.from(new Set(
  Object.values(categoryData).flat()
))

// Industries
const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Gaming",
  "Education",
  "Arts & Entertainment",
]

export default function CaseStudiesPage() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)

  // Get subcategories based on selected category
  const getFilteredSubcategories = () => {
    if (!selectedCategory) return allSubcategories
    return categoryData[selectedCategory as keyof typeof categoryData] || []
  }

  // When category changes, reset subcategory
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category)
    setSelectedSubcategory(null) // Reset subcategory when category changes
  }

  // Filtering logic
  // const filteredCaseStudies = caseStudies.filter((study) => {
  //   // Industry filter
  //   const matchesIndustry = selectedIndustry
  //     ? study.tags?.some((tag) =>
  //       tag.toLowerCase().includes(selectedIndustry.toLowerCase())
  //     ) ||
  //     study.title?.toLowerCase().includes(selectedIndustry.toLowerCase()) ||
  //     study.description?.toLowerCase().includes(selectedIndustry.toLowerCase())
  //     : true

  //   // Category filter
  //   const matchesCategory = selectedCategory
  //     ? study.tags?.some((tag) =>
  //       tag.toLowerCase().includes(selectedCategory.toLowerCase())
  //     ) ||
  //     study.title?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
  //     study.description?.toLowerCase().includes(selectedCategory.toLowerCase())
  //     : true

  //   // Subcategory filter
  //   const matchesSubcategory = selectedSubcategory
  //     ? study.tags?.some((tag) =>
  //       tag.toLowerCase().includes(selectedSubcategory.toLowerCase())
  //     ) ||
  //     study.title?.toLowerCase().includes(selectedSubcategory.toLowerCase()) ||
  //     study.description?.toLowerCase().includes(selectedSubcategory.toLowerCase())
  //     : true

  //   return matchesIndustry && matchesCategory && matchesSubcategory
  // })

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

  // Simplified filtering logic
  const filteredCaseStudies = caseStudies.filter((study) => {
    // If no service is selected, show all
    if (!selectedCategory) return true;

    // Check if the selected service appears in tags, title, or description
    return (
      study.tags?.some((tag) =>
        tag.toLowerCase().includes(selectedCategory.toLowerCase())
      ) ||
      study.title?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      study.description?.toLowerCase().includes(selectedCategory.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf4e5] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="w-12 h-12 border-4 border-[#FFE01B] border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (!caseStudies || caseStudies.length === 0) {
    return (
      <div className="min-h-screen bg-[#fbf5e5] text-white overflow-hidden ">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              rotate: {
                duration: 30,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              },
              scale: {
                duration: 12,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              },
            }}
            className="absolute -top-40 -right-40 w-80 h-80 bg-[#FFE01B] opacity-10 rounded-full"
          />
        </div>

        <div className="relative max-w-5xl mx-auto py-20 px-4 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-8"
          >
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

      {/* SEARCH & FILTER - UPDATED WITH 3 SECTIONS */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
        <div className="bg-[#f0eadd] rounded-2xl p-6 border border-[#050504]/10">
          {/* Filter Title */}
          <div className="text-center mb-6">
            <h3 className="text-3xl font-medium text-[#050504]">Filter by Service</h3>
            <p className="text-sm text-[#31302f] mt-1">
              Select a service to view relevant case studies
            </p>
          </div>

          {/* Service Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { value: null, label: 'All Services', icon: '🌟' },
              { value: 'GoHighLevel', label: 'GoHighLevel', icon: '🚀' },
              { value: 'Shopify', label: 'Shopify', icon: '🛒' },
              { value: 'SEO', label: 'SEO', icon: '🔍' },
              { value: 'Video Editing', label: 'Video Editing', icon: '🎬' },
            ].map((service) => (
              <button
                key={service.value || 'all'}
                onClick={() => setSelectedCategory(service.value)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-200border
            ${selectedCategory === service.value
                    ? 'bg-[#f7af00] text-[#050504] border-[#f7af00] shadow-sm'
                    : 'bg-[#faf4e5] text-[#050504] border-[#050504]/20 hover:bg-[#faf4e5]/80 hover:border-[#f7af00]'
                  }
          `}
              >
                <span className="text-lg">{service.icon}</span>
                {service.label}
                {selectedCategory === service.value && (
                  <span className="ml-1 text-sm">✓</span>
                )}
              </button>
            ))}
          </div>

          {/* Active Filter Display */}
          {selectedCategory && (
            <div className="mt-6 pt-6 border-t border-[#050504]/10 flex items-center justify-center">
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#31302f]">Active filter:</span>
                <span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#f7af00] text-[#050504] rounded-full">
                  {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="ml-1 hover:text-red-600 transition-colors"
                    aria-label="Clear filter"
                  >
                    ×
                  </button>
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CASE STUDY GRID */}
      <section className="max-w-7xl mx-auto px-4 pb-24">
        {filteredCaseStudies.length === 0 ? (
          <div className="text-center py-20">
            <Search className="w-10 h-10 mx-auto mb-4 text-[#31302f]" />
            <p className="text-[#31302f]">No case studies match your filters.</p>
            <button
              onClick={() => {
                setSelectedIndustry(null)
                setSelectedCategory(null)
                setSelectedSubcategory(null)
              }}
              className="
                mt-4
                px-4 py-2
                text-[#050504]
                bg-[#f0eadd]
                border border-[#050504]/20
                rounded-lg
                hover:bg-[#f7af00]/20
                transition-colors
              "
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            {/* Results count */}
            {/* Results count */}
            <div className="mb-8">
              <p className="text-[#31302f]">
                Showing {filteredCaseStudies.length} case study
                {filteredCaseStudies.length !== 1 ? 'ies' : ''}
                {selectedCategory && ` • Service: ${selectedCategory}`}
              </p>
            </div>

            {/* Case Studies Grid */}
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
                    <h3 className="text-xl font-bold leading-snug">{study.title}</h3>

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
          </>
        )}
      </section>
    </div>
  )
}