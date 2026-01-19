import "./globals.css";
import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import GoogleAnalytics from "../components/GoogleAnalytic";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.finzie.co"),

  title: "Finzie | Shopify Development & GoHighLevel CRM Experts",

  description:
    "Finzie helps businesses scale with high-converting Shopify stores and powerful GoHighLevel CRM automation. We build, customize, and optimize Shopify & GHL for growth-focused brands.",

  alternates: {
    canonical: "/",
  },

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
        <GoogleAnalytics />
        <Header />
        <main className="flex-grow">{children}</main>
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
