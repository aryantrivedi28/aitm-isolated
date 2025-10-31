"use client"

import { ArrowRight, Play, Sparkles, CheckCircle2, Video, ArrowRightCircle } from "lucide-react"
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

  // Fixed YouTube URL parsing - more reliable
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null
    
    try {
      let videoId = '';
      
      // Handle different YouTube URL formats
      if (url.includes('youtube.com/watch?v=')) {
        videoId = url.split('v=')[1]?.split('&')[0] || '';
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
      } else if (url.includes('youtube.com/embed/')) {
        videoId = url.split('embed/')[1]?.split('?')[0] || '';
      } else {
        // Try regex as fallback
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        videoId = (match && match[2].length === 11) ? match[2] : '';
      }
      
      if (videoId && videoId.length === 11) {
        return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
      }
    } catch (error) {
      console.error('Error parsing YouTube URL:', error);
    }
    
    return null;
  }

  const embedUrl = videoUrl ? getYouTubeEmbedUrl(videoUrl) : null;
  const hasValidVideo = !!embedUrl;

  // Don't return null if videoUrl is missing - only hide video section
  if (!title) return null

  return (
    <>
      <style jsx global>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
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

        @keyframes bounceRight {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(10px); }
        }

        .animate-slideInUp { animation: slideInUp 0.8s ease-out; }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse 2s ease-in-out infinite; }
        .animate-bounce-right { animation: bounceRight 2s ease-in-out infinite; }
      `}</style>

      <section className="how-we-work relative bg-[#fbf5e5] py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#FFE01B]/6 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FCD34D]/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          {/* Header Section */}
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

          {/* Video Section - Always render but conditionally show content */}
          <div className={`mb-12 md:mb-16 max-w-2xl mx-auto ${isVisible ? 'animate-slideInUp' : 'opacity-0'}`}>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-[#241C15]/10">
              <div className="relative aspect-video">
                {hasValidVideo ? (
                  <iframe
                    src={embedUrl}
                    title="How We Work Video"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : videoUrl ? (
                  // Show error state if videoUrl exists but parsing failed
                  <div className="w-full h-full flex flex-col items-center justify-center text-white bg-gradient-to-br from-red-500 to-red-700">
                    <Video className="w-16 h-16 mb-4 text-white" />
                    <p className="text-lg font-semibold">Invalid YouTube URL</p>
                    <p className="text-sm mt-2 text-white/80">Please check: {videoUrl}</p>
                  </div>
                ) : (
                  // Show placeholder if no videoUrl
                  <div className="w-full h-full bg-gradient-to-br from-[#fbf5e5] to-white flex flex-col items-center justify-center text-[#241C15]/50">
                    <Video className="w-16 h-16 mb-4 text-[#241C15]/30" />
                    <p className="text-lg font-semibold">Video not available</p>
                    <p className="text-sm mt-2">Add a YouTube URL in Sanity</p>
                  </div>
                )}
              </div>
              
              {/* Video CTA - Only show if we have a valid video */}
              {hasValidVideo && (
                <div className="p-6 bg-gradient-to-r from-[#FFE01B]/10 to-[#FCD34D]/10 border-t border-[#241C15]/5">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-center sm:text-left">
                      <h3 className="font-bold text-[#241C15] text-lg">See Our Process in Action</h3>
                      <p className="text-[#241C15]/70 text-sm">Watch how we deliver exceptional results</p>
                    </div>
                    <button className="inline-flex items-center gap-2 px-6 py-3 bg-[#241C15] text-white rounded-xl font-semibold hover:bg-[#FFE01B] hover:text-[#241C15] transition-all duration-300 whitespace-nowrap">
                      <Play className="w-4 h-4" />
                      Play Demo
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Steps Section - Full Width with Arrows */}
          {steps && steps.length > 0 && (
            <div className={`relative ${isVisible ? 'animate-fadeIn' : 'opacity-0'}`}>
              {/* Main Timeline Line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#FFE01B] to-[#FCD34D] transform -translate-x-1/2 hidden md:block" />
              
              <div className="space-y-8 md:space-y-12">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className={`relative group ${
                      isVisible ? 'animate-fadeIn' : 'opacity-0'
                    }`}
                    style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                  >
                    {/* Step Connector - Mobile */}
                    {index < steps.length - 1 && (
                      <div className="absolute left-6 top-20 w-0.5 h-8 bg-gradient-to-b from-[#FFE01B] to-[#FCD34D] opacity-30 md:hidden" />
                    )}

                    <div className={`flex flex-col md:flex-row items-start gap-6 md:gap-12 ${
                      index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}>
                      {/* Step Number & Icon - Desktop */}
                      <div className="hidden md:flex relative flex-shrink-0">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FFE01B] to-[#FCD34D] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform z-10">
                          <span className="text-2xl font-black text-[#241C15]">{step.stepNumber}</span>
                        </div>
                        
                        {/* Arrow for desktop */}
                        {index < steps.length - 1 && (
                          <div className={`absolute top-1/2 ${
                            index % 2 === 0 ? 'right-0 translate-x-8' : 'left-0 -translate-x-8'
                          } transform -translate-y-1/2`}>
                            <ArrowRightCircle className={`w-8 h-8 text-[#FFE01B] animate-bounce-right ${
                              index % 2 === 1 ? 'rotate-180' : ''
                            }`} />
                          </div>
                        )}
                      </div>

                      {/* Step Content */}
                      <div className="flex-1 bg-white/80 backdrop-blur-sm border border-[#241C15]/10 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:border-[#FFE01B]">
                        <div className="flex items-start gap-4">
                          {/* Step Number - Mobile */}
                          <div className="flex-shrink-0 md:hidden">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFE01B] to-[#FCD34D] flex items-center justify-center shadow-md">
                              <span className="text-lg font-black text-[#241C15]">{step.stepNumber}</span>
                            </div>
                          </div>

                          <div className="flex-1 space-y-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-xl md:text-2xl font-bold text-[#241C15]">
                                  {step.heading}
                                </h3>
                                {step.subheading && (
                                  <p className="text-base font-semibold text-[#FFE01B] italic mt-1">
                                    "{step.subheading}"
                                  </p>
                                )}
                              </div>
                              
                              {/* Check Icon */}
                              <CheckCircle2 className="w-6 h-6 text-[#FFE01B] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                            </div>
                            
                            <p className="text-[#241C15]/80 leading-relaxed text-base md:text-lg">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA Section */}
          {cta && (
            <div className={`text-center mt-12 md:mt-16 ${isVisible ? 'animate-fadeIn' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href={cta.href}
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FFE01B] to-[#FCD34D] text-[#241C15] rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-base"
                >
                  {cta.label}
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </a>
                <button className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white border-2 border-[#241C15]/20 text-[#241C15] rounded-xl font-semibold hover:border-[#FFE01B] hover:bg-[#fbf5e5] transition-all duration-300 text-base">
                  <Play className="w-5 h-5" />
                  Watch Full Process
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}