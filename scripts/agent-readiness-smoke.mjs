// Purpose: Deterministic Node smoke gate for the agent-readiness surface.
//          Spawns the production Next.js server on a dedicated port (or uses a
//          supplied AGENT_READINESS_BASE_URL) and verifies the 12 audit
//          behaviors from plans/01-agent-readiness: markdown negotiation, SSR
//          headings, live-vs-documented API contracts, OpenAPI scope, 404s,
//          AI discovery files, robots/sitemap discovery, changelog pagination
//          and deep links, Organization JSON-LD, and the trust pages.
// Run:      npm run test:agent-readiness
// Env:      AGENT_READINESS_BASE_URL (optional, skips spawning the server)
//           AGENT_READINESS_PORT    (optional, default 3222)
// Note:     Uses only built-in fetch. No dependencies added.

import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NEXT_CLI = path.join(ROOT, "node_modules", "next", "dist", "bin", "next");

const CANONICAL_ORIGIN = "https://www.trysynara.com";
const DEFAULT_PORT = 3222;
const HOST = "127.0.0.1";
const STARTUP_TIMEOUT_MS = 60_000;
const REQUEST_TIMEOUT_MS = 10_000;
const POLL_INTERVAL_MS = 500;
const STOP_GRACE_MS = 5_000;
const STOP_KILL_MS = 2_000;

const MARKDOWN_ACCEPT = "text/markdown";
const BROWSER_ACCEPT =
  "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8";
const UNKNOWN_PATH = "/__agent-readiness-not-a-real-route__";

// Core registry routes that must negotiate Markdown (phase 1 list: the static
// pages plus the approved trust pages). Parameterized docs and release pages
// resolve through phase-1 resolvers and are covered separately.
const NEGOTIATED_ROUTES = [
  "/",
  "/install",
  "/docs",
  "/privacy",
  "/sponsor",
  "/changelog",
  "/about",
  "/contact",
];
const RESOLVED_NEGOTIATED_ROUTES = [
  "/docs/providers/claude-code",
  "/changelog/v0.7.3",
];

// Pinned by the curated src/data/changelog.ts and the phase-9 model
// (CHANGELOG_PAGE_SIZE = 10). Update both values when releases are added.
const EXPECTED_CHANGELOG_RELEASE_COUNT = 67;
const CHANGELOG_PAGE_SIZE = 10;
const EXPECTED_CHANGELOG_PAGE_COUNT = 7;

// Encoded-HTML budget for the paginated /changelog index. Keep page 1
// bounded while allowing the current production payload (~290 KB) and
// enough headroom for framework serialization changes.
const CHANGELOG_PAGE_INDEX_BUDGET_BYTES = 350_000;

// llms.txt must stay concise relative to llms-full.txt (peer-verified sizes:
// llms.txt ~16KB, llms-full.txt ~175KB before the new sections).
const LLMS_BUDGET_BYTES = 20_000;
// llms.txt must stay under one-fifth of llms-full.txt in size.
const LLMS_CONCISE_RATIO = 5;

// A negotiated Markdown body this short must be an error page, not a real
// representation of a public route.
const MIN_MARKDOWN_BODY_LENGTH = 100;

const FEEDBACK_MAX_REQUEST_BYTES = 64 * 1024;
const RATE_LIMIT_ATTEMPTS = 6;

const VALID_FEEDBACK_DIAGNOSTICS = {
  appVersion: "smoke",
  submittedAt: "2026-08-24T00:00:00.000Z",
  provider: "smoke",
  model: "smoke",
  projectKind: "smoke",
  environmentMode: "smoke",
  runtimeMode: "smoke",
  interactionMode: "smoke",
  sessionStatus: "smoke",
  latestTurnState: "smoke",
  messageCount: 0,
  activityCount: 0,
  hasPendingApproval: false,
  hasPendingUserInput: false,
  hasThreadError: false,
  userAgent: "agent-readiness-smoke",
  platform: "smoke",
  language: "en",
  viewport: "0x0",
};

const VALID_FEEDBACK_BODY = {
  details: "smoke test",
  category: null,
  diagnostics: VALID_FEEDBACK_DIAGNOSTICS,
};
// Stable codes added by phase 4 (additive: original error strings preserved).
const FEEDBACK_ERROR_CODES = new Set([
  "forbidden_origin",
  "invalid_client",
  "payload_too_large",
  "rate_limited",
  "invalid_payload",
  "delivery_unavailable",
  "delivery_failed",
  "upstream_unavailable",
]);

const suppliedBaseUrl = process.env.AGENT_READINESS_BASE_URL?.replace(/\/+$/, "");
const port = Number(process.env.AGENT_READINESS_PORT ?? DEFAULT_PORT);
const baseUrl = suppliedBaseUrl ?? `http://${HOST}:${port}`;

function log(message) {
  console.log(message);
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function verify(condition, label, observed) {
  if (condition) return;
  throw new Error(`${label} failed against ${CANONICAL_ORIGIN}; observed ${observed}`);
}

function verifyStatus(response, pathname, expectedStatus) {
  if (response.status === expectedStatus) return;
  throw new Error(
    `${pathname} expected HTTP ${expectedStatus} against ${CANONICAL_ORIGIN}; observed ${response.status} ${response.statusText}`,
  );
}

function verifyHeader(response, name, expected, label) {
  const observed = response.headers.get(name) ?? "(missing)";
  if (expected.test(observed)) return;
  throw new Error(`${label} against ${CANONICAL_ORIGIN}: expected ${name} ${expected}; observed "${observed}"`);
}

function verifyBody(body, expected, label) {
  if (expected.test(body)) return;
  throw new Error(`${label} against ${CANONICAL_ORIGIN}: body does not match ${expected}`);
}

function verifyNotHtml(body, label) {
  for (const marker of ["<html", "<!DOCTYPE", "__NEXT_DATA__"]) {
    if (body.includes(marker)) {
      throw new Error(`${label} against ${CANONICAL_ORIGIN}: body leaked HTML marker "${marker}"`);
    }
  }
}

function verifyMarkdownShape(body, label) {
  verifyNotHtml(body, label);
  if (!/^#{1,6}\s/m.test(body)) {
    throw new Error(`${label} against ${CANONICAL_ORIGIN}: markdown body has no heading`);
  }
}

function countH1(body) {
  return (body.match(/<h1[\s>]/gi) ?? []).length;
}

function assertSectionOnce(body, sectionTitle, label) {
  const occurrences = body.split(`## ${sectionTitle}`).length - 1;
  verify(occurrences === 1, `${label} section "${sectionTitle}"`, `${occurrences} occurrences`);
}

function assertErrorBody(payload, expectedCode, label) {
  verify(Boolean(payload) && typeof payload === "object", `${label} body shape`, JSON.stringify(payload));
  verify(typeof payload.error === "string" && payload.error.length > 0, `${label} error string`, JSON.stringify(payload));
  verify(payload.code === expectedCode, `${label} code`, JSON.stringify(payload));
  verify(FEEDBACK_ERROR_CODES.has(payload.code), `${label} stable code`, payload.code);
}

function startProductionServer() {
  const child = spawn(
    process.execPath,
    [NEXT_CLI, "start", "-H", HOST, "-p", String(port)],
    {
      cwd: ROOT,
      env: { ...process.env, NODE_ENV: "production" },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  let output = "";
  for (const stream of [child.stdout, child.stderr]) {
    stream.setEncoding("utf8");
    stream.on("data", (chunk) => {
      output += chunk;
      process.stdout.write(chunk);
    });
  }
  return { child, readOutput: () => output };
}

async function waitForServerReady(server) {
  const deadline = Date.now() + STARTUP_TIMEOUT_MS;
  while (Date.now() < deadline) {
    if (server.child.exitCode !== null) {
      throw new Error(`Next.js exited before becoming ready.\n${server.readOutput()}`);
    }
    try {
      const response = await fetch(`${baseUrl}/`, {
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      if (response.ok) return;
    } catch {
      // Connection refused while the server is still booting; the loop exit
      // and exit-code check above turn a real startup failure into an error.
    }
    await delay(POLL_INTERVAL_MS);
  }
  throw new Error(`Timed out waiting for ${baseUrl}.\n${server.readOutput()}`);
}

async function stopServer(server) {
  if (server.child.exitCode !== null) return;
  const exited = new Promise((resolve) => server.child.once("exit", resolve));
  server.child.kill("SIGTERM");
  await Promise.race([exited, delay(STOP_GRACE_MS)]);
  if (server.child.exitCode === null) {
    server.child.kill("SIGKILL");
    await Promise.race([exited, delay(STOP_KILL_MS)]);
  }
  server.child.stdout.destroy();
  server.child.stderr.destroy();
}

async function get(pathname, { accept = BROWSER_ACCEPT, headers = {} } = {}) {
  return fetch(`${baseUrl}${pathname}`, {
    headers: { ...(accept ? { accept } : {}), ...headers },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
}

async function getText(pathname, { accept = BROWSER_ACCEPT } = {}) {
  const response = await get(pathname, { accept });
  const body = await response.text();
  return { response, body };
}

async function postFeedback({
  origin = null,
  sendClientHeader = false,
  rawBody = null,
  body = null,
  rateLimitKey = "agent-readiness",
}) {
  const headers = { "x-forwarded-for": rateLimitKey };
  if (origin !== null) headers.origin = origin;
  if (sendClientHeader) headers["x-synara-feedback"] = "1";
  headers["content-type"] = "application/json";
  const payload = rawBody ?? (body === null ? "" : JSON.stringify(body));
  return fetch(`${baseUrl}/api/feedback`, {
    method: "POST",
    headers,
    body: payload,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
}

function parseJsonLdScript(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    // A single malformed block (e.g. a streamed fragment) must not abort the
    // whole JSON-LD audit, so it is counted and surfaced instead.
    console.warn(`agent-readiness: skipped an unparseable ld+json block (${raw.length} bytes)`);
    return null;
  }
}

function findOrganizationNode(body) {
  const scriptPattern = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  for (const match of body.matchAll(scriptPattern)) {
    const parsed = parseJsonLdScript(match[1]);
    const candidates = Array.isArray(parsed)
      ? parsed
      : parsed?.["@graph"] ?? (parsed ? [parsed] : []);
    for (const candidate of candidates.flat(Infinity)) {
      if (
        candidate &&
        typeof candidate === "object" &&
        candidate["@type"] === "Organization"
      ) {
        return candidate;
      }
    }
  }
  return null;
}

async function auditHomepageSsr() {
  log("audit 2: homepage SSR, single h1, thesis and section copy");
  const homepage = await getText("/");
  verifyStatus(homepage.response, "/", 200);
  verify(countH1(homepage.body) === 1, "homepage h1 count", String(countH1(homepage.body)));
  for (const marker of [
    "Run every coding agent in one workspace",
    "One workspace. Separate tasks. Shared control.",
    "Keep execution and verification in the same loop.",
  ]) {
    verifyBody(homepage.body, new RegExp(escapeRegExp(marker)), "homepage SSR");
  }
}

async function auditMarkdownNegotiation() {
  log("audit 1+5: markdown negotiation and representation headers");
  for (const route of [...NEGOTIATED_ROUTES, ...RESOLVED_NEGOTIATED_ROUTES]) {
    const canonical = route === "/" ? CANONICAL_ORIGIN : `${CANONICAL_ORIGIN}${route}`;

    const markdown = await getText(route, { accept: MARKDOWN_ACCEPT });
    verifyStatus(markdown.response, route, 200);
    verifyHeader(
      markdown.response,
      "content-type",
      /^text\/markdown;\s*charset=utf-8/i,
      `${route} markdown`,
    );
    verifyHeader(markdown.response, "vary", /accept/i, `${route} markdown`);
    verifyHeader(markdown.response, "cache-control", /public/i, `${route} markdown`);
    verifyBody(markdown.body, new RegExp(escapeRegExp(canonical)), `${route} markdown canonical`);
    verifyMarkdownShape(markdown.body, `${route} markdown`);
    verify(
      markdown.body.length >= MIN_MARKDOWN_BODY_LENGTH,
      `${route} markdown length`,
      `${markdown.body.length} bytes`,
    );

    const html = await getText(route, { accept: BROWSER_ACCEPT });
    verifyStatus(html.response, route, 200);
    verifyHeader(html.response, "content-type", /^text\/html/i, `${route} html`);
    verifyHeader(html.response, "vary", /accept/i, `${route} html`);
  }

  for (const utilityPath of ["/llms.txt", "/llms-full.txt", "/ai.txt"]) {
    for (const accept of [MARKDOWN_ACCEPT, BROWSER_ACCEPT]) {
      const response = await get(utilityPath, { accept });
      verifyStatus(response, utilityPath, 200);
      verifyHeader(
        response,
        "content-type",
        /^text\/plain/i,
        `${utilityPath} with Accept ${accept}`,
      );
    }
  }
}

async function auditUnknownPath404s() {
  log("audit 6: unknown-path 404s for markdown and browser clients");
  const markdown = await getText(UNKNOWN_PATH, { accept: MARKDOWN_ACCEPT });
  verifyStatus(markdown.response, UNKNOWN_PATH, 404);
  verifyHeader(
    markdown.response,
    "content-type",
    /^text\/markdown;\s*charset=utf-8/i,
    `${UNKNOWN_PATH} markdown 404`,
  );
  verifyHeader(markdown.response, "vary", /accept/i, `${UNKNOWN_PATH} markdown 404`);
  verifyNotHtml(markdown.body, `${UNKNOWN_PATH} markdown 404`);

  const html = await getText(UNKNOWN_PATH, { accept: BROWSER_ACCEPT });
  verifyStatus(html.response, UNKNOWN_PATH, 404);
  verifyHeader(html.response, "content-type", /^text\/html/i, `${UNKNOWN_PATH} html 404`);
  verifyBody(html.body, /Page not found/, `${UNKNOWN_PATH} html 404`);
}

async function auditOpenApi() {
  log("audit 3+4: /openapi.json scope and header contract");
  const response = await get("/openapi.json");
  verifyStatus(response, "/openapi.json", 200);
  verifyHeader(response, "content-type", /^application\/json/i, "/openapi.json");
  verifyHeader(response, "cache-control", /public/i, "/openapi.json");
  const document = await response.json();
  verify(
    typeof document.openapi === "string" && document.openapi.startsWith("3"),
    "/openapi.json version",
    document.openapi,
  );
  const serverUrl = document.servers?.[0]?.url;
  verify(serverUrl === CANONICAL_ORIGIN, "/openapi.json server url", serverUrl);
  const paths = Object.keys(document.paths ?? {});
  for (const expectedPath of ["/api/installer-count", "/api/search", "/api/feedback"]) {
    verify(paths.includes(expectedPath), "openapi paths", `missing ${expectedPath}`);
  }
  verify(
    !paths.includes("/api/inbound-email"),
    "openapi paths",
    "inbound-email must stay private",
  );
  const operationIds = [];
  const httpMethods = ["get", "post", "options", "put", "patch", "delete", "head"];
  for (const pathItem of Object.values(document.paths ?? {})) {
    for (const method of httpMethods) {
      const operation = pathItem?.[method];
      if (operation?.operationId) operationIds.push(operation.operationId);
    }
  }
  verify(
    new Set(operationIds).size === operationIds.length,
    "openapi operationId uniqueness",
    operationIds.join(", "),
  );
  for (const expectedId of [
    "getInstallerCount",
    "searchDocs",
    "submitFeedback",
    "feedbackCorsPreflight",
  ]) {
    verify(operationIds.includes(expectedId), "openapi operationIds", `missing ${expectedId}`);
  }
}

async function auditApiErrors() {
  log("audit 8: machine endpoint error contract");
  const installer = await get("/api/installer-count");
  if (installer.status === 200) {
    const payload = await installer.json();
    verify(typeof payload.count === "number", "installer-count 200 body", JSON.stringify(payload));
  } else if (installer.status === 503) {
    const payload = await installer.json();
    assertErrorBody(payload, "upstream_unavailable", "installer-count 503");
    verifyHeader(installer, "cache-control", /no-store/i, "installer-count 503");
  } else {
    throw new Error(
      `installer-count against ${CANONICAL_ORIGIN}: unexpected status ${installer.status}`,
    );
  }

  const search = await get("/api/search?q=provider");
  verifyStatus(search, "/api/search?q=provider", 200);
  verifyHeader(search, "content-type", /^application\/json/i, "search");

  const observedCodes = [];
  const openApiResponse = await get("/openapi.json");
  const openApiDocument = await openApiResponse.json();
  const serializedOpenApi = JSON.stringify(openApiDocument);

  if (process.env.RESEND_API_KEY) {
    log("audit 8: skipping feedback branches (RESEND_API_KEY is set)");
  } else {
    const forbidden = await postFeedback({ origin: "https://evil.example", body: {} });
    verifyStatus(forbidden, "feedback forbidden origin", 403);
    const forbiddenBody = await forbidden.json();
    assertErrorBody(forbiddenBody, "forbidden_origin", "feedback forbidden origin");
    observedCodes.push(forbiddenBody.code);

    const invalidClient = await postFeedback({ body: {}, rateLimitKey: "invalid-client" });
    verifyStatus(invalidClient, "feedback invalid client", 400);
    const invalidClientBody = await invalidClient.json();
    assertErrorBody(invalidClientBody, "invalid_client", "feedback invalid client");
    observedCodes.push(invalidClientBody.code);

    const tooLarge = await postFeedback({
      sendClientHeader: true,
      body: { details: "x".repeat(FEEDBACK_MAX_REQUEST_BYTES + 1) },
      rateLimitKey: "payload-too-large",
    });
    verifyStatus(tooLarge, "feedback payload too large", 413);
    const tooLargeBody = await tooLarge.json();
    assertErrorBody(tooLargeBody, "payload_too_large", "feedback payload too large");
    observedCodes.push(tooLargeBody.code);

    const invalidPayload = await postFeedback({
      sendClientHeader: true,
      rawBody: "{not json",
      rateLimitKey: "invalid-payload",
    });
    verifyStatus(invalidPayload, "feedback invalid payload", 400);
    const invalidPayloadBody = await invalidPayload.json();
    assertErrorBody(invalidPayloadBody, "invalid_payload", "feedback invalid payload");
    observedCodes.push(invalidPayloadBody.code);

    const unavailable = await postFeedback({
      sendClientHeader: true,
      body: VALID_FEEDBACK_BODY,
      rateLimitKey: "delivery-unavailable",
    });
    verifyStatus(unavailable, "feedback delivery unavailable", 503);
    const unavailableBody = await unavailable.json();
    assertErrorBody(unavailableBody, "delivery_unavailable", "feedback delivery unavailable");
    observedCodes.push(unavailableBody.code);

    let observedRateLimited = false;
    for (let attempt = 0; attempt < RATE_LIMIT_ATTEMPTS; attempt += 1) {
      const attemptResponse = await postFeedback({
        sendClientHeader: true,
        body: VALID_FEEDBACK_BODY,
        rateLimitKey: "rate-limit",
      });
      if (attemptResponse.status === 429) {
        observedRateLimited = true;
        const rateLimitedBody = await attemptResponse.json();
        assertErrorBody(rateLimitedBody, "rate_limited", "feedback rate limited");
        verifyHeader(attemptResponse, "retry-after", /^\d+$/, "feedback rate limited retry-after");
        observedCodes.push(rateLimitedBody.code);
      }
    }
    verify(
      observedRateLimited,
      "feedback rate limit",
      `no 429 within ${RATE_LIMIT_ATTEMPTS} attempts`,
    );
  }

  for (const code of observedCodes) {
    verify(
      serializedOpenApi.includes(code),
      "openapi documents live error code",
      code,
    );
  }
}

async function auditTrustDiscovery() {
  log("audit 7+9: ai text files, robots, and sitemap discovery");
  const llms = await getText("/llms.txt");
  verifyStatus(llms.response, "/llms.txt", 200);
  verifyHeader(llms.response, "content-type", /^text\/plain/i, "/llms.txt");
  for (const section of ["When to use Synara", "When not to use Synara", "Developer resources"]) {
    assertSectionOnce(llms.body, section, "/llms.txt");
  }
  for (const marker of [
    "- [About](https://www.trysynara.com/about)",
    "- [Contact](https://www.trysynara.com/contact)",
    "[Public API contract](https://www.trysynara.com/openapi.json)",
  ]) {
    verifyBody(llms.body, new RegExp(escapeRegExp(marker)), "/llms.txt");
  }
  const llmsBytes = Buffer.byteLength(llms.body, "utf8");

  const llmsFull = await getText("/llms-full.txt");
  verifyStatus(llmsFull.response, "/llms-full.txt", 200);
  for (const section of [
    "When to use Synara",
    "When not to use Synara",
    "Developer resources",
    "Expanded documentation map",
    "Homepage FAQ",
  ]) {
    assertSectionOnce(llmsFull.body, section, "/llms-full.txt");
  }
  const llmsFullBytes = Buffer.byteLength(llmsFull.body, "utf8");
  verify(llmsBytes < LLMS_BUDGET_BYTES, "/llms.txt size", `${llmsBytes} bytes`);
  verify(
    llmsBytes < llmsFullBytes / LLMS_CONCISE_RATIO,
    "/llms.txt concise vs llms-full",
    `${llmsBytes} vs ${llmsFullBytes}`,
  );

  const ai = await getText("/ai.txt");
  verifyStatus(ai.response, "/ai.txt", 200);
  for (const section of ["When to use Synara", "When not to use Synara", "Developer resources"]) {
    assertSectionOnce(ai.body, section, "/ai.txt");
  }
  for (const marker of [
    "https://www.trysynara.com/about",
    "https://www.trysynara.com/contact",
    "https://www.trysynara.com/openapi.json",
  ]) {
    verifyBody(ai.body, new RegExp(escapeRegExp(marker)), "/ai.txt");
  }

  const robots = await getText("/robots.txt");
  verifyStatus(robots.response, "/robots.txt", 200);
  verifyBody(robots.body, /Allow: \/openapi\.json/, "robots.txt");
  verifyBody(robots.body, /Disallow: \/api\//, "robots.txt");

  const sitemap = await getText("/sitemap.xml");
  verifyStatus(sitemap.response, "/sitemap.xml", 200);
  for (const route of ["/about", "/contact", "/changelog/page/2", "/changelog/page/7"]) {
    verifyBody(
      sitemap.body,
      new RegExp(escapeRegExp(`${CANONICAL_ORIGIN}${route}`)),
      "sitemap.xml",
    );
  }
}

async function auditChangelog() {
  log("audit 10: changelog pagination, page budget, and deep links");
  const index = await getText("/changelog");
  verifyStatus(index.response, "/changelog", 200);
  const indexBytes = Buffer.byteLength(index.body, "utf8");
  verify(
    indexBytes < CHANGELOG_PAGE_INDEX_BUDGET_BYTES,
    "changelog page 1 encoded bytes",
    `${indexBytes}`,
  );
  for (const marker of ["0.7.3", "0.6.2"]) {
    verifyBody(index.body, new RegExp(escapeRegExp(marker)), "/changelog page 1");
  }
  verifyBody(index.body, /href="\/changelog\/page\/2"/, "changelog page 1 next link");

  const archiveLinks = [];
  for (let page = 1; page <= EXPECTED_CHANGELOG_PAGE_COUNT; page += 1) {
    const pathname = page === 1 ? "/changelog" : `/changelog/page/${page}`;
    const archive = page === 1 ? index : await getText(pathname);
    verifyStatus(archive.response, pathname, 200);

    const links = [
      ...archive.body.matchAll(/href="(\/changelog\/v[^"]+)"/g),
    ].map((match) => match[1]);
    const uniqueLinks = [...new Set(links)];
    const expectedSize =
      page < EXPECTED_CHANGELOG_PAGE_COUNT
        ? CHANGELOG_PAGE_SIZE
        : EXPECTED_CHANGELOG_RELEASE_COUNT -
          CHANGELOG_PAGE_SIZE * (EXPECTED_CHANGELOG_PAGE_COUNT - 1);
    verify(
      uniqueLinks.length === expectedSize,
      `${pathname} release count`,
      `${uniqueLinks.length}`,
    );
    archiveLinks.push(...uniqueLinks);

    if (page > 1) {
      const previousPath = page === 2 ? "/changelog" : `/changelog/page/${page - 1}`;
      verifyBody(
        archive.body,
        new RegExp(`href="${escapeRegExp(previousPath)}"`),
        `${pathname} previous link`,
      );
    }
    if (page < EXPECTED_CHANGELOG_PAGE_COUNT) {
      verifyBody(
        archive.body,
        new RegExp(`href="/changelog/page/${page + 1}"`),
        `${pathname} next link`,
      );
    }
  }
  verify(
    new Set(archiveLinks).size === EXPECTED_CHANGELOG_RELEASE_COUNT,
    "changelog archive uniqueness",
    `${new Set(archiveLinks).size} unique links`,
  );
  for (const invalidPage of ["/changelog/page/1", "/changelog/page/8"]) {
    const response = await get(invalidPage);
    verifyStatus(response, invalidPage, 404);
  }

  const changelogSitemap = await getText("/changelog/sitemap.xml");
  verifyStatus(changelogSitemap.response, "/changelog/sitemap.xml", 200);
  const deepLinks = [...changelogSitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => match[1],
  );
  const releaseLinks = deepLinks.filter((url) => url.includes("/changelog/v"));
  verify(
    releaseLinks.length === EXPECTED_CHANGELOG_RELEASE_COUNT,
    "changelog deep links",
    `${releaseLinks.length} links`,
  );
  verify(
    Math.ceil(releaseLinks.length / CHANGELOG_PAGE_SIZE) === EXPECTED_CHANGELOG_PAGE_COUNT,
    "changelog page count",
    `ceil(${releaseLinks.length}/${CHANGELOG_PAGE_SIZE})`,
  );

  for (const url of releaseLinks) {
    const pathname = url.replace(CANONICAL_ORIGIN, "");
    const response = await get(pathname);
    verifyStatus(response, pathname, 200);
  }
  log(`audit 10: verified ${releaseLinks.length} release deep links`);
}

async function auditOrganizationJsonLd() {
  log("audit 11: Organization JSON-LD");
  const homepage = await getText("/");
  const organizationNode = findOrganizationNode(homepage.body);
  verify(Boolean(organizationNode), "organization json-ld", "no Organization node on homepage");
  verify(organizationNode.url === CANONICAL_ORIGIN, "organization url", organizationNode.url);
  verify(organizationNode.name === "Synara", "organization name", organizationNode.name);
  const sameAs = Array.isArray(organizationNode.sameAs) ? organizationNode.sameAs : [];
  verify(
    sameAs.includes("https://github.com/Emanuele-web04/synara"),
    "organization sameAs",
    sameAs.join(", "),
  );
  verify(
    !Object.hasOwn(organizationNode, "address"),
    "organization address",
    "must not publish an address",
  );
  verify(
    !Object.hasOwn(organizationNode, "telephone"),
    "organization telephone",
    "must not publish a telephone number",
  );
  verify(
    organizationNode.email === "feedback@trysynara.com",
    "organization email",
    organizationNode.email,
  );
  const contactPoint = organizationNode.contactPoint;
  verify(
    Boolean(contactPoint) && contactPoint["@type"] === "ContactPoint",
    "organization contactPoint",
    JSON.stringify(contactPoint),
  );
}

async function auditTrustPages() {
  log("audit 12: about and contact surfaces");
  const about = await getText("/about");
  verifyStatus(about.response, "/about", 200);
  verifyHeader(about.response, "content-type", /^text\/html/i, "/about");
  verify(countH1(about.body) === 1, "/about h1 count", String(countH1(about.body)));
  verifyBody(about.body, /A local-first workspace for coding agents/, "/about");
  verifyBody(about.body, /Who maintains it/, "/about");

  const contact = await getText("/contact");
  verifyStatus(contact.response, "/contact", 200);
  verifyHeader(contact.response, "content-type", /^text\/html/i, "/contact");
  verify(countH1(contact.body) === 1, "/contact h1 count", String(countH1(contact.body)));
  verifyBody(contact.body, /Get in touch/, "/contact");
  verifyBody(contact.body, /mailto:feedback@trysynara\.com/, "/contact");

  const homepage = await getText("/");
  for (const href of ['href="/about"', 'href="/contact"']) {
    verifyBody(homepage.body, new RegExp(escapeRegExp(href)), "homepage footer");
  }
}

let server = null;
try {
  if (!suppliedBaseUrl) {
    server = startProductionServer();
    await waitForServerReady(server);
  }
  await auditHomepageSsr();
  await auditMarkdownNegotiation();
  await auditUnknownPath404s();
  await auditOpenApi();
  await auditApiErrors();
  await auditTrustDiscovery();
  await auditChangelog();
  await auditOrganizationJsonLd();
  await auditTrustPages();
  log(`agent-readiness smoke passed against ${baseUrl}`);
} finally {
  if (server) await stopServer(server);
}
