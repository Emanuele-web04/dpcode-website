"use client";

import Image from "next/image";
import { useState } from "react";
import { IoFolderOutline } from "react-icons/io5";

/** Slightly tighter than global Features heading so this block reads lighter. */
const sectionHeading =
  "text-[1.35rem] font-medium leading-[1.14] tracking-[-0.03em] text-[var(--text-primary)] sm:text-[1.6rem]";
const sectionBody =
  "mt-3 max-w-xl text-[13px] leading-[1.6] text-[var(--text-secondary)] sm:mt-4 sm:text-[14px]";
const container = "mx-auto w-full max-w-7xl px-4 sm:px-6";

const steps: { title: string; description: string }[] = [
  {
    title: "Stack every repo",
    description:
      "Add each folder once. DP Code keeps agents, threads, and worktrees scoped per project—no crossed wires.",
  },
  {
    title: "Read status at a glance",
    description:
      "Live dots and provider badges show what’s running where. Skip the tab archaeology.",
  },
  {
    title: "Switch without losing your place",
    description:
      "Jump between clients, products, or side work in one click. Every thread picks up exactly where you stopped.",
  },
];

type ProjectRow = {
  name: string;
  liveDot: boolean;
  /** Corner tray badge: `public/dpcode-icon.png`. */
  badge: "app" | null;
};

const projectRows: ProjectRow[] = [
  { name: "Remodex", liveDot: false, badge: null },
  { name: "dpcode", liveDot: true, badge: "app" },
  { name: "emanueledipietro", liveDot: false, badge: null },
];

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
          <button
            key={row.name}
            type="button"
            aria-pressed={isActive}
            aria-label={`Project ${row.name}`}
            onClick={() => onSelectRow(index)}
            className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors sm:py-2.5 ${
              isActive
                ? "bg-[var(--mock-row-strong)]"
                : "hover:bg-[var(--mock-row)] focus-visible:bg-[var(--mock-row)] focus-visible:outline-none"
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
      })}
    </div>
  );
}

export function MultiProjectShowcase() {
  /** Copy / product points — unrelated to the folder picker. */
  const [activeStep, setActiveStep] = useState(0);
  /** Folder list selection only. */
  const [selectedFolder, setSelectedFolder] = useState(0);
  const detailId = "multi-project-step-detail";

  return (
    <section className="border-t border-[var(--divide)] py-12 sm:py-20">
      <div className={container}>
        <h2 className={sectionHeading}>Work across projects at the same time.</h2>
        <p className={sectionBody}>
          Juggle client work, your product, and experiments without a dozen
          windows. One sidebar keeps every codebase a click away—each with its
          own agents, runs, and state.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:mt-8 lg:grid-cols-2 lg:items-start lg:gap-10 xl:gap-14">
          <div className="min-w-0 self-start">
            {/* Mobile: vertical stack, title + short body per step */}
            <ol
              className="flex flex-col gap-1.5 sm:hidden"
              aria-label="Tips for multi-project workflows"
            >
              {steps.map((step, index) => {
                const isSelected = activeStep === index;
                return (
                  <li key={step.title}>
                    <button
                      type="button"
                      aria-pressed={isSelected}
                      aria-label={`${index + 1}. ${step.title}`}
                      onClick={() => setActiveStep(index)}
                      className={`flex w-full gap-2.5 rounded-lg border px-2.5 py-2 text-left transition-colors ${
                        isSelected
                          ? "border-[var(--divide)] bg-[var(--mock-row)]"
                          : "border-transparent hover:bg-[var(--mock-row)]"
                      } `}
                    >
                      <span
                        className={`flex size-7 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-medium tabular-nums ${
                          isSelected
                            ? "bg-[var(--block-elevated)] text-[var(--text-primary)]"
                            : "bg-[var(--block-elevated)] text-[var(--text-tertiary)]"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[13px] font-medium leading-tight text-[var(--text-primary)]">
                          {step.title}
                        </span>
                        <span className="mt-0.5 block text-[12px] leading-snug text-[var(--text-secondary)]">
                          {step.description}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>

            {/* sm+: single horizontal row of titles; detail line below */}
            <div className="hidden sm:block">
              <ol
                className="flex flex-row flex-wrap gap-1.5"
                aria-label="Tips for multi-project workflows"
              >
                {steps.map((step, index) => {
                  const isSelected = activeStep === index;
                  return (
                    <li key={step.title} className="min-w-0">
                      <button
                        type="button"
                        aria-pressed={isSelected}
                        aria-describedby={isSelected ? detailId : undefined}
                        aria-label={`Step ${index + 1}: ${step.title}`}
                        onClick={() => setActiveStep(index)}
                        onMouseEnter={() => setActiveStep(index)}
                        className={`inline-flex max-w-full items-center gap-1.5 rounded-full border py-1 pl-1 pr-2.5 text-left text-[11px] font-medium transition-colors sm:py-1.5 sm:pl-1.5 sm:pr-3 sm:text-[12px] ${
                          isSelected
                            ? "border-[var(--divide)] bg-[var(--mock-row)] text-[var(--text-primary)]"
                            : "border-transparent text-[var(--text-secondary)] hover:bg-[var(--mock-row)] hover:text-[var(--text-primary)]"
                        } `}
                      >
                        <span
                          className={`flex size-5 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-medium tabular-nums sm:size-6 sm:text-[11px] ${
                            isSelected
                              ? "bg-[var(--block-elevated)] text-[var(--text-primary)]"
                              : "bg-[var(--block-elevated)] text-[var(--text-tertiary)]"
                          }`}
                        >
                          {index + 1}
                        </span>
                        <span className="min-w-0 truncate">{step.title}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>
              <p
                id={detailId}
                key={activeStep}
                className="mt-2.5 text-[12px] leading-snug text-[var(--text-secondary)] sm:text-[13px]"
              >
                {steps[activeStep].description}
              </p>
            </div>
          </div>

          <div className="relative min-w-0">
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
