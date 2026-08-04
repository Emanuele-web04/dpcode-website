# PR 7 — Visual storytelling and quality contract

This file is the committed execution and acceptance contract for the visual-storytelling layer stacked on `marketing/homepage-positioning`.

The branch is intentionally created before implementation so an agent with browser access can work against a stable, reviewable specification. Product positioning, documentation architecture, SEO/AEO behavior, and the existing public-surface tests are inherited from PRs 1–6 and remain authoritative.

## Objective

Turn the homepage from a sequence of competent sections into a coherent visual explanation of Synara’s product model:

1. multiple coding-agent runtimes enter one local workspace;
2. one task owns one line of work;
3. concurrent tasks remain isolated through explicit ownership and Git worktrees;
4. work can move between supported providers without changing the task environment;
5. terminals, browser evidence, diffs, checks, and delivery state remain attached to the work;
6. the result becomes a reviewed commit and pull request.

The finished page must feel designed for Synara rather than assembled from generic AI-product patterns.

## Canonical language is frozen

Do not rewrite the canonical product thesis or invent a competing category in this PR.

Required copy remains:

- **Primary outcome:** “Run every coding agent in one local workspace.”
- **Category:** “The local-first workspace and control plane for coding agents.”
- **Product pillars:** task ownership, provider portability, isolated parallel work, and reviewable results.

Small typographic line breaks and responsive presentation changes are allowed. Semantic copy changes require a separate review and must keep `src/data/product.ts`, metadata, JSON-LD, FAQ content, and AI-readable routes synchronized.

## Design principles

### Show the control plane

Visuals must make relationships understandable: provider → task → environment → evidence → delivery. Decorative screenshots without a clear role in that story are insufficient.

### Use product truth

Prefer real Synara interface states, faithful product-derived compositions, and accurate workflow diagrams. Do not invent controls, providers, capabilities, or outcomes that the app does not support.

### Keep the visual language durable

Do not build the design around current model names, benchmark claims, temporary limits, or release-specific labels. Provider identity may appear; volatile provider marketing must not.

### Avoid generic AI aesthetics

Do not introduce neon gradient fog, glowing orb motifs, fake terminal rain, excessive glassmorphism, generic node graphs, or decorative motion unrelated to a state transition.

### Motion must explain state

Animation may communicate provider selection, task ownership, worktree isolation, handoff, verification, or delivery progression. It must not be required to understand the page and must not run continuously without purpose.

### Preserve trust

The visual hierarchy must reinforce the local workspace boundary and the provider boundary without implying that provider sessions never leave the machine.

## Scope

### In scope

- Homepage layout and visual hierarchy
- Navigation and first viewport polish
- Provider-mark presentation
- Product and workflow storytelling components
- Accurate product screenshots or product-derived visual compositions
- Responsive behavior across required widths
- Light and dark modes
- Focus, hover, expanded, and reduced-motion states
- Image loading, dimensions, optimization, and layout stability
- Accessibility semantics related to changed UI
- Visual regression infrastructure
- Automated browser checks
- Performance and accessibility evidence

### Out of scope

- Application or provider runtime behavior
- Provider capability changes
- Documentation-content rewrites
- Canonical product positioning changes
- Public route changes
- API changes
- Changelog changes
- Legal attribution changes
- Repository-history rewriting
- New analytics or tracking
- A full design-system migration unrelated to the homepage
- Large animation or UI dependencies without measured justification

## Required execution sequence

Do not implement the entire page in one unreviewed pass.

### Phase 0 — Establish the baseline

Before changing production components:

1. read `AGENTS.md`, PRs 1–6, this file, `src/data/product.ts`, the homepage components, global styles, and existing tests;
2. run the current public-surface test suite;
3. start the site locally in production and development modes;
4. capture baseline screenshots at every required viewport in light and dark mode;
5. audit hierarchy, spacing, typography, responsive behavior, accessibility, performance, and content stability;
6. post the audit and baseline evidence to PR 7 before beginning the main implementation.

### Phase 1 — First viewport

Implement and verify only:

- navigation;
- provider marks;
- category, H1, supporting copy, and CTAs;
- hero media and first transition into the page;
- mobile and reduced-motion behavior for the first viewport.

Do not proceed until before/after evidence exists at all required widths.

### Phase 2 — Product model

Implement and verify:

- provider portability;
- one-task ownership;
- worktree isolation;
- provider handoff;
- terminal and browser attachment;
- diff, check, commit, and pull-request delivery.

Each visual must have one explicit message and an accessible text equivalent.

### Phase 3 — Trust and conversion

Implement and verify:

- privacy boundary;
- FAQ interaction;
- testimonial curation and layout;
- closing CTA;
- footer;
- keyboard navigation and touch behavior.

### Phase 4 — Hardening

Complete visual regression, accessibility, performance, responsive, and production-route checks. Fix defects rather than documenting them as acceptable unless a real platform limitation exists.

## Required viewport matrix

Capture the full homepage and changed sections at:

| Name | Viewport |
| --- | ---: |
| Large desktop | 1440 × 1100 |
| Laptop | 1280 × 900 |
| Tablet landscape | 1024 × 768 |
| Tablet/mobile boundary | 768 × 1024 |
| Mobile | 390 × 844 |
| Narrow mobile | 360 × 800 |

Run the matrix in both light and dark mode.

At minimum, inspect:

- navigation;
- hero and primary CTAs;
- provider presentation;
- product pillars;
- every workflow visual;
- privacy section;
- FAQ closed and open states;
- testimonials;
- closing CTA;
- footer.

No tested viewport may have horizontal page overflow, clipped text, inaccessible controls, overlapping media, or unreadable visual labels.

## Visual regression requirements

Add deterministic browser screenshot coverage. Playwright is preferred unless a clearly better existing repository-native option is found.

Minimum named baselines:

- `homepage-desktop-light`
- `homepage-desktop-dark`
- `homepage-mobile-light`
- `homepage-mobile-dark`
- `homepage-hero-desktop-light`
- `homepage-hero-mobile-dark`
- `homepage-workflows-desktop-light`
- `homepage-trust-mobile-light`
- `install-desktop-light`
- `docs-desktop-light`

Full-page screenshots alone are not sufficient. Add section-level screenshots so a testimonial or installer-count change does not obscure unrelated regressions.

Make screenshots deterministic by controlling:

- theme;
- viewport and device scale factor;
- animations and transitions;
- installer count;
- testimonial content;
- dates and time;
- network-dependent media;
- fonts and loading completion;
- reduced-motion state.

Do not commit unstable baselines that pass only through large pixel-difference thresholds.

## Functional browser checks

Add tests for changed behavior, including:

- primary CTA destinations;
- documentation and GitHub links;
- mobile navigation;
- FAQ keyboard and pointer interaction;
- visible focus state;
- theme-specific rendering;
- reduced-motion behavior;
- absence of horizontal overflow at all required widths;
- image dimensions or reserved aspect ratios preventing layout shift;
- semantic heading order and landmark presence.

## Accessibility bar

Required:

- no critical or serious automated accessibility violations on homepage, install, and docs landing pages;
- complete keyboard access;
- visible focus indicators;
- correct button/link semantics;
- meaningful image alternatives or correct decorative treatment;
- logical heading hierarchy;
- sufficient contrast in both themes;
- touch targets suitable for mobile use;
- no information available only through motion, hover, color, or pointer precision;
- `prefers-reduced-motion` support that removes nonessential animation rather than merely shortening it.

Use an automated accessibility engine and manual keyboard review. Automated output alone is not acceptance evidence.

## Motion bar

Allowed motion must:

- have a clear explanatory purpose;
- stop or settle;
- preserve content readability;
- avoid scroll-jacking;
- avoid large parallax movement;
- avoid motion-triggered layout shift;
- provide a complete reduced-motion fallback;
- avoid adding a heavy client dependency unless bundle impact and necessity are demonstrated.

Prefer CSS and existing platform primitives where they produce a maintainable result.

## Performance bar

Evaluate the production build, not only the development server.

Targets:

- desktop LCP: **below 2.5 seconds** in the recorded test environment;
- CLS: **below 0.10**;
- TTFB: **below 800 ms** against the local production server;
- production load event: **below 3 seconds**;
- no failed network requests, browser exceptions, or console errors;
- exactly one main landmark and one page-level heading;
- no incomplete images;
- bounded total, script, image, request, DOM-node, and long-task budgets;
- the separate accessibility, SEO/AEO, and visual-regression gates remain blocking;
- no avoidable client-side hydration for static presentation;
- no material bundle increase without a documented reason.

Record the browser version, viewport, environment, command, encoded transfer sizes, and every enforced threshold. The checked-in gate must use the pinned Playwright/Chromium stack already required for browser tests rather than adding a second browser-audit dependency tree. Independent Lighthouse or PageSpeed reports may be attached as supplementary evidence, but they are not a repository dependency or the sole quality definition.

## Existing checks that must remain green

- `npm ci`
- `npm run test:docs`
- `npm run lint`
- `npm run build`
- `npm run test:seo-smoke`

Any new browser, visual, accessibility, or performance checks must be added to package scripts and CI with deterministic process startup and shutdown.

## Evidence required before completion

Post or attach:

1. baseline screenshot matrix;
2. final screenshot matrix;
3. representative before/after comparisons;
4. light and dark captures;
5. narrow-mobile captures;
6. reduced-motion evidence;
7. animation recording for any meaningful motion;
8. Playwright or equivalent report;
9. accessibility report plus manual keyboard notes;
10. browser performance report, enforced budgets, and the exact environment;
11. image and bundle-size comparison;
12. full CI result on the exact final head;
13. remaining compromises, each with a specific technical reason.

Do not mark the PR ready for review, merge it, squash it, or change its base. Leave it as a draft until the full evidence bundle has been reviewed.

## Hard stop conditions

Stop and report instead of improvising when:

- a desired visual requires inventing unsupported product behavior;
- canonical product language would need to change;
- deterministic screenshot data cannot be established without changing production behavior unsafely;
- a dependency adds material bundle or maintenance cost without clear value;
- the inherited stack has moved and cannot be reconciled cleanly;
- visual baselines are unstable across repeated identical runs;
- accessibility or performance targets cannot be met without a scope decision.

## Completion definition

PR 7 is complete only when the rendered homepage tells the product story clearly at every required viewport, both themes are intentionally designed, motion has a functional explanation and reduced-motion equivalent, all public-surface behavior remains correct, the visual suite is deterministic, and the final evidence is sufficient for a reviewer who did not run the project locally to judge the result.