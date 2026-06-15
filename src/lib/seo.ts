// FILE: lib/seo.ts
// Purpose: Single source of truth for crawlable metadata, canonical URLs,
//          JSON-LD builders, crawler allow-lists, and page metadata helpers.
// Layer: shared metadata (server-importable).
// Note: Page-level `openGraph` replaces the layout's shallow-merged field, so
//       `pageMetadata` re-adds the global image anywhere a route customizes SEO.

import type { Metadata } from "next";
import { FAQ_ITEMS } from "@/data/faqs";
import { type ChangelogEntry } from "@/data/changelog";
import { releaseDateIso } from "@/lib/releaseDates";

/** Canonical production origin; keep aligned with Vercel's primary domain. */
export const SITE_URL = "https://www.trysynara.com";

export const SITE_NAME = "Synara";

export const CREATOR_NAME = "Emanuele Di Pietro";
export const CREATOR_URL = "https://emanueledipietro.com";
export const GITHUB_REPO_URL = "https://github.com/Emanuele-web04/synara";
export const GITHUB_RELEASES_URL = `${GITHUB_REPO_URL}/releases`;
export const X_PROFILE_URL = "https://x.com/emanueledpt";
export const YOUTUBE_URL = "https://youtube.com/@emanueledpt";

/** Search/share title (~55 chars) — brand first, then high-intent keywords. */
export const SITE_TITLE = "Synara — Code with Claude Code, Codex, Gemini & Cursor";

/** Meta description (~155 chars) — front-loaded keywords + the core value prop. */
export const SITE_DESCRIPTION =
  "Synara is a free, open-source desktop app for coding with AI agents — Claude Code, Codex, Gemini, Cursor and more — using the subscriptions you already pay for.";

export const SEO_KEYWORDS = [
  "Synara",
  "AI coding",
  "AI coding agents",
  "agentic coding GUI",
  "AI coding desktop app",
  "Claude Code GUI",
  "Codex GUI",
  "Gemini CLI GUI",
  "Cursor alternative",
  "OpenCode GUI",
  "AI pair programming",
  "parallel coding agents",
  "Git worktrees",
  "developer tools",
  "open source AI coding app",
];

export const AI_SEARCH_USER_AGENTS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Google-Extended",
  "Applebot",
  "Bingbot",
] as const;

/** The official 1200×600 share image, served from public/og.png. */
export const OG_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 600,
  alt: "Synara — the best way to code with the AI subscriptions you already pay for",
};

export const SITE_IMAGES = {
  icon: "/synara-icon.png",
  og: "/og.png",
  lightScreenshot: "/dpcode-ui-light.png",
  darkScreenshot: "/dpcode-ui-dark.png",
};

/** Builds an absolute production URL for metadata, sitemaps, and structured data. */
export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

/**
 * Serializes JSON-LD for a native script tag and escapes `<` as recommended by
 * the Next.js JSON-LD guide so structured data cannot break out of the script.
 */
export function jsonLdScript(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

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
      legalName: SITE_NAME,
      url: SITE_URL,
      logo: absoluteUrl(SITE_IMAGES.icon),
      image: absoluteUrl(SITE_IMAGES.og),
      founder: {
        "@type": "Person",
        name: CREATOR_NAME,
        url: CREATOR_URL,
        sameAs: [X_PROFILE_URL, YOUTUBE_URL],
      },
      sameAs: [GITHUB_REPO_URL, X_PROFILE_URL, YOUTUBE_URL, CREATOR_URL],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en-US",
      keywords: SEO_KEYWORDS.join(", "),
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#app`,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      image: absoluteUrl(SITE_IMAGES.og),
      screenshot: [
        absoluteUrl(SITE_IMAGES.lightScreenshot),
        absoluteUrl(SITE_IMAGES.darkScreenshot),
      ],
      downloadUrl: absoluteUrl("/install"),
      sameAs: GITHUB_REPO_URL,
      operatingSystem: "macOS, Windows, Linux",
      applicationCategory: "DeveloperApplication",
      applicationSubCategory: "AI coding workspace",
      isAccessibleForFree: true,
      license: "https://opensource.org/licenses/MIT",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      author: { "@id": `${SITE_URL}/#organization` },
      featureList: [
        "Run Claude Code, Codex, Gemini, OpenCode, Cursor, Grok, Kilo Code, and Pi from one desktop workspace",
        "Use existing AI subscriptions instead of a separate Synara AI plan",
        "Manage parallel coding agents with chats, terminals, worktrees, diffs, and pull request flow",
        "Keep projects local while providers receive only the session context needed for their own models and tools",
      ],
    },
  ],
};

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: {
      "@type": "Answer",
      text: answer,
    },
  })),
};

export const INSTALL_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${SITE_URL}/install#webpage`,
  name: "Download Synara",
  url: absoluteUrl("/install"),
  description:
    "Download Synara for macOS, Windows, and Linux. Synara is a free desktop app for coding with AI agents using existing provider subscriptions.",
  isPartOf: { "@id": `${SITE_URL}/#website` },
  about: { "@id": `${SITE_URL}/#app` },
  primaryImageOfPage: absoluteUrl(SITE_IMAGES.og),
  potentialAction: {
    "@type": "DownloadAction",
    target: absoluteUrl("/install"),
    object: { "@id": `${SITE_URL}/#app` },
  },
};

export function changelogCollectionJsonLd(entries: readonly ChangelogEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/changelog#collection`,
    name: "Synara changelog",
    url: absoluteUrl("/changelog"),
    description:
      "Release notes for Synara, including new AI provider support, coding workflow improvements, performance work, and installer updates.",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#app` },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: entries.map((entry, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: `Synara ${entry.version}`,
        url: absoluteUrl(`/changelog/v${entry.version}`),
      })),
    },
  };
}

export function releaseJsonLd(entry: ChangelogEntry) {
  const highlights = entry.features.map((feature) => feature.title).join(", ");
  const date = releaseDateIso(entry.date);
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": `${SITE_URL}/changelog/v${entry.version}#release-notes`,
    headline: `Synara ${entry.version} release notes`,
    name: `Synara ${entry.version} changelog`,
    url: absoluteUrl(`/changelog/v${entry.version}`),
    description: `What's new in Synara ${entry.version}: ${highlights}.`,
    image: absoluteUrl(entry.heroImage ?? SITE_IMAGES.og),
    datePublished: date,
    dateModified: date,
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    about: { "@id": `${SITE_URL}/#app` },
  };
}

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
