// FILE: DownloadButton.tsx
// Purpose: Hero CTA that shows an OS-aware label and sends the visitor to the
//          /install page, where the right build is pre-selected for them.
// Layer: Client component
// Depends on: next/link, src/lib/platform

"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { LuArrowDownToLine } from "react-icons/lu";
import { detectOS, type OS } from "@/lib/platform";

const LABEL: Record<OS, string> = {
  mac: "Download for macOS",
  windows: "Download for Windows",
  linux: "Download for Linux",
  unknown: "Download for your machine",
};

type NavigatorWithUserAgentData = Navigator & {
  userAgentData?: { platform?: string };
};

export default function DownloadButton() {
  const label = useSyncExternalStore(
    () => () => undefined,
    () => {
      const nav = navigator as NavigatorWithUserAgentData;
      return LABEL[
        detectOS(navigator.userAgent, nav.userAgentData?.platform ?? navigator.platform)
      ];
    },
    () => LABEL.mac
  );

  return (
    <Link
      href="/install"
      className="inline-flex items-center gap-2 rounded-full bg-[var(--btn-primary-bg)] px-5 py-2.5 text-[13px] font-medium text-[var(--btn-primary-fg)] transition-opacity hover:opacity-90"
    >
      {label}
      <LuArrowDownToLine className="size-4" aria-hidden="true" />
    </Link>
  );
}
