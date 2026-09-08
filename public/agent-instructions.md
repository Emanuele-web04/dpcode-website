# Synara agent instructions

## When to use this site

Use this site to help a user install Synara, connect an already authenticated coding-agent runtime, isolate concurrent tasks in Git worktrees, plan provider handoffs, verify work in the browser, or troubleshoot Synara workflows. Use release pages to check what changed in a specific version.

Synara is a free, open-source, local-first desktop workspace. This website is its public documentation and download surface. It does not host the user's coding sessions or expose a cloud API for running tasks. To control a user's own instance, consult the [integration documentation](https://www.trysynara.com/docs/workflows/agent-gateway.md) and use that instance's configured address and credentials.

## How to retrieve content

1. Start at [llms.txt](https://www.trysynara.com/llms.txt) and select the relevant document.
2. GET the canonical page with `Accept: text/markdown`, or use its `.md` URL. The homepage Markdown URL is `/index.md`.
3. GET [/api/search?query=worktree&limit=5](https://www.trysynara.com/api/search?query=worktree&limit=5) with `Accept: application/json` to find related documentation. The query is optional, up to 1000 characters; limit is an integer from 1 to 100.
4. Follow returned page URLs, removing any fragment before appending `.md`. Search snippets are not the full documentation.
5. Use the [changelog index](https://www.trysynara.com/changelog.md) to select one release. The optional `/llms-full.txt` combines the full corpus and can exceed a context window.

Negotiated pages vary on Accept and Accept-Encoding. HTML remains the browser default. Unsupported media types receive HTTP 406; retry with `text/markdown` or `text/html`. Explicit `.md` URLs always serve Markdown.

## Public website API

Fetch [openapi.json](https://www.trysynara.com/openapi.json) for operation IDs, parameters, request bodies, response schemas, and failure statuses. No API key is required for the public website operations.

- `getApiIndex`: GET `/api` for discovery links.
- `searchDocumentation`: GET `/api/search` for matching documentation snippets. Prefer a small limit.
- `getInstallerCount`: GET `/api/installer-count` for aggregate downloads, not unique users. Reuse the 60-second cached result.
- `submitFeedback`: POST `/api/feedback` only when the user explicitly asks to send feedback to the maintainer. This sends an email. Include `Content-Type: application/json` and `x-synara-feedback: 1`; follow the request schema exactly. Include all diagnostic keys and use null when unknown. Do not include source code, prompts, logs, or credentials in automated diagnostics.

Read-only operations have no application-enforced rate limit. Cache responses and back off if infrastructure throttles requests. Feedback accepts at most five attempts per IP per hour per server instance, and rejects bodies above 65536 bytes. Honor `Retry-After` on HTTP 429. The rate limit is not a globally coordinated quota across instances.

`/api/inbound-email` is reserved for signed Resend callbacks. It is not an agent tool or an alternative way to submit feedback.

## Recovery

- HTTP 404: the page or endpoint does not exist. Follow [llms.txt](https://www.trysynara.com/llms.txt), the [sitemap](https://www.trysynara.com/sitemap.xml), or the API specification instead of inventing paths. Request Markdown for a short recovery response.
- API failures return JSON fields `code`, `message`, and `hint`, plus the legacy `error` message. Use the hint to correct a request; do not retry an unchanged invalid request.
- HTTP 405: use a method listed in `Allow`.
- HTTP 502 or 503: retry later or use the documentation index and download page. Do not assume a feedback submission succeeded without HTTP 200 and `ok: true`.

The site's robots.txt and page-level robots directives govern crawling and indexing. These instructions do not override them.
