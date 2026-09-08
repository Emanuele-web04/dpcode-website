import { DIAGNOSTIC_FIELDS } from "@/lib/apiContract";
import { SITE_URL } from "@/lib/seo";

const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` });
const json = (description: string, schema: object) => ({ description, content: { "application/json": { schema } } });
const failure = (description: string) => json(description, ref("Error"));
const methodError = { "405": { ...failure("Unsupported method. Use the Allow response header."), headers: { Allow: { schema: { type: "string" }, description: "Supported HTTP methods." } } } };
const stringParameter = (name: string, description: string, schema = {}) => ({ name, in: "query", description, required: false, schema: { type: "string", ...schema } });

export const OPENAPI = {
  openapi: "3.1.1",
  info: {
    title: "Synara public website API",
    version: "1.0.0",
    description: "Public website discovery, documentation search, installer statistics, and user-submitted feedback. This is not the local Synara runtime or Agent Gateway API. No account or API key is required. Read-only calls have no application-enforced rate limit; reuse cached results and back off on infrastructure throttling. Feedback is limited to five attempts per IP per hour per server instance. /api/inbound-email is a private, Resend-signed service callback and is not an agent operation.",
  },
  servers: [{ url: SITE_URL, description: "Canonical production website" }],
  security: [],
  externalDocs: { description: "Agent instructions and documentation index", url: `${SITE_URL}/llms.txt` },
  paths: {
    "/api": {
      get: {
        operationId: "getApiIndex", summary: "Discover public API resources",
        description: "Read links to the OpenAPI document and agent content index. This operation is read-only.",
        responses: { "200": json("Discovery links.", ref("ApiIndex")), ...methodError },
      },
    },
    "/api/search": {
      get: {
        operationId: "searchDocumentation", summary: "Search Synara documentation",
        description: "Search the English documentation catalog. Missing or empty query returns an empty array. Result URLs point to pages or heading anchors; retrieve the page with Accept: text/markdown for full context. Default search uses full-text mode; vector mode depends on search backend availability. At most 100 results can be requested.",
        parameters: [
          stringParameter("query", "Documentation search text. An empty query returns no results.", { maxLength: 1000 }),
          { name: "limit", in: "query", required: false, description: "Maximum results; the backend default applies when omitted.", schema: { type: "integer", minimum: 1, maximum: 100 } },
          stringParameter("tag", "Optional comma-separated documentation tags."),
          stringParameter("locale", "Optional locale forwarded to the search backend; this catalog is English."),
          stringParameter("mode", "Search mode. Values other than vector use full-text search.", { default: "full" }),
        ],
        responses: {
          "200": json("Matching pages, headings, and text snippets.", { type: "array", items: ref("SearchResult") }),
          "400": failure("Invalid query length or limit."), "503": failure("Search backend unavailable."), ...methodError,
        },
      },
    },
    "/api/installer-count": {
      get: {
        operationId: "getInstallerCount", summary: "Read the installer download total",
        description: "Return aggregate installer downloads. The server can use its checked-in snapshot if GitHub is unavailable. Successful responses are shared-cacheable for 60 seconds with 300 seconds of stale-while-revalidate; reuse them instead of polling rapidly.",
        responses: { "200": json("Installer download total.", ref("InstallerCount")), "503": failure("Neither live data nor a stored total is available."), ...methodError },
      },
    },
    "/api/feedback": {
      post: {
        operationId: "submitFeedback", summary: "Send feedback explicitly requested by the user",
        description: "Send feedback text and limited diagnostic context to the Synara maintainer by email. This has an external side effect: call only when the user explicitly requests submission. Maximum request size is 65536 UTF-8 bytes; details must contain non-whitespace text. Include every diagnostic field, using null when unknown. Strings in diagnostics are truncated to 256 characters (1024 for userAgent); nonnegative safe integers and booleans are also accepted. Unknown diagnostic fields are ignored. Browser CORS allows synara://app and HTTP(S) loopback origins; server clients may omit Origin. The x-synara-feedback header identifies the client, not authentication. Five attempts per IP per hour per server instance; honor Retry-After on 429. Delivery requires server-side Resend configuration.",
        parameters: [{ name: "x-synara-feedback", in: "header", required: true, description: "Feedback client marker; this is not an API key.", schema: { type: "string", const: "1" } }],
        requestBody: { required: true, description: "User-written feedback and limited diagnostics.", content: { "application/json": { schema: ref("Feedback") } } },
        responses: {
          "200": json("Feedback delivered.", { type: "object", properties: { ok: { type: "boolean", const: true } }, required: ["ok"], additionalProperties: false }),
          "400": failure("Missing client marker, malformed JSON, or invalid feedback payload."),
          "403": failure("Browser Origin is not allowed."), "413": failure("Request exceeds 65536 bytes."),
          "429": { ...failure("Feedback rate limit exceeded."), headers: { "Retry-After": { description: "Seconds until the client may retry.", schema: { type: "integer", minimum: 1 } } } },
          "502": failure("Email provider delivery failed."), "503": failure("Email delivery is not configured."), ...methodError,
        },
      },
    },
  },
  components: {
    schemas: {
      Error: {
        type: "object", required: ["error", "code", "message", "hint"], additionalProperties: false,
        properties: {
          error: { type: "string", description: "Legacy message retained for existing clients; identical to message." },
          code: { type: "string", pattern: "^[A-Z][A-Z0-9_]+$", description: "Stable machine-readable error code." },
          message: { type: "string", description: "Human-readable explanation." },
          hint: { type: "string", description: "Concrete recovery action." },
        },
      },
      ApiIndex: { type: "object", required: ["openapi", "instructions"], additionalProperties: false, properties: {
        openapi: { type: "string", format: "uri", description: "Public OpenAPI document." },
        instructions: { type: "string", format: "uri", description: "Agent instructions and content index." },
      } },
      InstallerCount: { type: "object", required: ["count"], additionalProperties: false, properties: { count: { type: "integer", minimum: 0, description: "Aggregate installer downloads, not unique users." } } },
      SearchResult: {
        type: "object", required: ["id", "url", "type", "content"],
        properties: {
          id: { type: "string", description: "Search record identifier." }, url: { type: "string", format: "uri-reference", description: "Documentation URL, optionally including an anchor." },
          type: { type: "string", enum: ["page", "heading", "text"] }, content: { type: "string", description: "Snippet; matched words may use mark tags." },
          breadcrumbs: { type: "array", items: { type: "string" } },
          contentWithHighlights: { type: "array", deprecated: true, items: { type: "object", required: ["type", "content"], properties: { type: { const: "text", type: "string" }, content: { type: "string" }, styles: { type: "object", properties: { highlight: { type: "boolean" } } } } } },
        },
      },
      Feedback: {
        type: "object", required: ["category", "details", "diagnostics"],
        properties: {
          category: { type: ["string", "null"], enum: ["bug", "session", "ui", "performance", "idea", "other", null], description: "Feedback category, or null for general feedback." },
          details: { type: "string", minLength: 1, maxLength: 5000, pattern: "\\S", description: "User-authored text; length is checked after trimming whitespace." },
          diagnostics: { type: "object", required: [...DIAGNOSTIC_FIELDS], properties: Object.fromEntries(DIAGNOSTIC_FIELDS.map(name => [name, {
            description: `${name}; use null when unknown.`,
            anyOf: [{ type: "string" }, { type: "integer", minimum: 0, maximum: Number.MAX_SAFE_INTEGER }, { type: "boolean" }, { type: "null" }],
          }])) },
        },
      },
    },
  },
};
