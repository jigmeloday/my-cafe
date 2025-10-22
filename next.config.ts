import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // helps catch potential issues
  images: {
    domains: [
      "images.unsplash.com", // allow banner images from Unsplash
      "res.cloudinary.com",
    ],
  }
};

export default nextConfig;
