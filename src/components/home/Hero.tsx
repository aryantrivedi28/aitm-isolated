'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Play, Star } from "lucide-react";
import { useState, useEffect } from "react";

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  // Mouse tracking for gradient
  useEffect(() => {
    setIsLoaded(true);
    let frame: number;

    const handleMouseMove = (e: MouseEvent) => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#241C15] pt-[60px] sm:pt-[100px] lg:pt-[120px]">
      {/* Light Radial Gradient Mouse Follower */}
      <div
        className="absolute inset-0 z-0 opacity-20 pointer-events-none transition-all duration-300"
        style={{
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,224,27,0.15), transparent 50%)`
        }}
      />

      {/* Minimal Blobs */}
      <div className="absolute top-1/4 left-1/4 w-24 sm:w-32 h-24 sm:h-32 bg-[#FFE01B]/20 rounded-full blur-2xl animate-blob-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-32 sm:w-48 h-32 sm:h-48 bg-[#FFE01B]/20 rounded-full blur-2xl animate-blob-fast" />

      {/* Grid Background */}
      <div className="absolute inset-0 z-0 opacity-10 bg-grid" />

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl">
          <div className="text-center md:text-left max-w-3xl sm:max-w-4xl md:max-w-5xl mx-auto md:mx-0 pb-12 sm:pb-16">

            {/* Badge */}
            <div
              className={`flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3 backdrop-blur-xl w-fit bg-white/10 border border-[#D1D5DB]/20 px-3 sm:px-5 py-2 sm:py-3 rounded-full shadow-lg transition-transform duration-500 hover:scale-105 mx-auto md:mx-0 mb-6 sm:mb-8 ${isLoaded ? 'animate-slideUp' : 'opacity-0 translate-y-10'}`}
            >
              {/* Left Icon */}
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFE01B] animate-pulse flex-shrink-0" />

              {/* Text */}
              <span
                className="text-[#FFE01B] font-bold text-sm sm:text-base md:text-lg bg-gradient-to-r from-[#FFE01B] to-[#FCD34D] bg-clip-text text-transparent text-center"
              >
                India's Premier Talent Platform
              </span>

              {/* Right Icon */}
              <Star
                className="w-3 h-3 sm:w-4 sm:h-4 text-[#FFE01B] animate-spin flex-shrink-0"
                style={{ animationDuration: '3s' }}
              />
            </div>


            {/* Headline */}
            <h1 className={`font-black leading-tight mb-6 text-white transition-all duration-700 break-words ${isLoaded ? 'animate-slideUp' : 'opacity-0 translate-y-10'}`}
              style={{ fontSize: 'clamp(1.8rem, 6vw, 4.2rem)', textShadow: '0 0 25px rgba(255,224,27,0.4)' }}>
              <span className="inline-block bg-gradient-to-r from-[#FFE01B] to-[#FCD34D] bg-clip-text text-transparent animate-gradient">
                Tier-One
              </span>{" "}
              Indian Talent <br className="hidden sm:block" />
              <span className="text-[#f9fafb]">for </span>
              <span className="inline-block bg-gradient-to-r from-[#FCD34D] to-[#FFE01B] bg-clip-text text-transparent animate-gradient">
                Global
              </span>{" "}
              <span className="text-[#f5f6f7]">Companies</span>
            </h1>

            {/* Description */}
            <p className={`text-[#D1D5DB] text-sm sm:text-base md:text-lg max-w-2xl sm:max-w-3xl md:max-w-4xl leading-relaxed mb-8 mx-auto md:mx-0 ${isLoaded ? 'animate-slideUp' : 'opacity-0 translate-y-10'}`}>
              Finzie connects you with India's top freelancers & professionals,{" "}
              <span className="font-bold text-[#FFE01B] bg-clip-text text-transparent bg-gradient-to-r from-[#FFE01B] to-[#FCD34D]">
                pre-vetted, managed, and ready to deliver.
              </span>{" "}
              Whether you need on-demand project execution, freelance hires, or full-time recruitment, we ensure{" "}
              <span className="font-bold text-[#FFE01B]">world-class talent with zero hassle.</span>
            </p>

            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center md:justify-start items-center ${isLoaded ? 'animate-slideUp' : 'opacity-0 translate-y-10'}`}>
              <Link href="/find-talent" className="w-full sm:w-auto">
                <Button className="bg-[#FFE01B] hover:bg-[#FCD34D] text-black text-base sm:text-lg font-bold px-5 sm:px-6 py-4 sm:py-6 rounded-xl shadow-md hover:scale-105 transition-transform duration-300 w-full sm:w-auto flex items-center justify-center">
                  Hiring for the talent <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </Link>
              <Link href="/all-freelancer" className="w-full sm:w-auto">
                <Button className="bg-white/10 hover:bg-white/20 text-white text-base sm:text-lg border border-[#D1D5DB]/50 hover:border-[#FFE01B] font-semibold px-5 sm:px-7 py-4 sm:py-6 rounded-xl shadow-md hover:scale-105 transition-transform duration-300 w-full sm:w-auto flex items-center justify-center">
                  <Play className="mr-2 w-4 h-4 sm:w-5 sm:h-5" /> Get Hired as Freelancer
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        .animate-slideUp { animation: slideUp 0.8s ease-out forwards; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

        .animate-gradient { background-size: 300% 300%; animation: gradient 3s ease infinite; }
        @keyframes gradient { 0%,100% { background-position:0% 50%; } 50% { background-position:100% 50%; } }

        @keyframes blob-slow { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(15px,-15px) scale(1.05); } }
        .animate-blob-slow { animation: blob-slow 20s ease-in-out infinite; }

        @keyframes blob-fast { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-15px,10px) scale(0.95); } }
        .animate-blob-fast { animation: blob-fast 15s ease-in-out infinite; }

        .bg-grid {
          background-image: linear-gradient(rgba(255,224,27,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,224,27,0.1) 1px, transparent 1px);
          background-size: 60px 60px;
          animation: grid-fade 5s ease-in-out infinite;
        }

        @keyframes grid-fade { 0%,100% { opacity:0.1; } 50% { opacity:0.2; } }
      `}</style>
    </section>
  );
};

export default Hero;
