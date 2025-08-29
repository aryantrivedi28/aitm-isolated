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
    <section className="section-padding bg-gradient-hero relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--brand-yellow)_0%,_transparent_50%)] opacity-20"></div>
      <div className="absolute top-10 right-10 w-40 h-40 sm:w-52 sm:h-52 lg:w-64 lg:h-64 bg-brand-yellow/10 rounded-full blur-3xl animate-float"></div>
      <div
        className="absolute bottom-10 left-10 w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 bg-brand-yellow/5 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="container-custom relative z-10">
        <div className="text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Badge */}
          <div className="relative inline-flex items-center gap-2 sm:gap-3 glass-effect px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 mb-8 sm:mb-12 group hover:scale-105 transition-all duration-500 ease-spring rounded-2xl">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-brand-yellow animate-glow-pulse" />
            <span className="text-brand-yellow font-bold text-base sm:text-lg">
              Join 500+ Successful Companies
            </span>
            <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-20 rounded-2xl sm:rounded-3xl transition-opacity duration-300"></div>
          </div>

          {/* Main Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-black text-brand-white leading-snug sm:leading-tight mb-6 sm:mb-8 text-glow">
            Ready to{" "}
            <span className="gradient-text animate-gradient">Transform</span>
            <br className="hidden sm:block" />
            Your Business?
          </h2>

          {/* Description */}
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-brand-gray-300 leading-relaxed mb-8 sm:mb-12 font-medium px-2">
            Join hundreds of successful startups who've accelerated their growth with
            <span className="text-brand-yellow font-bold text-glow">
              {" "}
              Finzie's expert talent.
            </span>
          </p>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-12 sm:mb-16 max-w-3xl mx-auto px-2">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-3 sm:gap-4 text-brand-gray-300 group hover:scale-105 transition-all duration-300"
                style={{ animationDelay: `${index * 0.15 + 0.3}s` }}
              >
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-brand-yellow flex-shrink-0 group-hover:scale-125 transition-transform duration-300" />
                <span className="text-sm sm:text-base md:text-lg font-medium">
                  {benefit}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center items-center px-2">
            <Link href="/client-request">
              <Button
                className="btn-primary group inline-flex items-center justify-center text-lg sm:text-xl md:text-2xl px-8 sm:px-12 md:px-16 py-4 sm:py-6 md:py-8"
                asChild
              >
                <span>
                  Start a Project Now
                  <ArrowRight className="ml-2 sm:ml-4 w-6 sm:w-7 h-6 sm:h-7 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
              </Button>
            </Link>
            <div className="text-brand-gray-300 text-sm sm:text-base md:text-lg font-medium text-center sm:text-left">
              ✨ Free consultation • No commitment required
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BottomCTA;
