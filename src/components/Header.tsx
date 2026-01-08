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

  /* ----------------------------------
     Scroll hide / show logic (UNCHANGED)
  -----------------------------------*/
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

  /* ----------------------------------
     EXISTING hidden route logic
  -----------------------------------*/
  const hiddenRoutes = [
    "/h/",
    "/case-studies/",
    "/form/",
    "/find-talent/",
    "/get-hired/",
    "/freelancer/",
  ];

  const allowedExceptions = [
    "/how-we-work",
    "/hiring",
    "/case-studies",
    "/form",
    "/find-talent",
    "/get-hired",
    "/freelancer",
  ];

  /* ----------------------------------
     NEW: Landing page detection
  -----------------------------------*/
  const LANDING_SLUGS = ["gohighlevel-crm", "shopify", "seo", "webflow", "ai"];

  const isLandingPage =
    pathname.split("/").length === 2 &&
    LANDING_SLUGS.includes(pathname.replace("/", ""));

  /* ----------------------------------
     FINAL hide condition (MERGED)
  -----------------------------------*/
  const shouldHideHeader =
    pathname
      ? hiddenRoutes.some((route) => {
          if (
            pathname.startsWith(route.slice(0, -1)) &&
            !allowedExceptions.includes(pathname)
          ) {
            return true;
          }
          return false;
        }) || isLandingPage
      : false;

  if (shouldHideHeader) {
    return null;
  }

  /* ----------------------------------
     RENDER
  -----------------------------------*/
  return (
    <>
      <div
        className={`header-section fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-32"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 max-w-[1400px]">
          <div className="mt-4 sm:mt-6 rounded-2xl transition-all duration-300">
            {/* Main Header */}
            <div className="relative flex justify-between items-center px-1 sm:px-6 lg:px-8 py-4">
              {/* Logo */}
              <div
                className="flex items-center cursor-pointer hover:opacity-80 transition-opacity duration-300 group"
                onClick={() => handleNavigation("/")}
              >
                <img
                  src="/finzie-logo2.png"
                  alt="Finzie Logo"
                  width={60}
                  height={60}
                  className="rounded-lg group-hover:scale-105 transition-transform duration-300"
                />
                <span
                  className="font-medium text-[#050504]"
                  style={{ fontSize: "1.375rem", letterSpacing: "-0.01em" }}
                >
                  Finzie
                </span>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-1">
                {[
                  "Home",
                  "About Us",
                  "Case Studies",
                  "Find Talent",
                  "Get Hired",
                ].map((item, idx) => (
                  <a
                    key={idx}
                    onClick={() =>
                      handleNavigation(
                        item === "Home"
                          ? "/"
                          : "/" + item.toLowerCase().replace(/\s+/g, "-")
                      )
                    }
                    className="text-[#050504]/80 hover:text-[#050504] font-semibold cursor-pointer px-4 py-2.5 relative group"
                  >
                    {item}
                    <span className="absolute bottom-1 left-4 w-0 h-[2px] bg-[#f7af00] transition-all duration-300 group-hover:w-[calc(100%-32px)]"></span>
                  </a>
                ))}
              </nav>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2.5 rounded-xl border border-[#241C15]/10"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-[#241C15]" />
                ) : (
                  <Menu className="w-5 h-5 text-[#241C15]" />
                )}
              </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="lg:hidden border-t bg-[#fbf5e5] rounded-b-2xl">
                <nav className="px-2 py-4 space-y-1">
                  {[
                    "Home",
                    "About Us",
                    "Case Studies",
                    "Find Talent",
                    "Get Hired",
                  ].map((item, idx) => (
                    <a
                      key={idx}
                      onClick={() =>
                        handleNavigation(
                          item === "Home"
                            ? "/"
                            : "/" + item.toLowerCase().replace(/\s+/g, "-")
                        )
                      }
                      className="block py-3 px-2 rounded-lg font-medium"
                    >
                      {item}
                    </a>
                  ))}
                </nav>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 -z-10"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </div>
    </>
  );
}
