// FILE: lib/changelog.ts
// Purpose: Shared, server-importable helpers for the changelog — sorting by
//          semver, building the stable section anchors, mapping a release to a
//          shareable URL slug (and back), and the nav-item list. Centralizing
//          this keeps the static /changelog page, the per-version
//          /changelog/v0.1.1 route, and the sitemap perfectly in sync.
// Layer: shared logic (no React).

import { CHANGELOG_ENTRIES, type ChangelogEntry } from "@/data/changelog";
import type { ChangelogNavItem } from "@/lib/useActiveAnchor";

// Newest-first semver compare so the source order can drift without affecting
// any consumer. Mirrors the in-app sort in whatsNew/logic.ts.
export function compareVersions(a: string, b: string): number {
  const pa = a.split(".").map((n) => Number.parseInt(n, 10) || 0);
  const pb = b.split(".").map((n) => Number.parseInt(n, 10) || 0);
  for (let i = 0; i < 3; i += 1) {
    if ((pa[i] ?? 0) !== (pb[i] ?? 0)) return (pa[i] ?? 0) - (pb[i] ?? 0);
  }
  return 0;
}

// Stable in-page anchor per release, e.g. "0.1.1" -> "v0-1-1". Shared by the
// page sections and the left-rail nav so the two never drift.
export const toAnchor = (version: string) => `v${version.replace(/\./g, "-")}`;

// Shareable URL slug for a release, e.g. "0.1.1" -> "v0.1.1". Used as the
// dynamic [version] segment: /changelog/v0.1.1.
export const toVersionSlug = (version: string) => `v${version}`;

// Inverse of toVersionSlug: "v0.1.1" -> "0.1.1". Tolerates a missing "v" and
// returns the bare version string (callers validate it against the data).
export const fromVersionSlug = (slug: string) =>
  slug.startsWith("v") ? slug.slice(1) : slug;

/** All releases, sorted newest-first. */
export function getSortedReleases(): ChangelogEntry[] {
  return [...CHANGELOG_ENTRIES].sort((l, r) =>
    compareVersions(r.version, l.version),
  );
}

/** Nav items (version, date, anchor) for the rail + picker, newest-first. */
export function getNavItems(): ChangelogNavItem[] {
  return getSortedReleases().map((entry) => ({
    version: entry.version,
    date: entry.date,
    anchor: toAnchor(entry.version),
  }));
}

/** Find a release by its bare version string (e.g. "0.1.1"), or undefined. */
export function findRelease(version: string): ChangelogEntry | undefined {
  return CHANGELOG_ENTRIES.find((entry) => entry.version === version);
}
