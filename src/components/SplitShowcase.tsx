import type { ReactNode } from "react";

type SplitShowcaseProps = {
  eyebrow?: string;
  title: string;
  description: string;
  /** Swap text/mock columns at lg+. Ignored when `stacked` is true. */
  reverse?: boolean;
  /** Force a vertical layout at every breakpoint (text on top, mock full width). */
  stacked?: boolean;
  children: ReactNode;
};

/**
 * Alternating row: copy + elevated mock.
 * - Default: stacked on mobile/tablet, true 50/50 grid at lg+ so wide mocks
 *   (e.g. dual-pane chats) don't collapse the text column.
 * - `stacked`: never splits — text on top, mock at full width across all sizes.
 */
export function SplitShowcase({
  eyebrow,
  title,
  description,
  reverse,
  stacked,
  children,
}: SplitShowcaseProps) {
  const wrapperClass = stacked
    ? "flex flex-col gap-6 py-8 sm:gap-8 sm:py-12"
    : "grid grid-cols-1 gap-6 py-8 sm:gap-10 sm:py-12 lg:grid-cols-2 lg:items-end lg:gap-12 xl:gap-16";

  const textColClass = stacked
    ? "min-w-0"
    : `min-w-0 lg:self-end lg:pb-6 ${reverse ? "lg:order-2" : "lg:order-1"}`;

  const mockOrderClass = stacked
    ? ""
    : reverse
      ? "lg:order-1"
      : "lg:order-2";

  return (
    <div className={wrapperClass}>
      <div className={textColClass}>
        {eyebrow ? (
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
            {eyebrow}
          </p>
        ) : null}
        <h3 className="mt-2 text-[1.35rem] font-medium leading-[1.15] tracking-[-0.035em] text-[var(--text-primary)] sm:text-[1.5rem]">
          {title}
        </h3>
        <p className="mt-3 max-w-2xl text-[15px] leading-[1.65] text-[var(--text-secondary)] sm:text-[16px]">
          {description}
        </p>
      </div>
      <div
        className={`relative flex min-h-0 min-w-0 flex-col ${mockOrderClass}`}
      >
        <div className="relative flex min-h-0 flex-1 flex-col rounded-2xl bg-[var(--block-elevated)] p-3 sm:p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
