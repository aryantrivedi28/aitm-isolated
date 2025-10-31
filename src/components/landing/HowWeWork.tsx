"use client"

import { ArrowRight, Play, Sparkles, CheckCircle2, Video, ChevronRight, ChevronDown } from "lucide-react"
import { useState, useEffect } from "react"

export default function HowWeWorkSection({
  title = "How We Work",
  steps = [],
  videoUrl,
  cta = { label: "Get Started", href: "#" },
}: {
  title?: string
  steps?: Array<{
    stepNumber: number
    heading: string
    subheading?: string
    description: string
  }>
  videoUrl?: string
  cta?: { label: string; href: string }
}) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Fixed YouTube URL parsing
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null

    try {
      if (url.includes('youtube.com/watch?v=')) {
        const videoId = url.split('v=')[1]?.split('&')[0]
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null
      }
      if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1]?.split('?')[0]
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null
      }
      if (url.includes('youtube.com/embed/')) {
        return url
      }
    } catch (error) {
      console.error('Error parsing YouTube URL:', error)
    }

    return null
  }

  const embedUrl = videoUrl ? getYouTubeEmbedUrl(videoUrl) : null

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

      <section className="how-we-work relative bg-[#fbf5e5] py-10 sm:py-12 md:py-14 lg:py-16 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#FFE01B]/6 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FCD34D]/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 max-w-[1500px] mx-auto px-2 sm:px-6 md:px-8 lg:px-8 xl:px-6">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 bg-[#241C15] px-4 py-2 rounded-full shadow-md mb-6">
              <Sparkles className="w-4 h-4 text-[#FFE01B] animate-pulse-slow" />
              <span className="text-sm font-semibold text-[#fbf5e5]">Our Process</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-[#241C15] mb-4">
              {title}
              <div className="h-1 w-24 bg-gradient-to-r from-[#FFE01B] to-[#FCD34D] rounded-full mt-4 mx-auto" />
            </h2>
          </div>

          {/* Snake Layout Container */}
          <div className="relative">
            {/* Video Section - Top Left */}
            <div className={`mb-8 md:mb-12 lg:absolute lg:left-0 lg:top-0 lg:w-5/12 xl:w-4/12 ${isVisible ? 'animate-slideInLeft' : 'opacity-0'}`}>
              <div className="bg-[#fbf5e5] rounded-2xl overflow-hidden">
                <div className="relative aspect-video bg-black">
                  {embedUrl ? (
                    <iframe
                      src={embedUrl}
                      title="How We Work Video"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : videoUrl ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white bg-gradient-to-br from-gray-900 to-gray-700">
                      <Video className="w-16 h-16 mb-4 text-gray-400" />
                      <p className="text-lg font-semibold">Invalid YouTube URL</p>
                      <p className="text-sm mt-2 text-gray-400">Please check the URL format</p>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#241C15]/50 bg-gradient-to-br from-[#fbf5e5] to-white">
                      <Video className="w-16 h-16 mb-4 text-[#241C15]/30" />
                      <p className="text-lg font-semibold">Video not available</p>
                      <p className="text-sm mt-2">Add a YouTube URL in Sanity</p>
                    </div>
                  )}
                </div>

                {/* Video Info */}
                <div className="p-6 bg-[#fbf5e5]">
                  <h3 className="font-bold text-[#241C15] text-xl mb-2">Process Overview</h3>
                  <p className="text-[#241C15]/70">Watch our workflow in action</p>
                </div>
              </div>

              {/* CTA Section */}
              {cta && (
                <div className={`mt-16 md:mt-20 text-center ${isVisible ? 'animate-fadeIn' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
                  <div className="bg-[#241C15] rounded-2xl p-8 border border-[#FFE01B]/30 max-w-2xl mx-auto">
                    <h3 className="text-2xl font-bold text-[#fbf5e5] mb-3">Ready to Start Your Project?</h3>
                    <p className="text-[#fbf5e5]/70 mb-6">Let's begin your journey with our proven process</p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                      <a
                        href={cta.href}
                        className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FFE01B] to-[#FCD34D] text-[#241C15] rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-base min-w-[180px]"
                      >
                        {cta.label}
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Steps Snake Layout - Wrapping around video */}
            <div className="lg:ml-[45%] xl:ml-[38%]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {steps.map((step, index) => {
                  // Snake pattern: even indexes on right column, odd on left (but shifted for visual flow)
                  const isRightColumn = index % 2 === 0;
                  const stepDelay = 0.2 + index * 0.1;

                  return (
                    <div
                      key={index}
                      className={`relative group ${isVisible ? 'animate-fadeIn' : 'opacity-0'
                        } ${isRightColumn ? 'md:mt-0' : 'md:mt-16'}`}
                      style={{ animationDelay: `${stepDelay}s` }}
                    >
                      {/* Snake Connectors */}
                      {index < steps.length - 1 && (
                        <>
                          {/* Horizontal connector for right column steps */}
                          {isRightColumn && index % 4 === 0 && (
                            <div className="hidden md:block absolute top-1/2 -right-4 w-4 h-0.5 bg-gradient-to-r from-[#FFE01B] to-[#FCD34D] z-10">
                              <ChevronRight className="w-4 h-4 text-[#FFE01B] absolute -right-2 -top-2" />
                            </div>
                          )}

                          {/* Vertical connector from right to left column */}
                          {isRightColumn && (index + 1) < steps.length && (
                            <div className="hidden md:block absolute top-full -right-4 w-0.5 h-16 bg-gradient-to-b from-[#FFE01B] to-[#FCD34D] z-10">
                              <ChevronDown className="w-4 h-4 text-[#FFE01B] absolute -bottom-1 -left-1" />
                            </div>
                          )}

                          {/* Horizontal connector for left column steps */}
                          {!isRightColumn && index % 4 === 1 && (
                            <div className="hidden md:block absolute top-1/2 -left-4 w-4 h-0.5 bg-gradient-to-l from-[#FFE01B] to-[#FCD34D] z-10">
                              <ChevronRight className="w-4 h-4 text-[#FFE01B] absolute -left-1 -top-2 rotate-180" />
                            </div>
                          )}
                        </>
                      )}

                      {/* Step Card */}
                      <div className={`bg-[#241C15] backdrop-blur-sm border border-[#241C15]/10 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:border-[#FFE01B] group-hover:scale-[1.02] relative ${isRightColumn ? 'md:mr-4' : 'md:ml-4'
                        }`}>
                        {/* Step Number Badge */}
                        <div className={`absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-br from-[#FFE01B] to-[#FCD34D] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform z-20 ${isRightColumn ? 'md:-left-3' : 'md:-right-3 md:left-auto'
                          }`}>
                          <span className="text-sm font-black text-[#241C15]">{step.stepNumber}</span>
                        </div>

                        {/* Step Content */}
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg md:text-xl font-bold text-[#fbf5e5] mb-2 pr-6">
                                {step.heading}
                              </h3>
                              {step.subheading && (
                                <p className="text-sm font-semibold text-[#FFE01B] italic mb-3">
                                  "{step.subheading}"
                                </p>
                              )}
                            </div>

                            {/* Check Icon */}
                            <CheckCircle2 className="w-5 h-5 text-[#FFE01B] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
                          </div>

                          <p className="text-[#fbf5e5]/80 leading-relaxed text-sm md:text-base">
                            {step.description}
                          </p>

                          {/* Progress Line */}
                          <div className="pt-3">
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-[#241C15]/10 rounded-full h-1.5">
                                <div
                                  className="bg-gradient-to-r from-[#FFE01B] to-[#FCD34D] h-1.5 rounded-full transition-all duration-500"
                                  style={{ width: `${(step.stepNumber / steps.length) * 75 + 25}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Connecting main snake line */}
              <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-0.5 bg-gradient-to-b from-[#FFE01B] via-[#FCD34D] to-[#FFE01B] opacity-20 -z-10 -ml-0.5" />
            </div>
          </div>


        </div>
      </section>
    </>
  )
}