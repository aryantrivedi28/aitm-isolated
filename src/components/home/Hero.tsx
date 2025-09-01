'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Play, Star } from "lucide-react";
import { useState, useEffect } from "react";

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  // Throttled mouse tracking for gradient
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
    <section className="relative overflow-hidden bg-[#241C15] pt-[100px] sm:pt-[120px] lg:pt-[130px]">
      {/* Light Radial Gradient Mouse Follower */}
      <div
        className="absolute inset-0 z-0 opacity-20 pointer-events-none transition-all duration-300"
        style={{
          background: `radial-gradient(500px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,224,27,0.15), transparent 50%)`
        }}
      />

      {/* Minimal Blobs */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#FFE01B]/20 rounded-full blur-2xl animate-blob-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-[#FFE01B]/20 rounded-full blur-2xl animate-blob-fast" />

      {/* CSS Grid Background */}
      <div className="absolute inset-0 z-0 opacity-10 bg-grid" />

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl">
          <div className="text-center md:text-left max-w-5xl mx-auto md:mx-0 pb-16">
            
            {/* Badge */}
            <div className={`inline-flex items-center gap-3 sm:gap-4 backdrop-blur-xl bg-white/10 border border-[#D1D5DB]/20 px-4 sm:px-6 py-3 rounded-full shadow-lg transition-transform duration-500 hover:scale-105 ${isLoaded ? 'animate-slideUp' : 'opacity-0 translate-y-10'}`}>
              <Sparkles className="w-5 h-5 text-[#FFE01B] animate-pulse" />
              <span className="text-[#FFE01B] font-bold text-sm sm:text-base bg-gradient-to-r from-[#FFE01B] to-[#FCD34D] bg-clip-text text-transparent">
                India's Premier Talent Platform
              </span>
              <Star className="w-4 h-4 text-[#FFE01B] animate-spin" style={{ animationDuration: '3s' }} />
            </div>

            {/* Headline */}
            <h1 className={`font-black leading-[1.1] sm:leading-tight mb-6 text-white transition-all duration-700 ${isLoaded ? 'animate-slideUp' : 'opacity-0 translate-y-10'}`}
              style={{ fontSize: 'clamp(2.2rem, 6vw, 4.5rem)', textShadow: '0 0 30px rgba(255,224,27,0.4)' }}>
              <span className="inline-block bg-gradient-to-r from-[#FFE01B] to-[#FCD34D] bg-clip-text text-transparent animate-gradient">
                Tier-One
              </span> Indian Talent <br />
              <span className="text-[#f9fafb]">for </span>
              <span className="inline-block bg-gradient-to-r from-[#FCD34D] to-[#FFE01B] bg-clip-text text-transparent animate-gradient">
                Global
              </span>
              <span className="text-[#f5f6f7]"> Companies</span>
            </h1>

            {/* Description */}
            <p className={`text-[#D1D5DB] text-base sm:text-lg max-w-4xl leading-relaxed mb-8 ${isLoaded ? 'animate-slideUp' : 'opacity-0 translate-y-10'}`}>
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
                <Button className="bg-[#FFE01B] hover:bg-[#FCD34D] text-black text-lg font-bold px-6 py-4 sm:px-7 sm:py-4 rounded-xl shadow-md hover:scale-105 transition-transform duration-300 w-full sm:w-auto flex items-center justify-center">
                  Hiring for the talent <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/all-freelancer" className="w-full sm:w-auto">
                <Button className="bg-white/10 hover:bg-white/20 text-white text-lg border border-[#D1D5DB]/50 hover:border-[#FFE01B] font-semibold px-6 py-4 sm:px-8 sm:py-4 rounded-xl shadow-md hover:scale-105 transition-transform duration-300 w-full sm:w-auto flex items-center justify-center">
                  <Play className="mr-2 w-5 h-5" /> Get Hired as Freelancer
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

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
