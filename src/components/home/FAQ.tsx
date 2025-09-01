"use client";

import { HelpCircle, Plus, Minus } from "lucide-react";
import { useState } from "react";

const FAQ = () => {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const faqs = [
    {
      question: "How quickly can I get matched with a freelancer?",
      answer:
        "Our AI-powered matching system typically finds and verifies the perfect freelancer for your projects within 24 hours. For urgent projects, we can also match you even faster.",
    },
    {
      question: "How do we get your freelancers?",
      answer:
        "We have a rigorous vetting process that includes technical assessments, portfolio reviews, and interviews. Our freelancers are sourced through our extensive network and undergo continuous quality monitoring.",
    },
    {
      question: "What services do you specialise in?",
      answer:
        "We specialize in Development, Marketing, Design, Video Editing, and AI services, covering everything from frontend/backend to automation and content creation.",
    },
    {
      question: "What if I'm not satisfied with the freelancer's work?",
      answer:
        "We prioritize your satisfaction. If the work doesn't meet expectations, our team will re-evaluate your needs and match you with another freelancer to ensure project success.",
    },
    {
      question: "How does your pricing work?",
      answer:
        "Our pricing is flexible and tailored to your project. You'll receive transparent freelancer quotes with no hidden fees.",
    },
    {
      question: "Do you offer ongoing support after project completion?",
      answer:
        "Yes, we provide ongoing support to ensure your project's success, from post-delivery tweaks to scaling your team with additional freelancers.",
    },
    {
      question: "What makes Finzie different from other freelance platforms?",
      answer:
        "Finzie stands out with AI-driven matching, pre-vetted talent, and end-to-end project management for an unparalleled hiring experience.",
    },
  ];

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };

  return (
    <section className="relative w-full py-20 bg-[#241C15] overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#FFE01B]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-20 w-40 h-40 bg-[#FFE01B]/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-[#FFE01B]/15 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#FFE01B]/20 px-4 py-2 rounded-full mb-6 justify-center mx-auto">
            <HelpCircle className="w-5 h-5 text-[#FFE01B] animate-pulse" />
            <span className="text-[#FFE01B] font-semibold text-sm sm:text-base">
              FAQ
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-[#FFE01B] via-[#FCD34D] to-[#FFE01B] bg-clip-text text-transparent animate-gradient">
              Questions
            </span>
          </h2>

          <p className="text-[#D1D5DB] text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            Got questions? We've got answers. Here are the most common questions about working with Finzie.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openItem === index;

            return (
              <div
                key={index}
                className={`relative bg-[#1F1610] rounded-2xl border border-[#FFE01B]/30 overflow-hidden transition-all duration-300 cursor-pointer ${
                  isOpen ? "shadow-2xl shadow-[#FFE01B]/40" : "hover:shadow-xl hover:shadow-[#FFE01B]/20 hover:-translate-y-1"
                }`}
                onClick={() => toggleItem(index)}
              >
                {/* Question */}
                <div className="flex items-center justify-between p-5">
                  <h3 className="text-white font-semibold text-lg sm:text-xl md:text-2xl">
                    {faq.question}
                  </h3>
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg transition-transform duration-300 ${
                      isOpen ? "bg-[#FFE01B] text-[#241C15] rotate-180" : "bg-[#FFE01B]/20 text-[#241C15]"
                    }`}
                  >
                    {isOpen ? <Minus className="w-4 h-4 sm:w-5 sm:h-5" /> : <Plus className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </div>
                </div>

                {/* Answer */}
                <div
                  className={`transition-all duration-500 ease-out overflow-hidden ${
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  } bg-[#241C15]/50`}
                >
                  <div className="p-5 pt-0">
                    <p className="text-[#D1D5DB] text-base sm:text-lg leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gradient Animation */}
      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 4s ease infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default FAQ;
