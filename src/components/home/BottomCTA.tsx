'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, CheckCircle } from "lucide-react";
import Link from "next/link";

const BottomCTA = () => {
  const benefits = [
    "Pre-vetted talent ready in 24 hours",
    "Zero hidden fees or surprises",
    "End-to-end project management",
    "100% satisfaction guarantee"
  ];

  return (
    <section className="relative overflow-hidden bg-[#241C15] py-16 sm:py-20 flex items-center justify-center">
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 sm:gap-3 backdrop-blur-xl bg-white/10 border border-[#D1D5DB]/20 px-4 py-2 sm:px-6 sm:py-3 rounded-2xl mb-6 sm:mb-10 hover:scale-105 transition-transform duration-300">
          <Sparkles className="w-5 h-5 text-[#FFE01B] animate-pulse" />
          <div className="absolute inset-0 bg-[#FFE01B]/20 opacity-0 hover:opacity-20 rounded-2xl transition-opacity duration-300"></div>
        </div>

        {/* Main Headline */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-snug sm:leading-tight mb-6 sm:mb-8">
          Ready to{" "}
          <span className="bg-gradient-to-r from-[#FFE01B] to-[#FCD34D] bg-clip-text text-transparent animate-gradient">
            Transform
          </span>
          <br className="hidden sm:block" />
          Your Business?
        </h2>

        {/* Description */}
        <p className="text-[#D1D5DB] text-base sm:text-lg md:text-xl leading-relaxed mb-8 sm:mb-12 max-w-3xl font-medium">
          Join hundreds of successful startups who've accelerated their growth with{" "}
          <span className="text-[#FFE01B] font-bold">
            Finzie's expert talent.
          </span>
        </p>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-12 sm:mb-16 max-w-3xl">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-center gap-3 sm:gap-4 text-[#D1D5DB] transition-transform duration-300 hover:scale-105 justify-center"
              style={{ animationDelay: `${index * 0.15 + 0.3}s` }}
            >
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFE01B] flex-shrink-0" />
              <span className="text-sm sm:text-base md:text-lg font-medium">{benefit}</span>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center items-center">
          <Link href="/client-request">
            <Button className="bg-[#FFE01B] hover:bg-[#FCD34D] text-black text-lg font-bold px-6 py-4 sm:px-8 sm:py-5 rounded-2xl flex items-center justify-center transition-transform duration-300">
              Start a Project Now
              <ArrowRight className="ml-2 w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-300 group-hover:translate-x-2" />
            </Button>
          </Link>
          <div className="text-[#D1D5DB] text-sm sm:text-base md:text-lg font-medium">
            ✨ Free consultation • No commitment required
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes gradient { 0%,100% { background-position:0% 50%; } 50% { background-position:100% 50%; } }
        .animate-gradient { background-size: 300% 300%; animation: gradient 3s ease infinite; }

        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        .animate-float { animation: float 10s ease-in-out infinite; }
      `}</style>
    </section>
  );
};

export default BottomCTA;
