"use client";

import { motion, Variants } from 'framer-motion'
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  ArrowRight,
  HelpCircle,
  ShieldCheck,
  FileText,
  Users,
  Info,
  Sparkles,
  Star,
  Send,
  ExternalLink,
} from "lucide-react";

export default function Footer() {
  // Enhanced stagger animation variants
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.8, 
        delay: i * 0.2,
        ease: [0.6, -0.05, 0.01, 0.99]
      },
    }),
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-[#241C15] via-[#2A1F17] to-[#1F1811]">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated gradient overlay */}
        <div className="absolute -inset-1 bg-gradient-to-br from-[#FFE01B]/8 via-transparent to-[#FFE01B]/4 animate-gradient opacity-60" />
        
        {/* Subtle pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(255, 224, 27, 0.1) 2px, transparent 2px),
              radial-gradient(circle at 75% 75%, rgba(255, 224, 27, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px, 40px 40px'
          }}
        />

        {/* Floating particles */}
        {[...Array(12)].map((_, i) => {
          // Use deterministic values based on index to avoid hydration mismatch
          const leftPosition = (i * 23.7 + 15.3) % 100; // Pseudo-random but deterministic
          const topPosition = (i * 17.1 + 28.9) % 100;
          const duration = 4 + ((i * 13) % 40) / 10; // 4-7.9 seconds
          const delay = (i * 7) % 20 / 10; // 0-1.9 seconds
          
          return (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#FFE01B]/20 rounded-full"
              style={{
                left: `${leftPosition}%`,
                top: `${topPosition}%`,
              }}
              animate={{
                y: [-10, 10, -10],
                opacity: [0.2, 0.6, 0.2],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration,
                repeat: Infinity,
                delay,
              }}
            />
          )
        })}

        {/* Large decorative circles */}
        <motion.div
          className="absolute -top-20 -right-20 w-40 h-40 border border-[#FFE01B]/10 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-60 h-60 border border-[#FFE01B]/5 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-4 gap-12"
        >
          {/* Enhanced Logo + description */}
          <motion.div
            custom={0}
            variants={fadeUp}
            className="md:col-span-1"
          >
            <div className="mb-6">
              <motion.h2 
                className="text-4xl font-black mb-2 text-white"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Finzie
              </motion.h2>
              {/* <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                  >
                    <Star size={16} className="text-[#FFE01B] fill-[#FFE01B]" />
                  </motion.div>
                ))}
                <span className="text-[#FFE01B] text-sm font-semibold ml-2">5.0</span>
              </div> */}
            </div>
            
            {/* <p className="text-gray-300 text-base leading-relaxed mb-6">
              Finzie helps you simplify your financial planning with smart
              analytics and tools. Join thousands of users achieving financial
              freedom.
            </p> */}
          </motion.div>

          {/* Enhanced Quick Links */}
          <motion.div
            custom={1}
            variants={fadeUp}
          >
            <h3 className="text-xl font-black mb-6 flex items-center gap-3 text-white">
              <div className="p-2 bg-[#FFE01B]/20 rounded-xl">
                <Users size={20} className="text-[#FFE01B]" />
              </div>
              Quick Links
            </h3>
            <ul className="space-y-4">
              {[
                { label: "About Us", href: "/about-us", icon: Info },
                // { label: "Features", href: "/features", icon: ArrowRight },
                // { label: "Pricing", href: "/pricing", icon: FileText },
                // { label: "Contact", href: "/contact", icon: Users },
              ].map(({ label, href, icon: Icon }, idx) => (
                <motion.li 
                  key={idx}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <a
                    href={href}
                    className="group inline-flex items-center gap-3 hover:text-[#FFE01B] transition-all duration-300 text-gray-300"
                  >
                    <div className="p-1.5 bg-white/5 rounded-lg group-hover:bg-[#FFE01B]/20 transition-colors duration-300">
                      <Icon size={16} className="group-hover:text-[#FFE01B] transition-colors duration-300" />
                    </div>
                    <span className="relative font-medium after:block after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-[#FFE01B] group-hover:after:w-full after:transition-all after:duration-300">
                      {label}
                    </span>
                    <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[#FFE01B]" />
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Resources - Commented as requested */}
          {/* <motion.div
            custom={2}
            variants={fadeUp}
          >
            <h3 className="text-xl font-black mb-6 flex items-center gap-3 text-white">
              <div className="p-2 bg-[#FFE01B]/20 rounded-xl">
                <HelpCircle size={20} className="text-[#FFE01B]" />
              </div>
              Resources
            </h3>
            <ul className="space-y-4">
              {[
                { label: "Blog", href: "#blog", icon: FileText },
                { label: "Help Center", href: "#help", icon: HelpCircle },
                { label: "FAQs", href: "#faq", icon: HelpCircle },
                { label: "Security", href: "#security", icon: ShieldCheck },
              ].map(({ label, href, icon: Icon }, idx) => (
                <motion.li 
                  key={idx}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <a
                    href={href}
                    className="group inline-flex items-center gap-3 hover:text-[#FFE01B] transition-all duration-300 text-gray-300"
                  >
                    <div className="p-1.5 bg-white/5 rounded-lg group-hover:bg-[#FFE01B]/20 transition-colors duration-300">
                      <Icon size={16} className="group-hover:text-[#FFE01B] transition-colors duration-300" />
                    </div>
                    <span className="relative font-medium after:block after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-[#FFE01B] group-hover:after:w-full after:transition-all after:duration-300">
                      {label}
                    </span>
                    <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[#FFE01B]" />
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div> */}

          {/* Enhanced Newsletter */}
          <motion.div
            custom={3}
            variants={fadeUp}
            className="md:col-span-2"
          >
            <h3 className="text-xl font-black mb-6 flex items-center gap-3 text-white">
              <div className="p-2 bg-[#FFE01B]/20 rounded-xl">
                <Sparkles size={20} className="text-[#FFE01B]" />
              </div>
              Stay Updated
            </h3>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-[#FFE01B]/30 transition-all duration-500">
              <p className="text-gray-300 text-base mb-6 leading-relaxed">
                Subscribe to our newsletter for the latest updates, tips, and exclusive insights to accelerate your financial journey.
              </p>
              
              <motion.form 
                className="space-y-4"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full px-6 py-4 rounded-xl bg-white/10 border border-white/20 focus:border-[#FFE01B] focus:outline-none text-white placeholder-gray-400 text-base backdrop-blur-sm transition-all duration-300 focus:bg-white/15"
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center">
                    <Send size={18} className="text-gray-400" />
                  </div>
                </div>
                
                <motion.button
                  type="submit"
                  className="group relative w-full bg-gradient-to-r from-[#FFE01B] to-[#FFF045] text-[#241C15] px-6 py-4 rounded-xl font-bold text-base hover:shadow-lg hover:shadow-[#FFE01B]/25 transition-all duration-300 overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FFF045] to-[#FFE01B] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative flex items-center justify-center gap-2">
                    Subscribe Now
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </motion.button>
              </motion.form>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Enhanced bottom section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        viewport={{ once: true }}
        className="relative border-t border-[#FFE01B]/20 bg-black/20 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-4 text-gray-300">
              <p className="text-base">
                © {new Date().getFullYear()} Finzie. All rights reserved.
              </p>
              
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm font-medium">Follow us:</span>
              <div className="flex space-x-3">
                {[
                  { Icon: Facebook, label: "Facebook" },
                  { Icon: Twitter, label: "Twitter" },
                  { Icon: Linkedin, label: "LinkedIn" },
                  { Icon: Instagram, label: "Instagram" },
                ].map(({ Icon, label }, idx) => (
                  <motion.a
                    key={idx}
                    href="#"
                    aria-label={label}
                    className="group relative p-3 rounded-xl bg-white/5 hover:bg-[#FFE01B]/20 transition-all duration-300 border border-white/10 hover:border-[#FFE01B]/30"
                    whileHover={{ y: -2, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="absolute inset-0 bg-[#FFE01B]/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Icon size={20} className="text-white group-hover:text-[#FFE01B] transition-colors duration-300 relative z-10" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced animation keyframes */}
      <style jsx global>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          25% { background-position: 100% 50%; }
          50% { background-position: 100% 100%; }
          75% { background-position: 0% 100%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 300% 300%;
          animation: gradientMove 20s ease infinite;
        }
      `}</style>
    </footer>
  );
}