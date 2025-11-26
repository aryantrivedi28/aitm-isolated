'use client';

import React, { useState } from "react";
import { Code, Megaphone, Palette, Video, Brain, Database, Shield, Headphones, TestTube, FileText, Briefcase, Sparkles, Settings } from "lucide-react";

type CategoryKey =
  | "Design & UX/UI"
  | "Marketing & Growth"
  | "Shopify"
  | "Video & Content"
  | "GHL Automation";

const ServiceCategories = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("Marketing & Growth");

  const categories: Record<CategoryKey, {
    icon: React.ComponentType<{ className?: string }>;
    subcategories: string[];
    techStacks?: string[];
  }> = {
    "Marketing & Growth": {
      icon: Megaphone,
      subcategories: [
        "Performance marketing",
        "SEO",
        "Email and lifecycle",
        "Funnel design",
        "Copywriting",
        "Growth strategy",
        "Quarter plans",
        "Fractional CMO"
      ]
    },

    "Design & UX/UI": {
      icon: Palette,
      subcategories: [
        "UI design",
        "UX flows",
        "Wireframes",
        "Brand identity",
        "Pitch decks",
        "Ad creatives",
        "Web design",
        "Marketing collateral"
      ]
    },

    Shopify: {
      icon: Settings,
      subcategories: [
        "Theme customisation",
        "Liquid changes",
        "CRO",
        "Page redesign",
        "Speed optimisation",
        "Store setup",
        "Conversions audit"
      ]
    },

    "Video & Content": {
      icon: Video,
      subcategories: [
        "Short form edits",
        "Ads and reels",
        "Long form videos",
        "Brand storytelling",
        "YouTube edits",
        "Social content",
        "Creative direction"
      ]
    },

    "GHL Automation": {
      icon: Settings,
      subcategories: [
        "CRM structure",
        "Lead routing",
        "Funnels and workflows",
        "Bookings and calendar systems",
        "Membership or SaaS setup",
        "Internal dashboards"
      ]
    }
  };

  return (
    <>
      <style jsx global>{`

        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .animate-gradient { 
          background-size: 300% 300%; 
          animation: gradient 3s ease infinite; 
        }
        
        .animate-pulse-slow { 
          animation: pulse 3s ease-in-out infinite; 
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      <section className="services-section relative py-12 lg:py-18 overflow-hidden bg-[#fbf5e5] text-[#241C15]">

        {/* Background Circles */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-10 w-32 h-32 bg-[#FFE01B]/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 left-10 w-40 h-40 bg-[#FCD34D]/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-8 sm:mb-10 lg:mb-12">
            <div className="inline-flex items-center gap-2 bg-[#241C15] backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-md">
              <Sparkles className="w-4 h-4 text-[#FFE01B] animate-pulse" />
              <span className="text-sm font-semibold text-[#fbf5e5]">Our Services</span>
            </div>
            <h2 className="font-black leading-tight mb-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#241C15]">
              Expert <span className="bg-gradient-to-r from-[#FFE01B] via-[#FCD34D] to-[#FFE01B] bg-clip-text text-transparent animate-gradient">Categories</span>
            </h2>
            <p className="text-[#241C15]/70 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto font-medium">
              Explore our freelance services across multiple domains
            </p>
          </div>

          {/* Category Buttons */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-4">
            {Object.entries(categories).map(([name, data]) => {
              const Icon = data.icon
              const isActive = activeCategory === name
              return (
                <button
                  key={name}
                  onClick={() => setActiveCategory(name as CategoryKey)}
                  className={`group inline-flex items-center px-4 sm:px-6 py-3 rounded-xl font-bold text-sm sm:text-base transition-all duration-500 border-2 transform hover:scale-105 hover:shadow-lg
                    ${isActive
                      ? 'bg-[#FFE01B] text-[#241C15] border-[#FFE01B] shadow-lg'
                      : 'bg-white text-[#241C15]/70 border-[#241C15]/20 hover:border-[#FFE01B] hover:text-[#241C15]'
                    }`
                  }
                  style={{ fontWeight: '600' }}
                >
                  <Icon className={`w-5 h-5 mr-2 ${isActive ? 'text-[#241C15]' : 'text-[#241C15]/70 group-hover:text-[#FFE01B]'} transition-all duration-300`} />
                  {name}
                </button>
              )
            })}
          </div>

          {/* Content Container */}
          <div className="bg-[#fbf5e5] rounded-3xl p-4 sm:p-4 md:p-6 lg:p-8 transition-all duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 md:mb-8 gap-4">
              <div className="flex items-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#FFE01B] rounded-xl flex items-center justify-center mr-4 shadow-lg animate-float">
                  {categories[activeCategory]?.icon &&
                    (() => {
                      const Icon = categories[activeCategory].icon
                      return <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-[#241C15]" />
                    })()
                  }
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#241C15]">
                  {activeCategory}
                </h3>
              </div>
              <div className="text-[#241C15]/60 text-xs sm:text-sm md:text-base font-medium">
                {(categories[activeCategory]?.subcategories?.length ?? 0)} specializations • {(categories[activeCategory]?.techStacks?.length ?? 0)} technologies
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12">
              {/* Subcategories */}
              <div>
                <h4 className="text-lg sm:text-xl font-black text-[#241C15] mb-5 flex items-center">
                  <div className="w-1 h-6 sm:h-8 bg-[#FFE01B] rounded-full mr-3"></div>
                  Specializations
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {categories[activeCategory]?.subcategories.map((sub, idx) => (
                    <div
                      key={idx}
                      className="group bg-[#241C15] border-2 border-[#241C15]/10 rounded-xl p-4 hover:border-[#FFE01B] hover:shadow-md hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                    >
                      <span className="text-[#fbf5e5] group-hover:text-[#fbf5e5] font-semibold text-sm sm:text-base">
                        {sub}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stacks */}
              {/* <div>
                <h4 className="text-lg sm:text-xl font-black text-[#241C15] mb-5 flex items-center">
                  <div className="w-1 h-6 sm:h-8 bg-[#FFE01B] rounded-full mr-3"></div>
                  Technologies
                </h4>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {(categories[activeCategory]?.techStacks ?? []).map((tech, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center bg-[#FFE01B] text-[#241C15] px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm hover:bg-[#FCD34D] hover:scale-105 transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg"
                      style={{ fontWeight: '600' }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div> */}
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default ServiceCategories;
