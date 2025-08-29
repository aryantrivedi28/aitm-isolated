"use client";
export const dynamic = "force-dynamic";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Briefcase, Users } from "lucide-react";

export default function OptionsPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#241C15] p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white shadow-lg p-10 rounded-2xl w-full max-w-md text-center border border-gray-300"
      >
        {/* Heading */}
        <h1 className="text-2xl font-bold text-black mb-2">
          Choose Your Hiring Option
        </h1>
        <p className="text-gray-600 mb-8">
          Select how you’d like to proceed with hiring
        </p>

        {/* Direct Hiring */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push("/find-talent/direct-hiring")}
          className="flex items-center justify-center gap-3 bg-[#FFE01B] hover:bg-yellow-300 text-black font-semibold px-5 py-4 rounded-xl w-full mb-5 shadow-md transition-all duration-200"
        >
          <Briefcase className="w-5 h-5" />
          <span>Direct Hiring</span>
        </motion.button>

        {/* Assisted Hiring */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push("/find-talent/assisted-hiring")}
          className="flex items-center justify-center gap-3 bg-[#FFE01B] hover:bg-yellow-300 text-black font-semibold px-5 py-4 rounded-xl w-full shadow-md transition-all duration-200"
        >
          <Users className="w-5 h-5" />
          <span>Assisted Hiring</span>
        </motion.button>
      </motion.div>
    </div>
  );
}
