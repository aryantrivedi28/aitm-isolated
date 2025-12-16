"use client"
import { motion } from "framer-motion"
import {
  Zap,
  Users,
  MessageSquare,
  BarChart3,
  Calendar,
  Mail,
  Phone,
  Target,
  Briefcase,
  Globe,
  ShoppingCart,
  Settings,
  TrendingUp,
  Check,
  Star,
  Rocket,
  GoalIcon
} from "lucide-react"

// Icon mapping - you can customize this based on your service titles
const getServiceIcon = (title: string, index: number) => {
  const titleLower = title?.toLowerCase() || ""

  if (titleLower.includes("automation") || titleLower.includes("workflow")) return Zap
  if (titleLower.includes("crm") || titleLower.includes("customer")) return Users
  if (titleLower.includes("message") || titleLower.includes("sms") || titleLower.includes("chat")) return MessageSquare
  if (titleLower.includes("analytics") || titleLower.includes("report")) return BarChart3
  if (titleLower.includes("calendar") || titleLower.includes("schedule") || titleLower.includes("appointment")) return Calendar
  if (titleLower.includes("email") || titleLower.includes("mail")) return Mail
  if (titleLower.includes("phone") || titleLower.includes("call")) return Phone
  if (titleLower.includes("marketing") || titleLower.includes("campaign")) return Target
  if (titleLower.includes("business") || titleLower.includes("sales")) return Briefcase
  if (titleLower.includes("website") || titleLower.includes("web")) return Globe
  if (titleLower.includes("ecommerce") || titleLower.includes("shop")) return ShoppingCart
  if (titleLower.includes("integration") || titleLower.includes("setting")) return Settings
  if (titleLower.includes("growth") || titleLower.includes("scale")) return TrendingUp
  if (titleLower.includes("quality") || titleLower.includes("premium")) return Star
  if (titleLower.includes("launch") || titleLower.includes("start")) return Rocket

  // Default icons rotation if no match
  const defaultIcons = [Briefcase, Target, TrendingUp, Users, Zap, Star]
  return defaultIcons[index % defaultIcons.length]
}

export default function GHLServices({ heading, subheading, services }: any) {
  return (
    <section className="py-20" style={{ backgroundColor: '#fbf5e5' }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header with Animation */}
        <div className="text-center mb-16 space-y-4 animate-fade-in">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl md:text-5xl lg:text-5xl font-medium text-center mb-4 md:mb-6 leading-tight w-[70%] justify-center mx-auto"
            style={{ color: '#050504' }} // change this!
          >
            {heading}
          </motion.h2>
          {subheading && (
            <p className="text-lg md:text-xl max-w-3xl mx-auto animate-fade-in-delayed" style={{ color: '#31302f', opacity: 0.7 }}>
              {subheading}
            </p>
          )}
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
          {services?.map((service: any, index: number) => {
            const IconComponent = getServiceIcon(service.title, index)
            return (
              <div
                key={index}
                className="bg-[#f0eadd] rounded-xl p-8 hover:shadow-xl transition-all duration-300 group hover:scale-105 animate-fade-in-up"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                {/* Icon */}
                <div className="mb-6">
                  <div
                    className="inline-flex p-4 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                    style={{ backgroundColor: '#f7af00' }}
                  >
                    <IconComponent className="h-8 w-8" style={{ color: '#241C15' }} />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-xl font-bold transition-colors duration-200" style={{ color: '#241C15' }}>
                    {service.title}
                  </h3>
                  <p className="text-base leading-relaxed" style={{ color: '#241C15', opacity: 0.7 }}>
                    {service.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .animate-fade-in-delayed {
          animation: fadeIn 0.8s ease-out 0.3s forwards;
          opacity: 0;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
          animation-fill-mode: forwards;
        }
      `}</style>
    </section>
  )
}