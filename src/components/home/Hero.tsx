'use client';

import { ArrowRight, Sparkles, Play } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation" 

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter()
  useEffect(() => {
    setIsLoaded(true);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

    const handleNavigation = (path: string) => {
    router.push(path) // ✅ navigate to the given path
  }

  return (
    <>
      <style jsx global>{`
  /* tracking-in-expand from Animista */
  @keyframes tracking-in-expand {
    0% {
      letter-spacing: -0.5em;
      opacity: 0;
    }
    40% {
      opacity: 0.6;
    }
    100% {
      opacity: 1;
    }
  }
  .tracking-in-expand {
    animation: tracking-in-expand 0.7s cubic-bezier(0.215,0.610,0.355,1.000) both;
  }

  /* existing bounce animation */
  @keyframes bounce-slow {
    0%, 100% { transform: translateY(0) translateX(-50%); }
    50% { transform: translateY(-8px) translateX(-50%); }
  }
  .animate-bounce-slow {
    animation: bounce-slow 2.5s ease-in-out infinite;
  }
`}</style>


      <section className="hero-section relative overflow-hidden bg-[#fbf5e5] min-h-screen flex items-center pt-16">

        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#fbf5e5]/50 via-[#fbf5e5] to-[#fbf5e5]" />

        {/* Minimal accent element */}
        <div
          className="absolute top-[15%] right-[8%] w-[400px] h-[400px] bg-[#FFE01B]/6 rounded-full blur-[120px] pointer-events-none"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        />

        <div
          className="absolute bottom-[20%] left-[10%] w-[350px] h-[350px] bg-[#FCD34D]/5 rounded-full blur-[100px] pointer-events-none"
          style={{ transform: `translateY(${-scrollY * 0.15}px)` }}
        />

        {/* Main Content */}
        <div className="relative z-10 w-full">
          <div className="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-20 max-w-[1320px] py-16 sm:py-20 lg:py-24">

            {/* Small Badge */}
            <div
              className={`inline-flex items-center gap-2.5 bg-[#241C15] px-5 py-2.5 rounded-full mb-10 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              <Sparkles className="w-4 h-4 text-[#FFE01B]" />
              <span className="text-[#fbf5e5] text-sm font-medium tracking-wide" style={{ letterSpacing: '0.05em' }}>
                INDIA'S PREMIER TALENT PLATFORM
              </span>
            </div>

            {/* Headline */}
            <h1
              className={`tracking-in-expand font-bold leading-[1.1] mb-4 transition-all duration-700 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              style={{
                fontSize: 'clamp(2.20rem, 5vw, 4rem)',
                letterSpacing: '-0.025em',
                maxWidth: '950px',
                fontWeight: '700'
              }}
            >
              <span className="block text-[#241C15] mb-1">
                Tier-One Indian Talent
              </span>
              <span className="block text-[#241C15]">
                for{" "}
                <span className="inline-block relative">
                  <span className="relative z-10">Global Companies</span>
                  <span className="absolute bottom-[0.12em] left-0 w-full h-[0.1em] bg-[#FFE01B] -z-10 opacity-30"></span>
                </span>
              </span>
            </h1>


            {/* Subheading */}
            <p
              className={`text-[#241C15] leading-relaxed mb-6 transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{
                fontSize: 'clamp(1.125rem, 1.75vw, 1.375rem)',
                maxWidth: '720px',
                fontWeight: '600',
                opacity: '0.9'
              }}
            >
              Finzie connects you with India's top freelancers & professionals—pre-vetted, managed, and ready to deliver.
            </p>

            {/* Secondary Description */}
            <p
              className={`text-[#241C15]/65 leading-relaxed mb-12 transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{
                fontSize: 'clamp(1rem, 1.25vw, 1.125rem)',
                maxWidth: '680px',
                fontWeight: '400',
                lineHeight: '1.7'
              }}
            >
              Whether you need on-demand project execution, freelance hires, or full-time recruitment, we ensure world-class talent with zero hassle.
            </p>

            {/* CTA Buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-[400ms] ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              <button
                className="group bg-[#FFE01B] hover:bg-[#FCD34D] text-[#241C15] font-semibold px-7 py-4 rounded-lg transition-all duration-300 hover:scale-[1.02] flex items-center justify-center sm:justify-start shadow-md hover:shadow-lg"
                style={{ fontSize: '1.0625rem', fontWeight: '600' }}
                onClick={() => handleNavigation("/find-talent")}
              >
                Hire Top Talent
                <ArrowRight className="ml-2.5 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                className="group bg-transparent hover:bg-[#241C15] text-[#241C15] hover:text-[#fbf5e5] font-semibold px-7 py-4 rounded-lg border-2 border-[#241C15] transition-all duration-300 hover:scale-[1.02] flex items-center justify-center sm:justify-start"
                style={{ fontSize: '1.0625rem', fontWeight: '600' }}
                onClick={() => handleNavigation("/get-hired")}

              >
                <Play className="mr-2.5 w-4 h-4 fill-current" />
                Join as Freelancer
              </button>
            </div>
          </div>
        </div>

      </section>
    </>
  );
};

export default Hero;
