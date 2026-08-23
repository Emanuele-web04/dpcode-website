# Delegation plan
Units: 11

| # | Unit | Files (mine) | Worker (subagent) | Acceptance | Status |
|---|---|---|---|---|---|
| 1 | Markdown representation core | `src/lib/agentMarkdown.ts`, related focused tests | worker-1 | Canonical routes render deterministic Markdown and unknown routes return absent | verified |
| 2 | Accept negotiation | `src/proxy.ts`, `src/app/agent-markdown/[[...path]]/route.ts`, related focused tests | worker-2 | Markdown negotiation, marker guard, Vary, and representation 404 contracts work | verified |
| 3 | AI-readable content | `src/lib/llmText.ts`, AI discovery routes/tests | worker-3 | Discovery text is complete and existing route contracts remain stable | verified |
| 4 | API error envelopes | Public API route files and focused tests | worker-4 | Existing messages remain and stable error codes are added | verified |
| 5 | Public OpenAPI | `src/app/openapi.json/route.ts`, OpenAPI source/helper/tests | worker-5 | OpenAPI documents only approved public endpoints | verified |
| 6 | Organization data | `src/lib/seo.ts`, `src/app/layout.tsx`, focused tests | worker-6 | Supported organization facts and approved contact email appear without invented facts | verified |
| 7 | About and Contact pages | `src/app/about/**`, `src/app/contact/**`, related navigation/content files | worker-7 | Public trust pages render supported facts and approved email | verified |
| 8 | Trust discovery | Discovery/navigation/sitemap/AI route files not owned elsewhere | worker-8 | About, Contact, and OpenAPI are discoverable through existing surfaces | verified |
| 9 | Changelog model | Changelog data/model helpers and focused tests | worker-9 | Stable ten-release pagination model preserves release lookup | verified |
| 10 | Changelog routes | `src/app/changelog/**`, `src/components/ChangelogContent.tsx`, focused tests | worker-10 | Paginated archive works and every `/changelog/v…` deep link remains valid | verified |
| 11 | Regression gates | `scripts/**`, `package.json`, test configuration/files not owned above | worker-11 | Deterministic local production smoke gate covers all 12 audit behaviors | verified |

## Verification evidence

- Units 1–11: `npm run test:docs` passed 66/66 tests.
- Units 1–11: `npx tsc --noEmit && npm run build` passed; Next.js generated 147 static pages.
- Units 1–11: `npm run test:agent-readiness` passed against `http://127.0.0.1:3017`, including 67 release deep links.
- Units 2, 7, and 10: live browser verification covered negotiated routes, About, Contact, and changelog pages 1–2.
- Final diff: `git diff --check` passed.
