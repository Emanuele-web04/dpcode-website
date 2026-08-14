import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { extractInternalLinks, parseFrontmatter } from "./check-docs.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function read(relative) {
  return readFileSync(path.join(ROOT, relative), "utf8");
}

test("v0.7.2 feature guides are public navigation entries with complete frontmatter", () => {
  const meta = JSON.parse(read("content/docs/features/meta.json"));

  for (const slug of ["thread-goals", "ios-simulator"]) {
    assert.ok(meta.pages.includes(slug), `${slug} is missing from feature navigation`);
    const frontmatter = parseFrontmatter(read(`content/docs/features/${slug}.mdx`));
    assert.equal(frontmatter.error, undefined, `${slug} has invalid frontmatter`);
    assert.ok(frontmatter.values.title?.trim());
    assert.ok(frontmatter.values.description?.trim());
  }
});

test("goals and Debug mode are documented in the canonical command reference", () => {
  const commands = read("content/docs/reference/slash-commands.mdx");

  for (const command of [
    "/debug",
    "/goal",
    "/goal edit",
    "/goal pause",
    "/goal resume",
    "/goal clear",
  ]) {
    assert.ok(commands.includes(command), `slash-command reference is missing ${command}`);
  }
});

test("workspace search shortcuts and destination behavior are documented", () => {
  const shortcuts = read("content/docs/reference/keyboard-shortcuts.mdx");
  const organize = read("content/docs/features/organize.mdx");

  assert.ok(shortcuts.includes("`mod+p`"));
  assert.ok(shortcuts.includes("`mod+shift+f`"));
  assert.ok(organize.includes("## Search files and source"));
  assert.ok(organize.includes("right-dock file pane"));
});

test("the feature map links to the durable v0.7.2 guides", () => {
  const links = extractInternalLinks(read("content/docs/features/overview.mdx"));

  for (const route of [
    "/docs/features/thread-goals",
    "/docs/features/ios-simulator",
    "/docs/workflows/forks",
    "/docs/workflows/debugging",
  ]) {
    assert.ok(links.includes(route), `feature map does not link to ${route}`);
  }
});

test("stacked PR and automation failure policy updates remain explicit", () => {
  const pullRequests = read("content/docs/workflows/pull-requests.mdx");
  const automations = read("content/docs/workflows/automations.mdx");

  assert.ok(pullRequests.includes("## Work with stacked pull requests"));
  assert.ok(pullRequests.includes("stack prefix through the selected PR"));
  assert.ok(automations.includes("## Choose a failure policy"));
  assert.ok(automations.includes("Stop after 3 failures"));
  assert.ok(automations.includes("A successful run resets the consecutive-failure count"));
});
