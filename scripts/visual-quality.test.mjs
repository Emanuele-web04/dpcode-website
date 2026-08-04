import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function read(relativePath) {
  return readFileSync(path.join(ROOT, relativePath), "utf8");
}

test("browser quality CI uses a supported runtime and preserves failure evidence", () => {
  const workflow = read(".github/workflows/validate-docs.yml");
  const performance = read("scripts/performance-smoke.mjs");

  assert.ok(workflow.includes("node-version: 22.19.0"));

  for (const artifact of [
    "functional-browser-failure",
    "accessibility-failure",
    "visual-regression-failure",
    "performance-failure",
  ]) {
    assert.ok(workflow.includes(artifact), `missing failure artifact: ${artifact}`);
  }

  assert.ok(workflow.includes("Enforce browser quality gates"));
  assert.ok(workflow.includes("PERFORMANCE_OUTCOME"));
  assert.ok(performance.includes("test-results/performance-summary.json"));
  assert.ok(performance.includes("await writeFile(outputPath, serializedSummary)"));
});
