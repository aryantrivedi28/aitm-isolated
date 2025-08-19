"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Calendar, ExternalLink, CheckCircle, XCircle } from "lucide-react"

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
      is_active?: boolean   // 👈 new field for status
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
            <div className="min-h-screen bg-[#241C15] text-white">
                  {/* Hero Section */}
                  <section className="max-w-6xl mx-auto px-6 pt-16 pb-8 text-center">
                        <motion.h1
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.6, ease: "easeOut" }}
                              className="text-4xl md:text-5xl font-bold tracking-tight"
                        >
                              Get Hired, Faster.
                        </motion.h1>
                        <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.3, duration: 0.6 }}
                              className="mt-4 text-gray-300 text-lg max-w-2xl mx-auto"
                        >
                              One simple application to reach vetted clients. Share your skills, rates, and portfolio — we handle the matchmaking.
                        </motion.p>
                  </section>

                  {/* Forms Table */}
                  <section className="max-w-6xl mx-auto px-6 pb-16">
                        <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.4 }}
                              className="overflow-hidden rounded-xl border border-gray-700 shadow-lg"
                        >
                              <table className="w-full border-collapse">
                                    <thead className="bg-[#1A1410]">
                                          <tr>
                                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Form Name</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Category</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Subcategory</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Industry</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Created</th>
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
                                                      transition={{ delay: index * 0.08 }}
                                                      className="border-t border-gray-700 hover:bg-[#2F261C] transition-colors"
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
                                                                  <a
                                                                        href={`/form/${form.id}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="inline-flex items-center gap-1 bg-[#FFE01B] hover:bg-yellow-300 text-black font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
                                                                  >
                                                                        Fill Form <ExternalLink className="w-4 h-4" />
                                                                  </a>
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
