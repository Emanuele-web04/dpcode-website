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
import {
  AI_DISCOVERY_NOTICE,
  AI_DISCOVERY_USER_AGENTS,
  AI_TRAINING_USER_AGENTS,
  SEARCH_USER_AGENTS,
} from "@/lib/discovery";
import {
  GITHUB_RELEASES_URL,
  GITHUB_REPO_URL,
  GITHUB_SPONSORS_URL,
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
  ["About", `${SITE_URL}/about`],
  ["Contact", `${SITE_URL}/contact`],
] as const;

function documentationIndexLines() {
  return getDocumentationCatalog().map(
    (page) => `- [${page.title}](${SITE_URL}${page.url}): ${page.description}`,
  );
}

export function buildLlmsTxt() {
  const releases = getSortedReleases().slice(0, 6);

  return [
    `# ${SITE_NAME}`,
    "",
    `> ${PRODUCT_CATEGORY}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    `> ${AI_DISCOVERY_NOTICE}`,
    "",
    "## Canonical pages",
    ...PRIMARY_PAGES.map(([label, url]) => `- [${label}](${url})`),
    `- [Source repository](${GITHUB_REPO_URL})`,
    `- [Release downloads](${GITHUB_RELEASES_URL})`,
    "",
    "## Documentation index",
    ...documentationIndexLines(),
    "",
    "## Product model",
    ...PRODUCT_PILLARS.map(
      ({ title, description }) => `- **${title}:** ${description}`,
    ),
    "",
    "## Supported coding-agent runtimes",
    ...SUPPORTED_PROVIDERS.map((provider) => `- ${provider}`),
    "",
    "## When to use Synara",
    "- Run several coding agents in parallel on one machine with separate tasks and Git worktrees.",
    "- Keep provider sessions, terminals, browsers, diffs, and delivery state attached to the same task.",
    "- Reuse the coding-agent runtimes and accounts already configured on your machine, including handoffs between supported providers.",
    "- Review command output, browser evidence, file changes, diffs, checks, commits, and pull requests before accepting work.",
    "",
    "## When not to use Synara",
    "- You need a hosted cloud workspace or a managed model subscription: Synara is local-first and does not sell a separate model plan.",
    "- You want Synara to proxy or store provider traffic on its own servers: the selected provider still receives the prompts, files, diffs, and tool output needed for its session.",
    "- No supported coding-agent runtime is installed: Synara connects to runtimes and accounts already configured on your machine.",
    "",
    "## Questions answered by the documentation",
    "- How do I install Synara and connect a coding-agent runtime?",
    "- Which providers, models, authentication methods, and capabilities are supported?",
    "- How do tasks, turns, provider sessions, local checkouts, and Git worktrees relate?",
    "- How do I run parallel agents without mixing ownership or branches?",
    "- How do provider handoffs, browser verification, automations, Studio, Agent Gateway, and External MCP work?",
    "- How do I diagnose provider, runtime, Git, browser, automation, or integration failures safely?",
    "- What evidence should I collect before reporting a Synara problem?",
    "",
    "## Recent releases",
    ...releases.map(
      (entry) =>
        `- [Synara ${entry.version}](${SITE_URL}/changelog/${toVersionSlug(entry.version)}): ${entry.features
          .map((feature) => feature.title)
          .join("; ")}`,
    ),
    "",
    "## Additional discovery files",
    `- [Expanded context](${SITE_URL}/llms-full.txt)`,
    `- [Crawler and identity summary](${SITE_URL}/ai.txt)`,
    "",
    "## Developer resources",
    `- [Documentation](${SITE_URL}/docs)`,
    `- [Source repository](${GITHUB_REPO_URL})`,
    `- [Release downloads](${GITHUB_RELEASES_URL})`,
    `- [Sponsor the project](${GITHUB_SPONSORS_URL})`,
    `- [Public API contract](${SITE_URL}/openapi.json)`,
    "",
    "## Contact and identity",
    `- Creator updates: ${X_PROFILE_URL}`,
    `- YouTube demos: ${YOUTUBE_URL}`,
  ].join("\n");
}

export function buildLlmsFullTxt() {
  const releases = getSortedReleases();
  const docs = getDocumentationCatalog();

  return [
    buildLlmsTxt(),
    "",
    "## Expanded documentation map",
    ...docs.flatMap((page) => [
      `### ${page.title}`,
      `Canonical URL: ${SITE_URL}${page.url}`,
      page.description,
      "",
    ]),
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
    `- ${SITE_URL}/llms.txt`,
    `- ${SITE_URL}/llms-full.txt`,
    `- ${SITE_URL}/sitemap-index.xml`,
    `- ${SITE_URL}/robots.txt`,
    `- ${SITE_URL}/about`,
    `- ${SITE_URL}/contact`,
    `- ${SITE_URL}/openapi.json`,
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
    "## When to use Synara",
    "- Run several coding agents in parallel on one machine with separate tasks, provider sessions, and Git worktrees.",
    "- Keep the provider session, working directory, terminal, browser, diff, and delivery state attached to the same task.",
    "- Reuse the coding-agent runtimes and accounts already configured on your machine, including handoffs between supported providers.",
    "- Review command output, browser evidence, file changes, diffs, checks, commits, and pull requests before accepting work.",
    "",
    "## When not to use Synara",
    "- You need a hosted cloud workspace or a managed model subscription: Synara is local-first and does not sell a separate model plan.",
    "- You want Synara to proxy or store provider traffic on its own servers: the selected provider still receives the prompts, files, diffs, and tool output needed for its session.",
    "- No supported coding-agent runtime is installed and authenticated: Synara connects to runtimes and accounts already configured on your machine.",
    "",
    "## Developer resources",
    `- Documentation: ${SITE_URL}/docs`,
    `- Source repository: ${GITHUB_REPO_URL}`,
    `- Release downloads: ${GITHUB_RELEASES_URL}`,
    `- Sponsor the project: ${GITHUB_SPONSORS_URL}`,
    `- Public API contract: ${SITE_URL}/openapi.json`,
    "",
    "Policy note:",
    "- This file is informational and does not grant or revoke crawler permission.",
    "- robots.txt and page-level robots directives are the authoritative crawl and indexing controls.",
  ].join("\n");
}
