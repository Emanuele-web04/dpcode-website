// FILE: llms.mdx/docs/[[...slug]]/route.ts
// Purpose: Serves every public documentation page as clean Markdown.
// Layer: Internal App Router endpoint exposed through /docs*.md rewrites.

import { notFound } from "next/navigation";
import { docsSource } from "@/lib/docs";
import { buildDocumentationMarkdown } from "@/lib/docsMarkdown";

type MarkdownDocumentationRouteProps = {
  params: Promise<{ slug?: string[] }>;
};

export const revalidate = false;

export async function GET(_: Request, { params }: MarkdownDocumentationRouteProps) {
  const { slug } = await params;
  const page = docsSource.getPage(slug);

  if (!page) notFound();

  return new Response(`${await buildDocumentationMarkdown(page)}\n`, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}

export function generateStaticParams() {
  return docsSource.generateParams();
}
