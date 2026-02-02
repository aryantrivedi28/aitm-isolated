"use client";

import { ArrowRight, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FormModal from "../services/form-model";

const Hero = () => {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleSeeHowItWorks = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  return (
    <>
      {/* ---------- Global Animations ---------- */}
      <style jsx global>{`
        @keyframes tracking-in-expand {
          0% {
            letter-spacing: -0.4em;
            opacity: 0;
          }
          40% {
            opacity: 0.6;
          }
          100% {
            letter-spacing: -0.025em;
            opacity: 1;
          }
        }
        .tracking-in-expand {
          animation: tracking-in-expand 0.8s cubic-bezier(0.215, 0.61, 0.355, 1)
            both;
        }
      `}</style>

      {/* ---------- HERO SECTION ---------- */}
      <section
        className="relative bg-[#fbf5e5] min-h-[70svh] sm:min-h-[90svh] flex items-start sm:items-center pt-8 sm:pt-0 overflow-hidden"
      >
        <div className="w-full">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 xl:px-20">
            {/* ---------- HEADLINE ---------- */}
            <h1
              className={`tracking-in-expand leading-tight mb-5 transition-all duration-700 ${isLoaded
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
                }`}
              style={{
                fontSize: "clamp(1.5rem, 5vw, 3rem)",
                maxWidth: "980px",
                fontWeight: 300,
              }}
            >
              <span className="block text-[#241C15] mb-2">
                Reliable{" "}
                <span className="relative inline-block">
                  <span className="relative z-10">
                    Shopify & GoHighLevel
                  </span>
                  <span className="absolute bottom-[0.12em] left-0 w-full h-[0.12em] bg-[#f7af00] -z-10" />
                </span>
              </span>

              <span className="block text-[#241C15]">
                execution for agencies and
              </span>

              <span className="block text-[#241C15]">
                growing businesses
              </span>
            </h1>

            {/* ---------- SUBTEXT ---------- */}
            <p
              className={`text-[#241C15] mb-8 transition-all duration-700 delay-150 ${isLoaded
                ? "opacity-90 translate-y-0"
                : "opacity-0 translate-y-4"
                }`}
              style={{
                fontSize: "clamp(1rem, 2.2vw, 1.2rem)",
                maxWidth: "748px",
                lineHeight: "1.65",
                fontWeight: 300,
              }}
            >
              We build fixed-scope Shopify stores and GoHighLevel systems —
              no hourly billing, no freelancer risk. Dedicated experts. Predictable outcomes. Zero chaos.
            </p>

            {/* ---------- CTA BUTTONS ---------- */}
            <div
              className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-300 ${isLoaded
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
                }`}
            >
              <button
                onClick={handleSeeHowItWorks}
                className="inline-flex items-center justify-center gap-2 bg-[#f7af00] text-black rounded-xl px-6 py-4 font-medium hover:scale-[1.04] transition-transform hover:bg-[#e69f00]"
              >
                Get started now 
                <ArrowRight className="w-5 h-5" />
              </button>

              {/* <button
                onClick={() => handleNavigation("/case-studies")}
                className="inline-flex items-center justify-center gap-2 border-2 border-[#241C15] text-[#241C15] rounded-xl px-6 py-4 font-medium hover:scale-[1.04] transition-transform hover:bg-[#241C15]/5"
              >
                <Play className="w-4 h-4" />
                View use cases
              </button> */}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- CONTACT FORM MODAL ---------- */}
      <FormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default Hero;