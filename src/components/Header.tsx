"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export default function Header() {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleNavigation = (path: string) => {
    router.push(path)
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="
  fixed top-4 left-1/2 -translate-x-1/2
  w-[90%] max-w-6xl
  bg-white/20 backdrop-blur-md border border-white/20
  shadow-lg shadow-black/20
  rounded-lg
  z-50
">

      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 pointer-events-none"></div>

      {/* Main Header */}
      <div className="relative flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4">
        {/* Logo */}
        <div
          className="flex items-center cursor-pointer space-x-3 hover:opacity-80 transition-all duration-300 group"
          onClick={() => handleNavigation("/")}
        >
          <div className="relative">
            <img
              src="/finzie-logo.png"
              alt="Finzie Logo"
              width={40}
              height={40}
              className="rounded-lg w-10 h-10 group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <span className="font-bold text-xl text-black hidden sm:block">Finzie</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a
            onClick={() => handleNavigation("/")}
            className="text-black/90 hover:text-[#FFE01B] font-medium cursor-pointer transition-all duration-300 relative group text-lg px-3 py-2 rounded-lg hover:bg-white/5"
          >
            Home
            <span className="absolute -bottom-1 left-3 w-0 h-0.5 bg-[#FFE01B] transition-all duration-300 group-hover:w-[calc(100%-24px)]"></span>
          </a>
          <a
            onClick={() => handleNavigation("/about")}
            className="text-black/90 hover:text-[#FFE01B] font-medium cursor-pointer transition-all duration-300 relative group text-lg px-3 py-2 rounded-lg hover:bg-white/5"
          >
            About Us
            <span className="absolute -bottom-1 left-3 w-0 h-0.5 bg-[#FFE01B] transition-all duration-300 group-hover:w-[calc(100%-24px)]"></span>
          </a>
          <a
            onClick={() => handleNavigation("/case-studies")}
            className="text-black/90 hover:text-[#FFE01B] font-medium cursor-pointer transition-all duration-300 relative group text-lg px-3 py-2 rounded-lg hover:bg-white/5"
          >
            Case Studies
            <span className="absolute -bottom-1 left-3 w-0 h-0.5 bg-[#FFE01B] transition-all duration-300 group-hover:w-[calc(100%-24px)]"></span>
          </a>
          <a
            onClick={() => handleNavigation("/services")}
            className="text-black/90 hover:text-[#FFE01B] font-medium cursor-pointer transition-all duration-300 relative group text-lg px-3 py-2 rounded-lg hover:bg-white/5"
          >
            Services
            <span className="absolute -bottom-1 left-3 w-0 h-0.5 bg-[#FFE01B] transition-all duration-300 group-hover:w-[calc(100%-24px)]"></span>
          </a>
          <a
            onClick={() => handleNavigation("/contact")}
            className="bg-[#FFE01B]/90 hover:bg-[#FFE01B] backdrop-blur-sm text-black font-semibold px-6 py-2.5 rounded-lg transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[#FFE01B]/20 hover:scale-105 border border-[#FFE01B]/20"
          >
            Contact Us
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm border border-white/10"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6 text-[#FFE01B]" /> : <Menu className="w-6 h-6 text-white" />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white backdrop-blur-xl border-t border-white/10 shadow-2xl shadow-black/20">
          {/* Glass effect overlay for mobile menu */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-transparent pointer-events-none"></div>

          <nav className="relative px-6 py-6 space-y-2">
            <a
              onClick={() => handleNavigation("/about")}
              className="block text-black/90 hover:text-[#FFE01B] hover:bg-white/10 font-semibold py-3 px-4 cursor-pointer transition-all duration-300 rounded-lg backdrop-blur-sm border border-transparent hover:border-white/10"
            >
              About Us
            </a>
            <a
              onClick={() => handleNavigation("/case-studies")}
              className="block text-black/90 hover:text-[#FFE01B] hover:bg-white/10 font-semibold py-3 px-4 cursor-pointer transition-all duration-300 rounded-lg backdrop-blur-sm border border-transparent hover:border-white/10"
            >
              Case Studies
            </a>
            <a
              onClick={() => handleNavigation("/services")}
              className="block text-black/90 hover:text-[#FFE01B] hover:bg-white/10 font-semibold py-3 px-4 cursor-pointer transition-all duration-300 rounded-lg backdrop-blur-sm border border-transparent hover:border-white/10"
            >
              Services
            </a>
            <div className="pt-4">
              <a
                onClick={() => handleNavigation("/contact")}
                className="block bg-[#FFE01B]/90 hover:bg-[#FFE01B] backdrop-blur-sm text-black font-semibold py-3 px-4 rounded-lg transition-all duration-300 cursor-pointer text-center shadow-lg hover:shadow-[#FFE01B]/20 border border-[#FFE01B]/20"
              >
                Contact Us
              </a>
            </div>
          </nav>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  )
}
