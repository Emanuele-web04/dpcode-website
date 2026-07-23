import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findNeighbour } from "fumadocs-core/page-tree";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  PageLastUpdate,
} from "fumadocs-ui/layouts/docs/page";
import { DocsPagination } from "@/components/docs/pagination";
import { getMDXComponents } from "@/components/mdx";
import { docsSource } from "@/lib/docs";

type DocumentationPageProps = {
  params: Promise<{ slug?: string[] }>;
};

export default async function DocumentationPage({ params }: DocumentationPageProps) {
  const { slug } = await params;
  const page = docsSource.getPage(slug);

  if (!page) notFound();

  const Content = page.data.body;
  const neighbours = findNeighbour(docsSource.getPageTree(), page.url);

  return (
    <DocsPage
      toc={page.data.toc}
      tableOfContent={{ style: "clerk" }}
      breadcrumb={{ includeRoot: false, includePage: true }}
      footer={{ enabled: false }}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <Content components={getMDXComponents()} />
      </DocsBody>
      <div className="docs-meta mt-6 flex flex-row flex-wrap items-center justify-end gap-3 border-t border-border pt-4 text-[0.8125rem] text-muted-foreground">
        {page.data.lastModified ? (
          <PageLastUpdate date={page.data.lastModified} />
        ) : null}
      </div>
      <DocsPagination previous={neighbours.previous} next={neighbours.next} />
    </DocsPage>
  );
}

export async function generateMetadata({ params }: DocumentationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = docsSource.getPage(slug);

  if (!page) notFound();

  return {
    title: `${page.data.title} — Synara Docs`,
    description: page.data.description,
    alternates: { canonical: page.url },
    openGraph: {
      type: "article",
      url: page.url,
      title: `${page.data.title} — Synara Docs`,
      description: page.data.description,
    },
  };
}

export function generateStaticParams() {
  return docsSource.generateParams();
}
