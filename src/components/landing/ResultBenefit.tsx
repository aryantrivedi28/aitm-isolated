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
    <section className="relative py-20 overflow-hidden bg-[#fbf5e5]">
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-center max-w-4xl mx-auto mb-6 px-4 text-[#241C15] "
        >
          {heading}
        </motion.h2>

        {/* Decorative Line */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "160px" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="h-1 mx-auto mb-12 rounded-full bg-[#f7af00]"
        />

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
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
                className="bg-[#f0eadd] rounded-2xl p-4 sm:p-6 hover:shadow-xl transition-all duration-300 relative group flex flex-col" // Changed to flex-col
              >
                <div className="flex items-start space-x-3 sm:space-x-4 mb-3"> {/* Added margin bottom */}

                  {/* Icon */}
                  <div className="relative flex-shrink-0">
                    <div className="p-2 sm:p-3 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 bg-[#f7af00]">
                      <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-[#241C15]" />
                    </div>

                    {/* Number Badge */}
                    <div className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-md bg-[#241C15] text-[#FFE01B]">
                      {index + 1}
                    </div>
                  </div>

                  {/* Text - Takes remaining space */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base md:text-lg font-normal leading-relaxed text-[#241C15] break-words">
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
          className="text-base sm:text-lg md:text-xl text-center max-w-3xl mx-auto mt-16 font-semibold px-4 text-[#241C15]/70 opacity-5"
        >
          {subheading}
        </motion.p>
      </div>
    </section>
  )
}
