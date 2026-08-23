// FILE: lib/changelog.ts
// Purpose: Shared, server-importable helpers for the changelog — preserving
//          curated release order, building stable section anchors, and mapping
//          releases to shareable URL slugs. Centralizing this keeps the static
//          /changelog page, per-version routes, and the sitemap in sync.
// Layer: shared logic (no React).

import { CHANGELOG_ENTRIES, type ChangelogEntry } from "@/data/changelog";

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

/** All releases in the curated newest-first order from src/data/changelog.ts. */
export function getSortedReleases(): ChangelogEntry[] {
  return [...CHANGELOG_ENTRIES];
}

/** Find a release by its bare version string (e.g. "0.1.1"), or undefined. */
export function findRelease(version: string): ChangelogEntry | undefined {
  return CHANGELOG_ENTRIES.find((entry) => entry.version === version);
}

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------
// Deterministic static page model for the changelog index. One-based page
// numbers: page 1 renders at /changelog, pages 2..N at /changelog/page/N.
// Every slice is a fresh array over the curated newest-first entries, so
// callers can never mutate the source data, and every release URL preserved
// by findRelease/toVersionSlug continues to resolve regardless of paging.

/** Releases per changelog page. */
export const CHANGELOG_PAGE_SIZE = 10;

/** One slice of the changelog archive plus its navigation paths. */
export interface ChangelogPage {
  /** One-based page number. */
  readonly page: number;
  /** Total number of pages at CHANGELOG_PAGE_SIZE per page. */
  readonly pageCount: number;
  /** Releases on this page in the curated newest-first order (fresh copy). */
  readonly releases: readonly ChangelogEntry[];
  /** Absolute path of the previous page; omitted on page 1. */
  readonly previousPath?: string;
  /** Absolute path of the next page; omitted on the last page. */
  readonly nextPath?: string;
}

/** Total number of pages for the current release set (at least one). */
export function getChangelogPageCount(): number {
  return Math.max(1, Math.ceil(CHANGELOG_ENTRIES.length / CHANGELOG_PAGE_SIZE));
}

/**
 * The releases for a one-based page number, or undefined when the page is out
 * of range (non-integer, below one, or beyond the last page). Page 1 renders
 * at the index (/changelog); every later page at /changelog/page/N.
 */
export function getChangelogPage(page: number): ChangelogPage | undefined {
  if (!Number.isInteger(page) || page < 1) return undefined;
  const pageCount = getChangelogPageCount();
  if (page > pageCount) return undefined;

  const start = (page - 1) * CHANGELOG_PAGE_SIZE;
  const releases = CHANGELOG_ENTRIES.slice(start, start + CHANGELOG_PAGE_SIZE);
  const previousPath =
    page > 1 ? (page === 2 ? "/changelog" : `/changelog/page/${page - 1}`) : undefined;
  const nextPath = page < pageCount ? `/changelog/page/${page + 1}` : undefined;

  return { page, pageCount, releases, previousPath, nextPath };
}
