// FILE: lib/agentMarkdown.ts
// Purpose: Server-only source of truth for which canonical public routes can
//          render Markdown and what each representation contains (phase 1 of
//          the agent-readiness plan). Consumed by the /agent-markdown route
//          and the Accept-negotiating proxy; unknown public paths resolve to
//          null so those layers can emit a Markdown 404.
// Layer: server utility (no React, no network, no fs).
// Note: Reuses canonical product, FAQ, sponsor, changelog, SEO, and
//       documentation data. Never scrapes rendered HTML. Mirrors the data
//       imports used by lib/llmText.ts so both AI surfaces stay in sync.
//
// Stable contract for consumers:
// - `resolveMarkdown(path)` returns a MarkdownResult for a canonical public
//   route, or null when the path is unknown (the route layer 404s).
// - Every body is Markdown starting with a `# title` H1 and containing a
//   `Canonical URL: <absolute>` line plus a `Sources:` section.
// - Stable body markers (assert in smoke tests): homepage contains
//   "Supported coding-agent runtimes"; /changelog contains the newest release
//   heading "Synara 0.7.3 (Aug 21)"; /changelog/v0.7.3 starts with
//   "# Synara 0.7.3 release notes"; /install contains "Latest release build:".

import { FAQ_ITEMS } from "@/data/faqs";
import { SPONSORS } from "@/data/sponsors";
import {
  ONE_TIME_SPONSORSHIP,
  SPONSOR_FUNDING_USES,
  SPONSOR_TIERS,
} from "@/data/sponsorTiers";
import storedLatestReleaseDownloads from "@/data/latest-release-downloads.json";
import {
  PRODUCT_CATEGORY,
  PRODUCT_DESCRIPTION,
  PRODUCT_HERO_TITLE,
  PRODUCT_HERO_DESCRIPTION,
  PRODUCT_PILLARS,
  SUPPORTED_PROVIDERS,
} from "@/data/product";
import {
  findRelease,
  fromVersionSlug,
  getChangelogPage,
  getSortedReleases,
  toVersionSlug,
} from "@/lib/changelog";
import { getDocumentationCatalog } from "@/lib/docs";
import {
  CREATOR_NAME,
  CREATOR_URL,
  FEEDBACK_EMAIL,
  GITHUB_RELEASES_URL,
  GITHUB_REPO_URL,
  GITHUB_SPONSORS_URL,
  PRODUCT_X_URL,
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
  X_PROFILE_URL,
  YOUTUBE_URL,
} from "@/lib/seo";
import type { ChangelogEntry } from "@/data/changelog";
import type { ChangelogPage } from "@/lib/changelog";
import type { DocumentationCatalogEntry } from "@/lib/docs";

/**
 * The only two formats a negotiated request may resolve to. Defined
 * authoritatively in acceptNegotiation.ts; re-exported here so consumers of
 * this module keep a single source of truth.
 */
export type { NegotiatedFormat } from "@/lib/acceptNegotiation";

/** Result of resolving a canonical public path to its Markdown representation. */
export interface MarkdownResult {
  /** HTTP status for the representation (200 when the path resolves). */
  status: number;
  /** The rendered Markdown body. */
  body: string;
  /** Cache-Control header value for the response. */
  cacheControl: string;
}

/** One canonical public route and how to render its Markdown. */
export interface PublicRepresentation {
  /** Canonical public path, e.g. "/install". */
  path: string;
  /** Document title (also the H1). */
  title: string;
  /** One- or two-line summary of the page. */
  summary: string;
  /** Cache-Control header value for this representation. */
  cacheControl: string;
  /** Deterministic Markdown renderer. */
  renderMarkdown: () => string;
}

/** Content-Type for every negotiated Markdown response. */
export const MARKDOWN_CONTENT_TYPE = "text/markdown; charset=utf-8";

/** Default cache policy for static, data-derived Markdown representations. */
export const MARKDOWN_CACHE_CONTROL = "public, max-age=3600, s-maxage=86400";

/** /install mirrors the HTML page's `revalidate = 1800` for its download links. */
export const INSTALL_CACHE_CONTROL = "public, max-age=1800, s-maxage=86400";

const DOCS_SOURCE_URL = `${GITHUB_REPO_URL}/tree/main/content/docs`;

// Canonical privacy statements, mirrored verbatim from buildAiTxt() in
// lib/llmText.ts. They are the approved public data-boundary claims; keep the
// two in sync if the boundary ever changes.
const PRIVACY_STATEMENTS = [
  "Synara is local-first and does not require a Synara cloud account.",
  "The selected provider still receives the prompts, file snippets, diffs, terminal output, or tool results needed for its session.",
  "Synara does not proxy or store normal provider traffic on a Synara server.",
  "Optional anonymous analytics are off by default and are designed not to include code, prompts, or chat history.",
];

function absoluteUrl(path: string): string {
  return `${SITE_URL}${path === "/" ? "" : path}`;
}

/** Join Markdown blocks and collapse runs of blank lines. */
function render(blocks: string[]): string {
  return blocks.join("\n").replace(/\n{3,}/g, "\n\n");
}

function canonicalLine(path: string): string {
  return `Canonical URL: ${absoluteUrl(path)}`;
}

function sourcesBlock(sources: { label: string; url: string }[]): string[] {
  return [
    "## Sources",
    "",
    ...sources.map(({ label, url }) => `- [${label}](${url})`),
  ];
}

function toIsoDate(value: Date | string | null | undefined): string | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

// ---------------------------------------------------------------------------
// Homepage
// ---------------------------------------------------------------------------

function renderHomepageMarkdown(): string {
  return render([
    `# ${SITE_TITLE}`,
    "",
    `> ${PRODUCT_CATEGORY}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    `## ${PRODUCT_HERO_TITLE}`,
    "",
    PRODUCT_HERO_DESCRIPTION,
    "",
    PRODUCT_DESCRIPTION,
    "",
    "## Product pillars",
    "",
    ...PRODUCT_PILLARS.map(
      ({ title, description }) => `- **${title}:** ${description}`,
    ),
    "",
    "## Supported coding-agent runtimes",
    "",
    ...SUPPORTED_PROVIDERS.map((provider) => `- ${provider}`),
    "",
    "## Frequently asked questions",
    "",
    ...FAQ_ITEMS.flatMap(({ question, answer }) => [
      `### ${question}`,
      "",
      answer,
      "",
    ]),
    "## Main pages",
    "",
    `- [Download Synara](${absoluteUrl("/install")})`,
    `- [Documentation](${absoluteUrl("/docs")})`,
    `- [Changelog](${absoluteUrl("/changelog")})`,
    `- [Sponsor Synara](${absoluteUrl("/sponsor")})`,
    `- [Synara sponsors](${absoluteUrl("/sponsors")})`,
    `- [Privacy](${absoluteUrl("/privacy")})`,
    "",
    canonicalLine("/"),
    "",
    ...sourcesBlock([
      { label: "Source repository", url: GITHUB_REPO_URL },
      { label: "Release downloads", url: GITHUB_RELEASES_URL },
    ]),
  ]);
}

// ---------------------------------------------------------------------------
// Install
// ---------------------------------------------------------------------------

function renderInstallMarkdown(): string {
  const downloads = storedLatestReleaseDownloads;
  return render([
    "# Download Synara",
    "",
    `> ${PRODUCT_CATEGORY}`,
    "",
    "Install the desktop app, connect a coding-agent runtime already authenticated on your machine, and start with one repository and one bounded task.",
    "",
    "## Downloads",
    "",
    `Latest release build: ${downloads.version}`,
    "",
    `- macOS (Apple Silicon): ${downloads.mac.arm64}`,
    `- macOS (Intel): ${downloads.mac.x64}`,
    `- Windows: ${downloads.windows}`,
    `- Linux: ${downloads.linux}`,
    "",
    `All assets: ${downloads.releasesUrl}`,
    "",
    "## Requirements",
    "",
    "- The Synara desktop app for your platform.",
    "- At least one supported coding-agent runtime installed and authenticated on your machine:",
    "",
    ...SUPPORTED_PROVIDERS.map((provider) => `  - ${provider}`),
    "",
    "## Frequently asked questions",
    "",
    ...FAQ_ITEMS.filter(({ question }) =>
      [
        "What must be installed before I start?",
        "Does Synara include models or require another AI subscription?",
      ].includes(question),
    ).flatMap(({ question, answer }) => [`### ${question}`, "", answer, ""]),
    "## Getting started",
    "",
    `- [Quickstart](${absoluteUrl("/docs/getting-started/quickstart")})`,
    `- [Installation guide](${absoluteUrl("/docs/getting-started/installation")})`,
    "",
    canonicalLine("/install"),
    "",
    ...sourcesBlock([
      { label: "Release downloads", url: GITHUB_RELEASES_URL },
      { label: "Source repository", url: GITHUB_REPO_URL },
    ]),
  ]);
}

// ---------------------------------------------------------------------------
// Documentation
// ---------------------------------------------------------------------------

/** Pages in the same top-level docs section as `url` (excluding `url`). */
function relatedDocumentationPages(url: string): DocumentationCatalogEntry[] {
  const section = url.split("/")[2] ?? "";
  return getDocumentationCatalog().filter((page) => {
    if (page.url === url) return false;
    return (page.url.split("/")[2] ?? "") === section;
  });
}

function renderDocumentationPageMarkdown(
  entry: DocumentationCatalogEntry,
): string {
  const lastModified = toIsoDate(entry.lastModified);
  const related = relatedDocumentationPages(entry.url);
  return render([
    `# ${entry.title}`,
    "",
    `> ${entry.description}`,
    "",
    canonicalLine(entry.url),
    ...(lastModified ? [`Last modified: ${lastModified}`, ""] : []),
    ...(related.length > 0
      ? [
          "## Related documentation",
          "",
          ...related.map(
            (page) =>
              `- [${page.title}](${absoluteUrl(page.url)}): ${page.description}`,
          ),
          "",
        ]
      : []),
    ...sourcesBlock([
      { label: "Documentation source", url: DOCS_SOURCE_URL },
      { label: "Source repository", url: GITHUB_REPO_URL },
    ]),
  ]);
}

function renderDocumentationIndexMarkdown(): string {
  const catalog = getDocumentationCatalog();
  const index = catalog.find((page) => page.url === "/docs");
  return render([
    `# ${index?.title ?? "Documentation"}`,
    "",
    `> ${index?.description ?? "Synara product documentation."}`,
    "",
    canonicalLine("/docs"),
    "",
    "## Documentation",
    "",
    ...catalog.map(
      (page) =>
        `- [${page.title}](${absoluteUrl(page.url)}): ${page.description}`,
    ),
    "",
    ...sourcesBlock([
      { label: "Documentation source", url: DOCS_SOURCE_URL },
      { label: "Source repository", url: GITHUB_REPO_URL },
    ]),
  ]);
}

// ---------------------------------------------------------------------------
// Privacy
// ---------------------------------------------------------------------------

function renderPrivacyMarkdown(): string {
  return render([
    "# Privacy",
    "",
    "> Synara's security and privacy boundary: local-first storage, direct-to-provider connections, no account, and anonymous analytics that are off by default.",
    "",
    PRODUCT_DESCRIPTION,
    "",
    "## Data boundary",
    "",
    ...PRIVACY_STATEMENTS.map((statement) => `- ${statement}`),
    "",
    "## Frequently asked questions",
    "",
    ...FAQ_ITEMS.filter(({ question }) =>
      question.includes("upload my code"),
    ).flatMap(({ question, answer }) => [`### ${question}`, "", answer, ""]),
    "",
    canonicalLine("/privacy"),
    "",
    ...sourcesBlock([{ label: "Source repository", url: GITHUB_REPO_URL }]),
  ]);
}

// ---------------------------------------------------------------------------
// Sponsor
// ---------------------------------------------------------------------------

function renderSponsorMarkdown(): string {
  return render([
    "# Sponsor Synara",
    "",
    "> Support the free, open-source development of Synara through GitHub Sponsors.",
    "",
    `Sponsor page: ${GITHUB_SPONSORS_URL}`,
    "",
    "## Sponsorship tiers",
    "",
    ...SPONSOR_TIERS.flatMap(({ label, amount, tagline, perks }) => [
      `### ${label} — $${amount}/month`,
      "",
      tagline,
      "",
      ...perks.map((perk) => `- ${perk}`),
      "",
    ]),
    `### ${ONE_TIME_SPONSORSHIP.label}`,
    "",
    ONE_TIME_SPONSORSHIP.tagline,
    "",
    ...ONE_TIME_SPONSORSHIP.perks.map((perk) => `- ${perk}`),
    "",
    "## Where funding goes",
    "",
    ...SPONSOR_FUNDING_USES.map(({ title, body }) => `- **${title}:** ${body}`),
    "",
    "## Sponsors",
    "",
    ...SPONSORS.map((sponsor) => {
      const url = sponsor.websiteUrl ?? `https://github.com/${sponsor.login}`;
      return `- [${sponsor.name}](${url})`;
    }),
    "",
    canonicalLine("/sponsor"),
    "",
    ...sourcesBlock([
      { label: "GitHub Sponsors", url: GITHUB_SPONSORS_URL },
      { label: "Source repository", url: GITHUB_REPO_URL },
    ]),
  ]);
}

function renderSponsorsMarkdown(): string {
  const top = SPONSORS.filter((sponsor) => sponsor.top);
  const supporters = SPONSORS.filter((sponsor) => !sponsor.top);
  return render([
    "# Synara sponsors",
    "",
    "> The public sponsor roll backing Synara's development.",
    "",
    ...(top.length > 0
      ? [
          "## Top donors",
          "",
          ...top.map((sponsor) => {
            const url =
              sponsor.websiteUrl ?? `https://github.com/${sponsor.login}`;
            return `- [${sponsor.name}](${url})`;
          }),
          "",
        ]
      : []),
    ...(supporters.length > 0
      ? [
          "## Supporters",
          "",
          ...supporters.map((sponsor) => {
            const url =
              sponsor.websiteUrl ?? `https://github.com/${sponsor.login}`;
            return `- [${sponsor.name}](${url})`;
          }),
          "",
        ]
      : []),
    "Become a sponsor:",
    "",
    `- [GitHub Sponsors](${GITHUB_SPONSORS_URL})`,
    "",
    canonicalLine("/sponsors"),
    "",
    ...sourcesBlock([{ label: "GitHub Sponsors", url: GITHUB_SPONSORS_URL }]),
  ]);
}

// ---------------------------------------------------------------------------
// Changelog
// ---------------------------------------------------------------------------

function releaseSection(entry: ChangelogEntry): string[] {
  return [
    `## Synara ${entry.version} (${entry.date})`,
    "",
    canonicalLine(`/changelog/${toVersionSlug(entry.version)}`),
    "",
    ...entry.features.flatMap((feature) => [
      `### ${feature.title}`,
      "",
      feature.description,
      ...(feature.details ? ["", feature.details] : []),
      "",
    ]),
  ];
}

function renderChangelogMarkdown(): string {
  const releases = getSortedReleases();
  return render([
    "# Changelog",
    "",
    "> Every Synara release: new providers, performance work, and the steady polish that makes the app faster and sturdier. Updated with each version.",
    "",
    ...releases.flatMap((entry) => releaseSection(entry)),
    canonicalLine("/changelog"),
    "",
    ...sourcesBlock([
      { label: "Source repository", url: GITHUB_REPO_URL },
      { label: "Release downloads", url: GITHUB_RELEASES_URL },
    ]),
  ]);
}

function renderChangelogReleaseMarkdown(entry: ChangelogEntry): string {
  return render([
    `# Synara ${entry.version} release notes`,
    "",
    `> What changed in Synara ${entry.version} (${entry.date}), including ${entry.features
      .map((feature) => feature.title)
      .join(", ")}.`,
    "",
    ...entry.features.flatMap((feature) => [
      `### ${feature.title}`,
      "",
      feature.description,
      ...(feature.details ? ["", feature.details] : []),
      "",
    ]),
    `- [Full changelog](${absoluteUrl("/changelog")})`,
    "",
    canonicalLine(`/changelog/${toVersionSlug(entry.version)}`),
    "",
    ...sourcesBlock([
      { label: "Source repository", url: GITHUB_REPO_URL },
      { label: "Release downloads", url: GITHUB_RELEASES_URL },
    ]),
  ]);
}

/**
 * One page of the paginated changelog archive (`/changelog/page/N`): only that
 * page's releases, the previous/next navigation, the canonical page URL, and
 * sources. Mirrors the static `/changelog/page/[page]` route's ChangelogContent
 * (title, description, and prev/next links). Release sections reuse
 * releaseSection so headings and per-release canonical URLs stay identical to
 * the full archive.
 */
function renderChangelogPageMarkdown(model: ChangelogPage): string {
  const { page, pageCount, releases, previousPath, nextPath } = model;
  const navigation = [
    ...(previousPath ? [`- [Newer releases](${absoluteUrl(previousPath)})`] : []),
    ...(nextPath ? [`- [Older releases](${absoluteUrl(nextPath)})`] : []),
  ];
  return render([
    `# Changelog — Synara — Page ${page} of ${pageCount}`,
    "",
    `> Older Synara releases, page ${page} of ${pageCount}.`,
    "",
    ...releases.flatMap((entry) => releaseSection(entry)),
    ...(navigation.length > 0
      ? ["## Navigation", "", ...navigation, ""]
      : []),
    canonicalLine(`/changelog/page/${page}`),
    "",
    ...sourcesBlock([
      { label: "Source repository", url: GITHUB_REPO_URL },
      { label: "Release downloads", url: GITHUB_RELEASES_URL },
    ]),
  ]);
}

function renderAboutMarkdown(): string {
  return render([
    "# About Synara",
    "",
    canonicalLine("/about"),
    "",
    SITE_DESCRIPTION,
    "",
    "## Local-first by default",
    "",
    ...PRIVACY_STATEMENTS.map((statement) => `- ${statement}`),
    "",
    "## Supported runtimes",
    "",
    ...SUPPORTED_PROVIDERS.map((provider) => `- ${provider}`),
    "",
    "## Open source",
    "",
    "Synara is free to use and open source under the MIT license.",
    "",
    "## Maintainer",
    "",
    `${CREATOR_NAME} maintains Synara.`,
    "",
    ...sourcesBlock([
      { label: "Source repository", url: GITHUB_REPO_URL },
      { label: "Releases", url: GITHUB_RELEASES_URL },
      { label: "Sponsor development", url: GITHUB_SPONSORS_URL },
      { label: "Maintainer", url: CREATOR_URL },
    ]),
  ]);
}

function renderContactMarkdown(): string {
  return render([
    "# Contact Synara",
    "",
    canonicalLine("/contact"),
    "",
    "Choose the public channel that fits your question.",
    "",
    "## Contact channels",
    "",
    `- Feedback and product questions: [${FEEDBACK_EMAIL}](mailto:${FEEDBACK_EMAIL})`,
    `- Public technical issues: [GitHub issues](${GITHUB_REPO_URL}/issues)`,
    `- Product updates: [@trySynara](${PRODUCT_X_URL})`,
    `- Maintainer updates: [@emanueledpt](${X_PROFILE_URL})`,
    `- Privacy questions: [Privacy page](${absoluteUrl("/privacy")})`,
    "",
    ...sourcesBlock([
      { label: "Source repository", url: GITHUB_REPO_URL },
      { label: "Maintainer website", url: CREATOR_URL },
      { label: "Maintainer videos", url: YOUTUBE_URL },
    ]),
  ]);
}

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

/**
 * Ordered canonical public routes that can render Markdown. Exact-path
 * entries first; parameterized documentation and release pages resolve through
 * `resolveDocumentationPage` and `resolveChangelogRelease` below.
 */
export const PUBLIC_REPRESENTATIONS: readonly PublicRepresentation[] = [
  {
    path: "/",
    title: SITE_TITLE,
    summary: SITE_DESCRIPTION,
    cacheControl: MARKDOWN_CACHE_CONTROL,
    renderMarkdown: renderHomepageMarkdown,
  },
  {
    path: "/install",
    title: "Download Synara",
    summary:
      "Install the desktop app and connect a coding-agent runtime already authenticated on your machine.",
    cacheControl: INSTALL_CACHE_CONTROL,
    renderMarkdown: renderInstallMarkdown,
  },
  {
    path: "/docs",
    title: "Documentation",
    summary: "Synara product documentation.",
    cacheControl: MARKDOWN_CACHE_CONTROL,
    renderMarkdown: renderDocumentationIndexMarkdown,
  },
  {
    path: "/privacy",
    title: "Privacy — Synara",
    summary:
      "Synara's security and privacy boundary: local-first storage, direct-to-provider connections, no account, and anonymous analytics that are off by default.",
    cacheControl: MARKDOWN_CACHE_CONTROL,
    renderMarkdown: renderPrivacyMarkdown,
  },
  {
    path: "/sponsor",
    title: "Sponsor Synara",
    summary:
      "Support the free, open-source development of Synara through GitHub Sponsors.",
    cacheControl: MARKDOWN_CACHE_CONTROL,
    renderMarkdown: renderSponsorMarkdown,
  },
  {
    path: "/sponsors",
    title: "Synara sponsors",
    summary: "The public sponsor roll backing Synara's development.",
    cacheControl: MARKDOWN_CACHE_CONTROL,
    renderMarkdown: renderSponsorsMarkdown,
  },
  {
    path: "/changelog",
    title: "Changelog — Synara",
    summary:
      "Every Synara release: new providers, performance work, and the steady polish that makes the app faster and sturdier. Updated with each version.",
    cacheControl: MARKDOWN_CACHE_CONTROL,
    renderMarkdown: renderChangelogMarkdown,
  },
  {
    path: "/about",
    title: "About Synara",
    summary: "Supported facts about Synara, its local-first boundary, and its maintainer.",
    cacheControl: MARKDOWN_CACHE_CONTROL,
    renderMarkdown: renderAboutMarkdown,
  },
  {
    path: "/contact",
    title: "Contact Synara",
    summary: "Approved public contact channels for Synara.",
    cacheControl: MARKDOWN_CACHE_CONTROL,
    renderMarkdown: renderContactMarkdown,
  },
];

/**
 * Resolve a parameterized documentation page (`/docs/...`) to its
 * representation, or undefined when the page does not exist. The Fumadocs
 * catalog is the source of truth for which doc paths exist.
 */
export function resolveDocumentationPage(
  path: string,
): PublicRepresentation | undefined {
  const normalized = normalizePath(path);
  const entry = getDocumentationCatalog().find(
    (page) => page.url === normalized,
  );
  if (!entry) return undefined;
  return {
    path: entry.url,
    title: entry.title,
    summary: entry.description,
    cacheControl: MARKDOWN_CACHE_CONTROL,
    renderMarkdown: () => renderDocumentationPageMarkdown(entry),
  };
}

/**
 * Resolve a release deep link (`/changelog/vX.Y.Z`) to its representation, or
 * undefined when the version is unknown. Only `v`-prefixed slugs resolve,
 * matching the static `/changelog/[version]` route (`dynamicParams = false`).
 */
export function resolveChangelogRelease(
  path: string,
): PublicRepresentation | undefined {
  const normalized = normalizePath(path);
  const segments = normalized.split("/").filter(Boolean);
  if (segments.length !== 2 || !segments[1].startsWith("v")) return undefined;
  const entry = findRelease(fromVersionSlug(segments[1]));
  if (!entry) return undefined;
  return {
    path: `/changelog/${toVersionSlug(entry.version)}`,
    title: `Synara ${entry.version} release notes`,
    summary: `What changed in Synara ${entry.version} (${entry.date}).`,
    cacheControl: MARKDOWN_CACHE_CONTROL,
    renderMarkdown: () => renderChangelogReleaseMarkdown(entry),
  };
}

/**
 * Resolve a paginated changelog archive page (`/changelog/page/N`) to its
 * representation, or undefined when the page does not exist. Mirrors the
 * static `/changelog/page/[page]` route (`dynamicParams = false`): page 1
 * renders at the index (`/changelog`) and is never duplicated here, and only
 * integer page numbers from 2 through the last page resolve.
 */
export function resolveChangelogPage(
  path: string,
): PublicRepresentation | undefined {
  const normalized = normalizePath(path);
  const segments = normalized.split("/").filter(Boolean);
  if (
    segments.length !== 3 ||
    segments[0] !== "changelog" ||
    segments[1] !== "page"
  ) {
    return undefined;
  }
  if (!/^\d+$/.test(segments[2])) return undefined;
  const page = Number(segments[2]);
  if (page < 2) return undefined;
  const model = getChangelogPage(page);
  if (!model) return undefined;
  return {
    path: `/changelog/page/${model.page}`,
    title: `Changelog — Synara — Page ${model.page} of ${model.pageCount}`,
    summary: `Older Synara releases, page ${model.page} of ${model.pageCount}.`,
    cacheControl: MARKDOWN_CACHE_CONTROL,
    renderMarkdown: () => renderChangelogPageMarkdown(model),
  };
}

/**
 * Normalize a public path for exact lookup: ensure a leading slash, collapse
 * duplicate slashes, and drop a trailing slash (except on the root path).
 */
export function normalizePath(path: string): string {
  if (!path) return "/";
  let normalized = path.trim();
  if (!normalized.startsWith("/")) normalized = `/${normalized}`;
  normalized = normalized.replace(/\/{2,}/g, "/");
  if (normalized.length > 1 && normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }
  return normalized;
}

/**
 * Resolve a canonical public path to its Markdown representation. Exact
 * registry paths match first, then the explicit documentation and changelog
 * resolvers. Returns null for unknown paths so the route layer can return a
 * Markdown 404.
 */
export function resolveMarkdown(path: string): MarkdownResult | null {
  const normalized = normalizePath(path);
  const exact = PUBLIC_REPRESENTATIONS.find(
    (entry) => entry.path === normalized,
  );
  if (exact) {
    return {
      status: 200,
      body: exact.renderMarkdown(),
      cacheControl: exact.cacheControl,
    };
  }
  if (normalized.startsWith("/docs/")) {
    const representation = resolveDocumentationPage(normalized);
    if (representation) {
      return {
        status: 200,
        body: representation.renderMarkdown(),
        cacheControl: representation.cacheControl,
      };
    }
  }
  if (normalized.startsWith("/changelog/")) {
    const representation =
      resolveChangelogPage(normalized) ?? resolveChangelogRelease(normalized);
    if (representation) {
      return {
        status: 200,
        body: representation.renderMarkdown(),
        cacheControl: representation.cacheControl,
      };
    }
  }
  return null;
}
