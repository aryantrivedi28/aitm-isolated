"use client"

import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default function ThankYouPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#241C15] text-white overflow-hidden">
      {/* Floating circles (same vibe as your other pages) */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute w-72 h-72 bg-[#FFE01B] rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{ x: [0, 100, -100, 0], y: [0, 50, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
          animate={{ x: [0, -80, 80, 0], y: [0, -50, 50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-white text-black rounded-2xl shadow-2xl p-10 max-w-md text-center z-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-6"
        >
          <CheckCircle className="w-16 h-16 text-green-500" />
        </motion.div>

        <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
        <p className="text-gray-600 mb-8">
          Your hiring request has been submitted successfully.  
          Our team will review your requirements and reach out shortly.
        </p>

        <Link
          href="/"
          className="bg-[#FFE01B] hover:bg-yellow-300 text-black font-semibold px-6 py-3 rounded-lg shadow-md transition-all duration-200"
        >
          Back to Home
        </Link>
      </motion.div>
    </div>
  )
}
