import type { MetadataRoute } from "next";
import { allProjects, services } from "@/content";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base = SITE.url.replace(/\/$/, "");
  const fixed = ["", "/work", "/services", "/studio", "/founder", "/approach", "/contact", "/start-a-project", "/privacy"].map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : 0.8,
  }));
  return [
    ...fixed,
    ...services.map((s) => ({ url: `${base}/services/${s.slug}`, lastModified: now, priority: 0.7 })),
    ...allProjects().map((p) => ({ url: `${base}/work/${p.slug}`, lastModified: now, priority: 0.6 })),
  ];
}
