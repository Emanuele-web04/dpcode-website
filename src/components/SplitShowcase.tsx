import type { ReactNode } from "react";

type SplitShowcaseProps = {
  eyebrow?: string;
  title: string;
  description: string;
  /** Swap text/mock columns at lg+. */
  reverse?: boolean;
  children: ReactNode;
};

/**
 * Alternating row: copy + elevated mock.
 * Mobile/tablet: stacked column (mock at full width).
 * Desktop (lg+): true 50/50 grid so wide mocks (e.g. dual-pane chats) don't
 * collapse the text column. `minmax(0, 1fr)` (Tailwind grid-cols-2) lets the
 * mock shrink past its intrinsic min-content, which `flex-1` could not.
 */
export function SplitShowcase({
  eyebrow,
  title,
  description,
  reverse,
  children,
}: SplitShowcaseProps) {
  return (
    <div className="grid grid-cols-1 gap-6 py-8 sm:gap-10 sm:py-12 lg:grid-cols-2 lg:items-start lg:gap-12 xl:gap-16">
      <div
        className={`min-w-0 self-start ${reverse ? "lg:order-2" : "lg:order-1"}`}
      >
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
      <div
        className={`relative flex min-h-0 min-w-0 flex-col ${
          reverse ? "lg:order-1" : "lg:order-2"
        }`}
      >
        <div className="relative flex min-h-0 flex-1 flex-col rounded-2xl bg-[var(--block-elevated)] p-3 sm:p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
