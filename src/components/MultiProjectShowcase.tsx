"use client";

import Image from "next/image";
import { useState } from "react";
import { IoFolderOutline } from "react-icons/io5";

/** Slightly tighter than global Features heading so this block reads lighter. */
const sectionHeading =
  "text-[1.35rem] font-medium leading-[1.14] tracking-[-0.03em] text-[var(--text-primary)] sm:text-[1.6rem]";
const sectionBody =
  "mt-3 max-w-xl text-[13px] leading-[1.6] text-[var(--text-secondary)] sm:mt-4 sm:text-[14px]";
const container = "mx-auto w-full max-w-6xl px-4 sm:px-6";

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
