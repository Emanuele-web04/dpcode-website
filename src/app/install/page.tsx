// FILE: install/page.tsx
// Purpose: Dedicated download page — auto-detects the visitor's OS and offers the
//          macOS / Windows / Linux installers for the latest release.
// Layer: App Router page
// Depends on: Navbar, SiteFooter, InstallOptions, getReleaseDownloads

import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import InstallOptions from "@/components/InstallOptions";
import { getReleaseDownloads } from "@/lib/releases";

export const metadata: Metadata = {
  title: "Download Synara — macOS, Windows & Linux",
  description:
    "Download Synara for macOS, Windows, or Linux. The best way to code with the AI subscriptions you already pay for.",
};

// Release artifacts change rarely; rebuild this route at most every 30 minutes.
export const revalidate = 1800;

export default async function InstallPage() {
  const downloads = await getReleaseDownloads();

  return (
    <div className="flex min-h-screen flex-col bg-[var(--page-bg)] text-[var(--text-primary)]">
      <Navbar />

      <section className="pt-8 pb-16 sm:pt-12 sm:pb-24">
        <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
          <h1 className="text-[1.5rem] font-medium leading-[1.12] tracking-[-0.035em] text-[var(--text-primary)] sm:text-[2rem] sm:leading-[1.08]">
            Download Synara
          </h1>
          <p className="mt-4 max-w-xl text-[13px] leading-[1.6] text-[var(--text-secondary)] sm:text-[14px]">
            Get the desktop app for your machine. Free, native, and built to make
            you extraordinarily productive with the AI subscriptions you already
            pay for.
          </p>

          <div className="mt-10">
            <InstallOptions downloads={downloads} />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
