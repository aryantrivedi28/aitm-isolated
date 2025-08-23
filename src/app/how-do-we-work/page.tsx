"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, Award, Zap, Users, ArrowRight, Sparkles, Star, CheckCircle, TrendingUp } from "lucide-react";
import { useRef } from "react";

const customStyles = `
  :root {
    --background: 26 26 26;
    --foreground: 0 0% 100%;
    --card: 255 255 255 / 0.1;
    --card-foreground: 0 0% 100%;
    --popover: 255 255 255 / 0.2;
    --popover-foreground: 0 0% 100%;
    --primary: 51 100% 50%;
    --primary-foreground: 26 26 26;
    --secondary: 44 44 44;
    --secondary-foreground: 0 0% 100%;
    --muted: 255 255 255 / 0.5;
    --muted-foreground: 0 0% 100%;
    --accent: 48 100% 50%;
    --accent-foreground: 26 26 26;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 255 255 255 / 0.3;
    --input: 44 44 44;
    --ring: 255 255 255 / 0.5;
    --chart-1: 51 100% 50%;
    --chart-2: 48 100% 50%;
    --chart-3: 0 0% 98%;
    --chart-4: 0 0% 100%;
    --chart-5: 0 0% 100%;
    --radius: 0.75rem;
    --sidebar-background: 26 26 26;
    --sidebar-foreground: 0 0% 100%;
    --sidebar-primary: 51 100% 50%;
    --sidebar-primary-foreground: 26 26 26;
    --sidebar-accent: 48 100% 50%;
    --sidebar-accent-foreground: 26 26 26;
    --sidebar-border: 255 255 255 / 0.3;
    --sidebar-ring: 255 255 255 / 0.5;
  }

  .glass-card {
    background: rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }

  .glass-button {
    background: rgba(255, 224, 27, 0.9);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 224, 27, 0.2);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  }

  .modern-gradient {
    background: linear-gradient(135deg, hsl(51 100% 50%) 0%, hsl(48 100% 50%) 100%);
  }

  .text-gradient {
    background: linear-gradient(135deg, hsl(51 100% 50%) 0%, hsl(48 100% 50%) 100%);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
  }

  .glow-effect {
    box-shadow: 0 0 20px rgba(255, 224, 27, 0.3), 0 0 40px rgba(255, 224, 27, 0.1);
  }

  body {
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
  }
`;

const fadeInUp = {
  initial: { opacity: 0, y: 100, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 1, ease: [0.25, 0.46, 0.45, 0.94] },
};

const fadeInScale = {
  initial: { opacity: 0, scale: 0.8, rotate: -5 },
  animate: { opacity: 1, scale: 1, rotate: 0 },
  transition: { duration: 0.8, ease: "easeOut" },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const modernButton = {
  initial: {
    scale: 1,
    boxShadow: "0 0 0 0 hsl(var(--primary) / 0)",
  },
  hover: {
    scale: 1.05,
    boxShadow: [
      "0 0 30px 10px hsl(var(--primary) / 0.2)",
      "0 0 60px 20px hsl(var(--primary) / 0.3)",
      "0 0 30px 10px hsl(var(--primary) / 0.2)",
    ],
    transition: {
      duration: 0.4,
      boxShadow: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      },
    },
  },
  tap: { scale: 0.98 },
};

export default function HowWeWork() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true, margin: "-100px" });

  return (
    <>
      <style jsx global>
        {customStyles}
      </style>

      <div className="min-h-screen bg-[#1a1a1a] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 20%, #FFD700 1px, transparent 1px),
                radial-gradient(circle at 80% 80%, #FFCC00 1px, transparent 1px),
                radial-gradient(circle at 40% 60%, #FFD700 0.5px, transparent 0.5px)
              `,
              backgroundSize: "60px 60px, 80px 80px, 40px 40px",
            }}
          />
        </div>

        {/* Floating geometric shapes */}
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 border border-yellow-400/20 rounded-full"
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
        <motion.div
          className="absolute top-40 right-20 w-24 h-24 rounded-2xl backdrop-blur-sm"
          style={{
            background: "linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 204, 0, 0.1) 100%)",
          }}
          animate={{ y: [-20, 20, -20], rotate: [0, 180, 360] }}
          transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />

        {/* Section 1: Ultra-modern header with advanced typography */}
        <motion.section
          ref={heroRef}
          className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 lg:py-32 xl:py-40 text-center max-w-8xl mx-auto relative"
          initial="initial"
          animate={isHeroInView ? "animate" : "initial"}
          variants={staggerContainer}
          style={{ y, opacity }}
        >
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-black mb-8 sm:mb-12 leading-[0.9] tracking-tight px-2"
            variants={fadeInUp}
          >
            A Simple, Structured Process to{" "}
            <span className="relative inline-block">
              <span
                className="drop-shadow-2xl"
                style={{
                  background: "linear-gradient(135deg, #FFD700 0%, #FFCC00 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                Hire Tier-One
              </span>
              <motion.div
                className="absolute -bottom-2 sm:-bottom-4 left-0 right-0 h-1 sm:h-2 rounded-full"
                style={{
                  background: "linear-gradient(135deg, #FFD700 0%, #FFCC00 100%)",
                  boxShadow: "0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1)",
                }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 1.2, duration: 1.2, ease: "easeOut" }}
              />
              <motion.div
                className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 1.5, duration: 0.6, type: "spring" }}
              >
                <Sparkles className="w-4 h-4 text-black" />
              </motion.div>
            </span>{" "}
            <span className="block mt-4">Indian Talent</span>
          </motion.h1>

          <motion.p
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-400 leading-relaxed max-w-6xl mx-auto px-4 font-light"
            variants={fadeInUp}
          >
            At{" "}
            <span
              className="font-semibold"
              style={{
                background: "linear-gradient(135deg, #FFD700 0%, #FFCC00 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Finzie
            </span>
            , we keep hiring straightforward yet effective. Our process ensures{" "}
            <span className="text-white font-medium">speed, accuracy, and quality</span>—so you get the right talent
            every time.
          </motion.p>

          <motion.div
            className="absolute top-20 sm:top-24 right-8 sm:right-16 w-4 h-4 bg-yellow-400 rounded-full"
            style={{
              boxShadow: "0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1)",
            }}
            animate={{ y: [0, -30, 0], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 sm:bottom-24 left-8 sm:left-16 w-6 h-6 border-2 border-yellow-300 rounded-full"
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
        </motion.section>

        <div
          className="h-px max-w-6xl mx-auto mb-12 sm:mb-16 md:mb-20"
          style={{
            background: "linear-gradient(to right, transparent, rgba(255, 255, 255, 0.3), transparent)",
            boxShadow: "0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1)",
          }}
        />

        {/* Section 2: Process steps with advanced glassmorphism */}
        <motion.section
          className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 max-w-8xl mx-auto"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-150px" }}
          variants={staggerContainer}
        >
          <motion.h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-center mb-16 sm:mb-20 md:mb-24 px-4"
            style={{
              background: "linear-gradient(135deg, #FFD700 0%, #FFCC00 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
            variants={fadeInUp}
          >
            Our Process
          </motion.h2>

          <div className="grid gap-12 sm:gap-16 md:gap-20 lg:gap-24">
            {/* Step 1 */}
            <motion.div variants={fadeInUp}>
              <Card
                className="p-8 sm:p-10 md:p-12 lg:p-16 rounded-3xl sm:rounded-4xl hover:scale-[1.02] transition-all duration-700 group relative overflow-hidden"
                style={{
                  background: "rgba(255, 255, 255, 0.06)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                }}
              >
                <motion.div
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, transparent 50%, rgba(255, 204, 0, 0.05) 100%)",
                  }}
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                />

                <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-10 md:gap-12 relative z-10">
                  <motion.div
                    className="text-black rounded-2xl sm:rounded-3xl w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center font-black text-2xl sm:text-3xl md:text-4xl flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #FFD700 0%, #FFCC00 100%)",
                      boxShadow: "0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1)",
                    }}
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    1
                  </motion.div>
                  <div className="flex-1 text-center lg:text-left">
                    <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 group-hover:bg-gradient-to-r group-hover:from-yellow-400 group-hover:to-yellow-300 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500">
                      Share Your Requirements
                    </h3>
                    <p className="text-gray-400 text-xl sm:text-2xl md:text-3xl leading-relaxed font-light">
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
                className="p-8 sm:p-10 md:p-12 lg:p-16 rounded-3xl sm:rounded-4xl hover:scale-[1.02] transition-all duration-700 group relative overflow-hidden"
                style={{
                  background: "rgba(255, 255, 255, 0.06)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                }}
              >
                <motion.div
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255, 204, 0, 0.05) 0%, transparent 50%, rgba(255, 215, 0, 0.05) 100%)",
                  }}
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
                />

                <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-10 md:gap-12 relative z-10">
                  <motion.div
                    className="text-black rounded-2xl sm:rounded-3xl w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center font-black text-2xl sm:text-3xl md:text-4xl flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #FFD700 0%, #FFCC00 100%)",
                      boxShadow: "0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1)",
                    }}
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    2
                  </motion.div>
                  <div className="flex-1 text-center lg:text-left">
                    <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 group-hover:bg-gradient-to-r group-hover:from-yellow-400 group-hover:to-yellow-300 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500">
                      Get Matched with Pre-Vetted Talent
                    </h3>
                    <p className="text-gray-400 text-xl sm:text-2xl md:text-3xl leading-relaxed font-light">
                      Our team combines AI-powered matching with human vetting to shortlist the best candidates for your
                      project. Within days, you'll receive profiles of only the most relevant, top-tier professionals.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Step 3 */}
            <motion.div variants={fadeInUp}>
              <Card
                className="p-8 sm:p-10 md:p-12 lg:p-16 rounded-3xl sm:rounded-4xl hover:scale-[1.02] transition-all duration-700 group relative overflow-hidden"
                style={{
                  background: "rgba(255, 255, 255, 0.06)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                }}
              >
                <motion.div
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, transparent 50%, rgba(255, 204, 0, 0.05) 100%)",
                  }}
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 2 }}
                />

                <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-10 md:gap-12 relative z-10">
                  <motion.div
                    className="text-black rounded-2xl sm:rounded-3xl w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center font-black text-2xl sm:text-3xl md:text-4xl flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #FFD700 0%, #FFCC00 100%)",
                      boxShadow: "0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1)",
                    }}
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    3
                  </motion.div>
                  <div className="flex-1 text-center lg:text-left">
                    <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 group-hover:bg-gradient-to-r group-hover:from-yellow-400 group-hover:to-yellow-300 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500">
                      Deliver with Confidence
                    </h3>
                    <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-10">
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
                          className="flex items-start gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl transition-all duration-500"
                          style={{
                            background: "rgba(255, 255, 255, 0.06)",
                            backdropFilter: "blur(20px)",
                            border: "1px solid rgba(255, 255, 255, 0.15)",
                            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                          }}
                          whileHover={{ x: 10, scale: 1.02 }}
                        >
                          <div
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{
                              background: "linear-gradient(135deg, #FFD700 0%, #FFCC00 100%)",
                            }}
                          >
                            <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
                          </div>
                          <p className="text-gray-400 text-lg sm:text-xl md:text-2xl">
                            <strong className="text-white font-semibold">{item.title}:</strong> {item.desc}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-gray-400 italic text-lg sm:text-xl md:text-2xl font-light">
                      Whichever model you pick, we stay close to ensure smooth execution and guaranteed outcomes.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </motion.section>

        {/* Enhanced divider */}
        <div
          className="h-px max-w-6xl mx-auto my-16 sm:my-20 md:my-24"
          style={{
            background: "linear-gradient(to right, transparent, rgba(255, 255, 255, 0.3), transparent)",
            boxShadow: "0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1)",
          }}
        />

        {/* Section 3: Why Our Process Works with enhanced cards */}
        <motion.section
          className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 max-w-8xl mx-auto"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-150px" }}
          variants={staggerContainer}
        >
          <motion.h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-center mb-16 sm:mb-20 md:mb-24 px-4"
            style={{
              background: "linear-gradient(135deg, #FFD700 0%, #FFCC00 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
            variants={fadeInUp}
          >
            Why Our Process Works
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 sm:gap-10 md:gap-12">
            {[
              {
                icon: Clock,
                title: "Speed",
                desc: "Talent ready in <24 hours, sometimes <6 hours.",
                color: "from-blue-500 to-cyan-500",
                bgColor: "from-blue-500/10 to-cyan-500/10",
              },
              {
                icon: Award,
                title: "Quality",
                desc: "Only the top 3% make it through our screening process.",
                color: "from-purple-500 to-pink-500",
                bgColor: "from-purple-500/10 to-pink-500/10",
              },
              {
                icon: Zap,
                title: "Flexibility",
                desc: "Choose between managed freelancers, freelance hires, or full-time recruitment.",
                color: "from-green-500 to-emerald-500",
                bgColor: "from-green-500/10 to-emerald-500/10",
              },
              {
                icon: Users,
                title: "Trust",
                desc: "A 90%+ client repeat rate speaks for itself.",
                color: "from-red-500 to-orange-500",
                bgColor: "from-red-500/10 to-orange-500/10",
              },
            ].map((item, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card
                  className="p-6 sm:p-8 md:p-10 rounded-3xl hover:scale-110 hover:rotate-2 transition-all duration-700 text-center group h-full relative overflow-hidden"
                  style={{
                    background: "rgba(255, 255, 255, 0.06)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${item.bgColor} rounded-3xl`}
                    animate={{ opacity: [0.2, 0.4, 0.2] }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                      delay: index * 0.5,
                    }}
                  />

                  <motion.div
                    className="relative mb-6 sm:mb-8 z-10"
                    whileHover={{ y: -10, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div
                      className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-gradient-to-br ${item.color} rounded-2xl sm:rounded-3xl mx-auto flex items-center justify-center relative`}
                      style={{
                        boxShadow: "0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1)",
                      }}
                    >
                      <item.icon className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-white" />
                      <motion.div
                        className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-yellow-400 rounded-full flex items-center justify-center"
                        initial={{ scale: 0, rotate: -180 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.8 + index * 0.2, type: "spring" }}
                      >
                        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-black" />
                      </motion.div>
                    </div>
                  </motion.div>

                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 group-hover:bg-gradient-to-r group-hover:from-yellow-400 group-hover:to-yellow-300 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500 relative z-10">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-lg sm:text-xl md:text-2xl leading-relaxed font-light relative z-10">
                    {item.desc}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Section 4: Ultra-premium CTA */}
        <motion.section
          className="px-4 sm:px-6 lg:px-8 py-20 sm:py-24 md:py-28 lg:py-36 xl:py-44 text-center max-w-7xl mx-auto relative"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-150px" }}
          variants={staggerContainer}
        >
          <div
            className="absolute inset-0 rounded-3xl sm:rounded-4xl blur-3xl"
            style={{
              background:
                "linear-gradient(to right, rgba(255, 215, 0, 0.05), rgba(255, 215, 0, 0.1), rgba(255, 215, 0, 0.05))",
            }}
          />
          <div
            className="absolute inset-0 rounded-3xl sm:rounded-4xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(255, 204, 0, 0.05) 0%, transparent 50%, rgba(255, 204, 0, 0.05) 100%)",
            }}
          />

          <motion.div className="relative z-10" variants={fadeInUp}>
            <motion.h2
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-black mb-8 sm:mb-12 leading-[0.9] tracking-tight px-2"
              variants={fadeInUp}
            >
              Ready to Hire{" "}
              <span className="relative inline-block">
                <span
                  className="drop-shadow-2xl"
                  style={{
                    background: "linear-gradient(135deg, #FFD700 0%, #FFCC00 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  Tier-One Talent?
                </span>
                <motion.div
                  className="absolute -bottom-3 sm:-bottom-4 md:-bottom-6 left-0 right-0 h-2 sm:h-3 md:h-4 rounded-full"
                  style={{
                    background: "linear-gradient(135deg, #FFD700 0%, #FFCC00 100%)",
                    boxShadow: "0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1)",
                  }}
                  initial={{ scaleX: 0, opacity: 0 }}
                  whileInView={{ scaleX: 1, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
                />
                <motion.div
                  className="absolute -top-6 -right-6 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center"
                  style={{
                    boxShadow: "0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1)",
                  }}
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 1.2, duration: 0.8, type: "spring" }}
                >
                  <Star className="w-6 h-6 text-black fill-current" />
                </motion.div>
              </span>
            </motion.h2>

            <motion.p
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-400 mb-12 sm:mb-16 md:mb-20 leading-relaxed max-w-5xl mx-auto px-4 font-light"
              variants={fadeInUp}
            >
              Find out why hundreds of startups and growing businesses trust{" "}
              <span
                className="font-semibold"
                style={{
                  background: "linear-gradient(135deg, #FFD700 0%, #FFCC00 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                Finzie
              </span>{" "}
              to power their teams.
            </motion.p>

            <motion.div variants={fadeInUp}>
              <motion.div variants={modernButton} initial="initial" whileHover="hover" whileTap="tap">
                <Button
                  size="lg"
                  className="hover:scale-105 text-black font-black px-10 sm:px-12 md:px-16 lg:px-20 py-6 sm:py-7 md:py-8 lg:py-10 text-xl sm:text-2xl md:text-3xl lg:text-4xl rounded-2xl sm:rounded-3xl border-2 border-yellow-400/30 group relative overflow-hidden transition-all duration-500"
                  style={{
                    background: "rgba(255, 224, 27, 0.9)",
                    backdropFilter: "blur(8px)",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <span className="relative z-10 flex items-center gap-3 sm:gap-4 md:gap-5">
                    Get Started
                    <ArrowRight className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 group-hover:translate-x-2 transition-transform duration-500" />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/20 to-white/10 rounded-2xl sm:rounded-3xl"
                    initial={{ x: "-100%" }}
                    whileHover={{
                      x: "100%",
                      transition: { duration: 0.8, ease: "easeInOut" },
                    }}
                  />
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute top-10 sm:top-16 left-10 sm:left-20 w-8 h-8 sm:w-12 sm:h-12 rounded-full"
            style={{
              background: "linear-gradient(135deg, #FFD700 0%, #FFCC00 100%)",
              boxShadow: "0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1)",
            }}
            animate={{
              y: [0, -40, 0],
              rotate: [0, 180, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-10 sm:bottom-16 right-10 sm:right-20 w-6 h-6 sm:w-10 sm:h-10 border-3 border-yellow-300 rounded-full"
            animate={{
              scale: [1, 1.8, 1],
              opacity: [0.4, 1, 0.4],
              rotate: [0, -180, -360],
            }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/2 left-8 w-4 h-4 bg-yellow-400 rounded-full"
            style={{
              boxShadow: "0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1)",
            }}
            animate={{
              x: [0, 30, 0],
              y: [0, -30, 0],
            }}
            transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
        </motion.section>
      </div>
    </>
  );
}
