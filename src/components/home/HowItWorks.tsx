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
    { image: "/Share.png", title: "Tell us your goal", description: "SEO or content or Shopify or automation or design. We understand your scope in a short call.", step: "01" },
    { image: "/match.png", title: "We assemble your agile team", description: "A mix of fractional specialists and in-house experts based on your exact needs.", step: "02" },
    { image: "/manage.png", title: "Begin with a small starter project", description: "Low risk. Clear scope. Quick delivery. If you like the output, we scale into larger monthly work.", step: "03" },
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
    <section ref={sectionRef} className="relative py-16 lg:py-20 bg-[#faf4e5] text-[#050504] overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-2 sm:px-4 lg:px-6">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14 lg:mb-18">
          <h2 className="font-medium text-3xl sm:text-4xl md:text-5xl mb-6">
            How Finzie{" "}
            <span className="bg-[#050504] bg-clip-text text-transparent animate-gradient">
              Works
            </span>
          </h2>

          <p className="text-[#31302f] text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            Three simple steps to connect with India's top talent and transform your business
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-14">
          {steps.map((step, idx) => (
            <div key={idx} className="relative">
              {/* Glow */}
              <div className="absolute inset-0 rounded-3xl bg-[#FFE01B]/10 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />

              {/* Card */}
              <div className="relative bg-[#fbf5e5] rounded-3xl p-4 sm:p-6 flex flex-col shadow-xl border-2 hover:border-[#f7af00] transition-all duration-500 backdrop-blur-md">
                
                {/* Step Number */}
                <div className="absolute top-4 left-4 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#f7af00] flex items-center justify-center font-normal text-black shadow-md z-10">
                  {step.step}
                </div>

                {/* Image */}
                <div className="relative w-full h-44 sm:h-50 rounded-lg mb-4 overflow-hidden bg-[#fbf5e5] z-0">
                  <Image src={step.image} alt={step.title} fill objectFit="contain" className="transition-transform duration-300 group-hover:scale-110" />
                </div>

                {/* Content */}
                <h3 className="text-lg sm:text-xl font-medium mb-2 text-[#050504]">{step.title}</h3>
                <p className="text-[#31302f] font-normal text-sm sm:text-base">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 sm:mt-20">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <Link href="/how-do-we-work" passHref>
              <Button className="inline-flex items-center bg-[#f7af00] text-black text-xl font-medium px-4 py-6 rounded-2xl hover:scale-105 transition-all duration-500">
                <Play className="mr-3 w-6 h-6" />
                How We Work?
                <ArrowRight className="ml-3 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
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
