"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { supabase } from "@/src/lib/SupabaseAuthClient"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { User, Mail, Phone, Linkedin, ExternalLink, FileText, ChevronRight, ChevronLeft } from "lucide-react"

type Payload = {
  full_name: string
  email: string
  phone: string
  linkedin_url: string
  resume_url: string
  portfolio_url: string
  category: string
  category_other: string
  domains: string[]
  domains_other: string
  tech_stack: string[]
  tech_other: string
  tools: string[]
  tools_other: string
  employment_status: string
  employment_other: string
  experience_level: string
  experience_other: string
}

export default function AdminABCPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [payload, setPayload] = useState<Payload>({
    full_name: "",
    email: "",
    phone: "",
    linkedin_url: "",
    resume_url: "",
    portfolio_url: "",
    category: "",
    category_other: "",
    domains: [],
    domains_other: "",
    tech_stack: [],
    tech_other: "",
    tools: [],
    tools_other: "",
    employment_status: "",
    employment_other: "",
    experience_level: "",
    experience_other: "",
  })

  // Mappings
  const categoryOptions = ["Developers", "Growth", "Designers", "AI", "VideoEditors", "Other"]
  const domainMap: Record<string, string[]> = {
    Developers: ["Frontend", "Backend", "Fullstack", "Mobile", "DevOps"],
    Growth: ["SEO", "Content", "Paid Ads", "Email Marketing", "Analytics"],
    Designers: ["UI/UX", "Graphic", "Motion / Video Editor", "Illustration", "Product"],
    AI: ["Prompt Engineering", "Agent Dev", "ML Ops", "Data", "NLP"],
    VideoEditors: ["Video Editing", "Motion Graphics", "2D Animation", "3D Animation", "VFX"],
  }

  const techMap: Record<string, string[]> = {
    Developers: [
      "React",
      "Angular",
      "Vue",
      "Svelte",
      "Ember",
      "Next.js",
      "Nuxt.js",
      "Gatsby",
      "Remix",
      "Electron",
      "Node.js",
      "Deno",
      "Express",
      "NestJS",
      "Django",
      "Flask",
      "Ruby on Rails",
      "Laravel",
      "Spring Boot",
      "ASP.NET Core",
      "Go",
      "Rust",
      "C",
      "C++",
      "Python",
      "Java",
      "PHP",
      "Elixir",
      "GraphQL",
      "gRPC",
      "WebAssembly",
      "MERN",
      "MEAN",
      "MEVN",
      "LAMP",
      "JAMstack",
      "Serverless",
    ],
    AI: [
      "OpenAI API",
      "LangChain",
      "HuggingFace Transformers",
      "Stable Diffusion",
      "DALL·E",
      "Midjourney",
      "Runway ML",
      "ElevenLabs",
      "TensorFlow",
      "PyTorch",
    ],
  }

  const toolMap: Record<string, string[]> = {
    Developers: [
      "VS Code",
      "Webpack",
      "Babel",
      "ESLint",
      "Prettier",
      "Postman",
      "Prisma",
      "Redis",
      "RabbitMQ",
      "REST Client",
      "Docker",
      "Kubernetes",
      "Terraform",
      "Ansible",
      "Jenkins",
      "GitLab CI",
      "CircleCI",
      "Prometheus",
      "Grafana",
    ],
    Growth: [
      "Ahrefs",
      "SEMrush",
      "Moz",
      "Screaming Frog",
      "Google Search Console",
      "WordPress",
      "Medium",
      "Notion",
      "Google Docs",
      "Grammarly",
      "Google Ads",
      "Facebook Ads Manager",
      "LinkedIn Ads",
      "Twitter Ads",
      "TikTok Ads",
      "Mailchimp",
      "HubSpot",
      "SendGrid",
      "ConvertKit",
      "ActiveCampaign",
      "Google Analytics",
      "Mixpanel",
      "Amplitude",
      "Hotjar",
      "Tableau",
    ],
    Designers: [
      "InVision",
      "Zeplin",
      "Miro",
      "Marvel",
      "Canva",
      "Affinity Designer",
      "CorelDRAW",
      "Frame.io",
      "Vimeo",
      "Adobe Media Encoder",
      "Wacom Tablet",
      "iPad Pro",
      "Adobe Fresco",
      "Jira",
      "Confluence",
      "Abstract",
    ],
    AI: [
      "ChatGPT",
      "GPT-4 Playground",
      "LangChain",
      "AutoGPT",
      "RAG Frameworks",
      "Jupyter",
      "Colab",
      "Weights & Biases",
      "Airflow",
      "Make.com",
      "n8n",
      "Label Studio",
    ],
    VideoEditors: [
      "Adobe Premiere Pro",
      "Adobe After Effects",
      "DaVinci Resolve",
      "Final Cut Pro",
      "Avid Media Composer",
      "Blackmagic Fusion",
      "Adobe Media Encoder",
      "Frame.io",
      "HandBrake",
    ],
  }

  const employmentOptions = ["Student", "Full-time Employee", "Full-time Freelancer", "Other"]
  const experienceOptions = [
    "Less than 1 Year of Experience",
    "1-3 Years of Experience",
    "3-5 Years of Experience",
    "5+ Years of Experience",
  ]

  // Progress state
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let filled = 0
    if (payload.full_name) filled++
    if (payload.email) filled++
    if (payload.phone) filled++
    if (payload.category) filled++
    // domains
    if (payload.category === "Other" ? Boolean(payload.domains_other) : payload.domains.length > 0) filled++
    // tech for Dev/AI
    if (["Developers", "AI"].includes(payload.category)) {
      if (payload.tech_stack.includes("Other") ? Boolean(payload.tech_other) : payload.tech_stack.length > 0) filled++
    }
    if (payload.employment_status) filled++
    if (payload.experience_level) filled++

    // calculate total fields
    let total = 3 /*name,email,phone*/ + 1 /*category*/ + 1 /*domains*/ + 2 /*employment,experience*/
    if (["Developers", "AI"].includes(payload.category)) total++

    setProgress(Math.round((filled / total) * 100))
  }, [payload])

  // Helpers
  const toggle = (key: keyof Payload, val: string) => {
    setPayload((p) => {
      const arr = p[key] as string[]
      return {
        ...p,
        [key]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val],
      }
    })
  }

  const change = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setPayload((p) => ({
      ...p,
      [name]: value,
    }))
  }

  // Submit
  const submit = async () => {
    const record = {
      ...payload,
      category: payload.category === "Other" ? payload.category_other : payload.category,
      domains: payload.domains.includes("Other") ? [payload.domains_other] : payload.domains,
      tech_stack: payload.tech_stack.includes("Other") ? [payload.tech_other] : payload.tech_stack,
      tools: payload.tools.includes("Other") ? [payload.tools_other] : payload.tools,
      employment_status: payload.employment_status === "Other" ? payload.employment_other : payload.employment_status,
    }

    const result = await supabase?.from("all-freelancer").insert([record])
    if (result?.error) alert(result.error.message)
    else router.push("/thank-you")
  }

  return (
    <main className="min-h-screen bg-[#241C15] p-6 text-white">
      <div className="max-w-2xl mx-auto bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl shadow-2xl">
        <h1 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-white to-[#FFE01B] bg-clip-text text-transparent">
          Freelancer Onboarding
        </h1>
        <p className="text-gray-400 text-center mb-8">Join our community of talented freelancers</p>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Step {step} of 3</span>
            <span>{progress}% Complete</span>
          </div>
          <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#FFE01B] to-yellow-300 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  name="full_name"
                  required
                  value={payload.full_name}
                  onChange={change}
                  placeholder="Full Name*"
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-[#FFE01B] focus:bg-white/15 transition-all duration-300"
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  name="email"
                  type="email"
                  required
                  value={payload.email}
                  onChange={change}
                  placeholder="Email Address*"
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-[#FFE01B] focus:bg-white/15 transition-all duration-300"
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  name="phone"
                  required
                  value={payload.phone}
                  onChange={change}
                  placeholder="Phone Number*"
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-[#FFE01B] focus:bg-white/15 transition-all duration-300"
                />
              </div>

              <div className="relative">
                <Linkedin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  name="linkedin_url"
                  value={payload.linkedin_url}
                  onChange={change}
                  placeholder="LinkedIn URL (Optional)"
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-[#FFE01B] focus:bg-white/15 transition-all duration-300"
                />
              </div>

              <div className="relative">
                <ExternalLink className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  name="portfolio_url"
                  value={payload.portfolio_url}
                  onChange={change}
                  placeholder="Portfolio URL (Optional)"
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-[#FFE01B] focus:bg-white/15 transition-all duration-300"
                />
              </div>

              <div className="relative">
                <FileText className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  name="resume_url"
                  type="url"
                  value={payload.resume_url}
                  onChange={change}
                  placeholder="Resume URL (Optional)"
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-[#FFE01B] focus:bg-white/15 transition-all duration-300"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <motion.button
                onClick={() => setStep(2)}
                className="bg-[#FFE01B] hover:bg-yellow-300 text-[#241C15] font-bold px-8 py-4 rounded-2xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Next Step
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Category */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#FFE01B] mb-2">Select Your Category*</label>
              <select
                name="category"
                required
                value={payload.category}
                onChange={change}
                className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white focus:outline-none focus:border-[#FFE01B] focus:bg-white/15 transition-all duration-300"
              >
                <option value="" className="bg-[#241C15] text-gray-400">
                  Choose your primary category
                </option>
                {categoryOptions.map((o) => (
                  <option key={o} value={o} className="bg-[#241C15] text-white">
                    {o}
                  </option>
                ))}
              </select>
            </div>

            {payload.category === "Other" && (
              <div className="relative">
                <input
                  name="category_other"
                  value={payload.category_other}
                  onChange={change}
                  placeholder="Enter your category"
                  className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-[#FFE01B] focus:bg-white/15 transition-all duration-300"
                />
              </div>
            )}

            {/* Domains */}
            {payload.category !== "Other" && domainMap[payload.category] && (
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-[#FFE01B]">Select Your Domains*</label>
                <div className="flex flex-wrap gap-3">
                  {domainMap[payload.category]!.map((d) => (
                    <motion.button
                      key={d}
                      onClick={() => toggle("domains", d)}
                      className={`px-4 py-2 rounded-full border-2 font-medium transition-all duration-300 ${
                        payload.domains.includes(d)
                          ? "bg-[#FFE01B] text-[#241C15] border-[#FFE01B] shadow-lg"
                          : "text-white border-white/30 hover:border-[#FFE01B]/50 hover:bg-white/5"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {d}
                    </motion.button>
                  ))}
                </div>
                {payload.domains.includes("Other") && (
                  <input
                    name="domains_other"
                    value={payload.domains_other}
                    onChange={change}
                    placeholder="Enter your specific domain"
                    className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-[#FFE01B] focus:bg-white/15 transition-all duration-300"
                  />
                )}
              </div>
            )}

            {payload.category === "Other" && (
              <div className="relative">
                <input
                  name="domains_other"
                  required
                  value={payload.domains_other}
                  onChange={change}
                  placeholder="Enter your domain"
                  className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-[#FFE01B] focus:bg-white/15 transition-all duration-300"
                />
              </div>
            )}

            {/* Tech Stack */}
            {["Developers", "AI"].includes(payload.category) && techMap[payload.category] && (
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-[#FFE01B]">Select Your Tech Stack*</label>
                <div className="flex flex-wrap gap-3 max-h-48 overflow-y-auto">
                  {techMap[payload.category]!.map((t) => (
                    <motion.button
                      key={t}
                      onClick={() => toggle("tech_stack", t)}
                      className={`px-4 py-2 rounded-full border-2 font-medium transition-all duration-300 ${
                        payload.tech_stack.includes(t)
                          ? "bg-[#FFE01B] text-[#241C15] border-[#FFE01B] shadow-lg"
                          : "text-white border-white/30 hover:border-[#FFE01B]/50 hover:bg-white/5"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {t}
                    </motion.button>
                  ))}
                </div>
                {payload.tech_stack.includes("Other") && (
                  <input
                    name="tech_other"
                    value={payload.tech_other}
                    onChange={change}
                    placeholder="Enter your specific technology"
                    className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-[#FFE01B] focus:bg-white/15 transition-all duration-300"
                  />
                )}
              </div>
            )}

            {/* Tools */}
            {payload.category && toolMap[payload.category] && (
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-[#FFE01B]">Select Your Tools (Optional)</label>
                <div className="flex flex-wrap gap-3 max-h-48 overflow-y-auto">
                  {toolMap[payload.category]!.map((t) => (
                    <motion.button
                      key={t}
                      onClick={() => toggle("tools", t)}
                      className={`px-4 py-2 rounded-full border-2 font-medium transition-all duration-300 ${
                        payload.tools.includes(t)
                          ? "bg-[#FFE01B] text-[#241C15] border-[#FFE01B] shadow-lg"
                          : "text-white border-white/30 hover:border-[#FFE01B]/50 hover:bg-white/5"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {t}
                    </motion.button>
                  ))}
                </div>
                {payload.tools.includes("Other") && (
                  <input
                    name="tools_other"
                    value={payload.tools_other}
                    onChange={change}
                    placeholder="Enter your specific tool"
                    className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-[#FFE01B] focus:bg-white/15 transition-all duration-300"
                  />
                )}
              </div>
            )}

            <div className="flex justify-between pt-4">
              <motion.button
                onClick={() => setStep(1)}
                className="text-gray-400 hover:text-white font-semibold px-6 py-3 rounded-2xl transition-all duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </motion.button>
              <motion.button
                onClick={() => setStep(3)}
                className="bg-[#FFE01B] hover:bg-yellow-300 text-[#241C15] font-bold px-8 py-4 rounded-2xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Next Step
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#FFE01B] mb-2">Employment Status*</label>
                <select
                  name="employment_status"
                  required
                  value={payload.employment_status}
                  onChange={change}
                  className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white focus:outline-none focus:border-[#FFE01B] focus:bg-white/15 transition-all duration-300"
                >
                  <option value="" className="bg-[#241C15] text-gray-400">
                    Select your current status
                  </option>
                  {employmentOptions.map((o) => (
                    <option key={o} value={o} className="bg-[#241C15] text-white">
                      {o}
                    </option>
                  ))}
                </select>
              </div>

              {payload.employment_status === "Other" && (
                <input
                  name="employment_other"
                  value={payload.employment_other}
                  onChange={change}
                  placeholder="Enter your employment status"
                  className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-[#FFE01B] focus:bg-white/15 transition-all duration-300"
                />
              )}

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#FFE01B] mb-2">Experience Level*</label>
                <select
                  name="experience_level"
                  required
                  value={payload.experience_level}
                  onChange={change}
                  className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white focus:outline-none focus:border-[#FFE01B] focus:bg-white/15 transition-all duration-300"
                >
                  <option value="" className="bg-[#241C15] text-gray-400">
                    Select your experience level
                  </option>
                  {experienceOptions.map((o) => (
                    <option key={o} value={o} className="bg-[#241C15] text-white">
                      {o}
                    </option>
                  ))}
                </select>
              </div>

              {payload.experience_level === "Other" && (
                <input
                  name="experience_other"
                  value={payload.experience_other}
                  onChange={change}
                  placeholder="Enter your experience level"
                  className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-[#FFE01B] focus:bg-white/15 transition-all duration-300"
                />
              )}
            </div>

            <div className="flex justify-between pt-4">
              <motion.button
                onClick={() => setStep(2)}
                className="text-gray-400 hover:text-white font-semibold px-6 py-3 rounded-2xl transition-all duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </motion.button>
              <motion.button
                onClick={submit}
                className="bg-gradient-to-r from-[#FFE01B] to-yellow-300 hover:from-yellow-300 hover:to-[#FFE01B] text-[#241C15] font-bold px-10 py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Complete Registration
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  )
}
