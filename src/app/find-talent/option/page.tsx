"use client"

import { Briefcase, Users, ArrowRight, Sparkles } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"   // ✅ import useRouter

export default function OptionsPage() {
  const [hoveredOption, setHoveredOption] = useState(null)
  const router = useRouter() // ✅ initialize router

  const handleNavigation = (path: string) => {
    router.push(path) // ✅ navigate to the given path
  }

  return (
    <>
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(30px, -30px); }
          66% { transform: translate(-20px, 20px); }
        }

        @keyframes floatReverse {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(-30px, 30px); }
          66% { transform: translate(20px, -20px); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.6; }
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-float { animation: float 20s ease-in-out infinite; }
        .animate-floatReverse { animation: floatReverse 25s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse 3s ease-in-out infinite; }
        .animate-slideIn { animation: slideIn 0.6s ease-out forwards; }
      `}</style>

      <div className="options-page flex flex-col items-center justify-center min-h-screen bg-[#fbf5e5] p-6 relative overflow-hidden pt-[100px] sm:pt-[120px]">

        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 right-10 w-64 h-64 bg-[#FFE01B]/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-[#FCD34D]/10 rounded-full blur-3xl animate-floatReverse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FFE01B]/5 rounded-full blur-3xl animate-pulse-slow" />
        </div>

        {/* Main Card */}
        <div className="p-8 sm:p-10 md:p-12 rounded-3xl w-full max-w-5xl text-center border-2 border-[#241C15]/10 relative overflow-hidden animate-slideIn">

          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#FFE01B]/20 to-transparent rounded-bl-full" />

          <div className="inline-flex items-center gap-2 bg-[#241C15] px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-[#FFE01B]" />
            <span className="text-sm font-semibold text-[#fbf5e5]">Hiring Options</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#241C15] mb-3 leading-tight">
            Choose Your
            <span className="block bg-gradient-to-r from-[#FFE01B] to-[#FCD34D] bg-clip-text text-transparent mt-1">
              Hiring Path
            </span>
          </h1>
          <p className="text-[#241C15]/70 mb-10 text-base sm:text-lg font-medium max-w-md mx-auto">
            Select the best option for your hiring needs
          </p>

          {/* Options Container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {/* Direct Hiring */}
            <button
              onClick={() => handleNavigation("/find-talent/direct-hiring")}
              onMouseLeave={() => setHoveredOption(null)}
              className="group relative flex items-center justify-between gap-4 bg-gradient-to-r from-[#FFE01B] to-[#FCD34D] hover:from-[#FCD34D] hover:to-[#FFE01B] text-[#241C15] font-bold px-6 sm:px-8 py-5 sm:py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-center gap-4 z-10">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Briefcase className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg sm:text-xl font-black">Direct Hiring</h3>
                  <p className="text-sm text-[#241C15]/80 font-medium">Find and hire talent directly</p>
                </div>
              </div>
              <ArrowRight className={`w-6 h-6 transition-transform duration-300 z-10 ${hoveredOption === 'direct' ? 'translate-x-1' : ''}`} />
            </button>

            {/* Assisted Hiring */}
            <button
              onClick={() => handleNavigation("/find-talent/assisted-hiring")}
              onMouseLeave={() => setHoveredOption(null)}
              className="group relative flex items-center justify-between gap-4 bg-white border-2 border-[#241C15]/20 hover:border-[#FFE01B] text-[#241C15] font-bold px-6 sm:px-8 py-5 sm:py-6 rounded-2xl w-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFE01B]/5 to-[#FCD34D]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-center gap-4 z-10">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#FFE01B]/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg sm:text-xl font-black">Assisted Hiring</h3>
                  <p className="text-sm text-[#241C15]/70 font-medium">Get expert help with hiring</p>
                </div>
              </div>
              <ArrowRight className={`w-6 h-6 transition-transform duration-300 z-10 ${hoveredOption === 'assisted' ? 'translate-x-1' : ''}`} />
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-10 left-10 w-4 h-4 bg-[#FFE01B] rounded-full animate-pulse-slow" />
        <div className="absolute top-20 right-20 w-3 h-3 bg-[#FCD34D] rounded-full animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>
    </>
  )
}
