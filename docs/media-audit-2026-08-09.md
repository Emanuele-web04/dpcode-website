# Homepage product media audit

This audit records the product rasters reviewed for the 2026-08-09 website refresh.

## Capture record

- Source app: Synara desktop app 0.7.0 (`com.emanueledipietro.synara`)
- Capture date: 2026-08-09
- Desktop capture size: 1232 x 768
- Themes: light and dark where noted
- Evidence rule: every replacement is a current app capture or a geometry-only crop of one. No UI was invented or composited.
- Scope rule: visible app labels remain under the user's explicit task scope. The published rasters contain no credentials, API keys, tokens, cookies, or other authentication material. Transient loading and error states were excluded.

## Asset decisions

| Asset | Decision | Current evidence |
| --- | --- | --- |
| `public/dpcode-ui-light.png` | Replaced | Real light New thread workspace capture; 1232 x 768. Source JPEG SHA-256: `7b35a61d8d6f82ace27e881fa3403394ecb3f2dcf6f479fffc44502fd18498aa`. |
| `public/dpcode-ui-dark.png` | Replaced | Real dark New thread workspace capture; 1232 x 768. Source JPEG SHA-256: `10c4ae71e0317d220fe2f3ed071e2ba6c712705dd9fc50b9e454f783f02e7a07`. |
| `public/browser-syn.png` | Replaced | Real Synara browser panel showing the locally rendered homepage at `localhost:3000`; 1232 x 768. Source JPEG SHA-256: `20d3dba387d1a88c5fcdec7156d4811cc86f9fdd8a68b3693b131b6f4d80ebb8`. |
| `public/split-syn.png` | Replaced | The same real current task-plus-browser state, showing the conversation and rendered homepage side by side; 1232 x 768. |
| `public/git-syn.png` | Replaced | Geometry-only crop of the current Commit and Push menu; 568 x 482. Source JPEG SHA-256: `9258e533ddd74c0841cf44060a57fdb5a5d4203c571d9f075d7aaf9484b87fcc`. |
| `public/handoff-syn.png` | Replaced | Geometry-only crop of the current Hand off thread menu; 458 x 434. Source JPEG SHA-256: `0bfe48e98b3bdfd16688c1851b489a7e7b9bf1aa00a5929577c5006f657e9d25`. |
| `public/projects-syn.png` | Replaced | Geometry-only crop of the current sidebar and task activity; 516 x 480. Source JPEG SHA-256: `97c98c65411c00c265bfa6286843705f749d4552fed0445736f181cadd8b698a`. |
| `public/worktrees-syn.png` | Replaced | Geometry-only crop of the current Environment panel with local branch, repository, changes, and editor controls; 516 x 248. Source JPEG SHA-256: `97c98c65411c00c265bfa6286843705f749d4552fed0445736f181cadd8b698a`. |
| `public/terminals-syn.png` | Replaced | Geometry-only crop of a clean current Terminal 1 panel with a live project prompt; 528 x 268. Source JPEG SHA-256: `9760263b0661ef9d95ccd4c253640b02480b8965df351305515edb9ccb434bf9`. |
| `public/og.png` | Replaced | Geometry-only 1200 x 600 crop of the real current light New thread capture. It is not a fabricated product composition. |
| `public/synara-icon.png` | Unchanged intentionally | Brand icon, not a product screenshot. |
| `public/hero-bg.jpg` | Unchanged intentionally | Decorative background art, not a product screenshot. |

The component alt text was updated where the current evidence changed what the image visibly proves. The docs screenshot now records `provenance="real"` and the captured dimensions.
