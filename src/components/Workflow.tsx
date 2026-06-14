import { HandoffChatMock } from "@/components/HandoffChatMock";
import { TerminalTabsMock } from "@/components/TerminalTabsMock";
import { ParallelChatMock } from "@/components/ParallelChatMock";
import { SplitShowcase } from "@/components/SplitShowcase";

export default function Workflow() {
  return (
    <section className="relative overflow-hidden py-12 sm:py-16">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <SplitShowcase
          title="Split chats. Parallel work."
          description="Open a lane per agent or task and keep both threads running at once—same window, no tab shuffle, no lost context."
          stacked
          prominentMedia
        >
          <ParallelChatMock />
        </SplitShowcase>

        <SplitShowcase
          title="Swap models mid-thread."
          description="Stuck on a tough bug? Pass it to another model. Full context travels with it."
          reverse
        >
          <HandoffChatMock />
        </SplitShowcase>

        <SplitShowcase
          title="Every process, in sight."
          description="Dev server, test watcher, log tail. Stop alt-tabbing away from the thing that just broke."
          reverse={false}
        >
          <TerminalTabsMock />
        </SplitShowcase>

        <SplitShowcase
          title="Docs and previews, one pane over."
          description="Check what an API returns, watch a preview reload, scan the docs. No context switch."
          stacked
          prominentMedia
        >
          <div className="overflow-hidden rounded-lg ring-1 ring-black/5 sm:rounded-xl dark:ring-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/browser-syn.png"
              alt="Synara built-in browser — docs and a live preview one pane over from the agent thread"
              className="block h-auto w-full"
            />
          </div>
        </SplitShowcase>
      </div>
    </section>
  );
}
