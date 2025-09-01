'use client';

import { CheckCircle, Zap, Users, DollarSign, Brain, Target, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState, useEffect } from "react";

const WhyUs = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const features = [
    { icon: CheckCircle, title: "Pre-vetted experts ready to jump in", description: "Only the best freelancers make the cut - our rigorous screening ensures you can access the most appropriate freelancers portfolios who excel in their craft." },
    { icon: Brain, title: "AI-driven matching for a perfect fit", description: "Data-powered pairings deliver the exact skills you need" },
    { icon: Users, title: "Integrated agile teams", description: "Our freelancers seamlessly join your team in your preferred communication channels, enhancing the candidate hiring experience for freelance work." },
    { icon: DollarSign, title: "Flexible pricing that adapts to your budget", description: "Get tailored freelancers quotes with no hidden fees, making Finzie the best site for hiring freelancers online." },
    { icon: Zap, title: "World's first AI talent aggregator", description: "Whether it's workflow automation or a full autonomous agent, we've got the specialists to build it" },
    { icon: Target, title: "Matchmaking System that Ensures Exact Match", description: "Our proprietary system guarantees the perfect freelancer for your requirements, every time." },
  ];

  useEffect(() => { setIsVisible(true); }, []);

  const navigateCard = (direction: 'left' | 'right') => {
    setCurrentIndex(prev => direction === 'left' ? (prev - 1 + features.length) % features.length : (prev + 1) % features.length);
  };

  return (
    <section className="relative min-h-screen py-12 bg-[#241C15] overflow-hidden text-white">
      {/* Floating background circles */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-[#FFE01B]/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute top-2/3 right-1/4 w-32 h-32 bg-[#FFE01B]/10 rounded-full blur-3xl animate-float-delayed"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-2 sm:px-4 lg:px-6">
        {/* Header */}
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full mb-6 shadow-lg">
            <div className="w-2 h-2 bg-[#FFE01B] rounded-full animate-ping"></div>
            <span className="text-sm font-bold text-white">Why Choose Finzie</span>
          </div>
          <h2 className="font-black text-3xl sm:text-4xl md:text-5xl mb-4 text-start">
            Why <span className="bg-gradient-to-r from-[#FFE01B] via-amber-400 to-[#FFE01B] bg-clip-text text-transparent animate-gradient">Us?</span>
          </h2>
          <p className="text-gray-300 max-w-6xl mr-64 leading-relaxed font-medium text-start">
            Our diverse talent pool supports freelance WFH jobs and international freelance jobs, ensuring flexibility and access to global expertise with <span className="font-bold text-[#FFE01B]">zero hassles</span>.
          </p>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="group relative h-full transform transition-all duration-500 hover:scale-105">
                <div className="relative bg-[#241C15]/80 rounded-3xl p-6 flex flex-col border border-[#FFE01B]/20 shadow-lg hover:shadow-2xl transition-all duration-500">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-[#FFE01B] rounded-xl mb-6">
                    <Icon className="w-6 h-6 text-black" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black mb-2">{feature.title}</h3>
                  <p className="text-gray-300 text-sm sm:text-base">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden flex flex-col items-center">
          <div className="w-full max-w-sm relative">
            <div className="relative bg-[#241C15]/80 rounded-3xl p-6 flex flex-col border border-[#FFE01B]/20 shadow-lg transition-all duration-500">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FFE01B] rounded-xl mb-6">
                {features[currentIndex].icon && React.createElement(features[currentIndex].icon, { className: "w-8 h-8 text-black" })}
              </div>
              <h3 className="text-lg sm:text-xl font-black mb-2">{features[currentIndex].title}</h3>
              <p className="text-gray-300 text-sm sm:text-base">{features[currentIndex].description}</p>
            </div>

            <div className="flex justify-center mt-6 gap-4">
              <button onClick={() => navigateCard('left')} className="p-2 rounded-full bg-[#FFE01B]/20 text-black shadow-lg hover:bg-[#FFE01B]/40 transition-all duration-300">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={() => navigateCard('right')} className="p-2 rounded-full bg-[#FFE01B]/20 text-black shadow-lg hover:bg-[#FFE01B]/40 transition-all duration-300">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        @keyframes float-delayed { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-30px); } }
        @keyframes gradient { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        .animate-gradient { background-size: 300% 300%; animation: gradient 3s ease infinite; }
      `}</style>
    </section>
  );
};

export default WhyUs;
