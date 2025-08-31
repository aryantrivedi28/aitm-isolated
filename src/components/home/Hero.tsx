'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Play, Star } from "lucide-react";
import { useState, useEffect } from "react";

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    setIsClient(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#241C15] via-[#1A1512] to-[#0F0A07] min-h-screen pt-[100px] sm:pt-[120px] lg:pt-[130px]">
      {/* Background Elements - Mouse Follower */}
      <div className="absolute inset-0 z-0 transition-opacity duration-300">
        {isClient && (
          <div
            className="absolute inset-0 opacity-20 transition-all duration-300 ease-out"
            style={{
              background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,224,27,0.18), transparent 40%)`
            }}
          />
        )}
      </div>

      {/* Modern Floating Orbs / Blobs */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-yellow-400/25 to-amber-300/25 rounded-full blur-3xl animate-blob-slow" style={{ animationDelay: '0s' }} />
      <div className="absolute top-[60%] left-[10%] w-40 h-40 bg-gradient-to-r from-amber-400/15 to-yellow-300/15 rounded-full blur-3xl animate-blob-medium" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-yellow-400/25 to-amber-300/25 rounded-full blur-3xl animate-blob-fast" style={{ animationDelay: '4s' }} />
      <div className="absolute top-[20%] right-[15%] w-36 h-36 bg-gradient-to-r from-yellow-300/20 to-amber-200/20 rounded-full blur-3xl animate-blob-medium" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-[10%] left-[40%] w-52 h-52 bg-gradient-to-r from-amber-500/15 to-yellow-500/15 rounded-full blur-3xl animate-blob-slow" style={{ animationDelay: '3s' }} />

      {/* Animated Grid */}
      <div className="absolute inset-0 z-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,224,27,0.2)" strokeWidth="1" />
            </pattern>
            <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,224,27,0.05)" />
              <stop offset="50%" stopColor="rgba(255,224,27,0.15)" />
              <stop offset="100%" stopColor="rgba(255,224,27,0.05)" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" className="animate-grid-fade" />
        </svg>
      </div>

      {/* Main Content Container - Centered on Mobile, Left-aligned on Desktop */}
      <div className="relative z-10 flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl">
          <div className="text-center md:text-left max-w-5xl mx-auto md:mx-0 pb-16">
            {/* Enhanced Badge */}
            <div className={`inline-flex md:inline-flex items-center gap-3 sm:gap-4 backdrop-blur-xl bg-white/10 border border-white/20 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 mb-6 sm:mb-8 rounded-full shadow-2xl transition-all duration-700 ease-out hover:scale-105 hover:bg-white/15 hover:shadow-yellow-400/20 hover:shadow-2xl group ${isLoaded ? 'animate-[slideUp_0.8s_ease-out_forwards]' : 'opacity-0 translate-y-10'}`}>
              <div className="relative">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-yellow-400 animate-pulse" />
                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-lg opacity-50 animate-pulse" />
              </div>
              <span className="text-yellow-400 font-bold text-xs sm:text-sm lg:text-base xl:text-lg bg-gradient-to-r from-yellow-300 to-amber-400 bg-clip-text text-transparent">
                India's Premier Talent Platform
              </span>
              <Star className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-yellow-400 animate-spin" style={{ animationDuration: '3s' }} />
            </div>

            {/* Modern Headline with Improved Responsive Typography */}
            <h1 className={`font-black leading-[1.1] sm:leading-tight mb-6 sm:mb-8 lg:mb-10 text-white transition-all duration-1000 ${isLoaded ? 'animate-[slideUp_1s_ease-out_0.2s_forwards]' : 'opacity-0 translate-y-10'}`}
              style={{
                fontSize: 'clamp(2.2rem, 7vw, 4.5rem)',
                textShadow: '0 0 40px rgba(255,224,27,0.5), 0 0 80px rgba(255,224,27,0.2)'
              }}>
              <span className="inline-block bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-300 bg-clip-text text-transparent animate-gradient bg-300% hover:scale-105 transition-transform duration-500">
                Tier-One
              </span>
              <span> Indian Talent</span>
              <br />
              <span className="text-gray-100">for </span>
              <span className="inline-block bg-gradient-to-r from-amber-300 via-yellow-400 to-yellow-300 bg-clip-text text-transparent animate-gradient bg-300%">
                Global
              </span>
              <span className="text-gray-100"> Companies</span>
            </h1>

            {/* Enhanced Description with Better Spacing */}
            <div className={`text-sm sm:text-base lg:text-lg xl:text-xl text-gray-300 max-w-4xl mx-auto md:mx-0 leading-relaxed mb-8 sm:mb-10 lg:mb-12 font-medium px-4 sm:px-0 transition-all duration-1000 ${isLoaded ? 'animate-[slideUp_1s_ease-out_0.4s_forwards]' : 'opacity-0 translate-y-10'}`}>
              Finzie connects you with India's top freelancers & professionals,{" "}
              <span className="relative">
                <span className="bg-gradient-to-r from-yellow-300 to-amber-400 bg-clip-text text-transparent font-bold">
                  pre-vetted, managed, and ready to deliver. {" "}
                </span>
                <span className="absolute -inset-1 bg-gradient-to-r from-yellow-400/20 to-amber-300/20 blur-lg -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </span>
              Whether you need on-demand project execution, freelance hires, or full-time recruitment, we ensure{" "}
              <span className="text-yellow-400 font-bold">world-class talent with zero hassle.</span>
            </div>

            {/* Modern CTA Buttons - Better Mobile Layout */}
            <div className={`flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center md:justify-start items-center px-4 sm:px-0 transition-all duration-1000 ${isLoaded ? 'animate-[slideUp_1s_ease-out_0.6s_forwards]' : 'opacity-0 translate-y-10'}`}>
              {/* Link for "Start Your Project" */}
              <Link href="/find-talent" className="w-full sm:w-auto">
                <Button className="relative group bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-300 hover:to-amber-400 text-black font-bold text-sm sm:text-base lg:text-lg xl:text-xl px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 rounded-full shadow-2xl hover:shadow-yellow-400/30 transition-all duration-500 hover:scale-105 overflow-hidden w-full sm:w-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative flex items-center justify-center">
                    Start Your Project
                    <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                </Button>
              </Link>

              {/* Link for "Get Hired as Freelancer" */}
              <Link href="/all-freelancer" className="w-full sm:w-auto">
                <Button className="relative group backdrop-blur-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-yellow-400/50 font-semibold text-sm sm:text-base lg:text-lg xl:text-xl px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 rounded-full shadow-2xl hover:shadow-white/20 transition-all duration-500 hover:scale-105 w-full sm:w-auto">
                  <span className="flex items-center justify-center">
                    <Play className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                    Get Hired as Freelancer
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 300% 300%;
          animation: gradient 3s ease infinite;
        }
        .bg-300% {
          background-size: 300% 300%;
        }

        /* New Blob Animations - Smoother and more fluid */
        @keyframes blob-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -30px) scale(1.1); }
          50% { transform: translate(-10px, 40px) scale(0.9); }
          75% { transform: translate(30px, 10px) scale(1.05); }
        }
        .animate-blob-slow {
          animation: blob-slow 20s ease-in-out infinite;
        }
        
        @keyframes blob-medium {
          0%, 100% { transform: translate(0, 0) scale(1); }
          30% { transform: translate(-25px, 35px) scale(0.95); }
          60% { transform: translate(15px, -20px) scale(1.08); }
        }
        .animate-blob-medium {
          animation: blob-medium 15s ease-in-out infinite;
        }
        
        @keyframes blob-fast {
          0%, 100% { transform: translate(0, 0) scale(1); }
          40% { transform: translate(10px, -25px) scale(1.03); }
          80% { transform: translate(-18px, 15px) scale(0.97); }
        }
        .animate-blob-fast {
          animation: blob-fast 12s ease-in-out infinite;
        }
        
        /* New Grid Fade Animation */
        @keyframes grid-fade {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.2; }
        }
        .animate-grid-fade {
          animation: grid-fade 5s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;