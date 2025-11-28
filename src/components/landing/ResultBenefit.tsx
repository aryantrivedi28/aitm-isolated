"use client"
import { motion } from "framer-motion"
import { 
  CheckCircle, 
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

// Icon rotation for benefits
const benefitIcons = [Trophy, TrendingUp, Target, Zap, Star, Award, BarChart3, Rocket, Crown]

export default function ResultBenefit({ heading, subheading, benefits }: ResultBenefitProps) {
  return (
    <section className="relative py-24 overflow-hidden" style={{ backgroundColor: '#fbf5e5' }}>
      {/* Background decorative elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute -left-32 top-0 w-[450px] h-[450px] rounded-full blur-3xl"
        style={{ backgroundColor: '#FFE01B' }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.08, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
        className="absolute -right-32 bottom-0 w-[500px] h-[500px] rounded-full blur-3xl"
        style={{ backgroundColor: '#FFE01B' }}
      />

      {/* Floating stars animation */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, 0],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-32 right-[15%] hidden lg:block"
      >
        <Star className="h-10 w-10" style={{ color: '#FFE01B' }} />
      </motion.div>
      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -10, 0],
          opacity: [0.15, 0.35, 0.15]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-40 left-[12%] hidden lg:block"
      >
        <Trophy className="h-12 w-12" style={{ color: '#FFE01B' }} />
      </motion.div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Icon badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -90 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
          className="flex justify-center mb-8"
        >
          <div 
            className="inline-flex p-4 rounded-full border-4 shadow-xl"
            style={{ 
              backgroundColor: '#FFE01B',
              borderColor: '#241C15'
            }}
          >
            <Trophy className="h-10 w-10" style={{ color: '#241C15' }} />
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-6"
        >
          <h2 className="text-4xl md:text-6xl font-bold leading-tight" style={{ color: '#241C15' }}>
            {heading}
          </h2>
        </motion.div>

        {/* Decorative line */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "160px" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="h-1 mx-auto mb-8 rounded-full"
          style={{ backgroundColor: '#FFE01B' }}
        />

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-xl md:text-2xl text-center max-w-3xl mx-auto mb-16"
          style={{ color: '#241C15', opacity: 0.8 }}
        >
          {subheading}
        </motion.p>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits?.map((benefit: string, index: number) => {
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
                whileHover={{ scale: 1.05, y: -8 }}
                className="bg-white rounded-xl p-6 border-2 shadow-lg hover:shadow-2xl transition-all duration-300 group"
                style={{ borderColor: '#FFE01B' }}
              >
                <div className="flex items-start space-x-4">
                  {/* Icon with number badge */}
                  <div className="relative flex-shrink-0">
                    <div 
                      className="p-3 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                      style={{ backgroundColor: '#FFE01B' }}
                    >
                      <IconComponent className="h-7 w-7" style={{ color: '#241C15' }} />
                    </div>
                    {/* Number badge */}
                    <div 
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-md"
                      style={{ backgroundColor: '#241C15', color: '#FFE01B' }}
                    >
                      {index + 1}
                    </div>
                  </div>

                  {/* Benefit text */}
                  <div className="flex-1">
                    <p 
                      className="text-base md:text-lg leading-relaxed font-medium"
                      style={{ color: '#241C15', opacity: 0.9 }}
                    >
                      {benefit}
                    </p>
                  </div>
                </div>

                {/* Checkmark indicator at bottom */}
                <div className="flex items-center justify-end mt-4 pt-4 border-t" style={{ borderTopColor: '#fbf5e5' }}>
                  <div className="flex items-center space-x-2 opacity-70 group-hover:opacity-100 transition-opacity">
                    <CheckCircle className="h-4 w-4" style={{ color: '#FFE01B' }} />
                    <span className="text-xs font-semibold" style={{ color: '#241C15' }}>Guaranteed</span>
                  </div>
                </div>

                {/* Animated accent bar */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
                  className="h-1 mt-4 rounded-full"
                  style={{ 
                    backgroundColor: '#FFE01B',
                    transformOrigin: 'left'
                  }}
                />
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div 
            className="inline-flex items-center space-x-3 px-10 py-5 rounded-full border-2 shadow-xl"
            style={{ 
              backgroundColor: 'white',
              borderColor: '#FFE01B'
            }}
          >
            <Crown className="h-6 w-6" style={{ color: '#FFE01B' }} />
            <span className="font-bold text-xl" style={{ color: '#241C15' }}>
              Start Achieving These Results
            </span>
            <Crown className="h-6 w-6" style={{ color: '#FFE01B' }} />
          </div>
        </motion.div>
      </div>

      {/* Animated particles */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          x: [0, 15, 0],
          opacity: [0.2, 0.5, 0.2]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-48 left-[10%] w-3 h-3 rounded-full hidden lg:block"
        style={{ backgroundColor: '#FFE01B' }}
      />
      <motion.div
        animate={{
          y: [0, 30, 0],
          x: [0, -10, 0],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-32 right-[12%] w-4 h-4 rounded-full hidden lg:block"
        style={{ backgroundColor: '#FFE01B' }}
      />
      <motion.div
        animate={{
          y: [0, -20, 0],
          opacity: [0.25, 0.45, 0.25]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute top-1/3 right-[8%] w-2 h-2 rounded-full hidden lg:block"
        style={{ backgroundColor: '#FFE01B' }}
      />
    </section>
  )
}