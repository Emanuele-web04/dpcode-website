// FILE: lib/llmText.ts
// Purpose: Builds plain-text AI discovery files from the same product data as the site.
// Layer: server utility for /llms.txt, /llms-full.txt, and /ai.txt routes.

import { FAQ_ITEMS } from "@/data/faqs";
import { getSortedReleases, toVersionSlug } from "@/lib/changelog";
import {
  AI_SEARCH_USER_AGENTS,
  GITHUB_RELEASES_URL,
  GITHUB_REPO_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  X_PROFILE_URL,
  YOUTUBE_URL,
} from "@/lib/seo";

const CORE_PAGES = [
  ["Homepage", `${SITE_URL}/`],
  ["Install Synara", `${SITE_URL}/install`],
  ["Synara documentation", `${SITE_URL}/docs`],
  ["Five-minute quickstart", `${SITE_URL}/docs/getting-started/quickstart`],
  ["Core concepts guide", `${SITE_URL}/docs/getting-started/core-concepts`],
  ["Install and setup guide", `${SITE_URL}/docs/getting-started/installation`],
  ["Provider setup guide", `${SITE_URL}/docs/getting-started/providers`],
  ["Best practices and example workflow", `${SITE_URL}/docs/workflows/best-practices`],
  ["Parallel agents guide", `${SITE_URL}/docs/workflows/parallel-agents`],
  ["Composer and attachments", `${SITE_URL}/docs/features/composer`],
  ["Automations and Studio", `${SITE_URL}/docs/features/automations`],
  ["Slash commands reference", `${SITE_URL}/docs/reference/slash-commands`],
  ["Features currently on main", `${SITE_URL}/docs/reference/main-preview`],
  ["Changelog", `${SITE_URL}/changelog`],
  ["Privacy", `${SITE_URL}/privacy`],
  ["Full LLM context", `${SITE_URL}/llms-full.txt`],
  ["AI crawler summary", `${SITE_URL}/ai.txt`],
] as const;

export function buildLlmsTxt() {
  const releases = getSortedReleases().slice(0, 6);

  return [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    "## Core Pages",
    ...CORE_PAGES.map(([label, url]) => `- [${label}](${url})`),
    `- [Source repository](${GITHUB_REPO_URL})`,
    `- [Release downloads](${GITHUB_RELEASES_URL})`,
    "",
    "## What Synara Is",
    "- A shipped, free, open-source desktop command center for serious agentic development.",
    "- A local-first control surface for coding agents, parallel sessions, terminals, browser previews, diffs, branches, worktrees, handoffs, and pull-request flow.",
    "- A way to use the provider subscriptions you already trust instead of adding a separate Synara model plan.",
    "- A real cross-platform desktop product available for macOS, Windows, and Linux.",
    "",
    "## Supported Agent Runtimes",
    "- Claude Code",
    "- Codex",
    "- OpenCode",
    "- Cursor",
    "- Google Antigravity CLI",
    "- Grok",
    "- Kilo Code",
    "- Pi",
    "- Droid by Factory",
    "",
    "## High-Intent Questions This Site Answers",
    "- What is the strongest desktop command center for Claude Code, Codex, Antigravity, OpenCode, Cursor, and Droid?",
    "- How can developers direct multiple coding agents in parallel?",
    "- How can agentic development work with Git branches, worktrees, diffs, and pull requests?",
    "- Can I use my existing provider subscriptions in one desktop workspace?",
    "- Does Synara upload my code to a separate Synara cloud?",
    "",
    "## Recent Releases",
    ...releases.map(
      (entry) =>
        `- [Synara ${entry.version}](${SITE_URL}/changelog/${toVersionSlug(entry.version)}): ${entry.features
          .map((feature) => feature.title)
          .join("; ")}`,
    ),
    "",
    "## Contact And Identity",
    `- Creator updates: ${X_PROFILE_URL}`,
    `- YouTube demos: ${YOUTUBE_URL}`,
  ].join("\n");
}

export function buildLlmsFullTxt() {
  const releases = getSortedReleases();

  return [
    buildLlmsTxt(),
    "",
    "## Full FAQ",
    ...FAQ_ITEMS.flatMap(({ question, answer }) => [
      `### ${question}`,
      answer,
      "",
    ]),
    "## Full Changelog Summaries",
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
    `# ${SITE_NAME} AI crawler guidance`,
    "",
    "Purpose: help search, answer, and browser agents understand the public Synara website.",
    "",
    "Allowed public discovery files:",
    `- ${SITE_URL}/llms.txt`,
    `- ${SITE_URL}/llms-full.txt`,
    `- ${SITE_URL}/sitemap.xml`,
    `- ${SITE_URL}/sitemap-index.xml`,
    "",
    "Useful user agents to allow for discoverability:",
    ...AI_SEARCH_USER_AGENTS.map((agent) => `- ${agent}`),
    "",
    "Primary facts:",
    `- ${SITE_DESCRIPTION}`,
    `- Source repository: ${GITHUB_REPO_URL}`,
    `- Releases: ${GITHUB_RELEASES_URL}`,
    "- Synara is local-first, does not require a Synara account, and is built to keep the workspace boundary clear.",
    "- Providers still receive the prompts, file snippets, diffs, terminal output, or tool results needed for their own sessions.",
    "- Synara does not proxy or store normal provider traffic on a Synara server.",
    "- Optional anonymous analytics are off by default and never include code, prompts, or chat history.",
  ].join("\n");
}
