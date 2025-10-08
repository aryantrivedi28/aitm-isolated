"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Login successful!");
        // Redirect after a short delay to show toast
        setTimeout(() => {
          window.location.href = "/admin-panel";
        }, 1000);
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#241C15] text-white px-6 relative">
      {/* Toast container */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-md w-full text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to <span className="text-[#FFE01B]">Finzie</span>
        </h1>
        <p className="text-gray-300 mb-8">
          Access your dashboard securely using your company email.
        </p>
      </motion.div>

      {/* Login Form */}
      <motion.form
        onSubmit={handleLogin}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="bg-[#1F1710] p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <label className="block mb-2 text-gray-300 font-medium">
          Company Email
        </label>
        <div className="relative mb-6">
          <Mail className="absolute left-3 top-3 text-[#FFE01B]" size={20} />
          <input
            type="email"
            placeholder=""
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#241C15] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFE01B]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#FFE01B] hover:bg-yellow-300 text-black font-semibold py-3 rounded-lg shadow-md transition-colors duration-300"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </motion.form>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 text-gray-300 text-sm"
      >
        © {new Date().getFullYear()} Finzie. All rights reserved.
      </motion.p>
    </div>
  );
}
