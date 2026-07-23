// FILE: lib/docsLayout.tsx
// Purpose: Shared Fumadocs layout options styled after the site chrome —
//          same wordmark, 13px nav links, pill Download CTA, site theme toggle.
// Layer: docs layout configuration (server-importable).

import Image from "next/image";
import Link from "next/link";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { ThemeToggle } from "@/components/ThemeToggle";

export function docsLayoutOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="flex items-center gap-2 text-[14px] font-medium tracking-[-0.02em] text-[var(--text-primary)]">
          <Image
            src="/synara-icon.png"
            alt=""
            width={22}
            height={22}
            className="rounded-[5px] border border-[var(--divide)]"
          />
          Synara
          <span className="rounded-full border border-[var(--divide)] px-2 py-px text-[11px] font-medium tracking-normal text-[var(--text-tertiary)]">
            Docs
          </span>
        </span>
      ),
      url: "/",
      transparentMode: "none",
    },
    links: [
      { text: "Install", url: "/install" },
      { text: "Changelog", url: "/changelog" },
      {
        type: "custom",
        secondary: true,
        children: <ThemeToggle />,
      },
      {
        type: "custom",
        secondary: true,
        children: (
          <Link
            href="/install"
            className="ms-1 rounded-full border border-[var(--divide)] px-3.5 py-1 text-[12.5px] font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--mock-row)] max-md:hidden"
          >
            Download
          </Link>
        ),
      },
    ],
    themeSwitch: { enabled: false },
  };
}
