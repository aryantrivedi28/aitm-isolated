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
  callToActionText?: string
  callToActionButton?: {
    text: string
    link: string
  }
  callToActionLink?: string
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
    image: { asset: { url: string } }
  }
  mainImage: { asset: { url: string } }

  // ✅ New video section
  video?: {
    videoUrl?: string
    videoFile?: { asset: { url: string } }
    caption?: string
  }
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
        `*[_type == "caseStudy" && slug.current == $slug && isHidden != true][0]{
  _id,
  title,
  subtitle,
  slug,
  description,
  tags,
  order,
  ranking,
  isHidden,
  mainImage { asset -> { url } },
  video {
    videoUrl,
    caption,
    videoFile { asset -> { url } }
  },
  challenge,
  finzieAdvantage,
  teamMember {
    name,
    role,
    bio,
    image { asset -> { url } }
  },
  snapshot,
  testimonial {
    quote,
    authorName,
    authorRole,
    image { asset -> { url } }
  },
  callToActionText,
  callToActionButton { text, link }
}
`,
        { slug }
      );

      if (!fetchedStudy) {
        notFound()
      }

      setStudy(fetchedStudy)
      setLoading(false)
    }

    fetchStudy()
  }, [params])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf4e5] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#f7af00] border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (!study) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#faf4e5] text-[#31302f] overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        <div className="relative max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div className="space-y-8" initial="initial" animate="animate" variants={staggerContainer}>
              <motion.div className="space-y-6" variants={fadeInLeft}>
                <motion.h1 className="text-4xl lg:text-5xl font-medium text-[#050504] leading-tight" variants={fadeInLeft}>
                  {study.title}
                </motion.h1>

                {study.subtitle && (
                  <motion.h2 className="text-xl lg:text-2xl text-[#31302f] font-medium" variants={fadeInLeft}>
                    {study.subtitle}
                  </motion.h2>
                )}

                <motion.p className="text-base text-[#31302f] leading-relaxed max-w-3xl" variants={fadeInLeft}>
                  {study.description}
                </motion.p>

                                <motion.div className="flex flex-wrap gap-3 mb-6 w-full" variants={staggerContainer}>
                  {study.tags?.map((tag, idx) => (
                    <motion.span
                      key={idx}
                      variants={scaleIn}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-[#f7af00] text-[#050504] border-2 border-[#f7af00] hover:bg-white hover:text-[#f7af00] transition-all duration-300 cursor-default shadow-sm"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </motion.div>
              </motion.div>

              <motion.div className="flex gap-4" variants={fadeInLeft}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-[#f7af00] text-[#050504] rounded-2xl font-bold cursor-pointer shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  View Results
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, borderColor: "#f7af00", backgroundColor: "#f0eadd" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border-2 border-[#050504] text-[#050504] rounded-2xl font-bold cursor-pointer hover:border-[#f7af00] hover:text-[#f7af00] transition-all duration-300"
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
                  className="absolute inset-0 rounded-3xl transform rotate-6 opacity-80"
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                />
                <motion.div>
                  <Image
                    src={study.mainImage.asset.url || "/placeholder.svg"}
                    alt={study.title}
                    width={700}
                    height={500}
                    className="relative rounded-3xl object-cover w-full h-[650px]"
                  />
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Video Section */}
      {study.video && (study.video.videoUrl || study.video.videoFile?.asset?.url) && (
        <motion.section
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        >
          <div className="relative bg-[#f0eadd] rounded-3xl p-8 lg:p-16 border border-[#f0eadd] shadow-lg">
            <motion.h3
              className="text-3xl lg:text-4xl font-bold text-[#050504] mb-6"
              variants={fadeInLeft}
            >
              Case Study Video
            </motion.h3>

            {/* If external video URL (YouTube, Vimeo, etc.) */}
            {study.video.videoUrl && (
              <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-xl">
                <iframe
                  src={study.video.videoUrl}
                  title="Case Study Video"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {/* If uploaded video file */}
            {study.video.videoFile?.asset?.url && (
              <video
                src={study.video.videoFile.asset.url}
                controls
                className="w-full rounded-2xl shadow-xl"
              />
            )}

            {/* Caption */}
            {study.video.caption && (
              <p className="mt-4 text-[#31302f] text-lg italic">
                {study.video.caption}
              </p>
            )}
          </div>
        </motion.section>
      )}

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
            <div className="relative bg-[#f0eadd] rounded-3xl p-8 lg:p-16 border border-[#f0eadd] shadow-lg">
              <motion.div className="flex items-center gap-4 mb-8" variants={fadeInLeft}>
                <motion.div
                  className="w-16 h-16 bg-[#faf4e5] rounded-2xl flex items-center justify-center border border-[#f0eadd]"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Target className="w-8 h-8 text-black" />
                </motion.div>
                <h3 className="text-3xl lg:text-4xl font-medium text-[#050504]">The Challenge</h3>
              </motion.div>
              <motion.div className="prose prose-lg prose-gray max-w-none" variants={fadeInUp}>
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
            <div className="relative bg-[#f0eadd] rounded-3xl p-8 lg:p-16 border border-[#f7af00]/20">
              <motion.div className="flex items-center gap-4 mb-8" variants={fadeInLeft}>
                <motion.div
                  className="w-16 h-16 bg-[#faf4e5] rounded-2xl flex items-center justify-center border border-[#f7af00]/30"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Lightbulb className="w-8 h-8 text-[#f7af00]" />
                </motion.div>
                <h3 className="text-3xl lg:text-4xl font-medium text-[#050504]">The Finzie Advantage</h3>
              </motion.div>
              <motion.div className="prose prose-lg prose-gray max-w-none" variants={fadeInUp}>
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
            <motion.h3 className="text-3xl lg:text-4xl font-medium text-[#050504] mb-12 text-center" variants={fadeInUp}>
              Key Results & Impact
            </motion.h3>
            <div className="grid gap-6 md:grid-cols-2">
              {study.snapshot.map((point, idx) => (
                <motion.div
                  key={idx}
                  variants={scaleIn}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="group relative bg-[#f0eadd] rounded-2xl p-6 border border-[#f0eadd] hover:border-[#f7af00]/50 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <motion.div
                      className="w-8 h-8 bg-[#f7af00] rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <CheckCircle className="w-5 h-5 text-white" />
                    </motion.div>
                    <p className="text-[#31302f] font-medium leading-relaxed group-hover:text-[#050504] transition-colors duration-300">
                      {point}
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#f7af00]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
              className="bg-[#f0eadd] rounded-3xl p-8 border border-[#f0eadd] shadow-sm"
            >
              <div className="flex items-center gap-3 mb-8">
                <motion.div
                  className="w-12 h-12 bg-[#f7af00] rounded-xl flex items-center justify-center border border-[#f7af00]/30"
                  whileHover={{ scale: 1.1 }}
                >
                  <User className="w-6 h-6 text-black" />
                </motion.div>
                <h3 className="text-2xl font-medium text-[#050504]">Project Lead</h3>
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
                        className="rounded-2xl object-cover w-24 h-24 border-2 border-white shadow-md"
                      />
                      <div className="absolute inset-0 bg-[#f7af00]/10 rounded-2xl" />
                    </motion.div>
                  )}
                  <div>
                    <p className="font-medium text-xl text-[#050504]">{study.teamMember.name}</p>
                    <p className="text-[#31302f] font-medium text-lg">{study.teamMember.role}</p>
                  </div>
                </div>
                <p className="text-[#31302f] leading-relaxed">{study.teamMember.bio}</p>
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
              className="bg-[#f0eadd] rounded-3xl p-8 border border-[#f7af00]/30"
            >
              <div className="flex items-center gap-3 mb-8">
                <motion.div
                  className="w-12 h-12 bg-[#f7af00]/20 rounded-xl flex items-center justify-center border border-[#f7af00]/30"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                >
                  <Quote className="w-6 h-6 text-[#f7af00]" />
                </motion.div>
                <h3 className="text-2xl font-medium text-[#050504]">Client Testimonial</h3>
              </div>

              <blockquote className="space-y-6">
                <p className="text-base text-[#31302f] italic leading-relaxed">
                  "{study.testimonial.quote}"
                </p>
                <footer className="flex items-center gap-4 pt-6 border-t border-[#31302f]/10">
                  <motion.div
                    className="w-12 h-12 rounded-full bg-[#f7af00] flex items-center justify-center overflow-hidden border-2 border-white shadow-sm"
                    whileHover={{ scale: 1.1 }}
                  >
                    {study.testimonial.image?.asset?.url ? (
                      <img
                        src={study.testimonial.image.asset.url}
                        alt={study.testimonial.authorName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-medium text-lg">
                        {study?.testimonial?.authorName?.charAt(0) || ""}
                      </span>
                    )}
                  </motion.div>

                  <div>
                    <p className="font-bold text-[#050504] text-lg">
                      {study.testimonial.authorName}
                    </p>
                    <p className="text-[#31302f]">{study.testimonial.authorRole}</p>
                  </div>
                </footer>
              </blockquote>
            </motion.section>
          )}
        </div>

        {/* Call to Action - Show if either text or link exists */}
        {study && (
          <motion.section
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center py-20"
          >
            <div className="relative bg-[#f0eadd] rounded-3xl p-16 text-[#050504] overflow-hidden">
              <div className="relative z-10">
                <motion.h3 className="text-3xl lg:text-4xl font-medium mb-6" variants={fadeInUp}>
                  {study.callToActionText || "Ready to Transform Your Business?"}
                </motion.h3>
                <motion.div variants={fadeInUp}>
                  <Link
                    href={study.callToActionButton?.link || study.callToActionLink || "/client-request"}
                    className="group inline-flex items-center gap-3"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05, x: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className="font-medium px-10 py-5 bg-[#f7af00] text-[#050504] rounded-2xl hover:shadow-xl transition-all duration-300 flex items-center gap-3"
                    >
                      {study.callToActionButton?.text || "Get Started"}
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