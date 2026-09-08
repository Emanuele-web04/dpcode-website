import { createFromSource } from "fumadocs-core/search/server";
import { docsSource } from "@/lib/docs";
import { apiError } from "@/lib/agentHttp";

const search = createFromSource(docsSource, { language: "english" });

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const limit = params.get("limit");
  if ((params.get("query")?.length ?? 0) > 1000 ||
      (limit !== null && (!/^\d+$/.test(limit) || Number(limit) < 1 || Number(limit) > 100))) {
    return apiError("INVALID_SEARCH_QUERY", "Search parameters are invalid.", "Use query with at most 1000 characters and an integer limit between 1 and 100; see /openapi.json.", 400);
  }
  try {
    return await search.GET(request);
  } catch (error) {
    console.error("[search] search failed", error);
    return apiError("SEARCH_UNAVAILABLE", "Documentation search is temporarily unavailable.", "Retry later or follow the documentation links in /llms.txt.", 503);
  }
}
