'use client';

import { CheckCircle, Zap, Users, DollarSign, Brain, Target, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

const WhyUs = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const features = [
    {
      icon: CheckCircle,
      title: "Pre-vetted experts ready to jump in",
      description:
        "Only the best freelancers make the cut - our rigorous screening ensures you can access the most appropriate freelancers portfolios who excel in their craft.",
    },
    {
      icon: Brain,
      title: "AI-driven matching for a perfect fit",
      description: "Data-powered pairings deliver the exact skills you need",
    },
    {
      icon: Users,
      title: "Integrated agile teams",
      description:
        "Our freelancers seamlessly join your team in your preferred communication channels, enhancing the candidate hiring experience for freelance work.",
    },
    {
      icon: DollarSign,
      title: "Flexible pricing that adapts to your budget",
      description:
        "Get tailored freelancers quotes with no hidden fees, making Finzie the best site for hiring freelancers online.",
    },
    {
      icon: Zap,
      title: "World's first AI talent aggregator",
      description:
        "Whether it's workflow automation or a full autonomous agent, we've got the specialists to build it",
    },
    {
      icon: Target,
      title: "Matchmaking System that Ensures Exact Match",
      description:
        "Our proprietary system guarantees the perfect freelancer for your requirements, every time.",
    },
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const navigateCard = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      setCurrentIndex((prev) => (prev - 1 + features.length) % features.length);
    } else {
      setCurrentIndex((prev) => (prev + 1) % features.length);
    }
  };

  return (
    <section className="relative min-h-screen py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 bg-gradient-to-br bg-[#fbf5e5] overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/6 left-1/6 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-[#FFE01B] rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-2/3 right-1/5 w-32 h-32 sm:w-44 sm:h-44 md:w-56 md:h-56 bg-[#241C15] rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/3 right-1/3 w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 bg-[#FFE01B] rounded-full blur-3xl animate-pulse"></div>

        <div className="absolute top-0 left-0 w-full h-full">
          <svg className="w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="1.5" fill="#4B5563" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-12 sm:mb-16 md:mb-20 lg:mb-24 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <div className="inline-flex items-center gap-3 backdrop-blur-xl bg-white/95 border border-gray-300/80 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 mb-6 sm:mb-8 md:mb-10 rounded-full shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:bg-[#FFE01B]/10">
            <div className="relative">
              <div className="w-2 h-2 bg-[#FFE01B] rounded-full animate-ping"></div>
              <div className="absolute inset-0 w-2 h-2 bg-[#FFE01B] rounded-full"></div>
            </div>
            <span className="text-xs sm:text-sm md:text-base font-bold text-black">
              Why Choose Finzie
            </span>
          </div>

          <h2 className="font-black leading-tight mb-4 sm:mb-6 text-gray-900 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
            style={{
              fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
              textShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
            Why {" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 bg-clip-text text-transparent animate-gradient bg-300%">
                Us ?
              </span>
              <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400/20 to-amber-500/20 blur-xl -z-10 animate-pulse" />
            </span>
          </h2>

          <div className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-600 max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto leading-relaxed font-medium">
            Our diverse talent pool supports freelance WFH jobs and international freelance jobs,
            ensuring flexibility and access to global expertise with{" "}
            <span className="font-bold text-black relative">
              zero hassles
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#FFE01B] rounded-full"></div>
            </span>
          </div>
        </div>

        {/* Features - Desktop Grid */}
        <div className={`relative transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className={`group relative h-full transform transition-all duration-700 hover:scale-105 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
                  style={{ animationDelay: `${index * 200}ms`, transitionDelay: `${index * 100}ms` }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="absolute -inset-0.5 bg-[#241C15] rounded-3xl opacity-0 group-hover:opacity-20 blur-lg transition-all duration-500"></div>

                  <div className="relative bg-[#fbf5e5] backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 h-full flex flex-col border border-gray-300/50 shadow-xl hover:shadow-xl hover:shadow-[#FFE01B]/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden group-hover:border-[#FFE01B]/30">
                    <div className="relative mb-6 sm:mb-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-[#241C15] rounded-2xl sm:rounded-3xl group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg relative overflow-hidden group-hover:bg-[#FFE01B]">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        <Icon className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-white group-hover:text-black relative z-10 drop-shadow-lg transition-colors duration-300" />
                      </div>
                    </div>

                    <h3 className="text-lg sm:text-xl md:text-2xl font-black text-black mb-4 sm:mb-6">{feature.title}</h3>
                    <p className="text-sm sm:text-base md:text-lg text-gray-600">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Features - Mobile Carousel */}
          <div className="flex md:hidden flex-col items-center">
            <div className="w-full max-w-sm">
              <div
                className={`group relative h-full transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
                onMouseEnter={() => setHoveredIndex(currentIndex)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="absolute -inset-0.5 bg-[#FFE01B] rounded-3xl opacity-0 group-hover:opacity-20 blur-lg transition-all duration-500"></div>

                <div className="relative bg-white backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 h-full flex flex-col border border-gray-300/50 shadow-lg transition-all duration-500 hover:-translate-y-2 overflow-hidden group-hover:border-[#FFE01B]/30">
                  <div className="relative mb-6 sm:mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-[#241C15] rounded-2xl sm:rounded-3xl group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg relative overflow-hidden group-hover:bg-[#FFE01B]">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      {(() => {
                        const Icon = features[currentIndex]?.icon;
                        return Icon ? (
                          <Icon className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-white group-hover:text-black relative z-10 drop-shadow-lg transition-colors duration-300" />
                        ) : null;
                      })()}
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-xl md:text-2xl font-black text-black mb-4 sm:mb-6">{features[currentIndex].title}</h3>
                  <p className="text-sm sm:text-base md:text-lg text-gray-600">{features[currentIndex].description}</p>
                </div>
              </div>

              <div className="flex justify-center mt-6 gap-4">
                <button onClick={() => navigateCard('left')} className="p-2 sm:p-3 rounded-full bg-slate-800/80 text-white shadow-lg backdrop-blur-lg hover:bg-slate-700/80 transition-all duration-300">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={() => navigateCard('right')} className="p-2 sm:p-3 rounded-full bg-slate-800/80 text-white shadow-lg backdrop-blur-lg hover:bg-slate-700/80 transition-all duration-300">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-5deg); }
        }
        @keyframes float-particle {
          0% { transform: translateY(0px) scale(0); opacity: 0; }
          50% { transform: translateY(-30px) scale(1); opacity: 1; }
          100% { transform: translateY(-60px) scale(0); opacity: 0; }
        }
        @keyframes text-shimmer {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        @keyframes scale-x {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        .animate-float-particle { animation: float-particle 2s ease-out forwards; }
        .animate-text-shimmer { animation: text-shimmer 3s ease-in-out infinite; }
        .animate-scale-x { animation: scale-x 1s ease-out 0.5s forwards; }
      `}</style>
    </section>
  );
};

export default WhyUs;
