"use client"
import { motion } from "framer-motion"
import {
  Trophy,
  TrendingUp,
  Target,
  Zap,
  Star,
  Award,
  BarChart3,
  Rocket,
  Crown
} from "lucide-react"

interface ResultBenefitProps {
  heading: string
  subheading: string
  benefits: string[]
}

const benefitIcons = [
  Trophy,
  TrendingUp,
  Target,
  Zap,
  Star,
  Award,
  BarChart3,
  Rocket,
  Crown
]

export default function ResultBenefit({ heading, subheading, benefits }: ResultBenefitProps) {
  return (
    <section className="relative py-24 overflow-hidden bg-[#fbf5e5]">
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8"> {/* Reduced padding */}

        {/* Section Tag */}
        <div className="flex justify-center py-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white border shadow-sm border-[#FFE01B]"
          >
            <BarChart3 className="w-4 h-4 text-[#241C15]" />
            <span className="text-sm font-semibold text-[#241C15]">
              RESULTS & BENEFITS
            </span>
          </motion.div>
        </div>

        {/* Heading - Fixed width issue */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center mb-6 leading-tight max-w-4xl mx-auto px-4"
          style={{ color: "#241C15" }}
        >
          {heading}
        </motion.h2>

        {/* Decorative Line */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "160px" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="h-1 mx-auto mb-12 rounded-full bg-[#FFE01B]"
        />

        {/* Benefits Grid - Improved responsive layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-0">
          {benefits?.map((benefit, index) => {
            const IconComponent = benefitIcons[index % benefitIcons.length]

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 shadow-lg hover:shadow-xl transition-all duration-300 relative group border-[#FFE01B] min-h-[120px] flex items-start"
              >
                <div className="flex items-start space-x-3 sm:space-x-4 w-full">

                  {/* Icon */}
                  <div className="relative flex-shrink-0">
                    <div
                      className="p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 bg-[#FFE01B]"
                    >
                      <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-[#241C15]" />
                    </div>

                    {/* Number Badge */}
                    <div
                      className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-md bg-[#241C15] text-[#FFE01B]"
                    >
                      {index + 1}
                    </div>
                  </div>

                  {/* Benefit Content - Fixed text issues */}
                  <div className="flex-1 min-w-0"> {/* Added min-w-0 for text truncation */}
                    <p
                      className="text-sm sm:text-base md:text-lg font-semibold leading-relaxed text-[#241C15] break-words"
                    >
                      {benefit}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-base sm:text-lg md:text-xl text-center max-w-3xl mx-auto mt-12 sm:mt-16 font-semibold px-4 text-[#241C15] opacity-75"
        >
          {subheading}
        </motion.p>
      </div>
    </section>
  )
}
