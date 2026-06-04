// FILE: InstallOptions.tsx
// Purpose: Renders the three platform download cards (macOS / Windows / Linux),
//          detects the visitor's OS to highlight the recommended one, and lets
//          Mac users switch between the Apple Silicon and Intel builds.
// Layer: Client component
// Depends on: src/lib/platform, src/lib/releases (ReleaseDownloads type)

"use client";

import { useState, useSyncExternalStore, type ReactNode } from "react";
import { FaApple, FaWindows, FaLinux } from "react-icons/fa";
import { LuArrowDownToLine, LuCheck } from "react-icons/lu";
import {
  detectCurrentOS,
  detectMacArch,
  type MacArch,
  type OS,
} from "@/lib/platform";
import type { ReleaseDownloads } from "@/lib/releases";

const OS_LABEL: Record<Exclude<OS, "unknown">, string> = {
  mac: "macOS",
  windows: "Windows",
  linux: "Linux",
};

// Detection is a one-time, client-only browser read, so we expose it through
// useSyncExternalStore (like DownloadButton) instead of a setState-in-effect.
// Results are memoized at module scope so the WebGL probe runs at most once.
const subscribe = () => () => {};

let cachedOS: OS | undefined;
function getOSSnapshot(): OS {
  if (cachedOS === undefined) cachedOS = detectCurrentOS();
  return cachedOS;
}

let cachedArch: MacArch | undefined;
function getArchSnapshot(): MacArch {
  if (cachedArch === undefined) cachedArch = detectMacArch();
  return cachedArch;
}

export default function InstallOptions({
  downloads,
}: {
  downloads: ReleaseDownloads;
}) {
  // "unknown"/"arm64" during SSR + first client render, then the real values.
  const os = useSyncExternalStore<OS>(subscribe, getOSSnapshot, () => "unknown");
  const detectedArch = useSyncExternalStore(
    subscribe,
    getArchSnapshot,
    () => "arm64" as MacArch
  );

  // User can override the detected Mac architecture via the toggle.
  const [archOverride, setArchOverride] = useState<MacArch | null>(null);
  const arch = archOverride ?? detectedArch;

  const macHref = arch === "arm64" ? downloads.mac.arm64 : downloads.mac.x64;

  return (
    <div>
      <p className="mb-5 min-h-[18px] text-[12px] text-[var(--text-tertiary)]">
        {os !== "unknown" ? (
          <>
            Detected{" "}
            <span className="text-[var(--text-secondary)]">{OS_LABEL[os]}</span>{" "}
            — recommended option highlighted below.
          </>
        ) : (
          "Pick your platform to download the latest build."
        )}
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        <PlatformCard
          icon={<FaApple className="size-6" aria-hidden="true" />}
          name="macOS"
          subtitle=".dmg · Apple Silicon & Intel"
          href={macHref}
          recommended={os === "mac"}
        >
          <ArchToggle arch={arch} onChange={setArchOverride} />
        </PlatformCard>

        <PlatformCard
          icon={<FaWindows className="size-[22px]" aria-hidden="true" />}
          name="Windows"
          subtitle=".exe installer · 64-bit"
          href={downloads.windows}
          recommended={os === "windows"}
        />

        <PlatformCard
          icon={<FaLinux className="size-6" aria-hidden="true" />}
          name="Linux"
          subtitle=".AppImage · x86_64"
          href={downloads.linux}
          recommended={os === "linux"}
        />
      </div>

      <p className="mt-6 text-[12px] leading-[1.6] text-[var(--text-tertiary)]">
        {downloads.version ? `Latest release ${downloads.version}. ` : ""}
        Looking for an older version or the checksums?{" "}
        <a
          href={downloads.releasesUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--accent-link)] transition-colors hover:text-[var(--accent-link-hover)]"
        >
          Browse all releases
        </a>
        .
      </p>
    </div>
  );
}

function PlatformCard({
  icon,
  name,
  subtitle,
  href,
  recommended,
  children,
}: {
  icon: ReactNode;
  name: string;
  subtitle: string;
  href: string;
  recommended: boolean;
  children?: ReactNode;
}) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border bg-[var(--block-elevated)] p-5 transition-colors ${
        recommended
          ? "border-[var(--accent-link)]/40 ring-1 ring-[var(--accent-link)]/30"
          : "border-[var(--divide)]"
      }`}
    >
      {recommended ? (
        <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-[var(--accent-link)]/12 px-2 py-0.5 text-[10.5px] font-medium text-[var(--accent-link)]">
          <LuCheck className="size-3" aria-hidden="true" />
          For your device
        </span>
      ) : null}

      <span className="text-[var(--text-primary)]">{icon}</span>

      <h3 className="mt-3 text-[15px] font-medium tracking-[-0.02em] text-[var(--text-primary)]">
        {name}
      </h3>
      <p className="mt-1 text-[12px] text-[var(--text-tertiary)]">{subtitle}</p>

      {children ? <div className="mt-4">{children}</div> : null}

      <a
        href={href}
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--btn-primary-bg)] px-4 py-2 text-[13px] font-medium text-[var(--btn-primary-fg)] transition-opacity hover:opacity-90"
      >
        Download
        <LuArrowDownToLine className="size-4" aria-hidden="true" />
      </a>
    </div>
  );
}

function ArchToggle({
  arch,
  onChange,
}: {
  arch: MacArch;
  onChange: (arch: MacArch) => void;
}) {
  return (
    <div
      className="inline-flex rounded-lg border border-[var(--divide)] p-0.5 text-[12px]"
      role="group"
      aria-label="macOS chip"
    >
      {(["arm64", "x64"] as const).map((value) => {
        const active = arch === value;
        return (
          <button
            key={value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(value)}
            className={`rounded-[6px] px-2.5 py-1 font-medium transition-colors ${
              active
                ? "bg-[var(--btn-primary-bg)] text-[var(--btn-primary-fg)]"
                : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
            }`}
          >
            {value === "arm64" ? "Apple Silicon" : "Intel"}
          </button>
        );
      })}
    </div>
  );
}
