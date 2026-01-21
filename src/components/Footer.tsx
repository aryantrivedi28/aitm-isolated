"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import {
  Twitter,
  Linkedin,
  Users,
  Info,
  Sparkles,
  ArrowRight,
  Send,
  ExternalLink,
  Sun,
  Moon,
  FileText,
  Instagram,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { FaThreads } from "react-icons/fa6";


export default function Footer() {
  const pathname = usePathname() || "";
  if (pathname.startsWith("/h")) return null;
  if (pathname.startsWith("/case-studies/") && pathname !== "/case-studies") return null;
  if (pathname.startsWith("/form/") && pathname !== "/form") return null;
  if (pathname.startsWith("/find-talent/") && pathname !== "/find-talent") return null;
  if (pathname.startsWith("/get-hired/") && pathname !== "/get-hired") return null;
  if (pathname.startsWith("/freelancer/") && pathname !== "/freelancer") return null;



    /* ----------------------------------
     NEW: Landing page detection
  -----------------------------------*/
  const LANDING_SLUGS = ["gohighlevel-crm", "shopify", "seo", "webflow", "ai"];

  const isLandingPage =
    pathname.split("/").length === 2 &&
    LANDING_SLUGS.includes(pathname.replace("/", ""));

  if (isLandingPage) return null;


  const [theme, setTheme] = useState<"light" | "dark">("light");
  const isDark = theme === "dark";
  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: i * 0.2, ease: [0.6, -0.05, 0.01, 0.99] },
    }),
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
  };

  const colors = {
    bgGradient: isDark
      ? "from-[#241C15] via-[#2A1F17] to-[#1F1811]"
      : "from-[#f0eadd] via-[#FFF5D1] to-[#FFECC2]",
    text: isDark ? "text-white" : "text-gray-900",
    secondaryText: isDark ? "text-gray-300" : "text-gray-700",
    accent: "#f7af00",
    inputBg: isDark ? "bg-white/10" : "bg-gray-100/70",
    inputText: isDark ? "text-white" : "text-gray-900",
    inputBorder: isDark ? "border-white/20" : "border-gray-300/50",
    buttonText: isDark ? "#241C15" : "#FFF9E5",
    buttonBgStart: isDark ? "#FFE01B" : "#FFCC47",
    buttonBgEnd: isDark ? "#FFF045" : "#FFD966",
  };

  const quickLinks = [
    { label: "About Us", href: "/about-us", icon: Info },
    { label: "Case Studies", href: "/case-studies", icon: FileText },
    { label: "Find Talent", href: "/find-talent", icon: Users },
    { label: "Get Hired", href: "/get-hired", icon: Sparkles },
  ];

  const socialLinks = [
    { Icon: Twitter, label: "Twitter", link: "https://x.com/getfinzie" },
    { Icon: Linkedin, label: "LinkedIn", link: "https://www.linkedin.com/company/finzieai" },
    { Icon: Instagram, label: "Instagram", link: "https://www.instagram.com/finzie.co" },
    { Icon: FaThreads, label: "Threads", link: "https://www.threads.com/@finzie.co?hl=en"}
  ];

  return (
    <footer className={`relative overflow-hidden bg-[#f0eadd]`}>
      {/* Background particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={`absolute -inset-1 bg-gradient-to-br from-[${colors.accent}]/8 via-transparent to-[${colors.accent}]/4 animate-gradient opacity-60`}
        />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(255, 224, 27, 0.1) 2px, transparent 2px),
              radial-gradient(circle at 75% 75%, rgba(255, 224, 27, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px, 40px 40px",
          }}
        />
        {[...Array(12)].map((_, i) => {
          const left = (i * 23.7 + 15.3) % 100;
          const top = (i * 17.1 + 28.9) % 100;
          const duration = 4 + ((i * 13) % 40) / 10;
          const delay = ((i * 7) % 20) / 10;
          return (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 bg-[${colors.accent}]/20 rounded-full`}
              style={{ left: `${left}%`, top: `${top}%` }}
              animate={{ y: [-10, 10, -10], opacity: [0.2, 0.6, 0.2], scale: [1, 1.3, 1] }}
              transition={{ duration, repeat: Infinity, delay }}
            />
          );
        })}
      </div>

      {/* Top Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-start md:items-center mb-4">
          <h2 className={`text-2xl lg:text-5xl font-medium ${colors.text}`}>Finzie</h2>
          {/* <button
            onClick={toggleTheme}
            className={`p-2 rounded-full border border-[${colors.accent}]/40 hover:bg-[${colors.accent}]/20 transition-colors`}
          >
            {isDark ? <Sun size={20} className="text-white" /> : <Moon size={20} className="text-gray-900" />}
          </button> */}
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-4 gap-12"
        >
          {/* Logo + description */}
          <motion.div custom={0} variants={fadeUp} className="md:col-span-1">
            <p className={`${colors.secondaryText} text-base leading-relaxed mb-6`}>
               Finzie is a specialised execution partner for Shopify, GoHighLevel and whitelabel agency delivery
            </p>
            {/* Social Links */}
            <div className="flex gap-4 mt-8 ml-4">
              {socialLinks.map(({ Icon, label, link }, idx) => (
                <motion.a
                  key={idx}
                  href={link}
                  aria-label={label}
                  className={`group relative p-3 rounded-xl ${isDark ? "bg-white/5" : "bg-gray-200/40"
                    } hover:bg-[${colors.accent}]/20 transition-all duration-300 border ${isDark ? "border-white/10" : "border-gray-300/50"
                    } hover:border-[${colors.accent}]/30`}
                  whileHover={{ y: -2, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 bg-[${colors.accent}]/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Icon
                    className={`text-${isDark ? "white" : "gray-900"} group-hover:text-[${colors.accent}] transition-colors duration-300 relative z-10`}
                    size={20}
                  />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div custom={1} variants={fadeUp}>
            <h3 className={`text-xl font-medium mb-6 flex items-center gap-3 ${colors.text}`}>
              <div className={`p-2 bg-[${colors.accent}]/20 rounded-xl`}>
                <Users size={20} className={`text-[${colors.accent}]`} />
              </div>
              Quick Links
            </h3>
            <ul className="space-y-4 ml-6">
              {quickLinks.map(({ label, href, icon: Icon }, idx) => (
                <motion.li key={idx} whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                  <a
                    href={href}
                    className={`group inline-flex items-center gap-3 hover:text-[${colors.accent}] transition-all duration-300 ${colors.secondaryText}`}
                  >
                    <div className="p-1.5 bg-white/5 rounded-lg group-hover:bg-[${colors.accent}]/20 transition-colors duration-300">
                      <Icon size={16} className="group-hover:text-[${colors.accent}] transition-colors duration-300" />
                    </div>
                    <span className="relative font-medium after:block after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-[${colors.accent}] group-hover:after:w-full after:transition-all after:duration-300">
                      {label}
                    </span>
                    <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[${colors.accent}]" />
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div custom={2} variants={fadeUp} className="md:col-span-2">
            <h3 className={`text-xl font-medium mb-6 flex items-center gap-3 ${colors.text}`}>
              <div className={`p-2 bg-[${colors.accent}]/20 rounded-xl`}>
                <Sparkles size={20} className={`text-[${colors.accent}]`} />
              </div>
              Stay Updated
            </h3>
            <p className={`${colors.secondaryText} text-base mb-6 leading-relaxed`}>
               Subscribe to our newsletter for insights and growth ideas.
            </p>

            <motion.form className="space-y-4" whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className={`w-full px-6 py-4 rounded-xl ${colors.inputBg} border ${colors.inputBorder} focus:border-[${colors.accent}] focus:outline-none ${colors.inputText} placeholder-gray-400 text-base backdrop-blur-sm transition-all duration-300 focus:bg-opacity-50`}
                />
                <div className="absolute inset-y-0 right-3 flex items-center">
                  <Send size={18} className={`${colors.secondaryText}`} />
                </div>
              </div>

              <motion.button
                type="submit"
                className={`group relative w-full bg-gradient-to-r from-[${colors.buttonBgStart}] to-[${colors.buttonBgEnd}] text-[${colors.buttonText}] px-6 py-4 rounded-xl font-bold text-base hover:shadow-lg hover:shadow-[${colors.accent}]/25 transition-all duration-300 overflow-hidden`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-[#f7af00] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center justify-center gap-2">
                  Subscribe Now
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </motion.button>
            </motion.form>


          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Section */}
      <div className={`relative z-10 py-6 text-center ${colors.secondaryText}`}>
        © {new Date().getFullYear()} Finzie. All rights reserved.
      </div>

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
