// FILE: lib/siteRoutes.ts
// Purpose: Defines canonical crawl targets shared by sitemap routes and LLM docs.
// Layer: server utility.

import type { MetadataRoute } from "next";
import { getSortedReleases, toVersionSlug } from "@/lib/changelog";
import { releaseDate, SITE_LATEST_UPDATE, PRIVACY_LAST_UPDATED } from "@/lib/releaseDates";
import { absoluteUrl, SITE_IMAGES } from "@/lib/seo";

export const SITEMAP_PATHS = ["/sitemap.xml", "/changelog/sitemap.xml"] as const;

const staticRoutes = [
  {
    path: "/",
    lastModified: SITE_LATEST_UPDATE,
    changeFrequency: "daily",
    priority: 1,
    images: [
      absoluteUrl(SITE_IMAGES.og),
      absoluteUrl(SITE_IMAGES.lightScreenshot),
      absoluteUrl(SITE_IMAGES.darkScreenshot),
    ],
  },
  {
    path: "/install",
    lastModified: SITE_LATEST_UPDATE,
    changeFrequency: "daily",
    priority: 0.95,
    images: [absoluteUrl(SITE_IMAGES.og)],
  },
  {
    path: "/changelog",
    lastModified: SITE_LATEST_UPDATE,
    changeFrequency: "daily",
    priority: 0.8,
    images: [absoluteUrl(SITE_IMAGES.og)],
  },
  {
    path: "/privacy",
    lastModified: PRIVACY_LAST_UPDATED,
    changeFrequency: "yearly",
    priority: 0.35,
    images: [absoluteUrl(SITE_IMAGES.og)],
  },
  {
    path: "/llms.txt",
    lastModified: SITE_LATEST_UPDATE,
    changeFrequency: "weekly",
    priority: 0.25,
  },
  {
    path: "/llms-full.txt",
    lastModified: SITE_LATEST_UPDATE,
    changeFrequency: "weekly",
    priority: 0.2,
  },
  {
    path: "/ai.txt",
    lastModified: SITE_LATEST_UPDATE,
    changeFrequency: "weekly",
    priority: 0.2,
  },
] satisfies Array<
  Omit<MetadataRoute.Sitemap[number], "url"> & { path: string }
>;

export function getStaticSitemapEntries(): MetadataRoute.Sitemap {
  return staticRoutes.map(({ path, ...entry }) => ({
    ...entry,
    url: absoluteUrl(path),
  }));
}

export function getChangelogSitemapEntries(): MetadataRoute.Sitemap {
  return getSortedReleases().map((entry) => ({
    url: absoluteUrl(`/changelog/${toVersionSlug(entry.version)}`),
    lastModified: releaseDate(entry.date),
    changeFrequency: "monthly",
    priority: entry.version.startsWith("0.1.") ? 0.7 : 0.55,
    images: entry.heroImage ? [absoluteUrl(entry.heroImage)] : [absoluteUrl(SITE_IMAGES.og)],
  }));
}
