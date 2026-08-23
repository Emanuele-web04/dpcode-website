// Unit tests for the Accept negotiation used by the Markdown Proxy
// (src/lib/acceptNegotiation.ts). Runnable with Node 24 type stripping:
//   node --test src/lib/acceptNegotiation.test.mjs
// Stays in src/lib (with the module it tests) so it does not collide with the
// regression-gate tests owned under scripts/.

import { test } from "node:test";
import assert from "node:assert";
import { negotiateAcceptFormat } from "./acceptNegotiation.ts";

const md = "markdown";
const html = "html";

test("missing or empty Accept header negotiates HTML", () => {
  assert.equal(negotiateAcceptFormat(null), html);
  assert.equal(negotiateAcceptFormat(undefined), html);
  assert.equal(negotiateAcceptFormat(""), html);
  assert.equal(negotiateAcceptFormat("   "), html);
});

test("browser Accept header negotiates HTML", () => {
  const browser =
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8";
  assert.equal(negotiateAcceptFormat(browser), html);
});

test("wildcards alone do not select Markdown", () => {
  assert.equal(negotiateAcceptFormat("*/*"), html);
  assert.equal(negotiateAcceptFormat("text/*"), html);
  assert.equal(negotiateAcceptFormat("text/*,application/json"), html);
});

test("explicit text/markdown negotiates Markdown", () => {
  assert.equal(negotiateAcceptFormat("text/markdown"), md);
  assert.equal(negotiateAcceptFormat("text/markdown, text/html"), md);
  assert.equal(negotiateAcceptFormat("TEXT/MARKDOWN"), md);
  assert.equal(negotiateAcceptFormat("text/markdown; charset=utf-8"), md);
});

test("quality values decide between Markdown and HTML", () => {
  assert.equal(
    negotiateAcceptFormat("text/markdown;q=0.5, text/html;q=1"),
    html,
  );
  assert.equal(
    negotiateAcceptFormat("text/markdown;q=1, text/html;q=0.9"),
    md,
  );
  assert.equal(
    negotiateAcceptFormat("text/markdown;q=0.8, text/html;q=0.8"),
    md,
  );
});

test("html quality comes from the most specific matching range", () => {
  assert.equal(
    negotiateAcceptFormat("text/*;q=0.9, text/markdown;q=0.5"),
    html,
  );
  assert.equal(
    negotiateAcceptFormat("text/*;q=0.2, text/html;q=1, text/markdown;q=0.5"),
    html,
  );
  // */* at q=1 means HTML is strictly more preferred than Markdown at 0.9.
  assert.equal(
    negotiateAcceptFormat("*/*;q=1, text/markdown;q=0.9"),
    html,
  );
  assert.equal(
    negotiateAcceptFormat("*/*;q=0.8, text/markdown;q=0.9"),
    md,
  );
});

test("explicit q=0 rejects the corresponding format", () => {
  assert.equal(negotiateAcceptFormat("text/markdown;q=0, */*;q=1"), html);
  assert.equal(
    negotiateAcceptFormat("text/markdown;q=1, text/html;q=0"),
    md,
  );
});

test("out-of-range quality values are clamped", () => {
  assert.equal(negotiateAcceptFormat("text/markdown;q=2"), md);
  assert.equal(negotiateAcceptFormat("text/markdown;q=-1"), html);
});

test("non-markdown media types negotiate HTML", () => {
  assert.equal(negotiateAcceptFormat("application/json"), html);
  assert.equal(negotiateAcceptFormat("application/xml, */*;q=0.5"), html);
});

test("malformed Accept headers negotiate HTML", () => {
  assert.equal(negotiateAcceptFormat("garbage/;,"), html);
  assert.equal(negotiateAcceptFormat("no-slash"), html);
  assert.equal(negotiateAcceptFormat("text/;q=0.5"), html);
});
