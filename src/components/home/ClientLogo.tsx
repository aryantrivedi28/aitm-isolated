"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const ClientLogos = () => {
  const logos = [
    { src: "/logos/logos2.webp", width: 200, height: 70 },
    { src: "/logos/logos3.png", width: 100, height: 50 },
    { src: "/logos/logos4.png", width: 130, height: 60 },
    { src: "/logos/logos5.png", width: 110, height: 55 },
    { src: "/logos/logos6.webp", width: 140, height: 70 },
    { src: "/logos/logos7.png", width: 100, height: 50 },
    { src: "/logos/logos8.jpeg", width: 150, height: 75 },
  ];

  return (
    <section className="bg-[#fbf5e5] py-12">
      <div className="container mx-auto overflow-hidden">
        {/* Enhanced Header */}
        <div className={`text-center mb-12 sm:mb-18 lg:mb-20 transition-all duration-1000`}>
          {/* Subtitle Badge */}
          <div className="inline-flex items-center gap-3 backdrop-blur-sm bg-white/70 border border-gray-200/60 px-5 py-3 rounded-full mb-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <Sparkles className="w-5 h-5 text-[#FFE01B] animate-pulse" />
            <span className="text-sm font-semibold text-gray-700">Clients</span>
            <div className="w-2 h-2 bg-[#FFE01B] rounded-full animate-ping" />
          </div>

          <h2
            className="font-black leading-tight mb-6 text-gray-900"
            style={{
              fontSize: "clamp(2rem, 7vw, 3.5rem)",
              textShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
          >
            Trusted by Leading{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-[#FFE01B] via-amber-500 to-[#FFE01B] bg-clip-text text-transparent animate-gradient bg-300%">
                Brands
              </span>
              <div className="absolute -inset-2 bg-gradient-to-r from-[#FFE01B]/20 to-amber-500/20 blur-xl -z-10 animate-pulse" />
            </span>
          </h2>

          <div className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Three simple steps to connect with India's top talent and transform your business
          </div>
        </div>

        <div className="relative w-full overflow-hidden">
          <motion.div
            className="flex space-x-6 w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              duration: 20,
              ease: "linear",
            }}
          >
            {[...logos, ...logos].map((logo, index) => (
              <motion.div
                key={index}
                className="flex-shrink-0 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
              >
                <div
                  className="w-28 h-16 sm:w-36 sm:h-20 md:w-44 md:h-24 lg:w-52 lg:h-32
                  flex items-center justify-center 
                  bg-[#fbf5e5] rounded-lg shadow-sm p-2"
                >
                  <img
                    src={logo.src}
                    alt={`Client Logo ${index + 1}`}
                    width={logo.width}
                    height={logo.height}
                    className="object-contain max-w-full max-h-full opacity-90 hover:opacity-100 transition"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ClientLogos;