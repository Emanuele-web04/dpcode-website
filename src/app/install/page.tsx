// FILE: install/page.tsx
// Purpose: Dedicated download page — auto-detects the visitor's OS and offers the
//          macOS / Windows / Linux installers for the latest release.
// Layer: App Router page
// Depends on: Navbar, SiteFooter, InstallOptions, getReleaseDownloads

import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import InstallOptions from "@/components/InstallOptions";
import { getReleaseDownloads } from "@/lib/releases";
import { getStoredInstallerCount } from "@/lib/installerCount";
import {
  INSTALL_JSONLD,
  breadcrumbJsonLd,
  jsonLdScript,
  pageMetadata,
} from "@/lib/seo";

const INSTALL_PAGE_JSONLD = [
  INSTALL_JSONLD,
  breadcrumbJsonLd([
    { name: "Synara", path: "/" },
    { name: "Download", path: "/install" },
  ]),
];

export const metadata = pageMetadata({
  title: "Download Synara — AI Coding Workspace for macOS, Windows & Linux",
  description:
    "Download Synara for macOS, Windows, or Linux — a free, open-source AI coding workspace for Claude Code, Codex, Droid, Cursor, and more.",
  path: "/install",
});

// Release artifacts change rarely; rebuild this route at most every 30 minutes.
export const revalidate = 1800;

export default async function InstallPage() {
  // Seed with the stored snapshot so the page stays static (ISR); InstallerCount
  // refreshes to the live total client-side once it mounts.
  const [downloads, installerCount] = [
    await getReleaseDownloads(),
    getStoredInstallerCount(),
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[var(--page-bg)] text-[var(--text-primary)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(INSTALL_PAGE_JSONLD) }}
      />
      <Navbar />

      <section className="pt-10 pb-16 sm:pt-16 sm:pb-24">
        <div className="mx-auto w-full max-w-4xl px-4 text-center sm:px-6">
          <h1 className="text-[1.5rem] font-medium leading-[1.12] tracking-[-0.035em] text-[var(--text-primary)] sm:text-[2rem] sm:leading-[1.08]">
            Download Synara
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[13px] leading-[1.6] text-[var(--text-secondary)] sm:text-[14px]">
            Get the desktop app for your machine. Free, native, and built to make
            you extraordinarily productive with the AI subscriptions you already
            pay for.
          </p>

          <div className="mt-12">
            <InstallOptions
              downloads={downloads}
              installerCount={installerCount}
            />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
