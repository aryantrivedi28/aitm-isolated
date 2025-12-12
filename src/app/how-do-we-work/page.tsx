"use client";

import { motion } from "framer-motion";
import { HowWeWorkHero } from "./components/how-we-work-sections";
import { ProcessSteps } from "./components/how-we-work-sections";
import { WhyItWorks } from "./components/how-we-work-sections";
import { CtaSection } from "./components/how-we-work-sections";

// Color Palette
const COLORS = {
  BACKGROUND: "#faf4e5",
  TEXT_PRIMARY: "#050504",
  ACCENT_PRIMARY: "#f7af00",
  TEXT_SECONDARY: "#31302f",
  BACKGROUND_SECONDARY: "#f0eadd",
};

export default function HowWeWork() {
  return (
    <div
      className="min-h-[80vh] relative overflow-hidden pt-20 sm:pt-24 md:pt-28 z-10"
      style={{
        background: COLORS.BACKGROUND,
        color: COLORS.TEXT_PRIMARY,
      }}
    >
      {/* Subtle background dots */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
      radial-gradient(circle at 20% 20%, ${COLORS.ACCENT_PRIMARY} 1px, transparent 1px),
      radial-gradient(circle at 80% 80%, ${COLORS.ACCENT_PRIMARY} 1px, transparent 1px)
    `,
          backgroundSize: "40px 40px, 60px 60px",
          opacity: 0.08,
        }}
      ></div>


      {/* Main content */}
      <div className="relative z-20">
        <HowWeWorkHero />

        {/* Separator 1 */}
        <div
          className="h-px max-w-4xl mx-auto my-12 sm:my-16 md:my-20"
          style={{
            background: `linear-gradient(to right, transparent, ${COLORS.TEXT_SECONDARY}30, transparent)`,
          }}
        />

        <ProcessSteps />

        {/* Separator 2 */}
        <div
          className="h-px max-w-4xl mx-auto my-12 sm:my-16 md:my-20"
          style={{
            background: `linear-gradient(to right, transparent, ${COLORS.TEXT_SECONDARY}30, transparent)`,
          }}
        />

        <WhyItWorks />

        <CtaSection />
      </div>
    </div>
  );
}