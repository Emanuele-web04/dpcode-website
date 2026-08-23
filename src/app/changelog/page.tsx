// FILE: changelog/page.tsx
// Purpose: Public changelog page 1 — the ten newest Synara releases, newest
//          first. Editorial, single-column layout inspired by the OpenAI Codex
//          changelog, in our palette: muted date, large headline with a
//          light-gray version, airy bullet lists, and inline `code` chips.
// Layer: App Router page (static). Body lives in ChangelogContent so the
//        per-version /changelog/v0.1.1 deep-link route and the paginated
//        /changelog/page/N archive route can reuse it verbatim.
// Note: Content mirrors the in-app "What's new" changelog (src/data/changelog.ts).

import { notFound } from "next/navigation";
import ChangelogContent from "@/components/ChangelogContent";
import {
  breadcrumbJsonLd,
  changelogCollectionJsonLd,
  jsonLdScript,
  pageMetadata,
} from "@/lib/seo";
import { getChangelogPage, getSortedReleases } from "@/lib/changelog";

export const metadata = pageMetadata({
  title: "Changelog — Synara",
  description:
    "Every Synara release: new providers, performance work, and the steady polish that makes the app faster and sturdier. Updated with each version.",
  path: "/changelog",
});

export default function ChangelogPage() {
  const page = getChangelogPage(1);
  if (!page) notFound();

  // The CollectionPage JSON-LD stays complete over every release even though
  // the visible page renders only page 1 (the ten newest).
  const allReleases = getSortedReleases();
  const jsonLd = [
    changelogCollectionJsonLd(allReleases),
    breadcrumbJsonLd([
      { name: "Synara", path: "/" },
      { name: "Changelog", path: "/changelog" },
    ]),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
      />
      <ChangelogContent
        releases={page.releases}
        previousPath={page.previousPath}
        nextPath={page.nextPath}
      />
    </>
  );
}
