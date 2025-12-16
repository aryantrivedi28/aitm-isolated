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
      gradient: "from-[#f7af00] to-[#f7af00]",
      bgGradient: "bg-[#f7af00]/10",
    },
    {
      icon: Search,
      title: "End-to-End Project Delivery",
      description:
        "We own the full execution. You get outcomes without managing freelancers or agencies. Perfect for campaigns, SEO, design systems, website revamps and content pipelines.",
      gradient: "from-[#f7af00] to-[#f7af00]",
      bgGradient: "bg-[f7af00]",
    },
    {
      icon: Building,
      title: "In-house GHL Automation",
      description:
        "Our internal unit handles CRM setup, funnels, lead workflows, booking systems, nurture journeys, SaaS deployments and automation for marketing and ops. Built in-house for quality and speed.",
      gradient: "from-[#f7af00] to-[#f7af00]",
      bgGradient: "bg-[#f7af00]/10",
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
      className="relative py-20 bg-[#faf4e5] overflow-hidden"
    >

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={`text-center mb-12 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <h2 className="font-medium text-4xl sm:text-5xl text-[#050504] mb-4">
            What We{" "}
            <span className="bg-[#050504] bg-clip-text text-transparent animate-gradient">
              Do
            </span>
          </h2>

          <p className="text-[#31302f] text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
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

                <div className="relative backdrop-blur-xl bg-[#fbf5e5] rounded-3xl p-6 sm:p-8 h-full shadow-xl transition-all duration-500 group-hover:scale-105 overflow-hidden">
                  {/* Icon */}
                  <div className="relative mb-6">
                    <div className={`inline-flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r ${service.gradient} rounded-2xl shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                      <service.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#241C15]" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#241C15] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                      <Pin className="w-4 h-4 text-gray-200" />
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-xl sm:text-2xl font-medium text-[#050504] mb-3">{service.title}</h3>
                    <p className="text-[#31302f] text-sm sm:text-base leading-relaxed">{service.description}</p>

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
