'use client';

import { useEffect, useState } from "react";
import { TrendingUp, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

const CaseStudies = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative py-16 lg:py-20 bg-[#faf4e5] overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div
          className={`text-center mb-12 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="font-medium text-3xl sm:text-4xl md:text-5xl text-[#050504] mb-4">
            Trusted with{" "}
            <span className="bg-[#050504] bg-clip-text text-transparent animate-gradient">
              live revenue systems
            </span>
          </h2>

          <p className="text-[#31302f] text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            We work with agencies and brands where reliability matters more than
            promises.
          </p>
        </div>

        {/* Case Card */}
        <div
          className={`max-w-4xl mx-auto transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="relative bg-[#f0eadd] rounded-3xl p-6 sm:p-8 border-2 border-[#f0eadd] hover:border-[#f7af00] transition-all duration-500">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-[#f7af00] text-[#050504] text-sm font-medium">
              <ShieldCheck className="w-4 h-4" />
              Live Shopify Store
            </div>

            {/* Case Content */}
            <h3 className="text-xl sm:text-2xl font-medium text-[#050504] mb-4">
              Shopify tracking and performance fixes for a New York–based fashion
              marketplace
            </h3>

            <p className="text-[#31302f] text-sm sm:text-base leading-relaxed mb-6">
              Critical GA4 and checkout issues were resolved on a live revenue
              store without disrupting ongoing sales or customer experience.
            </p>

            {/* Outcome */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#f7af00] flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-black" />
              </div>
              <p className="text-[#31302f] text-sm sm:text-base font-medium">
                Stable tracking, improved checkout reliability, and zero
                downtime during fixes.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-14 sm:mt-18">
          <Link href="/case-studies">
            <button className="inline-flex items-center gap-3 bg-[#f7af00] text-black font-medium px-8 py-4 rounded-2xl hover:scale-105 transition-all duration-500">
              View Case Studies
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </Link>
        </div>
      </div>

      {/* Gradient Animation */}
      <style jsx>{`
        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          background-size: 300% 300%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  );
};

export default CaseStudies;
