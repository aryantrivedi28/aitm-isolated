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
    {
      image: "/Share.png",
      title: "Share your requirements",
      description: "Fill Out Our Simple Form",
      step: "01",
    },
    {
      image: "/match.png",
      title: "Get matched with pre-vetted talent",
      description: "AI + Human Screening",
      step: "02",
    },
    {
      image: "/manage.png",
      title: "Deliver with confidence",
      description: "We Manage Quality & Timelines",
      step: "03",
    },
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    if (sectionRef.current) {
      sectionRef.current.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (sectionRef.current) {
        sectionRef.current.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-12 sm:py-16 lg:py-18 xl:py-25 bg-[#fbf5e5] overflow-hidden"
    >
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0">
        <div
          className="absolute w-[500px] h-[500px] bg-gradient-to-r from-[#FFE01B]/15 to-amber-300/15 rounded-full blur-3xl transition-all duration-1000 ease-out"
          style={{
            left: `${mousePosition.x - 250}px`,
            top: `${mousePosition.y - 250}px`,
          }}
        />
      </div>

      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(45deg, #FFE01B 1px, transparent 1px),
            linear-gradient(-45deg, #FFE01B 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          animation: 'drift 15s linear infinite'
        }} />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-gradient-to-r from-[#FFE01B]/20 to-amber-300/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-r from-amber-400/15 to-[#FFE01B]/15 rotate-45 blur-xl animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Header */}
        <div className={`text-center mb-16 sm:mb-20 lg:mb-24 transition-all duration-1000`}>
          {/* Subtitle Badge */}
          <div className="inline-flex items-center gap-3 backdrop-blur-sm bg-white/70 border border-gray-200/60 px-5 py-3 rounded-full mb-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <Sparkles className="w-5 h-5 text-[#FFE01B] animate-pulse" />
            <span className="text-sm font-semibold text-gray-700">Simple Process</span>
            <div className="w-2 h-2 bg-[#FFE01B] rounded-full animate-ping" />
          </div>

          <h2 className="font-black leading-tight mb-6 text-gray-900"
            style={{
              fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
              textShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
            How Finzie{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-[#FFE01B] via-amber-500 to-[#FFE01B] bg-clip-text text-transparent animate-gradient bg-300%">
                Works
              </span>
              <div className="absolute -inset-2 bg-gradient-to-r from-[#FFE01B]/20 to-amber-500/20 blur-xl -z-10 animate-pulse" />
            </span>
          </h2>

          <div className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Three simple steps to connect with India's top talent and transform your business
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Steps Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 relative z-10">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`text-left group cursor-pointer transition-all duration-700 hover:scale-105`}
              >
                {/* Card Container */}
                <div className="relative h-full">
                  {/* Glow Effect */}
                  <div className={`absolute inset-0 bg-white/20 rounded-3xl blur-xl transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:scale-110`} />

                  {/* Main Card */}
                  <div className={`relative h-full backdrop-blur-xl border rounded-3xl p-6 sm:p-8 flex flex-col transition-all duration-500 bg-[#fbf5e5] border-gray-300/50 hover:bg-white/90 shadow-lg hover:shadow-2xl`}>

                    {/* Step Number */}
                    <div className={`absolute top-4 left-4 inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg text-lg sm:text-xl font-black transition-all duration-500 overflow-hidden bg-white text-gray-600 group-hover:bg-[#FFE01B] group-hover:text-black shadow-md group-hover:shadow-xl`}>
                      <span className="relative z-10">{step.step}</span>
                    </div>

                    {/* Image */}
                    <div className={`relative w-full h-48 sm:h-56 rounded-lg mb-4 transition-all duration-500 overflow-hidden bg-white shadow-md group-hover:shadow-lg`}>
                      <Image
                        src={step.image}
                        alt={step.title}
                        layout="fill"
                        objectFit="contain" // 'cover' से 'contain' में बदला गया
                        className="transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>

                    {/* Content */}
                    <h3 className={`text-xl sm:text-2xl font-black mb-2 transition-all duration-300 text-black group-hover:text-gray-900`}>
                      {step.title}
                    </h3>

                    <p className={`text-sm sm:text-base font-semibold transition-all duration-300 text-gray-600`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced CTA Section */}
          <div className={`text-center mt-16 sm:mt-20 transition-all duration-1000`}>
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <Link href="/how-do-we-work" passHref>
                <Button
                  asChild
                  className="relative inline-flex items-center justify-center group bg-gradient-to-r from-[#FFE01B] to-[#FFE01B] hover:from-[#FCD34D] hover:to-[#FCD34D] text-black font-bold text-lg sm:text-xl px-8 sm:px-10 py-4 sm:py-5 rounded-full shadow-2xl hover:shadow-[#FFE01B]/30 transition-all duration-500 hover:scale-105 overflow-hidden"
                >
                  {/* The <a> tag is removed from here */}
                  <span className="relative flex items-center">
                    <Play className="mr-3 w-5 h-5" />
                    How We Work?
                    <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Button>
              </Link>

              <div className="flex items-center gap-2 text-gray-600">
                <Sparkles className="w-4 h-4 text-[#FFE01B]" />
                <span className="text-sm font-medium">Get started in minutes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes drift {
          0% { transform: translateX(0) translateY(0); }
          25% { transform: translateX(10px) translateY(-10px); }
          50% { transform: translateX(-5px) translateY(-20px); }
          75% { transform: translateX(-10px) translateY(-10px); }
          100% { transform: translateX(0) translateY(0); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 300% 300%;
          animation: gradient 3s ease infinite;
        }
        .bg-300\\% {
          background-size: 300% 300%;
        }
      `}</style>
    </section>
  );
};

export default HowItWorks;