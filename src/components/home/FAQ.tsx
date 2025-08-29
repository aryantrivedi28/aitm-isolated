'use client';

import { HelpCircle, Plus, Minus, ArrowRight, Sparkles, MessageCircle } from "lucide-react";
import { useState } from "react";

const FAQ = () => {
  const [openItem, setOpenItem] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How quickly can I get matched with a freelancer?",
      answer: "Our AI-powered matching system typically finds and verifies the perfect freelancer for your international freelance jobs within 24 hours. For urgent projects, we can also match you even faster.",
      category: "Speed"
    },
    {
      question: "How do we get your freelancers?",
      answer: "We have a rigorous vetting process that includes technical assessments, portfolio reviews, and interviews. Our freelancers are sourced through our extensive network and undergo continuous quality monitoring.",
      category: "Quality"
    },
    {
      question: "What services do you specialise in?",
      answer: "We specialize in Development (frontend, backend, database), Marketing (digital marketing, SEO, content), Design (UI/UX, graphics, presentations), Video Editing (motion graphics, animations), and AI services (automation, agent creation).",
      category: "Services"
    },
    {
      question: "What if I'm not satisfied with the freelancer's work?",
      answer: "We prioritize your satisfaction. If the work doesn't meet expectations, Finzie's team will re-evaluate your needs and match you with another freelancer to ensure project success.",
      category: "Guarantee"
    },
    {
      question: "How does your pricing work?",
      answer: "Our pricing is flexible and tailored to your project. You'll receive transparent freelancers quotes based on the scope of freelance work, with no hidden fees.",
      category: "Pricing"
    },
    {
      question: "Do you offer ongoing support after project completion?",
      answer: "Yes, Finzie provides ongoing support to ensure your project's success, from post-delivery tweaks to scaling your team with additional freelancers required.",
      category: "Support"
    },
    {
      question: "What makes Finzie different from other freelance platforms?",
      answer: "Finzie stands out as the easiest platform for hiring freelancers, combining AI-driven matching, pre-vetted talent, and end-to-end project management for an unparalleled candidate hiring experience.",
      category: "Advantage"
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };

  return (
    <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 overflow-hidden bg-gradient-to-br from-gray-50 via-[#fbf5e5] to-gray-100">

      {/* Sophisticated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#FFE01B] rounded-full blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-32 right-20 w-40 h-40 bg-[#FFE01B] rounded-full blur-3xl opacity-5 animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-[#FCD34D] rounded-full blur-2xl opacity-15 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Enhanced Header */}
        <div className={`text-center mb-16 sm:mb-20 lg:mb-24 transition-all duration-1000`}>
          {/* Subtitle Badge */}
          <div className="inline-flex items-center gap-3 backdrop-blur-sm bg-white/70 border border-gray-200/60 px-5 py-3 rounded-full mb-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <HelpCircle className="w-5 h-5 text-[#FFE01B] animate-pulse" />
            <span className="text-sm font-semibold text-gray-700">FAQ</span>
            <div className="w-2 h-2 bg-[#FFE01B] rounded-full animate-ping" />
          </div>

          <h2
            className="font-black leading-tight mb-6 text-gray-900"
            style={{
              fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
              textShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
          >
            Frequently Asked{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-[#FFE01B] via-amber-500 to-[#FFE01B] bg-clip-text text-transparent animate-gradient bg-300%">
                Questions
              </span>
              <div className="absolute -inset-2 bg-gradient-to-r from-[#FFE01B]/20 to-amber-500/20 blur-xl -z-10 animate-pulse" />
            </span>
          </h2>

          <div className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Got questions? We've got answers. Here are the most common questions about working with Finzie
          </div>
        </div>

        {/* Modern FAQ Accordion */}
        <div className="max-w-4xl mx-auto mb-12 sm:mb-16 md:mb-20">
          <div className="space-y-4 sm:space-y-6">
            {faqs.map((faq, index) => {
              const isOpen = openItem === index;
              const isHovered = hoveredIndex === index;

              return (
                <div
                  key={index}
                  className={`
                    group relative bg-[fbf5e5] rounded-2xl sm:rounded-3xl border-2 transition-all duration-300 cursor-pointer overflow-hidden
                    ${isOpen
                      ? 'border-[#FFE01B] shadow-2xl shadow-[#FFE01B]/20'
                      : 'border-gray-300 hover:border-[#FFE01B] hover:shadow-xl hover:shadow-gray-300/20 hover:-translate-y-1'
                    }
                  `}
                  onClick={() => toggleItem(index)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >

                  {/* Background Glow Effect */}
                  {isOpen && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FFE01B]/5 via-[#FCD34D]/10 to-[#FFE01B]/5 rounded-2xl sm:rounded-3xl"></div>
                  )}

                  {/* Question Header */}
                  <div className="relative z-10 flex items-center justify-between p-3 sm:p-4 md:p-5">
                    <div className="flex items-start gap-4 sm:gap-6 flex-1 pr-4">

                      {/* Category Badge */}
                      <div className={`
                        hidden sm:flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl transition-all duration-500 flex-shrink-0
                        ${isOpen
                          ? 'bg-[#FFE01B] text-[#241C15] shadow-lg shadow-[#FFE01B]/30'
                          : 'bg-[#241C15] text-white group-hover:bg-[#FFE01B] group-hover:text-[#241C15]'
                        }
                      `}>
                        <span className="text-xs md:text-sm font-black">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>

                      <h3 className={`
                        text-lg sm:text-xl md:text-2xl lg:text-3xl font-black leading-tight transition-all duration-300
                        ${isOpen ? 'text-[#241C15]' : 'text-black group-hover:text-[#241C15]'}
                      `}>
                        {faq.question}
                      </h3>
                    </div>

                    {/* Animated Toggle Icon */}
                    <div className={`
                      flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl transition-all duration-500 flex-shrink-0
                      ${isOpen
                        ? 'bg-[#241C15] text-[#FFE01B] rotate-180 scale-110'
                        : 'bg-gray-300 text-gray-600 group-hover:bg-[#FFE01B] group-hover:text-[#241C15]'
                      }
                    `}>
                      {isOpen ? (
                        <Minus className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                      ) : (
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                      )}
                    </div>
                  </div>

                  {/* Answer Content with Smooth Animation */}
                  <div className={`
                    overflow-hidden transition-all duration-700 ease-out
                    ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                  `}>
                    <div className="px-3 sm:px-4 md:px-5 pb-3 sm:pb-4 md:pb-5">
                      <div className="ml-0 sm:ml-16 md:ml-18">
                        <div className="w-full h-px bg-gray-300 mb-4 sm:mb-6"></div>
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed font-medium">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Active Bottom Border */}
                  <div className={`
                    absolute bottom-0 left-0 w-full h-1 bg-[#FFE01B] rounded-full transition-all duration-500
                    ${isOpen ? 'scale-x-100' : 'scale-x-0'}
                  `}></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(255, 224, 27, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(255, 224, 27, 0.5);
          }
        }
        
        .faq-item {
          animation: fadeInUp 0.6s ease-out both;
        }
        
        .faq-item:nth-child(1) { animation-delay: 0.1s; }
        .faq-item:nth-child(2) { animation-delay: 0.2s; }
        .faq-item:nth-child(3) { animation-delay: 0.3s; }
        .faq-item:nth-child(4) { animation-delay: 0.4s; }
        .faq-item:nth-child(5) { animation-delay: 0.5s; }
        .faq-item:nth-child(6) { animation-delay: 0.6s; }
        .faq-item:nth-child(7) { animation-delay: 0.7s; }
        
        .answer-content {
          animation: slideDown 0.5s ease-out;
        }
      `}</style>
    </section>
  );
};

export default FAQ;