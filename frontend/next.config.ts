import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheMaxMemorySize: 52428800, // Limit in-memory cache to 50MB to reduce RAM usage
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tr.rbxcdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.rbxcdn.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
