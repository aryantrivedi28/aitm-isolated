'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Play } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const HowItWorks = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement | null>(null);

  const steps = [
    { image: "/Share.png", title: "Share your requirements", description: "Fill Out Our Simple Form", step: "01" },
    { image: "/match.png", title: "Get matched with pre-vetted talent", description: "AI + Human Screening", step: "02" },
    { image: "/manage.png", title: "Deliver with confidence", description: "We Manage Quality & Timelines", step: "03" },
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }
    };
    sectionRef.current?.addEventListener("mousemove", handleMouseMove);
    return () => sectionRef.current?.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section ref={sectionRef} className="relative py-16 lg:py-20 bg-[#241C15] text-white overflow-hidden">

      {/* Mouse-follow glow */}
      <div className="absolute w-[400px] h-[400px] bg-[#FFE01B]/20 rounded-full blur-3xl transition-all duration-1000 pointer-events-none"
        style={{ left: mousePosition.x - 200, top: mousePosition.y - 200 }} />

      {/* Floating Background Circles */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-[#FFE01B]/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-[#FCD34D]/20 rounded-full blur-xl animate-pulse" />

      <div className="relative z-10 max-w-6xl mx-auto px-2 sm:px-4 lg:px-6">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14 lg:mb-18">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-full mb-8 shadow-lg">
            <Sparkles className="w-5 h-5 text-[#FFE01B] animate-pulse" />
            <span className="text-sm font-semibold text-white">Simple Process</span>
          </div>

          <h2 className="font-black text-3xl sm:text-4xl md:text-5xl mb-6">
            How Finzie{" "}
            <span className="bg-gradient-to-r from-[#FFE01B] via-[#FCD34D] to-[#FFE01B] bg-clip-text text-transparent animate-gradient">
              Works
            </span>
          </h2>

          <p className="text-gray-300 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            Three simple steps to connect with India's top talent and transform your business
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-14">
          {steps.map((step, idx) => (
            <div key={idx} className="relative group cursor-pointer transition-transform duration-500 hover:scale-105">
              {/* Glow */}
              <div className="absolute inset-0 rounded-3xl bg-[#FFE01B]/10 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />

              {/* Card */}
              <div className="relative bg-[#241C15]/80 border border-[#FFE01B]/20 rounded-3xl p-4 sm:p-6 flex flex-col shadow-lg hover:shadow-2xl transition-all duration-500 backdrop-blur-md">
                
                {/* Step Number */}
                <div className="absolute top-4 left-4 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#FFE01B] flex items-center justify-center font-black text-black shadow-md z-10">
                  {step.step}
                </div>

                {/* Image */}
                <div className="relative w-full h-44 sm:h-50 rounded-lg mb-4 overflow-hidden shadow-md group-hover:shadow-lg bg-slate-50 z-0">
                  <Image src={step.image} alt={step.title} fill objectFit="contain" className="transition-transform duration-300 group-hover:scale-110" />
                </div>

                {/* Content */}
                <h3 className="text-lg sm:text-xl font-black mb-2 text-[#FFE01B]">{step.title}</h3>
                <p className="text-gray-300 font-semibold text-sm sm:text-base">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 sm:mt-20">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <Link href="/how-do-we-work" passHref>
              <Button className="inline-flex items-center bg-gradient-to-r from-[#FFE01B] to-[#FCD34D] text-black text-xl font-bold px-4 py-4 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-500">
                <Play className="mr-3 w-6 h-6" />
                How We Work?
                <ArrowRight className="ml-3 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-gray-300">
              <Sparkles className="w-4 h-4 text-[#FFE01B]" />
              <span className="text-sm font-medium">Get started in minutes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient { background-size: 300% 300%; animation: gradient 3s ease infinite; }
      `}</style>
    </section>
  );
};

export default HowItWorks;
