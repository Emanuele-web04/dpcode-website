import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function read(relativePath) {
  return readFileSync(path.join(ROOT, relativePath), "utf8");
}

const PUBLIC_COPY_FILES = [
  "src/app/page.tsx",
  "src/app/install/page.tsx",
  "src/components/Features.tsx",
  "src/components/Workflow.tsx",
  "src/components/PrivacySection.tsx",
  "src/components/ClosingCTA.tsx",
  "src/components/Testimonials.tsx",
  "src/data/faqs.ts",
  "src/data/product.ts",
  "src/lib/seo.ts",
  "src/lib/llmText.ts",
];

test("canonical product language is centralized and consumed by every discovery layer", () => {
  const product = read("src/data/product.ts");
  const homepage = read("src/app/page.tsx");
  const seo = read("src/lib/seo.ts");
  const llmText = read("src/lib/llmText.ts");
  const faq = read("src/data/faqs.ts");
  const closing = read("src/components/ClosingCTA.tsx");

  assert.ok(product.includes('PRODUCT_HERO_TITLE =\n  "Run every coding agent in one local workspace."'));
  assert.ok(product.includes("PRODUCT_HERO_DESCRIPTION"));
  assert.ok(product.includes("PRODUCT_DESCRIPTION"));
  assert.ok(product.includes("PRODUCT_CATEGORY"));
  assert.ok(product.includes("SUPPORTED_PROVIDERS"));
  assert.ok(product.includes("PRODUCT_PILLARS"));

  for (const [name, source] of [
    ["homepage", homepage],
    ["SEO", seo],
    ["AI discovery", llmText],
    ["FAQ", faq],
    ["closing CTA", closing],
  ]) {
    assert.match(source, /@\/data\/product/, `${name} does not consume canonical product data`);
  }
});

test("homepage hierarchy renders the canonical thesis and useful next actions", () => {
  const homepage = read("src/app/page.tsx");

  assert.ok(homepage.includes("PRODUCT_CATEGORY"));
  assert.ok(homepage.includes("PRODUCT_HERO_TITLE"));
  assert.ok(homepage.includes("PRODUCT_HERO_DESCRIPTION"));
  assert.ok(homepage.includes('href="/docs"'));
  assert.ok(homepage.includes("Free and open source"));
  assert.ok(homepage.includes("No Synara account required"));
  assert.ok(homepage.includes("ProviderMarkRow"));
  assert.equal(homepage.includes("AskAISection"), false);
});

test("provider cards use stable runtime capabilities instead of volatile model marketing", () => {
  const features = read("src/components/Features.tsx");

  for (const provider of [
    "Claude Code",
    "Codex",
    "OpenCode",
    "Cursor",
    "Antigravity",
    "Grok Build",
    "Kilo Code",
    "Pi",
    "Factory Droid",
  ]) {
    assert.ok(features.includes(`name: \"${provider}\"`), `missing provider card for ${provider}`);
  }

  for (const volatileLabel of [
    "Opus 4.8",
    "GPT-5.5",
    "Composer 2.5",
    "500+ models",
    "Zen + Go",
  ]) {
    assert.equal(features.includes(volatileLabel), false, `volatile label remains: ${volatileLabel}`);
  }

  for (const stableLabel of [
    "CLI + account",
    "Configured models",
    "Agent CLI",
    "agy CLI",
    "grok CLI",
    "Model registry",
    "droid CLI",
  ]) {
    assert.ok(features.includes(stableLabel), `stable capability label is missing: ${stableLabel}`);
  }
});

test("public homepage copy avoids defensive identity and repetitive positioning", () => {
  const combined = PUBLIC_COPY_FILES.map(read).join("\n");

  for (const phrase of [
    "The command center for agentic development",
    "operating system for agentic work",
    "Ask the models directly",
    "Let the models verify the fit",
    "no longer just a t3 code fork",
  ]) {
    assert.equal(combined.toLowerCase().includes(phrase.toLowerCase()), false, `retired phrase remains: ${phrase}`);
  }

  assert.equal(
    existsSync(path.join(ROOT, "src/components/AskAISection.tsx")),
    false,
    "retired defensive AskAI section still exists",
  );
});

test("privacy copy states both the local workspace boundary and provider boundary", () => {
  const privacy = read("src/components/PrivacySection.tsx");

  for (const marker of [
    "Workspace state stays on your machine",
    "Provider traffic goes to the selected provider",
    "No Synara account is required",
    "Anonymous analytics are opt-in",
    "provider sessions receive the context",
  ]) {
    assert.ok(privacy.includes(marker), `privacy boundary is missing: ${marker}`);
  }
});

test("testimonial curation excludes fork-comparison framing from the rendered homepage", () => {
  const testimonials = read("src/components/Testimonials.tsx");
  assert.ok(testimonials.includes("2071916101924262377"));
  assert.ok(testimonials.includes("EXCLUDED_TESTIMONIAL_IDS"));
  assert.match(testimonials, /filter\([\s\S]*EXCLUDED_TESTIMONIAL_IDS\.has\(card\.id\)/);
});

test("install and metadata surfaces share the new category", () => {
  const install = read("src/app/install/page.tsx");
  const seo = read("src/lib/seo.ts");

  assert.ok(install.includes("PRODUCT_CATEGORY"));
  assert.ok(install.includes("Download Synara — Coding Agent Workspace"));
  assert.ok(seo.includes("PRODUCT_HERO_TITLE"));
  assert.ok(seo.includes("PRODUCT_DESCRIPTION"));
  assert.ok(seo.includes("Coding agent workspace and control plane"));
});
