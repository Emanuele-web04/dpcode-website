import { OPENAPI } from "@/lib/openapi";

export const dynamic = "force-static";

export function GET() {
  return Response.json(OPENAPI, { headers: { "Cache-Control": "public, max-age=3600", Link: '</llms.txt>; rel="describedby"' } });
}
