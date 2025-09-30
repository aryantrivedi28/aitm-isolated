"use client"

import { Users, Target, Lightbulb, TrendingUp, Heart, Rocket, ArrowRight } from "lucide-react"
import { motion, Variants } from "framer-motion"

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
  ]

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .about-section * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

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

      <div className="about-section flex flex-col bg-[#fbf5e5] text-[#241C15] overflow-hidden pt-[80px] sm:pt-[100px] lg:pt-[120px]">

        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#FFE01B] opacity-5 rounded-full animate-rotate360" />
          <div className="absolute top-1/2 -left-40 w-64 h-64 bg-[#FFE01B] opacity-5 rounded-full animate-rotateReverse" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#FFE01B] opacity-5 rounded-full animate-rotateHalf" />
        </div>

        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex items-center">
          <div className="absolute inset-0 bg-gradient-to-br from-[#fbf5e5] via-[#f5ead3]/30 to-[#fbf5e5]" />

          <div className="relative max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-10">
            <motion.div
              className="grid lg:grid-cols-2 gap-16 items-center"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div className="space-y-8" variants={fadeInLeft}>
                <motion.div className="space-y-6" variants={staggerContainer}>
                  <motion.div className="flex items-center gap-3 mb-4" variants={fadeUp}>
                    <motion.div
                      className="w-12 h-12 bg-[#FFE01B]/20 rounded-xl flex items-center justify-center border border-[#FFE01B]/30"
                      whileHover={{ scale: 1.1, rotate: 10 }}
                    >
                      <Rocket className="w-6 h-6 text-[#241C15]" />
                    </motion.div>
                    <span className="text-[#241C15] font-semibold text-lg">About Us</span>
                  </motion.div>

                  <motion.h1 variants={fadeUp} className="text-5xl lg:text-7xl font-bold leading-tight">
                    <span className="text-[#241C15]">About </span>
                    <span className="bg-gradient-to-r from-[#FFE01B] to-[#FCD34D] bg-clip-text text-transparent">
                      Finzie
                    </span>
                  </motion.h1>

                  <motion.p variants={fadeUp} className="text-lg sm:text-xl lg:text-2xl text-[#241C15]/80 leading-relaxed font-semibold">
                    We connect startups with pre-vetted freelancers and AI-driven teams, making it easy to build, design, and scale your projects rapidly.
                  </motion.p>

                  <motion.p variants={fadeUp} className="text-sm sm:text-lg lg:text-xl text-[#241C15]/70 leading-relaxed font-medium">
                    Our mission is to empower fast-moving startups by providing instant access to top-tier talent while fostering a thriving, inclusive freelancer community worldwide.
                  </motion.p>

                  <motion.div variants={fadeUp} className="flex gap-4 pt-4">
                    <motion.a
                      className="group inline-flex items-center gap-3 bg-[#FFE01B] text-[#241C15] font-bold px-8 py-4 rounded-2xl hover:bg-[#FCD34D] transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      href="#"
                    >
                      Start Your Project Today
                      <div className="animate-arrowMove">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </motion.a>
                  </motion.div>
                </motion.div>
              </motion.div>
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
            {/* Section Heading */}
            <motion.div className="text-center mb-16" variants={fadeUp}>
              <motion.div
                className="flex items-center justify-center gap-3 mb-6"
                variants={fadeUp}
              >
                <motion.div
                  className="w-12 h-12 bg-[#FFE01B]/20 rounded-xl flex items-center justify-center border border-[#FFE01B]/30"
                  whileHover={{ scale: 1.1, rotate: -10 }}
                >
                  <Users className="w-6 h-6 text-[#241C15]" />
                </motion.div>
                <span className="text-[#241C15] font-semibold text-lg">
                  Our Team
                </span>
              </motion.div>

              <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-[#241C15]">
                Meet Our Team
              </h2>
              <p className="text-xl text-[#241C15]/70 max-w-2xl mx-auto">
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
                  className="group relative bg-[#fbf5e5] backdrop-blur-sm rounded-3xl p-8 hover:border-[#FFE01B]/50 transition-all duration-500"
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FFE01B]/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative text-center">
                    <motion.div
                      className="relative mb-6"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="absolute inset-0 bg-[#FFE01B] rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                      <img
                        src={member.img}
                        alt={member.name}
                        className="relative w-32 h-32 rounded-full mx-auto object-cover border-4 border-[#FFE01B]/30 group-hover:border-[#FFE01B] transition-colors duration-500"
                      />
                    </motion.div>

                    <h3 className="font-bold text-xl text-[#241C15] mb-2">
                      {member.name}
                    </h3>
                    <p className="text-[#FFE01B] font-semibold mb-4">
                      {member.role}
                    </p>
                    <p className="text-[#241C15]/70 leading-relaxed group-hover:text-[#241C15]/85 transition-colors duration-500">
                      {member.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        <section className="relative py-24 px-4 sm:px-6 lg:px-8">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FFE01B]/5 to-transparent pointer-events-none" />

          <motion.div
            className="relative max-w-6xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Left Content */}
              <motion.div variants={fadeInLeft}>
                {/* Badge + Title */}
                <motion.div className="flex items-center gap-3 mb-6" variants={fadeUp}>
                  <motion.div
                    className="w-12 h-12 bg-[#FFE01B]/20 rounded-xl flex items-center justify-center border border-[#FFE01B]/30"
                    whileHover={{ scale: 1.1, rotate: 15 }}
                  >
                    <Lightbulb className="w-6 h-6 text-[#241C15]" />
                  </motion.div>
                  <span className="text-[#241C15] font-semibold text-lg sm:text-xl">Our Story</span>
                </motion.div>

                {/* Headline */}
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-[#241C15] leading-tight">
                  Finzie&apos;s Journey
                </h2>

                {/* Subtitle */}
                <p className="text-lg sm:text-xl lg:text-2xl text-[#241C15]/70 mb-8">
                  From a small startup to a global talent aggregator
                </p>

                {/* Description */}
                <div className="space-y-6">
                  <motion.p
                    className="leading-relaxed text-sm sm:text-base lg:text-lg text-[#241C15]/75 font-semibold"
                    variants={fadeUp}
                  >
                    Finzie was born out of the need for fast-moving startups to access top-tier talent quickly.
                    Our founders, frustrated with the traditional hiring process, set out to create a platform
                    that would streamline the way businesses connect with freelancers and AI specialists.
                  </motion.p>

                  <motion.p
                    className="leading-relaxed text-sm sm:text-base lg:text-lg text-[#241C15]/90 font-medium"
                    variants={fadeUp}
                  >
                    Today, Finzie is proud to be the world&apos;s first AI talent aggregator, providing on-demand
                    access to pre-vetted experts across various domains. Our mission is to empower startups
                    with the resources they need to scale efficiently and effectively.
                  </motion.p>
                </div>
              </motion.div>

              {/* Right image / illustration placeholder */}
              {/* <motion.div
                className="hidden lg:flex justify-center items-center"
                variants={fadeInLeft}
              >
                {/* Example illustration *
                <div className="w-full max-w-md h-64 bg-[#FFE01B]/20 rounded-2xl flex items-center justify-center">
                  <span className="text-[#241C15]/50 text-lg">Illustration Here</span>
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
            <motion.div className="text-center mb-16" variants={fadeUp}>
              <motion.div className="flex items-center justify-center gap-3 mb-6" variants={fadeUp}>
                <motion.div
                  className="w-12 h-12 bg-[#FFE01B]/20 rounded-xl flex items-center justify-center border border-[#FFE01B]/30"
                  whileHover={{ scale: 1.1, rotate: -15 }}
                >
                  <Target className="w-6 h-6 text-[#241C15]" />
                </motion.div>
                <span className="text-[#241C15] font-semibold text-lg">Impact</span>
              </motion.div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-[#241C15]">Our Goals & Impact</h2>
              <p className="text-xl text-[#241C15]/70 max-w-2xl mx-auto">
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
                  className="group relative bg-[#fbf5e5] backdrop-blur-sm rounded-3xl p-8 hover:border-[#FFE01B]/50 transition-all duration-500 text-center"
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FFE01B]/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <motion.div
                    className="relative mb-6"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="absolute inset-0 bg-[#FFE01B] rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                    <div className="relative w-20 h-20 bg-[#FFE01B]/20 rounded-2xl flex items-center justify-center mx-auto border border-[#FFE01B]/30 group-hover:border-[#FFE01B] transition-colors duration-500">
                      <goal.icon className="w-10 h-10 text-[#241C15]" />
                    </div>
                  </motion.div>

                  <h3 className="text-2xl font-bold text-[#241C15] mb-4">
                    {goal.title}
                  </h3>
                  <p className="text-[#241C15]/70 leading-relaxed group-hover:text-[#241C15]/85 transition-colors duration-500">
                    {goal.desc}
                  </p>
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
              <motion.div variants={fadeInLeft}>
                <motion.div className="flex items-center gap-3 mb-6" variants={fadeUp}>
                  <motion.div
                    className="w-12 h-12 bg-[#FFE01B]/20 rounded-xl flex items-center justify-center border border-[#FFE01B]/30"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                  >
                    <Target className="w-6 h-6 text-[#241C15]" />
                  </motion.div>
                  <span className="text-[#241C15] font-semibold text-lg">Mission</span>
                </motion.div>

                <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-[#FFE01B] to-[#FCD34D] bg-clip-text text-transparent">
                  Our Mission
                </h2>
                <p className="text-xl text-[#241C15]/75 leading-relaxed">
                  To empower communities through education, technology, and sustainable solutions, creating
                  opportunities for every individual to thrive and contribute to a better world.
                </p>
              </motion.div>

              <motion.div variants={fadeInRight} className="relative">
                <div className="relative animate-missionRotate">
                  <div className="absolute inset-0 bg-[#FFE01B] rounded-3xl blur-2xl opacity-20" />
                  <img
                    src="/mission2.png"
                    alt="Our Mission"
                    className="relative w-80 h-80 object-contain mx-auto"
                  />
                </div>
              </motion.div>
            </div>

            {/* Vision */}
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div variants={fadeInLeft} className="lg:order-2">
                <motion.div className="flex items-center gap-3 mb-6" variants={fadeUp}>
                  <motion.div
                    className="w-12 h-12 bg-[#FFE01B]/20 rounded-xl flex items-center justify-center border border-[#FFE01B]/30"
                    whileHover={{ scale: 1.1, rotate: -10 }}
                  >
                    <Lightbulb className="w-6 h-6 text-[#241C15]" />
                  </motion.div>
                  <span className="text-[#241C15] font-semibold text-lg">Vision</span>
                </motion.div>

                <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-[#FFE01B] to-[#FCD34D] bg-clip-text text-transparent">
                  Our Vision
                </h2>
                <p className="text-xl text-[#241C15]/75 leading-relaxed">
                  To build a future where innovation and inclusivity drive societal progress, ensuring that
                  technology and education are accessible to all, regardless of background.
                </p>
              </motion.div>

              <motion.div variants={fadeInRight} className="lg:order-1 relative">
                <div className="relative animate-visionRotate">
                  <div className="absolute inset-0 bg-[#FFE01B] rounded-3xl blur-2xl opacity-20" />
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
            <div className="relative bg-gradient-to-r from-[#FFE01B] to-[#FCD34D] rounded-3xl p-16 text-[#241C15] overflow-hidden">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full animate-rotateIcon" />
              <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-[#241C15]/10 rounded-full animate-rotateIconReverse" />

              <div className="relative z-10">
                <motion.h3 className="text-3xl lg:text-4xl font-bold mb-6" variants={fadeUp}>
                  Ready to Join the Finzie Community?
                </motion.h3>
                <motion.p
                  className="text-xl opacity-80 mb-10 max-w-2xl mx-auto"
                  variants={fadeUp}
                >
                  Whether you&apos;re a startup looking for talent or a freelancer seeking opportunities,
                  we&apos;re here to help you succeed.
                </motion.p>
                <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" variants={fadeUp}>
                  <motion.button
                    className="inline-flex items-center gap-2 bg-[#241C15] text-[#FFE01B] font-bold px-8 py-4 rounded-2xl hover:bg-[#241C15]/90 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Start a Project
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    className="inline-flex items-center gap-2 bg-white/20 text-[#241C15] font-bold px-8 py-4 rounded-2xl hover:bg-white/30 transition-all duration-300 border-2 border-[#241C15]/20 cursor-pointer"
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