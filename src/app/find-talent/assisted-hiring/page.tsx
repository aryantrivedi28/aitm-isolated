"use client";

import React from "react";
import { motion } from "framer-motion";

const AssistedHiring: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f0eadd] flex flex-col items-center justify-center py-12 px-4">
      {/* Animated Heading Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center max-w-2xl"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
          Assisted Hiring – Book a Call
        </h1>
        <p className="text-[#241C15] text-lg md:text-xl mb-8">
          Select a suitable time slot below to schedule your consultation with our hiring team. 
          Once booked, you’ll receive a Google Calendar invite and email confirmation.
        </p>
      </motion.div>

      {/* Animated Card with Calendar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="w-full h-[90%] max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <iframe
          src="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3JEPO_jv48TnnuSi5pE_u6BEk799ry0q1ddTAD428aGoxkH7Vc1J5cJVqMIpC0O8uqj4YN-Ub8?gv=true%27"
          style={{ border: "0" }}
          width="100%"
          height="900"
          title="Google Calendar Booking"
        ></iframe>
      </motion.div>

      {/* CTA Button Below */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-10"
      >
        <a
          href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3JEPO_jv48TnnuSi5pE_u6BEk799ry0q1ddTAD428aGoxkH7Vc1J5cJVqMIpC0O8uqj4YN-Ub8?gv=true%27"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-[#f7af00] text-black font-semibold rounded-lg shadow-md hover:bg-[#f7af00] transition"
        >
          Open in Google Calendar
        </a>
      </motion.div>
    </div>
  );
};

export default AssistedHiring;
