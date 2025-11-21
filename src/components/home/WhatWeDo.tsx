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
      title: "Fractional Specialists",
      description:
        "Top 1 percent talent that plugs into your workflows across growth, design, SEO, content and automation. One partner. All skills.",
      gradient: "from-[#FFE01B] to-[#FCD34D]",
      bgGradient: "bg-[#FFE01B]/10",
    },
    {
      icon: Search,
      title: "End-to-End Project Delivery",
      description:
        "We own the full execution. You get outcomes without managing freelancers or agencies. Perfect for campaigns, SEO, design systems, website revamps and content pipelines.",
      gradient: "from-[#FFE01B] to-[#FCD34D]",
      bgGradient: "bg-white/10",
    },
    {
      icon: Building,
      title: "In-house GHL Automation",
      description:
        "Our internal unit handles CRM setup, funnels, lead workflows, booking systems, nurture journeys, SaaS deployments and automation for marketing and ops. Built in-house for quality and speed.",
      gradient: "from-[#FFE01B] to-[#FCD34D]",
      bgGradient: "bg-[#241C15]/20",
    },
  ];


  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
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
      className="relative py-20 bg-[#241C15] overflow-hidden"
    >
      {/* Dynamic Background */}
      {/* <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-96 h-96 bg-gradient-to-r from-[#FFE01B]/20 to-[#FCD34D]/20 rounded-full blur-3xl transition-all duration-1000"
          style={{
            left: `${mousePosition.x - 192}px`,
            top: `${mousePosition.y - 192}px`,
            opacity: hoveredCard !== null ? 0.8 : 0.4,
          }}
        />
      </div> */}

      {/* Floating Shapes */}
      <div className="absolute top-20 right-10 w-20 h-20 bg-[#FFE01B]/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 left-10 w-32 h-32 bg-[#FFE01B]/15 rounded-full blur-xl animate-pulse delay-700" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={`text-center mb-12 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="inline-flex items-center gap-2 backdrop-blur-sm bg-[#FFE01B]/20 px-4 py-2 rounded-full mb-6 shadow-lg justify-center mx-auto">
            <Sparkles className="w-4 h-4 text-[#FFE01B] animate-pulse" />
            <span className="text-[#FFE01B] font-semibold text-sm sm:text-base">
              Our Services
            </span>
          </div>

          <h2 className="font-black text-4xl sm:text-5xl text-white mb-4">
            What We{" "}
            <span className="bg-gradient-to-r from-[#FFE01B] via-[#FCD34D] to-[#FFE01B] bg-clip-text text-transparent animate-gradient">
              Do
            </span>
          </h2>

          <p className="text-[#D1D5DB] text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            A complete marketing and creative team with zero hiring effort. Finzie gives you everything from growth strategy to content to design to automation under one flexible partner.
          </p>

        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {services.map((service, index) => (
            <div
              key={index}
              className={`group relative transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ animationDelay: `${0.2 + index * 0.2}s` }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative h-full">
                <div
                  className={`absolute inset-0 ${service.bgGradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 scale-105`}
                />

                <div className="relative backdrop-blur-xl bg-[#fbf5e5] rounded-3xl p-6 sm:p-8 h-full shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:scale-105 overflow-hidden">
                  {/* Icon */}
                  <div className="relative mb-6">
                    <div className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r ${service.gradient} rounded-2xl shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                      <service.icon className="w-8 h-8 sm:w-10 sm:h-10 text-[#241C15]" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#241C15] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                      <Pin className="w-4 h-4 text-gray-200" />
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-[#241C15] mb-3">{service.title}</h3>
                    <p className="text-[#241C15] text-sm sm:text-base leading-relaxed">{service.description}</p>

                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        {/* <div className={`text-center mt-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="inline-flex items-center gap-3 backdrop-blur-sm bg-[#FFE01B]/20 border border-[#FFE01B]/30 px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer mx-auto">
            <Target className="w-5 h-5 text-[#241C15] group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-[#241C15] font-semibold">
              Ready to get started? Let's connect!
            </span>
            <ArrowUpRight className="w-4 h-4 text-[#241C15] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
          </div>
        </div> */}
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 4s ease infinite;
        }
      `}</style>
    </section>
  );
};

export default WhatWeDo;
