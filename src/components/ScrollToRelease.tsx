// FILE: ScrollToRelease.tsx
// Purpose: On the per-version route (/changelog/v0.1.1), bring the targeted
//          release into view after mount. The full changelog still renders, so
//          this just deep-links to the right section. Uses "auto" (instant) so a
//          shared link lands on the release immediately rather than animating a
//          long scroll from the top.
// Layer: Client component (effect-only, renders nothing).

"use client";

import { useEffect } from "react";

export default function ScrollToRelease({ anchor }: { anchor: string }) {
  useEffect(() => {
    const target = document.getElementById(anchor);
    if (!target) return;
    // Defer one frame so layout (sticky header, fonts) has settled.
    const id = window.requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "auto", block: "start" });
    });
    return () => window.cancelAnimationFrame(id);
  }, [anchor]);

  return null;
}
