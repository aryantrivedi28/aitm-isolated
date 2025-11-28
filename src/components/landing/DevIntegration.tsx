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
  Puzzle
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
    <section className="relative py-24 overflow-hidden" style={{ backgroundColor: '#241C15' }}>
      {/* Background decorative elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.05, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute -left-40 top-20 w-[500px] h-[500px] rounded-full blur-3xl"
        style={{ backgroundColor: '#FFE01B' }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.04, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
        className="absolute -right-40 bottom-20 w-[550px] h-[550px] rounded-full blur-3xl"
        style={{ backgroundColor: '#FFE01B' }}
      />

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(#FFE01B 1px, transparent 1px), linear-gradient(90deg, #FFE01B 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Floating code symbols */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-32 right-[10%] hidden lg:block"
      >
        <Code2 className="h-12 w-12" style={{ color: '#FFE01B' }} />
      </motion.div>
      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, 10, 0],
          opacity: [0.08, 0.15, 0.08]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-40 left-[8%] hidden lg:block"
      >
        <Terminal className="h-10 w-10" style={{ color: '#FFE01B' }} />
      </motion.div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Icon badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: 180 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, type: "spring", stiffness: 150 }}
          className="flex justify-center mb-8"
        >
          <div 
            className="inline-flex p-4 rounded-full border-4 shadow-2xl"
            style={{ 
              backgroundColor: '#FFE01B',
              borderColor: '#FFE01B'
            }}
          >
            <Cpu className="h-10 w-10" style={{ color: '#241C15' }} />
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
          <h2 className="text-4xl md:text-6xl font-bold leading-tight" style={{ color: '#FFE01B' }}>
            {heading}
          </h2>
        </motion.div>

        {/* Decorative line */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "180px" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="h-1 mx-auto mb-8 rounded-full"
          style={{ backgroundColor: '#FFE01B' }}
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
        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
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
                className="rounded-xl p-8 border-2 shadow-xl hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
                style={{ 
                  backgroundColor: 'rgba(251, 245, 229, 0.05)',
                  borderColor: '#FFE01B'
                }}
              >
                {/* Hover gradient overlay */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(135deg, rgba(255, 224, 27, 0.1) 0%, transparent 100%)`
                  }}
                />

                {/* Content */}
                <div className="relative z-10">
                  {/* Header with icon and number */}
                  <div className="flex items-start mb-6">
                    {/* Icon */}
                    <div 
                      className="flex-shrink-0 p-3 rounded-xl mr-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                      style={{ backgroundColor: '#FFE01B' }}
                    >
                      <IconComponent className="h-7 w-7" style={{ color: '#241C15' }} />
                    </div>

                    {/* Title and number */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h3 className="text-xl md:text-2xl font-bold leading-tight pr-2" style={{ color: '#FFE01B' }}>
                          {item.title}
                        </h3>
                        {/* Number badge */}
                        <div 
                          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                          style={{ 
                            backgroundColor: '#FFE01B',
                            color: '#241C15'
                          }}
                        >
                          {index + 1}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p 
                    className="text-base md:text-lg leading-relaxed"
                    style={{ color: '#fbf5e5', opacity: 0.85 }}
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
                      backgroundColor: '#FFE01B',
                      transformOrigin: 'left'
                    }}
                  />
                </div>

                {/* Corner decoration */}
                <div 
                  className="absolute top-0 right-0 w-20 h-20 opacity-10 group-hover:opacity-20 transition-opacity"
                  style={{
                    background: `radial-gradient(circle at top right, #FFE01B 0%, transparent 70%)`
                  }}
                />
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div 
            className="inline-flex items-center space-x-3 px-10 py-5 rounded-full border-2 shadow-2xl backdrop-blur-sm"
            style={{ 
              backgroundColor: 'rgba(255, 224, 27, 0.1)',
              borderColor: '#FFE01B'
            }}
          >
            <Zap className="h-6 w-6" style={{ color: '#FFE01B' }} />
            <span className="font-bold text-xl" style={{ color: '#FFE01B' }}>
              Seamless Integration Guaranteed
            </span>
            <Zap className="h-6 w-6" style={{ color: '#FFE01B' }} />
          </div>
        </motion.div>
      </div>

      {/* Animated particles */}
      <motion.div
        animate={{
          y: [0, -25, 0],
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 left-[15%] w-2 h-2 rounded-full hidden lg:block"
        style={{ backgroundColor: '#FFE01B' }}
      />
      <motion.div
        animate={{
          y: [0, 25, 0],
          x: [0, 10, 0],
          opacity: [0.15, 0.35, 0.15]
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5
        }}
        className="absolute bottom-1/3 right-[12%] w-3 h-3 rounded-full hidden lg:block"
        style={{ backgroundColor: '#FFE01B' }}
      />
    </section>
  )
}