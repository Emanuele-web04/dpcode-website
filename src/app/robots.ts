// FILE: robots.ts
// Purpose: Generates /robots.txt for search, AI discovery, and sitemap hints.
// Layer: Next.js metadata route.

import type { MetadataRoute } from "next";
import { AI_SEARCH_USER_AGENTS, SITE_URL, absoluteUrl } from "@/lib/seo";
import { SITEMAP_PATHS } from "@/lib/siteRoutes";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/llms.txt", "/llms-full.txt", "/ai.txt"],
        disallow: ["/api/"],
      },
      ...AI_SEARCH_USER_AGENTS.map((userAgent) => ({
        userAgent,
        allow: ["/", "/llms.txt", "/llms-full.txt", "/ai.txt"],
        disallow: ["/api/"],
      })),
    ],
    sitemap: [absoluteUrl("/sitemap-index.xml"), ...SITEMAP_PATHS.map(absoluteUrl)],
    host: SITE_URL,
  };
}
