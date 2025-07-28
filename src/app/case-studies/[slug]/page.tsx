"use client"

import { client } from "../../../sanity/lib/client"
import { PortableText } from "@portabletext/react"
import Image from "next/image"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Quote, ArrowRight, CheckCircle, User, Target, Lightbulb, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface CaseStudy {
  _id: string
  title: string
  subtitle: string
  description: string
  tags: string[]
  snapshot: string[]
  challenge: any
  finzieAdvantage: any
  callToActionText?: string // Make optional
  callToActionLink?: string // Make optional
  teamMember: {
    name: string
    role: string
    bio: string
    image: { asset: { url: string } }
  }
  testimonial: {
    quote: string
    authorName: string
    authorRole: string
  }
  mainImage: { asset: { url: string } }
}

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
}

const fadeInLeft = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
}

const fadeInRight = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: "easeOut" },
}

export default function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const [study, setStudy] = useState<CaseStudy | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStudy() {
      const { slug } = await params
      const fetchedStudy: CaseStudy = await client.fetch(
        `
          *[_type == "caseStudy" && slug.current == $slug][0]{
            _id,
            title,
            subtitle,
            description,
            tags,
            snapshot,
            challenge,
            finzieAdvantage,
            callToActionText,
            callToActionLink,
            teamMember->{name, role, bio, image { asset->{ url } }},
            testimonial { quote, authorName, authorRole },
            mainImage { asset->{ url } }
          }
        `,
        { slug },
      )

      if (!fetchedStudy) {
        notFound()
      }

      setStudy(fetchedStudy)

      // Debug: Check if CTA data exists
      console.log("CTA Text:", fetchedStudy.callToActionText)
      console.log("CTA Link:", fetchedStudy.callToActionLink)
      console.log("Full study data:", fetchedStudy)

      setLoading(false)
    }

    fetchStudy()
  }, [params])

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

  if (!study) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#241C15] text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
            scale: { duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-[#FFE01B] opacity-5 rounded-full"
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
            scale: { duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#FFE01B] opacity-3 rounded-full"
        />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#241C15] via-[#2a1f16] to-[#241C15]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div className="space-y-8" initial="initial" animate="animate" variants={staggerContainer}>
              <motion.div className="space-y-6" variants={fadeInLeft}>
                <motion.div className="flex flex-wrap gap-3 mb-6" variants={staggerContainer}>
                  {study.tags?.map((tag, idx) => (
                    <motion.span
                      key={idx}
                      variants={scaleIn}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-[#FFE01B] text-[#241C15] border-2 border-[#FFE01B] hover:bg-transparent hover:text-[#FFE01B] transition-all duration-300 cursor-default"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </motion.div>

                <motion.h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight" variants={fadeInLeft}>
                  <span className="bg-gradient-to-r from-white to-[#FFE01B] bg-clip-text text-transparent">
                    {study.title}
                  </span>
                </motion.h1>

                {study.subtitle && (
                  <motion.h2 className="text-2xl lg:text-3xl text-gray-300 font-medium" variants={fadeInLeft}>
                    {study.subtitle}
                  </motion.h2>
                )}

                <motion.p className="text-xl text-gray-400 leading-relaxed max-w-2xl" variants={fadeInLeft}>
                  {study.description}
                </motion.p>
              </motion.div>

              <motion.div className="flex gap-4" variants={fadeInLeft}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-[#FFE01B] text-[#241C15] rounded-2xl font-bold cursor-pointer"
                >
                  View Results
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, borderColor: "#FFE01B" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border-2 border-gray-600 text-white rounded-2xl font-bold cursor-pointer hover:border-[#FFE01B] transition-colors duration-300"
                >
                  Learn More
                </motion.div>
              </motion.div>
            </motion.div>

            {study.mainImage?.asset?.url && (
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.8, rotateY: 45 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-tr from-[#FFE01B] to-yellow-400 rounded-3xl transform rotate-6"
                  animate={{ rotate: [6, 8, 6] }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                />
                <motion.div whileHover={{ scale: 1.02, rotate: 1 }} transition={{ duration: 0.3 }}>
                  <Image
                    src={study.mainImage.asset.url || "/placeholder.svg"}
                    alt={study.title}
                    width={700}
                    height={500}
                    className="relative rounded-3xl shadow-2xl object-cover w-full h-[500px] border-4 border-[#FFE01B]"
                  />
                </motion.div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  className="absolute -top-6 -right-6 w-16 h-16 bg-[#FFE01B] rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <TrendingUp className="w-8 h-8 text-[#241C15]" />
                </motion.div>

                <motion.div
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  className="absolute -bottom-6 -left-6 w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <Target className="w-8 h-8 text-[#241C15]" />
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-[#FFE01B] rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="w-1 h-3 bg-[#FFE01B] rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* Main Content */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-32">
        {/* Challenge Section */}
        {study.challenge && (
          <motion.section
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-transparent rounded-3xl" />
            <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 lg:p-16 border border-white/10">
              <motion.div className="flex items-center gap-4 mb-8" variants={fadeInLeft}>
                <motion.div
                  className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center border border-red-500/30"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Target className="w-8 h-8 text-red-400" />
                </motion.div>
                <h3 className="text-3xl lg:text-4xl font-bold text-white">The Challenge</h3>
              </motion.div>
              <motion.div className="prose prose-lg prose-invert max-w-none" variants={fadeInUp}>
                <PortableText value={study.challenge} />
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* Finzie Advantage Section */}
        {study.finzieAdvantage && (
          <motion.section
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFE01B]/10 to-transparent rounded-3xl" />
            <div className="relative bg-[#FFE01B]/5 backdrop-blur-sm rounded-3xl p-8 lg:p-16 border border-[#FFE01B]/20">
              <motion.div className="flex items-center gap-4 mb-8" variants={fadeInLeft}>
                <motion.div
                  className="w-16 h-16 bg-[#FFE01B]/20 rounded-2xl flex items-center justify-center border border-[#FFE01B]/30"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Lightbulb className="w-8 h-8 text-[#FFE01B]" />
                </motion.div>
                <h3 className="text-3xl lg:text-4xl font-bold text-white">The Finzie Advantage</h3>
              </motion.div>
              <motion.div className="prose prose-lg prose-invert max-w-none" variants={fadeInUp}>
                <PortableText value={study.finzieAdvantage} />
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* Snapshot Section */}
        {study.snapshot && study.snapshot.length > 0 && (
          <motion.section
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="relative"
          >
            <motion.h3 className="text-3xl lg:text-4xl font-bold text-white mb-12 text-center" variants={fadeInUp}>
              Key Results & Impact
            </motion.h3>
            <div className="grid gap-6 md:grid-cols-2">
              {study.snapshot.map((point, idx) => (
                <motion.div
                  key={idx}
                  variants={scaleIn}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-[#FFE01B]/50 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <motion.div
                      className="w-8 h-8 bg-[#FFE01B] rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <CheckCircle className="w-5 h-5 text-[#241C15]" />
                    </motion.div>
                    <p className="text-gray-300 font-medium leading-relaxed group-hover:text-white transition-colors duration-300">
                      {point}
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FFE01B]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Team Member & Testimonial Section */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Team Member */}
          {study.teamMember && (
            <motion.section
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInLeft}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-8">
                <motion.div
                  className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center border border-purple-500/30"
                  whileHover={{ scale: 1.1 }}
                >
                  <User className="w-6 h-6 text-purple-400" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white">Project Lead</h3>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  {study.teamMember.image?.asset?.url && (
                    <motion.div whileHover={{ scale: 1.05 }} className="relative">
                      <Image
                        src={study.teamMember.image.asset.url || "/placeholder.svg"}
                        alt={study.teamMember.name}
                        width={100}
                        height={100}
                        className="rounded-2xl object-cover w-24 h-24 border-2 border-[#FFE01B]"
                      />
                      <div className="absolute inset-0 bg-[#FFE01B]/20 rounded-2xl" />
                    </motion.div>
                  )}
                  <div>
                    <p className="font-bold text-xl text-white">{study.teamMember.name}</p>
                    <p className="text-[#FFE01B] font-semibold text-lg">{study.teamMember.role}</p>
                  </div>
                </div>
                <p className="text-gray-400 leading-relaxed">{study.teamMember.bio}</p>
              </div>
            </motion.section>
          )}

          {/* Testimonial */}
          {study.testimonial?.quote && (
            <motion.section
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInRight}
              className="bg-gradient-to-br from-[#FFE01B]/10 to-transparent rounded-3xl p-8 border border-[#FFE01B]/20"
            >
              <div className="flex items-center gap-3 mb-8">
                <motion.div
                  className="w-12 h-12 bg-[#FFE01B]/20 rounded-xl flex items-center justify-center border border-[#FFE01B]/30"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                >
                  <Quote className="w-6 h-6 text-[#FFE01B]" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white">Client Testimonial</h3>
              </div>
              <blockquote className="space-y-6">
                <p className="text-xl text-gray-300 italic leading-relaxed">"{study.testimonial.quote}"</p>
                <footer className="flex items-center gap-4 pt-6 border-t border-white/10">
                  <motion.div
                    className="w-12 h-12 bg-[#FFE01B] rounded-full flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                  >
                    <span className="text-[#241C15] font-bold text-lg">
                      {study?.testimonial?.authorName?.charAt(0) || ''}
                    </span>

                  </motion.div>
                  <div>
                    <p className="font-bold text-white text-lg">{study.testimonial.authorName}</p>
                    <p className="text-gray-400">{study.testimonial.authorRole}</p>
                  </div>
                </footer>
              </blockquote>
            </motion.section>
          )}
        </div>

        {/* Call to Action - Show if either text or link exists */}
        {(study.callToActionText || study.callToActionLink) && (
          <motion.section
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center py-20"
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
                <motion.h3 className="text-3xl lg:text-4xl font-bold mb-6" variants={fadeInUp}>
                  {study.callToActionText || "Ready to Transform Your Business?"}
                </motion.h3>
                <motion.p className="text-xl opacity-80 mb-10 max-w-3xl mx-auto" variants={fadeInUp}>
                  Join the success story. Let Finzie help you achieve remarkable results like our featured client.
                </motion.p>
                <motion.div variants={fadeInUp}>
                  <Link
                    href={study.callToActionLink || "/client-request"}
                    className="group inline-flex items-center gap-3"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05, x: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-[#241C15] text-[#FFE01B] font-bold px-10 py-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
                    >
                      {"Get Started"}
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
          </motion.section>
        )}
      </div>
    </div>
  )
}
