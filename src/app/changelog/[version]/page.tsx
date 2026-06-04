// FILE: changelog/[version]/page.tsx
// Purpose: Shareable per-release deep link — /changelog/v0.1.1. Renders the full
//          changelog (so the rail/picker keep working) and scrolls the targeted
//          release into view, while carrying its own canonical URL + metadata so
//          a shared link previews and indexes as that specific version.
// Layer: App Router dynamic page (statically generated per release).
// Note: The [version] segment is the slug "v0.1.1" (see toVersionSlug); we strip
//       the leading "v" to look the release up in CHANGELOG_ENTRIES.

import { notFound } from "next/navigation";
import ChangelogContent from "@/components/ChangelogContent";
import { pageMetadata } from "@/lib/seo";
import {
  findRelease,
  fromVersionSlug,
  getSortedReleases,
  toVersionSlug,
} from "@/lib/changelog";

// Pre-render one static page per release: /changelog/v0.1.1, v0.1.0, …
export function generateStaticParams() {
  return getSortedReleases().map((entry) => ({
    version: toVersionSlug(entry.version),
  }));
}

// Only the versions we generate are valid; anything else 404s.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ version: string }>;
}) {
  const { version: slug } = await params;
  const entry = findRelease(fromVersionSlug(slug));
  if (!entry) return {};

  const highlights = entry.features.map((f) => f.title).join(", ");
  return pageMetadata({
    title: `Synara ${entry.version} — Changelog`,
    description: `What's new in Synara ${entry.version} (${entry.date}): ${highlights}.`,
    path: `/changelog/${toVersionSlug(entry.version)}`,
  });
}

export default async function ChangelogVersionPage({
  params,
}: {
  params: Promise<{ version: string }>;
}) {
  const { version: slug } = await params;
  const entry = findRelease(fromVersionSlug(slug));
  if (!entry) notFound();

  return <ChangelogContent focusVersion={entry.version} />;
}
