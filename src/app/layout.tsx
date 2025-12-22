import "./globals.css";
import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import GoogleAnalytics from "../components/GoogleAnalytic";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Finzie",
  description: "",
  icons: {
    icon: "/finzie-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#fbf5e5] font-sans">
        {/* ✅ Google Analytics should be loaded client-side */}
        <GoogleAnalytics />

        {/* ✅ Header should always appear at top */}
        <Header />

        {/* ✅ Page transition wrapper */}
          <main className="flex-grow">{children}</main>

        {/* ✅ Toast notifications */}
        <Toaster />

        {/* ✅ Footer at bottom */}
        <Footer />
      </body>
    </html>
  );
}
