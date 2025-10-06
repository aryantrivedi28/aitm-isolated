"use client"

import { User, GraduationCap, Briefcase, ArrowRight, Sparkles, Clock, DollarSign, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function DirectHiringPage() {
  const [hoveredOption, setHoveredOption] = useState(null)
  const router = useRouter()

  const handleNavigation = (path: string) => {
    router.push(path) // ✅ navigate to the given path
  }

  const hiringOptions = [
    {
      id: 'freelancer',
      icon: User,
      title: 'Freelancer',
      description: 'Hire for specific projects',
      features: ['Project-based', 'Flexible hours', 'Pay per project'],
      path: '/find-talent/direct-hiring/freelancer',
      gradient: 'from-[#FFE01B] to-[#FCD34D]'
    },
    {
      id: 'intern',
      icon: GraduationCap,
      title: 'Intern',
      description: 'Fresh talent for learning roles',
      features: ['Entry-level', '3-6 months', 'Skill development'],
      path: '/find-talent/direct-hiring/intern',
      gradient: 'from-[#FCD34D] to-[#FFE01B]'
    },
    {
      id: 'fulltime',
      icon: Briefcase,
      title: 'Full-time Hire',
      description: 'Permanent team members',
      features: ['Long-term', 'Full benefits', 'Team integration'],
      path: '/find-talent/direct-hiring/fulltime',
      gradient: 'from-[#FFE01B] to-[#FCD34D]'
    }
  ]

  return (
    <>
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(30px, -30px); }
          66% { transform: translate(-20px, 20px); }
        }

        @keyframes floatReverse {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(-30px, 30px); }
          66% { transform: translate(20px, -20px); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.6; }
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-float { animation: float 20s ease-in-out infinite; }
        .animate-floatReverse { animation: floatReverse 25s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse 3s ease-in-out infinite; }
        .animate-slideIn { animation: slideIn 0.6s ease-out forwards; }
      `}</style>

      <div className="direct-hiring flex flex-col items-center justify-center min-h-screen bg-[#fbf5e5] p-4 sm:p-6 relative overflow-hidden pt-[100px] sm:pt-[120px]">
        
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 right-10 w-64 h-64 bg-[#FFE01B]/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-[#FCD34D]/10 rounded-full blur-3xl animate-floatReverse" />
        </div>

        {/* Main Card */}
        <div className="p-6 sm:p-8 md:p-10 rounded-3xl w-full max-w-5xl text-center border-2 border-[#241C15]/10 relative overflow-hidden animate-slideIn">
          
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#FFE01B]/20 to-transparent rounded-bl-full" />
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#241C15] px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-[#FFE01B]" />
            <span className="text-sm font-semibold text-[#fbf5e5]">Direct Hiring</span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#241C15] mb-3 leading-tight">
            Choose Your
            <span className="block bg-gradient-to-r from-[#FFE01B] to-[#FCD34D] bg-clip-text text-transparent mt-1">
              Hiring Type
            </span>
          </h1>
          <p className="text-[#241C15]/70 mb-8 sm:mb-10 text-sm sm:text-base md:text-lg font-medium max-w-md mx-auto">
            Select the type of talent that fits your needs
          </p>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {hiringOptions.map((option, idx) => {
              const Icon = option.icon
              return (
                <button
                  key={option.id}
                  onClick={() => handleNavigation(option.path)}
                  onMouseLeave={() => setHoveredOption(null)}
                  className="group relative flex flex-col items-center text-center bg-white border-2 border-[#241C15]/10 hover:border-[#FFE01B] p-5 sm:p-6 rounded-2xl transition-all duration-300 hover:scale-[1.03] hover:shadow-xl"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  {/* Gradient Background on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
                  
                  {/* Icon */}
                  <div className={`relative w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${option.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-[#241C15]" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-black text-[#241C15] mb-2">
                    {option.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-[#241C15]/70 font-medium mb-4">
                    {option.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-1.5 mb-4 w-full">
                    {option.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-left">
                        <div className="w-1 h-1 bg-[#FFE01B] rounded-full flex-shrink-0" />
                        <span className="text-xs text-[#241C15]/70">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Arrow */}
                  <div className="mt-auto">
                    <ArrowRight className={`w-5 h-5 text-[#FFE01B] transition-transform duration-300 ${hoveredOption === option.id ? 'translate-x-1' : ''}`} />
                  </div>
                </button>
              )
            })}
          </div>

          {/* Info Section */}
          <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-[#241C15]/10">
            <p className="text-[#241C15]/60 text-xs sm:text-sm font-medium mb-4">All options include:</p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#FFE01B]/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-[#241C15]" />
                </div>
                <span className="text-xs sm:text-sm text-[#241C15]/80 font-medium">Quick matching</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#FFE01B]/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-[#241C15]" />
                </div>
                <span className="text-xs sm:text-sm text-[#241C15]/80 font-medium">Transparent pricing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#FFE01B]/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-[#241C15]" />
                </div>
                <span className="text-xs sm:text-sm text-[#241C15]/80 font-medium">Flexible terms</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-10 left-10 w-4 h-4 bg-[#FFE01B] rounded-full animate-pulse-slow" />
        <div className="absolute top-20 right-20 w-3 h-3 bg-[#FCD34D] rounded-full animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>
    </>
  )
}