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
    <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] sm:w-[90%] max-w-7xl bg-white backdrop-blur-md border border-white/20 shadow-lg shadow-black/20 rounded-lg z-50">

      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 pointer-events-none"></div>

      {/* Main Header */}
      <div className="relative flex justify-between items-center px-4 sm:px-6 lg:px-8 py-3">
        {/* Logo */}
        <div
          className="flex items-center cursor-pointer space-x-2 sm:space-x-3 hover:opacity-80 transition-all duration-300 group"
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
          <span className="font-bold text-lg sm:text-xl text-black hidden xs:block">Finzie</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          {["Home", "About Us", "Case Studies", "Find Talent", "Get Hired"].map((item, idx) => (
            <a
              key={idx}
              onClick={() =>
                handleNavigation(
                  item === "Home"
                    ? "/"
                    : "/" + item.toLowerCase().replace(/\s+/g, "-")
                )
              }
              className="text-black/90 hover:text-[#FFE01B] font-medium cursor-pointer transition-all duration-300 relative group text-lg px-3 py-2 rounded-lg hover:bg-white/5"
            >
              {item}
              <span className="absolute -bottom-1 left-3 w-0 h-0.5 bg-[#FFE01B] transition-all duration-300 group-hover:w-[calc(100%-24px)]"></span>
            </a>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden p-3 rounded-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm border border-white/10"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-[#FFE01B]" />
          ) : (
            <Menu className="w-6 h-6 text-white" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white backdrop-blur-xl border-t border-white/10 shadow-2xl shadow-black/20 rounded-b-3xl">
          {/* Glass effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-transparent pointer-events-none"></div>

          <nav className="relative px-6 py-6 space-y-2">
            {["About Us", "Case Studies", "Find Talent", "Get Hired"].map((item, idx) => (
              <a
                key={idx}
                onClick={() =>
                  handleNavigation("/" + item.toLowerCase().replace(/\s+/g, "-"))
                }
                className="block text-black/90 hover:text-[#FFE01B] hover:bg-white/10 font-semibold py-3 px-4 cursor-pointer transition-all duration-300 rounded-lg backdrop-blur-sm border border-transparent hover:border-white/10"
              >
                {item}
              </a>
            ))}
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
