"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import {
  Mail,
  ShieldCheck,
  KeyRound,
  Send,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function FindTalentPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/otp/session", { cache: "no-store" });
        const data = await res.json();
        if (data.authenticated) {
          router.replace("/find-talent/option");
        } else {
          setLoading(false);
        }
      } catch {
        setLoading(false);
      }
    }
    checkSession();
  }, [router]);

  async function sendOtp() {
    setError("");
    setSuccessMessage("");
    const toastId = toast.loading("Sending OTP...");
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      toast.dismiss(toastId);

      if (data.success) {
        setOtpSent(true);
        setSuccessMessage("✅ OTP sent successfully! Check your inbox.");
        toast.success("OTP sent! Check your inbox.");
      } else {
        setError(data.error || "Failed to send OTP.");
        toast.error(data.error || "Failed to send OTP.");
      }
    } catch {
      toast.dismiss(toastId);
      setError("Something went wrong. Please try again.");
      toast.error("Something went wrong.");
    }
  }

  async function verifyOtp() {
    setError("");
    setSuccessMessage("");
    const toastId = toast.loading("Verifying OTP...");
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      toast.dismiss(toastId);

      if (res.ok && data.success) {
        setVerified(true);
        setSuccessMessage("🎉 Email verified successfully!");
        toast.success("🎉 Verified! Redirecting...");
        setTimeout(() => router.push("/find-talent/option"), 2000);
      } else {
        setError(data.error || "Invalid OTP");
        toast.error(data.error || "Invalid OTP");
      }
    } catch {
      toast.dismiss(toastId);
      setError("Something went wrong. Please try again.");
      toast.error("Something went wrong.");
    }
  }

  return (
    <div className="relative min-h-screen bg-[#fbf5e5] text-[#241C15] overflow-hidden pt-[60px] sm:pt-[100px] lg:pt-[120px]">
      {/* Toast Provider */}
      <Toaster
        position="top-right"
        toastOptions={{
          className: "rounded-xl shadow-lg font-medium",
          style: { background: "#241C15", color: "#fff" },
        }}
      />

      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute w-72 h-72 bg-[#FFE01B] rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          animate={{ x: [0, 100, -100, 0], y: [0, 50, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 left-20 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
          animate={{ x: [0, -80, 80, 0], y: [0, -50, 50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Hero */}
      <motion.div
        className="max-w-3xl mx-auto text-center pt-20 pb-12"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          className="text-5xl font-bold mb-4 flex items-center justify-center gap-3"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <ShieldCheck className="w-10 h-10 text-[#FFE01B]" />
          Find Top Talent
        </motion.h1>
        <motion.p
          className="text-gray-600 text-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          Post your hiring needs and connect with vetted professionals instantly.
        </motion.p>
      </motion.div>

      {/* Form Card */}
      <motion.div
        className="max-w-2xl mx-auto bg-gray-50 text-[#241C15] rounded-2xl shadow-2xl p-8"
        initial={{ opacity: 0, y: 200 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.6 }}
      >
        <motion.h2
          className="text-2xl font-semibold mb-6 flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Mail className="w-6 h-6 text-[#FFE01B]" /> Verify Your Account
        </motion.h2>

        {/* Email Field */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2 }}
        >
          <label className="block text-gray-700 mb-2">Work Email</label>
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter work email"
                className="flex-1 border border-gray-300 w-full rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFE01B]"
              />
            </div>
            {!verified && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={sendOtp}
                className="bg-[#FFE01B] text-black font-semibold px-4 py-2 rounded-lg hover:bg-yellow-300 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {otpSent ? "Resend" : "Verify"}
              </motion.button>
            )}
            {verified && (
              <motion.span
                className="text-green-600 font-semibold px-2 py-2 flex items-center gap-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <CheckCircle2 className="w-5 h-5" /> Verified
              </motion.span>
            )}
          </div>

          {/* OTP Field */}
          {otpSent && !verified && (
            <motion.div
              className="mt-3 flex gap-2 items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative flex-1">
                <KeyRound className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="flex-1 border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFE01B]"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={verifyOtp}
                className="bg-[#FFE01B] text-black font-semibold px-4 py-2 rounded-lg hover:bg-yellow-300 flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                Submit OTP
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* Keep feedback in UI (extra) */}
        <AnimatePresence>
          {successMessage && (
            <motion.p
              key="success"
              className="text-green-600 font-medium mt-3 flex items-center gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <CheckCircle2 className="w-5 h-5" />
              {successMessage}
            </motion.p>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {error && (
            <motion.p
              key="error"
              className="text-red-500 font-medium mt-3 flex items-center gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <AlertCircle className="w-5 h-5" />
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
