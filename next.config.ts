import type { NextConfig } from "next";

const mediaRemotePatterns = (process.env.MEDIA_PUBLIC_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean)
  .flatMap((origin) => {
    const url = new URL(origin);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      throw new Error("MEDIA_PUBLIC_ORIGINS must contain HTTP(S) origins");
    }
    return ["profiles", "news"].map((folder) => ({
      protocol: url.protocol.slice(0, -1) as "http" | "https",
      hostname: url.hostname,
      port: url.port,
      pathname: `/media/*/public/${folder}/**`,
    }));
  });

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
