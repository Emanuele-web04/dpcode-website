// FILE: robots.ts
// Purpose: Generates /robots.txt — allow all crawlers and point them at the sitemap.
// Layer: Next.js metadata route.

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
