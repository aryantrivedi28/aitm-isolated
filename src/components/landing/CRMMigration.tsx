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
    <section className="relative py-24 overflow-hidden" style={{ backgroundColor: '#fbf5e5' }}>
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-medium text-center mb-4 md:mb-6 leading-tight w-[70%] justify-center mx-auto"
          style={{ color: '#050504' }} // change this!
        >
          {heading}
        </motion.h2>

        {/* Decorative line */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "150px" }}
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
            style={{ color: '#31302f'}}
          >
            {subheading}
          </motion.p>
        )}

        {/* Migration Items Grid */}
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
          {items?.map((item: any, index: number) => {
            const IconComponent = getMigrationIcon(item.title, index)

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40, scale: 0.50 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="rounded-xl p-8 shadow-lg transition-all duration-300 group relative overflow-hidden"
                style={{
                  backgroundColor: '#f0eadd',
                }}
              >
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="mb-6">
                    <div
                      className="inline-flex p-3 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                      style={{ backgroundColor: '#f7af00' }}
                    >
                      <IconComponent className="h-5 w-5" style={{ color: '#050504' }} />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl md:text-2xl font-medium mb-4 leading-tight" style={{ color: '#050504' }}>
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-base leading-relaxed mb-4"
                    style={{ color: '#050504', opacity: 0.8 }}
                  >
                    {item.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}