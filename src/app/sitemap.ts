import type { MetadataRoute } from "next";
import { coinProfiles } from "@/features/onchain/coin-profiles";
import { lessons } from "@/content/lessons/seed";
import { glossaryTerms } from "@/content/glossary/seed";
import { siteUrl, staticRoutes } from "@/config/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const lessonRoutes = lessons.map((lesson) => `/learn/${lesson.slug}`);
  const glossaryRoutes = glossaryTerms.map((term) => `/glossary/${term.id}`);
  const coinRoutes = coinProfiles.map((profile) => `/coins/${profile.symbol}`);

  return Array.from(new Set([...staticRoutes, ...lessonRoutes, ...glossaryRoutes, ...coinRoutes])).map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "/" ? "daily" : "weekly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
