import type { NextConfig } from "next";
import { legacyRedirects } from "./src/content/redirects";

const indexing = process.env.NEXT_PUBLIC_SITE_INDEXING === "on";

const nextConfig: NextConfig = {
  images: {
    // Temporary placeholder photography only. Remove once real photos are in /public.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  async redirects() {
    return legacyRedirects;
  },
  async headers() {
    const security = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ];
    return [
      {
        source: "/:path*",
        headers: indexing
          ? security
          : [...security, { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
      },
    ];
  },
};

export default nextConfig;
