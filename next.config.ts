import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    unoptimized: true,
  },
  async rewrites() {
    if (process.env.NODE_ENV !== "development") return [];

    const apiUrl = process.env.API_URL?.replace(/\/+$/, "");
    if (!apiUrl) {
      throw new Error("API_URL must be set to proxy API requests in development.");
    }

    return [{ source: "/api/:path*", destination: `${apiUrl}/api/:path*` }];
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/home",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
