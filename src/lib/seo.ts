// FILE: lib/seo.ts
// Purpose: Single source of truth for site-wide SEO/social metadata — canonical
//          URL, brand title/description, the official Open Graph / Twitter share
//          image, JSON-LD structured data, and a helper that builds per-page
//          metadata so every route carries the same OG image while keeping its
//          own search/share title + description.
// Layer: shared metadata (server-importable).
// Note: Setting `openGraph` on a page *replaces* the layout's (metadata is
//       shallow-merged), so any page that customizes it must re-include the
//       image. `pageMetadata` keeps that DRY. Fields the pages don't set
//       (robots, keywords, authors, metadataBase…) are inherited from the root
//       layout.

import type { Metadata } from "next";

/** Canonical production origin. */
export const SITE_URL = "https://trysynara.com";

export const SITE_NAME = "Synara";

/** Search/share title (~55 chars) — brand first, then high-intent keywords. */
export const SITE_TITLE = "Synara — Code with Claude Code, Codex, Gemini & Cursor";

/** Meta description (~155 chars) — front-loaded keywords + the core value prop. */
export const SITE_DESCRIPTION =
  "Synara is a free, open-source desktop app for coding with AI agents — Claude Code, Codex, Gemini, Cursor and more — using the subscriptions you already pay for.";

/** The official 1200×600 share image, served from public/og.png. */
export const OG_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 600,
  alt: "Synara — the best way to code with the AI subscriptions you already pay for",
};

/**
 * schema.org structured data (Organization + WebSite + SoftwareApplication).
 * Rendered once in the root layout so it applies to every route. Helps Google
 * understand the brand and surface a richer result for the app.
 */
export const SITE_JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/synara-icon.png`,
      sameAs: [
        "https://github.com/Emanuele-web04/dpcode",
        "https://x.com/emanueledpt",
        "https://youtube.com/@emanueledpt",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#app`,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      image: `${SITE_URL}/og.png`,
      downloadUrl: `${SITE_URL}/install`,
      operatingSystem: "macOS, Windows, Linux",
      applicationCategory: "DeveloperApplication",
      isAccessibleForFree: true,
      license: "https://opensource.org/licenses/MIT",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      author: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export function pageMetadata({
  title,
  description,
  path = "/",
}: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      url: path,
      title,
      description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@emanueledpt",
      images: [OG_IMAGE],
    },
  };
}
