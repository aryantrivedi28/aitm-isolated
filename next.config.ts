import type { NextConfig } from "next";

/**
 * Add cdn.sanity.io under images.domains to allow next/image to load Sanity images
 */
const nextConfig: NextConfig = {
  images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'cdn.sanity.io',
    },
  ],
}
};


export default nextConfig;
