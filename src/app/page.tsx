// FILE: page.tsx
// Purpose: Renders the homepage and its canonical product positioning.
// Layer: App Router page

import Link from "next/link";
import { SiGithub } from "react-icons/si";
import Navbar from "@/components/Navbar";
import DownloadButton from "@/components/DownloadButton";
import InstallerCount from "@/components/InstallerCount";
import ProviderMarkRow from "@/components/ProviderMarkRow";
import ThemeAwareImage from "@/components/ThemeAwareImage";
import ControlPlanePath from "@/components/ControlPlanePath";
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

        <main id="main-content">
          <section className="hero-section pb-12 pt-7 sm:pb-20 sm:pt-12">
            <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-center lg:gap-12 xl:gap-16">
              <div className="min-w-0">
                <div className="mb-7 flex items-center justify-between gap-4 sm:mb-9">
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
                    Supported coding-agent runtimes
                  </p>
                  <span className="font-mono text-[10px] tabular-nums text-[var(--text-tertiary)]">
                    09 supported
                  </span>
                </div>
                <ProviderMarkRow />

                <p className="mt-8 max-w-xl font-mono text-[11px] uppercase tracking-[0.13em] text-[var(--text-tertiary)] sm:mt-10">
                  {PRODUCT_CATEGORY}
                </p>
                <h1 className="mt-4 max-w-2xl text-[2.65rem] font-medium leading-[0.98] tracking-[-0.058em] text-[var(--text-primary)] sm:text-[4.5rem] sm:leading-[0.95]">
                  {PRODUCT_HERO_TITLE}
                </h1>
                <p className="mt-6 max-w-xl text-[15px] leading-[1.7] text-[var(--text-secondary)] sm:text-[17px] sm:leading-[1.65]">
                  {PRODUCT_HERO_DESCRIPTION}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3 sm:mt-9">
                  <DownloadButton />
                  <Link
                    href="/docs"
                    className="inline-flex items-center rounded-full border border-[var(--divide)] px-5 py-2.5 text-[13px] font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--mock-row)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-link)]"
                  >
                    Read the docs
                  </Link>
                  <a
                    href={GITHUB_REPO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full px-3 py-2.5 text-[13px] font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-link)]"
                  >
                    <SiGithub className="size-4 shrink-0" aria-hidden="true" />
                    GitHub
                  </a>
                </div>
                <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-[12px] text-[var(--text-tertiary)]">
                  <span>Free and open source</span>
                  <span>macOS, Windows, and Linux</span>
                  <span>No Synara account required</span>
                  <InstallerCount initialCount={initialInstallerCount} />
                </div>
              </div>

              <figure className="hero-preview relative min-w-0">
                <div className="hero-preview__chrome flex items-center justify-between gap-3 border-b border-[var(--divide)] px-3 py-2.5 text-[10px] text-[var(--text-tertiary)] sm:px-4">
                  <span className="flex items-center gap-2 font-mono uppercase tracking-[0.12em]">
                    <span className="size-1.5 rounded-full bg-[var(--accent-link)]" aria-hidden="true" />
                    Local workspace
                  </span>
                  <span className="font-mono">task / environment / evidence</span>
                </div>
                <div className="overflow-hidden bg-[var(--block-elevated)] p-2 sm:p-3">
                  <ThemeAwareImage
                    lightSrc="/dpcode-ui-light.png"
                    darkSrc="/dpcode-ui-dark.png"
                    alt="Synara workspace with coding-agent tasks, terminals, browser verification, diffs, and Git worktrees"
                    width={3216}
                    height={2090}
                    priority
                    className="block h-auto w-full rounded-lg ring-1 ring-black/5 dark:ring-white/10 sm:rounded-xl"
                  />
                </div>
                <figcaption className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-[var(--divide)] px-3 py-2.5 text-[10px] font-mono uppercase tracking-[0.1em] text-[var(--text-tertiary)] sm:px-4">
                  <span>one task / one environment</span>
                  <span>diff · checks · pull request</span>
                </figcaption>
              </figure>
            </div>
          </section>
          <ControlPlanePath />
          <Features />
          <Workflow />
          <PrivacySection />
          <FAQ />
          <Testimonials />
          <ClosingCTA initialInstallerCount={initialInstallerCount} />
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
