// FILE: page.tsx
// Purpose: Renders the homepage and its canonical product positioning.
// Layer: App Router page

import Link from "next/link";
import { SiGithub } from "react-icons/si";
import Navbar from "@/components/Navbar";
import DownloadButton from "@/components/DownloadButton";
import InstallerCount from "@/components/InstallerCount";
import ProviderMarkRow from "@/components/ProviderMarkRow";
import Features from "@/components/Features";
import Workflow from "@/components/Workflow";
import FAQ from "@/components/FAQ";
import Testimonials from "@/components/Testimonials";
import ClosingCTA from "@/components/ClosingCTA";
import PrivacySection from "@/components/PrivacySection";
import SiteFooter from "@/components/SiteFooter";
import {
  PRODUCT_CATEGORY,
  PRODUCT_HERO_DESCRIPTION,
  PRODUCT_HERO_TITLE,
} from "@/data/product";
import { getInstallerCount } from "@/lib/installerCount";
import {
  FAQ_JSONLD,
  GITHUB_REPO_URL,
  breadcrumbJsonLd,
  jsonLdScript,
} from "@/lib/seo";

const HOME_JSONLD = [
  FAQ_JSONLD,
  breadcrumbJsonLd([{ name: "Synara", path: "/" }]),
];

export const dynamic = "force-dynamic";

export default async function Home() {
  const initialInstallerCount = await getInstallerCount();

  return (
    <div className="flex min-h-screen flex-col bg-[var(--page-bg)] text-[var(--text-primary)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(HOME_JSONLD) }}
      />
      <div className="relative">
        <Navbar />

        <section className="pt-8 pb-12 sm:pt-14 sm:pb-20">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <div className="mb-8 sm:mb-10">
              <ProviderMarkRow />
            </div>

            <p className="font-mono text-[11px] uppercase tracking-[0.13em] text-[var(--text-tertiary)]">
              {PRODUCT_CATEGORY}
            </p>
            <h1 className="mt-4 max-w-4xl text-[2.35rem] font-medium leading-[1.02] tracking-[-0.052em] text-[var(--text-primary)] sm:text-[4rem] sm:leading-[0.98]">
              {PRODUCT_HERO_TITLE}
            </h1>
            <p className="mt-6 max-w-3xl text-[15px] leading-[1.7] text-[var(--text-secondary)] sm:text-[18px] sm:leading-[1.65]">
              {PRODUCT_HERO_DESCRIPTION}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <DownloadButton />
              <Link
                href="/docs"
                className="inline-flex items-center rounded-full border border-[var(--divide)] px-5 py-2.5 text-[13px] font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--mock-row)]"
              >
                Read the docs
              </Link>
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
              >
                <SiGithub className="size-4 shrink-0" aria-hidden="true" />
                GitHub
              </a>
            </div>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-[var(--text-tertiary)]">
              <span>Free and open source</span>
              <span>macOS, Windows, and Linux</span>
              <span>No Synara account required</span>
              <InstallerCount initialCount={initialInstallerCount} />
            </div>

            <div className="relative mt-10 sm:mt-16">
              <div className="relative overflow-hidden rounded-xl bg-[var(--block-elevated)] p-2 ring-1 ring-black/5 sm:rounded-2xl sm:p-3 dark:ring-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/dpcode-ui-light.png"
                  alt="Synara workspace with coding-agent tasks, terminals, browser verification, diffs, and Git worktrees"
                  className="block h-auto w-full rounded-lg dark:hidden sm:rounded-xl"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/dpcode-ui-dark.png"
                  alt="Synara workspace with coding-agent tasks, terminals, browser verification, diffs, and Git worktrees"
                  className="hidden h-auto w-full rounded-lg dark:block sm:rounded-xl"
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      <Features />
      <Workflow />
      <PrivacySection />
      <FAQ />
      <Testimonials />
      <ClosingCTA initialInstallerCount={initialInstallerCount} />
      <SiteFooter />
    </div>
  );
}
