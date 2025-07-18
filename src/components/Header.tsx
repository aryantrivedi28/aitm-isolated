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
    setIsMobileMenuOpen(false) // Close mobile menu after navigation
  }

  return (
    <div className="w-full bg-[#241C15] text-white relative">
      {/* Main Header */}
      <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4">
        {/* Logo */}
        <div className="flex items-center cursor-pointer space-x-2" onClick={() => handleNavigation("/")}>
          <img
            src="/finzie-logo.png"
            alt="Finzie Logo"
            width={36}
            height={36}
            className="rounded-md w-8 h-8 sm:w-9 sm:h-9"
          />
          <span className="font-bold text-lg sm:text-xl text-white hidden sm:block">Finzie</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-3 lg:space-x-4">
          <button
            onClick={() => handleNavigation("/about")}
            className="bg-[#FFE01B] hover:bg-yellow-300 text-[#241C15] font-semibold px-4 lg:px-6 py-2 rounded-lg transition-all duration-200 text-sm lg:text-base"
          >
            About Us
          </button>
          <button
            onClick={() => handleNavigation("/case-studies")}
            className="text-[#241C15] bg-[#FFE01B] hover:bg-yellow-300 font-semibold px-4 lg:px-6 py-2 rounded-lg transition-all duration-200 text-sm lg:text-base"
          >
            Case Studies
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6 text-[#FFE01B]" /> : <Menu className="w-6 h-6 text-[#FFE01B]" />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#241C15] border-t border-[#FFE01B]/20 shadow-lg z-50">
          <div className="px-4 py-4 space-y-3">
            <button
              onClick={() => handleNavigation("/about")}
              className="w-full bg-[#FFE01B] hover:bg-yellow-300 text-[#241C15] font-semibold px-6 py-3 rounded-lg transition-all duration-200 text-left"
            >
              About Us
            </button>
            <button
              onClick={() => handleNavigation("/case-studies")}
              className="w-full text-[#241C15] bg-[#FFE01B] hover:bg-yellow-300 font-semibold px-6 py-3 rounded-lg transition-all duration-200 text-left"
            >
              Case Studies
            </button>

            {/* Additional menu items (commented out in original) */}
            {/*
            <button
              onClick={() => handleNavigation('/why')}
              className="w-full bg-[#FFE01B] hover:bg-yellow-300 text-[#241C15] font-semibold px-6 py-3 rounded-lg transition-all duration-200 text-left"
            >
              Why Us
            </button>
            <button
              onClick={() => handleNavigation('/services')}
              className="w-full bg-[#FFE01B] hover:bg-yellow-300 text-[#241C15] font-semibold px-6 py-3 rounded-lg transition-all duration-200 text-left"
            >
              Services
            </button>
            */}
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/20 z-40" onClick={() => setIsMobileMenuOpen(false)} />
      )}
    </div>
  )
}
