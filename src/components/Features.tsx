// FILE: Features.tsx
// Purpose: Renders homepage provider, workflow, and parallel-work feature sections.
// Layer: Marketing UI section
// Exports: Features default component
// Depends on: BrandIcons, showcase mocks, and react-icons provider marks

import type { ComponentType } from "react";
import { SiOpenai, SiGooglegemini } from "react-icons/si";
import { FiGitMerge } from "react-icons/fi";
import {
  ClaudeIcon,
  OpencodeIcon,
  CursorIcon,
  PiIcon,
  WorktreeIcon,
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
    tagline: "Opus 4.7, Sonnet 4.6, Haiku — whatever's on your Anthropic plan.",
    Icon: ClaudeIcon,
    accent: "text-[#D97757]",
    status: "Opus 4.7",
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
    name: "Gemini",
    tagline: "3.1 Pro and 3.1 Flash, on your Google AI Pro / Ultra subscription.",
    Icon: SiGooglegemini,
    accent: "text-[#4C8BF5]",
    status: "3.1 Pro",
  },
  {
    name: "OpenCode",
    tagline: "Open-source terminal agent on your OpenCode Zen or OpenCode Go subscription.",
    Icon: OpencodeIcon,
    accent: "text-[var(--text-primary)]",
    status: "Zen + Go",
  },
];

const soonHarnesses: Harness[] = [
  {
    name: "Cursor",
    tagline: "Bring your Cursor subscription into DP Code.",
    Icon: CursorIcon,
    accent: "text-[var(--text-tertiary)]",
    status: "Coming soon",
  },
  {
    name: "Pi",
    tagline: "Bring your Pi assistant into DP Code.",
    Icon: PiIcon,
    accent: "",
    status: "Coming soon",
  },
];

const parallelLanes: {
  title: string;
  active?: boolean;
  age: string;
  branchIcon: GenericIcon;
  Icon: GenericIcon;
  iconClass: string;
}[] = [
  {
    title: "Command Palette Themes",
    active: true,
    age: "now",
    branchIcon: FiGitMerge,
    Icon: ClaudeIcon,
    iconClass: "text-[#D97757]",
  },
  {
    title: "Command Palette Themes",
    age: "6m",
    branchIcon: FiGitMerge,
    Icon: SiOpenai,
    iconClass: "text-[var(--text-primary)]",
  },
  {
    title: "OpenCode Support",
    age: "25m",
    branchIcon: WorktreeIcon,
    Icon: OpencodeIcon,
    iconClass: "text-[var(--text-primary)]",
  },
  {
    title: "Logo Component",
    age: "36m",
    branchIcon: WorktreeIcon,
    Icon: SiGooglegemini,
    iconClass: "text-[#4C8BF5]",
  },
];

export default function Features() {
  return (
    <div>
      <section className="border-t border-[var(--divide)] py-14 sm:py-20">
        <div className={container}>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
            Providers
          </p>
          <h2 className={`${heading} mt-3`}>Use what you already pay for.</h2>
          <p className={body}>
            DP Code speaks every major harness. Plug in Claude, Codex, Gemini, or
            OpenCode with the account you already use. No new bills, no walled
            gardens.
          </p>

          <div className="mt-12 grid grid-cols-1 border-t border-[var(--divide)] sm:grid-cols-2">
            {activeHarnesses.map(({ name, tagline, Icon, accent, status }) => (
              <div
                key={name}
                className="border-b border-[var(--divide)] p-6 transition-colors hover:bg-[var(--mock-row)] sm:p-7 sm:[&:nth-child(odd)]:border-r sm:[&:nth-child(odd)]:border-[var(--divide)]"
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
            eyebrow="Ship"
            title="One-click PRs"
            description="Ship the moment your agent lands a green diff. DP Code opens, titles, and files the PR for you."
            reverse={false}
          >
            <OneClickPrMock />
          </SplitShowcase>

          <SplitShowcase
            eyebrow="Parallelism"
            title="Worktree-native"
            description="Spin up isolated branches without ever opening a terminal. Build three things in parallel without stomping on yourself."
            reverse
          >
            <WorktreeMock />
          </SplitShowcase>
        </div>
      </section>

      <MultiProjectShowcase />

      <section className="border-t border-[var(--divide)] py-14 sm:py-20">
        <div className={container}>
          <h2 className={heading}>
            Ten things at once.
            <br />
            Lose track of none.
          </h2>
          <p className={body}>
            Run Claude, Codex, Gemini, and OpenCode across multiple worktrees,
            across multiple projects, all in one window. Every thread stays
            exactly where you left it.
          </p>

          <ul className="mt-12 divide-y divide-[var(--divide)]">
            {parallelLanes.map(
              (
                { title, active, age, branchIcon: BranchIcon, Icon, iconClass },
                i
              ) => (
                <li
                  key={`${title}-${i}`}
                  className="flex items-center gap-3.5 py-4 first:pt-0 last:pb-0 sm:gap-4"
                >
                  <div className="relative flex size-8 shrink-0 items-center justify-center">
                    <span className="flex size-6 items-center justify-center rounded-full bg-[var(--mock-row)]">
                      <Icon className={`size-3.5 ${iconClass}`} />
                    </span>
                    {active ? (
                      <span className="pointer-events-none absolute -right-0.5 -top-0.5 size-2 rounded-full border-2 border-[var(--page-bg)] bg-[var(--accent-link)]" />
                    ) : null}
                  </div>
                  <span className="min-w-0 flex-1 truncate text-[15px] font-medium text-[var(--text-primary)] sm:text-[16px]">
                    {title}
                  </span>
                  <div className="flex shrink-0 items-center gap-2 text-[var(--text-tertiary)]">
                    <BranchIcon className="size-3.5" />
                    <span className="w-10 text-right font-mono text-[12px] tabular-nums">
                      {age}
                    </span>
                  </div>
                </li>
              )
            )}
          </ul>
        </div>
      </section>
    </div>
  );
}
