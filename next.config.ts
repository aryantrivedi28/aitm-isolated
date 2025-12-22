import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
    unoptimized: true,
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "50mb", // ✅ REQUIRED for PDF uploads
    },
  },
};

export default nextConfig;
