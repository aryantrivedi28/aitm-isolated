"use client"
import { motion } from "framer-motion"
import {
  Code2,
  Cpu,
  Layers,
  Plug,
  Workflow,
  Zap,
  Box,
  GitBranch,
  Settings,
  Terminal,
  Database,
  Cloud,
  Lock,
  Puzzle,
  CodeXml
} from "lucide-react"

interface DevIntegrationProps {
  heading: string
  subheading?: string
  items: Array<{ title: string; description: string }>
}

// Icon mapping for development/integration topics
const getIntegrationIcon = (title: string, index: number) => {
  const titleLower = title?.toLowerCase() || ""

  if (titleLower.includes("api") || titleLower.includes("endpoint")) return Plug
  if (titleLower.includes("workflow") || titleLower.includes("automation")) return Workflow
  if (titleLower.includes("code") || titleLower.includes("develop")) return Code2
  if (titleLower.includes("integration") || titleLower.includes("connect")) return Puzzle
  if (titleLower.includes("database") || titleLower.includes("data")) return Database
  if (titleLower.includes("cloud") || titleLower.includes("server")) return Cloud
  if (titleLower.includes("security") || titleLower.includes("secure")) return Lock
  if (titleLower.includes("deploy") || titleLower.includes("build")) return GitBranch
  if (titleLower.includes("config") || titleLower.includes("setting")) return Settings
  if (titleLower.includes("terminal") || titleLower.includes("cli")) return Terminal
  if (titleLower.includes("layer") || titleLower.includes("stack")) return Layers
  if (titleLower.includes("process") || titleLower.includes("cpu")) return Cpu

  // Default rotation
  const defaultIcons = [Code2, Plug, Workflow, Layers, Cpu, Zap, Box, GitBranch]
  return defaultIcons[index % defaultIcons.length]
}

export default function DevIntegration({ heading, subheading, items }: DevIntegrationProps) {
  return (
    <section className="relative py-24 overflow-hidden bg-[#fbf5e5]">
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex justify-center py-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#fbf5e5] backdrop-blur border border-[#FFE01B]/20 shadow-lg"
          >
            <CodeXml className="w-4 h-4 text-[#050504]" />
            <span className="text-sm font-semibold text-[#050504]">
              DEVELOPMENT & INTEGRATION
            </span>
          </motion.div>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-2xl sm:text-3xl md:text-5xl font-medium text-center mb-4 md:mb-6 leading-tight w-[70%] justify-center mx-auto"
          style={{ color: '#241C15' }} // change this!
        >
          {heading}
        </motion.h2>


        {/* Decorative line */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "250px" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="h-1 mx-auto mb-8 rounded-full"
          style={{ backgroundColor: '#f7af00' }}
        />

        {/* Subheading */}
        {subheading && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl md:text-2xl text-center max-w-4xl mx-auto mb-16"
            style={{ color: '#fbf5e5', opacity: 0.9 }}
          >
            {subheading}
          </motion.p>
        )}

        {/* Integration Items Grid */}
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6 max-w-full mx-auto">
          {items?.map((item: any, index: number) => {
            const IconComponent = getIntegrationIcon(item.title, index)

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                  ease: "easeOut"
                }}
                whileHover={{ scale: 1.03, y: -8 }}
                className="rounded-xl p-8 shadow-xl transition-all duration-300 group relative overflow-hidden"
                style={{
                  backgroundColor: '#f0eadd',
                }}
              >

                {/* Content */}
                <div className="relative z-10">
                  {/* Header with icon and number */}
                  <div className="flex items-start mb-6">
                    {/* Icon */}
                    <div
                      className="flex-shrink-0 p-3 rounded-xl mr-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                      style={{ backgroundColor: '#f7af00' }}
                    >
                      <IconComponent className="h-5 w-5" style={{ color: '#241C15' }} />
                    </div>

                    {/* Title and number */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h3 className="text-xl md:text-2xl font-bold leading-tight pr-2" style={{ color: '#050504' }}>
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p
                    className="text-base md:text-lg leading-relaxed"
                    style={{ color: '#31302f', opacity: 0.85 }}
                  >
                    {item.description}
                  </p>

                  {/* Bottom accent */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.15 + 0.4 }}
                    className="h-1 mt-6 rounded-full"
                    style={{
                      backgroundColor: '#f7af00',
                      transformOrigin: 'left'
                    }}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}