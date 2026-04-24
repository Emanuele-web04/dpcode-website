"use client";

import { useState } from "react";
import { FiPlus, FiTerminal, FiTrash2 } from "react-icons/fi";

const mockPanel =
  "flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl bg-[var(--mock-surface)]";

type TabId = "dev" | "test" | "logs";

const tabBase =
  "inline-flex cursor-pointer items-center gap-1 border border-b-0 px-2 py-1 text-[10.5px] transition-colors select-none";
const tabInactive =
  "rounded-none border-transparent text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]";
const tabActive =
  "rounded-none border-[var(--divide)] bg-[var(--mock-row)] text-[var(--text-primary)]";

function TerminalBody({ tab }: { tab: TabId }) {
  if (tab === "dev") {
    return (
      <div className="font-mono text-[11px] leading-relaxed text-[var(--text-secondary)]">
        <div>
          <span className="text-[var(--text-tertiary)]">$ </span>pnpm dev
        </div>
        <div className="text-[var(--text-primary)]">✓ ready on :3000</div>
        <div className="mt-1 text-[var(--text-tertiary)]">
          <span className="animate-pulse">▋</span>
        </div>
      </div>
    );
  }
  if (tab === "test") {
    return (
      <div className="font-mono text-[11px] leading-relaxed text-[var(--text-secondary)]">
        <div>
          <span className="text-[var(--text-tertiary)]">$ </span>pnpm test
          --watch
        </div>
        <div className="text-[var(--text-primary)]">PASS 24 tests</div>
        <div className="text-[var(--text-tertiary)]">
          Waiting for file changes...
        </div>
      </div>
    );
  }
  return (
    <div className="font-mono text-[11px] leading-relaxed text-[var(--text-secondary)]">
      <div>
        <span className="text-[var(--text-tertiary)]">$ </span>tail -n 50 -f
        .next/server.log
      </div>
      <div className="text-[var(--text-tertiary)]">
        [14:02:01] GET /api/installer-count 200 12ms
      </div>
      <div className="text-[var(--text-tertiary)]">
        [14:02:04] POST /__nextjs_original-stack-frames 204 3ms
      </div>
      <div className="text-amber-700 dark:text-amber-400/90">
        [14:02:08] WARN slow query: getInstallerCount 180ms
      </div>
      <div className="mt-1 text-[var(--text-tertiary)]">
        <span className="animate-pulse">▋</span>
      </div>
    </div>
  );
}

export function TerminalTabsMock() {
  const [tab, setTab] = useState<TabId>("dev");

  return (
    <div className={`${mockPanel} min-h-[240px] flex-1`}>
      <div className="flex items-end justify-between gap-2 border-b border-[var(--divide)] px-2 pt-1.5">
        <div className="flex min-w-0 flex-1 items-end gap-0.5">
          {(
            [
              ["dev", "dev"],
              ["test", "test"],
              ["logs", "logs"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`${tabBase} ${tab === id ? tabActive : tabInactive}`}
              onClick={() => setTab(id)}
            >
              <FiTerminal className="size-3 shrink-0 text-[var(--text-secondary)]" />
              {label}
            </button>
          ))}
        </div>
        <div className="mb-1 flex shrink-0 items-center gap-0.5 pr-0.5">
          <button
            type="button"
            className="flex size-7 items-center justify-center rounded-md text-[var(--text-tertiary)] hover:bg-[var(--mock-row)] hover:text-[var(--text-secondary)]"
            aria-label="New terminal (mock)"
          >
            <FiPlus className="size-3.5" />
          </button>
          <button
            type="button"
            className="flex size-7 items-center justify-center rounded-md text-[var(--text-tertiary)] hover:bg-[var(--mock-row)] hover:text-[var(--text-secondary)]"
            aria-label="Kill terminal (mock)"
          >
            <FiTrash2 className="size-3" />
          </button>
        </div>
      </div>
      <div className="min-h-[7.5rem] flex-1 p-3.5">
        <TerminalBody tab={tab} />
      </div>
    </div>
  );
}
