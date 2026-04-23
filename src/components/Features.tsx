import type { ComponentType } from "react";
import { SiOpenai, SiGooglegemini } from "react-icons/si";
import {
  FiGitBranch,
  FiGitPullRequest,
  FiArrowUpRight,
  FiCheck,
  FiGitMerge,
} from "react-icons/fi";
import { LuSparkles } from "react-icons/lu";
import { TbArrowsSplit2 } from "react-icons/tb";
import { ClaudeIcon, OpencodeIcon, CursorIcon } from "@/components/BrandIcons";

type GenericIcon = ComponentType<{ className?: string }>;

const heading =
  "text-[1.6rem] font-medium leading-[1.1] tracking-[-0.025em] text-white sm:text-[2.1rem]";
const body =
  "mt-4 max-w-2xl text-[14px] leading-relaxed text-white/60 sm:text-[15px]";
const container = "mx-auto w-full max-w-[1200px] px-4 sm:px-6";

type Harness = {
  name: string;
  tagline: string;
  Icon: GenericIcon;
  accent: string;
  ring: string;
};

const RING = "before:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.05),transparent_60%)]";

const activeHarnesses: Harness[] = [
  {
    name: "Claude Code",
    tagline: "Sonnet, Opus, Haiku. Whatever's on your Anthropic plan.",
    Icon: ClaudeIcon,
    accent: "text-[#D97757]",
    ring: RING,
  },
  {
    name: "Codex",
    tagline: "Latest frontier models, from your GPT subscription.",
    Icon: SiOpenai,
    accent: "text-white",
    ring: RING,
  },
  {
    name: "Gemini",
    tagline: "3.1 Pro and Flash. Bring your Google AI Studio key.",
    Icon: SiGooglegemini,
    accent: "text-[#4C8BF5]",
    ring: RING,
  },
];

const soonHarnesses: { name: string; Icon: GenericIcon }[] = [
  { name: "opencode", Icon: OpencodeIcon },
  { name: "Cursor", Icon: CursorIcon },
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
    iconClass: "text-white",
  },
  {
    title: "OpenCode Support",
    age: "25m",
    branchIcon: TbArrowsSplit2,
    Icon: SiOpenai,
    iconClass: "text-white",
  },
  {
    title: "Logo Component",
    age: "36m",
    branchIcon: TbArrowsSplit2,
    Icon: SiGooglegemini,
    iconClass: "text-[#4C8BF5]",
  },
];

export default function Features() {
  return (
    <div>
      {/* ─────────────── HARNESSES ─────────────── */}
      <section className="py-20 sm:py-28">
        <div className={container}>
          <h2 className={heading}>
            Use what you <span className="text-[#606acc]">already</span> pay for.
          </h2>
          <p className={body}>
            DP Code speaks every major harness. Plug in Claude, Codex, or Gemini with
            the account you already use. No new bills, no walled gardens.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {activeHarnesses.map(({ name, tagline, Icon, accent, ring }) => (
              <div
                key={name}
                className={`group relative flex h-full flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 pt-4 pb-0 backdrop-blur-sm transition-colors hover:border-white/15 before:pointer-events-none before:absolute before:inset-0 before:opacity-70 before:transition-opacity group-hover:before:opacity-100 ${ring}`}
              >
                <div className="relative flex items-center justify-between">
                  <Icon className={`size-5 ${accent}`} />
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-[0.08em] text-emerald-400">
                    <span className="size-1 rounded-full bg-emerald-400" />
                    Live
                  </span>
                </div>
                <h3 className="relative mt-4 text-[13.5px] font-medium text-white">
                  {name}
                </h3>
                <p className="relative mt-0.5 min-h-[2lh] text-[11.5px] leading-relaxed text-white/60">
                  {tagline}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-[11px] uppercase tracking-[0.14em] text-white/40">
              Coming soon
            </span>
            {soonHarnesses.map(({ name, Icon }) => (
              <span
                key={name}
                className="inline-flex items-center gap-2 rounded-full border border-dashed border-white/[0.15] px-3 py-1 text-[12px] text-white/55"
              >
                <Icon className="size-3.5" />
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────── CRAFT ─────────────── */}
      <section className="py-20 sm:py-28">
        <div className={container}>
          <h2 className={heading}>
            The details that make you <span className="text-[#606acc]">faster</span>.
          </h2>
          <p className={body}>
            Every surface is tuned for flow. Thread-native orchestration, inline
            diffs, instant worktrees, and a one-click PR the moment your agent
            finishes.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Card 1 — One-click PRs */}
            <div className="group flex h-full flex-col rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-sm transition-colors hover:border-white/15">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.05]">
                  <FiGitPullRequest className="size-4 text-[#606acc]" />
                </div>
                <h3 className="text-[14.5px] font-medium text-white">
                  One-click PRs
                </h3>
              </div>
              <p className="mt-4 text-[13px] leading-relaxed text-white/60">
                Ship the moment your agent lands a green diff. DP Code opens,
                titles, and files the PR for you.
              </p>
              <div className="mt-auto pt-5">
                <div className="rounded-xl border border-white/[0.08] bg-black/30 p-3">
                  <div className="flex items-center justify-between gap-2 font-mono text-[10.5px] text-white/50">
                    <span className="inline-flex items-center gap-1 truncate">
                      <FiGitBranch className="size-3 text-white/40" />
                      <span className="truncate text-white/75">feature/context-meter</span>
                      <span className="text-white/30">→</span>
                      <span className="text-white/55">main</span>
                    </span>
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#606acc]/10 px-1.5 py-0.5 font-sans font-medium text-[#606acc]">
                      <span className="relative flex size-1.5">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#606acc] opacity-70" />
                        <span className="relative inline-flex size-1.5 rounded-full bg-[#606acc]" />
                      </span>
                      Ready
                    </span>
                  </div>

                  <div className="mt-2.5 text-[12.5px] font-medium text-white">
                    fix: tighten context window meter
                  </div>

                  <div className="mt-2 flex items-center gap-2 font-mono text-[10.5px] text-white/50">
                    <span>4 files</span>
                    <span className="text-white/20">·</span>
                    <span className="text-emerald-400/90">+110</span>
                    <span className="text-rose-400/90">−24</span>
                  </div>

                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1 text-[11px] font-medium text-neutral-900 shadow-[0_0_0_1px_rgba(255,255,255,0.1)]">
                    Create PR
                    <FiArrowUpRight className="size-3" />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 — Worktree-native */}
            <div className="group flex h-full flex-col rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-sm transition-colors hover:border-white/15">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.05]">
                  <TbArrowsSplit2 className="size-4 text-[#606acc]" />
                </div>
                <h3 className="text-[14.5px] font-medium text-white">
                  Worktree-native
                </h3>
              </div>
              <p className="mt-4 text-[13px] leading-relaxed text-white/60">
                Spin up isolated branches without ever opening a terminal. Build
                three things in parallel without stomping on yourself.
              </p>
              <div className="mt-auto pt-5">
                <div className="rounded-xl border border-white/[0.08] bg-black/30 p-3 font-mono text-[11.5px]">
                  <div className="flex items-center gap-1.5 text-white/60">
                    <FiGitBranch className="size-3 text-white/40" /> main
                  </div>

                  <div className="relative ml-[5px] mt-1 border-l border-white/10 pl-3.5">
                    <span className="absolute left-0 top-[9px] h-px w-3 bg-white/10" />
                    <div className="flex items-center gap-1.5 rounded-md bg-[#606acc]/10 px-1.5 py-0.5 -mx-1.5 text-white">
                      <FiGitBranch className="size-3 text-[#606acc]" />
                      <span className="truncate">feature/context-meter</span>
                      <span className="ml-auto flex items-center gap-1 text-[10px] text-[#606acc]">
                        <span className="relative flex size-1.5">
                          <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#606acc] opacity-70" />
                          <span className="relative inline-flex size-1.5 rounded-full bg-[#606acc]" />
                        </span>
                        live
                      </span>
                    </div>
                  </div>

                  <div className="relative ml-[5px] border-l border-white/10 pl-3.5 pt-1">
                    <span className="absolute left-0 top-[11px] h-px w-3 bg-white/10" />
                    <div className="flex items-center gap-1.5 text-white/70">
                      <FiGitBranch className="size-3 text-white/50" />
                      <span className="truncate">fix/rate-limit-banner</span>
                      <span className="ml-auto text-[10px] text-white/35">2 ahead</span>
                    </div>
                  </div>

                  <div className="mt-2.5 inline-flex items-center gap-1 rounded-md border border-dashed border-white/[0.18] px-1.5 py-0.5 text-[10.5px] text-white/55 transition-colors hover:border-white/30 hover:text-white/80">
                    + new worktree
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 — Agent orchestration */}
            <div className="group flex h-full flex-col rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-sm transition-colors hover:border-white/15">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.05]">
                  <LuSparkles className="size-4 text-[#606acc]" />
                </div>
                <h3 className="text-[14.5px] font-medium text-white">
                  Agent orchestration
                </h3>
              </div>
              <p className="mt-4 text-[13px] leading-relaxed text-white/60">
                Every thread, every tool call, every run, tracked in one calm
                surface. Hand off between agents mid-task.
              </p>
              <div className="mt-auto pt-5">
                <div className="space-y-1 rounded-xl border border-white/[0.08] bg-black/30 p-2.5">
                  {[
                    {
                      label: "Folder picker UI",
                      agent: ClaudeIcon,
                      color: "text-[#D97757]",
                      status: "running" as const,
                      meta: "12 tool calls",
                    },
                    {
                      label: "Workspace logic check",
                      agent: SiOpenai,
                      color: "text-white",
                      status: "done" as const,
                      meta: "PR #284",
                    },
                    {
                      label: "Brighter accent color",
                      agent: SiGooglegemini,
                      color: "text-[#4C8BF5]",
                      status: "queued" as const,
                      meta: "queued",
                    },
                  ].map((t) => {
                    const AgentIcon = t.agent;
                    const dot =
                      t.status === "running"
                        ? "bg-[#606acc]"
                        : t.status === "done"
                          ? "bg-emerald-400/80"
                          : "bg-white/30";
                    return (
                      <div
                        key={t.label}
                        className="flex items-center gap-2 rounded-md px-1.5 py-1 text-[12px] text-white/85 transition-colors hover:bg-white/[0.04]"
                      >
                        <span className="relative flex size-1.5 shrink-0">
                          {t.status === "running" && (
                            <span className={`absolute inline-flex size-full animate-ping rounded-full ${dot} opacity-70`} />
                          )}
                          <span className={`relative inline-flex size-1.5 rounded-full ${dot}`} />
                        </span>
                        <AgentIcon className={`size-3 shrink-0 ${t.color}`} />
                        <span className="truncate">{t.label}</span>
                        <span className="ml-auto shrink-0 font-mono text-[10px] text-white/35">
                          {t.meta}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────── PARALLEL ─────────────── */}
      <section className="border-t border-white/[0.06] py-20 sm:py-28">
        <div className={container}>
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-12 sm:gap-16">
            <div className="sm:col-span-5">
              <h2 className={heading}>
                Ten things at once.<br />
                Lose track of <span className="text-[#606acc]">none</span>.
              </h2>
              <p className={body}>
                Run Claude, Codex, and Gemini across multiple worktrees, across
                multiple projects, all in one window. Every thread stays exactly
                where you left it.
              </p>
            </div>

            {/* Live lanes */}
            <div className="sm:col-span-7">
              <div className="rounded-2xl border border-white/[0.08] bg-black/40 p-3 backdrop-blur-sm sm:p-4">
                <div className="flex flex-col">
                  {parallelLanes.map(({ title, active, age, branchIcon: BranchIcon, Icon, iconClass }, i) => (
                    <div
                      key={`${title}-${i}`}
                      className="group flex items-center gap-3.5 rounded-lg px-2.5 py-2.5 transition-colors hover:bg-white/[0.03] sm:gap-4 sm:px-3"
                    >
                      <div className="relative flex size-8 shrink-0 items-center justify-center">
                        {active && (
                          <span className="pointer-events-none absolute inset-0 rounded-full border border-white/10 border-t-white/70 animate-spin [animation-duration:1.6s]" />
                        )}
                        <span className="flex size-6 items-center justify-center rounded-full bg-neutral-900 ring-1 ring-white/10">
                          <Icon className={`size-3.5 ${iconClass}`} />
                        </span>
                      </div>

                      <span className="min-w-0 flex-1 truncate text-[15px] font-medium text-white/90 sm:text-[16px]">
                        {title}
                      </span>

                      <div className="flex shrink-0 items-center gap-2 text-white/40">
                        <BranchIcon className="size-3.5" />
                        <span className="w-10 text-right font-mono text-[12px] tabular-nums">
                          {age}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
