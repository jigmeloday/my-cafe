import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // helps catch potential issues
  swcMinify: true,       // faster minification with SWC
  images: {
    domains: [
      "images.unsplash.com", // allow banner images from Unsplash
    ],
  }
};

export default nextConfig;
