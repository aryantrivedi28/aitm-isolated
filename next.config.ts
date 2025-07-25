import type { NextConfig } from "next";

/**
 * Add cdn.sanity.io under images.domains to allow next/image to load Sanity images
 */
const nextConfig: NextConfig = {
  images: {
    domains: ["cdn.sanity.io"],
  },
};


export default nextConfig;
