// FILE: TerminalTabsMock.tsx
// Purpose: Process/terminal showcase image (running threads + terminal).
// Layer: Marketing UI mock
// Note: Framed to match the hero screenshot; the SplitShowcase wrapper supplies
//       the elevated hero-style background behind it.

export function TerminalTabsMock() {
  return (
    <div className="overflow-hidden rounded-lg ring-1 ring-black/5 sm:rounded-xl dark:ring-white/10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/terminals-syn.png"
        alt="Synara Terminal 1 open beside the task workspace with the current project branch prompt visible"
        className="block h-auto w-full"
      />
    </div>
  );
}
