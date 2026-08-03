import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { extractInternalLinks, parseFrontmatter } from "./check-docs.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WORKFLOWS_DIR = path.join(ROOT, "content", "docs", "workflows");

const WORKFLOWS = [
  {
    slug: "index",
    title: "Workflow guides",
    requiredSections: ["Start with the smallest workflow", "Core workflow", "Guides"],
    markers: ["one rule", "integration owner"],
  },
  {
    slug: "best-practices",
    title: "Best practices",
    requiredSections: [
      "Start smaller than you think",
      "Write objectives, not conversations",
      "Keep one owner per change",
      "Verify at the right layers",
      "Finish with a clean delivery boundary",
      "What to avoid",
    ],
    markers: ["git diff --check", "untrusted input", "The completion rule"],
  },
  {
    slug: "parallel-agents",
    title: "Parallel agents",
    requiredSections: [
      "Choose the right level",
      "Design parallel work before creating tasks",
      "Provider-native subagents",
      "Agent Gateway orchestration",
      "Worktree strategy",
      "Integration ownership",
      "Failure handling",
      "Parallel completion checklist",
    ],
    markers: ["up to 20 threads", "one integration owner", "/subagents"],
  },
  {
    slug: "worktrees",
    title: "Worktrees",
    requiredSections: [
      "Local checkout or worktree",
      "Before creating the worktree",
      "How task ownership works",
      "Starting from a base ref",
      "Moving work between environments",
      "Reviewing the result",
      "Safe cleanup",
      "Recovery cases",
      "Worktree checklist",
    ],
    markers: ["git status --short", "git diff <base-ref>...HEAD", "commits and pushed refs"],
  },
  {
    slug: "handoffs",
    title: "Provider handoffs",
    requiredSections: [
      "Handoff or new task",
      "Before handing off",
      "What Synara preserves",
      "What does not transfer",
      "Write the handoff instruction",
      "Verification after handoff",
      "Failure cases",
      "Handoff checklist",
    ],
    markers: ["checkpoint", "Provider-native state", "changes the worker, not the owner"],
  },
  {
    slug: "browser-verification",
    title: "Browser verification",
    requiredSections: [
      "What browser verification is for",
      "Start the correct application",
      "The reliable interaction loop",
      "Snapshots versus screenshots",
      "Console and network diagnostics",
      "Ambiguous failures and safe retries",
      "OAuth and human-required actions",
      "Use evaluation sparingly",
      "Browser verification record",
      "Completion checklist",
    ],
    markers: [
      "browser_snapshot",
      "browser_screenshot",
      "browser_logs",
      "browser_evaluate",
      "snapshotId",
      "Observe before retrying",
    ],
  },
  {
    slug: "pull-requests",
    title: "Pull requests",
    requiredSections: [
      "Requirements",
      "Establish the exact PR state",
      "Read the pull request",
      "Use Fix prompts carefully",
      "Resolve merge conflicts",
      "Verify a repaired PR",
      "Remote actions",
      "Large pull requests",
      "Pull-request completion checklist",
    ],
    markers: ["gh auth status", "untrusted input", "merge, close, and reopen", "final head"],
  },
  {
    slug: "automations",
    title: "Automations",
    requiredSections: [
      "Good automation candidates",
      "Create the automation",
      "Write an automation-safe prompt",
      "Heartbeat automations and stop conditions",
      "Run history and transcript labels",
      "Current and paused automations",
      "Prevent duplicate effects",
      "Failure handling",
      "Automation checklist",
    ],
    markers: ["stop condition", "managed worktree", "approval-required", "A timeout is not proof"],
  },
  {
    slug: "studio",
    title: "Studio",
    requiredSections: [
      "Studio or a regular task",
      "Good Studio projects",
      "Define the project boundary",
      "Use the Environment panel",
      "Work in checkpoints",
      "Verification",
      "Privacy and secrets",
      "When to leave Studio",
      "Completion checklist",
    ],
    markers: ["long-running", "Environment panel", "Generated output is not approved output"],
  },
  {
    slug: "agent-gateway",
    title: "Agent Gateway",
    requiredSections: [
      "What the gateway is for",
      "Start with context and capabilities",
      "Read tools",
      "Create one task",
      "Create a batch",
      "Wait instead of polling",
      "Authority boundaries",
      "Native subagents are different",
      "Failure handling",
      "Coordination checklist",
    ],
    markers: [
      "synara_context",
      "synara_capabilities",
      "synara_create_thread",
      "synara_create_threads",
      "synara_wait_for_threads",
      "synara_read_thread",
      "synara_send_message",
      "synara_interrupt_thread",
      "stable `requestId`",
      "1–20",
      "active caller turn",
    ],
  },
  {
    slug: "external-mcp",
    title: "External MCP",
    requiredSections: [
      "Internal gateway or external integration",
      "Create the integration",
      "Pairing lifecycle",
      "External tool surface",
      "Create a task safely",
      "Project and task ownership",
      "Limits and active task slots",
      "Security model",
      "Audit and privacy",
      "Revocation",
      "Failure handling",
      "External MCP checklist",
    ],
    markers: [
      "synara_overview",
      "synara_capabilities",
      "synara_list_allowed_projects",
      "synara_create_task",
      "synara_wait_for_task",
      "synara_read_task",
      "loopback-only",
      "managed worktree",
      "approval-required",
      "raw integration credential",
    ],
  },
];

function readWorkflow(slug) {
  return readFileSync(path.join(WORKFLOWS_DIR, `${slug}.mdx`), "utf8");
}

test("workflow navigation has the exact guide set and order", () => {
  const meta = JSON.parse(readFileSync(path.join(WORKFLOWS_DIR, "meta.json"), "utf8"));
  assert.deepEqual(meta.pages, WORKFLOWS.map(({ slug }) => slug));
  assert.equal(new Set(meta.pages).size, meta.pages.length, "workflow navigation contains duplicates");
});

test("every workflow page satisfies its branch-specific content contract", () => {
  for (const workflow of WORKFLOWS) {
    const file = path.join(WORKFLOWS_DIR, `${workflow.slug}.mdx`);
    assert.equal(existsSync(file), true, `${workflow.slug} workflow guide is missing`);

    const source = readWorkflow(workflow.slug);
    const frontmatter = parseFrontmatter(source);
    assert.equal(frontmatter.error, undefined, `${workflow.slug} has invalid frontmatter`);
    assert.equal(frontmatter.values.title, workflow.title, `${workflow.slug} has the wrong title`);
    assert.ok(frontmatter.values.description?.trim(), `${workflow.slug} needs a description`);

    for (const section of workflow.requiredSections) {
      assert.match(
        source,
        new RegExp(`^## ${section.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "m"),
        `${workflow.slug} is missing “${section}”`,
      );
    }

    for (const marker of workflow.markers) {
      assert.ok(source.includes(marker), `${workflow.slug} is missing required marker: ${marker}`);
    }
  }
});

test("the workflow index links to every non-index workflow route", () => {
  const links = extractInternalLinks(readWorkflow("index"));
  for (const { slug } of WORKFLOWS.filter(({ slug }) => slug !== "index")) {
    const route = `/docs/workflows/${slug}`;
    assert.ok(links.includes(route), `workflow index does not link to ${route}`);
  }
});

test("coordination pages distinguish Agent Gateway from External MCP", () => {
  const gateway = readWorkflow("agent-gateway");
  const external = readWorkflow("external-mcp");

  assert.ok(gateway.includes("internal, thread-scoped MCP"));
  assert.ok(gateway.includes("/docs/workflows/external-mcp"));
  assert.ok(external.includes("another local application"));
  assert.ok(external.includes("/docs/workflows/agent-gateway"));
  assert.ok(external.includes("smaller surface than the internal Agent Gateway"));
});

test("safety-critical workflow claims remain explicit", () => {
  assert.ok(readWorkflow("parallel-agents").includes("Separate worktrees"));
  assert.ok(readWorkflow("handoffs").includes("Do not leave two providers actively editing"));
  assert.ok(readWorkflow("browser-verification").includes("Do not immediately repeat the mutation"));
  assert.ok(readWorkflow("pull-requests").includes("A green run on an earlier commit"));
  assert.ok(readWorkflow("automations").includes("Do not allow unreviewed scheduled diffs"));
  assert.ok(readWorkflow("external-mcp").includes("Revocation takes effect immediately"));
});
