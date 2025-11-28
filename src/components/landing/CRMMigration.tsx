"use client"
import { motion } from "framer-motion"
import { 
  ArrowRightLeft, 
  Database, 
  Shield, 
  Zap,
  CheckCircle,
  Upload,
  Download,
  RefreshCw,
  Lock,
  Users,
  FileCheck,
  Clock,
  Settings,
  TrendingUp,
  Package
} from "lucide-react"

interface CRMMigrationProps {
  heading: string
  subheading?: string
  items: Array<{ title: string; description: string }>
}

// Icon mapping for CRM/Migration topics
const getMigrationIcon = (title: string, index: number) => {
  const titleLower = title?.toLowerCase() || ""
  
  if (titleLower.includes("migrate") || titleLower.includes("transfer")) return ArrowRightLeft
  if (titleLower.includes("data") || titleLower.includes("database")) return Database
  if (titleLower.includes("security") || titleLower.includes("secure") || titleLower.includes("protect")) return Shield
  if (titleLower.includes("speed") || titleLower.includes("fast") || titleLower.includes("quick")) return Zap
  if (titleLower.includes("verify") || titleLower.includes("validate") || titleLower.includes("check")) return FileCheck
  if (titleLower.includes("upload") || titleLower.includes("import")) return Upload
  if (titleLower.includes("download") || titleLower.includes("export")) return Download
  if (titleLower.includes("sync") || titleLower.includes("refresh")) return RefreshCw
  if (titleLower.includes("lock") || titleLower.includes("encrypt")) return Lock
  if (titleLower.includes("user") || titleLower.includes("contact") || titleLower.includes("customer")) return Users
  if (titleLower.includes("time") || titleLower.includes("schedule")) return Clock
  if (titleLower.includes("config") || titleLower.includes("setup") || titleLower.includes("setting")) return Settings
  if (titleLower.includes("optimize") || titleLower.includes("improve") || titleLower.includes("enhance")) return TrendingUp
  if (titleLower.includes("package") || titleLower.includes("bundle")) return Package
  
  // Default rotation
  const defaultIcons = [Database, ArrowRightLeft, Shield, Zap, Users, FileCheck, RefreshCw]
  return defaultIcons[index % defaultIcons.length]
}

export default function CRMMigration({ heading, subheading, items }: CRMMigrationProps) {
  return (
    <section className="relative py-24 overflow-hidden" style={{ backgroundColor: 'white' }}>
      {/* Background decorative elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.06, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute -left-40 top-0 w-[500px] h-[500px] rounded-full blur-3xl"
        style={{ backgroundColor: '#FFE01B' }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.05, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
        className="absolute -right-40 bottom-0 w-[550px] h-[550px] rounded-full blur-3xl"
        style={{ backgroundColor: '#FFE01B' }}
      />

      {/* Floating icons */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
          opacity: [0.15, 0.25, 0.15]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-32 right-[12%] hidden lg:block"
      >
        <Database className="h-12 w-12" style={{ color: '#FFE01B' }} />
      </motion.div>
      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -5, 0],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-40 left-[10%] hidden lg:block"
      >
        <ArrowRightLeft className="h-10 w-10" style={{ color: '#FFE01B' }} />
      </motion.div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Icon badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -90 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, type: "spring", stiffness: 180 }}
          className="flex justify-center mb-8"
        >
          <div 
            className="inline-flex p-4 rounded-full border-4 shadow-xl"
            style={{ 
              backgroundColor: '#FFE01B',
              borderColor: '#241C15'
            }}
          >
            <ArrowRightLeft className="h-10 w-10" style={{ color: '#241C15' }} />
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
          whileInView={{ width: "150px" }}
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
            style={{ color: '#241C15', opacity: 0.8 }}
          >
            {subheading}
          </motion.p>
        )}

        {/* Migration Items Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items?.map((item: any, index: number) => {
            const IconComponent = getMigrationIcon(item.title, index)
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="rounded-xl p-8 border-2 shadow-lg hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
                style={{ 
                  backgroundColor: '#fbf5e5',
                  borderColor: '#FFE01B'
                }}
              >
                {/* Gradient overlay on hover */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(135deg, rgba(255, 224, 27, 0.15) 0%, transparent 100%)`
                  }}
                />

                {/* Content */}
                <div className="relative z-10">
                  {/* Number badge - positioned absolutely */}
                  <div 
                    className="absolute -top-4 -right-4 w-10 h-10 rounded-full flex items-center justify-center text-base font-bold shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
                    style={{ 
                      backgroundColor: '#241C15',
                      color: '#FFE01B'
                    }}
                  >
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className="mb-6">
                    <div 
                      className="inline-flex p-4 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                      style={{ backgroundColor: '#FFE01B' }}
                    >
                      <IconComponent className="h-8 w-8" style={{ color: '#241C15' }} />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl md:text-2xl font-bold mb-4 leading-tight" style={{ color: '#241C15' }}>
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p 
                    className="text-base leading-relaxed mb-4"
                    style={{ color: '#241C15', opacity: 0.8 }}
                  >
                    {item.description}
                  </p>

                  {/* Checkmark indicator */}
                  <div className="flex items-center space-x-2 pt-4 border-t opacity-60 group-hover:opacity-100 transition-opacity" style={{ borderTopColor: '#FFE01B' }}>
                    <CheckCircle className="h-4 w-4" style={{ color: '#FFE01B' }} />
                    <span className="text-xs font-semibold" style={{ color: '#241C15' }}>Included</span>
                  </div>

                  {/* Accent bar */}
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
                </div>

                {/* Corner glow */}
                <div 
                  className="absolute bottom-0 left-0 w-24 h-24 opacity-20 group-hover:opacity-40 transition-opacity"
                  style={{
                    background: `radial-gradient(circle at bottom left, #FFE01B 0%, transparent 70%)`
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
            className="inline-flex items-center space-x-3 px-10 py-5 rounded-full border-2 shadow-xl"
            style={{ 
              backgroundColor: 'white',
              borderColor: '#FFE01B'
            }}
          >
            <Shield className="h-6 w-6" style={{ color: '#FFE01B' }} />
            <span className="font-bold text-xl" style={{ color: '#241C15' }}>
              Secure & Seamless Migration
            </span>
            <Shield className="h-6 w-6" style={{ color: '#FFE01B' }} />
          </div>
        </motion.div>
      </div>

      {/* Animated particles */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/3 left-[8%] w-3 h-3 rounded-full hidden lg:block"
        style={{ backgroundColor: '#FFE01B' }}
      />
      <motion.div
        animate={{
          y: [0, 30, 0],
          x: [0, -15, 0],
          opacity: [0.25, 0.45, 0.25]
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-1/4 right-[10%] w-4 h-4 rounded-full hidden lg:block"
        style={{ backgroundColor: '#FFE01B' }}
      />
      <motion.div
        animate={{
          y: [0, -20, 0],
          opacity: [0.15, 0.35, 0.15]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute top-2/3 right-[15%] w-2 h-2 rounded-full hidden lg:block"
        style={{ backgroundColor: '#FFE01B' }}
      />
    </section>
  )
}