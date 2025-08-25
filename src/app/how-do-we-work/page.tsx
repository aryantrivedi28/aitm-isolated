"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";
import { HowWeWorkHero } from "./components/how-we-work-sections";
import { ProcessSteps } from "./components/how-we-work-sections";
import { WhyItWorks } from "./components/how-we-work-sections";
import { CtaSection } from "./components/how-we-work-sections";
import { customStyles, fadeInUp, staggerContainer } from "./components/motion-variants";

export default function HowWeWork() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true, margin: "-50px" });

  return (
    <>
      <style jsx global>
        {customStyles}
      </style>

      <div className="min-h-screen bg-[#241C15] text-[#FFE01B] relative overflow-hidden">
        {/* Decorative Background Dots and Floating shapes */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 20%, #FFE01B 1px, transparent 1px),
                radial-gradient(circle at 80% 80%, #FFCC00 1px, transparent 1px),
                radial-gradient(circle at 40% 60%, #FFE01B 0.5px, transparent 0.5px)
              `,
              backgroundSize: "40px 40px, 60px 60px, 30px 30px",
              opacity: 0.1,
            }}
          />
        </div>
        <motion.div
          className="absolute top-16 left-4 md:top-20 md:left-10 w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 border border-[#FFE01B]/20 rounded-full"
          animate={{ rotate: 360, scale: [1, 1.05, 1] }}
          transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
        <motion.div
          className="absolute top-20 right-4 md:top-32 md:right-16 w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-xl backdrop-blur-sm"
          style={{
            background: "linear-gradient(135deg, rgba(255, 224, 27, 0.1) 0%, rgba(255, 204, 0, 0.1) 100%)",
          }}
          animate={{ y: [-15, 15, -15], rotate: [0, 120, 240] }}
          transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />

        <HowWeWorkHero heroRef={heroRef} isHeroInView={isHeroInView} style={{ y, opacity }} />

        <div
          className="h-px max-w-4xl mx-auto mb-8 sm:mb-12 md:mb-16"
          style={{
            background: "linear-gradient(to right, transparent, rgba(255, 255, 255, 0.3), transparent)",
            boxShadow: "0 0 15px rgba(255, 224, 27, 0.3), 0 0 25px rgba(255, 224, 27, 0.1)",
          }}
        />

        <ProcessSteps />

        <div
          className="h-px max-w-4xl mx-auto my-12 sm:my-16 md:my-20"
          style={{
            background: "linear-gradient(to right, transparent, rgba(255, 255, 255, 0.3), transparent)",
            boxShadow: "0 0 15px rgba(255, 224, 27, 0.3), 0 0 25px rgba(255, 224, 27, 0.1)",
          }}
        />

        <WhyItWorks />

        <CtaSection />
      </div>
    </>
  );
}