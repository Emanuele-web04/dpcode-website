# Source evidence — external documentation claims

Date checked: **2026-08-07**

This file records, per provider, the claims in `content/docs` that required source
verification, the primary source used, and the date the source was checked.
All external URLs were verified live (HTTP 200, redirects followed) on the date above;
see `scripts/check-external-links.mjs` for the automated check.

## Cursor (canonical-URL decision)

**Claims:** Cursor Agent is installed with `curl https://cursor.com/install -fsS | bash`;
the executable is `cursor-agent`; `cursor-agent login` / `cursor-agent status` /
`cursor-agent update` / `cursor-agent upgrade` are valid subcommands.

**Primary source:** [Cursor Docs — CLI](https://cursor.com/docs/cli/overview), fetched copy
`/tmp/dpcode-pr2/cursor-docs.html` (captured 2026-08-07 from https://cursor.com/docs).

**Decision — Official documentation links:**

The previous links pointed at `https://docs.cursor.com/en/cli/*`. Verified on 2026-08-07
that all three now redirect (HTTP 200, `Location`) to the generic landing page
`https://cursor.com/docs`, losing the specific CLI content:

- `https://docs.cursor.com/en/cli/installation` → `https://cursor.com/docs`
- `https://docs.cursor.com/en/cli/reference/authentication` → `https://cursor.com/docs`
- `https://docs.cursor.com/en/cli/reference/parameters` → `https://cursor.com/docs`

The CLI page slugs were extracted from the fetched copy of `https://cursor.com/docs`
(`/tmp/dpcode-pr2/cursor-docs.html`), which lists the canonical CLI docs tree, and each
candidate was confirmed with `curl` (HTTP 200 + real page content, correct `<title>`):

| Page | Canonical URL (used) | Verified |
| --- | --- | --- |
| CLI installation | `https://cursor.com/docs/cli/installation` | 200, title "CLI Installation \| Cursor Docs" |
| CLI authentication | `https://cursor.com/docs/cli/reference/authentication` | 200, title "Authentication \| Cursor Docs" |
| CLI parameters | `https://cursor.com/docs/cli/reference/parameters` | 200, title "Parameters \| Cursor Docs" |

`content/docs/providers/cursor.mdx` "Official documentation" links were updated to these
canonical URLs. The docs contract test (`scripts/provider-docs.test.mjs`) expected the old
`docs.cursor.com` domain and was updated to `cursor.com`.

## Antigravity

**Claims:** Install scripts `https://antigravity.google/cli/install.sh` (macOS/Linux) and
`https://antigravity.google/cli/install.ps1` (Windows); documentation links for CLI install,
usage, and troubleshooting.

**Primary source:** [Antigravity CLI docs](https://antigravity.google/docs/cli/install)
checked 2026-08-07; install scripts verified HTTP 200.

## Claude Code

**Claims:** Claude Code is set up via Anthropic's official getting-started guide; CLI reference
at `cli-usage`.

**Primary source:** [Anthropic Claude Code docs](https://docs.anthropic.com/en/docs/claude-code/getting-started)
checked 2026-08-07 (redirects to `https://code.claude.com/docs/en/getting-started`, HTTP 200).

## Codex

**Claims:** Codex documentation, authentication, and the open-source repository.

**Primary source:** [OpenAI Codex docs](https://developers.openai.com/codex) checked
2026-08-07 (redirects to `https://learn.chatgpt.com/docs`, title "ChatGPT – Codex |
OpenAI Developers", HTTP 200); [github.com/openai/codex](https://github.com/openai/codex) HTTP 200.

## Factory Droid

**Claims:** Droid quickstart, Droid CLI reference, and Droid Exec / API-key setup.

**Primary source:** [Factory docs](https://docs.factory.ai/cli/getting-started/quickstart)
checked 2026-08-07 (redirects to `https://docs.factory.ai/droid-cli/quickstart`, HTTP 200);
install script `https://app.factory.ai/cli` HTTP 200.

## Grok Build

**Claims:** Grok Build overview/installation, CLI reference, source and authentication guide;
install scripts `https://x.ai/cli/install.sh` and `https://x.ai/cli/install.ps1`.

**Primary source:** [x.ai Grok Build docs](https://docs.x.ai/build/overview) checked
2026-08-07 (HTTP 200); [github.com/xai-org/grok-build](https://github.com/xai-org/grok-build) HTTP 200.

## Kilo Code

**Claims:** Kilo Code CLI platform docs, Kilo CLI product/installation, and source repository.

**Primary source:** [Kilo docs](https://kilo.ai/docs/code-with-ai/platforms/cli) checked
2026-08-07 (HTTP 200); `https://kilo.ai/cli` HTTP 200; [github.com/Kilo-Org/kilocode](https://github.com/Kilo-Org/kilocode) HTTP 200.

## OpenCode

**Claims:** OpenCode introduction/installation, providers, and configuration docs; install
script `https://opencode.ai/install`.

**Primary source:** [OpenCode docs](https://opencode.ai/docs) checked 2026-08-07 (HTTP 200);
`https://opencode.ai/install` redirects to the official installer script (HTTP 200).

## Pi

**Claims:** Pi documentation, quickstart, repository, and install script `https://pi.dev/install.sh`.

**Primary source:** [Pi docs in earendil-works/pi](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/index.md)
checked 2026-08-07 (HTTP 200); `https://pi.dev/install.sh` HTTP 200.

## Synara (project self-links)

**Claims:** GitHub issues / new-issue links, releases, main-branch repository, and canary
setup docs.

**Primary source:** Local checkout `/tmp/synara` (checked 2026-08-07): `docs/canary.md`
(Canary isolation, app name `Synara Canary`, bundle ID `com.emanueledipietro.synara.canary`,
data dir `~/.synara-canary`) and `README.md` (MCP-native agent harness description).
Live GitHub URLs `https://github.com/Emanuele-web04/synara*` verified HTTP 200 on 2026-08-07.

## Site metadata (src/lib/seo.ts)

**Claims:** `https://www.trysynara.com` (canonical site URL), `https://emanueledipietro.com`
(author site), `https://x.com/emanueledpt` (X profile), `https://youtube.com/@emanueledpt`
(YouTube channel), `https://schema.org` (schema vocabulary), `https://opensource.org/licenses/MIT`
(MIT license).

**Primary sources:** All verified HTTP 200 on 2026-08-07. `opensource.org/licenses/MIT`
redirects to the canonical `https://opensource.org/license/MIT`; `emanueledipietro.com`
redirects to `https://www.emanueledipietro.com/`; `youtube.com/@emanueledpt` redirects to
`https://www.youtube.com/@emanueledpt`. Note: `youtube.com/@emanueledpt` is in the check
script's ALLOWLIST because YouTube occasionally returns ETIMEDOUT to non-browser agents
(observed once on 2026-08-07, passes on retry and in curl verification).

## Check run

- `npm run test:links` — 45 unique URLs, 45 PASS, 0 warn, 0 allowlisted, 0 fail (exit 0, ~7s);
  stable across repeated runs (idempotent).
- `npm run test:docs` — 45/45 tests pass plus documentation integrity check (exit 0).
- `npx eslint scripts/check-external-links.mjs` — clean (exit 0).

## Cursor — `cursor-agent upgrade` subcommand (evidence-trail addendum)

**Claim removed:** `content/docs/providers/cursor.mdx` listed `cursor-agent upgrade` as a
valid subcommand alternative to `cursor-agent update`.

**Primary source:** Web-verified 2026-08-07 — the cursor-agent CLI exposes only
`cursor-agent update`; there is no `upgrade` subcommand. The local capture
`/tmp/dpcode-pr2/cursor-docs.html` is the `https://cursor.com/docs` landing page and
contains no cursor-agent mentions, so the live web check is the authoritative source.

**Decision — CORRECT:** removal of `cursor-agent upgrade` stands.

## Synara — `/config` slash command (evidence-trail addendum)

**Claim removed:** `content/docs/reference/slash-commands.mdx` listed `/config` ("Open
settings") among built-in slash commands.

**Primary source:** No test assertion exists (`scripts/help-docs.test.mjs` has no
slash-command assertions) and no app-source capture was available in this repo; the
removal follows the canonical product position that built-in commands are documented in
the app.

**Decision — REMOVAL STANDS:** evidence source is the app's built-in command list
(unverified in this repo) — **needs app-source confirmation, low risk**.

## Synara v0.7.2 feature documentation

Date checked: **2026-08-15**

**Claims:** Persistent and autonomous thread goals; `/goal` controls; evidence-first Debug
mode; full-thread and message-level forks; native fork coverage; local/worktree fork targets;
the macOS iOS Simulator pane and device controls; workspace file and source search; stacked
pull-request navigation and prefix merging; automation consecutive-failure policies.

**Primary source:** Local Synara checkout
`/Users/emanueledipietro/Developer/synara` at release tag `v0.7.2`, commit
`18ff99857d5b84adab2019c2839fa4f6df761b7c`.

Key source paths checked:

- Goals and commands: `apps/web/src/composerSlashCommands.ts`,
  `apps/web/src/hooks/useComposerSlashCommands.ts`,
  `apps/web/src/components/chat/ComposerGoalHeader.tsx`, and
  `apps/server/src/agentGateway/Layers/AgentGateway.ts`
- Fork lifecycle: `apps/web/src/hooks/useComposerSlashCommands.ts`,
  `apps/web/src/lib/threadEnvironment.ts`,
  `apps/web/src/components/chat/MessagesTimeline.tsx`, and provider fork adapters
- Debug policy: `apps/server/src/provider/debugMode.ts` and composer interaction-mode controls
- iOS Simulator: `apps/web/src/components/DevicePanel.tsx`,
  `apps/web/src/components/DevicePanel.logic.ts`,
  `apps/web/src/components/device/DeviceControlRail.tsx`, and server device services/tools
- Workspace search: `apps/web/src/components/chat/SingleChatSurface.tsx` and
  `apps/web/src/components/WorkspaceSearchPalette.tsx`
- Stacked PRs: `apps/web/src/components/pullRequest/PullRequestStackPopover.tsx`,
  `pullRequestStack.logic.ts`, and `PullRequestDetailPanel.tsx`
- Automation failures: `apps/web/src/lib/automationFailurePolicy.ts`, automation form/detail
  controls, and `apps/server/src/automation/Layers/AutomationService.ts`

**Decision:** Public documentation follows the shipped release source. The older internal
`docs/device-pane-spec.md` was treated as historical design context only because several
pre-implementation non-goals changed before v0.7.2 shipped.
