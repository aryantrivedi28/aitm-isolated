"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Clock, Award, Zap, Users, ArrowRight, Sparkles, Star, CheckCircle, TrendingUp, Briefcase } from "lucide-react";

// Color Palette
const COLORS = {
  BACKGROUND: "#faf4e5",
  TEXT_PRIMARY: "#050504",
  ACCENT_PRIMARY: "#f7af00",
  TEXT_SECONDARY: "#31302f",
  BACKGROUND_SECONDARY: "#f0eadd",
};

const ACCENT_GRADIENT = `linear-gradient(135deg, ${COLORS.ACCENT_PRIMARY} 0%, #f7c34d 100%)`;

// Simple fade and slide animations
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.6 }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.6 }
};

// Hero Section
export function HowWeWorkHero() {
  return (
    <motion.section
      className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 max-w-7xl mx-auto"
      initial="initial"
      animate="animate"
      variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
    >
      <motion.div
        className="flex items-center gap-3 mb-6"
        variants={fadeInUp}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center border"
          style={{
            background: `${COLORS.ACCENT_PRIMARY}20`,
            borderColor: `${COLORS.ACCENT_PRIMARY}30`,
          }}
        >
          <Briefcase className="w-6 h-6" style={{ color: COLORS.TEXT_PRIMARY }} />
        </div>
        <span className="font-semibold text-lg" style={{ color: COLORS.ACCENT_PRIMARY }}>Hiring</span>
      </motion.div>

      <motion.h1
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight"
        style={{ color: COLORS.TEXT_PRIMARY }}
        variants={fadeInUp}
      >
        A Simple, Structured Process to
        <motion.span
          className="block relative mt-3"
          variants={fadeInUp}
        >
          <span style={{ background: ACCENT_GRADIENT, backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}>
            Hire Tier-One
          </span>
        </motion.span>
        <motion.span className="block mt-2" variants={fadeInUp} style={{ color: COLORS.TEXT_PRIMARY }}>
          Indian Talent
        </motion.span>
      </motion.h1>

      <motion.p
        className="text-lg sm:text-xl md:text-2xl max-w-4xl mb-8 font-light"
        style={{ color: COLORS.TEXT_SECONDARY }}
        variants={fadeInUp}
      >
        At{" "}
        <span style={{ background: ACCENT_GRADIENT, backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent", fontWeight: "600" }}>
          Finzie
        </span>
        , we keep hiring straightforward yet effective. Our process ensures{" "}
        <span style={{ color: COLORS.TEXT_PRIMARY, fontWeight: "500" }}>speed, accuracy, and quality</span> so you get the right talent every time.
      </motion.p>
    </motion.section>
  );
}

// Process Steps Section
export function ProcessSteps() {
  return (
    <motion.section
      className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 max-w-6xl mx-auto"
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-100px" }}
      variants={{ animate: { transition: { staggerChildren: 0.15 } } }}
    >
      <motion.h2
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-center mb-16"
        style={{ background: ACCENT_GRADIENT, backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}
        variants={fadeInUp}
      >
        Our Process
      </motion.h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8">
        {/* Step 1 */}
        <motion.div variants={fadeInUp}>
          <Card
            className="p-6 sm:p-8 rounded-2xl h-full border transition-all duration-300 hover:scale-105"
            style={{
              background: COLORS.BACKGROUND_SECONDARY,
              borderColor: `${COLORS.TEXT_SECONDARY}10`,
              boxShadow: `0 4px 12px ${COLORS.TEXT_PRIMARY}10`,
            }}
          >
            <div className="flex flex-col gap-4">
              <motion.div
                className="w-12 h-12 rounded-lg flex items-center justify-center font-black text-lg flex-shrink-0"
                style={{ background: ACCENT_GRADIENT, color: COLORS.TEXT_PRIMARY }}
                whileHover={{ scale: 1.1 }}
              >
                1
              </motion.div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3" style={{ color: COLORS.TEXT_PRIMARY }}>
                  Share Your Requirements
                </h3>
                <p className="text-base font-light" style={{ color: COLORS.TEXT_SECONDARY }}>
                  Tell us what you need—whether it's a managed freelancer, a short-term hire, or a full-time professional. We take the time to understand your goals, budget, and expectations.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Step 2 */}
        <motion.div variants={fadeInUp}>
          <Card
            className="p-6 sm:p-8 rounded-2xl h-full border transition-all duration-300 hover:scale-105"
            style={{
              background: COLORS.BACKGROUND_SECONDARY,
              borderColor: `${COLORS.TEXT_SECONDARY}10`,
              boxShadow: `0 4px 12px ${COLORS.TEXT_PRIMARY}10`,
            }}
          >
            <div className="flex flex-col gap-4">
              <motion.div
                className="w-12 h-12 rounded-lg flex items-center justify-center font-black text-lg flex-shrink-0"
                style={{ background: ACCENT_GRADIENT, color: COLORS.TEXT_PRIMARY }}
                whileHover={{ scale: 1.1 }}
              >
                2
              </motion.div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3" style={{ color: COLORS.TEXT_PRIMARY }}>
                  Get Matched with Pre-Vetted Talent
                </h3>
                <p className="text-base font-light" style={{ color: COLORS.TEXT_SECONDARY }}>
                  Our team combines AI-powered matching with human vetting to shortlist the best candidates for your project. Within days, you'll receive profiles of only the most relevant, top-tier professionals.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Step 3 - Full width */}
      <motion.div variants={fadeInUp}>
        <Card
          className="p-6 sm:p-8 rounded-2xl border transition-all duration-300 hover:scale-105"
          style={{
            background: COLORS.BACKGROUND_SECONDARY,
            borderColor: `${COLORS.TEXT_SECONDARY}10`,
            boxShadow: `0 4px 12px ${COLORS.TEXT_PRIMARY}10`,
          }}
        >
          <div className="flex flex-col gap-4">
            <motion.div
              className="w-12 h-12 rounded-lg flex items-center justify-center font-black text-lg flex-shrink-0"
              style={{ background: ACCENT_GRADIENT, color: COLORS.TEXT_PRIMARY }}
              whileHover={{ scale: 1.1 }}
            >
              3
            </motion.div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: COLORS.TEXT_PRIMARY }}>
                Deliver with Confidence
              </h3>
              <div className="space-y-3">
                {[
                  { title: "Managed Freelancer", desc: "We oversee delivery & quality end-to-end.", icon: CheckCircle },
                  { title: "Freelancer Hiring", desc: "Work directly with the freelancer you select.", icon: Users },
                  { title: "Full-Time Recruitment", desc: "We help you hire & onboard a full-time professional into your team.", icon: TrendingUp },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg transition-all duration-300"
                    style={{
                      background: COLORS.BACKGROUND,
                      borderColor: `${COLORS.TEXT_SECONDARY}10`,
                      border: `1px solid ${COLORS.TEXT_SECONDARY}10`,
                    }}
                    whileHover={{ x: 4 }}
                  >
                    <div
                      className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: ACCENT_GRADIENT }}
                    >
                      <item.icon className="w-3 h-3" style={{ color: COLORS.TEXT_PRIMARY }} />
                    </div>
                    <p className="text-sm" style={{ color: COLORS.TEXT_SECONDARY }}>
                      <strong style={{ color: COLORS.TEXT_PRIMARY }}>{item.title}:</strong> {item.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
              <p className="text-sm italic font-light mt-4" style={{ color: COLORS.TEXT_SECONDARY }}>
                Whichever model you pick, we stay close to ensure smooth execution and guaranteed outcomes.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.section>
  );
}

// Why It Works Section
export function WhyItWorks() {
  return (
    <motion.section
      className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 max-w-7xl mx-auto"
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-100px" }}
      variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
    >
      <motion.h2
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-center mb-16"
        style={{ background: ACCENT_GRADIENT, backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}
        variants={fadeInUp}
      >
        Why Our Process Works
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Clock, title: "Speed", desc: "Talent ready in <24 hours, sometimes <6 hours." },
          { icon: Award, title: "Quality", desc: "Only the top 3% make it through our screening process." },
          { icon: Zap, title: "Flexibility", desc: "Choose between managed freelancers, freelance hires, or full-time recruitment." },
          { icon: Users, title: "Trust", desc: "A 90%+ client repeat rate speaks for itself." },
        ].map((item, index) => (
          <motion.div key={index} variants={fadeInUp}>
            <Card
              className="p-6 sm:p-8 rounded-2xl h-full border text-center transition-all duration-300 hover:scale-105"
              style={{
                background: COLORS.BACKGROUND_SECONDARY,
                borderColor: `${COLORS.TEXT_SECONDARY}10`,
                boxShadow: `0 4px 12px ${COLORS.TEXT_PRIMARY}10`,
              }}
            >
              <motion.div className="mb-6 flex justify-center" whileHover={{ scale: 1.15, rotate: 5 }}>
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center"
                  style={{
                    background: `${COLORS.BACKGROUND}70`,
                    border: `1px solid ${COLORS.TEXT_SECONDARY}20`,
                    boxShadow: `0 0 15px ${COLORS.ACCENT_PRIMARY}30`,
                  }}
                >
                  <item.icon className="w-8 h-8" style={{ color: COLORS.TEXT_PRIMARY }} />
                </div>
              </motion.div>

              <h3 className="text-xl sm:text-2xl font-bold mb-3" style={{ color: COLORS.TEXT_PRIMARY }}>
                {item.title}
              </h3>
              <p className="text-sm sm:text-base font-light" style={{ color: COLORS.TEXT_SECONDARY }}>
                {item.desc}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

// CTA Section
export function CtaSection() {
  return (
    <motion.section
      className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 text-center max-w-5xl mx-auto"
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-100px" }}
      variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
    >
      <motion.h2
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight"
        style={{ color: COLORS.TEXT_PRIMARY }}
        variants={fadeInUp}
      >
        Ready to Hire{" "}
        <span style={{ background: ACCENT_GRADIENT, backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}>
          Tier-One Talent?
        </span>
      </motion.h2>

      <motion.p
        className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto mb-12 font-light"
        style={{ color: COLORS.TEXT_SECONDARY }}
        variants={fadeInUp}
      >
        Find out why hundreds of startups and growing businesses trust{" "}
        <span style={{ background: ACCENT_GRADIENT, backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent", fontWeight: "600" }}>
          Finzie
        </span>{" "}
        to power their teams.
      </motion.p>

      <motion.button
        variants={scaleIn}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-8 sm:px-12 py-4 sm:py-5 text-lg font-black rounded-xl border-2 transition-all duration-300 flex items-center gap-2 justify-center mx-auto"
        style={{
          background: COLORS.ACCENT_PRIMARY,
          color: COLORS.TEXT_PRIMARY,
          borderColor: `${COLORS.ACCENT_PRIMARY}30`,
        }}
      >
        Get Started
        <ArrowRight className="w-5 h-5" />
      </motion.button>
    </motion.section>
  );
}

// // Main Page Component
// export default function HiringPage() {
//   return (
//     <main style={{ background: COLORS.BACKGROUND, color: COLORS.TEXT_PRIMARY }}>
//       <HowWeWorkHero />
//       <ProcessSteps />
//       <WhyItWorks />
//       <CtaSection />
//     </main>
//   );
// }