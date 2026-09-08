import Negotiator from "negotiator";

/** HTML remains the default for browsers and wildcard Accept headers. */
export function pageRepresentation(accept: string | null) {
  return new Negotiator({ headers: { accept: accept ?? "*/*" } }).mediaType([
    "text/html; charset=utf-8",
    "text/markdown; charset=utf-8",
  ]);
}

export const RECOVERY_MARKDOWN = `# 404 — Page not found

This URL does not identify a public Synara page. Find the current URL here:

- [Agent instructions and content index](https://www.trysynara.com/llms.txt)
- [Documentation](https://www.trysynara.com/docs.md)
- [Sitemap](https://www.trysynara.com/sitemap.xml)
- [API specification](https://www.trysynara.com/openapi.json)
`;

export function markdownNotFound() {
  return new Response(RECOVERY_MARKDOWN, {
    status: 404,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "no-store",
      Vary: "Accept, Accept-Encoding",
      "X-Robots-Tag": "noindex",
    },
  });
}

/** Keep the existing string `error` field compatible with desktop clients. */
export function apiError(code: string, message: string, hint: string, status: number, headers?: HeadersInit) {
  const responseHeaders = new Headers(headers);
  responseHeaders.set("Cache-Control", "no-store");
  return Response.json({ error: message, code, message, hint }, { status, headers: responseHeaders });
}
