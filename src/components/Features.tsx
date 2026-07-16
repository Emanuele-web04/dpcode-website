// FILE: Features.tsx
// Purpose: Renders homepage provider and workflow feature sections.
// Layer: Marketing UI section
// Exports: Features default component
// Depends on: BrandIcons, showcase mocks, and react-icons provider marks

import type { ComponentType } from "react";
import { SiOpenai } from "react-icons/si";
import {
  AntigravityIcon,
  ClaudeIcon,
  OpencodeIcon,
  CursorIcon,
  GrokIcon,
  PiIcon,
  KiloCodeIcon,
  DroidIcon,
} from "@/components/BrandIcons";
import { SplitShowcase } from "@/components/SplitShowcase";
import { WorktreeMock } from "@/components/WorktreeMock";
import { MultiProjectShowcase } from "@/components/MultiProjectShowcase";
import { OneClickPrMock } from "@/components/OneClickPrMock";

type GenericIcon = ComponentType<{ className?: string }>;

const heading =
  "text-[1.65rem] font-medium leading-[1.12] tracking-[-0.035em] text-[var(--text-primary)] sm:text-[2rem]";
const body =
  "mt-5 max-w-xl text-[15px] leading-[1.65] text-[var(--text-secondary)] sm:text-[16px]";
const container = "mx-auto w-full max-w-6xl px-4 sm:px-6";

type Harness = {
  name: string;
  tagline: string;
  Icon: GenericIcon;
  accent: string;
  status: string;
};

const activeHarnesses: Harness[] = [
  {
    name: "Claude Code",
    tagline: "Opus 4.8, Sonnet 4.6, Haiku — whatever's on your Anthropic plan.",
    Icon: ClaudeIcon,
    accent: "text-[#D97757]",
    status: "Opus 4.8",
  },
  {
    name: "Codex",
    tagline:
      "GPT-5.5, GPT-5.4 Thinking, GPT-5.3 Codex — whatever your ChatGPT plan unlocks.",
    Icon: SiOpenai,
    accent: "text-[var(--text-primary)]",
    status: "GPT-5.5",
  },
  {
    name: "OpenCode",
    tagline: "Open-source terminal agent on your OpenCode Zen or OpenCode Go subscription.",
    Icon: OpencodeIcon,
    accent: "text-[var(--text-primary)]",
    status: "Zen + Go",
  },
  {
    name: "Cursor",
    tagline: "Composer 2.5, GPT, and Claude — all on your Cursor subscription.",
    Icon: CursorIcon,
    accent: "text-[var(--text-primary)]",
    status: "Composer 2.5",
  },
  {
    name: "Antigravity",
    tagline:
      "Google's lightweight terminal agent for multi-file editing, tool calling, and background subagents.",
    Icon: AntigravityIcon,
    accent: "",
    status: "agy CLI",
  },
  {
    name: "Grok",
    tagline: "Run Grok from the same Synara workspace.",
    Icon: GrokIcon,
    accent: "text-[var(--text-primary)]",
    status: "CLI",
  },
  {
    name: "Kilo Code",
    tagline:
      "Open-source agent across VS Code, JetBrains, and CLI — 500+ models on your own keys.",
    Icon: KiloCodeIcon,
    accent: "text-[var(--text-primary)]",
    status: "500+ models",
  },
  {
    name: "Pi",
    tagline: "Bring your Pi assistant into Synara.",
    Icon: PiIcon,
    accent: "text-[var(--text-primary)]",
    status: "Available",
  },
  {
    name: "Droid",
    tagline:
      "Factory's agent-native coding agent for end-to-end development, deep codebase context, reviews, and automation.",
    Icon: DroidIcon,
    accent: "text-[var(--text-primary)]",
    status: "CLI + Desktop",
  },
];

const soonHarnesses: Harness[] = [];

export default function Features() {
  return (
    <div>
      <section className="border-t border-[var(--divide)] py-14 sm:py-20">
        <div className={container}>
          <h2 className={heading}>Use what you already pay for.</h2>
          <p className={body}>
            Synara speaks every major harness. Plug in Claude, Codex, OpenCode,
            Cursor, Antigravity, Grok, Kilo Code, Pi, or Droid with the account
            you already use. No new bills, no walled gardens.
          </p>

          <div className="mt-12 grid grid-cols-1 border-t border-[var(--divide)] sm:grid-cols-2">
            {activeHarnesses.map(({ name, tagline, Icon, accent, status }) => (
              <div
                key={name}
                className="border-b border-[var(--divide)] p-6 transition-colors hover:bg-[var(--mock-row)] sm:p-7 sm:[&:nth-child(odd):not(:last-child)]:border-r sm:[&:nth-child(odd):not(:last-child)]:border-[var(--divide)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-[var(--block-elevated)]">
                      <Icon className={`size-[18px] ${accent}`} />
                    </span>
                    <span className="truncate text-[15px] font-medium text-[var(--text-primary)]">
                      {name}
                    </span>
                  </div>
                  <span className="shrink-0 font-mono text-[12px] tabular-nums text-[var(--text-tertiary)]">
                    {status}
                  </span>
                </div>
                <p className="mt-3 text-[13px] leading-relaxed text-[var(--text-secondary)] sm:text-[13.5px]">
                  {tagline}
                </p>
              </div>
            ))}
          </div>

          {soonHarnesses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2">
              {soonHarnesses.map(({ name, tagline, Icon, accent, status }) => (
                <div
                  key={name}
                  className="border-b border-[var(--divide)] p-6 transition-colors hover:bg-[var(--mock-row)] sm:p-7 sm:first:border-r sm:first:border-[var(--divide)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-[var(--block-elevated)]">
                        <Icon className={`size-[18px] ${accent}`} />
                      </span>
                      <span className="truncate text-[15px] font-medium text-[var(--text-primary)]">
                        {name}
                      </span>
                    </div>
                    <span className="shrink-0 font-mono text-[12px] tabular-nums text-[var(--text-tertiary)]">
                      {status}
                    </span>
                  </div>
                  <p className="mt-3 text-[13px] leading-relaxed text-[var(--text-secondary)] sm:text-[13.5px]">
                    {tagline}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="py-4 sm:py-6">
        <div className={container}>
          <h2 className={`${heading} max-w-xl`}>
            The details that make you faster.
          </h2>
          <p className={body}>
            Every surface is tuned for flow. Inline diffs, instant worktrees,
            and a one-click PR the moment your agent finishes.
          </p>

          <SplitShowcase
            title="One-click PRs"
            description="Ship the moment your agent lands a green diff. Synara opens, titles, and files the PR for you."
            reverse={false}
          >
            <OneClickPrMock />
          </SplitShowcase>

          <SplitShowcase
            title="Worktree-native"
            description="Spin up isolated branches without ever opening a terminal. Build three things in parallel without stomping on yourself."
            reverse
          >
            <WorktreeMock />
          </SplitShowcase>
        </div>
      </section>

      <MultiProjectShowcase />
    </div>
  );
}
