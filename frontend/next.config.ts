import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
