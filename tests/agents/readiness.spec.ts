import { expect, test } from "@playwright/test";
import SwaggerParser from "@apidevtools/swagger-parser";
import Ajv2020 from "ajv/dist/2020";
import addFormats from "ajv-formats";
import { getSortedReleases, toVersionSlug, toAnchor } from "../../src/lib/changelog";

const pages = ["/", "/install", "/docs", "/changelog", "/privacy", "/sponsor", "/sponsors"];
const markdownUrl = (path: string) => path === "/" ? "/index.md" : `${path}.md`;

function expectVary(value: string) {
  const tokens = value.toLowerCase().split(",").map(s => s.trim());
  expect(tokens).toContain("accept"); expect(tokens).toContain("accept-encoding");
}

test("canonical pages negotiate Markdown and HTML without mixing cached variants", async ({ request }) => {
  for (const path of pages) {
    for (const accept of ["text/markdown", "text/html", "text/markdown"]) {
      const response = await request.get(path, { headers: { Accept: accept } });
      expect(response.status(), path).toBe(200);
      expect(response.headers()["content-type"], path).toContain(accept);
      if (accept === "text/markdown") {
        expectVary(response.headers().vary);
        const body = await response.text(); expect(body, path).toMatch(/^# /); expect(body.length, path).toBeLessThan(100_000);
        expect(body).not.toContain("<!DOCTYPE html>");
        const explicit = await request.get(markdownUrl(path)); expect(explicit.status(), path).toBe(200);
        expect(await explicit.text()).toBe(body);
      }
    }
    const head = await request.head(path, { headers: { Accept: "text/markdown" } });
    expect(head.status()).toBe(200); expect(head.headers()["content-type"]).toContain("text/markdown"); expect(await head.body()).toHaveLength(0);
  }
});

test("HTTP preference handling, 406s, Flight, and static assets remain correct", async ({ request }) => {
  for (const [accept, type] of [["text/markdown;q=0,text/html", "text/html"], ["text/markdown;q=1,text/html;q=0.5", "text/markdown"], ["*/*", "text/html"], ["TEXT/MARKDOWN", "text/markdown"]]) {
    const res = await request.get("/", { headers: { Accept: accept } }); expect(res.status()).toBe(200); expect(res.headers()["content-type"]).toContain(type);
  }
  const unsupported = await request.get("/", { headers: { Accept: "application/json" } });
  expect(unsupported.status()).toBe(406); expectVary(unsupported.headers().vary);
  const flight = await request.get("/", { headers: { RSC: "1" } });
  expect(flight.status()).toBe(200); expect(flight.headers()["content-type"]).toContain("text/x-component");
  const logo = await request.get("/logo.svg", { headers: { Accept: "image/svg+xml" } });
  expect(logo.status()).toBe(200); expect(logo.headers()["content-type"]).toContain("image/svg+xml");
});

test("missing pages and Markdown documents return real 404s with recovery links", async ({ request }) => {
  for (const path of ["/agent-check-nonexistent", "/docs/nonexistent", "/changelog/v999.999.999", "/nonexistent.md", "/docs/nonexistent.md", "/llms.mdx/docs/nonexistent"]) {
    const res = await request.get(path, { headers: { Accept: "text/markdown" } });
    expect(res.status(), path).toBe(404); expect(res.headers()["content-type"]).toContain("text/markdown");
    const body = await res.text(); for (const link of ["sitemap.xml", "llms.txt", "docs.md", "openapi.json"]) expect(body).toContain(link);
  }
  const missing = await request.get("/agent-check-nonexistent"); expect(missing.status()).toBe(404); expect(missing.headers()["content-type"]).toContain("text/markdown");
  for (const path of ["/docs/nonexistent", "/changelog/v999.999.999"]) expect((await request.get(path, { headers: { Accept: "text/html" } })).status(), path).toBe(404);
  const html = await request.get("/agent-check-nonexistent", { headers: { Accept: "text/html" } });
  expect(html.status()).toBe(404); expect(html.headers()["content-type"]).toContain("text/html"); expect(await html.text()).toContain("Back to home");
  const upperHtml = await request.get("/agent-check-nonexistent", { headers: { Accept: "TEXT/HTML" } });
  expect(upperHtml.status()).toBe(404); expect(upperHtml.headers()["content-type"]).toContain("text/html");
});

test("every sitemap page and Markdown representation is reachable and bounded", async ({ request }) => {
  test.setTimeout(120_000);
  const urls = new Set<string>();
  for (const path of ["/sitemap.xml", "/changelog/sitemap.xml"]) {
    const res = await request.get(path); expect(res.status()).toBe(200); expect(res.headers()["content-type"]).toContain("xml");
    for (const match of (await res.text()).matchAll(/<loc>([^<]+)<\/loc>/g)) urls.add(new URL(match[1]).pathname);
  }
  expect(urls.size).toBeGreaterThan(50);
  let largest = { path: "", chars: 0 };
  for (const path of urls) {
    const html = await request.get(path, { headers: { Accept: "text/html" } }); expect(html.status(), path).toBe(200);
    const raw = await html.text();
    const text = raw.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");
    if (path !== "/changelog") expect(text.length, `${path} extracted HTML text`).toBeLessThan(100_000);
    if (text.length > largest.chars) largest = { path, chars: text.length };
    const md = await request.get(path, { headers: { Accept: "text/markdown" } }); expect(md.status(), path).toBe(200);
    expect(md.headers()["content-type"], path).toContain("text/markdown"); expectVary(md.headers().vary);
    const body = await md.text(); expect(body.length, path).toBeLessThan(100_000);
    const explicit = await request.get(markdownUrl(path)); expect(explicit.status(), path).toBe(200); expect(await explicit.text()).toBe(body);
  }
  console.log(`Verified ${urls.size} canonical pages and Markdown variants; largest extracted HTML: ${largest.path}, ${largest.chars} characters.`);
});

test("discovery files follow llms.txt format and resolve every local discovery link", async ({ request }) => {
  for (const path of ["/llms.txt", "/llms-full.txt", "/ai.txt", "/agent-instructions.md", "/robots.txt", "/sitemap-index.xml", "/manifest.webmanifest", "/openapi.json"]) {
    const response = await request.get(path); expect(response.status(), path).toBe(200); expect((await response.body()).length).toBeGreaterThan(0);
    const type = path.endsWith(".json") ? "application/json" : path.endsWith(".xml") ? "xml" : path.endsWith(".md") ? "text/markdown" : path.endsWith(".webmanifest") ? "application/manifest+json" : "text/plain";
    expect(response.headers()["content-type"], path).toContain(type);
  }
  const llms = await (await request.get("/llms.txt")).text();
  expect(llms).toMatch(/^# Synara\n\n> /); expect(llms).toContain("## When to use Synara");
  for (const section of llms.split(/^## /m).slice(1)) {
    for (const line of section.split("\n").slice(1).filter(Boolean)) expect(line).toMatch(/^- \[[^\]]+\]\(https:\/\/[^)]+\)(?:: .*)?$/);
  }
  const instructions = await (await request.get("/agent-instructions.md")).text();
  expect(instructions).toContain("only when the user explicitly asks");
  const links = new Set([...`${llms}\n${instructions}`.matchAll(/\]\((https:\/\/www\.trysynara\.com[^)]+)\)/g)].map(m => new URL(m[1]).pathname));
  for (const path of links) expect((await request.get(path)).status(), path).toBe(200);
});

test("public API responses validate against the published OpenAPI document", async ({ request }) => {
  const res = await request.get("/openapi.json"); expect(res.headers()["content-type"]).toContain("application/json");
  const spec = await res.json(); await SwaggerParser.validate(structuredClone(spec));
  const resolved = await SwaggerParser.dereference(structuredClone(spec));
  const ajv = new Ajv2020({ strict: false }); addFormats(ajv);
  const validateError = ajv.compile(spec.components.schemas.Error);
  for (const path of ["/api", "/api/search?query=worktree&limit=5", "/api/search", "/api/installer-count"]) {
    const response = await request.get(path); expect(response.status(), path).toBe(200);
    const pathname = path.split("?")[0];
    const operation = resolved.paths![pathname]!.get!;
    // Dereferencing above resolves all response schemas before JSON Schema validation.
    const responseObject = operation.responses!["200"] as { content: Record<string, { schema: object }> };
    const validate = ajv.compile(responseObject.content["application/json"].schema);
    expect(validate(await response.json()), JSON.stringify(validate.errors)).toBe(true);
  }
  const webhook = await request.post("/api/inbound-email", { data: {} });
  expect([400, 503]).toContain(webhook.status()); expect(validateError(await webhook.json())).toBe(true);
  for (const [path, status, method] of [["/api/no-such-operation", 404, "GET"], ["/api/search?limit=invalid", 400, "GET"], ["/api/search?limit=101", 400, "GET"], ["/api/feedback", 400, "POST"], ["/api/feedback", 405, "GET"], ["/api/search", 405, "POST"], ["/api/inbound-email", 405, "GET"]] as const) {
    const response = await request.fetch(path, { method }); expect(response.status(), path).toBe(status);
    expect(response.headers()["content-type"]).toContain("application/json");
    expect(validateError(await response.json()), JSON.stringify(validateError.errors)).toBe(true);
    if (status === 405) expect(response.headers().allow).toBeTruthy();
  }
});

test("changelog preserves release anchors, navigation, design and complete per-release notes", async ({ page, request }) => {
  await page.goto("/changelog");
  await expect(page.getByRole("heading", { name: "What's new in Synara." })).toBeVisible();
  const releases = getSortedReleases();
  const bodyText = await page.locator("body").innerText();
  for (const entry of releases) {
    await expect(page.locator(`section#${toAnchor(entry.version)}`)).toHaveCount(1);
    for (const feature of entry.features) expect(bodyText, entry.version).toContain(feature.title);
    const md = await (await request.get(`/changelog/${toVersionSlug(entry.version)}.md`)).text();
    for (const feature of entry.features) { expect(md).toContain(feature.title); expect(md).toContain(feature.description); if (feature.details) expect(md).toContain(feature.details); }
  }
  await page.locator(`section#${toAnchor(releases[0].version)}`).getByRole("link", { name: `link to Synara ${releases[0].version}` }).click();
  await expect(page).toHaveURL(new RegExp(`/changelog/${toVersionSlug(releases[0].version)}$`));
  await expect(page.getByRole("heading", { name: `Synara ${releases[0].version} release notes.` })).toBeVisible();
  await page.screenshot({ path: "test-results/changelog-release.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto("/changelog");
  await page.getByLabel("Jump to release").selectOption(toAnchor(releases[2].version));
  await expect(page.locator(`section#${toAnchor(releases[2].version)}`)).toBeInViewport();
  await page.screenshot({ path: "test-results/changelog-mobile.png" });
});
