import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://naviz.me";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/fun", "/about"].map((path, i) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: i === 0 ? 1 : 0.7,
  }));
}
