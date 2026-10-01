import type { MetadataRoute } from "next";
import { business, navLinks } from "@/data/business";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...navLinks.map((l) => l.href), "/order"];
  return paths.map((p) => ({
    url: `${business.siteUrl}${p === "/" ? "" : p}`,
    changeFrequency: "monthly",
    priority: p === "/" ? 1 : 0.7,
  }));
}
