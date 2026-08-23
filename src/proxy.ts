// Proxy: negotiate Markdown responses for canonical public URLs.
//
// When a client explicitly prefers text/markdown over text/html (quality-
// weighted Accept parsing), the request is rewritten to the internal
// /agent-markdown transport route with a private marker header proving it
// came through here. Every other request passes through unchanged, except
// that negotiated URLs get `Vary: Accept` so shared caches keep the HTML and
// Markdown variants apart.

import { NextResponse, type NextRequest } from "next/server";
import { negotiateAcceptFormat } from "@/lib/acceptNegotiation";

// Internal transport route that serves the Markdown representation. It is
// not a public canonical URL; the Proxy rewrites here and only here, and the
// route rejects direct requests that lack the marker.
export const AGENT_MARKDOWN_PATH = "/agent-markdown";
// Private marker header set on rewritten requests so the internal handler can
// prove the request came through the Proxy.
export const AGENT_MARKDOWN_HEADER = "x-internal-agent-markdown";
export const AGENT_MARKDOWN_HEADER_VALUE = "1";

// Next.js forces Proxy to run for Pages Router data requests (/_next/data/...)
// even when the matcher excludes them. They are not negotiated URLs, so they
// pass through without a Vary header.
const NEXT_DATA_PREFIX = "/_next/data";

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith(NEXT_DATA_PREFIX)) {
    return NextResponse.next();
  }

  const format = negotiateAcceptFormat(request.headers.get("accept"));

  if (format === "markdown") {
    const url = new URL(request.nextUrl);
    url.pathname =
      request.nextUrl.pathname === "/"
        ? AGENT_MARKDOWN_PATH
        : `${AGENT_MARKDOWN_PATH}${request.nextUrl.pathname}`;
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(AGENT_MARKDOWN_HEADER, AGENT_MARKDOWN_HEADER_VALUE);
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }

  const response = NextResponse.next();
  const vary = response.headers.get("vary");
  response.headers.set("vary", vary ? `${vary}, Accept` : "Accept");
  return response;
}

export const config = {
  matcher: [
    // Public page routes only. Excludes API routes, Next.js internals, the
    // internal transport path, metadata files, the dedicated AI text routes,
    // and static assets.
    "/((?!api|_next|agent-markdown|llms\\.txt|llms-full\\.txt|ai\\.txt|sitemap|robots\\.txt|manifest\\.webmanifest|icon|apple-icon|favicon|.*\\.(?:png|jpe?g|gif|svg|webp|ico|webmanifest|xml|json|txt)$).*)",
  ],
};
