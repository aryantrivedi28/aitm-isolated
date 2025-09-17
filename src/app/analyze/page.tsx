"use client";

import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Bot, Sparkles, Link, BrainCircuit, Zap, Target, BarChart3, Rocket, Palette, FileSpreadsheet, ClipboardList, AlertCircle, CheckCircle2, RotateCcw, TrendingUp } from "lucide-react";


export default function AnalyzeSheetPage() {
  const [sheetUrl, setSheetUrl] = useState("");
  const [sheetName, setSheetName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus("Analyzing prompt and preparing sheet...");
    setResult(null);

    try {
      const res = await fetch("/api/analyze-sheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sheetUrl,
          sheetName: sheetName.trim() || undefined,
          prompt,
        }),
      });

      const data = await res.json();
      setResult(data);

      if (data.success) {
        setStatus(
          `Completed! ${data.rowsAnalyzed} rows processed. Fields created: ${data.fieldsCreated?.join(", ") || "None"}`,
        );
      } else {
        setStatus(`Error: ${data.error}`);
      }
    } catch (err: any) {
      setStatus(`Network error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  // const itemVariants = {
  //   hidden: { y: 30, opacity: 0 },
  //   visible: {
  //     y: 0,
  //     opacity: 1,
  //     transition: {
  //       type: "spring" as const,
  //       stiffness: 100,
  //       damping: 15
  //     }
  //   }
  // };

  return (
    <main className="bg-[#241C15] min-h-screen py-4 sm:py-6 lg:py-8 px-2 sm:px-4 lg:px-6 xl:px-8 relative overflow-hidden pt-[100px] sm:pt-[120px] lg:pt-[160px]">
      {/* Advanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient orbs */}
        <motion.div
          animate={{
            x: [-200, 200, -200],
            y: [-100, 100, -100],
            scale: [1, 1.5, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-10 sm:top-20 left-5 sm:left-20 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-gradient-to-br from-[#FFE01B]/10 via-[#FCD34D]/5 to-transparent rounded-full blur-2xl sm:blur-3xl"
        />
        <motion.div
          animate={{
            x: [200, -200, 200],
            y: [100, -100, 100],
            scale: [1.2, 0.8, 1.2],
            rotate: [360, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-40 sm:w-60 md:w-80 h-40 sm:h-60 md:h-80 bg-gradient-to-tl from-[#FFE01B]/8 via-transparent to-[#FCD34D]/4 rounded-full blur-xl sm:blur-2xl"
        />

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [-20, -40, -20],
              x: [-10, 10, -10],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
            className="absolute w-1.5 sm:w-2 h-1.5 sm:h-2 bg-[#FFE01B] rounded-full"
            style={{
              top: `${20 + i * 15}%`,
              left: `${10 + i * 12}%`,
            }}
          />
        ))}
      </div>

      {/* Neural network grid */}
      <div className="absolute inset-0 opacity-3 sm:opacity-5">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse" className="sm:w-60 sm:h-60">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FFE01B" strokeWidth="0.5" className="sm:stroke-1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-12 lg:mb-16 relative"
        >
          {/* Glowing backdrop */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFE01B]/5 to-transparent blur-2xl sm:blur-3xl"></div>

          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative inline-flex items-center justify-center w-16  sm:w-20 md:w-24 lg:w-28 h-16 sm:h-20 md:h-24 lg:h-28 bg-gradient-to-br from-[#FFE01B] via-[#FCD34D] to-[#FFE01B] rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 lg:mb-8 shadow-xl sm:shadow-2xl shadow-[#FFE01B]/25"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFE01B] to-[#FCD34D] rounded-2xl sm:rounded-3xl blur-md sm:blur-lg opacity-50"></div>
            <Bot className="relative w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 xl:w-16 xl:h-16 z-10 text-black" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border border-dashed sm:border-2 border-[#FFE01B]/30 rounded-2xl sm:rounded-3xl"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-3 sm:mb-4 lg:mb-6 tracking-tight px-2"
            style={{
              background: "linear-gradient(135deg, #FFFFFF 0%, #FFE01B 50%, #FFFFFF 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            AI Sheet Analyzer
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative px-2 sm:px-4"
          >
            <p className="text-sm sm:text-lg md:text-xl lg:text-2xl text-gray-300 font-semibold mb-4 sm:mb-6 lg:mb-8 max-w-xs sm:max-w-lg md:max-w-2xl mx-auto leading-relaxed">
              Next-Generation Intelligent Auto-Field Creation & Analysis Platform
            </p>
            <motion.div
              animate={{ width: ["0%", "100%", "0%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-[#FFE01B] to-transparent mx-auto rounded-full"
              style={{ maxWidth: "200px" }}
            />
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 xl:gap-10">
          {/* How it works */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 lg:order-1 lg:col-span-4"
          >
            <div className="lg:sticky lg:top-8">
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl sm:shadow-2xl relative overflow-hidden"
              >
                {/* Animated border */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-[#FFE01B]/20 via-transparent to-[#FCD34D]/20 rounded-2xl sm:rounded-3xl blur-lg sm:blur-xl"
                />

                <div className="relative z-10">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center mb-4 sm:mb-6 lg:mb-8"
                  >
                    <div className="w-10 h-10 sm:w-12 md:w-14 lg:w-16 sm:h-12 md:h-14 lg:h-16 bg-gradient-to-br from-[#FFE01B] to-[#FCD34D] rounded-xl sm:rounded-2xl flex items-center justify-center mr-3 sm:mr-4 shadow-lg">
                      <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-black" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white">How it works</h2>
                      <p className="text-xs sm:text-sm text-gray-300 hidden sm:block">Powered by AI Intelligence</p>
                    </div>
                  </motion.div>

                  <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                    {[
                      { icon: <Link className="w-5 h-5" />, text: "Provide your Google Sheet URL and evaluation prompt", delay: 0 },
                      { icon: <BrainCircuit className="w-5 h-5" />, text: "AI automatically determines required columns/fields", delay: 0.1 },
                      { icon: <Zap className="w-5 h-5" />, text: "Missing columns created automatically in your sheet", delay: 0.2 },
                      { icon: <Target className="w-5 h-5" />, text: "Each candidate gets unique, personalized evaluation", delay: 0.3 },
                      { icon: <BarChart3 className="w-5 h-5" />, text: "Specify sheet name or leave blank for first sheet", delay: 0.4 }
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1 + item.delay, type: "spring" }}
                        whileHover={{ x: 5, scale: 1.01 }}
                        className="group cursor-pointer"
                      >
                        <div className="flex items-start p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#FFE01B]/30 transition-all duration-300">
                          <motion.div
                            whileHover={{ scale: 1.2, rotate: 10 }}
                            className="text-[#FFE01B] mr-3 sm:mr-4 mt-0.5 sm:mt-1 flex-shrink-0"
                          >
                            {item.icon}
                          </motion.div>
                          <p className="text-gray-300 leading-relaxed text-sm sm:text-base lg:text-lg group-hover:text-white transition-colors">
                            {item.text}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Advanced Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="order-2 lg:order-2 lg:col-span-8"
          >
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-4 sm:p-6 lg:p-8 xl:p-10 border border-gray-300/20 relative overflow-hidden"
            >
              {/* Gradient overlay */}
              <div className="absolute top-0 left-0 right-0 h-1 sm:h-2 bg-gradient-to-r from-[#FFE01B] via-[#FCD34D] to-[#FFE01B]"></div>

              <div className="space-y-6 sm:space-y-8 lg:space-y-10">
                {/* Enhanced Input Fields */}
                {[
                  {
                    icon: <FileSpreadsheet className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />,
                    label: "Google Sheet URL",
                    type: "url",
                    value: sheetUrl,
                    onChange: setSheetUrl,
                    placeholder: "https://docs.google.com/spreadsheets/d/...",
                    required: true,
                    helper: "Make sure your sheet is shared with view/edit permissions"
                  },
                  {
                    icon: <ClipboardList className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />,
                    label: "Sheet Name",
                    type: "text",
                    value: sheetName,
                    onChange: setSheetName,
                    placeholder: "Sheet1, Sheet2, Data, etc. (leave blank for first sheet)",
                    required: false,
                    helper: "Specify which sheet tab to analyze. If left blank, the first sheet will be used."
                  }
                ].map((field, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="space-y-2 sm:space-y-3 lg:space-y-4"
                  >
                    <motion.label
                      whileHover={{ scale: 1.01 }}
                      className="flex items-center text-black font-bold text-base sm:text-lg lg:text-xl cursor-pointer"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 8 }}
                        className="w-8 h-8 sm:w-10 md:w-12 sm:h-10 md:h-12 bg-gradient-to-br from-[#FFE01B] to-[#FCD34D] rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center mr-2 sm:mr-3 lg:mr-4 shadow-lg"
                      >
                        {field.icon}
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="truncate">{field.label}</span>
                          {!field.required && (
                            <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-gray-300 text-black text-xs sm:text-sm rounded-full font-semibold whitespace-nowrap">
                              Optional
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.label>

                    <motion.div
                      whileHover={{ scale: 1.005 }}
                      whileFocus={{ scale: 1.01 }}
                      className="relative group"
                    >
                      <input
                        type={field.type}
                        required={field.required}
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full px-3 sm:px-4 lg:px-6 xl:px-8 py-3 sm:py-4 lg:py-5 border-2 sm:border-3 border-gray-300 rounded-xl sm:rounded-2xl text-black text-sm sm:text-base lg:text-lg font-medium focus:outline-none focus:ring-4 sm:focus:ring-6 focus:ring-[#FFE01B]/25 focus:border-[#FFE01B] transition-all duration-300 bg-gradient-to-r from-white to-gray-50 hover:border-[#FCD34D] placeholder-gray-400 shadow-inner"
                      />
                      <motion.div
                        initial={{ scaleX: 0 }}
                        whileFocus={{ scaleX: 1 }}
                        className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-[#FFE01B] to-[#FCD34D] rounded-full origin-left"
                      />
                    </motion.div>

                    <p className="text-gray-600 text-xs sm:text-sm ml-10 sm:ml-12 lg:ml-16 leading-relaxed">
                      {field.helper}
                    </p>
                  </motion.div>
                ))}

                {/* Enhanced Textarea */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-2 sm:space-y-3 lg:space-y-4"
                >
                  <motion.label
                    whileHover={{ scale: 1.01 }}
                    className="flex items-center text-black font-bold text-base sm:text-lg lg:text-xl cursor-pointer"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 8 }}
                      className="w-8 h-8 sm:w-10 md:w-12 sm:h-10 md:h-12 bg-gradient-to-br from-[#FFE01B] to-[#FCD34D] rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center mr-2 sm:mr-3 lg:mr-4 shadow-lg"
                    >
                      <Target className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-black" />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <div className="truncate">Evaluation Prompt</div>
                      <div className="text-xs sm:text-sm font-normal text-gray-600 mt-0.5 sm:mt-1 hidden sm:block">
                        Define your AI analysis requirements
                      </div>
                    </div>
                  </motion.label>

                  <motion.div
                    whileHover={{ scale: 1.005 }}
                    className="relative group"
                  >
                    <textarea
                      rows={6}
                      required
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Example: Rate each candidate from 1-10 based on their technical skills, experience, and portfolio quality. Also provide a skill assessment for JavaScript, React, and Node.js. Include hiring recommendation (Yes/No/Maybe) and salary range suggestion."
                      className="w-full px-3 sm:px-4 lg:px-6 xl:px-8 py-3 sm:py-4 lg:py-6 border-2 sm:border-3 border-gray-300 rounded-xl sm:rounded-2xl text-black text-sm sm:text-base lg:text-lg font-medium resize-none focus:outline-none focus:ring-4 sm:focus:ring-6 focus:ring-[#FFE01B]/25 focus:border-[#FFE01B] transition-all duration-300 bg-gradient-to-br from-white via-gray-50 to-white hover:border-[#FCD34D] placeholder-gray-400 shadow-inner leading-relaxed"
                    />
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileFocus={{ scaleX: 1 }}
                      className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-[#FFE01B] to-[#FCD34D] rounded-full origin-left"
                    />
                  </motion.div>

                  <p className="text-gray-600 text-xs sm:text-sm ml-10 sm:ml-12 lg:ml-16 leading-relaxed">
                    Be specific about what you want to evaluate. The AI will automatically create the necessary columns in your sheet.
                  </p>
                </motion.div>

                {/* Ultra-Modern Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, type: "spring" }}
                  className="pt-2 sm:pt-4"
                >
                  <motion.button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    className="relative w-full py-4 sm:py-5 lg:py-6 bg-gradient-to-r from-[#FFE01B] via-[#FCD34D] to-[#FFE01B] text-black font-black text-lg sm:text-xl lg:text-2xl rounded-xl sm:rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed shadow-xl sm:shadow-2xl shadow-[#FFE01B]/25 overflow-hidden group"
                  >
                    {/* Animated background layers */}
                    <motion.div
                      animate={{
                        background: isLoading
                          ? ["linear-gradient(90deg, #FFE01B 0%, #FCD34D 50%, #FFE01B 100%)",
                            "linear-gradient(90deg, #FCD34D 0%, #FFE01B 50%, #FCD34D 100%)",
                            "linear-gradient(90deg, #FFE01B 0%, #FCD34D 50%, #FFE01B 100%)"]
                          : "linear-gradient(90deg, #FFE01B 0%, #FCD34D 50%, #FFE01B 100%)"
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0"
                    />

                    {/* Shimmer effect */}
                    {!isLoading && (
                      <motion.div
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                      />
                    )}

                    {/* Loading pulse */}
                    {isLoading && (
                      <motion.div
                        animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute inset-0 bg-white/10 rounded-xl sm:rounded-2xl"
                      />
                    )}

                    <div className="relative z-10 flex items-center justify-center px-4">
                      <motion.div
                        animate={{
                          rotate: isLoading ? 360 : 0,
                          scale: isLoading ? [1, 1.2, 1] : 1
                        }}
                        transition={{
                          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                          scale: { duration: 1, repeat: Infinity }
                        }}
                        className="mr-2 sm:mr-3 lg:mr-4"
                      >
                        {isLoading ?
                          <Zap className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-black" /> :
                          <Rocket className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-black" />
                        }
                      </motion.div>
                      <span className="tracking-wide text-center">
                        {isLoading ? "Analyzing & Processing..." : "Run AI Analysis"}
                      </span>
                    </div>
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Premium Status Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-6 sm:mt-8 lg:mt-12"
        >
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl sm:shadow-2xl relative overflow-hidden"
          >
            {/* Animated status indicator */}
            <motion.div
              animate={{
                background: result?.success ? [
                  "linear-gradient(90deg, transparent, #10B981, transparent)"
                ] : result?.error ? [
                  "linear-gradient(90deg, transparent, #EF4444, transparent)"
                ] : isLoading ? [
                  "linear-gradient(90deg, transparent, #FFE01B, transparent)"
                ] : [
                  "linear-gradient(90deg, transparent, #6B7280, transparent)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-0 left-0 right-0 h-0.5 sm:h-1"
            />

            <div className="flex items-center mb-4 sm:mb-6">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: isLoading ? 360 : 0
                }}
                transition={{
                  scale: { duration: 2, repeat: Infinity },
                  rotate: { duration: 2, repeat: Infinity, ease: "linear" }
                }}
                className="w-10 h-10 sm:w-12 md:w-14 sm:h-12 md:h-14 bg-gradient-to-br from-[#FFE01B] to-[#FCD34D] rounded-xl sm:rounded-2xl flex items-center justify-center mr-3 sm:mr-4 shadow-lg flex-shrink-0"
              >
                {isLoading ? (
                  <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-black" />
                ) : result?.success ? (
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-black" />
                ) : result?.error ? (
                  <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-black" />
                ) : (
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-black" />
                )}
              </motion.div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-white">Analysis Status</h3>
                <p className="text-xs sm:text-sm text-gray-300 hidden sm:block">Real-time processing updates</p>
              </div>
            </div>

            <motion.div
              layout
              className="bg-black/20 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 border border-white/10 backdrop-blur-sm"
            >
              <motion.div
                key={status}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white text-sm sm:text-base lg:text-xl leading-relaxed font-medium"
              >
                {status || (
                  <span className="text-gray-300 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-[#FFE01B]" />
                    Ready to analyze your sheet! Fill out the form above and click
                    <span className="text-[#FFE01B] font-bold mx-1"> 'Run AI Analysis'</span>.
                  </span>
                )}
              </motion.div>

              {result?.error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  className="mt-4 sm:mt-5 lg:mt-6 p-3 sm:p-4 lg:p-5 bg-red-500/20 border-l-2 sm:border-l-4 border-red-500 rounded-lg sm:rounded-xl backdrop-blur-sm"
                >
                  <div className="flex items-start text-red-200 font-semibold text-sm sm:text-base lg:text-lg">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="mr-2 sm:mr-3 lg:mr-4 flex-shrink-0 mt-0.5"
                    >
                      <XCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-red-400" />
                    </motion.div>
                    <span className="break-words">{result.error}</span>
                  </div>
                </motion.div>
              )}

              {result?.success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  className="mt-4 sm:mt-5 lg:mt-6 p-3 sm:p-4 lg:p-5 bg-green-500/20 border-l-2 sm:border-l-4 border-green-500 rounded-lg sm:rounded-xl backdrop-blur-sm"
                >
                  <div className="flex items-start text-green-200 font-semibold text-sm sm:text-base lg:text-lg mb-2 sm:mb-3">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="mr-2 sm:mr-3 lg:mr-4 flex-shrink-0 mt-0.5"
                    >
                      <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-green-400" />
                    </motion.div>
                    <span className="break-words">Successfully analyzed {result.rowsAnalyzed} rows!</span>
                  </div>
                  {result.fieldsCreated && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex flex-col sm:flex-row sm:items-center text-green-300 text-xs sm:text-sm lg:text-base ml-6 sm:ml-8 lg:ml-12"
                    >
                      <div className="flex items-center mb-2 sm:mb-0">
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          className="mr-2 sm:mr-3 flex-shrink-0"
                        >
                          <Palette className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-400" />
                        </motion.div>
                        <span className="font-medium whitespace-nowrap">Auto-created fields:</span>
                      </div>
                      <div className="sm:ml-2">
                        <span className="inline-block px-2 sm:px-3 py-1 bg-green-500/30 rounded-full font-semibold text-xs sm:text-sm break-all">
                          {result.fieldsCreated.join(", ")}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </main>
  );
}