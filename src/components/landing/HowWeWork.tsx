"use client"

import { ArrowRight, Play, Sparkles, CheckCircle2, Video } from "lucide-react"
import { useState, useEffect } from "react"

export default function HowWeWorkSection({
  title,
  description,
  videoUrl,
  cta,
}: {
  title?: string
  description?: string
  videoUrl?: string
  cta?: { label: string; href: string }
}) {
  const [isVisible, setIsVisible] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  if (!title && !videoUrl) return null

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

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        .animate-slideInLeft { animation: slideInLeft 0.8s ease-out; }
        .animate-slideInRight { animation: slideInRight 0.8s ease-out; }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse 2s ease-in-out infinite; }
      `}</style>

      <section className="how-we-work relative bg-[#fbf5e5] py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#FFE01B]/6 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FCD34D]/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>

        {/* Container with proper spacing */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-10 lg:gap-16">
            
            {/* Left Video */}
            <div className={`w-full md:w-1/2 ${isVisible ? 'animate-slideInLeft' : 'opacity-0'}`}>
              <div className="relative">
                {/* Video Container */}
                <div className="relative p-3 sm:p-4 rounded-2xl border-[1px] border-[#241C15]/10">
                  {videoUrl ? (
                    <div className="relative group">
                      <video
                        src={videoUrl}
                        controls
                        className="w-full rounded-xl"
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                      />
                      {!isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl group-hover:bg-black/30 transition-all">
                          <div className="p-5 sm:p-6 bg-gradient-to-r from-[#FFE01B] to-[#FCD34D] rounded-full shadow-2xl group-hover:scale-110 transition-transform">
                            <Play className="w-8 h-8 sm:w-10 sm:h-10 text-[#241C15] fill-current" />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full aspect-video bg-gradient-to-br from-[#fbf5e5] to-white flex flex-col items-center justify-center text-[#241C15]/50 rounded-xl border-2 border-dashed border-[#241C15]/20">
                      <Video className="w-12 h-12 sm:w-16 sm:h-16 mb-3 text-[#241C15]/30" />
                      <p className="text-sm sm:text-base font-semibold">Video not available</p>
                    </div>
                  )}
                </div>

                {/* Decorative Elements */}
                <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-br from-[#FFE01B] to-[#FCD34D] rounded-2xl opacity-20 blur-xl" />
                <div className="absolute -top-4 -left-4">
                  <div className="p-3 bg-gradient-to-br from-[#FFE01B] to-[#FCD34D] rounded-xl shadow-lg animate-float">
                    <Sparkles className="w-5 h-5 text-[#241C15]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className={`w-full md:w-1/2 space-y-6 ${isVisible ? 'animate-slideInRight' : 'opacity-0'}`}>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-[#241C15] px-4 py-2 rounded-full shadow-md">
                <Sparkles className="w-4 h-4 text-[#FFE01B] animate-pulse-slow" />
                <span className="text-sm font-semibold text-[#fbf5e5]">How It Works</span>
              </div>

              {/* Title */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-[#241C15]">
                {title || "How We Work"}
                <div className="h-1 w-24 bg-gradient-to-r from-[#FFE01B] to-[#FCD34D] rounded-full mt-4" />
              </h2>

              {/* Description */}
              {description && (
                <p className="text-base sm:text-lg lg:text-xl text-[#241C15]/75 leading-relaxed font-medium">
                  {description}
                </p>
              )}


              {/* CTA Button */}
              {cta && (
                <div className={`pt-2 ${isVisible ? 'animate-fadeIn' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href={cta.href}
                      className="group inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#FFE01B] to-[#FCD34D] text-[#241C15] rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm sm:text-base"
                    >
                      {cta.label}
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
                    </a>
                    <button className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white border-2 border-[#241C15]/20 text-[#241C15] rounded-xl font-semibold hover:border-[#FFE01B] hover:bg-[#fbf5e5] transition-all duration-300 text-sm sm:text-base">
                      <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                      Watch Demo
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}