import { buildPageMarkdown } from "@/lib/pageMarkdown";
import { markdownNotFound } from "@/lib/agentHttp";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 1800;

export async function GET(_: Request, { params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params;
  const path = `/${slug.join("/")}`;
  const markdown = await buildPageMarkdown(path);
  if (markdown === null) return markdownNotFound();
  return new Response(`${markdown}\n`, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Vary: "Accept, Accept-Encoding",
      "Cache-Control": "public, max-age=0, s-maxage=1800",
      Link: `<${SITE_URL}${path}>; rel="canonical", </llms.txt>; rel="describedby"`,
      "X-Robots-Tag": "noindex, follow",
    },
  });
}
