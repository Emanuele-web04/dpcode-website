// FILE: openapi.json/route.ts
// Purpose: Serves the public OpenAPI contract as deterministic JSON.
// Layer: App Router route handler.
// Depends on: OPENAPI_DOCUMENT in lib/openapi.

import { OPENAPI_DOCUMENT } from "@/lib/openapi";

export const revalidate = 86400;

export function GET() {
  return new Response(`${JSON.stringify(OPENAPI_DOCUMENT, null, 2)}\n`, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
