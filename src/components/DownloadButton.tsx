"use client";

// FILE: DownloadButton.tsx
// Purpose: Renders the hero download CTA and adapts its label to the visitor's OS.
// Layer: Client component
// Depends on: React browser APIs for platform detection

import { useSyncExternalStore } from "react";
import { HiOutlineDownload } from "react-icons/hi";

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

type Variant = "default" | "light";

export default function DownloadButton({ variant = "default" }: { variant?: Variant } = {}) {
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

  const variantClass =
    variant === "light"
      ? "bg-white text-neutral-900 hover:bg-neutral-100"
      : "bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100";

  return (
    <a
      href={RELEASES_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-medium transition-colors ${variantClass}`}
    >
      {label}
      <HiOutlineDownload className="size-4" aria-hidden="true" />
    </a>
  );
}
