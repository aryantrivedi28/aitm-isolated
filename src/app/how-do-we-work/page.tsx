"use client"

import { motion } from "framer-motion"
import {
  Clock,
  Award,
  Zap,
  Users,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Briefcase,
  Target,
  Layers,
  Send,
} from "lucide-react"
import Image from "next/image"

// Color Palette - strict adherence
const COLORS = {
  BACKGROUND: "#faf4e5",
  BACKGROUND_SECONDARY: "#f0eadd",
  TEXT_PRIMARY: "#050504",
  TEXT_SECONDARY: "#31302f",
  ACCENT: "#f7af00",
}

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
}

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
}

// Using unDraw style illustrations for a more polished look

export default function HowWeWorkPage() {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: COLORS.BACKGROUND }}>
      {/* Subtle dot pattern background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, ${COLORS.ACCENT} 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
          opacity: 0.06,
        }}
      />

      {/* Hero Section */}
      <motion.section
        className="relative z-10 px-2 sm:px-6 lg:px-8 pt-24 pb-16 sm:pt-32 sm:pb-20 max-w-7xl mx-auto"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div className="flex items-center gap-3 mb-6" variants={fadeInUp}>
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: `${COLORS.ACCENT}20` }}
              >
                <Briefcase className="w-5 h-5" style={{ color: COLORS.TEXT_PRIMARY }} />
              </div>
              <span className="font-semibold text-sm uppercase tracking-wider" style={{ color: COLORS.TEXT_SECONDARY }}>
                How We Work
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-7xl lg:text-6xl font-medium leading-tight mb-6"
              style={{ color: COLORS.TEXT_PRIMARY }}
              variants={fadeInUp}
            >
              A Simple, Structured Process to{" "}
              <span className="relative inline-block">
                Hire Tier-One
                <span
                  className="absolute -bottom-[1px] left-0 w-full h-2 -z-10 rounded"
                  style={{background: `${COLORS.ACCENT}` }}
                />
              </span>{" "}
              Indian Talent
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl leading-relaxed mb-8 max-w-xl"
              style={{ color: COLORS.TEXT_SECONDARY }}
              variants={fadeInUp}
            >
              At <strong style={{ color: COLORS.TEXT_PRIMARY }}>Finzie</strong>, we keep hiring straightforward yet
              effective. Our process ensures speed, accuracy, and quality so you get the right talent every time.
            </motion.p>

            <motion.button
              variants={fadeInUp}
              whileHover={{ scale: 1.03, boxShadow: `0 8px 24px ${COLORS.ACCENT}40` }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 text-base font-semibold rounded-xl flex items-center gap-2 transition-shadow duration-300"
              style={{
                background: COLORS.ACCENT,
                color: COLORS.TEXT_PRIMARY,
                boxShadow: `0 4px 12px ${COLORS.ACCENT}30`,
              }}
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>

          {/* <motion.div className="hidden lg:flex justify-center" variants={fadeInUp}>
            <div className="relative w-full max-w-lg">
              <div
                className="absolute inset-0 rounded-full blur-3xl opacity-20"
                style={{ background: COLORS.BACKGROUND_SECONDARY }}
              />
              <Image
                src="https://illustrations.popsy.co/amber/remote-work.svg"
                alt="Team collaboration illustration"
                width={500}
                height={400}
                className="relative z-10 w-full h-auto"
              />
            </div>
          </motion.div> */}
        </div>
      </motion.section>

      {/* Separator */}
      <div
        className="h-px max-w-4xl mx-auto"
        style={{ background: `linear-gradient(to right, transparent, ${COLORS.TEXT_SECONDARY}25, transparent)` }}
      />

      {/* Process Steps Section */}
      <motion.section
        className="relative z-10 px-5 sm:px-8 lg:px-12 py-20 sm:py-28 max-w-6xl mx-auto"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerContainer}
      >
        <motion.div className="text-center mb-16" variants={fadeInUp}>
          <div className="flex justify-center mb-6">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: `${COLORS.ACCENT}20` }}
            >
              <Layers className="w-6 h-6" style={{ color: COLORS.TEXT_PRIMARY }} />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium mb-4" style={{ color: COLORS.TEXT_PRIMARY }}>
            Our Process
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: COLORS.TEXT_SECONDARY }}>
            Three simple steps to find your perfect hire
          </p>
        </motion.div>

        {/* <motion.div className="flex justify-center mb-16" variants={fadeInUp}>
          <Image
            src="https://illustrations.popsy.co/amber/workflow.svg"
            alt="Workflow process illustration"
            width={600}
            height={200}
            className="w-full max-w-2xl h-auto"
          />
        </motion.div> */}

        {/* Process Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Step 1 */}
          <motion.div
            variants={fadeInUp}
            whileHover={{ scale: 1.02, boxShadow: `0 12px 32px ${COLORS.TEXT_PRIMARY}08` }}
            className="p-7 sm:p-8 rounded-2xl border transition-all duration-300"
            style={{
              background: COLORS.BACKGROUND_SECONDARY,
              borderColor: `${COLORS.TEXT_SECONDARY}10`,
            }}
          >
            <div className="flex items-start gap-5">
              {/* <Image
                src="https://illustrations.popsy.co/amber/product-launch.svg"
                alt="Share requirements"
                width={80}
                height={80}
                className="w-20 h-20 flex-shrink-0"
              /> */}
              <div>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center font-semibold text-base mb-4"
                  style={{ background: COLORS.ACCENT, color: COLORS.TEXT_PRIMARY }}
                >
                  1
                </div>
                <h3 className="text-xl sm:text-2xl font-medium mb-3" style={{ color: COLORS.TEXT_PRIMARY }}>
                  Share Your Requirements
                </h3>
                <p style={{ color: COLORS.TEXT_SECONDARY }} className="leading-relaxed">
                  Tell us what you need—whether it's a managed freelancer, a short-term hire, or a full-time
                  professional. We take the time to understand your goals, budget, and expectations.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            variants={fadeInUp}
            whileHover={{ scale: 1.02, boxShadow: `0 12px 32px ${COLORS.TEXT_PRIMARY}08` }}
            className="p-7 sm:p-8 rounded-2xl border transition-all duration-300"
            style={{
              background: COLORS.BACKGROUND_SECONDARY,
              borderColor: `${COLORS.TEXT_SECONDARY}10`,
            }}
          >
            <div className="flex items-start gap-5">
              {/* <Image
                src="https://illustrations.popsy.co/amber/man-with-a-laptop.svg"
                alt="Pre-vetted talent"
                width={80}
                height={80}
                className="w-20 h-20 flex-shrink-0"
              /> */}
              <div>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center font-semibold text-base mb-4"
                  style={{ background: COLORS.ACCENT, color: COLORS.TEXT_PRIMARY }}
                >
                  2
                </div>
                <h3 className="text-xl sm:text-2xl font-medium mb-3" style={{ color: COLORS.TEXT_PRIMARY }}>
                  Get Matched with Pre-Vetted Talent
                </h3>
                <p style={{ color: COLORS.TEXT_SECONDARY }} className="leading-relaxed">
                  Our team combines AI-powered matching with human vetting to shortlist the best candidates. Within
                  days, you'll receive profiles of only the most relevant, top-tier professionals.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Step 3 - Full Width */}
        <motion.div
          variants={fadeInUp}
          whileHover={{ scale: 1.01, boxShadow: `0 12px 32px ${COLORS.TEXT_PRIMARY}08` }}
          className="p-7 sm:p-8 rounded-2xl border transition-all duration-300"
          style={{
            background: COLORS.BACKGROUND_SECONDARY,
            borderColor: `${COLORS.TEXT_SECONDARY}10`,
          }}
        >
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center font-semibold text-base mb-4"
                style={{ background: COLORS.ACCENT, color: COLORS.TEXT_PRIMARY }}
              >
                3
              </div>
              <h3 className="text-xl sm:text-2xl font-medium mb-5" style={{ color: COLORS.TEXT_PRIMARY }}>
                Deliver with Confidence
              </h3>

              <div className="grid sm:grid-cols-3 gap-4 mb-5">
                {[
                  { icon: CheckCircle, title: "Managed Freelancer", desc: "We oversee delivery & quality end-to-end." },
                  { icon: Users, title: "Freelancer Hiring", desc: "Work directly with the freelancer you select." },
                  {
                    icon: TrendingUp,
                    title: "Full-Time Recruitment",
                    desc: "We help you hire & onboard a full-time professional.",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="p-4 rounded-xl border"
                    style={{
                      background: COLORS.BACKGROUND,
                      borderColor: `${COLORS.TEXT_SECONDARY}10`,
                    }}
                    whileHover={{ x: 4 }}
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                      style={{ background: `${COLORS.ACCENT}25` }}
                    >
                      <item.icon className="w-5 h-5" style={{ color: COLORS.TEXT_PRIMARY }} />
                    </div>
                    <h4 className="font-medium mb-1" style={{ color: COLORS.TEXT_PRIMARY }}>
                      {item.title}
                    </h4>
                    <p className="text-sm" style={{ color: COLORS.TEXT_SECONDARY }}>
                      {item.desc}
                    </p>
                  </motion.div>
                ))}
              </div>

              <p className="text-sm italic" style={{ color: COLORS.TEXT_SECONDARY }}>
                Whichever model you pick, we stay close to ensure smooth execution and guaranteed outcomes.
              </p>
            </div>

            <div className="hidden lg:flex items-center justify-center">
              {/* <Image
                src="https://illustrations.popsy.co/amber/success.svg"
                alt="Successful delivery"
                width={200}
                height={200}
                className="w-48 h-48"
              /> */}
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Separator */}
      <div
        className="h-px max-w-4xl mx-auto"
        style={{ background: `linear-gradient(to right, transparent, ${COLORS.TEXT_SECONDARY}25, transparent)` }}
      />

      {/* Why It Works Section */}
      <motion.section
        className="relative z-10 px-5 sm:px-8 lg:px-12 py-20 sm:py-28 max-w-7xl mx-auto"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerContainer}
      >
        <motion.div className="text-center mb-16" variants={fadeInUp}>
          <div className="flex justify-center mb-6">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: `${COLORS.ACCENT}20` }}
            >
              <Target className="w-6 h-6" style={{ color: COLORS.TEXT_PRIMARY }} />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium mb-4" style={{ color: COLORS.TEXT_PRIMARY }}>
            Why Our Process Works
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: COLORS.TEXT_SECONDARY }}>
            Built on trust, speed, and exceptional quality
          </p>
        </motion.div>

        {/* <motion.div className="flex justify-center mb-12" variants={fadeInUp}>
          <Image
            src="https://illustrations.popsy.co/amber/team-work.svg"
            alt="Team collaboration"
            width={400}
            height={300}
            className="w-full max-w-sm h-auto"
          />
        </motion.div> */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Clock, title: "Speed", desc: "Talent ready in <24 hours, sometimes <6 hours." },
            { icon: Award, title: "Quality", desc: "Only the top 3% make it through our screening process." },
            {
              icon: Zap,
              title: "Flexibility",
              desc: "Choose between managed freelancers, freelance hires, or full-time.",
            },
            { icon: Users, title: "Trust", desc: "A 90%+ client repeat rate speaks for itself." },
          ].map((item, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ scale: 1.03, boxShadow: `0 12px 32px ${COLORS.TEXT_PRIMARY}08` }}
              className="p-6 sm:p-7 rounded-2xl border text-center transition-all duration-300"
              style={{
                background: COLORS.BACKGROUND_SECONDARY,
                borderColor: `${COLORS.TEXT_SECONDARY}10`,
              }}
            >
              <motion.div
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-5"
                style={{
                  background: COLORS.BACKGROUND,
                  border: `1px solid ${COLORS.TEXT_SECONDARY}15`,
                }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <item.icon className="w-5 h-5" style={{ color: COLORS.TEXT_PRIMARY }} />
              </motion.div>
              <h3 className="text-xl font-medium mb-2" style={{ color: COLORS.TEXT_PRIMARY }}>
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: COLORS.TEXT_SECONDARY }}>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="relative z-10 px-5 sm:px-8 lg:px-12 py-20 sm:py-28 max-w-5xl mx-auto text-center"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerContainer}
      >
        <motion.div
          className="p-10 sm:p-14 rounded-3xl relative overflow-hidden"
          style={{ background: COLORS.BACKGROUND_SECONDARY }}
          variants={fadeInUp}
        >
          <div className="relative z-10">
            {/* <motion.div className="flex justify-center mb-8" variants={fadeInUp}>
              <Image
                src="https://illustrations.popsy.co/amber/taking-off.svg"
                alt="Launch and growth"
                width={200}
                height={200}
                className="w-40 h-40"
              />
            </motion.div> */}

            <motion.h2
              className="text-3xl sm:text-4xl lg:text-5xl font-medium mb-5"
              style={{ color: COLORS.TEXT_PRIMARY }}
              variants={fadeInUp}
            >
              Ready to Hire Tier-One Talent?
            </motion.h2>

            <motion.p
              className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
              style={{ color: COLORS.TEXT_SECONDARY }}
              variants={fadeInUp}
            >
              Find out why hundreds of startups and growing businesses trust{" "}
              <strong style={{ color: COLORS.TEXT_PRIMARY }}>Finzie</strong> to power their teams.
            </motion.p>

            <motion.button
              variants={fadeInUp}
              whileHover={{ scale: 1.03, boxShadow: `0 12px 32px ${COLORS.ACCENT}40` }}
              whileTap={{ scale: 0.98 }}
              className="px-10 py-4 text-base font-semibold rounded-xl flex items-center gap-2 mx-auto transition-shadow duration-300"
              style={{
                background: COLORS.ACCENT,
                color: COLORS.TEXT_PRIMARY,
                boxShadow: `0 4px 16px ${COLORS.ACCENT}30`,
              }}
            >
              <Send className="w-5 h-5" />
              Start Hiring Today
            </motion.button>
          </div>
        </motion.div>
      </motion.section>
    </div>
  )
}
