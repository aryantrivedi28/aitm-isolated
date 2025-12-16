"use client"
import { motion } from "framer-motion"
import { Check } from "lucide-react"

interface IncludesSectionProps {
  heading: string
  subheading?: string
  items: string[]
}

export default function IncludesSection({
  heading,
  subheading,
  items,
}: IncludesSectionProps) {
  return (
    <section className="relative overflow-hidden bg-[#f0eadd] py-16 sm:py-20 lg:py-24">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="
            text-center font-medium leading-tight
            text-2xl sm:text-3xl md:text-4xl lg:text-5xl
            w-full sm:w-[85%] lg:w-[70%]
            mx-auto mb-4 sm:mb-6
          "
          style={{ color: "#241C15" }}
        >
          {heading}
        </motion.h2>

        {/* Subheading */}
        {subheading && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="
              text-center mx-auto
              text-base sm:text-lg md:text-xl
              max-w-2xl
              mb-10 sm:mb-14
            "
            style={{ color: "#241C15", opacity: 0.85 }}
          >
            {subheading}
          </motion.p>
        )}

        {/* Items Grid */}
        <div
          className="
            grid grid-cols-1
            sm:grid-cols-3
            gap-4 sm:gap-5
            max-w-full 
            mx-auto
          "
        >
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.05,
              }}
              whileHover={{ scale: 1.02 }}
              className="
                flex items-start sm:items-center
                p-4 sm:p-5
                rounded-xl
                border
                shadow-md
                transition-all
                bg-[#fbf5e5]
              "
            >
              {/* Icon */}
              <div
                className="
                  flex-shrink-0
                  w-9 h-9 sm:w-10 sm:h-10
                  rounded-full
                  flex items-center justify-center
                  mr-3 sm:mr-4
                "
                style={{ backgroundColor: "#f7af00" }}
              >
                <Check
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  style={{ color: "#241C15" }}
                  strokeWidth={3}
                />
              </div>

              {/* Text */}
              <span
                className="text-sm sm:text-base md:text-lg font-medium leading-snug"
                style={{ color: "#241C15" }}
              >
                {item}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
