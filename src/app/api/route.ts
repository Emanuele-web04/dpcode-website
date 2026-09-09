import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

export function GET() {
  return Response.json({ openapi: `${SITE_URL}/openapi.json`, instructions: `${SITE_URL}/llms.txt` });
}
