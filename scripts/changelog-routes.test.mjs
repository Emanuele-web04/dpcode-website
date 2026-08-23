// FILE: scripts/changelog-routes.test.mjs
// Purpose: Source-level guards for static changelog pagination (phase 10): the
//          index renders page 1 from the shared page model, the archive route
//          is fully static with pages 2..N, the sitemap advertises every
//          archive page and every release deep link, and ChangelogContent wires
//          the previous/next links plus the page-1-only latest pulse.
// Layer: node:test; reads source + data only (no build, no network, no runner).

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function read(relativePath) {
  return readFileSync(path.join(ROOT, relativePath), "utf8");
}

/** Release versions in curated newest-first order from src/data/changelog.ts. */
function releaseVersions() {
  const source = read("src/data/changelog.ts");
  return [...source.matchAll(/version:\s*"([^"]+)"/g)].map((match) => match[1]);
}

test("changelog archive paginates the release data", () => {
  const versions = releaseVersions();
  assert.ok(versions.length >= 11, "pagination only matters once there are two pages");

  const indexPage = read("src/app/changelog/page.tsx");
  assert.ok(
    indexPage.includes("getChangelogPage(1)"),
    "index must render page 1 from the shared page model",
  );
  assert.ok(
    indexPage.includes('path: "/changelog"'),
    "index must keep its /changelog canonical",
  );
  assert.ok(
    indexPage.includes("changelogCollectionJsonLd(allReleases)"),
    "index must keep the complete CollectionPage JSON-LD",
  );

  const archivePage = read("src/app/changelog/page/[page]/page.tsx");
  assert.ok(archivePage.includes("generateStaticParams"), "archive route needs generateStaticParams");
  assert.ok(archivePage.includes("dynamicParams = false"), "archive route must be fully static");
  assert.ok(archivePage.includes("getChangelogPageCount"), "archive route must size itself from the model");
  assert.ok(archivePage.includes("getChangelogPage"), "archive route must slice a page from the model");
  assert.ok(archivePage.includes("parsePageNumber"), "archive route must parse route params once");
  assert.ok(archivePage.includes("notFound"), "archive route must 404 unknown pages");
  assert.ok(archivePage.includes('`/changelog/page/${'), "archive route must build /changelog/page/N hrefs");

  const content = read("src/components/ChangelogContent.tsx");
  assert.ok(content.includes("previousPath"), "ChangelogContent must render the previous-page link");
  assert.ok(content.includes("nextPath"), "ChangelogContent must render the next-page link");
  assert.ok(content.includes("showLatestPulse"), "ChangelogContent must gate the latest-release pulse");
});

test("changelog sitemap advertises archive pages and every release deep link", () => {
  const versions = releaseVersions();
  const routes = read("src/lib/siteRoutes.ts");

  assert.ok(routes.includes("getChangelogPageCount"), "site routes must size archive pages from the model");
  assert.ok(routes.includes('`/changelog/page/${'), "site routes must advertise /changelog/page/N paths");
  assert.equal(
    routes.includes('"/changelog/page/1"'),
    false,
    "page 1 must stay at the index, not a separate archive path",
  );

  // Every release keeps its shareable deep link in the changelog sitemap.
  assert.ok(routes.includes("getChangelogSitemapEntries"), "changelog sitemap generator must survive");
  assert.ok(routes.includes("toVersionSlug"), "release deep links must keep using toVersionSlug");
  assert.ok(routes.includes('`/changelog/${toVersionSlug'), "release deep links must map every release");

  // Guard the data-derived shape: every release must be reachable through the
  // deep-link path used by the sitemap.
  for (const version of versions) {
    assert.match(version, /^v?\d+(?:\.\d+){1,2}$/, `release version is not a plausible slug: ${version}`);
  }
});
