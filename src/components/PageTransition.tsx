"use client";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { usePathname } from "next/navigation";

const variants: Variants = {
  initial: { scaleY: 1, opacity: 1 },
  animate: {
    scaleY: 0,
    opacity: 0,
    transition: { duration: 1, ease: "easeInOut" },
  },
  exit: {
    scaleY: 1,
    opacity: 1,
    transition: { duration: 1, ease: "easeInOut" },
  },
};

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      {/* Overlay animation */}
      <motion.div
        key={pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="fixed inset-0 z-40 bg-[#FFE01B]/70 origin-top"
      />
      {/* Page content fade */}
      <motion.div
        key={pathname + "-content"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 1 } }}
        exit={{ opacity: 0 }}
        className="relative z-10"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
