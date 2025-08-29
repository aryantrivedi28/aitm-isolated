'use client';

import React, { useState } from "react";
import { Code, Megaphone, Palette, Video, Brain, Database, Shield, Headphones, TestTube, FileText, Briefcase, ArrowRight, Sparkles } from "lucide-react";

// Define a type for the categories object to allow indexing with string keys
type CategoryKey = "Development" | "Design" | "Data" | "DevOps" | "Cybersecurity" | "ITSupport" | "QA" | "Marketing" | "Content" | "Video" | "Business";

const ServiceCategories = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('Development');

  const categories: Record<CategoryKey, any> = {
    Development: {
      icon: Code,
      subcategories: ["Frontend", "Backend", "Full Stack", "Mobile App Development", "Game Development", "Blockchain", "Embedded Systems"],
      techStacks: ["React", "Vue", "Angular", "Node.js", "Python", "Java", "PHP", ".NET", "React Native", "Flutter", "Unity", "Unreal Engine", "Rust", "Solidity"]
    },
    Design: {
      icon: Palette,
      subcategories: ["UI/UX", "Graphic Design", "Web Design", "Product Design", "Motion Graphics", "3D Design"],
      techStacks: ["Figma", "Adobe XD", "Sketch", "Photoshop", "Illustrator", "After Effects", "Blender"]
    },
    Data: {
      icon: Database,
      subcategories: ["Data Science", "Data Analysis", "Machine Learning", "AI", "Big Data", "ETL"],
      techStacks: ["Python", "R", "SQL", "Tableau", "Power BI", "TensorFlow", "PyTorch", "Apache Spark"]
    },
    DevOps: {
      icon: Brain,
      subcategories: ["DevOps & Cloud Engineering", "Containerization & Orchestration", "CI/CD", "Cloud Platforms"],
      techStacks: ["Docker", "Kubernetes", "Terraform", "Jenkins", "GitHub Actions", "GitLab CI/CD", "AWS", "Azure", "Google Cloud", "DigitalOcean"]
    },
    Cybersecurity: {
      icon: Shield,
      subcategories: ["Application Security", "Penetration Testing", "Network Security"],
      techStacks: ["Kali Linux", "Metasploit", "Snyk", "Veracode", "pfSense", "Cisco ASA", "Fortinet"]
    },
    ITSupport: {
      icon: Headphones,
      subcategories: ["System Administration", "Helpdesk", "Network Administration"],
      techStacks: ["Linux", "Windows Server", "Active Directory"]
    },
    QA: {
      icon: TestTube,
      subcategories: ["Manual Testing", "Automation Testing", "Performance Testing", "Security Testing"],
      techStacks: ["Selenium", "Cypress", "Jest", "Postman", "JMeter", "TestRail", "Appium"]
    },
    Marketing: {
      icon: Megaphone,
      subcategories: ["Digital Marketing", "SEO", "Content Marketing", "Social Media Marketing", "Email Marketing", "Paid Ads"],
      techStacks: ["Google Ads", "Facebook Ads", "HubSpot", "Hootsuite", "Buffer", "Mailchimp"]
    },
    Content: {
      icon: FileText,
      subcategories: ["Copywriting", "Blog Writing", "Technical Writing", "Script Writing", "Proofreading"],
      techStacks: ["Grammarly", "Hemingway", "SurferSEO", "Google Docs"]
    },
    Video: {
      icon: Video,
      subcategories: ["Video Editing", "Animation", "YouTube Editing", "Short Videos", "Corporate Videos"],
      techStacks: ["Adobe Premiere Pro", "Final Cut Pro", "After Effects", "DaVinci Resolve"]
    },
    Business: {
      icon: Briefcase,
      subcategories: ["Virtual Assistance", "Project Management", "Customer Support", "Data Entry", "Finance & Accounting"],
      techStacks: ["Asana", "Trello", "Slack", "QuickBooks", "Excel"]
    }
  };

  return (
    <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden bg-[#fbf5e5]">

      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10 w-40 h-40 bg-[#FFE01B] rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-32 h-32 bg-[#241C15] rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Enhanced Header */}
        <div className={`text-center mb-16 sm:mb-20 lg:mb-24 transition-all duration-1000`}>
          {/* Subtitle Badge */}
          <div className="inline-flex items-center gap-3 backdrop-blur-sm bg-white/70 border border-gray-200/60 px-5 py-3 rounded-full mb-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <Sparkles className="w-5 h-5 text-[#FFE01B] animate-pulse" />
            <span className="text-sm font-semibold text-gray-700">Our Services</span>
            <div className="w-2 h-2 bg-[#FFE01B] rounded-full animate-ping" />
          </div>

          <h2
            className="font-black leading-tight mb-6 text-gray-900"
            style={{
              fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
              textShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
          >
            Expert{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-[#FFE01B] via-amber-500 to-[#FFE01B] bg-clip-text text-transparent animate-gradient bg-300%">
                Categories
              </span>
              <div className="absolute -inset-2 bg-gradient-to-r from-[#FFE01B]/20 to-amber-500/20 blur-xl -z-10 animate-pulse" />
            </span>
          </h2>

          <div className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore our comprehensive range of freelance services across multiple domains
          </div>
        </div>


        {/* Interactive Category Badges */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 md:mb-16">
          {Object.entries(categories).map(([categoryName, categoryData]) => {
            const IconComponent = categoryData.icon;
            const isActive = activeCategory === categoryName;

            return (
              <button
                key={categoryName}
                onClick={() => setActiveCategory(categoryName as CategoryKey)}
                className={`
                  group inline-flex items-center px-4 sm:px-6 md:px-8 py-3 sm:py-4 
                  rounded-2xl sm:rounded-3xl font-bold text-sm sm:text-base md:text-lg
                  transition-all duration-500 border-2 transform hover:scale-105
                  ${isActive
                    ? 'bg-[#241C15] text-white border-[#241C15] shadow-xl shadow-[#241C15]/30'
                    : 'bg-[#fbf5e5] text-gray-600 border-gray-300 hover:border-[#FFE01B] hover:text-black hover:shadow-lg'
                  }
                `}
              >
                <IconComponent className={`
                  w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 transition-all duration-300
                  ${isActive ? 'text-[#FFE01B]' : 'group-hover:text-[#241C15]'}
                `} />
                <span className="whitespace-nowrap">{categoryName}</span>

                {/* Active indicator */}
                {isActive && (
                  <div className="ml-2 w-2 h-2 bg-[#FFE01B] rounded-full animate-pulse"></div>
                )}
              </button>
            );
          })}
        </div>

        {/* Content Display Container */}
        <div className="relative">
          <div className="bg-[#fbf5e5] border-2 border-gray-300 rounded-3xl sm:rounded-4xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-xl shadow-gray-300/20 transition-all duration-700">

            {/* Category Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 sm:mb-10 md:mb-12">
              <div className="flex items-center mb-4 sm:mb-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-[#FFE01B] rounded-2xl flex items-center justify-center mr-4 shadow-lg shadow-[#FFE01B]/30">
                  {React.createElement(categories[activeCategory].icon, {
                    className: "w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#241C15]"
                  })}
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#241C15]">
                  {activeCategory}
                </h3>
              </div>

              <div className="text-sm sm:text-base text-gray-600 font-medium">
                {categories[activeCategory].subcategories.length} specializations • {categories[activeCategory].techStacks.length} technologies
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12">

              {/* Subcategories */}
              <div>
                <h4 className="text-lg sm:text-xl md:text-2xl font-black text-black mb-4 sm:mb-6 flex items-center">
                  <div className="w-1 h-6 sm:h-8 bg-[#FFE01B] rounded-full mr-3"></div>
                  Specializations
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4">
                  {categories[activeCategory].subcategories.map((sub: string, index: number) => (
                    <div
                      key={index}
                      className="group bg-[#fbf5e5] border border-gray-300 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 hover:border-[#FFE01B] hover:shadow-lg hover:shadow-[#FFE01B]/20 transition-all duration-300 hover:-translate-y-1"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <span className="text-sm sm:text-base md:text-lg font-semibold text-gray-600 group-hover:text-black transition-colors duration-300">
                        {sub}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stacks */}
              <div>
                <h4 className="text-lg sm:text-xl md:text-2xl font-black text-black mb-4 sm:mb-6 flex items-center">
                  <div className="w-1 h-6 sm:h-8 bg-[#241C15] rounded-full mr-3"></div>
                  Technologies
                </h4>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {categories[activeCategory].techStacks.map((tech: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center bg-[#241C15] text-white px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm md:text-base font-bold hover:bg-[#FFE01B] hover:text-[#241C15] transition-all duration-300 hover:scale-105 cursor-pointer shadow-lg"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .grid > div {
          animation: fadeInUp 0.5s ease-out both;
        }
        
        .flex.flex-wrap > span {
          animation: slideIn 0.4s ease-out both;
        }
      `}</style>
    </section>
  );
};

export default ServiceCategories;