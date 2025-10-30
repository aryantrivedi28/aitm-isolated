"use client"

import { ArrowRight, Sparkles, CheckCircle, TrendingUp } from "lucide-react"
import { useState, useEffect } from "react"

export default function AboutSection({
  title,
  description,
  image,
  cta,
}: {
  title?: string
  description?: string
  image?: { asset?: { url?: string } }
  cta?: { label: string; href: string }
}) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  if (!title && !description) return null

  return (
    <>
      <style jsx global>{`
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        .animate-slideInLeft { animation: slideInLeft 0.8s ease-out; }
        .animate-slideInRight { animation: slideInRight 0.8s ease-out; }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
        .animate-float { animation: float 3s ease-in-out infinite; }
      `}</style>

      <section className="about-section relative flex flex-col md:flex-row items-center justify-between w-full max-w-[1600px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-16 sm:py-20 md:py-24 bg-[#fbf5e5] overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-64 h-64 bg-[#FFE01B]/8 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#FCD34D]/6 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FFE01B]/4 rounded-full blur-3xl" />
        </div>

        {/* Left Content */}
        <div className={`relative z-10 w-full md:w-1/2 md:pr-8 lg:pr-12 mb-10 md:mb-0 ${isVisible ? 'animate-slideInLeft' : 'opacity-0'}`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#241C15] px-4 py-2 rounded-full mb-6 shadow-md">
            <Sparkles className="w-4 h-4 text-[#FFE01B]" />
            <span className="text-sm font-semibold text-[#fbf5e5]">About Us</span>
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight text-[#241C15]">
            {title || "About Us"}
            <div className="h-1 w-24 bg-gradient-to-r from-[#FFE01B] to-[#FCD34D] rounded-full mt-4" />
          </h2>

          {/* Description */}
          <p className="text-base sm:text-lg lg:text-xl text-[#241C15]/75 leading-relaxed mb-8 font-medium">
            {description}
          </p>

          {/* CTA Button */}
          {cta && (
            <div className={`flex flex-col sm:flex-row gap-4 ${isVisible ? 'animate-fadeIn' : 'opacity-0'}`} style={{ animationDelay: '0.5s' }}>
              <a
                href={cta.href}
                className="group inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#FFE01B] to-[#FCD34D] text-[#241C15] rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm sm:text-base"
              >
                {cta.label}
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          )}
        </div>

        {/* Right Image */}
        {image?.asset?.url && (
          <div className={`relative z-10 w-full md:w-1/2 ${isVisible ? 'animate-slideInRight' : 'opacity-0'}`}>
            <div className="relative">
              {/* Image Container */}
              <div className="relative bg-white p-3 sm:p-4 rounded-2xl border-[1px] border-[#241C15]/10">
                <img
                  src={image.asset.url}
                  alt={title || "About us"}
                  className="w-full h-auto rounded-xl object-cover"
                />
                
                {/* Overlay Badge */}
                <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-gradient-to-r from-[#FFE01B] to-[#FCD34D] p-2 sm:p-4 rounded-2xl shadow-xl border-4 border-white">
                  <div className="flex items-center gap-3">
                    <div className="p-2 sm:p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-[#241C15]" />
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl md:text-3xl font-black text-[#241C15]">98%</div>
                      <div className="text-xs sm:text-sm font-bold text-[#241C15]/80">Client Satisfaction</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Dots */}
              <div className="absolute -top-4 -left-4 w-18 h-18 grid grid-cols-4 gap-2 opacity-30">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-[#FFE01B] rounded-full" />
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  )
}