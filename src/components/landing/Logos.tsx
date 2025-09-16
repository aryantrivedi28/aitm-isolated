// 'use client'
// import Image from 'next/image'
// import { motion, useAnimation } from 'framer-motion'
// import { Sparkles, TrendingUp } from 'lucide-react'
// import { useEffect, useState } from 'react'
// import { urlFor } from '@/src/sanity/lib/image'

// interface Logo {
//   name?: string
//   image?: { asset?: any }
// }

// export default function Logos({
//   heading,
//   logos = [],
// }: {
//   heading?: string
//   logos?: Logo[]
// }) {
//   const controls = useAnimation()

//   // ✅ store random background dot positions in state
//   const [dots, setDots] = useState<{ left: string; top: string; delay: number; duration: number }[]>([])

//   useEffect(() => {
//     setDots(
//       [...Array(6)].map(() => ({
//         left: `${Math.random() * 100}%`,
//         top: `${Math.random() * 100}%`,
//         delay: Math.random() * 2,
//         duration: 4 + Math.random() * 3,
//       }))
//     )
//   }, [])

//   // Auto-slide only if we actually have logos
//   useEffect(() => {
//     if (logos.length > 0) {
//       controls.start({
//         x: '-100%',
//         transition: {
//           x: {
//             repeat: Infinity,
//             repeatType: 'loop',
//             duration: logos.length * 3, // 3s per logo
//             ease: 'linear',
//           },
//         },
//       })
//     }
//   }, [controls, logos.length])

//   if (!logos?.length) return null

//   const formatHeading = (heading?: string) => {
//     if (!heading) return null
//     const words = heading.trim().split(' ')
//     if (words.length < 2) return heading
//     return (
//       <>
//         {words.slice(0, -2).join(' ')}{' '}
//         <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFE01B] via-[#FFF045] to-[#FFE01B]">
//           {words.slice(-2).join(' ')}
//         </span>
//       </>
//     )
//   }

//   return (
//     <section className="relative bg-[#fbf5e5] py-10 md:py-12 overflow-hidden">
//       {/* Subtle background elements */}
//       <div className="absolute inset-0 pointer-events-none">
//         <div className="absolute inset-0 bg-gradient-radial from-[#FFE01B]/3 via-transparent to-transparent opacity-60" />
//         <div
//           className="absolute inset-0 opacity-[0.01]"
//           style={{
//             backgroundImage: `
//               linear-gradient(45deg, rgba(255, 224, 27, 0.1) 1px, transparent 1px),
//               linear-gradient(-45deg, rgba(255, 224, 27, 0.1) 1px, transparent 1px)
//             `,
//             backgroundSize: '60px 60px',
//           }}
//         />
//         {/* ✅ safe dots (no hydration mismatch) */}
//         {dots.map((dot, i) => (
//           <motion.div
//             key={i}
//             className="absolute w-1 h-1 bg-[#FFE01B]/15 rounded-full"
//             style={{ left: dot.left, top: dot.top }}
//             animate={{ y: [-15, 15, -15], opacity: [0.1, 0.4, 0.1], scale: [1, 1.3, 1] }}
//             transition={{ duration: dot.duration, repeat: Infinity, delay: dot.delay }}
//           />
//         ))}
//       </div>

//       <div className="relative z-10 max-w-full mx-auto px-6">
//         {/* Heading */}
//         {heading && (
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.8 }}
//             className="text-center mb-16"
//           >
//             <motion.div
//               initial={{ opacity: 0, scale: 0.8 }}
//               whileInView={{ opacity: 1, scale: 1 }}
//               viewport={{ once: true }}
//               transition={{ delay: 0.2, duration: 0.6 }}
//               className="inline-flex items-center gap-2 bg-[#FFE01B]/10 backdrop-blur-sm border border-[#FFE01B]/20 rounded-full px-6 py-3 mb-8"
//             >
//               <TrendingUp size={18} className="text-[#241C15]" />
//               <span className="text-sm text-[#241C15] font-semibold tracking-wide">
//                 Trusted Partners
//               </span>
//             </motion.div>

//             <motion.h3
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: 0.3, duration: 0.8 }}
//               className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight text-[#241C15] mb-4"
//             >
//               {formatHeading(heading)}
//             </motion.h3>

//             <motion.p
//               initial={{ opacity: 0, y: 15 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: 0.4, duration: 0.6 }}
//               className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed"
//             >
//               Join the growing list of companies that trust us to deliver exceptional results
//             </motion.p>
//           </motion.div>
//         )}

//         {/* Logos slider */}
//         <div className="relative">
//           <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#fbf5e5] to-transparent z-10" />
//           <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#fbf5e5] to-transparent z-10" />

//           <div className="overflow-hidden">
//             <motion.div
//               className="flex items-center gap-10 md:gap-12"
//               animate={controls}
//               style={{ width: `${logos.length * 200}px` }}
//             >
//               {[...logos, ...logos].map((logo, index) => (
//                 <motion.div
//                   key={`${index}-${logo.name || 'logo'}`}
//                   className="flex-shrink-0 group"
//                   initial={{ opacity: 0, scale: 0.8 }}
//                   whileInView={{ opacity: 1, scale: 1 }}
//                   viewport={{ once: true }}
//                   transition={{ delay: (index % logos.length) * 0.1, duration: 0.6 }}
//                   whileHover={{ scale: 1.1, y: -5 }}
//                 >
//                   <div className="relative w-44 h-28 md:w-56 md:h-36 bg-[#fbf5e5] rounded-2xl shadow-sm hover:shadow-lg transition-all duration-500 border border-gray-100 group-hover:border-[#FFE01B]/30 p-4 flex items-center justify-center overflow-hidden">
//                     <div className="absolute inset-0 bg-gradient-to-br from-[#FFE01B]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

//                     {logo.image?.asset ? (
//                       <div className="relative w-full h-full filter group-hover:grayscale-0 transition-all duration-500">
//                         <Image
//                           src={urlFor(logo.image).url()}
//                           alt={logo.name || 'Logo'}
//                           fill
//                           className="object-contain p-2"
//                           sizes="(max-width: 768px) 176px, 224px"
//                         />
//                       </div>
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 group-hover:border-[#FFE01B]/30 group-hover:text-[#FFE01B] transition-all duration-500">
//                         <div className="text-center">
//                           <Sparkles size={24} className="mx-auto mb-1 opacity-50" />
//                           <span className="text-xs font-medium">Logo</span>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </motion.div>
//               ))}
//             </motion.div>
//           </div>
//         </div>

//         {/* Helper text */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           whileInView={{ opacity: 1 }}
//           viewport={{ once: true }}
//           transition={{ delay: 1, duration: 0.8 }}
//           className="text-center mt-12"
//         >
//           <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
//             <motion.span animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
//               ✨
//             </motion.span>
//             Hover over logos to pause animation
//           </p>
//         </motion.div>
//       </div>
//     </section>
//   )
// }

"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const Logos = () => {
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
            Trusted {" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-[#FFE01B] via-amber-500 to-[#FFE01B] bg-clip-text text-transparent animate-gradient bg-300%">
                Partners
              </span>
              <div className="absolute -inset-2 bg-gradient-to-r from-[#FFE01B]/20 to-amber-500/20 blur-xl -z-10 animate-pulse" />
            </span>
          </h2>

          <div className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join the growing list of companies that trust us to deliver exceptional results
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

export default Logos;