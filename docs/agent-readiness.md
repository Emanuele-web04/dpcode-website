# Agent readiness implementation

Implemented locally on 2026-09-08. Production deployment and a new Ora/Is Agentic audit are separate steps; no new score is claimed.

## Public contract

| Surface | Behavior |
| --- | --- |
| Existing canonical pages | HTML for browsers, Markdown when preferred by Accept; quality factors, wildcards, exclusions and unsupported types are handled by negotiator. |
| Explicit Markdown | `/index.md`, `/docs.md`, `/docs/<path>.md`, and `<page>.md`, including each release. |
| Missing pages | Real 404. Markdown requests receive short recovery links. Unmatched wildcard requests receive the same recovery body; browser HTML keeps the existing 404 design. |
| Unknown API paths | JSON 404 with `code`, `message`, `hint`, and the compatible string `error`. |
| Unsupported API methods | JSON 405 with `Allow`. Automatic GET/HEAD and OPTIONS behavior is preserved. |
| `/openapi.json` | OpenAPI 3.1.1 with four public operation IDs, typed parameters, bodies and response schemas. |
| `/api` | Links to the specification and agent index. |
| `/api/search` | Existing search behavior; invalid query length or result limit gives JSON 400; backend failures give JSON 503. |
| `/api/installer-count` | Existing total and caching behavior; unavailable data gives structured JSON 503. |
| `/api/feedback` | Existing submission, CORS and per-instance rate limit; structured errors retain the old `error` string. |
| `/api/inbound-email` | Existing signed service callback, excluded from agent operations; failures remain JSON. |
| `/llms.txt` | Project summary, when-to-use links and H2 file lists following the published format. |
| `/agent-instructions.md` | Concrete retrieval instructions, API use, explicit consent for feedback, recovery and local-runtime boundaries. |
| `/changelog` | Unchanged full release notes, anchors, picker and links. The Markdown representation is a compact version list; complete notes remain on all 71 version pages. |

The [Accept negotiation guidance](https://acceptmarkdown.com/guides/accept-parsing), [llms.txt format](https://llmstxt.org/#format), and [OpenAPI 3.1.1 specification](https://spec.openapis.org/oas/v3.1.1.html) informed the implementation. The OpenAPI validator and runtime response-schema checks run in tests.

## Next.js compatibility

Next.js 16.3.0 replaces a custom `Vary` header on HTML and Flight page responses with its own value. This is left as is: Vercel's CDN already includes `Accept` and `Accept-Encoding` in its cache key, and Markdown responses are produced by route handlers that set `Vary: Accept, Accept-Encoding` themselves. The HTTP suite asserts `Vary` on Markdown responses only and tests both representations in alternating order.

## Verification

- 23 unit/contract tests: Accept negotiation; OpenAPI validation; legacy-compatible errors; feedback validation, preflight, rate limit and delivery; signed webhook validation, forwarding and errors. Email delivery is mocked throughout.
- 7 HTTP/browser tests: all 127 sitemap pages as HTML, negotiated Markdown and explicit Markdown; 404/405/406; HEAD; API success and failure schemas; machine-readable files and discovery links; desktop release navigation and mobile picker.
- 53 existing documentation/SEO contract tests and documentation integrity checks.
- 15 existing browser tests for homepage, responsive layout, navigation, theme and documentation.
- ESLint, TypeScript and production build passed. On this machine the build used `npm run build -- --webpack`: Turbopack's internal port binding was blocked by the execution environment.
- The changelog's extracted HTML text is approximately 16,307 characters (about 4.1K tokens using the audit's four-character heuristic), down from the audit's approximately 41K-token page. Every canonical page and individual Markdown page is below 100,000 characters.
- The new suites are wired into `.github/workflows/validate-docs.yml`.

Reproduce:

```sh
npm ci
npm run test:agents
npm run test:docs
npm run lint
npm run build
npx tsc --noEmit
npm run test:agents-http
npm run test:e2e
```

## Deployment and product decisions

Deploy through the existing workflow, then rerun the public audit against the canonical host and verify alternating HTML/Markdown requests through the production CDN. Local tests establish origin behavior; they do not establish deployed CDN behavior or a revised readiness score.

Production checks:

```sh
curl -s -o /dev/null -w '%{http_code}\n' https://www.trysynara.com/agent-check-nonexistent
curl -sSI -H 'Accept: text/markdown' https://www.trysynara.com/changelog
curl -sSI -H 'Accept: text/html' https://www.trysynara.com/changelog
curl -sS https://www.trysynara.com/openapi.json
curl -sS https://www.trysynara.com/api/no-such-operation
```

Actual email delivery requires the existing Resend keys, verified sender/recipient settings, and inbound signing secret. No real email was sent during verification. A centrally enforced feedback quota would require shared storage; the existing limiter is per server instance and is documented as such.

The website API does not start coding sessions. Publishing a hosted task-execution API would be a separate product/security decision. Existing crawler rules for `/api/` are preserved; user-directed API access is distinct from crawler indexing. The optional `llms-full.txt` remains a large full corpus; the agent instructions recommend focused pages instead.
