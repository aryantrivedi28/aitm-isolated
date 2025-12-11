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
    <section className="relative overflow-hidden bg-[#faf4e5] py-16 sm:py-20 flex items-center justify-center">
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Main Headline */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#050504] leading-snug sm:leading-tight mb-6 sm:mb-8">
          Ready to{" "}
          <span className="bg-[#050504] bg-clip-text text-transparent animate-gradient">
            Transform
          </span>
          <br className="hidden sm:block" />
          Your Business?
        </h2>
        {/* Description */}
        <p className="text-[#050504] text-base sm:text-lg md:text-xl leading-relaxed mb-8 sm:mb-12 max-w-3xl font-medium relative w-fit underline-wavy">
          Work with India’s top 1 percent marketing and creative talent. Get an agile team that moves with speed and clarity.{" "}
          <span className="font-bold underline-wavy">
            Finzie's expert talent.
          </span>
        </p>



        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-12 sm:mb-16 max-w-3xl">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-center gap-3 sm:gap-4 text-[#31302f] transition-transform duration-300 hover:scale-105 justify-center"
              style={{ animationDelay: `${index * 0.15 + 0.3}s` }}
            >
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#31302f] flex-shrink-0" />
              <span className="text-sm sm:text-base md:text-lg font-medium">{benefit}</span>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center items-center">
          <Link href="/client-request">
            <Button className="bg-[#f7af00] hover:bg-[#FCD34D] text-black text-lg font-bold px-6 py-4 sm:px-8 sm:py-5 rounded-2xl flex items-center justify-center transition-transform duration-300">
              Start a Project
              <ArrowRight className="ml-2 w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-300 group-hover:translate-x-2" />
            </Button>
          </Link>
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
