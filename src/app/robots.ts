import type { MetadataRoute } from "next";
import { INDEXING_ENABLED, SITE } from "@/lib/site";

// Indexing stays off (previews, the vercel.app URL and pre-launch) until
// NEXT_PUBLIC_SITE_INDEXING=on is set for the launch deployment.
export default function robots(): MetadataRoute.Robots {
  if (!INDEXING_ENABLED) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    sitemap: `${SITE.url.replace(/\/$/, "")}/sitemap.xml`,
  };
}
