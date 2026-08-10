// FILE: OneClickPrMock.tsx
// Purpose: One-click PR showcase image (Git actions menu).
// Layer: Marketing UI mock
// Note: Framed to match the hero screenshot; the SplitShowcase wrapper supplies
//       the elevated hero-style background behind it.

export function OneClickPrMock() {
  return (
    <div className="overflow-hidden rounded-lg ring-1 ring-black/5 sm:rounded-xl dark:ring-white/10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/git-syn.png"
        alt="Synara's Commit and Push menu with commit, pull, push, Create PR, and Create Branch actions"
        className="block h-auto w-full"
      />
    </div>
  );
}
