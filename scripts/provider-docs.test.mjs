import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { extractInternalLinks, parseFrontmatter } from "./check-docs.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PROVIDERS_DIR = path.join(ROOT, "content", "docs", "providers");

const PROVIDERS = [
  { slug: "claude-code", title: "Claude Code", executable: "claude", authMarker: "claude auth status" },
  { slug: "codex", title: "Codex", executable: "codex", authMarker: "codex login" },
  { slug: "opencode", title: "OpenCode", executable: "opencode", authMarker: "/connect" },
  { slug: "cursor", title: "Cursor", executable: "cursor-agent", authMarker: "cursor-agent login" },
  { slug: "antigravity", title: "Antigravity", executable: "agy", authMarker: "keyring" },
  { slug: "grok", title: "Grok Build", executable: "grok", authMarker: "XAI_API_KEY" },
  { slug: "kilo-code", title: "Kilo Code", executable: "kilo", authMarker: "/connect" },
  { slug: "pi", title: "Pi", executable: "pi", authMarker: "/login" },
  { slug: "factory-droid", title: "Factory Droid", executable: "droid", authMarker: "FACTORY_API_KEY" },
];

const REQUIRED_SECTIONS = [
  "Install",
  "Authenticate",
  "Verify",
  "Connect to Synara",
  "Capabilities in Synara",
  "Troubleshooting",
  "Official documentation",
];

function readProvider(slug) {
  return readFileSync(path.join(PROVIDERS_DIR, `${slug}.mdx`), "utf8");
}

test("provider navigation has the exact supported provider set and order", () => {
  const meta = JSON.parse(readFileSync(path.join(PROVIDERS_DIR, "meta.json"), "utf8"));
  assert.deepEqual(meta.pages, ["index", ...PROVIDERS.map(({ slug }) => slug)]);
  assert.equal(new Set(meta.pages).size, meta.pages.length, "provider navigation contains duplicates");
});

test("every supported provider has a guide with the shared documentation contract", () => {
  for (const provider of PROVIDERS) {
    const file = path.join(PROVIDERS_DIR, `${provider.slug}.mdx`);
    assert.equal(existsSync(file), true, `${provider.slug} guide is missing`);

    const source = readProvider(provider.slug);
    const frontmatter = parseFrontmatter(source);
    assert.equal(frontmatter.error, undefined, `${provider.slug} has invalid frontmatter`);
    assert.equal(frontmatter.values.title, provider.title, `${provider.slug} has the wrong title`);
    assert.ok(frontmatter.values.description?.trim(), `${provider.slug} needs a description`);

    for (const section of REQUIRED_SECTIONS) {
      assert.match(source, new RegExp(`^## ${section}$`, "m"), `${provider.slug} is missing “${section}”`);
    }

    assert.match(source, new RegExp(`\\b${provider.executable.replaceAll("-", "\\-")}\\b`), `${provider.slug} does not name its executable`);
    assert.ok(source.includes(provider.authMarker), `${provider.slug} does not document its authentication marker`);
    assert.match(source, /## Official documentation[\s\S]*https:\/\//, `${provider.slug} needs an official source link`);
  }
});

test("the provider index links to every guide exactly once", () => {
  const source = readFileSync(path.join(PROVIDERS_DIR, "index.mdx"), "utf8");
  const links = extractInternalLinks(source);

  for (const { slug } of PROVIDERS) {
    const route = `/docs/providers/${slug}`;
    assert.equal(
      links.filter((link) => link === route).length >= 1,
      true,
      `provider index does not link to ${route}`,
    );
  }
});

test("the provider index table names every executable and support row", () => {
  const source = readFileSync(path.join(PROVIDERS_DIR, "index.mdx"), "utf8");
  for (const provider of PROVIDERS) {
    assert.ok(source.includes(provider.title), `provider index does not name ${provider.title}`);
    assert.ok(source.includes(`\`${provider.executable}\``), `provider index does not show ${provider.executable}`);
  }
});

test("the Getting Started provider page points readers to the dedicated provider section", () => {
  const source = readFileSync(
    path.join(ROOT, "content", "docs", "getting-started", "providers.mdx"),
    "utf8",
  );
  assert.ok(
    source.includes("/docs/providers"),
    "Getting Started providers page must link to the dedicated provider guides",
  );
});
