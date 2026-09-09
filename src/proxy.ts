import { NextRequest, NextResponse } from "next/server";
import { apiError, pageRepresentation } from "@/lib/agentHttp";
import { API_METHODS } from "@/lib/apiContract";

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path === "/api" || path.startsWith("/api/")) {
    const allowed = API_METHODS[path];
    if (!allowed) return apiError("NOT_FOUND", "API endpoint not found.", "Use /openapi.json to find public operations.", 404);
    if (!allowed.includes(request.method)) {
      return apiError("METHOD_NOT_ALLOWED", "HTTP method is not supported.", `Use ${allowed.join(", ")} for this endpoint; see /openapi.json.`, 405, { Allow: allowed.join(", ") });
    }
    return NextResponse.next();
  }

  if (!["GET", "HEAD"].includes(request.method)) return NextResponse.next();
  // Leave files, explicit Markdown URLs, metadata, and internal routes alone.
  // Version slugs contain periods, so handle /changelog before the file check.
  if (path.startsWith("/llms.mdx/") || path.endsWith(".md") ||
      (path.includes(".") && !/^\/changelog\/v[^/]+$/.test(path))) return NextResponse.next();

  // Flight requests are an additional Next.js representation, not page HTML.
  const isFlight = request.headers.get("rsc") === "1";
  const representation = isFlight ? "text/html; charset=utf-8" : pageRepresentation(request.headers.get("accept"));
  let response: NextResponse;
  if (!representation) {
    response = new NextResponse(null, { status: 406, headers: { "Cache-Control": "no-store" } });
  } else if (representation.startsWith("text/markdown")) {
    const url = request.nextUrl.clone();
    url.pathname = `/llms.mdx/pages${path === "/" ? "" : path}`;
    response = NextResponse.rewrite(url);
  } else {
    response = NextResponse.next();
  }
  response.headers.append("Vary", "Accept, Accept-Encoding");
  response.headers.append("Link", '</llms.txt>; rel="describedby", </openapi.json>; rel="service-desc"; type="application/json"');
  return response;
}

export const config = { matcher: ["/((?!_next/).*)"] };
