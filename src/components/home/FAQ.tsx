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
    // {
    //   question: "What services do you specialise in?",
    //   answer:
    //     "We specialize in Development, Marketing, Design, Video Editing, and AI services, covering everything from frontend/backend to automation and content creation.",
    // },
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
    {
      question: "What Shopify services does Finzie offer?",
      answer:
        "Finzie provides end-to-end Shopify services including custom store design, theme development, app integration, performance optimization, conversion rate improvement, and ongoing store maintenance. We help brands launch, scale, and optimize high-converting Shopify stores.",
    },
    {
      question: "What is GoHighLevel and how can it help my business?",
      answer: "GoHighLevel is an all-in-one CRM and marketing automation platform that helps businesses manage leads, automate follow-ups, run campaigns, and close more sales. Finzie customizes GoHighLevel to streamline your sales funnel, automate workflows, and improve customer engagement.",
    },
    {
      question: "Can Finzie integrate Shopify with GoHighLevel?",
      answer: "Yes. We specialize in integrating Shopify with GoHighLevel to sync leads, customers, orders, and marketing automations. This allows you to track customer behavior, run personalized campaigns, and automate post-purchase follow-ups seamlessly.",
    },
    {
      question: "Is GoHighLevel suitable for small businesses and agencies?",
      answer: "Absolutely. GoHighLevel is ideal for small businesses, agencies, and growing teams. It replaces multiple tools like CRMs, email marketing platforms, SMS tools, and funnel builders—helping reduce costs while increasing efficiency.",
    },
    {
      question: "Do you provide custom automation and workflows in GoHighLevel?",
      answer: "Yes. Finzie builds custom GoHighLevel automations including lead nurturing sequences, appointment booking workflows, pipeline automation, SMS/email follow-ups, and CRM dashboards tailored to your business goals.",
    },
    {
      question: "How long does it take to build a Shopify store or set up GoHighLevel?",
      answer: "A standard Shopify store usually takes 2–4 weeks, depending on design and features. GoHighLevel setup and automation typically takes 1–2 weeks, based on workflow complexity. We always share clear timelines before starting.",
    },
    {
      question: "Do you offer ongoing support and maintenance after setup?",
      answer: "Yes. Finzie offers ongoing support, optimization, and maintenance for both Shopify and GoHighLevel. We help with updates, performance improvements, automation tweaks, and scaling strategies as your business grows.",
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };
  return (
    <section className="w-full py-16 sm:py-20 bg-[#faf4e5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-[#050504] mb-3">
            Frequently Asked{" "}
            <span className="bg-[#050504] bg-clip-text text-transparent animate-gradient">
              Questions
            </span>
          </h2>

          <p className="text-[#31302f] text-base sm:text-lg max-w-3xl mx-auto">
            Got questions? We've got answers.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openItem === index;

            return (
              <div
                key={index}
                onClick={() => toggleItem(index)}
                className={`rounded-2xl bg-[#f0eadd] transition-all duration-300 cursor-pointer ${isOpen
                    ? "shadow-lg shadow-[#f7af00]/30"
                    : "border hover:border-[#f7af00]"
                  }`}
              >
                {/* Question Row */}
                <div className="flex items-start gap-4 p-4 sm:p-5">
                  {/* Question text */}
                  <h3 className="flex-1 text-[#050504] font-medium text-base sm:text-lg md:text-xl leading-snug sm:leading-normal">
                    {faq.question}
                  </h3>

                  {/* Icon */}
                  <div
                    className={`shrink-0 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg transition-all duration-300 ${isOpen
                        ? "bg-[#f7af00] rotate-180"
                        : "bg-[#e6dfd2]"
                      }`}
                  >
                    {isOpen ? (
                      <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </div>
                </div>

                {/* Answer */}
                <div
                  className={`overflow-hidden transition-all duration-500 ease-out ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                  <div className="px-4 sm:px-5 pb-5">
                    <p className="text-[#31302f] text-sm sm:text-base leading-relaxed">
                      {faq.answer}
                    </p>
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
      `}</style>
    </section>
  );
};
export default FAQ;
