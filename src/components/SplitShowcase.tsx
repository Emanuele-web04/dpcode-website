import type { ReactNode } from "react";

type SplitShowcaseProps = {
  eyebrow?: string;
  title: string;
  description: string;
  reverse?: boolean;
  children: ReactNode;
};

/** Alternating row: copy on page canvas + elevated block (Cursor-style surface, not a bordered card). */
export function SplitShowcase({
  eyebrow,
  title,
  description,
  reverse,
  children,
}: SplitShowcaseProps) {
  return (
    <div
      className={`flex flex-col gap-6 py-8 sm:gap-10 sm:py-12 lg:flex-row lg:items-stretch lg:gap-16 xl:gap-24 ${
        reverse ? "lg:flex-row-reverse" : ""
      }`}
    >
      <div className="max-w-[min(100%,26rem)] shrink-0 self-start lg:w-[40%] xl:w-[38%]">
        {eyebrow ? (
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
            {eyebrow}
          </p>
        ) : null}
        <h3 className="mt-2 text-[1.35rem] font-medium leading-[1.15] tracking-[-0.035em] text-[var(--text-primary)] sm:text-[1.5rem]">
          {title}
        </h3>
        <p className="mt-3 text-[15px] leading-[1.65] text-[var(--text-secondary)] sm:text-[16px]">
          {description}
        </p>
      </div>
      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="relative flex min-h-0 flex-1 flex-col rounded-2xl bg-[var(--block-elevated)] p-3 sm:p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
