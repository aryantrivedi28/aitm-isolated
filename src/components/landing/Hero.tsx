'use client'

import { ArrowRight, Zap, Sparkles, Star, ChevronRight, Play, Shield, Rocket, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { urlFor } from "@/src/sanity/lib/image"

interface CTA {
  label: string
  href: string
  variant?: string
}

interface Screenshot {
  image: any
  caption?: string
}

interface BlogButton {
  label: string
  href: string
}

interface HeroProps {
  title: string
  subtitle?: string
  backgroundImage?: any
  ctas?: CTA[]
  screenshots?: Screenshot[]
  blogButton?: BlogButton
}

export default function Hero({
  title,
  subtitle,
  ctas = [],
  screenshots = [],
  blogButton,
}: HeroProps) {
  const [particles, setParticles] = useState<{ left: string; top: string; duration: number; delay: number; size: number; type: string }[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    setIsVisible(true)

    // Enhanced particles with different types
    setParticles(
      Array.from({ length: isMobile ? 15 : 25 }).map((_, i) => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: 3 + Math.random() * 5,
        delay: Math.random() * 3,
        size: 2 + Math.random() * 4,
        type: i % 4 === 0 ? 'circle' : i % 4 === 1 ? 'pulse' : i % 4 === 2 ? 'star' : 'sparkle'
      }))
    )

    return () => window.removeEventListener('resize', checkMobile)
  }, [isMobile])

  return (
    <>
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(2deg); }
          66% { transform: translateY(-5px) rotate(-2deg); }
        }

        @keyframes floatParticle {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.3; }
          50% { transform: translateY(-20px) scale(1.1); opacity: 0.8; }
        }

        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 224, 27, 0.3); }
          50% { box-shadow: 0 0 40px rgba(255, 224, 27, 0.6), 0 0 60px rgba(255, 224, 27, 0.2); }
        }

        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes typewriter {
          from { width: 0; }
          to { width: 100%; }
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-floatParticle { animation: floatParticle 4s ease-in-out infinite; }
        .animate-pulseGlow { animation: pulseGlow 3s ease-in-out infinite; }
        .animate-slideInUp { animation: slideInUp 0.8s ease-out; }
        .animate-slideInLeft { animation: slideInLeft 0.8s ease-out; }
        .animate-slideInRight { animation: slideInRight 0.8s ease-out; }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
        .animate-typewriter { animation: typewriter 3.5s steps(40, end); }
        .animate-blink { animation: blink 1s infinite; }
      `}</style>

      <div className="hero-section relative bg-gradient-to-br from-white to-white overflow-hidden">

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex items-center">
          <div className="w-full max-w-[1500px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-16 sm:py-20 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 lg:gap-20 xl:gap-24 items-center">

              {/* Left Column - Enhanced Text Content */}
              <div className={`space-y-8 ${isVisible ? 'animate-slideInLeft' : ''}`}>

                {/* Badge/Status */}
                <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md border border-[#FFE01B]/20 rounded-full px-4 py-2 shadow-lg animate-fadeIn">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-[#241C15]/80">Trusted by 500+ Businesses</span>
                </div>

                {/* Title with enhanced gradient and effects */}
                <div className="space-y-4">
                  <h1 className="font-black leading-[1.05] tracking-tight bg-gradient-to-br from-[#241C15] via-[#241C15] to-[#241C15]/70 bg-clip-text text-transparent relative"
                    style={{
                      fontSize: 'clamp(2rem, 5vw, 4rem)',
                      letterSpacing: '-0.03em',
                      fontWeight: '900',
                    }}
                  >
                    {title}
                    {/* Animated underline */}
                    <div className="absolute -bottom-2 left-0 w-24 h-1 bg-gradient-to-r from-[#FFE01B] to-[#FFD700] rounded-full animate-pulseGlow"></div>
                  </h1>
                </div>

                {/* Subtitle with enhanced styling */}
                {subtitle && (
                  <div className="space-y-4">
                    <p className="text-[#241C15]/75 leading-relaxed font-medium text-lg md:text-xl max-w-2xl"
                      style={{
                        lineHeight: '1.75'
                      }}
                    >
                      {subtitle}
                    </p>
                  </div>
                )}

                {/* Feature Points */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
                  {['No Setup Fees', '24/7 Support', '30-Day Guarantee', 'Easy Migration'].map((feature, index) => (
                    <div key={feature} className="flex items-center gap-2 text-[#241C15]/70 group animate-fadeIn" style={{animationDelay: `${index * 0.1}s`}}>
                      <div className="w-5 h-5 bg-[#FFE01B] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <div className="w-1.5 h-1.5 bg-[#241C15] rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Enhanced CTA Buttons */}
                {ctas?.length > 0 && (
                  <div className="flex flex-col sm:flex-row items-start gap-4 pt-4">
                    {ctas.map((cta, index) => {
                      const isSecondary = cta.variant === "secondary";
                      return (
                        <a
                          key={cta.href}
                          href={cta.href}
                          className={`group relative inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold transition-all duration-300 overflow-hidden ${
                            isSecondary
                              ? "border-2 border-[#241C15]/20 text-[#241C15]/80 hover:text-[#241C15] hover:border-[#241C15]/40 hover:bg-[#241C15]/5 bg-white/60 backdrop-blur-sm shadow-lg hover:shadow-xl"
                              : "bg-gradient-to-r from-[#FFE01B] to-[#FFD700] text-[#241C15] hover:from-[#FFD700] hover:to-[#FFC800] shadow-2xl shadow-[#FFE01B]/40 hover:shadow-3xl hover:scale-[1.02] animate-pulseGlow"
                          } animate-fadeIn`}
                          style={{ 
                            fontSize: "clamp(1rem, 1.5vw, 1.125rem)",
                            animationDelay: `${index * 0.2}s`
                          }}
                        >
                          {/* Button glow effect */}
                          {!isSecondary && (
                            <div className="absolute inset-0 bg-gradient-to-r from-[#FFE01B] to-[#FFD700] opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300 -z-10"></div>
                          )}
                          
                          <span className="relative z-10">{cta.label}</span>
                          {!isSecondary ? (
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          ) : (
                            <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          )}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right Column - Enhanced Screenshots */}
              <div className={`relative ${isVisible ? 'animate-slideInRight' : ''}`}>
                
                {/* Main screenshot container with floating effect */}
                <div className="relative">
                  {/* Background glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FFE01B]/20 to-[#FFE01B]/10 rounded-3xl blur-xl transform scale-105 animate-float"></div>
                  
                  {/* Screenshots Grid */}
                  {screenshots?.length > 0 && (
                    <div className="relative space-y-6">
                      {screenshots.map((screenshot, index) => (
                        <div 
                          key={index} 
                          className="group relative w-full transform hover:scale-[1.02] transition-all duration-500"
                          style={{ animationDelay: `${index * 0.3}s` }}
                        >
                          {/* Card with enhanced styling */}
                          <div className="relative bg-white/80 backdrop-blur-md rounded-2xl overflow-hidden border-2 border-white/60 shadow-2xl hover:shadow-3xl transition-all duration-300">
                            {/* Card header */}
                            <div className="flex items-center gap-2 p-4 border-b border-white/30 bg-white/50">
                              <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                              </div>
                              <div className="flex-1 text-center">
                                <span className="text-xs font-medium text-[#241C15]/60">{screenshot.caption || `Preview ${index + 1}`}</span>
                              </div>
                            </div>
                            
                            {/* Image container */}
                            <div className="aspect-video relative overflow-hidden">
                              {screenshot.image && (
                                <img
                                  src={urlFor(screenshot.image).url()}
                                  alt={screenshot.caption || `Screenshot ${index + 1}`}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                              )}
                              
                              {/* Overlay gradient */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                          </div>

                          {/* Floating elements around cards */}
                          {index === 0 && (
                            <>
                              <div className="absolute -top-3 -right-3 w-6 h-6 bg-[#FFE01B] rounded-full flex items-center justify-center shadow-lg animate-float">
                                <Sparkles className="w-3 h-3 text-[#241C15]" />
                              </div>
                              <div className="absolute -bottom-2 -left-2 w-5 h-5 bg-green-400 rounded-full shadow-lg animate-float" style={{animationDelay: '1s'}}></div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Blog Button with enhanced positioning */}
                  {blogButton && (
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 z-20">
                      <a
                        href={blogButton.href}
                        className="group inline-flex items-center gap-3 bg-white/90 backdrop-blur-md text-[#241C15] px-6 py-3 rounded-full hover:bg-white transition-all duration-300 font-semibold shadow-2xl hover:shadow-3xl hover:scale-105 border border-white/50"
                      >
                        <div className="w-2 h-2 bg-[#FFE01B] rounded-full animate-pulse"></div>
                        <span>{blogButton.label}</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute right-20 top-32 text-[#FFE01B]/30 hidden lg:block animate-float" style={{ animationDelay: '1.5s' }}>
          <Zap className="w-9 h-9" />
        </div>

        <div className="absolute right-16 bottom-20 text-[#FFE01B]/40 hidden lg:block animate-float" style={{ animationDelay: '2.5s' }}>
          <Sparkles className="w-8 h-8" />
        </div>
        
        <div className="absolute left-20 bottom-28 text-[#FFE01B]/25 hidden lg:block animate-float" style={{ animationDelay: '3s' }}>
          <Rocket className="w-7 h-7" />
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden lg:block animate-bounce">
          <div className="w-6 h-10 border-2 border-[#241C15]/20 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-[#241C15]/40 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Additional global styles */}
      <style jsx global>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }

        .shadow-3xl {
          box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.3);
        }

        .backdrop-blur-md {
          backdrop-filter: blur(12px);
        }
      `}</style>
    </>
  )
}