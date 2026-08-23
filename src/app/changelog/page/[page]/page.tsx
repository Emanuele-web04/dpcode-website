// FILE: changelog/page/[page]/page.tsx
// Purpose: Paginated changelog archive — /changelog/page/2 … /changelog/page/N.
//          Page 1 is the index at /changelog (never duplicated here), so this
//          route prebuilds pages 2 through the last page. Any other page
//          number 404s via dynamicParams = false.
// Layer: App Router dynamic page (statically generated). Body lives in
//        ChangelogContent, shared with the index and per-version routes.

import { notFound } from "next/navigation";
import ChangelogContent from "@/components/ChangelogContent";
import {
  breadcrumbJsonLd,
  jsonLdScript,
  pageMetadata,
} from "@/lib/seo";
import { getChangelogPage, getChangelogPageCount } from "@/lib/changelog";

// Route params are parsed once into a valid one-based page number. Anything
// non-numeric or below page 1 is rejected; the model then rejects pages above
// the archive.
function parsePageNumber(value: string): number | undefined {
  if (!/^\d+$/.test(value)) return undefined;
  const page = Number(value);
  return page >= 1 ? page : undefined;
}

export function generateStaticParams() {
  const pageCount = getChangelogPageCount();
  return Array.from({ length: Math.max(0, pageCount - 1) }, (_, index) => ({
    page: String(index + 2),
  }));
}

// Only the archive pages we generate exist; anything else 404s.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page: value } = await params;
  const page = parsePageNumber(value);
  const model = page ? getChangelogPage(page) : undefined;
  if (!model) return {};

  return pageMetadata({
    title: `Changelog — Synara — Page ${model.page} of ${model.pageCount}`,
    description: `Older Synara releases, page ${model.page} of ${model.pageCount}.`,
    path: `/changelog/page/${model.page}`,
  });
}

export default async function ChangelogArchivePage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page: value } = await params;
  const page = parsePageNumber(value);
  const model = page ? getChangelogPage(page) : undefined;
  if (!model) notFound();

  const first = model.releases[0];
  const last = model.releases[model.releases.length - 1];
  const range =
    first && last && first.version !== last.version
      ? `${first.version} to ${last.version}`
      : (first?.version ?? "");

  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Synara", path: "/" },
      { name: "Changelog", path: "/changelog" },
      { name: `Page ${model.page}`, path: `/changelog/page/${model.page}` },
    ]),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
      />
      <ChangelogContent
        releases={model.releases}
        title="Older Synara releases."
        description={`Synara releases ${range}, page ${model.page} of ${model.pageCount}.`}
        previousPath={model.previousPath}
        nextPath={model.nextPath}
        showLatestPulse={false}
      />
    </>
  );
}
