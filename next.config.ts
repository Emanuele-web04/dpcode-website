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
  images: {
    remotePatterns: [
      // Sponsor avatars on /sponsor. GitHub serves every user avatar from this
      // host, so the pathname stays open rather than listing one id per sponsor.
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: VERCEL_ALIAS_HOST }],
        destination: `https://${CANONICAL_HOST}/:path*`,
        permanent: true,
      },
      {
        // Search Console discovered the in-app `/export` slash command as a
        // website URL. Send that legacy crawl target to the command docs.
        source: "/export",
        destination: "/docs/reference/slash-commands",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return {
      afterFiles: [
        { source: "/index.md", destination: "/llms.mdx/pages" },
        { source: "/docs.md", destination: "/llms.mdx/docs" },
        { source: "/docs/:path*.md", destination: "/llms.mdx/docs/:path*" },
        { source: "/:path*.md", destination: "/llms.mdx/pages/:path*" },
      ],
      // Only unmatched non-browser requests reach this recovery handler.
      fallback: [{
        source: "/:path*",
        destination: "/llms.mdx/pages/:path*",
        missing: [
          { type: "header", key: "accept", value: ".*[tT][eE][xX][tT]/[hH][tT][mM][lL].*" },
          { type: "header", key: "rsc", value: "1" },
        ],
      }],
    };
  },
};

const withMDX = createMDX();

export default withMDX(nextConfig);
