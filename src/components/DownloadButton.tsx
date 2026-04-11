"use client";

// FILE: DownloadButton.tsx
// Purpose: Renders the hero download CTA and adapts its label to the visitor's OS.
// Layer: Client component
// Depends on: React browser APIs for platform detection

import { useSyncExternalStore } from "react";

const RELEASES_URL = "https://github.com/Emanuele-web04/dpcode/releases";
type NavigatorWithUserAgentData = Navigator & {
  userAgentData?: {
    platform?: string;
  };
};

function getDownloadLabel(userAgent: string, platform: string): string {
  const fingerprint = `${userAgent} ${platform}`.toLowerCase();

  if (fingerprint.includes("mac")) return "Download for macOS";
  if (fingerprint.includes("win")) return "Download for Windows";
  if (fingerprint.includes("linux")) return "Download for Linux";

  return "Download for your machine";
}

export default function DownloadButton() {
  const label = useSyncExternalStore(
    () => () => undefined,
    () => {
      // Prefer browser signals so the CTA reflects the visitor's device after hydration.
      const navigatorWithUserAgentData = navigator as NavigatorWithUserAgentData;
      return getDownloadLabel(
        navigator.userAgent,
        navigatorWithUserAgentData.userAgentData?.platform ?? navigator.platform
      );
    },
    () => "Download for macOS"
  );

  return (
    <a
      href={RELEASES_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="ml-3 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
    >
      {label}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    </a>
  );
}
