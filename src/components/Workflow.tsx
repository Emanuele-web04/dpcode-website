import { FiGlobe, FiArrowLeft, FiRotateCw } from "react-icons/fi";
import { HandoffChatMock } from "@/components/HandoffChatMock";
import { TerminalTabsMock } from "@/components/TerminalTabsMock";
import { ParallelChatMock } from "@/components/ParallelChatMock";
import { SplitShowcase } from "@/components/SplitShowcase";

const mockPanel = "overflow-hidden rounded-xl bg-[var(--mock-surface)]";

export default function Workflow() {
  return (
    <section className="relative overflow-hidden border-t border-[var(--divide)] py-12 sm:py-16">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <SplitShowcase
          eyebrow="Parallel chats"
          title="Split chats. Parallel work."
          description="Open a lane per agent or task and keep both threads running at once—same window, no tab shuffle, no lost context."
          stacked
        >
          <ParallelChatMock />
        </SplitShowcase>

        <SplitShowcase
          eyebrow="Handoff"
          title="Swap models mid-thread."
          description="Stuck on a tough bug? Pass it to another model. Full context travels with it."
          reverse
        >
          <HandoffChatMock />
        </SplitShowcase>

        <SplitShowcase
          eyebrow="Terminals"
          title="Every process, in sight."
          description="Dev server, test watcher, log tail. Stop alt-tabbing away from the thing that just broke."
          reverse={false}
        >
          <TerminalTabsMock />
        </SplitShowcase>

        <SplitShowcase
          eyebrow="Browser"
          title="Docs and previews, one pane over."
          description="Check what an API returns, watch a preview reload, scan the docs. No context switch."
          reverse
        >
          <div className={`${mockPanel} flex min-h-[240px] flex-1 flex-col`}>
            <div className="flex items-center gap-2 border-b border-[var(--divide)] px-2.5 py-2">
              <div className="flex items-center gap-1 text-[var(--text-tertiary)]">
                <FiArrowLeft className="size-3" />
                <FiRotateCw className="size-3" />
              </div>
              <div className="flex flex-1 items-center gap-1.5 rounded-md bg-[var(--mock-row)] px-2 py-1 text-[10.5px] text-[var(--text-secondary)]">
                <FiGlobe className="size-3 text-[var(--text-tertiary)]" />
                <span className="truncate font-mono">dpcode.cc</span>
              </div>
            </div>
            <div className="grid grid-cols-[1fr_0.8fr] gap-4 p-4 text-[11px] leading-relaxed sm:grid-cols-[1fr_0.6fr]">
              <div className="space-y-1.5">
                <div className="text-[var(--text-primary)]">DP Code · Docs</div>
                <div className="h-1.5 w-3/4 rounded-full bg-[var(--mock-row-strong)]" />
                <div className="h-1.5 w-5/6 rounded-full bg-[var(--mock-row)]" />
                <div className="h-1.5 w-2/3 rounded-full bg-[var(--mock-row)]" />
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] text-[var(--text-tertiary)]">
                  <span className="rounded-full bg-[var(--mock-row)] px-1.5 py-0.5">
                    Tool use
                  </span>
                  <span className="rounded-full bg-[var(--mock-row)] px-1.5 py-0.5">
                    Providers
                  </span>
                  <span className="rounded-full bg-[var(--mock-row)] px-1.5 py-0.5">
                    Worktrees
                  </span>
                </div>
              </div>
              <div className="flex flex-col justify-between rounded-md bg-[var(--mock-row)] p-2.5">
                <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--text-tertiary)]">
                  Preview
                </div>
                <div className="mt-2 space-y-1">
                  <div className="h-1 w-full rounded-full bg-[var(--mock-row-strong)]" />
                  <div className="h-1 w-4/5 rounded-full bg-[var(--mock-row)]" />
                  <div className="h-1 w-2/3 rounded-full bg-[var(--mock-row)]" />
                </div>
                <div className="mt-3 h-12 rounded-md bg-[var(--mock-row-strong)]" />
              </div>
            </div>
          </div>
        </SplitShowcase>
      </div>
    </section>
  );
}
