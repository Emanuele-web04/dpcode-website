import assert from "node:assert/strict";
import { spawn } from "node:child_process";

const HOST = "127.0.0.1";
const PORT = 3210;
const ORIGIN = `http://${HOST}:${PORT}`;
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

let output = "";
const server = spawn(
  npmCommand,
  ["run", "start", "--", "-H", HOST, "-p", String(PORT)],
  {
    env: { ...process.env, NODE_ENV: "production" },
    stdio: ["ignore", "pipe", "pipe"],
  },
);

for (const stream of [server.stdout, server.stderr]) {
  stream.setEncoding("utf8");
  stream.on("data", (chunk) => {
    output += chunk;
    process.stdout.write(chunk);
  });
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function waitForServer() {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`Next.js exited before becoming ready.\n${output}`);
    }
    try {
      const response = await fetch(`${ORIGIN}/`);
      if (response.ok) return;
    } catch {
      // The server is still starting.
    }
    await delay(500);
  }
  throw new Error(`Timed out waiting for ${ORIGIN}.\n${output}`);
}

async function readRoute(pathname, expectedContentType) {
  const response = await fetch(`${ORIGIN}${pathname}`);
  const body = await response.text();
  assert.equal(response.status, 200, `${pathname} returned ${response.status}\n${body}`);
  assert.match(
    response.headers.get("content-type") ?? "",
    expectedContentType,
    `${pathname} returned the wrong content type`,
  );
  return body;
}

async function stopServer() {
  if (server.exitCode !== null) return;
  server.kill("SIGTERM");
  await Promise.race([
    new Promise((resolve) => server.once("exit", resolve)),
    delay(5_000),
  ]);
  if (server.exitCode === null) server.kill("SIGKILL");
}

try {
  await waitForServer();

  const docs = await readRoute("/docs", /text\/html/i);
  assert.match(
    docs,
    /<link rel="canonical" href="https:\/\/www\.trysynara\.com\/docs"/,
    "docs page is missing its absolute self-canonical",
  );
  assert.match(docs, /property="og:type" content="article"/);
  assert.match(docs, /property="og:image"/);
  assert.match(docs, /name="twitter:card" content="summary_large_image"/);
  assert.ok(docs.includes('"@type":"TechArticle"'), "docs page is missing TechArticle JSON-LD");
  assert.ok(docs.includes('"@type":"BreadcrumbList"'), "docs page is missing breadcrumb JSON-LD");

  for (const pathname of [
    "/docs/providers",
    "/docs/workflows",
    "/docs/troubleshooting",
    "/docs/troubleshooting/report-a-problem",
  ]) {
    const html = await readRoute(pathname, /text\/html/i);
    assert.ok(html.includes('"@type":"TechArticle"'), `${pathname} lacks article JSON-LD`);
  }

  const robots = await readRoute("/robots.txt", /text\/plain/i);
  for (const marker of [
    "User-Agent: OAI-SearchBot",
    "User-Agent: ChatGPT-User",
    "User-Agent: Claude-SearchBot",
    "User-Agent: Claude-User",
    "User-Agent: PerplexityBot",
    "User-Agent: GPTBot",
    "Disallow: /api/",
    "Sitemap: https://www.trysynara.com/sitemap-index.xml",
  ]) {
    assert.ok(robots.includes(marker), `robots.txt is missing ${marker}`);
  }

  const sitemapIndex = await readRoute("/sitemap-index.xml", /application\/xml/i);
  assert.equal(
    (sitemapIndex.match(/<sitemap>/g) ?? []).length,
    2,
    "sitemap index must contain the main and changelog sitemaps",
  );
  assert.ok(sitemapIndex.includes("https://www.trysynara.com/sitemap.xml"));
  assert.ok(sitemapIndex.includes("https://www.trysynara.com/changelog/sitemap.xml"));

  const sitemap = await readRoute("/sitemap.xml", /application\/xml/i);
  for (const route of [
    "/docs",
    "/docs/providers/claude-code",
    "/docs/workflows/agent-gateway",
    "/docs/troubleshooting/report-a-problem",
  ]) {
    assert.ok(
      sitemap.includes(`https://www.trysynara.com${route}`),
      `sitemap.xml is missing ${route}`,
    );
  }
  for (const utilityPath of ["/llms.txt", "/llms-full.txt", "/ai.txt"]) {
    assert.equal(
      sitemap.includes(`https://www.trysynara.com${utilityPath}`),
      false,
      `sitemap.xml should not advertise ${utilityPath} as a search-result page`,
    );
  }

  const llms = await readRoute("/llms.txt", /text\/plain/i);
  for (const marker of [
    "## Documentation index",
    "https://www.trysynara.com/docs/providers",
    "https://www.trysynara.com/docs/workflows",
    "https://www.trysynara.com/docs/troubleshooting",
    "robots.txt and page-level indexing directives remain authoritative",
  ]) {
    assert.ok(llms.includes(marker), `llms.txt is missing ${marker}`);
  }

  const llmsFull = await readRoute("/llms-full.txt", /text\/plain/i);
  assert.ok(llmsFull.includes("## Expanded documentation map"));
  assert.ok(llmsFull.includes("### Report a problem"));
  assert.ok(llmsFull.includes("Canonical URL: https://www.trysynara.com/docs/troubleshooting/report-a-problem"));

  const ai = await readRoute("/ai.txt", /text\/plain/i);
  assert.ok(ai.includes("AI search and user-directed retrieval agents:"));
  assert.ok(ai.includes("Model-development controls, separate from search visibility:"));
  assert.ok(ai.includes("This file is informational and does not grant or revoke crawler permission."));

  console.log("SEO/AEO production smoke test passed.");
} finally {
  await stopServer();
}
