"use client"

import { Users, Target, Lightbulb, TrendingUp, Heart, Rocket, ArrowRight } from "lucide-react"
import { motion, Variants } from "framer-motion"

// Color Palette (Light Theme)
const COLORS = {
  BACKGROUND: "#faf4e5",
  TEXT_PRIMARY: "#050504",
  ACCENT_PRIMARY: "#f7af00",
  TEXT_SECONDARY: "#31302f",
  BACKGROUND_SECONDARY: "#f0eadd",
}

// Animation variants
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] },
  },
}

const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] },
  },
}

const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] },
  },
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
}

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] },
  },
}

export default function AboutPage() {
  const team = [
    {
      name: "Aryan Trivedi",
      role: "Founder & CEO",
      desc: "Product strategist passionate about building efficient teams for fast-scaling startups.",
      img: "/aryan_t.jpg",
    },
    {
      name: "Kunal Sharma",
      role: "Tech Lead",
      desc: "Full-stack engineer with a focus on scalable architecture and rapid MVP delivery.",
      img: "/kunal.png",
    },
    {
      name: "Gauri Dayal",
      role: "Marketing Ops",
      desc: "Handles client coordination and freelance hiring, from requirements to onboarding and delivery.",
      img: "/pic.jpeg",
    },
  ]

  return (
    <>
      <style jsx global>{`
        @keyframes rotate360 {
          from { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.2); }
          to { transform: rotate(360deg) scale(1); }
        }
        @keyframes rotateReverse {
          from { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(-180deg) scale(1.1); }
          to { transform: rotate(-360deg) scale(1); }
        }
        @keyframes rotateHalf {
          from { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(90deg) scale(1.3); }
          to { transform: rotate(180deg) scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(-10px); }
          50% { transform: translateY(10px); }
        }
        @keyframes arrowMove {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }
        @keyframes rotateIcon {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes missionRotate {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(5deg); }
        }
        @keyframes visionRotate {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-5deg); }
        }

        .animate-rotate360 { animation: rotate360 30s linear infinite; }
        .animate-rotateReverse { animation: rotateReverse 25s linear infinite; }
        .animate-rotateHalf { animation: rotateHalf 20s linear infinite; }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-arrowMove { animation: arrowMove 1.5s ease-in-out infinite; }
        .animate-rotateIcon { animation: rotateIcon 20s linear infinite; }
        .animate-rotateIconReverse { animation: rotateIcon 25s linear infinite reverse; }
        .animate-missionRotate { animation: missionRotate 6s ease-in-out infinite; }
        .animate-visionRotate { animation: visionRotate 8s ease-in-out infinite; }
      `}</style>

      <div className="about-section flex flex-col overflow-hidden pt-20 sm:pt-28 md:pt-32" style={{ background: COLORS.BACKGROUND, color: COLORS.TEXT_PRIMARY }}>
        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex items-center">
          <div className="relative w-full">
            <div className="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-20 max-w-[1400px] py-16 sm:py-20 lg:py-24">
              <motion.div
                className="grid lg:grid-cols-2 gap-2 items-center"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <motion.div className="space-y-10" variants={fadeInLeft}>
                  <motion.div className="space-y-6" variants={staggerContainer}>
                    {/* Badge */}
                    {/* <motion.div className="flex items-center gap-3 mb-4" variants={fadeUp}>
                      <motion.div
                        className="w-14 h-14 rounded-xl flex items-center justify-center border"
                        style={{
                          background: `${COLORS.ACCENT_PRIMARY}20`,
                          borderColor: `${COLORS.ACCENT_PRIMARY}30`
                        }}
                        whileHover={{ scale: 1.1, rotate: 10 }}
                      >
                        <Rocket className="w-7 h-7" style={{ color: COLORS.TEXT_PRIMARY }} />
                      </motion.div>
                      <span className="font-semibold text-lg sm:text-xl tracking-wide" style={{ color: COLORS.TEXT_PRIMARY }}>
                        About Us
                      </span>
                    </motion.div> */}

                    {/* Headline */}
                    <motion.h1
                      variants={fadeUp}
                      className="font-medium leading-[1.1]"
                      style={{
                        fontSize: "clamp(2.35rem, 5.5vw, 4.5rem)",
                        letterSpacing: "-0.025em",
                        maxWidth: "1300px",
                      }}
                    >
                      <span style={{ color: COLORS.TEXT_PRIMARY }}>About Finzie</span>
                    </motion.h1>

                    {/* Subheading */}
                    <motion.p
                      variants={fadeUp}
                      className="leading-relaxed font-normal"
                      style={{
                        fontSize: "clamp(1.125rem, 1.75vw, 1.375rem)",
                        maxWidth: "1600px",
                        opacity: "0.9",
                        color: COLORS.TEXT_PRIMARY
                      }}
                    >
                      We connect startups with pre-vetted freelancers and AI-driven teams,
                      making it easy to build, design, and scale your projects rapidly.
                    </motion.p>

                    {/* Secondary Description */}
                    <motion.p
                      variants={fadeUp}
                      className="leading-relaxed font-normal"
                      style={{
                        fontSize: "clamp(1rem, 1.25vw, 1.125rem)",
                        maxWidth: "680px",
                        lineHeight: "1.7",
                        color: `${COLORS.TEXT_PRIMARY}83`
                      }}
                    >
                      Our mission is to empower fast-moving startups by providing instant
                      access to top-tier talent while fostering a thriving, inclusive
                      freelancer community worldwide.
                    </motion.p>
                  </motion.div>

                  {/* CTA Button */}
                  <motion.div variants={fadeUp} className="flex gap-4">
                    <motion.a
                      className="group inline-flex items-center gap-3 font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      href="#"
                      style={{
                        fontSize: "1.0625rem",
                        background: COLORS.ACCENT_PRIMARY,
                        color: COLORS.TEXT_PRIMARY
                      }}
                    >
                      Start Your Project Today
                      <div className="animate-arrowMove">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </motion.a>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Team Members Section */}
        <section className="relative py-24 px-4">
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent, ${COLORS.ACCENT_PRIMARY}08)` }} />

          <motion.div
            className="relative max-w-6xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            {/* Section Heading */}
            <motion.div className="text-center mb-16" variants={fadeUp}>
              <motion.div
                className="flex items-center justify-center gap-3 mb-6"
                variants={fadeUp}
              >
                <motion.div
                  className="w-12 h-12 rounded-xl flex items-center justify-center border"
                  style={{
                    background: `${COLORS.ACCENT_PRIMARY}20`,
                    borderColor: `${COLORS.ACCENT_PRIMARY}30`
                  }}
                  whileHover={{ scale: 1.1, rotate: -10 }}
                >
                  <Users className="w-6 h-6" style={{ color: COLORS.TEXT_PRIMARY }} />
                </motion.div>
                <span className="font-semibold text-lg" style={{ color: COLORS.TEXT_PRIMARY }}>
                  Our Team
                </span>
              </motion.div>

              <h2 className="text-4xl lg:text-5xl font-medium mb-4" style={{ color: COLORS.TEXT_PRIMARY }}>
                Meet Our Team
              </h2>
              <p className="text-xl max-w-2xl mx-auto" style={{ color: `${COLORS.TEXT_PRIMARY}B3` }}>
                The builders, designers, and dreamers behind Finzie
              </p>
            </motion.div>

            {/* Team Cards */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
            >
              {team.map((member, idx) => (
                <motion.div
                  key={idx}
                  variants={scaleIn}
                  className="group relative backdrop-blur-sm rounded-3xl p-8 transition-all duration-500 border-2 hover:border-[#f7af00]"
                  style={{
                    background: COLORS.BACKGROUND_SECONDARY,
                  }}
                >
                  <div className="relative text-center">
                    <motion.div
                      className="relative mb-6"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="absolute inset-0 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500" style={{ background: COLORS.BACKGROUND_SECONDARY }} />
                      <img
                        src={member.img}
                        alt={member.name}
                        className="relative w-32 h-32 rounded-full mx-auto object-cover border-2 transition-colors duration-500"
                        style={{
                          borderColor: `${COLORS.ACCENT_PRIMARY}`
                        }}
                      />
                    </motion.div>

                    <h3 className="font-bold text-xl mb-2" style={{ color: COLORS.TEXT_PRIMARY }}>
                      {member.name}
                    </h3>
                    <p className="font-semibold mb-4" style={{ color: COLORS.ACCENT_PRIMARY }}>
                      {member.role}
                    </p>
                    <p className="leading-relaxed group-hover:opacity-100 transition-colors duration-500" style={{ color: `${COLORS.TEXT_PRIMARY}B3` }}>
                      {member.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Finzie Story */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(to right, ${COLORS.BACKGROUND_SECONDARY}, transparent)` }} />

          <motion.div
            className="relative max-w-6xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <div className="grid lg:grid-cols-2 gap-2 items-center">
              <motion.div variants={fadeInLeft} className="">
                <h2
                  className="font-normal mb-2"
                  style={{
                    fontSize: "clamp(2.25rem, 5vw, 4rem)",
                    lineHeight: "1.15",
                    maxWidth: "100%",
                    letterSpacing: "-0.025em",
                    color: COLORS.TEXT_PRIMARY
                  }}
                >
                  Finzie&apos;s Journey
                </h2>

                <p
                  className="mb-6 font-medium"
                  style={{
                    fontSize: "clamp(1.125rem, 1.75vw, 1.375rem)",
                    maxWidth: "100%",
                    lineHeight: "1.6",
                    color: `${COLORS.TEXT_PRIMARY}CC`
                  }}
                >
                  From a small startup to a global talent aggregator
                </p>

                <div className="space-y-8 max-w-3xl">
                  <motion.p
                    className="font-medium"
                    style={{
                      fontSize: "clamp(1rem, 1.25vw, 1.125rem)",
                      lineHeight: "1.75",
                      color: `${COLORS.TEXT_PRIMARY}BF`
                    }}
                    variants={fadeUp}
                  >
                    Finzie was born out of the need for fast-moving startups to access top-tier talent quickly. Our founders, frustrated with the traditional hiring process, set out to create a platform that would streamline the way businesses connect with freelancers and AI specialists.
                  </motion.p>

                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={staggerContainer}
                    className="relative z-10 max-w-3xl"
                  >
                    <motion.p
                      variants={fadeUp}
                      style={{
                        fontSize: "clamp(1rem, 1.25vw, 1.125rem)",
                        lineHeight: "1.75",
                        color: `${COLORS.TEXT_PRIMARY}E6`
                      }}
                    >
                      Today, Finzie is proud to be the world's first AI talent aggregator, providing on-demand access to pre-vetted experts across various domains. Our mission is to empower startups with the resources they need to scale efficiently and effectively.
                    </motion.p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Goals and Impact Section */}
        <section className="relative py-24 px-4">
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent, ${COLORS.ACCENT_PRIMARY}05, transparent)` }} />

          <motion.div
            className="relative max-w-6xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <motion.div className="text-center mb-16" variants={fadeUp}>
              <h2 className="text-4xl lg:text-5xl font-medium mb-4" style={{ color: COLORS.TEXT_PRIMARY }}>Our Goals & Impact</h2>
              <p className="text-xl max-w-2xl mx-auto" style={{ color: `${COLORS.TEXT_PRIMARY}B3` }}>
                Committed to making a difference in the freelance ecosystem
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={staggerContainer}
            >
              {[
                {
                  title: "Empower Freelancers",
                  desc: "Providing resources, mentorship, and opportunities for freelancers to grow and succeed in their careers.",
                  icon: Users,
                },
                {
                  title: "Build a Thriving Community",
                  desc: "Fostering a supportive environment where freelancers connect, collaborate, and share knowledge to uplift each other.",
                  icon: Heart,
                },
                {
                  title: "Drive Economic Impact",
                  desc: "Enabling freelancers to access better opportunities, increase income stability, and contribute to the global economy.",
                  icon: TrendingUp,
                },
              ].map((goal, idx) => (
                <motion.div
                  key={idx}
                  variants={scaleIn}
                  className="group relative backdrop-blur-sm rounded-3xl p-8 transition-all duration-500 text-center"
                  style={{
                    background: COLORS.BACKGROUND_SECONDARY,
                    border: `1px solid ${COLORS.TEXT_SECONDARY}0A`
                  }}
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  <motion.div
                    className="relative mb-6"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center mx-auto border transition-colors duration-500">
                      <goal.icon className="w-6 h-6" style={{ color: COLORS.TEXT_PRIMARY }} />
                    </div>
                  </motion.div>

                  <h3 className="text-2xl font-medium mb-4" style={{ color: COLORS.TEXT_PRIMARY }}>
                    {goal.title}
                  </h3>
                  <p className="leading-relaxed group-hover:opacity-100 transition-colors duration-500" style={{ color: `${COLORS.TEXT_PRIMARY}B3` }}>
                    {goal.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Mission and Vision Section */}
        <section className="relative py-24 px-4">
          <div className="absolute inset-0" style={{ background: `linear-gradient(to right, transparent, ${COLORS.ACCENT_PRIMARY}05, transparent)` }} />

          <motion.div
            className="relative max-w-6xl mx-auto space-y-24"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            {/* Mission */}
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div variants={fadeInLeft}>
                <h2 className="text-4xl lg:text-5xl font-normal mb-6 text-[#050504]">
                  Our Mission
                </h2>
                <p className="text-xl leading-relaxed" style={{ color: `${COLORS.TEXT_PRIMARY}BF` }}>
                  To empower communities through education, technology, and sustainable solutions, creating
                  opportunities for every individual to thrive and contribute to a better world.
                </p>
              </motion.div>

              <motion.div variants={fadeInRight} className="relative">
                <div className="relative animate-missionRotate">
                  <div className="absolute inset-0 rounded-3xl blur-2xl opacity-20" style={{ background: COLORS.BACKGROUND_SECONDARY }} />
                  <img
                    src="/mission.png"
                    alt="Our Mission"
                    className="relative w-80 h-80 object-contain mx-auto"
                  />
                </div>
              </motion.div>
            </div>

            {/* Vision */}
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div variants={fadeInLeft} className="lg:order-2">
                <h2 className="text-4xl lg:text-5xl font-normal mb-6 text-[#050504]">
                  Our Vision
                </h2>
                <p className="text-xl leading-relaxed" style={{ color: `${COLORS.TEXT_PRIMARY}BF` }}>
                  To build a future where innovation and inclusivity drive societal progress, ensuring that
                  technology and education are accessible to all, regardless of background.
                </p>
              </motion.div>

              <motion.div variants={fadeInRight} className="lg:order-1 relative">
                <div className="relative animate-visionRotate">
                  <div className="absolute inset-0 rounded-3xl blur-2xl opacity-20" style={{ background: COLORS.BACKGROUND_SECONDARY }} />
                  <img
                    src="/vision.png"
                    alt="Our Vision"
                    className="relative w-80 h-80 object-contain mx-auto"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="relative py-24 px-4">
          <motion.div
            className="max-w-6xl mx-auto text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <div className="relative rounded-3xl p-16 overflow-hidden" style={{
              background: `linear-gradient(to right, ${COLORS.BACKGROUND_SECONDARY}, #f0eadd)`,
              color: COLORS.TEXT_PRIMARY
            }}>
              <div className="relative z-10">
                <motion.h3 className="text-xl sm:text-3xl lg:text-5xl font-light mb-6" variants={fadeUp}>
                  Ready to Join the Finzie Community?
                </motion.h3>
                <motion.p
                  className="text-xl opacity-90 mb-10 max-w-2xl mx-auto"
                  variants={fadeUp}
                >
                  Whether you&apos;re a startup looking for talent or a freelancer seeking opportunities,
                  we&apos;re here to help you succeed.
                </motion.p>
                <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" variants={fadeUp}>
                  <motion.button
                    className="inline-flex items-center gap-2 font-bold px-8 py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
                    style={{
                      background: COLORS.BACKGROUND,
                      color: COLORS.TEXT_PRIMARY
                    }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Start a Project
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    className="inline-flex items-center gap-2 font-bold px-8 py-4 rounded-2xl transition-all duration-300 border-2 cursor-pointer"
                    style={{
                      background: `${COLORS.BACKGROUND}`,
                      color: COLORS.TEXT_PRIMARY,
                      borderColor: `${COLORS.TEXT_PRIMARY}30`
                    }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Users className="w-5 h-5" />
                    Join as Freelancer
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </>
  )
}