"use client";

import { motion } from "framer-motion";
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
} from "lucide-react";

export default function Footer() {
  // simple stagger animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.15 },
    }),
  };

  return (
    <footer className="relative overflow-hidden bg-[#241C15] text-white">
      {/* animated gradient halo */}
      <div className="absolute -inset-1 bg-gradient-to-br from-[#241C15] via-[#2e211a] to-[#241C15] animate-gradient" />

      {/* pattern overlay */}
      <div className="absolute inset-0 opacity-5 bg-[url('/pattern.svg')] bg-cover" />

      <div className="relative max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
        {/* Logo + description */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">Finzie</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Finzie helps you simplify your financial planning with smart
            analytics and tools. Join thousands of users achieving financial
            freedom.
          </p>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          custom={1}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users size={18} className="text-[#FFE01B]" /> Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            {[
              { label: "About Us", href: "/about", icon: Info },
              { label: "Features", href: "/features", icon: ArrowRight },
              { label: "Pricing", href: "/pricing", icon: FileText },
              { label: "Contact", href: "/contact", icon: Users },
            ].map(({ label, href, icon: Icon }, idx) => (
              <li key={idx}>
                <a
                  href={href}
                  className="group inline-flex items-center gap-2 hover:text-[#FFE01B] transition"
                >
                  <Icon size={14} className="opacity-70 group-hover:opacity-100" />
                  <span className="relative after:block after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-0 after:bg-[#FFE01B] group-hover:after:w-full after:transition-all">
                    {label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Resources */}
        <motion.div
          custom={2}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <HelpCircle size={18} className="text-[#FFE01B]" /> Resources
          </h3>
          <ul className="space-y-2 text-sm">
            {[
              { label: "Blog", href: "#blog", icon: FileText },
              { label: "Help Center", href: "#help", icon: HelpCircle },
              { label: "FAQs", href: "#faq", icon: HelpCircle },
              { label: "Security", href: "#security", icon: ShieldCheck },
            ].map(({ label, href, icon: Icon }, idx) => (
              <li key={idx}>
                <a
                  href={href}
                  className="group inline-flex items-center gap-2 hover:text-[#FFE01B] transition"
                >
                  <Icon size={14} className="opacity-70 group-hover:opacity-100" />
                  <span className="relative after:block after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-0 after:bg-[#FFE01B] group-hover:after:w-full after:transition-all">
                    {label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Newsletter */}
        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ArrowRight size={18} className="text-[#FFE01B]" /> Stay Updated
          </h3>
          <p className="text-gray-300 text-sm mb-4">
            Subscribe to our newsletter for updates and tips.
          </p>
          <form className="flex">
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-3 py-2 rounded-l-lg focus:outline-none text-black"
            />
            <button
              type="submit"
              className="bg-[#FFE01B] text-black px-4 py-2 rounded-r-lg hover:bg-[#FCD34D] transition"
            >
              Subscribe
            </button>
          </form>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
        className="relative border-t border-gray-300/20 mt-10"
      >
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between text-sm">
          <p className="text-gray-300 mb-4 md:mb-0">
            © {new Date().getFullYear()} Finzie. All rights reserved.
          </p>
          <div className="flex space-x-4">
            {[Facebook, Twitter, Linkedin, Instagram].map((Icon, idx) => (
              <a
                key={idx}
                href="#"
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition transform hover:scale-110 hover:shadow-[0_0_10px_#FFE01B]"
              >
                <Icon size={18} className="text-white" />
              </a>
            ))}
          </div>
        </div>
      </motion.div>

      {/* animation keyframes */}
      <style jsx global>{`
        @keyframes gradientMove {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientMove 15s ease infinite;
        }
      `}</style>
    </footer>
  );
}
