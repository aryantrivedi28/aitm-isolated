'use client';

import React, { useState } from "react";
import { Code, Megaphone, Palette, Video, Brain, Database, Shield, Headphones, TestTube, FileText, Briefcase, Sparkles } from "lucide-react";

type CategoryKey = "Development" | "Design" | "Data" | "DevOps" | "Cybersecurity" | "ITSupport" | "QA" | "Marketing" | "Content" | "Video" | "Business";

const ServiceCategories = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('Development');

  const categories: Partial<Record<CategoryKey, {
    icon: React.ComponentType<{ className?: string }>;
    subcategories: string[];
    techStacks: string[];
  }>> = {
    Development: { icon: Code, subcategories: ["Frontend", "Backend", "Full Stack", "Mobile App Development", "Game Development", "Blockchain", "Embedded Systems"], techStacks: ["React", "Vue", "Angular", "Node.js", "Python", "Java", "PHP", ".NET", "React Native", "Flutter", "Unity", "Unreal Engine", "Rust", "Solidity"] },
    //   Design: { icon: Palette, subcategories: ["UI/UX", "Graphic Design", "Web Design", "Product Design", "Motion Graphics", "3D Design"], techStacks: ["Figma", "Adobe XD", "Sketch", "Photoshop", "Illustrator", "After Effects", "Blender"] },
    //   Data: { icon: Database, subcategories: ["Data Science", "Data Analysis", "Machine Learning", "AI", "Big Data", "ETL"], techStacks: ["Python", "R", "SQL", "Tableau", "Power BI", "TensorFlow", "PyTorch", "Apache Spark"] },
    //   DevOps: { icon: Brain, subcategories: ["DevOps & Cloud Engineering", "Containerization & Orchestration", "CI/CD", "Cloud Platforms"], techStacks: ["Docker", "Kubernetes", "Terraform", "Jenkins", "GitHub Actions", "GitLab CI/CD", "AWS", "Azure", "Google Cloud", "DigitalOcean"] },
    //   Cybersecurity: { icon: Shield, subcategories: ["Application Security", "Penetration Testing", "Network Security"], techStacks: ["Kali Linux", "Metasploit", "Snyk", "Veracode", "pfSense", "Cisco ASA", "Fortinet"] },
    //   ITSupport: { icon: Headphones, subcategories: ["System Administration", "Helpdesk", "Network Administration"], techStacks: ["Linux", "Windows Server", "Active Directory"] },
    //   QA: { icon: TestTube, subcategories: ["Manual Testing", "Automation Testing", "Performance Testing", "Security Testing"], techStacks: ["Selenium", "Cypress", "Jest", "Postman", "JMeter", "TestRail", "Appium"] },
    Marketing: { icon: Megaphone, subcategories: ["Digital Marketing", "SEO", "Content Marketing", "Social Media Marketing", "Email Marketing", "Paid Ads"], techStacks: ["Google Ads", "Facebook Ads", "HubSpot", "Hootsuite", "Buffer", "Mailchimp"] },
    //   Content: { icon: FileText, subcategories: ["Copywriting", "Blog Writing", "Technical Writing", "Script Writing", "Proofreading"], techStacks: ["Grammarly", "Hemingway", "SurferSEO", "Google Docs"] },
    //   Video: { icon: Video, subcategories: ["Video Editing", "Animation", "YouTube Editing", "Short Videos", "Corporate Videos"], techStacks: ["Adobe Premiere Pro", "Final Cut Pro", "After Effects", "DaVinci Resolve"] },
    //   Business: { icon: Briefcase, subcategories: ["Virtual Assistance", "Project Management", "Customer Support", "Data Entry", "Finance & Accounting"], techStacks: ["Asana", "Trello", "Slack", "QuickBooks", "Excel"] },
  };

  return (
    <section className="relative py-12 lg:py-18 overflow-hidden bg-[#241C15] text-white">

      {/* Background Circles */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-32 h-32 bg-[#FFE01B]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-[#FCD34D]/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-2 sm:px-4 lg:px-6">

        {/* Header */}
        <div className="text-center mb-10 sm:mb-14 lg:mb-18">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-[#FFE01B] animate-pulse" />
            <span className="text-sm font-semibold text-white">Our Services</span>
          </div>
          <h2 className="font-black leading-tight mb-4 text-3xl sm:text-4xl md:text-5xl">
            Expert <span className="bg-gradient-to-r from-[#FFE01B] via-[#FCD34D] to-[#FFE01B] bg-clip-text text-transparent animate-gradient bg-300%">Categories</span>
          </h2>
          <p className="text-[#D1D5DB] text-base sm:text-lg max-w-3xl mx-auto">
            Explore our freelance services across multiple domains
          </p>
        </div>

        {/* Category Buttons */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-12">
          {Object.entries(categories).map(([name, data]) => {
            const Icon = data.icon;
            const isActive = activeCategory === name;
            return (
              <button
                key={name}
                onClick={() => setActiveCategory(name as CategoryKey)}
                className={`group inline-flex items-center px-6 py-3 rounded-xl font-bold text-sm sm:text-base transition-all duration-500 border-2 transform hover:scale-105
                  ${isActive
                    ? 'bg-[#FFE01B] text-[#241C15] border-[#FFE01B] shadow-lg'
                    : 'bg-[#241C15] text-[#D1D5DB] border-[#D1D5DB] hover:border-[#FFE01B] hover:text-[#FFE01B]'}`
                }
              >
                <Icon className={`w-5 h-5 mr-2 ${isActive ? 'text-[#241C15]' : 'text-[#D1D5DB] group-hover:text-[#FFE01B]'} transition-all duration-300`} />
                {name}
              </button>
            )
          })}
        </div>

        {/* Content Container */}
        <div className="bg-[#241C15] border border-[#D1D5DB] rounded-3xl p-6 sm:p-8 md:p-10 shadow-lg">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between mb-8 sm:mb-10 md:mb-12 items-center">
            <div className="flex items-center mb-4 sm:mb-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#FFE01B] rounded-xl flex items-center justify-center mr-4 shadow-lg">
                {categories[activeCategory]?.icon && React.createElement(categories[activeCategory].icon, { className: "w-7 h-7 text-[#241C15]" })}
              </div>
              <h3 className="text-3xl sm:text-4xl font-black">{activeCategory}</h3>
            </div>
            <div className="text-[#D1D5DB] text-sm sm:text-base">
              {(categories[activeCategory]?.subcategories?.length ?? 0)} specializations • {(categories[activeCategory]?.techStacks?.length ?? 0)} technologies
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12">
            {/* Subcategories */}
            <div>
              <h4 className="text-lg sm:text-xl font-black text-white mb-4 flex items-center">
                <div className="w-1 h-6 sm:h-8 bg-[#FFE01B] rounded-full mr-3"></div>Specializations
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {categories[activeCategory]?.subcategories.map((sub, idx) => (
                  <div key={idx} className="group bg-[#241C15] border border-[#D1D5DB] rounded-xl p-3 hover:border-[#FFE01B] hover:shadow-lg transition-all duration-300">
                    <span className="text-[#D1D5DB] group-hover:text-[#FFE01B] font-semibold">{sub}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stacks */}
            <div>
              <h4 className="text-lg sm:text-xl font-black text-white mb-4 flex items-center">
                <div className="w-1 h-6 sm:h-8 bg-[#FFE01B] rounded-full mr-3"></div>Technologies
              </h4>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {categories[activeCategory]?.techStacks.map((tech, idx) => (
                  <span key={idx} className="inline-flex items-center bg-[#FFE01B] text-[#241C15] px-3 py-2 rounded-xl font-bold hover:bg-[#FCD34D] hover:text-[#241C15] transition-all duration-300 cursor-pointer shadow">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes gradient {
          0%,100% {background-position:0% 50%;}
          50% {background-position:100% 50%;}
        }
        .animate-gradient { background-size: 300% 300%; animation: gradient 3s ease infinite; }
      `}</style>
    </section>
  );
};

export default ServiceCategories;
