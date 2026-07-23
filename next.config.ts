import type { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";

// The canonical production host. Must match SITE_URL in src/lib/seo.ts, which is
// what every page's <link rel="canonical"> and metadataBase point at.
const CANONICAL_HOST = "www.trysynara.com";

// The stable Vercel production alias. Unlike per-deployment/preview URLs (which
// Vercel serves with `x-robots-tag: noindex`), this alias is fully indexable and
// serves the whole site with canonicals pointing to CANONICAL_HOST. Google was
// crawling it and filing every URL under "Alternate page with proper canonical
// tag" in Search Console. Redirecting it to the canonical domain removes the
// duplicate host so those pages drop out of the report.
const VERCEL_ALIAS_HOST = "dpcode-website.vercel.app";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: VERCEL_ALIAS_HOST }],
        destination: `https://${CANONICAL_HOST}/:path*`,
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX();

export default withMDX(nextConfig);
