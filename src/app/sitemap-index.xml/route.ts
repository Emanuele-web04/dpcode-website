// FILE: sitemap-index.xml/route.ts
// Purpose: Serves a sitemap index so Search Console can discover all sitemap files.
// Layer: App Router route handler.

import { SITEMAP_PATHS } from "@/lib/siteRoutes";
import { absoluteUrl } from "@/lib/seo";
import { SITE_LATEST_UPDATE } from "@/lib/releaseDates";

export const revalidate = 86400;

export function GET() {
  const lastmod = SITE_LATEST_UPDATE.toISOString();
  const entries = SITEMAP_PATHS.map(
    (path) => `  <sitemap><loc>${absoluteUrl(path)}</loc><lastmod>${lastmod}</lastmod></sitemap>`,
  ).join("\n");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</sitemapindex>\n`,
    {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    },
  );
}
