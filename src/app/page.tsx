// FILE: page.tsx
// Purpose: Renders the homepage hero, including the live installer count and primary CTA.
// Layer: App Router page
// Depends on: Navbar, DownloadButton, InstallerCount, getInstallerCount

import { SiGithub, SiOpenai, SiGooglegemini } from "react-icons/si";
import Navbar from "@/components/Navbar";
import DownloadButton from "@/components/DownloadButton";
import InstallerCount from "@/components/InstallerCount";
import Features from "@/components/Features";
import Workflow from "@/components/Workflow";
import ClosingCTA from "@/components/ClosingCTA";
import { ClaudeIcon, OpencodeIcon } from "@/components/BrandIcons";
import { getInstallerCount } from "@/lib/installerCount";

export const dynamic = "force-dynamic";

export default async function Home() {
  const initialInstallerCount = await getInstallerCount();

  return (
    <div className="flex min-h-screen flex-col bg-[var(--page-bg)] text-[var(--text-primary)]">
      <div className="relative">
        <Navbar />

        {/*
          Edge-to-edge section: no horizontal padding or max-width on the
          <section> itself so any background/border (added later) can run
          full-bleed. Horizontal gutters + content cap live on the inner
          wrapper. Vertical rhythm tightened so mobile/tablet doesn't leave
          a huge gap between the install-count line and the screenshot card.
        */}
        <section className="pt-6 pb-12 sm:pt-10 sm:pb-20">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <div className="mb-8 flex items-center gap-2 sm:mb-10">
              <div className="inline-flex size-[38px] -rotate-[6deg] items-center justify-center rounded-xl border border-black/[0.08] bg-black/[0.03] backdrop-blur-md dark:border-white/10 dark:bg-white/[0.04]">
                <ClaudeIcon className="size-[18px] text-[#D97757]" />
              </div>
              <div className="inline-flex size-[38px] rotate-[4deg] items-center justify-center rounded-xl border border-black/[0.08] bg-black/[0.03] backdrop-blur-md dark:border-white/10 dark:bg-white/[0.04]">
                <SiOpenai className="size-[18px] text-[var(--text-primary)]" />
              </div>
              <div className="inline-flex size-[38px] -rotate-[3deg] items-center justify-center rounded-xl border border-black/[0.08] bg-black/[0.03] backdrop-blur-md dark:border-white/10 dark:bg-white/[0.04]">
                <SiGooglegemini className="size-[18px] text-[#4C8BF5]" />
              </div>
              <div className="inline-flex size-[38px] rotate-[5deg] items-center justify-center rounded-xl border border-black/[0.08] bg-black/[0.03] backdrop-blur-md dark:border-white/10 dark:bg-white/[0.04]">
                <OpencodeIcon className="size-[18px] text-[var(--text-primary)]" />
              </div>
            </div>

            <h1 className="text-[1.5rem] font-medium leading-[1.12] tracking-[-0.035em] text-[var(--text-primary)] sm:text-[2rem] sm:leading-[1.08]">
              Built to make you extraordinarily productive.
            </h1>
            <p className="mt-5 text-[13px] leading-[1.6] text-[var(--text-secondary)] sm:text-[14px]">
              DP Code is the best way to code with the AI subscriptions you
              already pay for.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <DownloadButton />
              <a
                href="https://github.com/Emanuele-web04/dpcode"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--divide)] px-5 py-2.5 text-[13px] font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--mock-row)]"
              >
                <SiGithub className="size-4 shrink-0" aria-hidden="true" />
                Star on GitHub
              </a>
            </div>
            <p className="mt-4 text-[12px] text-[var(--text-tertiary)]">
              <InstallerCount initialCount={initialInstallerCount} />
            </p>

            <div className="relative mt-10 sm:mt-14">
              <div className="relative overflow-hidden rounded-xl bg-[var(--block-elevated)] p-2 ring-1 ring-black/5 sm:rounded-2xl sm:p-3 dark:ring-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/dpcode-ui-light.png"
                  alt="DP Code — AI-powered coding assistant interface"
                  className="block h-auto w-full rounded-lg dark:hidden sm:rounded-xl"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/dpcode-ui-dark.png"
                  alt="DP Code — AI-powered coding assistant interface"
                  className="hidden h-auto w-full rounded-lg dark:block sm:rounded-xl"
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      <Features />

      <Workflow />

      <ClosingCTA initialInstallerCount={initialInstallerCount} />

      <footer className="mt-auto border-t border-[var(--divide)] py-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 text-[12px] text-[var(--text-tertiary)] sm:flex-row sm:items-center sm:justify-between sm:gap-0 sm:px-6">
          <span>
            Made by{" "}
            <a
              href="https://x.com/emanueledpt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent-link)] transition-colors hover:text-[var(--accent-link-hover)]"
            >
              @emanueledpt
            </a>
          </span>
          <span>
            Based on{" "}
            <a
              href="https://github.com/pingdotgg/t3code"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent-link)] transition-colors hover:text-[var(--accent-link-hover)]"
            >
              T3 Code
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
