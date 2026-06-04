// FILE: sitemap.ts
// Purpose: Generates /sitemap.xml for search engines, listing the public routes.
// Layer: Next.js metadata route.

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { getSortedReleases, toVersionSlug } from "@/lib/changelog";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  // One entry per shareable release URL, e.g. /changelog/v0.1.1.
  const releaseRoutes: MetadataRoute.Sitemap = getSortedReleases().map(
    (entry) => ({
      url: `${SITE_URL}/changelog/${toVersionSlug(entry.version)}`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    }),
  );

  return [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    {
      url: `${SITE_URL}/install`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/changelog`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...releaseRoutes,
    {
      url: `${SITE_URL}/privacy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
