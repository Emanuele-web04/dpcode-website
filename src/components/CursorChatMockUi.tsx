import type { ReactNode } from "react";
import { GoGitBranch } from "react-icons/go";
import {
  FiArrowUp,
  FiChevronDown,
  FiCornerUpLeft,
  FiMic,
  FiPlus,
} from "react-icons/fi";

export const chatMockPanel =
  "overflow-hidden rounded-xl bg-[var(--mock-surface)]";

function LangBadge({ label }: { label: string }) {
  return (
    <span className="flex size-[18px] shrink-0 items-center justify-center rounded bg-[var(--mock-row-strong)] font-mono text-[7px] font-semibold uppercase tracking-tight text-[var(--text-secondary)]">
      {label}
    </span>
  );
}

export function AssistantBlock({
  children,
  meta,
}: {
  children: ReactNode;
  meta: string;
}) {
  return (
    <div className="min-w-0">
      <div className="text-[11px] leading-[1.55] text-[var(--text-primary)]">
        {children}
      </div>
      <p className="mt-1 text-[10px] leading-none text-[var(--text-tertiary)]">
        {meta}
      </p>
    </div>
  );
}

export function UserBubble({
  children,
  meta,
}: {
  children: ReactNode;
  meta: string;
}) {
  return (
    <div className="flex flex-col items-end gap-1">
      <div className="max-w-[min(100%,20rem)] rounded-[1.15rem] bg-[var(--chat-user-bubble)] px-3 py-2 text-[11px] leading-[1.5] text-[var(--text-primary)] sm:max-w-[min(100%,14.5rem)]">
        {children}
      </div>
      <span className="pr-0.5 text-[10px] text-[var(--text-tertiary)]">
        {meta}
      </span>
    </div>
  );
}

export function FileChangeCard({
  count,
  files,
  meta,
}: {
  count: number;
  files: { path: string; add: number; del: number; badge: string }[];
  meta: string;
}) {
  return (
    <div className="min-w-0">
      <div className="overflow-hidden rounded-xl border border-[var(--divide)] bg-[var(--chat-file-card-bg)]">
        <div className="flex items-center justify-between gap-2 border-b border-[var(--divide)] px-2.5 py-1.5">
          <span className="text-[10.5px] font-medium text-[var(--text-primary)]">
            {count} Files changed
          </span>
          <div className="flex shrink-0 items-center gap-1.5">
            <FiChevronDown
              className="size-3.5 text-[var(--text-tertiary)]"
              aria-hidden
            />
            <span className="inline-flex items-center gap-0.5 text-[10px] text-[var(--text-secondary)]">
              <FiCornerUpLeft className="size-3" aria-hidden />
              Undo
            </span>
          </div>
        </div>
        <ul className="divide-y divide-[var(--divide)]">
          {files.map((f) => (
            <li
              key={f.path}
              className="flex items-center gap-2 px-2.5 py-1.5 text-[10px]"
            >
              <LangBadge label={f.badge} />
              <span className="min-w-0 flex-1 truncate font-mono text-[var(--text-primary)]">
                {f.path}
              </span>
              <span className="shrink-0 tabular-nums">
                <span className="text-emerald-600 dark:text-emerald-400">
                  +{f.add}
                </span>{" "}
                <span className="text-red-600 dark:text-red-400">-{f.del}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-1 text-[10px] text-[var(--text-tertiary)]">{meta}</p>
    </div>
  );
}

export function ResponseDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 py-0.5">
      <div className="h-px min-w-[1rem] flex-1 bg-[var(--divide)]" />
      <span className="shrink-0 text-[9.5px] text-[var(--text-tertiary)]">
        {label}
      </span>
      <div className="h-px min-w-[1rem] flex-1 bg-[var(--divide)]" />
    </div>
  );
}

export function ChatColumnChrome({
  icon,
  label,
  composerIcon,
  composerLabel,
  headerEnd,
  belowHeader,
  children,
}: {
  icon: ReactNode;
  label: string;
  composerIcon: ReactNode;
  composerLabel: string;
  headerEnd?: ReactNode;
  belowHeader?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex h-full min-h-[240px] min-w-0 flex-col bg-[var(--chat-feed-bg)] sm:min-h-[320px]">
      <div className="shrink-0 border-b border-[var(--divide)]">
        <div className="flex min-w-0 items-center justify-between gap-2 px-2.5 py-2 text-[10px] text-[var(--text-secondary)]">
          <div className="flex min-w-0 items-center gap-1.5">
            {icon}
            <span className="truncate font-medium text-[var(--text-primary)]">
              {label}
            </span>
          </div>
          {headerEnd}
        </div>
        {belowHeader ? (
          <div className="border-t border-[var(--divide)] px-2.5 pb-2.5 pt-2">
            {belowHeader}
          </div>
        ) : null}
      </div>
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex-1 space-y-3 px-2.5 py-2.5">{children}</div>
        <CompactComposer modelIcon={composerIcon} modelLabel={composerLabel} />
      </div>
    </div>
  );
}

export function CompactComposer({
  modelLabel,
  modelIcon,
}: {
  modelLabel: string;
  modelIcon: ReactNode;
}) {
  return (
    <div className="border-t border-[var(--divide)] bg-[var(--chat-feed-bg)] px-2 pb-2 pt-1.5">
      <div className="flex min-h-[76px] flex-col justify-between gap-1.5 rounded-2xl border border-[var(--divide)] bg-[var(--chat-input-surface)] p-2 sm:min-h-[88px]">
        <p className="px-0.5 pt-0.5 text-[10.5px] leading-snug text-[var(--text-tertiary)] sm:text-[11px]">
          Ask anything, @tag files/folders, or use / for commands
        </p>
        <div className="flex items-center justify-between gap-1">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[10px] text-[var(--text-secondary)] sm:text-[10.5px]">
            <FiPlus className="size-3 shrink-0 text-[var(--text-tertiary)]" />
            <span className="inline-flex max-w-[6.5rem] items-center gap-0.5 truncate px-0.5 py-0.5">
              <span className="shrink-0">{modelIcon}</span>
              <span className="truncate">{modelLabel}</span>
              <FiChevronDown className="size-2.5 shrink-0 text-[var(--text-tertiary)]" />
            </span>
            <span className="inline-flex items-center gap-0.5 px-0.5 py-0.5">
              Low
              <FiChevronDown className="size-2.5 shrink-0 text-[var(--text-tertiary)]" />
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <FiMic
              className="size-3.5 text-[var(--text-tertiary)]"
              aria-hidden
            />
            <span className="flex size-6 items-center justify-center rounded-full bg-[var(--text-primary)] text-[var(--page-bg)] dark:bg-[var(--btn-primary-bg)] dark:text-[var(--btn-primary-fg)]">
              <FiArrowUp className="size-3" aria-hidden />
            </span>
          </div>
        </div>
      </div>
      <div className="mt-1.5 flex items-center justify-between gap-2 px-0.5 text-[9px] text-[var(--text-tertiary)]">
        <div className="flex min-w-0 items-center gap-2">
          <span className="inline-flex shrink-0 items-center gap-0.5">
            Local
            <FiChevronDown className="size-2.5 shrink-0" />
          </span>
          <span className="inline-flex min-w-0 items-center gap-0.5">
            <GoGitBranch className="size-2.5 shrink-0" />
            <span className="truncate">main</span>
            <FiChevronDown className="size-2.5 shrink-0" />
          </span>
        </div>
        <span className="shrink-0 truncate tabular-nums">
          <span className="hidden sm:inline">Full access · </span>36%
        </span>
      </div>
    </div>
  );
}
