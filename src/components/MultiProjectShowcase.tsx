"use client";

import type { ComponentType } from "react";
import Image from "next/image";
import { useState } from "react";
import { IoFolderOutline } from "react-icons/io5";
import { TbTerminal2 } from "react-icons/tb";
import { SiOpenai, SiGooglegemini } from "react-icons/si";
import { ClaudeIcon, OpencodeIcon, WorktreeIcon } from "@/components/BrandIcons";

type GenericIcon = ComponentType<{ className?: string }>;

const sectionHeading =
  "text-[1.35rem] font-medium leading-[1.14] tracking-[-0.03em] text-[var(--text-primary)] sm:text-[1.6rem]";
const sectionBody =
  "mt-3 max-w-xl text-[13px] leading-[1.6] text-[var(--text-secondary)] sm:mt-4 sm:text-[14px]";
const container = "mx-auto w-full max-w-6xl px-4 sm:px-6";

type Thread = {
  title: string;
  Agent: GenericIcon;
  agentColor: string;
  age: string;
  /** Show the worktree fork glyph next to the age (sessions on a branch). */
  worktree?: boolean;
};

type ProjectRow = {
  name: string;
  liveDot: boolean;
  /** Corner tray badge: `public/dpcode-icon.png`. */
  badge: "app" | null;
  threads: Thread[];
};

const projectRows: ProjectRow[] = [
  {
    name: "Remodex",
    liveDot: false,
    badge: null,
    threads: [
      {
        title: "Stripe webhook retries",
        Agent: ClaudeIcon,
        agentColor: "text-[#D97757]",
        age: "35m",
        worktree: true,
      },
      {
        title: "Auth role guard",
        Agent: SiOpenai,
        agentColor: "text-[var(--text-secondary)]",
        age: "2h",
      },
      {
        title: "Pricing page A/B",
        Agent: SiGooglegemini,
        agentColor: "text-[#4C8BF5]",
        age: "4h",
      },
      {
        title: "Refund flow audit",
        Agent: OpencodeIcon,
        agentColor: "text-[var(--text-secondary)]",
        age: "1d",
      },
    ],
  },
  {
    name: "dpcode",
    liveDot: true,
    badge: "app",
    threads: [
      {
        title: "New terminal",
        Agent: TbTerminal2,
        agentColor: "text-teal-500 dark:text-teal-400",
        age: "1h",
      },
      {
        title: "Release Version 0.0.37",
        Agent: SiOpenai,
        agentColor: "text-[var(--text-secondary)]",
        age: "2h",
      },
      {
        title: "Font Update Debug",
        Agent: SiOpenai,
        agentColor: "text-[var(--text-secondary)]",
        age: "2h",
      },
      {
        title: "Move Sidebar Arrows",
        Agent: SiOpenai,
        agentColor: "text-[var(--text-secondary)]",
        age: "3h",
      },
      {
        title: "Validate PR Fix",
        Agent: SiOpenai,
        agentColor: "text-[var(--text-secondary)]",
        age: "4h",
        worktree: true,
      },
    ],
  },
  {
    name: "emanueledipietro",
    liveDot: false,
    badge: null,
    threads: [
      {
        title: "Hero copy v2",
        Agent: ClaudeIcon,
        agentColor: "text-[#D97757]",
        age: "18m",
      },
      {
        title: "About page redesign",
        Agent: SiOpenai,
        agentColor: "text-[var(--text-secondary)]",
        age: "1h",
      },
      {
        title: "Newsletter signup",
        Agent: SiGooglegemini,
        agentColor: "text-[#4C8BF5]",
        age: "2d",
      },
    ],
  },
];

function FolderHeader({
  row,
  isActive,
  onClick,
}: {
  row: ProjectRow;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-expanded={isActive}
      aria-controls={`project-threads-${row.name}`}
      aria-label={`Project ${row.name}`}
      onClick={onClick}
      className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-[var(--block-elevated)] focus-visible:bg-[var(--block-elevated)] focus-visible:outline-none sm:py-2.5 ${
        isActive ? "bg-[var(--block-elevated)]" : ""
      }`}
    >
      <div className="relative flex size-9 shrink-0 items-center justify-center sm:size-10">
        <IoFolderOutline className="size-[1.65rem] shrink-0 text-[var(--text-tertiary)] sm:size-7" />
        {row.liveDot ? (
          <span className="pointer-events-none absolute right-0.5 top-0 size-2 rounded-full border-2 border-[var(--page-bg)] bg-teal-500 dark:bg-teal-400" />
        ) : null}
        {row.badge === "app" ? (
          <span className="pointer-events-none absolute -bottom-0.5 -right-0.5 flex size-[15px] items-center justify-center overflow-hidden rounded-[5px] bg-neutral-950 shadow-sm ring-1 ring-white/15 dark:bg-black">
            <Image
              src="/dpcode-icon.png"
              alt=""
              width={11}
              height={11}
              className="size-[11px] object-cover"
            />
          </span>
        ) : null}
      </div>
      <span className="min-w-0 truncate text-[13px] font-medium text-[var(--text-secondary)] sm:text-[13.5px]">
        {row.name}
      </span>
    </button>
  );
}

/**
 * Threads list nested directly inside an expanded folder row. Reuses the
 * row treatment from `WorktreeMock` (agent badge → title → optional worktree
 * glyph → age) so it visually belongs to the project picker rather than a
 * separate panel. Each thread row is interactive — selection state is local
 * so reopening the drawer always starts from the most recent thread.
 */
function FolderThreads({
  project,
}: {
  project: ProjectRow;
}) {
  const [selectedThread, setSelectedThread] = useState(0);

  return (
    <div
      id={`project-threads-${project.name}`}
      role="listbox"
      aria-label={`${project.name} threads`}
      className="bg-[var(--block-elevated)] px-2 pb-2 pt-0 sm:px-2.5"
    >
      <ul className="space-y-px">
        {project.threads.map(
          ({ title, Agent, agentColor, age, worktree }, index) => {
            const isSelected = index === selectedThread;
            return (
              <li key={title} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => setSelectedThread(index)}
                  className={`flex w-full items-center gap-2.5 rounded-md py-1.5 pl-12 pr-2 text-left transition-colors focus-visible:outline-none ${
                    isSelected
                      ? "bg-[var(--mock-surface)]"
                      : "hover:bg-[var(--mock-surface)] focus-visible:bg-[var(--mock-surface)]"
                  }`}
                >
                  <span className="inline-flex size-[22px] shrink-0 items-center justify-center rounded-full bg-[var(--mock-surface)]">
                    <Agent className={`size-[13px] ${agentColor}`} />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[12px] font-medium text-[var(--text-primary)]">
                    {title}
                  </span>
                  {worktree ? (
                    <WorktreeIcon className="size-3 shrink-0 text-[var(--text-tertiary)]" />
                  ) : null}
                  <span className="w-7 shrink-0 text-right font-mono text-[11px] tabular-nums text-[var(--text-tertiary)]">
                    {age}
                  </span>
                </button>
              </li>
            );
          }
        )}
      </ul>
    </div>
  );
}

function ProjectFolderMock({
  activeRow,
  onSelectRow,
}: {
  activeRow: number;
  onSelectRow: (index: number) => void;
}) {
  return (
    <div className="divide-y divide-[var(--divide)] overflow-hidden rounded-xl border border-[var(--divide)]">
      {projectRows.map((row, index) => {
        const isActive = activeRow === index;
        return (
          <div key={row.name}>
            <FolderHeader
              row={row}
              isActive={isActive}
              onClick={() => onSelectRow(index)}
            />
            {isActive ? <FolderThreads project={row} /> : null}
          </div>
        );
      })}
    </div>
  );
}

export function MultiProjectShowcase() {
  const [selectedFolder, setSelectedFolder] = useState(0);

  return (
    <section className="border-t border-[var(--divide)] py-12 sm:py-20">
      <div className={container}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-end lg:gap-10 xl:gap-14">
          <div className="min-w-0 lg:self-end lg:pb-6">
            <h2 className={sectionHeading}>
              Work across projects at the same time.
            </h2>
            <p className={sectionBody}>
              Juggle client work, your product, and experiments without a dozen
              windows. One sidebar keeps every codebase a click away—each with
              its own agents, runs, and state.
            </p>
          </div>

          <div className="relative min-w-0 lg:self-end">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
              Projects
            </p>
            <div className="mt-2">
              <ProjectFolderMock
                activeRow={selectedFolder}
                onSelectRow={setSelectedFolder}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
