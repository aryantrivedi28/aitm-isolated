"use client"

import { Sparkles, Zap, Target, Rocket, TrendingUp, Award } from "lucide-react"
import { useState, useEffect } from "react"

export default function WhatWeDoSection({
  heading,
  description,
}: {
  heading?: string
  description?: string
}) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  if (!heading && !description)
    return <p className="text-center text-red-500">No content found</p>

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        .what-we-do * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(0.98); }
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out; }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse 2s ease-in-out infinite; }
        .animate-rotate-slow { animation: rotate 20s linear infinite; }
      `}</style>

      <section className="what-we-do relative py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-[#fbf5e5] overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-80 h-80 bg-[#FFE01B]/8 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#FCD34D]/6 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FFE01B]/4 rounded-full blur-3xl" />
        </div>

        {/* Decorative Floating Icons */}
        <div className="absolute top-10 left-10 animate-float">
          <div className="p-3 bg-gradient-to-br from-[#FFE01B] to-[#FCD34D] rounded-xl shadow-lg opacity-20">
            <Zap className="w-6 h-6 text-[#241C15]" />
          </div>
        </div>
        <div className="absolute top-20 right-20 animate-float" style={{ animationDelay: '0.5s' }}>
          <div className="p-3 bg-gradient-to-br from-[#FCD34D] to-[#FFE01B] rounded-xl shadow-lg opacity-20">
            <Rocket className="w-6 h-6 text-[#241C15]" />
          </div>
        </div>
        <div className="absolute bottom-20 left-1/4 animate-float" style={{ animationDelay: '1s' }}>
          <div className="p-3 bg-gradient-to-br from-[#FFE01B] to-[#FCD34D] rounded-xl shadow-lg opacity-20">
            <Target className="w-6 h-6 text-[#241C15]" />
          </div>
        </div>

        {/* Main Content Container */}
        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Badge */}
          <div className={`flex justify-center mb-8 ${isVisible ? 'animate-fadeIn' : 'opacity-0'}`}>
            <div className="inline-flex items-center gap-2 bg-[#241C15] px-4 py-2 rounded-full shadow-lg">
              <Sparkles className="w-4 h-4 text-[#FFE01B] animate-pulse-slow" />
              <span className="text-sm font-semibold text-[#fbf5e5]">What We Do</span>
            </div>
          </div>

          {/* Heading */}
          <div className={`text-center mb-8 sm:mb-10 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight text-[#241C15]">
              {heading || "What We Do"}
            </h2>
            
            {/* Decorative underline */}
            <div className="flex justify-center">
              <div className="h-1.5 w-24 bg-gradient-to-r from-[#FFE01B] to-[#FCD34D] rounded-full" />
            </div>
          </div>

          {/* Description */}
          {description && (
            <div className={`${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
              <p className="max-w-3xl mx-auto text-center text-[#241C15]/75 text-base sm:text-lg lg:text-xl leading-relaxed font-medium px-4">
                {description}
              </p>
            </div>
          )}

          {/* Feature Icons Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 mt-12 sm:mt-16">
            {[
              { icon: Zap, label: "Fast Delivery", color: "from-[#FFE01B] to-[#FCD34D]" },
              { icon: Target, label: "Precision", color: "from-[#FCD34D] to-[#FFE01B]" },
              { icon: Rocket, label: "Innovation", color: "from-[#FFE01B] to-[#FCD34D]" },
              { icon: Award, label: "Excellence", color: "from-[#FCD34D] to-[#FFE01B]" },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`group ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}
                style={{ animationDelay: `${0.3 + idx * 0.1}s` }}
              >
                <div className="flex flex-col items-center text-center p-4 sm:p-6 bg-white rounded-2xl border-2 border-[#241C15]/10 hover:border-[#FFE01B]/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                  <div className={`p-3 sm:p-4 bg-gradient-to-br ${item.color} rounded-xl shadow-lg mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="w-6 h-6 sm:w-8 sm:h-8 text-[#241C15]" />
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-[#241C15] group-hover:text-[#FFE01B] transition-colors">
                    {item.label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats Section */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-12 sm:mt-16 ${isVisible ? 'animate-fadeIn' : 'opacity-0'}`} style={{ animationDelay: '0.7s' }}>
            {[
              { value: "500+", label: "Projects" },
              { value: "98%", label: "Success Rate" },
              { value: "50+", label: "Clients" },
              { value: "24/7", label: "Support" },
            ].map((stat, idx) => (
              <div key={idx} className="text-center p-4 sm:p-6 bg-white rounded-2xl border-2 border-[#241C15]/10 hover:border-[#FFE01B]/50 transition-all duration-300 hover:shadow-lg">
                <div className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-br from-[#FFE01B] to-[#FCD34D] bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-[#241C15]/70 font-semibold">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA Badge */}
          <div className={`flex justify-center mt-12 sm:mt-16 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '0.9s' }}>
            <div className="inline-flex items-center gap-6 bg-white px-6 py-4 rounded-2xl border-2 border-[#241C15]/10 shadow-lg">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-10 h-10 bg-gradient-to-br from-[#FFE01B] to-[#FCD34D] rounded-full border-3 border-white flex items-center justify-center text-xs font-bold text-[#241C15] shadow-md">
                    {i}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Circle Pattern */}
        <div className="absolute bottom-10 right-10 opacity-10">
          <div className="grid grid-cols-4 gap-2">
            {[...Array(16)].map((_, i) => (
              <div key={i} className="w-2 h-2 bg-[#FFE01B] rounded-full" />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}