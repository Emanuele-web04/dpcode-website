// FILE: apiResponse.ts
// Purpose: Shared, stable JSON error envelope for public API routes.
// Layer: Shared server helper
// Depends on: nothing outside the standard Response surface

// Public error codes are a closed set. OpenAPI and smoke tests derive their
// enums from this array instead of re-listing the strings, so the routes,
// contract, and regression gates cannot drift apart.
export const API_ERROR_CODES = [
  // feedback POST / OPTIONS: request rejected because the Origin is not trusted.
  "forbidden_origin",
  // feedback POST: the x-synara-feedback client header is missing or wrong.
  "invalid_client",
  // feedback POST: request body exceeds the size budget.
  "payload_too_large",
  // feedback POST: request exceeded the per-IP rate limit.
  "rate_limited",
  // feedback POST: body is not a valid feedback payload.
  "invalid_payload",
  // feedback POST: delivery backend is not configured.
  "delivery_unavailable",
  // feedback POST: delivery backend rejected the email.
  "delivery_failed",
  // installer-count GET: the upstream installer total could not be fetched.
  "upstream_unavailable",
] as const;

export type ApiErrorCode = (typeof API_ERROR_CODES)[number];

// The public error envelope is additive: desktop clients keep reading `error`,
// while agents and contracts read the stable `code`.
export type ApiErrorBody = {
  error: string;
  code: ApiErrorCode;
};

// Emits a JSON error response with the additive `{ error, code }` envelope.
// Defaults to `Cache-Control: no-store`; a route may pass its own explicit
// cache contract (for example the installer-count route) in `init.headers`.
export function apiErrorResponse(
  body: ApiErrorBody,
  status: number,
  init: ResponseInit = {},
): Response {
  const headers = new Headers(init.headers);
  headers.set("content-type", "application/json; charset=utf-8");
  if (!headers.has("cache-control")) {
    headers.set("cache-control", "no-store");
  }
  return new Response(JSON.stringify(body), { ...init, status, headers });
}
