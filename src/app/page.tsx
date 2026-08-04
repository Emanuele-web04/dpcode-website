// FILE: page.tsx
// Purpose: Public marketing homepage for Synara.
// Layer: App Router page (server component)

import Image from "next/image";
import Link from "next/link";
import { SiGithub } from "react-icons/si";
import Navbar from "@/components/Navbar";
import DownloadButton from "@/components/DownloadButton";
import InstallerCount from "@/components/InstallerCount";
import Features from "@/components/Features";
import Workflow from "@/components/Workflow";
import FAQ from "@/components/FAQ";
import Testimonials from "@/components/Testimonials";
import ClosingCTA from "@/components/ClosingCTA";
import SiteFooter from "@/components/SiteFooter";
import PrivacySection from "@/components/PrivacySection";
import HomepageRail from "@/components/HomepageRail";
import { getInstallerCount } from "@/lib/installerCount";
import {
  PRODUCT_HERO_DESCRIPTION,
  PRODUCT_HERO_TITLE,
} from "@/data/product";
import { FAQ_JSONLD, GITHUB_REPO_URL, jsonLdScript } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function Home() {
  const installerCount = await getInstallerCount();

  return (
    <div className="min-h-screen overflow-x-clip bg-[var(--page-bg)] text-[var(--text-primary)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(FAQ_JSONLD) }}
      />
      <Navbar />

      <main>
        <section
          id="overview"
          aria-labelledby="homepage-title"
          className="hero-section scroll-mt-20 pb-16 pt-10 sm:pb-24 sm:pt-16 lg:pt-20"
        >
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <div className="max-w-3xl">
              <h1
                id="homepage-title"
                className="max-w-[15ch] text-[clamp(2.65rem,6.2vw,4.75rem)] font-semibold leading-[0.99] tracking-[-0.055em] text-[var(--text-primary)]"
              >
                {PRODUCT_HERO_TITLE}
              </h1>
              <p className="mt-6 max-w-2xl text-[16px] leading-[1.65] text-[var(--text-secondary)] sm:text-[18px]">
                {PRODUCT_HERO_DESCRIPTION}
              </p>

              <div className="mt-8 w-full max-w-[33rem]" data-home-actions>
                <div className="grid grid-cols-2 gap-3">
                  <DownloadButton className="h-11 w-full min-w-0 px-3 sm:px-5" />
                  <Link
                    href="/docs"
                    className="inline-flex h-11 w-full items-center justify-center rounded-full border border-[var(--border-strong)] px-3 text-[13px] font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--mock-row)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-link)] sm:px-5"
                  >
                    Read the docs
                  </Link>
                </div>
                <a
                  href={GITHUB_REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-[var(--divide)] px-5 text-[13px] font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--mock-row)] hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-link)]"
                >
                  <SiGithub className="size-4" aria-hidden="true" />
                  View Synara on GitHub
                </a>
              </div>
            </div>

            <figure
              className="hero-preview mt-12 p-1.5 sm:mt-14 sm:p-2 lg:mt-16"
              data-hero-preview
            >
              <Image
                src="/dpcode-ui-light.png"
                alt="Synara workspace with coding-agent tasks, project navigation, and an attached composer"
                width={3456}
                height={2160}
                priority
                sizes="(max-width: 768px) 100vw, 1280px"
                className="block h-auto w-full rounded-[0.7rem] dark:hidden"
              />
              <Image
                src="/dpcode-ui-dark.png"
                alt="Synara workspace in dark mode with coding-agent tasks, project navigation, and an attached composer"
                width={3456}
                height={2160}
                priority
                sizes="(max-width: 768px) 100vw, 1280px"
                className="hidden h-auto w-full rounded-[0.7rem] dark:block"
              />
            </figure>

            <div className="mt-6 flex flex-col gap-2 border-y border-[var(--divide)] py-4 text-[12.5px] leading-5 text-[var(--text-tertiary)] sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:text-[13px]">
              <span>Free and open source · No Synara account required</span>
              <span className="sm:text-right">
                <InstallerCount initialCount={installerCount} />
              </span>
            </div>
          </div>
        </section>

        <div id="providers" className="scroll-mt-20">
          <Features />
        </div>
        <div id="workflow" className="scroll-mt-20">
          <Workflow />
        </div>
        <div id="privacy" className="scroll-mt-20">
          <PrivacySection />
        </div>
        <FAQ />
        <Testimonials />
        <div id="download" className="scroll-mt-20">
          <ClosingCTA />
        </div>
      </main>

      <SiteFooter />
      <HomepageRail />
    </div>
  );
}
