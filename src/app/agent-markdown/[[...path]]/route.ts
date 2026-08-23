// Internal Markdown transport route. Serves the Markdown representation of a
// canonical public URL to requests the Proxy rewrote here with the private
// marker header. Direct requests and unmatched public paths get an explicit
// 404 so this URL is not a second public canonical route.
//
// Only GET is exported; Next.js auto-implements HEAD as GET and strips the
// response body for HEAD while preserving status and headers, so HEAD behaves
// consistently with GET.

import type { NextRequest } from "next/server";
import {
  AGENT_MARKDOWN_HEADER,
  AGENT_MARKDOWN_HEADER_VALUE,
} from "@/proxy";
import { resolveMarkdown } from "@/lib/agentMarkdown";

// The route is a per-request transport, never statically prerendered.
export const dynamic = "force-dynamic";

const MARKDOWN_CONTENT_TYPE = "text/markdown; charset=utf-8";

// Small Markdown body for unmatched public paths. Browsers never see it;
// they negotiate HTML and keep the existing src/app/not-found.tsx page.
const NOT_FOUND_BODY = [
  "# Not found",
  "",
  "The page you requested does not exist on trysynara.com.",
  "",
].join("\n");

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> },
) {
  if (
    request.headers.get(AGENT_MARKDOWN_HEADER) !== AGENT_MARKDOWN_HEADER_VALUE
  ) {
    // Did not come through the Proxy: this URL is not a public route.
    return new Response("Not found", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const { path } = await params;
  const canonicalPath = `/${(path ?? []).join("/")}`;
  const result = resolveMarkdown(canonicalPath);

  if (result === null) {
    return new Response(NOT_FOUND_BODY, {
      status: 404,
      headers: {
        "Content-Type": MARKDOWN_CONTENT_TYPE,
        Vary: "Accept",
        "Cache-Control": "no-store",
      },
    });
  }

  return new Response(result.body, {
    status: result.status,
    headers: {
      "Content-Type": MARKDOWN_CONTENT_TYPE,
      Vary: "Accept",
      "Cache-Control": result.cacheControl,
    },
  });
}
