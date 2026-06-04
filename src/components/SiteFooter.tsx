// FILE: SiteFooter.tsx
// Purpose: Shared page footer (credits + attribution) used across routes.
// Layer: Presentational component
// Depends on: design tokens in globals.css

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--divide)] py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 text-[12px] text-[var(--text-tertiary)] sm:flex-row sm:items-center sm:justify-between sm:gap-0 sm:px-6">
        <span>
          Made by{" "}
          <a
            href="https://x.com/emanueledpt"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent-link)] transition-colors hover:text-[var(--accent-link-hover)]"
          >
            @emanueledpt
          </a>
        </span>
        <span>
          Based on{" "}
          <a
            href="https://github.com/pingdotgg/t3code"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent-link)] transition-colors hover:text-[var(--accent-link-hover)]"
          >
            T3 Code
          </a>
        </span>
      </div>
    </footer>
  );
}
