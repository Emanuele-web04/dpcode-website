// FILE: lib/llmText.ts
// Purpose: Builds plain-text AI discovery files from canonical site data.
// Layer: server utility for /llms.txt, /llms-full.txt, and /ai.txt routes.

import { FAQ_ITEMS } from "@/data/faqs";
import {
  PRODUCT_CATEGORY,
  PRODUCT_PILLARS,
  SUPPORTED_PROVIDERS,
} from "@/data/product";
import { getSortedReleases, toVersionSlug } from "@/lib/changelog";
import { getDocumentationCatalog } from "@/lib/docs";
import { buildDocumentationCorpus } from "@/lib/docsMarkdown";
import {
  AI_DISCOVERY_NOTICE,
  AI_DISCOVERY_USER_AGENTS,
  AI_TRAINING_USER_AGENTS,
  SEARCH_USER_AGENTS,
} from "@/lib/discovery";
import {
  GITHUB_RELEASES_URL,
  GITHUB_REPO_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  X_PROFILE_URL,
  YOUTUBE_URL,
} from "@/lib/seo";

const PRIMARY_PAGES = [
  ["Homepage", `${SITE_URL}/`],
  ["Download Synara", `${SITE_URL}/install`],
  ["Synara documentation", `${SITE_URL}/docs`],
  ["Changelog", `${SITE_URL}/changelog`],
  ["Sponsor Synara", `${SITE_URL}/sponsor`],
  ["Synara sponsors", `${SITE_URL}/sponsors`],
  ["Privacy", `${SITE_URL}/privacy`],
] as const;

function documentationIndexLines() {
  return getDocumentationCatalog().map(
    (page) => `- [${page.title}](${SITE_URL}${page.url}.md): ${page.description}`,
  );
}

export function buildLlmsTxt() {
  const releases = getSortedReleases().slice(0, 6);
  return [
    `# ${SITE_NAME}`, "", `> ${SITE_DESCRIPTION}`, "",
    PRODUCT_CATEGORY, "", AI_DISCOVERY_NOTICE, "",
    `Supported runtimes: ${SUPPORTED_PROVIDERS.join(", ")}.`, "",
    ...PRODUCT_PILLARS.map(p => `**${p.title}:** ${p.description}`), "",
    "Request public pages with Accept: text/markdown or append .md (use /index.md for the homepage). Follow focused pages first; llms-full.txt is an optional, large combined corpus.", "",
    "## When to use Synara",
    `- [Installation and first task](${SITE_URL}/docs/getting-started/installation.md): Use when setting up a local coding-agent workspace with the user's existing runtimes and provider accounts.`,
    `- [Providers](${SITE_URL}/docs/providers.md): Use when checking runtime authentication, model access, or provider-specific capabilities.`,
    `- [Workflows](${SITE_URL}/docs/workflows.md): Use when planning isolated parallel tasks, Git worktrees, handoffs, browser verification, or pull-request delivery.`,
    `- [Troubleshooting](${SITE_URL}/docs/troubleshooting.md): Use when diagnosing runtime, Git, browser, or integration failures and collecting evidence.`,
    `- [Agent instructions](${SITE_URL}/agent-instructions.md): How to retrieve documentation, call public website APIs, recover from errors, and distinguish this site from a local Synara instance.`, "",
    "## Canonical pages",
    ...PRIMARY_PAGES.map(([label, url]) => `- [${label}](${url === SITE_URL + "/" ? SITE_URL + "/index.md" : url + ".md"})`),
    `- [Source repository](${GITHUB_REPO_URL})`,
    `- [Release downloads](${GITHUB_RELEASES_URL})`, "",
    "## Documentation index", ...documentationIndexLines(), "",
    "## Public API",
    `- [OpenAPI specification](${SITE_URL}/openapi.json): Typed operations for documentation search, installer counts, discovery, and explicit user-submitted feedback.`,
    `- [API index](${SITE_URL}/api): Machine-readable links. The website cannot start or control local coding tasks.`, "",
    "## Recent releases",
    ...releases.map(entry => `- [Synara ${entry.version}](${SITE_URL}/changelog/${toVersionSlug(entry.version)}.md): Release notes for ${entry.date}.`), "",
    "## Optional",
    `- [Expanded context](${SITE_URL}/llms-full.txt): Large full corpus; prefer individual documentation and release pages for a bounded context.`,
    `- [Crawler and identity summary](${SITE_URL}/ai.txt)`,
    `- [Sitemap](${SITE_URL}/sitemap.xml)`,
    `- [Creator updates](${X_PROFILE_URL})`,
    `- [YouTube demos](${YOUTUBE_URL})`,
  ].join("\n");
}

export async function buildLlmsFullTxt() {
  const releases = getSortedReleases();
  const documentation = await buildDocumentationCorpus();

  return [
    buildLlmsTxt(),
    "",
    "## Full documentation",
    documentation,
    "",
    "## Homepage FAQ",
    ...FAQ_ITEMS.flatMap(({ question, answer }) => [
      `### ${question}`,
      answer,
      "",
    ]),
    "## Full changelog summaries",
    ...releases.flatMap((entry) => [
      `### Synara ${entry.version} (${entry.date})`,
      ...entry.features.map((feature) => {
        const details = feature.details ? ` ${feature.details}` : "";
        return `- ${feature.title}: ${feature.description}${details}`;
      }),
      "",
    ]),
  ].join("\n");
}

export function buildAiTxt() {
  return [
    `# ${SITE_NAME} AI discovery guidance`,
    "",
    AI_DISCOVERY_NOTICE,
    "",
    "Purpose: help search, answer, and browser agents identify canonical public Synara pages.",
    "",
    "Canonical discovery resources:",
    `- ${SITE_URL}/docs`,
    `- Markdown documentation: ${SITE_URL}/docs.md`,
    `- ${SITE_URL}/llms.txt`,
    `- ${SITE_URL}/llms-full.txt`,
    `- ${SITE_URL}/sitemap-index.xml`,
    `- ${SITE_URL}/robots.txt`,
    "",
    "AI search and user-directed retrieval agents:",
    ...AI_DISCOVERY_USER_AGENTS.map((agent) => `- ${agent}`),
    "",
    "General search crawlers:",
    ...SEARCH_USER_AGENTS.map((agent) => `- ${agent}`),
    "",
    "Model-development controls, separate from search visibility:",
    ...AI_TRAINING_USER_AGENTS.map((agent) => `- ${agent}`),
    "",
    "Canonical product facts:",
    `- ${PRODUCT_CATEGORY}`,
    `- ${SITE_DESCRIPTION}`,
    `- Supported runtimes: ${SUPPORTED_PROVIDERS.join(", ")}.`,
    `- Source repository: ${GITHUB_REPO_URL}`,
    `- Releases: ${GITHUB_RELEASES_URL}`,
    "- Synara is local-first and does not require a Synara cloud account.",
    "- The selected provider still receives the prompts, file snippets, diffs, terminal output, or tool results needed for its session.",
    "- Synara does not proxy or store normal provider traffic on a Synara server.",
    "- Optional anonymous analytics are off by default and are designed not to include code, prompts, or chat history.",
    "",
    "Policy note:",
    "- This file is informational and does not grant or revoke crawler permission.",
    "- robots.txt and page-level robots directives are the authoritative crawl and indexing controls.",
  ].join("\n");
}
