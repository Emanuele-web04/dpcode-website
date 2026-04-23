import { SiOpenai } from "react-icons/si";
import {
  FiTerminal,
  FiGlobe,
  FiCheck,
  FiChevronDown,
  FiArrowRight,
  FiArrowLeft,
  FiRotateCw,
  FiRepeat,
} from "react-icons/fi";
import { ClaudeIcon } from "@/components/BrandIcons";

const ACCENT = "#606acc";

const heading =
  "text-[1.6rem] font-medium leading-[1.1] tracking-[-0.025em] text-white sm:text-[2.1rem]";
const body =
  "mt-4 max-w-2xl text-[14px] leading-relaxed text-white/60 sm:text-[15px]";

const card =
  "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md transition-colors hover:border-white/15";
const cardLabel =
  "relative font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/45";
const cardTitle =
  "relative mt-2 text-[17px] font-medium tracking-[-0.01em] text-white sm:text-[18px]";
const cardDesc =
  "relative mt-2 max-w-md text-[13px] leading-relaxed text-white/60";

export default function Workflow() {
  return (
    <section className="relative overflow-hidden border-t border-white/[0.06] py-20 sm:py-28">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
        <h2 className={heading}>
          Every tool.{" "}
          <span style={{ color: ACCENT }}>One</span> window.
        </h2>
        <p className={body}>
          Split chats across agents, stack terminals, peek at docs, and hand off
          a thread to another provider, all without leaving DP Code.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-[auto_auto]">
          {/* Row 1 · Split chats (flagship, col-span-2) */}
          <article className={`${card} md:col-span-2`}>
            <div className="flex flex-1 flex-col p-6 sm:p-8">
              <div className={cardLabel}>01 · Parallel chats</div>
              <h3 className={cardTitle}>Two agents. One project.</h3>
              <p className={cardDesc}>
                Ask Claude to plan while Codex writes the tests. Watch them
                work side by side.
              </p>

              <div className="relative mt-7 flex-1">
                <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-white/[0.08] bg-black/30">
                  <div className="border-r border-white/[0.08] p-3.5">
                    <div className="flex items-center gap-1.5 text-[10.5px] text-white/55">
                      <ClaudeIcon className="size-3 text-[#D97757]" />
                      <span className="truncate">Claude · plan</span>
                    </div>
                    <div className="mt-2.5 rounded-md bg-white/[0.04] px-2 py-1.5 text-[11.5px] text-white/85">
                      Re-reading <span className="font-mono text-white/65">auth.ts</span> to map the flow…
                    </div>
                    <div className="mt-2 rounded-md bg-white/[0.04] px-2 py-1.5 text-[11.5px] text-white/85">
                      Proposed: split <span className="font-mono text-white/65">verifySession</span> into two helpers.
                    </div>
                    <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/[0.05] px-1.5 py-0.5 text-[10px] text-white/80">
                      <FiCheck className="size-2.5" /> Tool calls (3)
                    </div>
                  </div>
                  <div className="p-3.5">
                    <div className="flex items-center gap-1.5 text-[10.5px] text-white/55">
                      <SiOpenai className="size-3 text-white" />
                      <span className="truncate">Codex · tests</span>
                    </div>
                    <div className="mt-2.5 rounded-md bg-white/[0.04] px-2 py-1.5 text-[11.5px] text-white/85">
                      Wrote <span className="font-mono text-white/65">auth.test.ts</span> — 12 cases.
                    </div>
                    <div className="mt-2 font-mono text-[10.5px] leading-relaxed text-white/80">
                      <div>pnpm test auth</div>
                      <div className="text-white/95">✓ 24 passed, 0 failed</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Row 1 · Provider handoff (narrow) */}
          <article className={card}>
            <div className="flex flex-1 flex-col p-6 sm:p-7">
              <div className={cardLabel}>02 · Handoff</div>
              <h3 className={cardTitle}>Swap models mid-thread.</h3>
              <p className={cardDesc}>
                Stuck on a tough bug? Pass it to another model. Full context
                travels with it.
              </p>

              <div className="relative mt-7 flex-1">
                <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-black/30 p-3.5">
                  <div className="flex items-center justify-end">
                    <div
                      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px] font-medium text-white"
                      style={{
                        borderColor: `${ACCENT}4D`,
                        backgroundColor: `${ACCENT}1A`,
                      }}
                    >
                      <FiRepeat className="size-3" style={{ color: ACCENT }} />
                      <span>Hand off to</span>
                      <SiOpenai className="size-3 text-white" />
                      <span>Codex</span>
                      <FiChevronDown className="size-3 text-white/50" />
                    </div>
                  </div>

                  <div className="mt-3 space-y-2.5">
                    <div className="flex items-center gap-2 text-[10.5px] text-white/50">
                      <ClaudeIcon className="size-3 text-[#D97757]" />
                      <span>Claude · 42 messages</span>
                    </div>
                    <div className="flex items-center gap-2 px-1">
                      <div
                        className="h-px flex-1"
                        style={{
                          background: `linear-gradient(to right, ${ACCENT}80, rgba(255,255,255,0.2))`,
                        }}
                      />
                      <div className="flex items-center gap-1 text-[9.5px] uppercase tracking-[0.12em] text-white/40">
                        <FiRepeat className="size-2.5" /> handoff
                      </div>
                      <div
                        className="h-px flex-1"
                        style={{
                          background: `linear-gradient(to right, rgba(255,255,255,0.2), ${ACCENT}80)`,
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-[10.5px] text-white/90">
                      <SiOpenai className="size-3 text-white" />
                      <span>Codex · picks up at msg 43</span>
                    </div>
                    <div className="ml-5 rounded-md bg-white/[0.04] px-2 py-1.5 text-[11.5px] text-white/85">
                      Context loaded. Ready to continue.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Row 2 · Split terminals (narrow) */}
          <article className={card}>
            <div className="flex flex-1 flex-col p-6 sm:p-7">
              <div className={cardLabel}>03 · Terminals</div>
              <h3 className={cardTitle}>Every process, in sight.</h3>
              <p className={cardDesc}>
                Dev server, test watcher, log tail. Stop alt-tabbing away from
                the thing that just broke.
              </p>

              <div className="relative mt-7 flex-1">
                <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-black/30">
                  <div className="flex items-center gap-0.5 border-b border-white/[0.06] px-2 pt-1.5 text-[10.5px]">
                    <span className="inline-flex items-center gap-1 rounded-t-md border border-b-0 border-white/[0.08] bg-white/[0.04] px-2 py-1 text-white">
                      <FiTerminal className="size-3" style={{ color: ACCENT }} /> dev
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-white/40">
                      <FiTerminal className="size-3" /> test
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-white/40">
                      <FiTerminal className="size-3" /> logs
                    </span>
                  </div>
                  <div className="p-3.5 font-mono text-[11px] leading-relaxed text-white/75">
                    <div>
                      <span className="text-white/40">$ </span>pnpm dev
                    </div>
                    <div className="text-white/90">✓ ready on :3000</div>
                    <div className="mt-1">
                      <span className="text-white/40">$ </span>pnpm test --watch
                    </div>
                    <div className="text-white/90">PASS  24 tests</div>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Row 2 · Internal browser (wide, col-span-2) */}
          <article className={`${card} md:col-span-2`}>
            <div className="flex flex-1 flex-col p-6 sm:p-8">
              <div className={cardLabel}>04 · Browser</div>
              <h3 className={cardTitle}>Docs and previews, one pane over.</h3>
              <p className={cardDesc}>
                Check what an API returns, watch a preview reload, scan the
                docs. No context switch.
              </p>

              <div className="relative mt-7 flex-1">
                <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-black/30">
                  <div className="flex items-center gap-2 border-b border-white/[0.06] px-2.5 py-2">
                    <div className="flex items-center gap-1 text-white/30">
                      <FiArrowLeft className="size-3" />
                      <FiArrowRight className="size-3" />
                      <FiRotateCw className="size-3" />
                    </div>
                    <div className="flex flex-1 items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1 text-[10.5px] text-white/70">
                      <FiGlobe className="size-3" style={{ color: ACCENT }} />
                      <span className="truncate font-mono">dpcode.cc</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-[1fr_0.8fr] gap-4 p-4 text-[11px] leading-relaxed sm:grid-cols-[1fr_0.6fr]">
                    <div className="space-y-1.5">
                      <div className="text-white/90">DP Code · Docs</div>
                      <div className="h-1.5 w-3/4 rounded-full bg-white/[0.08]" />
                      <div className="h-1.5 w-5/6 rounded-full bg-white/[0.06]" />
                      <div className="h-1.5 w-2/3 rounded-full bg-white/[0.06]" />
                      <div className="flex items-center gap-2 pt-1 text-[10px] text-white/50">
                        <span className="rounded-full bg-white/[0.04] px-1.5 py-0.5">
                          Tool use
                        </span>
                        <span className="rounded-full bg-white/[0.04] px-1.5 py-0.5">
                          Providers
                        </span>
                        <span className="rounded-full bg-white/[0.04] px-1.5 py-0.5">
                          Worktrees
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col justify-between rounded-md border border-white/[0.06] bg-white/[0.02] p-2.5">
                      <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/40">
                        Preview
                      </div>
                      <div className="mt-2 space-y-1">
                        <div className="h-1 w-full rounded-full bg-white/[0.08]" />
                        <div className="h-1 w-4/5 rounded-full bg-white/[0.06]" />
                        <div className="h-1 w-2/3 rounded-full bg-white/[0.06]" />
                      </div>
                      <div
                        className="mt-3 h-12 rounded-md"
                        style={{
                          background: `linear-gradient(135deg, ${ACCENT}33, transparent 70%), rgba(255,255,255,0.03)`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
