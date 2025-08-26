"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Clock, Award, Zap, Users, ArrowRight, Sparkles, Star, CheckCircle, TrendingUp, Briefcase } from "lucide-react";
import { fadeInUp, staggerContainer, modernButton, fadeUp } from "./motion-variants";

// Hero Section
export function HowWeWorkHero({ heroRef, isHeroInView, style }: any) {

  return (
    <motion.section
      ref={heroRef}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 text-left"
      initial="initial"
      animate={isHeroInView ? "animate" : "initial"}
      variants={staggerContainer}
      style={style}
    >
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
          <Briefcase className="w-6 h-6 text-[#FFE01B]" />
        </motion.div>
        <span className="text-[#FFE01B] font-semibold text-lg">Hiring</span>
      </motion.div>

      <motion.h1
        className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-6 sm:mb-8 md:mb-10 leading-[1.1] tracking-tight px-2 text-white"
        variants={staggerContainer}
      >
        <motion.span variants={fadeInUp} className="block">
          A Simple, Structured
        </motion.span>
        <motion.span variants={fadeInUp} className="block">
          Process to
        </motion.span>
        <motion.span variants={fadeInUp} className="relative inline-block mt-4">
          <span
            className="drop-shadow-xl"
            style={{
              background: "linear-gradient(135deg, #FFE01B 0%, #FFCC00 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Hire Tier-One
          </span>
          <motion.div
            className="absolute -bottom-1 sm:-bottom-2 md:-bottom-3 left-0 h-0.5 sm:h-1 md:h-1.5 rounded-full"
            style={{
              background: "linear-gradient(135deg, #FFE01B 0%, #FFCC00 100%)",
              boxShadow: "0 0 15px rgba(255, 224, 27, 0.3), 0 0 30px rgba(255, 224, 27, 0.1)",
              width: '100%'
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 1, duration: 1, ease: "easeOut" }}
          />
          <motion.div
            className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-4 h-4 sm:w-6 sm:h-6 bg-[#FFE01B] rounded-full flex items-center justify-center"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 1.2, duration: 0.5, type: "spring" }}
          >
            <Sparkles className="w-2 h-2 sm:w-3 sm:h-3 text-[#241C15]" />
          </motion.div>
        </motion.span>
        <motion.span variants={fadeInUp} className="block mt-2">
          <span className="text-white">Indian Talent</span>
        </motion.span>
      </motion.h1>

      <motion.p
        className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-white/70 leading-relaxed max-w-4xl px-4 font-light mb-8 sm:mb-10 md:mb-12"
        variants={fadeInUp}
      >
        At{" "}
        <span
          className="font-semibold"
          style={{
            background: "linear-gradient(135deg, #FFE01B 0%, #FFCC00 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          Finzie
        </span>
        , we keep hiring straightforward yet effective. Our process ensures{" "}
        <span className="text-white font-medium">speed, accuracy, and quality</span> so you get the right talent
        every time.
      </motion.p>

      <motion.div
        className="absolute top-12 sm:top-16 right-4 sm:right-8 w-2 h-2 sm:w-3 sm:h-3 bg-[#FFE01B] rounded-full"
        style={{
          boxShadow: "0 0 15px rgba(255, 224, 27, 0.3), 0 0 25px rgba(255, 224, 27, 0.1)",
        }}
        animate={{ y: [0, -20, 0], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-12 sm:bottom-16 left-4 sm:left-8 w-3 h-3 sm:w-4 sm:h-4 border-2 border-[#FFE01B]/50 rounded-full"
        animate={{ rotate: 360, scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
    </motion.section>
  );
}

// Process Steps Section
export function ProcessSteps() {
  return (
    <motion.section
      className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 max-w-6xl mx-auto z-10 relative"
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
    >
      <div className="relative mb-10 sm:mb-14 md:mb-16">
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-center relative block"
          style={{
            background: "linear-gradient(135deg, #FFE01B 0%, #FFCC00 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            textShadow: "0 0 10px rgba(255, 224, 27, 0.5)",
          }}
          variants={fadeInUp}
        >
          <span className="relative inline-block px-4">
            Our Process
            <motion.div
              className="absolute -bottom-4 left-0 w-full h-1 rounded-full"
              style={{
                background: "linear-gradient(135deg, #FFE01B 0%, #FFCC00 100%)",
                boxShadow: "0 0 15px rgba(255, 224, 27, 0.3), 0 0 25px rgba(255, 224, 27, 0.1)",
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
            />
          </span>
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-10 mb-6 sm:mb-8 md:mb-10 lg:mb-12">
        {/* Step 1 */}
        <motion.div variants={fadeInUp}>
          <Card
            className="p-3 sm:p-4 md:p-5 lg:p-6 rounded-xl sm:rounded-2xl hover:scale-[1.01] transition-all duration-500 group relative overflow-hidden h-full"
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.25)",
            }}
          >
            <motion.div
              className="absolute inset-0 rounded-xl sm:rounded-2xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255, 224, 27, 0.05) 0%, transparent 50%, rgba(255, 204, 0, 0.05) 100%)",
              }}
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />

            <div className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: "linear-gradient(135deg, rgba(255, 224, 27, 0.2) 0%, rgba(255, 204, 0, 0.2) 100%)",
                boxShadow: "0 0 0 1px rgba(255, 224, 27, 0.5), 0 0 20px rgba(255, 224, 27, 0.3)",
              }}
            />

            <div className="flex flex-col items-center gap-2 sm:gap-3 md:gap-4 relative z-10 text-center">
              <motion.div
                className="text-[#241C15] rounded-lg sm:rounded-xl w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 lg:w-12 lg:h-12 flex items-center justify-center font-black text-sm sm:text-base md:text-lg flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, #FFE01B 0%, #FFCC00 100%)",
                  boxShadow: "0 0 15px rgba(255, 224, 27, 0.3), 0 0 25px rgba(255, 224, 27, 0.1)",
                }}
                whileHover={{ rotate: 8, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                1
              </motion.div>
              <div className="flex-1">
                <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-2 sm:mb-3 group-hover:bg-gradient-to-r group-hover:from-[#FFE01B] group-hover:to-[#FFCC00] group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500">
                  Share Your Requirements
                </h3>
                <p className="text-white/70 text-xs sm:text-sm md:text-base leading-relaxed font-light">
                  Tell us what you need—whether it's a managed freelancer, a short-term hire, or a full-time
                  professional. We take the time to understand your goals, budget, and expectations.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Step 2 */}
        <motion.div variants={fadeInUp}>
          <Card
            className="p-3 sm:p-4 md:p-5 lg:p-6 rounded-xl sm:rounded-2xl hover:scale-[1.01] transition-all duration-500 group relative overflow-hidden h-full"
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.25)",
            }}
          >
            <motion.div
              className="absolute inset-0 rounded-xl sm:rounded-2xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255, 204, 0, 0.05) 0%, transparent 50%, rgba(255, 224, 27, 0.05) 100%)",
              }}
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.5 }}
            />

            <div className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: "linear-gradient(135deg, rgba(255, 224, 27, 0.2) 0%, rgba(255, 204, 0, 0.2) 100%)",
                boxShadow: "0 0 0 1px rgba(255, 224, 27, 0.5), 0 0 20px rgba(255, 224, 27, 0.3)",
              }}
            />

            <div className="flex flex-col items-center gap-2 sm:gap-3 md:gap-4 relative z-10 text-center">
              <motion.div
                className="text-[#241C15] rounded-lg sm:rounded-xl w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 lg:w-12 lg:h-12 flex items-center justify-center font-black text-sm sm:text-base md:text-lg flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, #FFE01B 0%, #FFCC00 100%)",
                  boxShadow: "0 0 15px rgba(255, 224, 27, 0.3), 0 0 25px rgba(255, 224, 27, 0.1)",
                }}
                whileHover={{ rotate: 8, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                2
              </motion.div>
              <div className="flex-1">
                <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-2 sm:mb-3 group-hover:bg-gradient-to-r group-hover:from-[#FFE01B] group-hover:to-[#FFCC00] group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500">
                  Get Matched with Pre-Vetted Talent
                </h3>
                <p className="text-white/70 text-xs sm:text-sm md:text-base leading-relaxed font-light">
                  Our team combines AI-powered matching with human vetting to shortlist the best candidates for your
                  project. Within days, you'll receive profiles of only the most relevant, top-tier professionals.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Step 3 - Full width below */}
      <motion.div variants={fadeInUp}>
        <Card
          className="p-3 sm:p-4 md:p-5 lg:p-6 rounded-xl sm:rounded-2xl hover:scale-[1.01] transition-all duration-500 group relative overflow-hidden"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.25)",
          }}
        >
          <motion.div
            className="absolute inset-0 rounded-xl sm:rounded-2xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(255, 224, 27, 0.05) 0%, transparent 50%, rgba(255, 204, 0, 0.05) 100%)",
            }}
            animate={{ opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
          />

          <div className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: "linear-gradient(135deg, rgba(255, 224, 27, 0.2) 0%, rgba(255, 204, 0, 0.2) 100%)",
              boxShadow: "0 0 0 1px rgba(255, 224, 27, 0.5), 0 0 20px rgba(255, 224, 27, 0.3)",
            }}
          />

          <div className="flex flex-col lg:flex-row items-center gap-2 sm:gap-3 md:gap-4 relative z-10">
            <motion.div
              className="text-[#241C15] rounded-lg sm:rounded-xl w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 lg:w-12 lg:h-12 flex items-center justify-center font-black text-sm sm:text-base md:text-lg flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #FFE01B 0%, #FFCC00 100%)",
                boxShadow: "0 0 15px rgba(255, 224, 27, 0.3), 0 0 25px rgba(255, 224, 27, 0.1)",
              }}
              whileHover={{ rotate: 8, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              3
            </motion.div>
            <div className="flex-1 text-center lg:text-left">
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-2 sm:mb-3 group-hover:bg-gradient-to-r group-hover:from-[#FFE01B] group-hover:to-[#FFCC00] group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500">
                Deliver with Confidence
              </h3>
              <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                {[
                  {
                    title: "Managed Freelancer",
                    desc: "We oversee delivery & quality end-to-end.",
                    icon: CheckCircle,
                  },
                  {
                    title: "Freelancer Hiring",
                    desc: "Work directly with the freelancer you select.",
                    icon: Users,
                  },
                  {
                    title: "Full-Time Recruitment",
                    desc: "We help you hire & onboard a full-time professional into your team.",
                    icon: TrendingUp,
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 md:p-4 rounded-lg transition-all duration-500"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      boxShadow: "0 15px 35px -12px rgba(0, 0, 0, 0.25)",
                    }}
                    whileHover={{ x: 8, scale: 1.01 }}
                  >
                    <div
                      className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-md flex items-center justify-center flex-shrink-0"
                      style={{
                        background: "linear-gradient(135deg, #FFE01B 0%, #FFCC00 100%)",
                      }}
                    >
                      <item.icon className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-[#241C15]" />
                    </div>
                    <p className="text-white/70 text-xs sm:text-sm md:text-base">
                      <strong className="text-white font-semibold">{item.title}:</strong> {item.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
              <p className="text-white/70 italic text-xs sm:text-sm md:text-base font-light">
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
      className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 max-w-7xl mx-auto z-10 relative"
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
    >
      <div className="relative mb-10 sm:mb-14 md:mb-16">
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-center relative block"
          style={{
            background: "linear-gradient(135deg, #FFE01B 0%, #FFCC00 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
          }}
          variants={fadeInUp}
        >
          <span className="relative inline-block px-4">
            Why Our Process Works
            <motion.div
              className="absolute -bottom-4 left-0 w-full h-1 rounded-full"
              style={{
                background: "linear-gradient(135deg, #FFE01B 0%, #FFCC00 100%)",
                boxShadow: "0 0 15px rgba(255, 224, 27, 0.3), 0 0 25px rgba(255, 224, 27, 0.1)",
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
            />
          </span>
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
        {[
          {
            icon: Clock,
            title: "Speed",
            desc: "Talent ready in <24 hours, sometimes <6 hours.",
          },
          {
            icon: Award,
            title: "Quality",
            desc: "Only the top 3% make it through our screening process.",
          },
          {
            icon: Zap,
            title: "Flexibility",
            desc: "Choose between managed freelancers, freelance hires, or full-time recruitment.",
          },
          {
            icon: Users,
            title: "Trust",
            desc: "A 90%+ client repeat rate speaks for itself.",
          },
        ].map((item, index) => (
          <motion.div key={index} variants={fadeInUp}>
            <Card
              className="p-4 sm:p-6 md:p-7 rounded-2xl hover:scale-105 hover:rotate-1 transition-all duration-500 text-center group h-full relative overflow-hidden"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.25)",
              }}
            >
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br from-white/5 to-white/5 rounded-2xl`}
                animate={{ opacity: [0.2, 0.4, 0.2] }}
                transition={{
                  duration: 2.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: index * 0.4,
                }}
              />

              <motion.div
                className="relative mb-5 sm:mb-6 z-10"
                whileHover={{ y: -8, rotate: 3 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 bg-white/10 rounded-xl sm:rounded-2xl mx-auto flex items-center justify-center relative`}
                  style={{
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    boxShadow: "0 0 15px rgba(255, 224, 27, 0.3), 0 0 25px rgba(255, 224, 27, 0.1)",
                  }}
                >
                  <item.icon className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 text-white" />
                  <motion.div
                    className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-5 sm:h-5 bg-[#FFE01B] rounded-full flex items-center justify-center"
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.6 + index * 0.15, type: "spring" }}
                  >
                    <Sparkles className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-[#241C15]" />
                  </motion.div>
                </div>
              </motion.div>

              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 group-hover:bg-gradient-to-r group-hover:from-[#FFE01B] group-hover:to-[#FFCC00] group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500 relative z-10">
                {item.title}
              </h3>
              <p className="text-white/70 text-sm sm:text-base md:text-lg leading-relaxed font-light relative z-10">
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
import { useRouter } from "next/navigation";

export function CtaSection() {
  const router = useRouter();
  return (
    <motion.section
      className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32 text-center max-w-7xl mx-auto relative z-10"
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
    >
      {/* Background layers */}
      <div
        className="absolute inset-0 rounded-2xl sm:rounded-3xl blur-3xl"
        style={{
          background:
            "linear-gradient(to right, rgba(255, 224, 27, 0.05), rgba(255, 224, 27, 0.1), rgba(255, 224, 27, 0.05))",
        }}
      />
      <div
        className="absolute inset-0 rounded-2xl sm:rounded-3xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(255, 204, 0, 0.05) 0%, transparent 50%, rgba(255, 204, 0, 0.05) 100%)",
        }}
      />

      <motion.div className="relative z-10" variants={fadeInUp}>
        {/* Heading */}
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black mb-6 sm:mb-8 md:mb-10 leading-[0.9] tracking-tight px-2 text-white"
          variants={fadeInUp}
        >
          Ready to Hire{" "}
          <span className="relative inline-block">
            <span
              className="drop-shadow-xl"
              style={{
                background: "linear-gradient(135deg, #FFE01B 0%, #FFCC00 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Tier-One Talent?
            </span>
            {/* Underline */}
            <motion.div
              className="absolute -bottom-2 sm:-bottom-3 md:-bottom-4 left-0 right-0 h-1 sm:h-1.5 md:h-2 rounded-full"
              style={{
                background: "linear-gradient(135deg, #FFE01B 0%, #FFCC00 100%)",
                boxShadow:
                  "0 0 15px rgba(255, 224, 27, 0.3), 0 0 25px rgba(255, 224, 27, 0.1)",
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.6, duration: 1.2, ease: "easeOut" }}
            />
            {/* Star badge */}
            <motion.div
              className="absolute -top-5 -right-5  sm:-top-5 sm:-right-5 md:-top-8 md:-right-8 lg:-top-9 lg:-right-9 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-[#FFE01B] rounded-full flex items-center justify-center translate-x-1 sm:translate-x-2 md:translate-x-3
  "
              style={{
                boxShadow:
                  "0 0 15px rgba(255, 224, 27, 0.3), 0 0 25px rgba(255, 224,827, 0.1)",
              }}
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              transition={{ delay: 1, duration: 0.6, type: 'spring' }}
            >
              <Star className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-[#241C15] fill-current" />
            </motion.div>

          </span>
        </motion.h2>

        {/* Subtext */}
        <motion.p
          className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/70 mb-8 sm:mb-10 md:mb-12 leading-relaxed max-w-4xl mx-auto px-4 font-light"
          variants={fadeInUp}
        >
          Find out why hundreds of startups and growing businesses trust{" "}
          <span
            className="font-semibold"
            style={{
              background: "linear-gradient(135deg, #FFE01B 0%, #FFCC00 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Finzie
          </span>{" "}
          to power their teams.
        </motion.p>

        {/* CTA Button */}
        <motion.div variants={fadeInUp}>
          <motion.div variants={modernButton} initial="initial">
            <button
              onClick={() => router.push("/find-talent")}
              className="group relative px-6 sm:px-8 md:px-10 lg:px-12 py-4 sm:py-5 md:py-6 text-base sm:text-lg md:text-xl lg:text-2xl font-black text-[#241C15] rounded-xl sm:rounded-2xl border-2 border-[#FFE01B]/30 bg-[#FFE01B] shadow-md hover:shadow-none hover:scale-105 backdrop-blur-md transition-all duration-500"
            >
              <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                Get Started
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 transition-transform duration-500 group-hover:translate-x-1" />
              </span>
            </button>
          </motion.div>
        </motion.div>

      </motion.div>

      {/* Floating decorations */}
      <motion.div
        className="absolute top-8 sm:top-12 left-8 sm:left-16 w-6 h-6 sm:w-8 sm:h-8 rounded-full"
        style={{
          background: "linear-gradient(135deg, #FFE01B 0%, #FFCC00 100%)",
          boxShadow:
            "0 0 15px rgba(255, 224, 27, 0.3), 0 0 25px rgba(255, 224, 27, 0.1)",
        }}
        animate={{
          y: [0, -30, 0],
          rotate: [0, 180, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-8 sm:bottom-12 right-8 sm:right-16 w-4 h-4 sm:w-6 sm:h-6 border-2 sm:border-3 border-[#FFE01B]/50 rounded-full"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.4, 1, 0.4],
          rotate: [0, -180, -360],
        }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-6 w-3 h-3 bg-[#FFE01B] rounded-full"
        style={{
          boxShadow:
            "0 0 15px rgba(255, 224, 27, 0.3), 0 0 25px rgba(255, 224, 27, 0.1)",
        }}
        animate={{
          x: [0, 25, 0],
          y: [0, -25, 0],
        }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
    </motion.section>
  );
}