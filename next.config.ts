import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Disable default image optimization
  },
  assetPrefix: isProd ? "/cathodle/" : "",
  basePath: isProd ? "/cathodle" : "",
  output: "export",
};

export default nextConfig;
