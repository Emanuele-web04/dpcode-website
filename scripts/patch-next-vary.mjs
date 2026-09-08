// Next 16.3.0 replaces custom Vary values in its page entrypoint template.
// Preserve those values when adding Next's Flight cache keys. Remove this
// compatibility patch once the pinned Next release merges Vary itself.
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const nextRoot = path.dirname(require.resolve("next/package.json"));
const original = "res.setHeader('Vary', varyHeader);";
const patched = "res.setHeader('Vary', [res.getHeader('Vary'), varyHeader].filter(Boolean).join(', '));";
for (const relative of ["dist/build/templates/app-page-runtime.js", "dist/esm/build/templates/app-page-runtime.js"]) {
  const file = path.join(nextRoot, relative);
  const source = readFileSync(file, "utf8");
  if (source.includes(patched)) continue;
  if (JSON.parse(readFileSync(path.join(nextRoot, "package.json"), "utf8")).version !== "16.3.0" || source.split(original).length !== 2) {
    throw new Error(`Recheck the Next.js Vary compatibility patch after upgrading: ${relative}`);
  }
  writeFileSync(file, source.replace(original, patched));
}
