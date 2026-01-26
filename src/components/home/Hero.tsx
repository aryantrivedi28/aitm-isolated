"use client";

import { ArrowRight, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const HEADER_HEIGHT = 32; // adjust if your header height changes

const Hero = () => {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleNavigation = (path: string) => {
    router.push(path);
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
        className="relative bg-[#fbf5e5] min-h-[100svh] flex items-center"
        style={{
          paddingTop: `calc(${HEADER_HEIGHT}px + 1.5rem)`,
          paddingBottom: "10rem",
        }}
      >
        <div className="w-full">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 xl:px-20">
            {/* ---------- HEADLINE ---------- */}
            <h1
              className={`tracking-in-expand leading-tight mb-5 transition-all duration-700 ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{
                fontSize: "clamp(1.7rem, 5vw, 3.5rem)",
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
              className={`text-[#241C15] mb-8 transition-all duration-700 delay-150 ${
                isLoaded
                  ? "opacity-90 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{
                fontSize: "clamp(1rem, 2.2vw, 1.3rem)",
                maxWidth: "760px",
                lineHeight: "1.65",
                fontWeight: 400,
              }}
            >
              We deliver fixed-scope Shopify builds, GoHighLevel systems and
              whitelabel execution — without hourly billing or freelancer risk.
              <br className="hidden sm:block" />
              Dedicated experts. Predictable outcomes. Zero chaos.
            </p>

            {/* ---------- CTA BUTTONS ---------- */}
            <div
              className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-300 ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <button
                onClick={() => handleNavigation("/find-talent")}
                className="inline-flex items-center justify-center gap-2 bg-[#f7af00] text-black rounded-xl px-6 py-4 font-medium hover:scale-[1.04] transition-transform"
              >
                See how it works
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => handleNavigation("/get-hired")}
                className="inline-flex items-center justify-center gap-2 border-2 border-[#241C15] text-[#241C15] rounded-xl px-6 py-4 font-medium hover:scale-[1.04] transition-transform"
              >
                <Play className="w-4 h-4" />
                View use cases
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
