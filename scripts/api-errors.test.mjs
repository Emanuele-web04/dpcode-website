import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function read(relativePath) {
  return readFileSync(path.join(ROOT, relativePath), "utf8");
}

// Whitespace-insensitive view of a source file so assertions survive formatting.
function compact(source) {
  return source.replace(/\s+/g, " ");
}

function countOccurrences(haystack, needle) {
  let count = 0;
  let index = haystack.indexOf(needle);
  while (index !== -1) {
    count += 1;
    index = haystack.indexOf(needle, index + needle.length);
  }
  return count;
}

// The closed public code set. The OpenAPI document and the regression smoke
// derive their enums from API_ERROR_CODES; this table is the route-level truth.
const EXPECTED_CODES = [
  "forbidden_origin",
  "invalid_client",
  "payload_too_large",
  "rate_limited",
  "invalid_payload",
  "delivery_unavailable",
  "delivery_failed",
  "upstream_unavailable",
];

// Each feedback error branch: code, status, exact message, expected occurrences
// in the route (some branches share a code).
const FEEDBACK_BRANCHES = [
  {
    code: "forbidden_origin",
    status: 403,
    message: "Origin is not allowed.",
    occurrences: 2, // OPTIONS and POST
  },
  {
    code: "invalid_client",
    status: 400,
    message: "Invalid feedback client.",
    occurrences: 1,
  },
  {
    code: "payload_too_large",
    status: 413,
    message: "Feedback is too large.",
    occurrences: 2, // content-length check and body byte-size check
  },
  {
    code: "rate_limited",
    status: 429,
    message: "Too many feedback reports. Please try again later.",
    occurrences: 1,
  },
  {
    code: "invalid_payload",
    status: 400,
    message: "Feedback payload is invalid.",
    occurrences: 2, // JSON parse failure and parseFeedback rejection
  },
];

const helperSource = read("src/lib/apiResponse.ts");
const helperCompact = compact(helperSource);

test("API_ERROR_CODES is the closed public set with no duplicates", () => {
  const match = /export const API_ERROR_CODES = \[([\s\S]*?)\] as const;/.exec(helperSource);
  assert.ok(match, "API_ERROR_CODES is not a direct const array export");
  const codes = [...match[1].matchAll(/"([a-z_]+)"/g)].map((entry) => entry[1]);
  assert.deepEqual(codes, EXPECTED_CODES);
  assert.equal(new Set(codes).size, codes.length);
});

test("the helper exposes ApiErrorCode and ApiErrorBody types for contract reuse", () => {
  assert.ok(helperCompact.includes("export type ApiErrorCode = (typeof API_ERROR_CODES)[number];"));
  assert.ok(helperCompact.includes("export type ApiErrorBody = { error: string; code: ApiErrorCode; };"));
});

test("the helper emits a JSON envelope with no-store default and override support", () => {
  assert.ok(helperCompact.includes("headers.set(\"content-type\", \"application/json; charset=utf-8\")"));
  assert.ok(helperCompact.includes('if (!headers.has("cache-control"))'));
  assert.ok(helperCompact.includes('headers.set("cache-control", "no-store")'));
  assert.ok(helperCompact.includes("new Response(JSON.stringify(body)"));
  assert.ok(helperCompact.includes("{ ...init, status, headers }"));
});

const feedbackSource = read("src/app/api/feedback/route.ts");
const feedbackCompact = compact(feedbackSource);

test("every feedback error branch keeps its message, status, and adds a stable code", () => {
  for (const branch of FEEDBACK_BRANCHES) {
    const needle = `code: "${branch.code}"`;
    const label = `${branch.code} (${branch.status})`;
    assert.equal(
      countOccurrences(feedbackCompact, needle),
      branch.occurrences,
      `${label}: expected ${branch.occurrences} branch(es)`,
    );
    const envelope = `{ error: "${branch.message}", code: "${branch.code}" }, ${branch.status},`;
    assert.ok(
      feedbackCompact.includes(envelope),
      `${label}: expected envelope snippet ${envelope}`,
    );
  }
});

test("feedback delivery errors keep both messages and statuses with their codes", () => {
  assert.equal(
    countOccurrences(
      feedbackCompact,
      'code: unavailable ? "delivery_unavailable" : "delivery_failed"',
    ),
    1,
  );
  assert.ok(
    feedbackCompact.includes(
      'error: unavailable ? "Feedback delivery is temporarily unavailable." : "Feedback could not be delivered."',
    ),
  );
  assert.ok(
    feedbackCompact.includes(
      'code: unavailable ? "delivery_unavailable" : "delivery_failed", }, unavailable ? 503 : 502,',
    ),
  );
  assert.ok(feedbackCompact.includes("Feedback delivery is temporarily unavailable."));
  assert.ok(feedbackCompact.includes("Feedback could not be delivered."));
});

test("feedback route preserves CORS, Retry-After, and the success response", () => {
  assert.ok(feedbackCompact.includes('"retry-after": String(rateLimit.retryAfter)'));
  assert.ok(feedbackCompact.includes("{ headers: responseHeaders(allowedOrigin) }"));
  assert.ok(feedbackCompact.includes("{ headers: responseHeaders(null) }"));
  assert.ok(feedbackCompact.includes("jsonResponse({ ok: true }, 200, allowedOrigin)"));
  assert.ok(feedbackCompact.includes('request.headers.get("x-synara-feedback") !== "1"'));
  // Every error branch migrated to the shared helper; none left as bare error JSON.
  assert.ok(!feedbackSource.includes("jsonResponse({ error:"));
});

test("installer-count 503 is additive and keeps its no-store cache contract", () => {
  const source = compact(read("src/app/api/installer-count/route.ts"));
  assert.equal(countOccurrences(source, 'code: "upstream_unavailable"'), 1);
  assert.ok(
    source.includes(
      '{ error: "Unable to fetch installer count.", code: "upstream_unavailable" }, 503,',
    ),
  );
  assert.ok(source.includes('"Cache-Control": "no-store, max-age=0"'));
  assert.ok(
    source.includes('"Cache-Control": "public, s-maxage=60, stale-while-revalidate=300"'),
  );
});

test("search route stays untouched: the fumadocs wrapper exposes no error boundary", () => {
  const source = read("src/app/api/search/route.ts");
  assert.ok(!source.includes("apiErrorResponse"));
  assert.ok(!source.includes("code:"));
  assert.ok(!source.includes("error:"));
});
