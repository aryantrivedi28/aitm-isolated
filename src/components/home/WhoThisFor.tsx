'use client';

import { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";

const WhoThisIsFor = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative py-16 lg:py-20 bg-[#faf4e5] overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div
          className={`text-center mb-12 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="font-medium text-3xl sm:text-4xl md:text-5xl text-[#050504] mb-4">
            Finzie works best{" "}
            <span className="bg-[#050504] bg-clip-text text-transparent animate-gradient">
              for
            </span>
          </h2>
        </div>

        {/* Content Grid */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">

          {/* Ideal For */}
          <div className="bg-[#f0eadd] rounded-3xl p-6 sm:p-8 border-2 border-[#f0eadd]">
            <h3 className="text-lg sm:text-xl font-medium text-[#050504] mb-4">
              Ideal for
            </h3>

            <ul className="space-y-4">
              {[
                "Agencies reselling Shopify or GoHighLevel",
                "Brands doing real revenue",
                "Founders who want execution without babysitting",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#f7af00] mt-0.5" />
                  <span className="text-[#31302f] text-sm sm:text-base">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Divider / Not Ideal */}
          <div className="bg-[#f0eadd] rounded-3xl p-6 sm:p-8 border-2 border-[#f0eadd]">
            <h3 className="text-lg sm:text-xl font-medium text-[#050504] mb-4">
              Not ideal for
            </h3>

            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-[#050504] mt-0.5" />
              <p className="text-[#31302f] text-sm sm:text-base">
                Hourly billing, one-off cheap tasks, or short-term experiments
                without ownership.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gradient Animation */}
      <style jsx>{`
        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          background-size: 300% 300%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  );
};

export default WhoThisIsFor;
