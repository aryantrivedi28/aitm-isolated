"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Calendar, ExternalLink, CheckCircle, XCircle,
  ClipboardList, Layers, Briefcase, Grid
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
  const router = useRouter()

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await fetch("/api/forms")
        const data = await res.json()
        setForms(data.forms || [])
      } catch (err) {
        console.error("Failed to load forms:", err)
      }
    }
    fetchForms()
  }, [])

  return (
    <div className="relative min-h-screen bg-[#241C15] text-white overflow-hidden">

      {/* 🌌 Background Gradient Animation (smooth waves) */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-[#FFE01B0D] via-[#241C15] to-[#FFE01B0D]"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            backgroundSize: "200% 200%",
          }}
        />
      </motion.div>

      {/* Hero Section */}
<section className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
  {/* Decorative background glow */}
  <div className="absolute inset-0 -z-10 flex justify-center">
    <div className="w-[500px] h-[500px] bg-gradient-to-tr from-yellow-400/20 via-[#FFE01B]/10 to-transparent rounded-full blur-3xl opacity-40"></div>
  </div>

  {/* Hero Title */}
  <motion.h1
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-[#FFE01B] to-yellow-200 text-transparent bg-clip-text"
  >
    Land Your Next Opportunity 🚀
  </motion.h1>

  {/* Subtitle */}
  <motion.p
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.3, duration: 0.6 }}
    className="mt-5 text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
  >
    Apply once, get matched with vetted clients. 
    <span className="text-yellow-300"> We simplify hiring</span> so you can focus on building.
  </motion.p>

  {/* CTA Buttons */}
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5, duration: 0.6 }}
    className="mt-8 flex justify-center gap-4"
  >
  </motion.div>
</section>


      {/* Forms Table */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="overflow-hidden rounded-2xl border border-gray-700 shadow-2xl backdrop-blur-sm"
        >
          <table className="w-full border-collapse">
            <thead className="bg-[#1A1410]">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  <div className="flex items-center gap-2"><ClipboardList className="w-4 h-4" /> Form Name</div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  <div className="flex items-center gap-2"><Layers className="w-4 h-4" /> Category</div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  <div className="flex items-center gap-2"><Grid className="w-4 h-4" /> Subcategory</div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  <div className="flex items-center gap-2"><Briefcase className="w-4 h-4" /> Industry</div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Created</div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Status</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {forms.map((form, index) => (
                <motion.tr
                  key={form.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.07 }}
                  className="border-t border-gray-700 hover:bg-[#2F261C] hover:scale-[1.01] transition-all cursor-pointer"
                >
                  <td className="px-4 py-3 font-medium">{form.form_name}</td>
                  <td className="px-4 py-3 text-gray-300">{form.category}</td>
                  <td className="px-4 py-3 text-gray-300">{form.subcategory}</td>
                  <td className="px-4 py-3 text-gray-300">{form.industry}</td>
                  <td className="px-4 py-3 text-gray-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      {new Date(form.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {form.is_active ? (
                      <span className="inline-flex items-center gap-1 text-green-400 font-medium">
                        <CheckCircle className="w-4 h-4" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-400 font-medium">
                        <XCircle className="w-4 h-4" /> Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {form.is_active ? (
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href={`/form/${form.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 bg-[#FFE01B] hover:bg-yellow-300 text-black font-semibold px-4 py-2 rounded-lg text-sm shadow-md transition-colors"
                      >
                        Fill Form <ExternalLink className="w-4 h-4" />
                      </motion.a>
                    ) : (
                      <span className="text-gray-500 italic">Not Available</span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </section>
    </div>
  )
}
