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
        "Booking and calendar system",
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

      <section className="services-section relative py-12 lg:py-18 overflow-hidden bg-[#f0eadd] text-[#241C15]">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-8 sm:mb-10 lg:mb-12">
            <h2 className="font-black leading-tight mb-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#241C15]">
              Expert <span className="bg-[#050504] bg-clip-text text-transparent animate-gradient">Categories</span>
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
                  className={`group inline-flex items-center px-4 sm:px-6 py-3 rounded-xl font-bold text-sm sm:text-base transition-all duration-500 transform hover:scale-105 hover:shadow-lg
                    ${isActive
                      ? 'bg-[#f0eadd] text-[#241C15] border-[#f0eadd] shadow-lg'
                      : 'bg-[#faf4e5] text-[#241C15]/70 hover:text-[#241C15]'
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
          <div className="bg-[#f0eadd] rounded-3xl p-4 sm:p-4 md:p-6 lg:p-8 transition-all duration-500">
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

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 sm:gap-10 md:gap-12">
              {/* Subcategories */}
              <div>
                <h4 className="text-lg sm:text-xl font-black text-[#241C15] mb-5 flex items-center">
                  <div className="w-1 h-6 sm:h-8 bg-[#FFE01B] rounded-full mr-3"></div>
                  Specializations
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4">
                  {categories[activeCategory]?.subcategories.map((sub, idx) => (
                    <span
                      key={idx}
                      className="relative text-[#241C15] font-semibold text-sm sm:text-base cursor-pointer bg-[#faf4e5] py-4 rounded-xl flex item-center justify-center"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            </div>



          </div>

        </div>
      </section>
    </>
  );
};

export default ServiceCategories;
