"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  User,
  Briefcase,
  FileText,
  DollarSign,
  Layers,
  Wrench,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react"

type CategoryOptionsType = typeof categoryOptions

const categoryOptions = {
  Development: {
    subcategories: [
      "Frontend",
      "Backend",
      "Full Stack",
      "Mobile App Development",
      "Game Development",
      "Blockchain",
      "Embedded Systems",
    ],
    techStacks: [
      "React",
      "Vue",
      "Angular",
      "Node.js",
      "Python",
      "Java",
      "PHP",
      ".NET",
      "React Native",
      "Flutter",
      "Unity",
      "Unreal Engine",
      "Rust",
      "Solidity",
    ],
    tools: {
      React: ["Redux", "Next.js", "Material-UI", "Styled Components", "TypeScript"],
      Vue: ["Vuex", "Nuxt.js", "Vuetify", "Vue Router", "TypeScript"],
      Angular: ["NgRx", "Angular Material", "TypeScript", "RxJS", "Ionic"],
      "Node.js": ["Express", "MongoDB", "PostgreSQL", "Redis", "Socket.io"],
      Python: ["Django", "Flask", "FastAPI", "PostgreSQL", "MongoDB"],
      Java: ["Spring Boot", "Hibernate", "Maven", "PostgreSQL", "Redis"],
      PHP: ["Laravel", "Symfony", "MySQL", "PostgreSQL", "Redis"],
      ".NET": ["ASP.NET Core", "Entity Framework", "SQL Server", "Azure", "C#"],
      "React Native": ["Expo", "Redux", "AsyncStorage", "React Navigation", "TypeScript"],
      Flutter: ["Dart", "Firebase", "Provider", "Bloc", "GetX"],
      Unity: ["C#", "Photon", "DOTS", "Unity Analytics", "Shader Graph"],
      "Unreal Engine": ["Blueprints", "C++", "Niagara", "MetaHuman", "Sequencer"],
      Solidity: ["Truffle", "Hardhat", "Remix", "Ganache", "Web3.js"],
    },
  },
  Design: {
    subcategories: ["UI/UX", "Graphic Design", "Web Design", "Product Design", "Motion Graphics", "3D Design"],
    techStacks: ["Figma", "Adobe XD", "Sketch", "Photoshop", "Illustrator", "After Effects", "Blender"],
    tools: {
      Figma: ["Auto Layout", "Components", "Prototyping", "Design Systems", "Plugins"],
      "Adobe XD": ["Prototyping", "Voice Prototyping", "Auto-Animate", "Repeat Grid", "Plugins"],
      Sketch: ["Symbols", "Libraries", "Prototyping", "Plugins", "Abstract"],
      Photoshop: ["Layer Styles", "Smart Objects", "Actions", "Brushes", "Filters"],
      Illustrator: ["Vector Graphics", "Typography", "Logos", "Icons", "Illustrations"],
      "After Effects": ["Motion Graphics", "VFX", "Keyframes", "Expressions", "Compositing"],
      Blender: ["Modeling", "Animation", "UV Mapping", "Rendering", "Sculpting"],
    },
  },
  Data: {
    subcategories: ["Data Science", "Data Analysis", "Machine Learning", "AI", "Big Data", "ETL"],
    techStacks: ["Python", "R", "SQL", "Tableau", "Power BI", "TensorFlow", "PyTorch", "Apache Spark"],
    tools: {
      Python: ["Pandas", "NumPy", "Matplotlib", "Seaborn", "Scikit-learn"],
      R: ["ggplot2", "dplyr", "tidyr", "Shiny", "RMarkdown"],
      SQL: ["PostgreSQL", "MySQL", "MongoDB", "BigQuery", "Snowflake"],
      Tableau: ["Dashboard", "Stories", "Calculations", "Parameters", "Actions"],
      TensorFlow: ["Keras", "TensorBoard", "TFX", "TensorFlow Lite", "TensorFlow.js"],
      "Apache Spark": ["PySpark", "Spark SQL", "MLlib", "Streaming", "GraphX"],
    },
  },
  Marketing: {
    subcategories: [
      "Digital Marketing",
      "SEO",
      "Content Marketing",
      "Social Media Marketing",
      "Email Marketing",
      "Paid Ads",
    ],
    techStacks: ["Google Ads", "Facebook Ads", "HubSpot", "Hootsuite", "Buffer", "Mailchimp"],
    tools: {
      "Google Ads": ["Keyword Planner", "Ad Extensions", "Smart Bidding", "Conversion Tracking"],
      HubSpot: ["CRM", "Marketing Automation", "Landing Pages", "Workflows", "Lead Scoring"],
      Mailchimp: ["Campaigns", "A/B Testing", "Segmentation", "Automations"],
    },
  },
  Content: {
    subcategories: ["Copywriting", "Blog Writing", "Technical Writing", "Script Writing", "Proofreading"],
    techStacks: ["Grammarly", "Hemingway", "SurferSEO", "Google Docs"],
    tools: {
      Grammarly: ["Grammar Check", "Plagiarism Check", "Tone Adjustment"],
      Hemingway: ["Readability", "Clarity", "Sentence Structure"],
      SurferSEO: ["Content Editor", "Keyword Analysis", "Audit"],
    },
  },
  Video: {
    subcategories: ["Video Editing", "Animation", "YouTube Editing", "Short Videos", "Corporate Videos"],
    techStacks: ["Adobe Premiere Pro", "Final Cut Pro", "After Effects", "DaVinci Resolve"],
    tools: {
      "Adobe Premiere Pro": ["Transitions", "Effects", "Color Correction", "Audio Sync"],
      "Final Cut Pro": ["Magnetic Timeline", "Motion Graphics", "Color Grading"],
    },
  },
} as const

export default function DirectHiringPage() {
  const [step, setStep] = useState<1 | 2>(1)
  const router = useRouter()

  const [clientDetails, setClientDetails] = useState({
    name: "",
    company_name: "",
    website: "",
    industry: "",
    phone: "",
  })

  const [hiringDetails, setHiringDetails] = useState({
    role_type: "freelancer",
    job_title: "",
    description: "",
    budget_range: "",
    categories: [] as string[],
    subcategories: [] as string[],
    tools: [] as string[],
  })

  useEffect(() => {
    async function fetchClient() {
      try {
        const res = await fetch("/api/client/me", { credentials: "include" })
        const data = await res.json()

        if (data?.client) {
          setClientDetails({
            name: data.client.name || "",
            company_name: data.client.company_name || "",
            website: data.client.website || "",
            industry: data.client.industry || "",
            phone: data.client.phone || "",
          })
        }

        if (data?.exists) setStep(2)
      } catch (err) {
        console.error("[v0] Error fetching client:", err)
      }
    }
    fetchClient()
  }, [])

  const handleClientSubmit = async () => {
    try {
      const res = await fetch("/api/client/details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientDetails),
        credentials: "include",
      })
      const data = await res.json()
      if (data.success) {
        setStep(2)
      }
    } catch (err) {
      console.error("[v0] client submit error:", err)
    }
  }

  const handleCreateForm = async () => {
    try {
      const form_id = `client-${crypto.randomUUID().slice(0, 8)}`
      const form_name = `${hiringDetails.categories[0] || "General"} Hiring Form`
      const form_description =
        hiringDetails.description || `Auto-generated form for ${hiringDetails.categories[0] || "client"} hiring`
      const industry = "Client Projects"

      const payload = {
        form_id,
        form_name,
        form_description,
        industry,
        category: hiringDetails.categories,
        subcategory: hiringDetails.subcategories,
        tech_stack: [],
        tools: hiringDetails.tools,
        required_fields: ["name", "email", "phone", "resume_link"],
        custom_questions: [],
      }

      console.log("[v0] Creating form with payload:", payload)

      const res = await fetch("/api/client/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      })

      const result = await res.json()

      if (!res.ok) {
        console.error("[v0] Form creation failed:", result.error)
        alert(`Form creation failed: ${result.error || "Unknown error"}`)
        return false
      }

      console.log("[v0] Form created successfully:", result.data)

      if (!result.data || result.data.length === 0) {
        console.error("[v0] Form creation returned no data")
        alert("Form creation failed - no data returned")
        return false
      }

      console.log("[v0] Form stored in database")
      return true
    } catch (err: any) {
      console.error("[v0] Error in form creation:", err)
      alert(`Error creating form: ${err.message}`)
      return false
    }
  }

  const handleHiringSubmit = async () => {
    try {
      const payload = {
        role_type: hiringDetails.role_type,
        job_title: hiringDetails.job_title,
        description: hiringDetails.description,
        budget_range: hiringDetails.budget_range,
        category: hiringDetails.categories,
        subcategory: hiringDetails.subcategories,
        tools: hiringDetails.tools,
      }

      console.log("[v0] Submitting hiring request:", payload)

      const res = await fetch("/api/client/hiring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      })
      const data = await res.json()
      console.log("[v0] Hiring request response:", data)
    } catch (err) {
      console.error("[v0] Hiring request error (non-blocking):", err)
    }
  }

  const handleSubmitAll = async () => {
    try {
      console.log("[v0] Starting form and hiring submission process")

      const formCreated = await handleCreateForm()
      if (!formCreated) {
        console.error("[v0] Form creation failed, aborting submission")
        return
      }

      await handleHiringSubmit()

      console.log("[v0] Form and hiring submission completed successfully")

      router.push("/find-talent/client/dashboard")
    } catch (err: any) {
      console.error("[v0] Error in submission process:", err)
      alert(`Error: ${err.message}`)
    }
  }

  const toggleSelect = (arr: string[], value: string) => {
    if (arr.includes(value)) return arr.filter((v) => v !== value)
    return [...arr, value]
  }

  const getAvailableSubcategories = () =>
    hiringDetails.categories.length === 1
      ? categoryOptions[hiringDetails.categories[0] as keyof CategoryOptionsType]?.subcategories || []
      : []

  const getAvailableToolsMerged = () => {
    if (hiringDetails.categories.length === 1) {
      const cat = hiringDetails.categories[0] as keyof CategoryOptionsType
      const { techStacks = [], tools = {} as Record<string, string[]> } = categoryOptions[cat] ?? {}
      const merged: string[] = [...techStacks]
      Object.values(tools).forEach((arr) => merged.push(...arr))
      return Array.from(new Set(merged))
    }
    return []
  }

  return (
    <>
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -20px); }
        }
        .animate-float { animation: float 20s ease-in-out infinite; }
      `}</style>

      <div className="min-h-screen flex items-center justify-center bg-[#fbf5e5] px-4 py-8 relative overflow-hidden pt-[100px] sm:pt-[120px]">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 right-10 w-64 h-64 bg-[#FFE01B]/10 rounded-full blur-3xl animate-float" />
          <div
            className="absolute bottom-20 left-10 w-80 h-80 bg-[#FCD34D]/10 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "5s" }}
          />
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 w-full max-w-3xl border-2 border-[#241C15]/10 relative overflow-hidden">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-[#241C15]/70">Step {step} of 2</span>
              <span className="text-sm font-semibold text-[#241C15]/70">{step === 1 ? "50%" : "100%"}</span>
            </div>
            <div className="h-2 bg-[#241C15]/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#FFE01B] to-[#FCD34D] transition-all duration-500 ease-out"
                style={{ width: step === 1 ? "50%" : "100%" }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.4 }}
              >
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-[#241C15] px-4 py-2 rounded-full mb-6">
                  <User className="w-4 h-4 text-[#FFE01B]" />
                  <span className="text-sm font-semibold text-[#fbf5e5]">Client Information</span>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 text-[#241C15]">
                  Tell Us About
                  <span className="block bg-gradient-to-r from-[#FFE01B] to-[#FCD34D] bg-clip-text text-transparent mt-1">
                    Your Company
                  </span>
                </h2>
                <p className="text-[#241C15]/70 mb-8 text-sm sm:text-base font-medium">
                  We need some basic information to get started
                </p>

                <div className="space-y-5">
                  {Object.entries(clientDetails).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-[#241C15] text-sm font-semibold mb-2">
                        {key.replace("_", " ").toUpperCase()}
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        className="border-2 border-[#241C15]/20 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-[#FFE01B] focus:border-[#FFE01B] outline-none transition-all bg-[#fbf5e5] text-[#241C15]"
                        placeholder={`Enter your ${key.replace("_", " ")}`}
                        value={value}
                        onChange={(e) =>
                          setClientDetails({
                            ...clientDetails,
                            [key]: e.target.value,
                          })
                        }
                      />
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleClientSubmit}
                  className="mt-8 bg-gradient-to-r from-[#FFE01B] to-[#FCD34D] text-[#241C15] px-8 py-4 rounded-xl font-bold w-full flex items-center justify-center gap-2 transition transform hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-xl"
                >
                  Continue to Job Details <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
              >
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-[#241C15] px-4 py-2 rounded-full mb-6">
                  <Briefcase className="w-4 h-4 text-[#FFE01B]" />
                  <span className="text-sm font-semibold text-[#fbf5e5]">Job Requirements</span>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 text-[#241C15]">
                  Describe Your
                  <span className="block bg-gradient-to-r from-[#FFE01B] to-[#FCD34D] bg-clip-text text-transparent mt-1">
                    Hiring Needs
                  </span>
                </h2>
                <p className="text-[#241C15]/70 mb-6 text-sm sm:text-base font-medium">
                  Help us match you with the perfect talent
                </p>

                {/* Role Type Selector */}
                <div className="mb-6">
                  <label className="block text-[#241C15] text-sm font-semibold mb-2">
                    Role Type <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["freelancer", "intern", "fulltime"].map((rt) => (
                      <button
                        key={rt}
                        type="button"
                        onClick={() => setHiringDetails({ ...hiringDetails, role_type: rt as any })}
                        className={`px-4 py-2.5 rounded-xl border-2 transition-all font-semibold text-sm ${
                          hiringDetails.role_type === rt
                            ? "bg-gradient-to-r from-[#FFE01B] to-[#FCD34D] text-[#241C15] border-[#FFE01B] shadow-md"
                            : "bg-white text-[#241C15]/70 border-[#241C15]/20 hover:border-[#FFE01B] hover:bg-[#fbf5e5]"
                        }`}
                        aria-pressed={hiringDetails.role_type === rt}
                      >
                        {rt === "freelancer" ? "Freelancer" : rt === "intern" ? "Intern" : "Full-time"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Role Type Display */}
                <div className="mb-6 p-4 border-2 border-[#FFE01B]/30 rounded-xl bg-[#FFE01B]/10 flex items-center gap-3">
                  <FileText className="w-5 h-5 text-[#241C15]" />
                  <div>
                    <span className="text-sm text-[#241C15]/70 font-medium">Selected:</span>
                    <span className="ml-2 font-bold text-[#241C15] capitalize">{hiringDetails.role_type}</span>
                  </div>
                </div>

                <div className="space-y-5 mb-6">
                  {/* Job Title */}
                  <div>
                    <label className="block text-[#241C15] text-sm font-semibold mb-2">
                      Job Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="border-2 border-[#241C15]/20 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-[#FFE01B] focus:border-[#FFE01B] outline-none transition-all bg-[#fbf5e5] text-[#241C15]"
                      placeholder="e.g. Senior React Developer"
                      value={hiringDetails.job_title}
                      onChange={(e) =>
                        setHiringDetails({
                          ...hiringDetails,
                          job_title: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-[#241C15] text-sm font-semibold mb-2">
                      Job Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      className="border-2 border-[#241C15]/20 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-[#FFE01B] focus:border-[#FFE01B] outline-none transition-all bg-[#fbf5e5] text-[#241C15] resize-none"
                      placeholder="Describe the role, responsibilities, and requirements..."
                      rows={4}
                      value={hiringDetails.description}
                      onChange={(e) =>
                        setHiringDetails({
                          ...hiringDetails,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Budget */}
                  <div>
                    <label className="block text-[#241C15] text-sm font-semibold mb-2">
                      Budget Range <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-[#241C15]/40 w-5 h-5" />
                      <input
                        className="border-2 border-[#241C15]/20 rounded-xl pl-11 pr-4 py-3 w-full focus:ring-2 focus:ring-[#FFE01B] focus:border-[#FFE01B] outline-none transition-all bg-[#fbf5e5] text-[#241C15]"
                        placeholder="e.g. $3000 - $5000/month"
                        value={hiringDetails.budget_range}
                        onChange={(e) =>
                          setHiringDetails({
                            ...hiringDetails,
                            budget_range: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <label className="mb-3 font-bold text-[#241C15] flex items-center gap-2 text-base">
                    <Layers className="w-5 h-5 text-[#FFE01B]" /> Select Category
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(categoryOptions).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() =>
                          setHiringDetails({
                            ...hiringDetails,
                            categories: toggleSelect(hiringDetails.categories, cat),
                            subcategories: [],
                            tools: [],
                          })
                        }
                        className={`px-4 py-2.5 rounded-xl border-2 transition-all font-semibold text-sm ${
                          hiringDetails.categories.includes(cat)
                            ? "bg-gradient-to-r from-[#FFE01B] to-[#FCD34D] text-[#241C15] border-[#FFE01B] shadow-md"
                            : "bg-white text-[#241C15]/70 border-[#241C15]/20 hover:border-[#FFE01B] hover:bg-[#fbf5e5]"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subcategories */}
                {getAvailableSubcategories().length > 0 && (
                  <div className="mb-6">
                    <label className="mb-3 font-bold text-[#241C15] flex items-center gap-2 text-base">
                      <Wrench className="w-5 h-5 text-[#FFE01B]" /> Specialization
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {getAvailableSubcategories().map((sub) => (
                        <button
                          key={sub}
                          type="button"
                          onClick={() =>
                            setHiringDetails({
                              ...hiringDetails,
                              subcategories: toggleSelect(hiringDetails.subcategories, sub),
                            })
                          }
                          className={`px-4 py-2 rounded-xl border-2 transition-all font-medium text-sm ${
                            hiringDetails.subcategories.includes(sub)
                              ? "bg-[#FFE01B] text-[#241C15] border-[#FFE01B]"
                              : "bg-white text-[#241C15]/70 border-[#241C15]/20 hover:border-[#FFE01B] hover:bg-[#fbf5e5]"
                          }`}
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tools */}
                {getAvailableToolsMerged().length > 0 && (
                  <div className="mb-6">
                    <label className="mb-3 font-bold text-[#241C15] flex items-center gap-2 text-base">
                      <Wrench className="w-5 h-5 text-[#FFE01B]" /> Required Skills / Tech Stack
                    </label>
                    <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto p-2 bg-[#fbf5e5] rounded-xl border-2 border-[#241C15]/10">
                      {getAvailableToolsMerged().map((tool) => (
                        <button
                          key={tool}
                          type="button"
                          onClick={() =>
                            setHiringDetails({
                              ...hiringDetails,
                              tools: toggleSelect(hiringDetails.tools, tool),
                            })
                          }
                          className={`px-3 py-2 rounded-lg border-2 transition-all font-medium text-sm ${
                            hiringDetails.tools.includes(tool)
                              ? "bg-[#FFE01B] text-[#241C15] border-[#FFE01B]"
                              : "bg-white text-[#241C15]/70 border-[#241C15]/20 hover:border-[#FFE01B]"
                          }`}
                        >
                          {tool}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
                  <button
                    onClick={() => setStep(1)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white border-2 border-[#241C15]/20 text-[#241C15] font-semibold transition hover:bg-[#fbf5e5] hover:border-[#241C15]/40 active:scale-95"
                  >
                    <ArrowLeft className="w-5 h-5" /> Back
                  </button>
                  <button
                    onClick={handleSubmitAll}
                    className="w-full flex-1 bg-gradient-to-r from-[#FFE01B] to-[#FCD34D] text-[#241C15] px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition transform hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-xl"
                  >
                    Submit Request <CheckCircle2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}
