"use client";

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

export default function DownloadButton() {
  const label = useSyncExternalStore(
    () => () => undefined,
    () => {
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
      className="inline-flex items-center gap-2 rounded-full bg-[var(--btn-primary-bg)] px-5 py-2.5 text-[13px] font-medium text-[var(--btn-primary-fg)] transition-opacity hover:opacity-90"
    >
      {label}
      <HiOutlineDownload className="size-4" aria-hidden="true" />
    </a>
  );
}
