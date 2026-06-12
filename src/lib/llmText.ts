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
    "- A free, open-source desktop app for coding with AI agents.",
    "- A local workspace for chats, terminals, browser previews, diffs, branches, worktrees, model handoffs, and pull request flow.",
    "- A way to use existing AI subscriptions instead of buying a separate Synara AI plan.",
    "",
    "## Supported AI Coding Harnesses",
    "- Claude Code",
    "- Codex",
    "- Gemini",
    "- OpenCode",
    "- Cursor",
    "- Grok",
    "- Kilo Code",
    "- Pi",
    "",
    "## High-Intent Questions This Site Answers",
    "- What is the best GUI for Claude Code, Codex, Gemini, OpenCode, and Cursor?",
    "- How can developers run multiple AI coding agents in parallel?",
    "- How can AI coding agents work with Git branches, worktrees, diffs, and pull requests?",
    "- Can I use my existing AI subscriptions in one desktop coding app?",
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
    "- Synara is local-first and does not require a Synara account.",
    "- Providers still receive the prompts, file snippets, diffs, terminal output, or tool results needed for their own sessions.",
  ].join("\n");
}
