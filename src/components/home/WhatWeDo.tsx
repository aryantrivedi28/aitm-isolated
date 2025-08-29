'use client';

import { Users, Search, Building, ArrowUpRight, Sparkles, Target, Pin } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const WhatWeDo = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const sectionRef = useRef<HTMLElement | null>(null);

  const services = [
    {
      icon: Users,
      title: "Managed Freelancers",
      description:
        "End-to-end execution where we manage the freelancer, delivery, and quality. Perfect for companies who want outcomes, not micro-management.",
      gradient: "from-[#FFE01B] to-[#FCD34D]",
      bgGradient: "bg-[#FFE01B]",
    },
    {
      icon: Search,
      title: "Freelancer Hiring",
      description:
        "Need a specific skill for your team? We connect you with rigorously vetted Indian freelancers across tech, design, marketing & more.",
      gradient: "from-[#FFE01B] to-[#FCD34D]",
      bgGradient: "bg-white",
    },
    {
      icon: Building,
      title: "Full-Time Recruitment",
      description:
        "Hire tier-one Indian professionals for remote or hybrid full-time roles. Faster, cheaper & more reliable than traditional recruiting.",
      gradient: "from-[#FFE01B] to-[#FCD34D]",
      bgGradient: "bg-[#241C15]",
    },
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
      sectionRef.current.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
        sectionRef.current.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-12 sm:py-16 lg:py-18 xl:py-25 bg-gradient-to-br from-gray-50 via-[#fbf5e5] to-gray-100 overflow-hidden"
    >
      {/* Dynamic Background */}
      <div className="absolute inset-0">
        <div
          className="absolute w-96 h-96 bg-gradient-to-r from-yellow-400/10 to-amber-300/10 rounded-full blur-3xl transition-all duration-1000 ease-out"
          style={{
            left: `${mousePosition.x - 192}px`,
            top: `${mousePosition.y - 192}px`,
            opacity: hoveredCard !== null ? 0.8 : 0.4,
          }}
        />
      </div>

      {/* Floating Shapes */}
      <div className="absolute top-20 right-10 w-20 h-20 bg-gradient-to-r from-yellow-400/20 to-amber-300/20 rounded-full blur-xl animate-pulse" />
      <div
        className="absolute bottom-20 left-10 w-32 h-32 bg-gradient-to-r from-amber-400/15 to-yellow-400/15 rotate-45 blur-xl animate-pulse"
        style={{ animationDelay: "2s" }}
      />

      {/* Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div
          className={`text-center mb-16 sm:mb-20 lg:mb-24 transition-all duration-1000 ${isVisible ? "animate-[slideUp_0.8s_ease-out_forwards]" : "opacity-0 translate-y-10"
            }`}
        >
          <div className="inline-flex items-center gap-2 backdrop-blur-sm bg-white/60 border border-gray-200/50 px-4 py-2 rounded-full mb-6 shadow-lg">
            <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
            <span className="text-sm font-semibold text-gray-700">
              Our Services
            </span>
          </div>

          <h2
            className="font-black leading-tight mb-6 text-gray-900"
            style={{
              fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
              textShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
          >
            What We{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 bg-clip-text text-transparent animate-gradient bg-300%">
                Do
              </span>
              <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400/20 to-amber-500/20 blur-xl -z-10 animate-pulse" />
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our comprehensive solutions designed to connect you with
            India's finest talent
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {services.map((service, index) => (
            <div
              key={index}
              className={`group relative transition-all duration-700 ${isVisible ? "animate-[slideUp_0.8s_ease-out_forwards]" : "opacity-0 translate-y-10"
                }`}
              style={{ animationDelay: `${0.2 + index * 0.2}s` }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative h-full">
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${service.bgGradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 scale-105`}
                />

                <div className="relative backdrop-blur-xl bg-[#fbf5e5] hover:bg-white/90 rounded-3xl p-8 sm:p-10 h-full shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:scale-105 overflow-hidden">
                  {/* Icon */}
                  <div className="relative mb-8">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r ${service.gradient} rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative overflow-hidden`}
                    >
                      <service.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white relative z-10" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                      <Pin className="w-4 h-4 text-gray-700" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-6">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className={`text-center mt-16 sm:mt-20 transition-all duration-1000 ${isVisible ? "animate-[slideUp_0.8s_ease-out_1.2s_forwards]" : "opacity-0 translate-y-10"
            }`}
        >
          <div className="inline-flex items-center gap-3 backdrop-blur-sm bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200/50 px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
            <Target className="w-5 h-5 text-yellow-600 group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-yellow-800 font-semibold">
              Ready to get started? Let's connect!
            </span>
            <ArrowUpRight className="w-4 h-4 text-yellow-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
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
        .bg-300\\% {
          background-size: 300% 300%;
        }
      `}</style>
    </section>
  );
};

export default WhatWeDo;