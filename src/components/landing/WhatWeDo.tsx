"use client"

import { Sparkles, ArrowRight, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"

interface Card {
  title: string
  description: string
}

interface CTA {
  label: string
  href: string
  variant?: string
}

export default function WhatWeDoSection({
  heading,
  cards,
  ctas,
}: {
  heading?: string
  cards?: Card[] | null
  ctas?: CTA[] | null
}) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Safe array access with null checks
  const safeCards = cards || []
  const safeCtas = ctas || []

  // Check if we have any content to display
  const hasContent = heading || safeCards.length > 0

  if (!hasContent) {
    return <p className="text-center text-red-500">No content found</p>
  }

  return (
    <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#fbf5e5] via-[#fff9ed] to-[#f5eed9] overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-72 h-72 bg-[#FFE01B]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#FFE01B]/5 rounded-full blur-3xl" />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(#241C15 1px, transparent 1px),
              linear-gradient(90deg, #241C15 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 bg-[#241C15] px-4 py-2 rounded-full mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Sparkles className="w-4 h-4 text-[#FFE01B]" />
            <span className="text-sm font-semibold text-[#fbf5e5]">Our Services</span>
          </div>

          {/* Heading */}
          {heading && (
            <h2 className={`text-4xl md:text-5xl lg:text-6xl font-black text-[#241C15] mb-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '0.1s' }}>
              {heading}
            </h2>
          )}

          {/* Decorative Line */}
          {heading && (
            <div className={`flex justify-center transition-all duration-700 ${isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`} style={{ transitionDelay: '0.2s' }}>
              <div className="h-1 w-20 bg-gradient-to-r from-[#FFE01B] to-[#FCD34D] rounded-full" />
            </div>
          )}
        </div>

        {/* Cards Grid */}
        {safeCards.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {safeCards.map((card, index) => (
              <div
                key={index}
                className={`group bg-[#241C15] backdrop-blur-sm rounded-2xl p-8 border border-[#241C15]/10 hover:border-[#FFE01B]/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${0.3 + index * 0.1}s` }}
              >
                {/* Card Number */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#FFE01B] to-[#FCD34D] rounded-full flex items-center justify-center text-sm font-black text-[#241C15]">
                    {index + 1}
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-[#FFE01B] to-transparent" />
                </div>

                {/* Card Content */}
                <h3 className="text-xl font-bold text-[#fbf5e5] mb-3 group-hover:text-[#FFE01B] transition-colors">
                  {card.title}
                </h3>
                <p className="text-[#fbf5e5]/70 leading-relaxed">
                  {card.description}
                </p>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#FFE01B]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              </div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        {safeCtas.length > 0 && (
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            style={{ transitionDelay: "0.6s" }}
          >
            {safeCtas.map((cta, index) => {
              const isSecondary = cta.variant === "secondary";
              return (
                <a
                  key={index}
                  href={cta.href}
                  className={`inline-flex items-center justify-center gap-3 px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${isSecondary
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

      {/* Floating decorative elements */}
      <div className="absolute top-20 left-20 opacity-10">
        <div className="w-4 h-4 bg-[#FFE01B] rounded-full animate-bounce" />
      </div>
      <div className="absolute bottom-20 right-20 opacity-10">
        <div className="w-3 h-3 bg-[#FFE01B] rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
      </div>
    </section>
  )
}