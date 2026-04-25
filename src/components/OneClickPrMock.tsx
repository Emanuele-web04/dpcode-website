"use client";

import type { ComponentType } from "react";
import { useState } from "react";
import { SiGithub } from "react-icons/si";
import { GoGitBranch } from "react-icons/go";
import { FiChevronDown, FiUploadCloud, FiArrowUp } from "react-icons/fi";

type GenericIcon = ComponentType<{ className?: string }>;

const mockPanel = "overflow-hidden rounded-xl bg-[var(--mock-surface)]";

const gitPickerRowBase =
  "flex w-full cursor-pointer items-center gap-2.5 px-2.5 py-2 text-left text-[11px] text-[var(--text-primary)] transition-colors hover:bg-[var(--mock-row)] focus-visible:bg-[var(--mock-row)] focus-visible:outline-none";

/** Horizontal “commit node” glyph (line through circle), VS Code–style. */
function GitCommitIconHorizontal({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.35"
        d="M2.5 8h11"
      />
      <circle
        cx="8"
        cy="8"
        r="2.35"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.35"
      />
    </svg>
  );
}

type MenuActionId = "commit-push" | "push" | "create-pr" | "create-branch";

const menuActions: {
  id: MenuActionId;
  label: string;
  Icon: GenericIcon;
}[] = [
  { id: "commit-push", label: "Commit & push", Icon: FiArrowUp },
  { id: "push", label: "Push", Icon: FiUploadCloud },
  { id: "create-pr", label: "Create PR", Icon: SiGithub },
  { id: "create-branch", label: "Create branch", Icon: GoGitBranch },
];

export function OneClickPrMock() {
  const [menuSelection, setMenuSelection] = useState<MenuActionId | null>(null);

  const PrimaryIcon =
    menuSelection === null
      ? GitCommitIconHorizontal
      : menuActions.find((a) => a.id === menuSelection)!.Icon;
  const primaryLabel =
    menuSelection === null
      ? "Commit"
      : menuActions.find((a) => a.id === menuSelection)!.label;

  return (
    <div className={`${mockPanel} p-3`}>
      <div className="flex items-center justify-between gap-2 font-mono text-[10.5px] text-[var(--text-tertiary)]">
        <span className="inline-flex min-w-0 items-center gap-1 truncate">
          <GoGitBranch className="size-3 shrink-0 text-[var(--text-tertiary)]" />
          <span className="truncate text-[var(--text-secondary)]">
            feature/context-meter
          </span>
          <span className="text-[var(--text-tertiary)]">→</span>
          <span className="text-[var(--text-secondary)]">main</span>
        </span>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-[var(--mock-row-strong)] px-1.5 py-0.5 font-sans text-[10px] font-medium text-[var(--text-secondary)]">
          <span className="size-1.5 rounded-full bg-[var(--text-tertiary)]" />
          Ready
        </span>
      </div>
      <div className="mt-2.5 text-[12.5px] font-medium text-[var(--text-primary)]">
        fix: tighten context window meter
      </div>
      <div className="mt-2 flex items-center gap-2 font-mono text-[10.5px] text-[var(--text-tertiary)]">
        <span>4 files</span>
        <span className="opacity-50">·</span>
        <span className="text-[var(--text-secondary)]">+110</span>
        <span>−24</span>
      </div>

      <div
        className="mt-3 space-y-2"
        role="region"
        aria-label="Git commit and actions"
      >
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex overflow-hidden rounded-xl border border-[var(--divide)] text-[10.5px] font-medium">
            <span className="inline-flex items-center gap-1 bg-[var(--chat-file-card-bg)] px-2 py-1 text-[var(--text-primary)]">
              <PrimaryIcon className="size-3.5 shrink-0 text-[var(--text-secondary)]" />
              {primaryLabel}
            </span>
            <span className="flex items-center border-l border-[var(--divide)] bg-[var(--chat-file-card-bg)] px-1.5 py-1 text-[var(--text-tertiary)]">
              <FiChevronDown className="size-3 shrink-0" aria-hidden />
            </span>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-[var(--divide)] bg-[var(--chat-file-card-bg)] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.18)] dark:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)]">
          <div className="border-b border-[var(--divide)] px-2.5 py-1.5 font-sans text-[9.5px] font-medium uppercase tracking-[0.06em] text-[var(--text-tertiary)]">
            Git actions
          </div>
          {menuActions.map((action, index) => {
            const isSelected = menuSelection === action.id;
            const isLast = index === menuActions.length - 1;
            return (
              <button
                key={action.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() =>
                  setMenuSelection((s) => (s === action.id ? null : action.id))
                }
                className={`${gitPickerRowBase} ${
                  isSelected ? "bg-[var(--mock-row-strong)] hover:bg-[var(--mock-row-strong)]" : ""
                } ${isLast ? "" : "border-b border-[var(--divide)]"}`}
              >
                <action.Icon className="size-4 shrink-0 text-[var(--text-secondary)]" />
                {action.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
