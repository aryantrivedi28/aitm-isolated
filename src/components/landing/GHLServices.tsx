"use client"

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
  Rocket
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
          <h2 className="text-4xl md:text-5xl font-bold" style={{ color: '#241C15' }}>
            {heading}
          </h2>
          {subheading && (
            <p className="text-lg md:text-xl max-w-3xl mx-auto animate-fade-in-delayed" style={{ color: '#241C15', opacity: 0.7 }}>
              {subheading}
            </p>
          )}
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services?.map((service: any, index: number) => {
            const IconComponent = getServiceIcon(service.title, index)
            
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-8 border-2 shadow-sm hover:shadow-xl transition-all duration-300 group hover:scale-105 animate-fade-in-up"
                style={{ 
                  borderColor: '#FFE01B',
                  animationDelay: `${index * 100}ms`
                }}
              >
                {/* Icon */}
                <div className="mb-6">
                  <div 
                    className="inline-flex p-4 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                    style={{ backgroundColor: '#FFE01B' }}
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

                {/* Decorative Element */}
                <div className="mt-6 pt-4 border-t transition-colors duration-300" style={{ borderTopColor: '#fbf5e5' }}>
                  <div className="flex items-center space-x-2 text-sm font-semibold group-hover:translate-x-2 transition-transform duration-300" style={{ color: '#241C15', opacity: 0.5 }}>
                    <Check className="h-4 w-4" />
                    <span>Available Now</span>
                  </div>
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