import assert from "node:assert/strict";
import test from "node:test";
import { pageRepresentation, markdownNotFound, apiError } from "../../src/lib/agentHttp";
import { OPENAPI } from "../../src/lib/openapi";
import { API_METHODS } from "../../src/lib/apiContract";
import SwaggerParser from "@apidevtools/swagger-parser";

const cases: [string | null, string | undefined][] = [
  [null, "text/html"], ["*/*", "text/html"], ["text/*", "text/html"], ["", undefined],
  ["text/markdown", "text/markdown"], ["TEXT/MARKDOWN", "text/markdown"],
  ["text/markdown; charset=utf-8", "text/markdown"],
  ["text/markdown;q=0.8,text/html;q=0.9", "text/html"],
  ["text/markdown;q=0,text/html", "text/html"],
  ["text/html;q=0,*/*;q=0.5", "text/markdown"],
  ["text/markdown;q=0,*/*;q=0.5", "text/html"],
  ["text/markdown,*/*", "text/markdown"],
  ["text/markdown, text/html;q=0.8", "text/markdown"],
  ["application/json", undefined], ["text/*;q=0,*/*;q=0", undefined],
  ["text/markdown;variant=unavailable", undefined],
  ["text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8", "text/html"],
];
for (const [accept, expected] of cases) test(`Accept ${accept} -> ${expected}`, () => {
  assert.equal(pageRepresentation(accept)?.split(";")[0], expected);
});

test("404 Markdown contains recovery links and prevents cached misses", async () => {
  const res = markdownNotFound();
  assert.equal(res.status, 404);
  assert.match(res.headers.get("content-type")!, /^text\/markdown/);
  assert.equal(res.headers.get("cache-control"), "no-store");
  const text = await res.text();
  for (const link of ["llms.txt", "sitemap.xml", "docs.md", "openapi.json"]) assert.ok(text.includes(link));
});

test("JSON errors retain legacy clients and endpoint-specific headers", async () => {
  const res = apiError("RATE_LIMITED", "Slow down.", "Retry later.", 429, { "Retry-After": "60", Vary: "Origin" });
  assert.equal(res.status, 429); assert.equal(res.headers.get("retry-after"), "60");
  assert.equal(res.headers.get("vary"), "Origin");
  assert.deepEqual(await res.json(), { error: "Slow down.", code: "RATE_LIMITED", message: "Slow down.", hint: "Retry later." });
});

test("OpenAPI validates and every public operation is typed and unique", async () => {
  await SwaggerParser.validate(JSON.parse(JSON.stringify(OPENAPI)));
  const ids = new Set();
  for (const [path, methods] of Object.entries(OPENAPI.paths)) {
    for (const [method, operation] of Object.entries(methods)) {
      assert.ok(API_METHODS[path].includes(method.toUpperCase()));
      assert.ok(operation.description); assert.ok(operation.operationId);
      assert.ok(!ids.has(operation.operationId)); ids.add(operation.operationId);
      for (const response of Object.values(operation.responses)) {
        assert.ok(response.description);
        assert.ok(response.content["application/json"].schema);
      }
    }
  }
  assert.deepEqual(Object.keys(OPENAPI.paths).sort(), Object.keys(API_METHODS).filter(p => p !== "/api/inbound-email").sort());
});
