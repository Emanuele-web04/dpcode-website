// FILE: lib/useActiveAnchor.ts
// Purpose: Shared scroll-spy for the changelog surfaces — tracks which release
//          section is currently in view so the right-rail (ChangelogNav) and the
//          mobile dropdown (ChangelogPicker) stay in sync without duplicating
//          the IntersectionObserver wiring.
// Layer: Client hook.

"use client";

import { useEffect, useState } from "react";

export interface ChangelogNavItem {
  readonly version: string;
  readonly date: string;
  readonly anchor: string;
}

/**
 * Returns the anchor of the release whose section is currently near the top of
 * the viewport, plus a setter so consumers can mark a target active immediately
 * on click. `items` must be a stable reference (it is — the server page builds
 * it once), so the observer is wired up a single time.
 */
export function useActiveAnchor(items: readonly ChangelogNavItem[]) {
  const [active, setActive] = useState<string | null>(items[0]?.anchor ?? null);

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.anchor))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-100px 0px -66% 0px", threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  return { active, setActive };
}
