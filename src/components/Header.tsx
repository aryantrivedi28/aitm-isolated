"use client";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const router = useRouter();
  const pathname = usePathname() || "";

  // ✅ All hooks called first
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let lastHideY = 0;

    const handleScroll = () => {
      const y = window.scrollY;
      if (y > lastScrollY) {
        if (y > 100 && isVisible) {
          setIsVisible(false);
          lastHideY = y;
        }
      } else {
        const reversed = lastHideY - y;
        if ((y < 50 || reversed > 250) && !isVisible) {
          setIsVisible(true);
        }
      }
      setIsScrolled(y > 50);
      lastScrollY = y;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isVisible]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsMobileMenuOpen(false);
  };

  // ✅ Conditional rendering happens AFTER all hooks
  if (
    (pathname.startsWith("/h") && pathname !== "/how-we-work" && pathname !== "/hiring") ||
    (pathname.startsWith("/case-studies/") && pathname !== "/case-studies") ||
    (pathname.startsWith("/form/") && pathname !== "/form") ||
    (pathname.startsWith("/find-talent/") && pathname !== "/find-talent") ||
    (pathname.startsWith("/get-hired/") && pathname !== "/get-hired") ||
    (pathname.startsWith("/freelancer/") && pathname !== "/freelancer")
  ) {
    return null;
  }


  return (
    <>
      <div
        className={`header-section fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${isVisible ? "translate-y-0" : "-translate-y-32"
          }`}
      >

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 max-w-[1400px]">
          <div
            className={`mt-4 sm:mt-6 rounded-2xl transition-all duration-300`}
          >
            {/* Main Header */}
            <div className="relative flex justify-between items-center px-1 sm:px-6 lg:px-8 py-4">

              {/* Logo */}
              <div
                className="flex items-center cursor-pointer hover:opacity-80 transition-opacity duration-300 group"
                onClick={() => handleNavigation("/")}
              >
                <div className="relative">
                  <img
                    src="/finzie-logo2.png"
                    alt="Finzie Logo"
                    width={60}
                    height={60}
                    className="rounded-lg w-14 h-14 sm:w-13 sm:h-13 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span
                  className="font-bold text-[#241C15]"
                  style={{ fontSize: '1.25rem', letterSpacing: '-0.01em' }}
                >
                  Finzie
                </span>

              </div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-1 text-end">
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
                    className="text-[#241C15]/80 hover:text-[#241C15] font-medium cursor-pointer transition-all duration-200 relative group px-4 py-2.5 rounded-sm hover:bg-[#FFE01B]/70"
                    style={{ fontSize: '1rem', fontWeight: '600' }}
                  >
                    {item}
                    <span className="absolute bottom-1 left-4 w-0 h-[2px] bg-[#241C15]/50 transition-all duration-300 group-hover:w-[calc(100%-32px)]"></span>
                  </a>
                ))}
              </nav>

              {/* CTA Button - Desktop */}
              {/* <button
                onClick={() => handleNavigation("/contact")}
                className="hidden lg:flex items-center bg-[#FFE01B] hover:bg-[#FCD34D] text-[#241C15] font-semibold px-6 py-2.5 rounded-full transition-all duration-300 hover:scale-[1.02] shadow-sm hover:shadow-md"
                style={{ fontSize: '0.9375rem', fontWeight: '600' }}
              >
                Get Started
              </button> */}

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2.5 rounded-xl hover:bg-[#fbf5e5]/10 transition-all duration-300 border border-[#241C15]/10"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-[#241C15]" />
                ) : (
                  <Menu className="w-5 h-5 text-[#241C15]" />
                )}
              </button>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
              <div className="lg:hidden border-t border-[#241C15]/10 bg-white/95 backdrop-blur-xl rounded-b-2xl mb-2">
                <nav className="px-2 py-4 space-y-1">
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
                      className="block text-[#241C15]/80 hover:text-[#241C15] hover:bg-[#fbf5e5] font-medium py-3 px-2 cursor-pointer transition-all duration-200 rounded-lg"
                      style={{ fontSize: '0.9375rem', fontWeight: '500' }}
                    >
                      {item}
                    </a>
                  ))}

                  {/* CTA Button - Mobile */}
                  {/* <button
                    onClick={() => handleNavigation("/contact")}
                    className="w-full mt-3 bg-[#FFE01B] hover:bg-[#FCD34D] text-[#241C15] font-semibold py-3 px-4 rounded-lg transition-all duration-300"
                    style={{ fontSize: '0.9375rem', fontWeight: '600' }}
                  >
                    Get Started
                  </button> */}
                </nav>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-[#fbf5e5] backdrop-blur-sm -z-10"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </div>
    </>
  )
}