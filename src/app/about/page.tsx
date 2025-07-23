"use client"

import { motion, type Variants } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Users, Target, Lightbulb, TrendingUp, Heart, Globe, Rocket, Star, ArrowRight, CheckCircle } from "lucide-react"

// Animation variants with proper typing
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

const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
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

const floatingAnimation = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  },
}

export default function AboutPage() {
  return (
    <div className="flex flex-col bg-[#241C15] text-white overflow-hidden">
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
          className="absolute -top-40 -right-40 w-80 h-80 bg-[#FFE01B] opacity-20 rounded-full"
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
          className="absolute top-1/2 -left-40 w-64 h-64 bg-[#FFE01B] opacity-10 rounded-full"
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
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#241C15] via-[#2a1f16] to-[#241C15]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            className="grid lg:grid-cols-2 gap-16 items-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div className="space-y-8" initial="hidden" animate="visible" variants={fadeInLeft}>
              <motion.div className="space-y-6" initial="hidden" animate="visible" variants={staggerContainer}>
                <motion.div
                  className="flex items-center gap-3 mb-4"
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                >
                  <motion.div
                    className="w-12 h-12 bg-[#FFE01B]/20 rounded-xl flex items-center justify-center border border-[#FFE01B]/30"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                  >
                    <Rocket className="w-6 h-6 text-[#FFE01B]" />
                  </motion.div>
                  <span className="text-[#FFE01B] font-semibold text-lg">About Us</span>
                </motion.div>

                <motion.h1
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  className="text-5xl lg:text-7xl font-bold leading-tight"
                >
                  About{" "}
                  <span className="bg-gradient-to-r from-[#FFE01B] to-yellow-300 bg-clip-text text-transparent">
                    Finzie
                  </span>
                </motion.h1>

                <motion.p
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  className="text-xl lg:text-2xl text-gray-300 leading-relaxed"
                >
                  We connect startups with pre-vetted freelancers and AI-driven teams, making it easy to build, design,
                  and scale your projects rapidly.
                </motion.p>

                <motion.p
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  className="text-lg text-gray-400 leading-relaxed"
                >
                  Our mission is to empower fast-moving startups by providing instant access to top-tier talent while
                  fostering a thriving, inclusive freelancer community worldwide.
                </motion.p>

                <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex gap-4 pt-4">
                  <Link href="/client-request">
                    <motion.div
                      className="group inline-flex items-center gap-3 bg-[#FFE01B] text-[#241C15] font-bold px-8 py-4 rounded-2xl hover:bg-yellow-300 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Start Your Project Today
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.div>
                    </motion.div>
                  </Link>

                  <motion.button
                    className="px-8 py-4 border-2 border-[#FFE01B]/30 text-white rounded-2xl font-semibold hover:border-[#FFE01B] hover:bg-[#FFE01B]/10 transition-all duration-300"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Learn More
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* <motion.div className="relative" initial="hidden" animate="visible" variants={fadeInRight}>
              <motion.div
                className="absolute inset-0 bg-gradient-to-tr from-[#FFE01B] to-yellow-400 rounded-3xl transform rotate-6"
                animate={{ rotate: [6, 8, 6] }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />
              <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-6">
                  <motion.div
                    className="bg-[#FFE01B]/20 rounded-2xl p-6 text-center"
                    initial="hidden"
                    animate="visible"
                    variants={scaleIn}
                  >
                    <motion.div {...floatingAnimation}>
                      <Users className="w-12 h-12 text-[#FFE01B] mx-auto mb-3" />
                    </motion.div>
                    <h3 className="font-bold text-2xl text-white">500+</h3>
                    <p className="text-gray-300 text-sm">Expert Freelancers</p>
                  </motion.div>

                  <motion.div
                    className="bg-white/10 rounded-2xl p-6 text-center"
                    initial="hidden"
                    animate="visible"
                    variants={scaleIn}
                  >
                    <motion.div {...floatingAnimation}>
                      <Target className="w-12 h-12 text-[#FFE01B] mx-auto mb-3" />
                    </motion.div>
                    <h3 className="font-bold text-2xl text-white">200+</h3>
                    <p className="text-gray-300 text-sm">Projects Completed</p>
                  </motion.div>

                  <motion.div
                    className="bg-white/10 rounded-2xl p-6 text-center"
                    initial="hidden"
                    animate="visible"
                    variants={scaleIn}
                  >
                    <motion.div {...floatingAnimation}>
                      <Globe className="w-12 h-12 text-[#FFE01B] mx-auto mb-3" />
                    </motion.div>
                    <h3 className="font-bold text-2xl text-white">50+</h3>
                    <p className="text-gray-300 text-sm">Countries Served</p>
                  </motion.div>

                  <motion.div
                    className="bg-[#FFE01B]/20 rounded-2xl p-6 text-center"
                    initial="hidden"
                    animate="visible"
                    variants={scaleIn}
                  >
                    <motion.div {...floatingAnimation}>
                      <Star className="w-12 h-12 text-[#FFE01B] mx-auto mb-3" />
                    </motion.div>
                    <h3 className="font-bold text-2xl text-white">4.9</h3>
                    <p className="text-gray-300 text-sm">Client Rating</p>
                  </motion.div>
                </div>
              </div>
            </motion.div> */}
          </motion.div>
        </div>
      </section>

      {/* Team Members Section */}
      <section className="relative py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#FFE01B]/5" />

        <motion.div
          className="relative max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.div className="text-center mb-16" initial="hidden" animate="visible" variants={fadeUp}>
            <motion.div
              className="flex items-center justify-center gap-3 mb-6"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <motion.div
                className="w-12 h-12 bg-[#FFE01B]/20 rounded-xl flex items-center justify-center border border-[#FFE01B]/30"
                whileHover={{ scale: 1.1, rotate: -10 }}
              >
                <Users className="w-6 h-6 text-[#FFE01B]" />
              </motion.div>
              <span className="text-[#FFE01B] font-semibold text-lg">Our Team</span>
            </motion.div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              The builders, designers, and dreamers behind Finzie
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {[
              {
                name: "Aryan Trivedi",
                role: "Founder & CEO",
                desc: "Product strategist passionate about building efficient teams for fast-scaling startups.",
                img: "/aryan_t.jpg",
              },
              {
                name: "Aryan Verma",
                role: "OPS Manager",
                desc: "Expert in workflow automation and operations, ensuring seamless delivery for every client.",
                img: "/aryan_v.png",
              },
              {
                name: "Kunal Sharma",
                role: "Product Manager",
                desc: "Full-stack engineer with a focus on scalable architecture and rapid MVP delivery.",
                img: "/kunal.png",
              },
            ].map((member, idx) => (
              <motion.div
                key={idx}
                initial="hidden"
                animate="visible"
                variants={scaleIn}
                className="group relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-[#FFE01B]/50 transition-all duration-500"
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFE01B]/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative text-center">
                  <motion.div className="relative mb-6" whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
                    <div className="absolute inset-0 bg-[#FFE01B] rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                    <Image
                      src={member.img || "/placeholder.svg"}
                      alt={member.name}
                      width={120}
                      height={120}
                      className="relative w-32 h-32 rounded-full mx-auto object-cover border-4 border-[#FFE01B]/30 group-hover:border-[#FFE01B] transition-colors duration-500"
                    />
                  </motion.div>

                  <h3 className="font-bold text-xl text-white mb-2">{member.name}</h3>
                  <p className="text-[#FFE01B] font-semibold mb-4">{member.role}</p>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-500">
                    {member.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Story Section */}
      <section className="relative py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFE01B]/5 to-transparent" />

        <motion.div
          className="relative max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" animate="visible" variants={fadeInLeft}>
              <motion.div className="flex items-center gap-3 mb-6" initial="hidden" animate="visible" variants={fadeUp}>
                <motion.div
                  className="w-12 h-12 bg-[#FFE01B]/20 rounded-xl flex items-center justify-center border border-[#FFE01B]/30"
                  whileHover={{ scale: 1.1, rotate: 15 }}
                >
                  <Lightbulb className="w-6 h-6 text-[#FFE01B]" />
                </motion.div>
                <span className="text-[#FFE01B] font-semibold text-lg">Our Story</span>
              </motion.div>

              <h2 className="text-4xl lg:text-5xl font-bold mb-6">Finzie's Journey</h2>
              <p className="text-xl text-gray-400 mb-8">From a small startup to a global talent aggregator</p>

              <div className="space-y-6 text-gray-300">
                <motion.p initial="hidden" animate="visible" variants={fadeUp} className="leading-relaxed">
                  Finzie was born out of the need for fast-moving startups to access top-tier talent quickly. Our
                  founders, frustrated with the traditional hiring process, set out to create a platform that would
                  streamline the way businesses connect with freelancers and AI specialists.
                </motion.p>
                <motion.p initial="hidden" animate="visible" variants={fadeUp} className="leading-relaxed">
                  Today, Finzie is proud to be the world's first AI talent aggregator, providing on-demand access to
                  pre-vetted experts across various domains. Our mission is to empower startups with the resources they
                  need to scale efficiently and effectively.
                </motion.p>
              </div>
            </motion.div>

            {/* <motion.div initial="hidden" animate="visible" variants={fadeInRight} className="relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-tr from-[#FFE01B] to-yellow-400 rounded-3xl transform -rotate-6"
                animate={{ rotate: [-6, -4, -6] }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />
              <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <div className="space-y-6">
                  <motion.div className="flex items-center gap-4" whileHover={{ x: 10 }}>
                    <div className="w-12 h-12 bg-[#FFE01B] rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-[#241C15]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">2020 - Founded</h4>
                      <p className="text-gray-400 text-sm">Started with a vision to revolutionize freelancing</p>
                    </div>
                  </motion.div>

                  <motion.div className="flex items-center gap-4" whileHover={{ x: 10 }}>
                    <div className="w-12 h-12 bg-[#FFE01B] rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-[#241C15]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">2022 - Growth</h4>
                      <p className="text-gray-400 text-sm">Expanded to 50+ countries worldwide</p>
                    </div>
                  </motion.div>

                  <motion.div className="flex items-center gap-4" whileHover={{ x: 10 }}>
                    <div className="w-12 h-12 bg-[#FFE01B] rounded-xl flex items-center justify-center">
                      <Rocket className="w-6 h-6 text-[#241C15]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">2024 - Innovation</h4>
                      <p className="text-gray-400 text-sm">Launched AI-powered talent matching</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div> */}
          </div>
        </motion.div>
      </section>

      {/* Goals and Impact Section */}
      <section className="relative py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFE01B]/5 to-transparent" />

        <motion.div
          className="relative max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.div className="text-center mb-16" initial="hidden" animate="visible" variants={fadeUp}>
            <motion.div
              className="flex items-center justify-center gap-3 mb-6"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <motion.div
                className="w-12 h-12 bg-[#FFE01B]/20 rounded-xl flex items-center justify-center border border-[#FFE01B]/30"
                whileHover={{ scale: 1.1, rotate: -15 }}
              >
                <Target className="w-6 h-6 text-[#FFE01B]" />
              </motion.div>
              <span className="text-[#FFE01B] font-semibold text-lg">Impact</span>
            </motion.div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">Our Goals & Impact</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Committed to making a difference in the freelance ecosystem
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {[
              {
                title: "Empower Freelancers",
                desc: "Providing resources, mentorship, and opportunities for freelancers to grow and succeed in their careers.",
                imgSrc: "/Career.png",
                icon: Users,
              },
              {
                title: "Build a Thriving Community",
                desc: "Fostering a supportive environment where freelancers connect, collaborate, and share knowledge to uplift each other.",
                imgSrc: "/deals.svg",
                icon: Heart,
              },
              {
                title: "Drive Economic Impact",
                desc: "Enabling freelancers to access better opportunities, increase income stability, and contribute to the global economy.",
                imgSrc: "/income.png",
                icon: TrendingUp,
              },
            ].map((goal, idx) => (
              <motion.div
                key={idx}
                initial="hidden"
                animate="visible"
                variants={scaleIn}
                className="group relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-[#FFE01B]/50 transition-all duration-500 text-center"
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFE01B]/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative">
                  <motion.div
                    className="relative mb-6"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="absolute inset-0 bg-[#FFE01B] rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                    <div className="relative w-20 h-20 bg-[#FFE01B]/20 rounded-2xl flex items-center justify-center mx-auto border border-[#FFE01B]/30 group-hover:border-[#FFE01B] transition-colors duration-500">
                      <goal.icon className="w-10 h-10 text-[#FFE01B]" />
                    </div>
                  </motion.div>

                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#FFE01B] transition-colors duration-500">
                    {goal.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-500">
                    {goal.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Mission and Vision Section */}
      <section className="relative py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFE01B]/5 to-transparent" />

        <motion.div
          className="relative max-w-6xl mx-auto space-y-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          {/* Mission */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" animate="visible" variants={fadeInLeft}>
              <motion.div className="flex items-center gap-3 mb-6" initial="hidden" animate="visible" variants={fadeUp}>
                <motion.div
                  className="w-12 h-12 bg-[#FFE01B]/20 rounded-xl flex items-center justify-center border border-[#FFE01B]/30"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                >
                  <Target className="w-6 h-6 text-[#FFE01B]" />
                </motion.div>
                <span className="text-[#FFE01B] font-semibold text-lg">Mission</span>
              </motion.div>

              <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-[#FFE01B] to-yellow-300 bg-clip-text text-transparent">
                Our Mission
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                To empower communities through education, technology, and sustainable solutions, creating opportunities
                for every individual to thrive and contribute to a better world.
              </p>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={fadeInRight} className="relative">
              <motion.div
                animate={{ rotate: [0, 5, 0] }}
                transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                className="relative"
              >
                <div className="absolute inset-0 bg-[#FFE01B] rounded-3xl blur-2xl opacity-20" />
                <Image
                  src="/mission.png"
                  alt="Our Mission"
                  width={400}
                  height={400}
                  className="relative w-80 h-80 object-contain mx-auto"
                  priority
                />
              </motion.div>
            </motion.div>
          </div>

          {/* Vision */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" animate="visible" variants={fadeInLeft} className="lg:order-2">
              <motion.div className="flex items-center gap-3 mb-6" initial="hidden" animate="visible" variants={fadeUp}>
                <motion.div
                  className="w-12 h-12 bg-[#FFE01B]/20 rounded-xl flex items-center justify-center border border-[#FFE01B]/30"
                  whileHover={{ scale: 1.1, rotate: -10 }}
                >
                  <Lightbulb className="w-6 h-6 text-[#FFE01B]" />
                </motion.div>
                <span className="text-[#FFE01B] font-semibold text-lg">Vision</span>
              </motion.div>

              <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-[#FFE01B] to-yellow-300 bg-clip-text text-transparent">
                Our Vision
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                To build a future where innovation and inclusivity drive societal progress, ensuring that technology and
                education are accessible to all, regardless of background.
              </p>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={fadeInRight} className="lg:order-1 relative">
              <motion.div
                animate={{ rotate: [0, -5, 0] }}
                transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                className="relative"
              >
                <div className="absolute inset-0 bg-[#FFE01B] rounded-3xl blur-2xl opacity-20" />
                <Image
                  src="/vision.png"
                  alt="Our Vision"
                  width={400}
                  height={400}
                  className="relative w-80 h-80 object-contain mx-auto"
                  priority
                />
              </motion.div>
            </motion.div>
          </div>
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
                Ready to Join the Finzie Community?
              </motion.h3>
              <motion.p
                className="text-xl opacity-80 mb-10 max-w-2xl mx-auto"
                initial="hidden"
                animate="visible"
                variants={fadeUp}
              >
                Whether you're a startup looking for talent or a freelancer seeking opportunities, we're here to help
                you succeed.
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial="hidden"
                animate="visible"
                variants={fadeUp}
              >
                <Link href="/client-request">
                  <motion.div
                    className="inline-flex items-center gap-2 bg-[#241C15] text-[#FFE01B] font-bold px-8 py-4 rounded-2xl hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Start a Project
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </Link>
                <Link href="/freelancer-signup">
                  <motion.div
                    className="inline-flex items-center gap-2 bg-white/20 text-[#241C15] font-bold px-8 py-4 rounded-2xl hover:bg-white/30 transition-all duration-300 border-2 border-[#241C15]/20 cursor-pointer"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Join as Freelancer
                    <Users className="w-5 h-5" />
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
