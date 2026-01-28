"use client";

import { motion, Variants } from "framer-motion";
import {
  Twitter,
  Linkedin,
  Info,
  ArrowRight,
  Send,
  ExternalLink,
  FileText,
  Instagram,
  Layers,
  BookOpen,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { FaThreads } from "react-icons/fa6";
import Image from "next/image";

export default function Footer() {
  const pathname = usePathname() || "";

  // ---------------- HIDE FOOTER ON SPECIFIC ROUTES ----------------
  if (
    pathname.startsWith("/h") ||
    (pathname.startsWith("/case-studies/") && pathname !== "/case-studies") ||
    (pathname.startsWith("/form/") && pathname !== "/form") ||
    (pathname.startsWith("/find-talent/") && pathname !== "/find-talent") ||
    (pathname.startsWith("/get-hired/") && pathname !== "/get-hired") ||
    (pathname.startsWith("/freelancer/") && pathname !== "/freelancer")
  ) {
    return null;
  }

  const LANDING_SLUGS = ["gohighlevel-crm", "shopify", "seo", "webflow", "ai"];
  const isLandingPage =
    pathname.split("/").length === 2 &&
    LANDING_SLUGS.includes(pathname.replace("/", ""));

  if (isLandingPage) return null;

  // ---------------- ANIMATION VARIANTS ----------------
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.12 },
    }),
  };

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.12 },
    },
  };

  // ---------------- DATA ----------------
  const quickLinks = [
    { label: "About Us", href: "/about-us", icon: Info },
    { label: "Case Studies", href: "/case-studies", icon: FileText },
    // { label: "Find Talent", href: "/find-talent", icon: Users },
    // { label: "Get Hired", href: "/get-hired", icon: Sparkles },
    { label: "Services", href: "/services", icon: Layers },
    { label: "Resources", href: "/resources", icon: BookOpen }

  ];

  const socialLinks = [
    { Icon: Twitter, label: "Twitter", link: "https://x.com/getfinzie" },
    { Icon: Linkedin, label: "LinkedIn", link: "https://www.linkedin.com/company/finzieai" },
    { Icon: Instagram, label: "Instagram", link: "https://www.instagram.com/finzie.co" },
    { Icon: FaThreads, label: "Threads", link: "https://www.threads.com/@finzie.co" },
  ];

  const ACCENT = "#f7af00";

  return (
    <footer className="relative overflow-hidden bg-[#f0eadd]">
      {/* ---------------- BACKGROUND DECOR (LIGHT & SAFE) ---------------- */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(247,175,0,0.4) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12">
        {/* Brand */}

        <div className="mb-10 flex items-center justify-center gap-3 sm:justify-start">
          <Image
            src="/finzie-logo.png"
            alt="Finzie Logo"
            width={40}
            height={40}
            className="object-contain"
            priority
          />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900">
            Finzie
          </h2>
        </div>


        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* ---------------- ABOUT ---------------- */}
          <motion.div custom={0} variants={fadeUp}>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              Finzie is a specialised execution partner for Shopify,
              GoHighLevel and white-label agency delivery.
            </p>

            <div className="flex gap-4 mt-6 justify-center sm:justify-start">
              {socialLinks.map(({ Icon, label, link }, i) => (
                <motion.a
                  key={i}
                  href={link}
                  aria-label={label}
                  className="p-3 rounded-xl bg-white/60 border border-gray-300 hover:shadow-md"
                  whileHover={{ y: -3, scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={20} style={{ color: ACCENT }} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* ---------------- QUICK LINKS ---------------- */}
          <motion.div custom={1} variants={fadeUp}>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map(({ label, href, icon: Icon }, i) => (
                <li key={i}>
                  <a
                    href={href}
                    className="flex items-center gap-3 text-gray-700 hover:text-gray-900 transition"
                  >
                    <Icon size={16} style={{ color: ACCENT }} />
                    {label}
                    <ExternalLink size={14} className="opacity-40" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ---------------- NEWSLETTER ---------------- */}
          <motion.div
            custom={2}
            variants={fadeUp}
            className="sm:col-span-2"
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              Stay Updated
            </h3>
            <p className="text-gray-700 mb-4 text-sm sm:text-base">
              Subscribe to our newsletter for insights and growth ideas.
            </p>

            <form className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2"
                  style={{ "--tw-ring-color": ACCENT } as any}
                />
                <Send
                  size={18}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-semibold text-gray-900 bg-[#f7af00]"
              >
                <span className="flex justify-center items-center gap-2">
                  Subscribe Now <ArrowRight size={18} />
                </span>
              </button>
            </form>
          </motion.div>
        </motion.div>
      </div>

      {/* ---------------- FOOTER BOTTOM ---------------- */}
      <div className="py-5 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} Finzie. All rights reserved.
      </div>
    </footer>
  );
}
