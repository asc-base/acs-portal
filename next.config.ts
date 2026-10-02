import type { NextConfig } from "next";

const mediaRemotePatterns = (process.env.MEDIA_PUBLIC_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean)
  .map((origin) => {
    const url = new URL(origin);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      throw new Error("MEDIA_PUBLIC_ORIGINS must contain HTTP(S) origins");
    }
    return {
      protocol: url.protocol.slice(0, -1) as "http" | "https",
      hostname: url.hostname,
      port: url.port,
      pathname: "/media/*/public/profiles/**",
    };
  });

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    // Remote patterns for external images
    remotePatterns: [
      ...mediaRemotePatterns,
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "jmexeeugomufbqjvofhu.supabase.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "eooprolugtkiztqsnvdl.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "lrqnuqoxttosziqcsean.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "sxqybhqykgsfrqvzadzg.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "vsjmwmltpowyiodyygeh.supabase.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "fwyfpkplevtnvrxzpyhq.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "mejklhtflfggnozoflrk.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "http",
        hostname: "infra-supabase-c1c918-31-97-48-3.sslip.io",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "infra-supabase-c1c918-31-97-48-3.sslip.io",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "mejklhtflfggnozoflrk.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "yesgvzugqnxjdybieljk.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async rewrites() {
    if (process.env.NODE_ENV !== "development") return [];

    const apiUrl = process.env.API_URL?.replace(/\/+$/, "");
    if (!apiUrl) {
      throw new Error("API_URL must be set to proxy API requests in development.");
    }

    const readEndpoint = process.env.RUSTFS_READ_ENDPOINT?.replace(/\/+$/, "");
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
      ...(readEndpoint
        ? [
            {
              source: "/media/:path*",
              destination: `${readEndpoint}/:path*`,
            },
          ]
        : []),
    ];
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
