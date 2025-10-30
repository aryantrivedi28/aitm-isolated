'use client'

import { ArrowRight, Zap, Sparkles, Star, ChevronRight } from 'lucide-react'
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
  const [particles, setParticles] = useState<{ left: string; top: string; duration: number; delay: number }[]>([])
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    setParticles(
      Array.from({ length: isMobile ? 8 : 12 }).map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: 4 + Math.random() * 4,
        delay: Math.random() * 2,
      }))
    )

    return () => window.removeEventListener('resize', checkMobile)
  }, [isMobile])

  return (
    <>
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes floatParticle {
          0%, 100% { transform: translateY(-10px); opacity: 0.3; }
          50% { transform: translateY(-20px); opacity: 0.7; }
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

        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-floatParticle { animation: floatParticle 4s ease-in-out infinite; }
        .animate-slideInLeft { animation: slideInLeft 0.8s ease-out; }
        .animate-slideInRight { animation: slideInRight 0.8s ease-out; }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
      `}</style>

      <div className="hero-section relative bg-[#fbf5e5] overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-radial from-[#FFE01B]/15 via-transparent to-transparent opacity-60" />

          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(36, 28, 21, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(36, 28, 21, 0.1) 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}
          />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {particles.map((p, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-[#FFE01B]/30 rounded-full animate-floatParticle"
              style={{ left: p.left, top: p.top, animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s` }}
            />
          ))}
        </div>

        {/* Main Content - No extra padding, full width */}
        <div className="relative z-10 min-h-screen flex items-center">
          <div className="w-full max-w-[1500px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-16 sm:py-20 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 xl:gap-20 items-center">

              {/* Left Column - Text Content */}
              <div className="animate-slideInLeft">

                {/* Title - Increased font size */}
                <div className="mb-6 md:mb-8">
                  <h1 className="text-[#241C15] font-black leading-[1.1] tracking-tight mb-4"
                    style={{
                      fontSize: 'clamp(2.20rem, 5vw, 4rem)',
                      letterSpacing: '-0.025em',
                      maxWidth: '950px',
                      fontWeight: '700'
                    }}
                  >
                    {title}
                  </h1>
                </div>

                {/* Subtitle - Better handling for long text */}
                {subtitle && (
                  <div className="mb-10">
                    <p className="text-[#241C15]/75 leading-relaxed font-medium"
                      style={{
                        fontSize: 'clamp(1.125rem, 1.75vw, 1.375rem)',
                        maxWidth: '720px',
                        fontWeight: '600',
                        opacity: '0.9'
                      }}
                    >
                      {subtitle}
                    </p>
                  </div>
                )}

                {/* CTA Buttons */}
                {ctas?.length > 0 && (
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    {ctas.map((cta) => {
                      const isSecondary = cta.variant === "secondary";
                      return (
                        <a
                          key={cta.href}
                          href={cta.href}
                          className={`inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${isSecondary
                            ? "border border-[#241C15]/30 text-[#241C15]/70 hover:text-[#241C15] hover:border-[#241C15]/60 bg-transparent"
                            : "bg-[#FFE01B] text-[#241C15] hover:bg-[#f5d000]"
                            }`}
                          style={{ fontSize: "clamp(0.9375rem, 1.5vw, 1.125rem)" }}
                        >
                          <span>{cta.label}</span>
                          {!isSecondary ? (
                            <ArrowRight className="w-5 h-5" />
                          ) : (
                            <ChevronRight className="w-5 h-5" />
                          )}
                        </a>
                      );
                    })}
                  </div>
                )}

              </div>

              {/* Right Column - Screenshots & Blog Button */}
              <div className="animate-slideInRight h-full flex flex-col justify-between">

                {/* Screenshots Grid */}
                {screenshots?.length > 0 && (
                  <div className="flex flex-col items-center justify-center">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10 w-full max-w-[750px] mx-auto">
                      {screenshots.map((screenshot, index) => (
                        <div key={index} className="group relative w-full">
                          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-white/20 backdrop-blur-sm border border-white/30 hover:scale-[1.04] transition-transform duration-300 w-[120%] sm:w-[160%] md:w-[200%]">
                            {screenshot.image && (
                              <img
                                src={urlFor(screenshot.image).url()}
                                alt={screenshot.caption || `Screenshot ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>

                          {screenshot.caption && (
                            <p className="text-center text-[#241C15]/60 text-sm mt-3 font-medium">
                              {screenshot.caption}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Blog Button - Consistent Bottom Alignment */}
                {blogButton && (
                  <div className="flex justify-center mt-10">
                    <a
                      href={blogButton.href}
                      className="group inline-flex items-center gap-2 bg-[#241C15] text-white px-5 py-2.5 rounded-full hover:bg-[#3A3025] transition-all duration-300 font-semibold shadow-sm hover:shadow-md"
                      style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1rem)' }}
                    >
                      <span>{blogButton.label}</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}

        <div className="absolute right-12 bottom-12 text-[#FFE01B]/40 hidden lg:block animate-float" style={{ animationDelay: '1s' }}>
          <Sparkles className="w-6 h-6" />
        </div>
      </div>
    </>
  )
}