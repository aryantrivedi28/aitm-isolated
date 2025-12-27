'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/SupabaseAuthClient';
import { matchFreelancerToClient } from '../../lib/matchmaker';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Building, FileText, ArrowRight, Sparkles } from 'lucide-react';

export default function ClientRequestForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    requirement: ''
  });

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  useEffect(() => {
    let filled = 0;
    if (form.fullName) filled++;
    if (form.email) filled++;
    if (form.phone) filled++;
    if (form.requirement) filled++;
    setProgress(Math.round((filled / 4) * 100));
  }, [form]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);

  try {
    // 1. Save to Supabase
    const { data: inserted, error: insertError } = await supabase
      .from('client_requests')
      .insert([{
        full_name: form.fullName,
        email: form.email,
        phone: form.phone,
        company: form.company || '',
        requirement: form.requirement,
        status: 'pending',
        instant_email_sent: false,
        daily_report_included: false
      }])
      .select()
      .single();

    if (insertError) throw insertError;

    // 2. Send to Google Apps Script for immediate email
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbxUhJwYMkxudvFvdDkt8CBijAS0Ur1X8Cdts5sr6AodGfVUUj6A7X8ZUQajxd7ppCKy/exec'; // Get from deployment
    
    const scriptResponse = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        company: form.company || '',
        requirement: form.requirement,
        submittedAt: new Date().toISOString()
      })
    });

    const scriptResult = await scriptResponse.json();
    
    if (!scriptResult.success) {
      console.warn('Instant email may not have been sent:', scriptResult.message);
      // Continue anyway - Supabase saved successfully
    } else {
      console.log('✅ Instant email triggered:', scriptResult.message);
    }

    // 3. Update Supabase with email status
    await supabase
      .from('client_requests')
      .update({ 
        instant_email_sent: true,
        instant_email_sent_at: new Date().toISOString()
      })
      .eq('id', inserted.id);

    router.push('/thank-you-client');

  } catch (error) {
    console.error('Submission error:', error);
    alert('An error occurred. Please try again.');
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="min-h-screen bg-[#f0eadd] pt-[125px] pb-16 relative overflow-hidden">
      {/* Header */}
      <header className="relative bg-[#f0eadd] border-b border-[#050504]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-start sm:items-center gap-4"
          >
            {/* Icon */}
            <div className="flex-shrink-0 p-3 rounded-xl bg-[#f7af00]/15 shadow-sm">
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-[#f7af00]" />
            </div>

            {/* Text */}
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-medium text-[#050504] leading-tight">
                Start Your Project
              </h1>

              <p className="mt-1 sm:mt-2 text-sm sm:text-base text-[#31302f] max-w-2xl leading-relaxed">
                Share your requirements and we’ll connect you with the right expert to get things moving quickly.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Subtle decorative gradient line */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#f7af00]/40 to-transparent" />
      </header>


      <div className="max-w-3xl mx-auto px-4 py-8 pb-16">
        {/* Progress Bar */}
        {/* <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-[#050504]">
              Progress
            </span>
            <span className="text-sm font-semibold text-[#f7af00]">
              {progress}%
            </span>
          </div>
          <div className="h-2 w-full bg-[#f0eadd] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="h-full bg-[#f7af00] rounded-full"
            />
          </div>
        </motion.div> */}

        {/* Form Container */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="bg-[#faf4e5] rounded-2xl border border-[#050504]/10 p-6 md:p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <motion.div variants={fadeInUp}>
              <label className="flex items-center gap-2 mb-2 text-sm font-medium text-[#050504]">
                <User className="w-4 h-4 text-[#f7af00]" />
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={form.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 bg-[#faf4e5] border border-[#050504]/20 rounded-xl text-[#050504] placeholder-[#31302f]/50 focus:outline-none focus:border-[#f7af00] transition-colors"
              />
            </motion.div>

            {/* Email */}
            <motion.div variants={fadeInUp}>
              <label className="flex items-center gap-2 mb-2 text-sm font-medium text-[#050504]">
                <Mail className="w-4 h-4 text-[#f7af00]" />
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-[#faf4e5] border border-[#050504]/20 rounded-xl text-[#050504] placeholder-[#31302f]/50 focus:outline-none focus:border-[#f7af00] transition-colors"
              />
            </motion.div>

            {/* Phone */}
            <motion.div variants={fadeInUp}>
              <label className="flex items-center gap-2 mb-2 text-sm font-medium text-[#050504]">
                <Phone className="w-4 h-4 text-[#f7af00]" />
                WhatsApp Number *
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter your WhatsApp number"
                className="w-full px-4 py-3 bg-[#faf4e5] border border-[#050504]/20 rounded-xl text-[#050504] placeholder-[#31302f]/50 focus:outline-none focus:border-[#f7af00] transition-colors"
              />
            </motion.div>

            {/* Company Name (Optional) */}
            <motion.div variants={fadeInUp}>
              <label className="flex items-center gap-2 mb-2 text-sm font-medium text-[#050504]">
                <Building className="w-4 h-4 text-[#f7af00]" />
                Company Name <span className="text-[#31302f] text-xs">(optional)</span>
              </label>
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Enter your company name"
                className="w-full px-4 py-3 bg-[#faf4e5] border border-[#050504]/20 rounded-xl text-[#050504] placeholder-[#31302f]/50 focus:outline-none focus:border-[#f7af00] transition-colors"
              />
            </motion.div>

            {/* Requirement */}
            <motion.div variants={fadeInUp}>
              <label className="flex items-center gap-2 mb-2 text-sm font-medium text-[#050504]">
                <FileText className="w-4 h-4 text-[#f7af00]" />
                Project Requirement *
              </label>
              <textarea
                name="requirement"
                required
                value={form.requirement}
                onChange={handleChange}
                placeholder="Describe your project in detail..."
                rows={5}
                className="w-full px-4 py-3 bg-[#faf4e5] border border-[#050504]/20 rounded-xl text-[#050504] placeholder-[#31302f]/50 focus:outline-none focus:border-[#f7af00] transition-colors resize-none"
              />
              <p className="text-xs text-[#31302f] mt-2">
                Please include details about goals, scope, and any specific needs
              </p>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              variants={fadeInUp}
              className="pt-4"
            >
              <button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  flex items-center justify-center
                  gap-3
                  px-6 py-3
                  bg-[#f7af00]
                  text-[#050504]
                  font-semibold
                  rounded-xl
                  hover:bg-[#f7af00]/90
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-300
                  group
                "
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-[#050504] border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <>
                    <span>Submit Request</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </motion.div>

            {/* Privacy Note */}
            <motion.div
              variants={fadeInUp}
              className="text-center pt-4"
            >
              <p className="text-xs text-[#31302f]">
                Your information is secure and will only be used to match you with suitable freelancers.
              </p>
            </motion.div>
          </form>
        </motion.div>

        {/* Decorative Elements */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <motion.div
            animate={{
              y: [0, 20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -left-20 top-1/4 w-64 h-64 bg-[#f7af00]/5 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              y: [20, 0, 20],
              rotate: [5, 0, 5],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -right-20 bottom-1/4 w-80 h-80 bg-[#f7af00]/5 rounded-full blur-3xl"
          />
        </div>
      </div>
    </main>
  );
}