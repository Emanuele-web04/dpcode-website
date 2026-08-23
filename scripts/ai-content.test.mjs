import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function read(relativePath) {
  return readFileSync(path.join(ROOT, relativePath), "utf8");
}

function countOccurrences(source, needle) {
  return source.split(needle).length - 1;
}

function sourceBetween(source, startMarker, endMarker) {
  return source.slice(source.indexOf(startMarker), source.indexOf(endMarker));
}

const REQUIRED_SECTIONS = [
  "## When to use Synara",
  "## When not to use Synara",
  "## Developer resources",
];

const DETAILED_SECTIONS = [
  "## Expanded documentation map",
  "## Homepage FAQ",
  "## Full changelog summaries",
];

test("every AI discovery document carries use guidance, non-use guidance, and developer resources exactly once", () => {
  const source = read("src/lib/llmText.ts");

  // The concise document defines the three sections; the AI crawler document
  // defines its own copies. The expanded document embeds the concise one.
  for (const heading of REQUIRED_SECTIONS) {
    assert.equal(
      countOccurrences(source, heading),
      2,
      `${heading} must appear once in buildLlmsTxt and once in buildAiTxt`,
    );
  }

  const fullBody = sourceBetween(
    source,
    "export function buildLlmsFullTxt",
    "export function buildAiTxt",
  );
  assert.ok(
    fullBody.includes("buildLlmsTxt()"),
    "llms-full must embed the concise document to avoid duplicate sections",
  );
  for (const heading of REQUIRED_SECTIONS) {
    assert.equal(
      countOccurrences(fullBody, heading),
      0,
      `llms-full must not duplicate the ${heading} section`,
    );
  }
});

test("detailed provider, release, developer, and trust content lives only in the expanded document", () => {
  const source = read("src/lib/llmText.ts");

  const conciseBody = sourceBetween(
    source,
    "export function buildLlmsTxt",
    "export function buildLlmsFullTxt",
  );
  const fullBody = sourceBetween(
    source,
    "export function buildLlmsFullTxt",
    "export function buildAiTxt",
  );

  for (const heading of DETAILED_SECTIONS) {
    assert.equal(
      countOccurrences(conciseBody, heading),
      0,
      `concise llms.txt must not include ${heading}`,
    );
    assert.equal(
      countOccurrences(fullBody, heading),
      1,
      `llms-full must include ${heading} exactly once`,
    );
  }
});

test("developer resources use canonical constants and resolve to public links", () => {
  const source = read("src/lib/llmText.ts");

  // Developer-resource entries must reference the shared SEO constants so the
  // AI documents cannot drift from the canonical repository identity.
  assert.ok(source.includes("`- [Documentation](${SITE_URL}/docs)`"));
  assert.ok(source.includes("`- [Source repository](${GITHUB_REPO_URL})`"));
  assert.ok(source.includes("`- [Release downloads](${GITHUB_RELEASES_URL})`"));
  assert.ok(source.includes("`- [Sponsor the project](${GITHUB_SPONSORS_URL})`"));
  assert.ok(source.includes("`- [Public API contract](${SITE_URL}/openapi.json)`"));

  // Resolved canonical URLs stay on the production origin.
  assert.ok(source.includes("${SITE_URL}/openapi.json"));
  assert.ok(source.includes("${SITE_URL}/about"));
  assert.ok(source.includes("${SITE_URL}/contact"));

  // The repository identity resolves from the canonical SEO constants.
  const seo = read("src/lib/seo.ts");
  assert.ok(
    seo.includes("https://github.com/Emanuele-web04/synara"),
    "source repository URL must be defined in the canonical SEO constants",
  );
});

test("About, Contact, and the public API contract are machine-discoverable", () => {
  const source = read("src/lib/llmText.ts");

  assert.ok(
    source.includes(`["About", \`\${SITE_URL}/about\`]`),
    "About must be a primary AI-readable page",
  );
  assert.ok(
    source.includes(`["Contact", \`\${SITE_URL}/contact\`]`),
    "Contact must be a primary AI-readable page",
  );
  assert.ok(
    source.includes("`- ${SITE_URL}/about`"),
    "About must be in the ai.txt canonical discovery resources",
  );
  assert.ok(
    source.includes("`- ${SITE_URL}/contact`"),
    "Contact must be in the ai.txt canonical discovery resources",
  );
  assert.ok(
    source.includes("`- ${SITE_URL}/openapi.json`"),
    "The API contract must be in the ai.txt canonical discovery resources",
  );
});

test("AI discovery routes keep their plain-text and cache contracts", () => {
  for (const route of ["llms.txt", "llms-full.txt", "ai.txt"]) {
    const source = read(`src/app/${route}/route.ts`);
    assert.ok(
      source.includes('"Content-Type": "text/plain; charset=utf-8"'),
      `${route} must stay plain text`,
    );
    assert.ok(
      source.includes('"Cache-Control": "public, max-age=3600, s-maxage=86400"'),
      `${route} must keep its public cache policy`,
    );
    assert.ok(
      source.includes("export const revalidate = 86400"),
      `${route} must keep its revalidation window`,
    );
  }
});
