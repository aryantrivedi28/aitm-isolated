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


      <section className="hero-section relative overflow-hidden bg-[#fbf5e5] min-h-screen flex items-center">
        {/* Main Content */}
        <div className="relative z-10 w-full">
          <div className="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-20 max-w-[1400px] py-12 sm:py-16 lg:py-18">

            {/* Headline */}
            <h1
              className={`tracking-in-expand leading-[1.1] mb-4 transition-all duration-700 delay-100 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              style={{
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                letterSpacing: "-0.025em",
                maxWidth: "950px",
                fontWeight: "200",
              }}
            >
              <span className="block text-[#241C15] mb-1">
                Reliable {" "}

                <span className="relative inline-block">
                  <span className="relative z-10">Shopify and GoHighLevel</span>
                  <span className="absolute bottom-[0.1em] left-0 w-full h-[0.1em] bg-[#f7af00] -z-10"></span>

                </span>
              </span>
              <span className="relative z-10">execution for agencies and</span>

              <span className="block text-[#241C15]">
                growing businesses
              </span>
            </h1>



            {/* Subheading */}
            <p
              className={`text-[#241C15] leading-relaxed mb-6 transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{
                fontSize: 'clamp(1.125rem, 1.75vw, 1.375rem)',
                maxWidth: '720px',
                fontWeight: '400',
                opacity: '0.9'
              }}
            >
              We deliver fixed-scope Shopify builds, GoHighLevel systems and whitelabel execution without hourly billing or freelancer risk
              Dedicated experts. Predictable outcomes. Zero chaos.
            </p>

            {/* CTA Buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-[400ms] ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              <button
                className="inline-flex items-center bg-[#f7af00] text-black text-xl font-medium px-6 py-4 rounded-2xl hover:scale-105 transition-all duration-500"
                style={{ fontSize: '1.0625rem', fontWeight: '500' }}
                onClick={() => handleNavigation("/find-talent")}
              >
                See how it works
                <ArrowRight className="ml-2.5 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                className="group text-[#241C15] font-semibold px-7 py-4 rounded-lg border-2 border-[#241C15] flex items-center justify-center sm:justify-start hover:scale-105 transition-all duration-500"
                style={{ fontSize: '1.0625rem', fontWeight: '500' }}
                onClick={() => handleNavigation("/get-hired")}
              >
                <Play className="mr-2.5 w-4 h-4 fill-current" />
                View use cases
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
