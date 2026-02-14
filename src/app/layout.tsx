import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="EfV2568DpyF64Bws5YuvSFt27yTqwBWqx04B040SMq0" />
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-PB5LKB68');
            `,
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body className="min-h-screen flex flex-col bg-[#fbf5e5] font-sans">

        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PB5LKB68"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {/* <GoogleAnalytics /> */}
        <Header />
        <main className="flex-grow">{children}</main>
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
