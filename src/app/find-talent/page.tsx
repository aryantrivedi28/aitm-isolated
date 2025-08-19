"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function FindTalentPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);

  async function sendOtp() {
    if (!email) return alert("Enter email");
    const res = await fetch("/api/otp/send", { method: "POST", body: JSON.stringify({ email }) });
    if (res.ok) { setOtpSent(true); alert("OTP sent (demo: 1234)"); } else { alert("Failed to send OTP"); }
  }

  async function verify() {
    const res = await fetch("/api/otp/verify", { method: "POST", body: JSON.stringify({ email, otp }) });
    if (res.ok) { setVerified(true); } else { alert("Invalid OTP"); }
  }

  function goNext() {
    if (!verified) return alert("Please verify email first");
    router.push("/post-gig/option-select");
  }

  return (
    <div className="relative min-h-screen bg-[#241C15] text-white overflow-hidden">
      {/* Floating circles */}
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

      {/* Hero Section */}
      <motion.div
        className="max-w-3xl mx-auto text-center pt-20 pb-12"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          className="text-5xl font-bold mb-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Find Top Talent
        </motion.h1>
        <motion.p
          className="text-gray-300 text-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          Post your hiring needs and discover vetted professionals instantly.
        </motion.p>
      </motion.div>

      {/* Form Section */}
      <motion.div
        className="max-w-2xl mx-auto bg-white text-black rounded-2xl shadow-2xl p-8"
        initial={{ opacity: 0, y: 200 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.6 }}
      >
        <motion.h2
          className="text-2xl font-semibold mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Company Information
        </motion.h2>

        {/* Email with verify */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2 }}
        >
          <label className="block text-gray-600 mb-2">Work Email</label>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter work email"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFE01B]"
            />
            {!verified && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={sendOtp}
                className="bg-[#FFE01B] text-black font-semibold px-4 py-2 rounded-lg hover:bg-yellow-300"
              >
                {otpSent ? "Resend" : "Verify"}
              </motion.button>
            )}
            {verified && (
              <motion.span
                className="text-green-600 font-semibold px-2 py-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                ✅ Verified
              </motion.span>
            )}
          </div>
          {otpSent && !verified && (
            <motion.div
              className="mt-3 flex gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFE01B]"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={verify}
                className="bg-[#FFE01B] text-black font-semibold px-4 py-2 rounded-lg hover:bg-yellow-300"
              >
                Submit OTP
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* Submit */}
        <motion.button
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 20px #FFE01B",
          }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-[#FFE01B] text-black font-bold py-3 rounded-lg hover:bg-yellow-300 transition mt-6"
        >
          Submit
        </motion.button>
      </motion.div>
    </div>
  );
}
