// FILE: lib/openapi.ts
// Purpose: Single source of truth for the public OpenAPI contract served at /openapi.json.
// Layer: server utility.
// Note: Documents only the approved public endpoints (installer-count, search,
//       feedback). The private inbound-email webhook is intentionally absent.

import { API_ERROR_CODES } from "@/lib/apiResponse";
import { FEEDBACK_EMAIL, SITE_NAME, SITE_URL } from "@/lib/seo";


// Minimal OpenAPI 3.1 structural shape. Kept local so the served document is
// type-checked without pulling in a schema library.

interface OpenApiSchemaObject {
  type?: string | readonly string[];
  description?: string;
  required?: readonly string[];
  properties?: Readonly<Record<string, OpenApiSchemaObject>>;
  items?: OpenApiSchemaObject;
  enum?: readonly (string | number | boolean | null)[];
  anyOf?: readonly OpenApiSchemaObject[];
  additionalProperties?: boolean | OpenApiSchemaObject;
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  $ref?: string;
}

interface OpenApiParameter {
  name: string;
  in: "query" | "header" | "path" | "cookie";
  description?: string;
  required?: boolean;
  schema?: OpenApiSchemaObject;
}

interface OpenApiHeader {
  description?: string;
  schema?: OpenApiSchemaObject;
}

interface OpenApiMediaType {
  schema: OpenApiSchemaObject;
}

interface OpenApiResponse {
  description: string;
  headers?: Readonly<Record<string, OpenApiHeader>>;
  content?: Readonly<Record<string, OpenApiMediaType>>;
}

interface OpenApiOperation {
  operationId: string;
  summary?: string;
  description?: string;
  tags?: readonly string[];
  parameters?: readonly OpenApiParameter[];
  requestBody?: {
    required?: boolean;
    content: Readonly<Record<string, OpenApiMediaType>>;
  };
  responses: Readonly<Record<string, OpenApiResponse>>;
}

interface OpenApiPathItem {
  get?: OpenApiOperation;
  post?: OpenApiOperation;
  options?: OpenApiOperation;
  description?: string;
}

interface OpenApiDocument {
  openapi: string;
  info: {
    title: string;
    description?: string;
    version: string;
    contact?: { name?: string; email?: string };
  };
  servers?: readonly { url: string; description?: string }[];
  tags?: readonly { name: string; description?: string }[];
  paths: Readonly<Record<string, OpenApiPathItem>>;
  components?: {
    schemas?: Readonly<Record<string, OpenApiSchemaObject>>;
  };
}

export const OPENAPI_DOCUMENT = {
  openapi: "3.1.0",
  info: {
    title: `${SITE_NAME} Public API`,
    description:
      "Public, machine-readable API of the Synara website. Covers the installer download total, full-text documentation search, and the feedback submission endpoint used by the website and the desktop application. Private webhook endpoints are not part of this contract.",
    version: "1.0.0",
    contact: {
      name: SITE_NAME,
      email: FEEDBACK_EMAIL,
    },
  },
  servers: [
    {
      url: SITE_URL,
      description: "Canonical production origin",
    },
  ],
  tags: [
    { name: "Installer", description: "Installer download totals" },
    { name: "Search", description: "Documentation search" },
    { name: "Feedback", description: "In-app feedback submission" },
  ],
  paths: {
    "/api/installer-count": {
      get: {
        operationId: "getInstallerCount",
        summary: "Current total installer downloads",
        description:
          "Returns the total number of macOS, Windows, and Linux installer downloads. The response is CDN-cached for 60 seconds, so recent GitHub release activity may not be reflected immediately.",
        tags: ["Installer"],
        responses: {
          "200": {
            description: "The current installer download total.",
            headers: {
              "Cache-Control": {
                description:
                  "Public cache policy: `public, s-maxage=60, stale-while-revalidate=300`.",
                schema: { type: "string" },
              },
            },
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/InstallerCount" },
              },
            },
          },
          "503": {
            description:
              "The installer count could not be resolved from GitHub or the stored fallback snapshot.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
        },
      },
    },
    "/api/search": {
      get: {
        operationId: "searchDocs",
        summary: "Full-text search across the documentation",
        description:
          "Searches the public documentation index and returns matching pages and headings. An empty array is returned when the `query` parameter is absent or nothing matches. Responses are not cached.",
        tags: ["Search"],
        parameters: [
          {
            name: "query",
            in: "query",
            required: true,
            description:
              "Search text to match against documentation content. When absent, the server returns an empty array.",
            schema: { type: "string" },
          },
          {
            name: "limit",
            in: "query",
            required: false,
            description:
              "Maximum number of results to return. When omitted, the server applies its default limit.",
            schema: { type: "integer" },
          },
          {
            name: "tag",
            in: "query",
            required: false,
            description: "Comma-separated tags to filter results by.",
            schema: { type: "string" },
          },
          {
            name: "locale",
            in: "query",
            required: false,
            description:
              "Language code to search in. Defaults to the site default language.",
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description:
              "Matching documentation results. Empty when there is no `query` or no matches.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/SearchResult" },
                },
              },
            },
          },
        },
      },
    },
    "/api/feedback": {
      options: {
        operationId: "feedbackCorsPreflight",
        summary: "CORS preflight for feedback submissions",
        description:
          "Answers CORS preflight requests from the Synara desktop app (`synara://app`) and local development origins. Returns 204 with CORS headers. A disallowed origin receives 403.",
        tags: ["Feedback"],
        responses: {
          "204": {
            description:
              "Preflight accepted; CORS headers are returned for the requesting origin.",
            headers: {
              "Access-Control-Allow-Origin": {
                description:
                  "Echoes the requesting origin when it is allowed.",
                schema: { type: "string" },
              },
              "Access-Control-Allow-Methods": {
                description: "Methods allowed for the origin.",
                schema: { type: "string" },
              },
              "Access-Control-Allow-Headers": {
                description:
                  "Headers the client may send on the actual request.",
                schema: { type: "string" },
              },
            },
          },
          "403": {
            description: "The requesting origin is not allowed.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
        },
      },
      post: {
        operationId: "submitFeedback",
        summary: "Submit product feedback",
        description:
          "Accepts explicit Synara feedback from the website and desktop app and delivers it to the maintainer. The `x-synara-feedback: 1` header is required. When an `Origin` header is present it must be `synara://app` or an http/https localhost origin. A best-effort per-instance limit allows five submissions per hour per observed client IP; the 429 response includes `Retry-After`.",
        tags: ["Feedback"],
        parameters: [
          {
            name: "x-synara-feedback",
            in: "header",
            required: true,
            description: "Client marker that must be set to `1`.",
            schema: { type: "string", enum: ["1"] },
          },
          {
            name: "Origin",
            in: "header",
            required: false,
            description:
              "Browser or desktop origin. When present, must be `synara://app` or an http/https origin on localhost, 127.0.0.1, or [::1]. Absent origins are treated as non-browser clients.",
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/FeedbackRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Feedback accepted and delivered.",
            headers: {
              "Access-Control-Allow-Origin": {
                description:
                  "Echoes the requesting origin when it is allowed.",
                schema: { type: "string" },
              },
              Vary: {
                description: "`Origin` is part of the cache key.",
                schema: { type: "string" },
              },
            },
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/FeedbackOk" },
              },
            },
          },
          "400": {
            description:
              "Invalid client marker or invalid payload. The `code` distinguishes the cause.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
          "403": {
            description: "The requesting origin is not allowed.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
          "413": {
            description: "Request body exceeds the 64 KiB limit.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
          "429": {
            description:
              "Best-effort rate limit exceeded for the observed client IP on this server instance.",
            headers: {
              "Retry-After": {
                description: "Seconds to wait before retrying.",
                schema: { type: "integer", minimum: 1 },
              },
            },
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
          "502": {
            description: "Feedback was parsed but delivery to the maintainer failed.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
          "503": {
            description: "Feedback delivery is temporarily unavailable.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      ApiError: {
        type: "object",
        required: ["error", "code"],
        properties: {
          error: {
            type: "string",
            description:
              "Human-readable error message. Preserved for compatibility with the existing desktop client.",
          },
          code: {
            type: "string",
            enum: [...API_ERROR_CODES],
            description: "Stable machine-readable error code.",
          },
        },
        additionalProperties: false,
      },
      InstallerCount: {
        type: "object",
        required: ["count"],
        properties: {
          count: {
            type: "integer",
            minimum: 0,
            description:
              "Total number of installer downloads across macOS, Windows, and Linux release assets.",
          },
        },
        additionalProperties: false,
      },
      SearchResult: {
        type: "object",
        required: ["id", "type", "content", "url"],
        properties: {
          id: {
            type: "string",
            description: "Stable identifier of the matched document or heading.",
          },
          type: {
            type: "string",
            enum: ["page", "text", "heading"],
            description: "Kind of matched content.",
          },
          content: {
            type: "string",
            description:
              "Matched text with markdown highlighting, suitable for display.",
          },
          breadcrumbs: {
            type: "array",
            items: { type: "string" },
            description:
              "Breadcrumb trail of section names leading to the result.",
          },
          url: {
            type: "string",
            description: "Site path of the matched page or heading anchor.",
          },
        },
        additionalProperties: false,
      },
      FeedbackDiagnostics: {
        type: "object",
        required: [
          "appVersion",
          "submittedAt",
          "provider",
          "model",
          "projectKind",
          "environmentMode",
          "runtimeMode",
          "interactionMode",
          "sessionStatus",
          "latestTurnState",
          "messageCount",
          "activityCount",
          "hasPendingApproval",
          "hasPendingUserInput",
          "hasThreadError",
          "userAgent",
          "platform",
          "language",
          "viewport",
        ],
        properties: {
          appVersion: {
            type: ["string", "null"],
            maxLength: 256,
            description: "Synara app version.",
          },
          submittedAt: {
            type: ["string", "null"],
            maxLength: 256,
            description: "Client-reported submission timestamp.",
          },
          provider: {
            type: ["string", "null"],
            maxLength: 256,
            description: "Coding-agent provider in use.",
          },
          model: {
            type: ["string", "null"],
            maxLength: 256,
            description: "Model in use.",
          },
          projectKind: {
            type: ["string", "null"],
            maxLength: 256,
            description: "Kind of project.",
          },
          environmentMode: {
            type: ["string", "null"],
            maxLength: 256,
            description: "Environment mode.",
          },
          runtimeMode: {
            type: ["string", "null"],
            maxLength: 256,
            description: "Runtime mode.",
          },
          interactionMode: {
            type: ["string", "null"],
            maxLength: 256,
            description: "Interaction mode.",
          },
          sessionStatus: {
            type: ["string", "null"],
            maxLength: 256,
            description: "Session status.",
          },
          latestTurnState: {
            type: ["string", "null"],
            maxLength: 256,
            description: "State of the latest turn.",
          },
          messageCount: {
            type: ["integer", "null"],
            minimum: 0,
            description: "Message count.",
          },
          activityCount: {
            type: ["integer", "null"],
            minimum: 0,
            description: "Activity count.",
          },
          hasPendingApproval: {
            type: ["boolean", "null"],
            description: "Whether an approval is pending.",
          },
          hasPendingUserInput: {
            type: ["boolean", "null"],
            description: "Whether user input is pending.",
          },
          hasThreadError: {
            type: ["boolean", "null"],
            description: "Whether the thread has an error.",
          },
          userAgent: {
            type: ["string", "null"],
            maxLength: 1024,
            description: "User agent string.",
          },
          platform: {
            type: ["string", "null"],
            maxLength: 256,
            description: "Operating system platform.",
          },
          language: {
            type: ["string", "null"],
            maxLength: 256,
            description: "Client language.",
          },
          viewport: {
            type: ["string", "null"],
            maxLength: 256,
            description: "Client viewport size.",
          },
        },
        additionalProperties: false,
      },
      FeedbackRequest: {
        type: "object",
        required: ["details", "category", "diagnostics"],
        properties: {
          details: {
            type: "string",
            minLength: 1,
            maxLength: 5000,
            description: "The feedback message body.",
          },
          category: {
            anyOf: [
              {
                type: "string",
                enum: ["bug", "session", "ui", "performance", "idea", "other"],
                description: "Feedback category.",
              },
              { type: "null", description: "No specific category." },
            ],
            description: "Feedback category, or null when unspecified.",
          },
          diagnostics: {
            $ref: "#/components/schemas/FeedbackDiagnostics",
          },
        },
        additionalProperties: false,
      },
      FeedbackOk: {
        type: "object",
        required: ["ok"],
        properties: {
          ok: {
            type: "boolean",
            enum: [true],
            description: "Always true on success.",
          },
        },
        additionalProperties: false,
      },
    },
  },
} satisfies OpenApiDocument;
