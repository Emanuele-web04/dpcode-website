"use client";

import type { ComponentType } from "react";
import { useState } from "react";
import { SiOpenai, SiGooglegemini } from "react-icons/si";
import { TbArrowsSplit2 } from "react-icons/tb";
import { ClaudeIcon, OpencodeIcon } from "@/components/BrandIcons";

type GenericIcon = ComponentType<{ className?: string }>;

const mockPanel = "overflow-hidden rounded-xl bg-[var(--mock-surface)]";

const sessions: {
  title: string;
  project: string;
  Agent: GenericIcon;
  agentColor: string;
  age: string;
}[] = [
  {
    title: "Browser Use Support",
    project: "dpcode",
    Agent: SiOpenai,
    agentColor: "text-[var(--text-secondary)]",
    age: "1h",
  },
  {
    title: "Terminal LSP setup",
    project: "dpcode",
    Agent: OpencodeIcon,
    agentColor: "text-[var(--text-secondary)]",
    age: "4d",
  },
  {
    title: "Inline diffs",
    project: "dpcode",
    Agent: ClaudeIcon,
    agentColor: "text-[#D97757]",
    age: "12m",
  },
  {
    title: "Theme tokens",
    project: "dpcode",
    Agent: SiGooglegemini,
    agentColor: "text-[#4C8BF5]",
    age: "2d",
  },
];

export function WorktreeMock() {
  const [selected, setSelected] = useState(0);

  return (
    <div className={`${mockPanel} p-1.5`}>
      <ul className="space-y-px" role="listbox" aria-label="Worktree sessions">
        {sessions.map(({ title, project, Agent, agentColor, age }, index) => {
          const isSelected = index === selected;
          return (
            <li key={title} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => setSelected(index)}
                className={`flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-[var(--mock-row)] focus-visible:bg-[var(--mock-row)] focus-visible:outline-none ${
                  isSelected
                    ? "bg-[var(--mock-row-strong)] hover:bg-[var(--mock-row-strong)]"
                    : ""
                }`}
              >
                <span className="inline-flex size-[18px] shrink-0 items-center justify-center rounded-full bg-[var(--mock-row-strong)]">
                  <Agent className={`size-[10px] ${agentColor}`} />
                </span>
                <span className="min-w-0 flex-1 truncate text-[12px] font-medium text-[var(--text-primary)]">
                  {title}
                </span>
                <span className="shrink-0 text-[11px] text-[var(--text-tertiary)]">
                  {project}
                </span>
                <TbArrowsSplit2 className="size-3 shrink-0 text-[var(--text-tertiary)]" />
                <span className="w-7 shrink-0 text-right font-mono text-[11px] tabular-nums text-[var(--text-tertiary)]">
                  {age}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
