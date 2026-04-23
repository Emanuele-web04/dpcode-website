// FILE: page.tsx
// Purpose: Renders the homepage hero, including the live installer count and primary CTA.
// Layer: App Router page
// Depends on: Navbar, DownloadButton, InstallerCount, getInstallerCount

import Image from "next/image";
import { SiOpenai, SiGooglegemini } from "react-icons/si";
import Navbar from "@/components/Navbar";
import DownloadButton from "@/components/DownloadButton";
import InstallerCount from "@/components/InstallerCount";
import Features from "@/components/Features";
import Workflow from "@/components/Workflow";
import ClosingCTA from "@/components/ClosingCTA";
import { ClaudeIcon } from "@/components/BrandIcons";
import { getInstallerCount } from "@/lib/installerCount";

export default async function Home() {
  const initialInstallerCount = await getInstallerCount();

  return (
    <div className="dark flex min-h-screen flex-col bg-[#0c0c0c] text-white">
      {/* Dark hero — navbar + headline + CTA + screenshot */}
      <div className="dark relative overflow-hidden">
        {/* Base dark */}
        <div className="absolute inset-0 bg-[#0c0c0c]" />
        {/* Top light — neutral cool glow */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(255,255,255,0.07),transparent_65%)]"
        />
        {/* Bottom whisper — neutral */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[55%] bg-[radial-gradient(ellipse_55%_45%_at_50%_100%,rgba(255,255,255,0.035),transparent_70%)]"
        />
        {/* Subtle grid texture */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:48px_48px]"
        />

        <div className="relative">
          <Navbar />

          <section className="px-4 pt-10 pb-16 sm:px-6 sm:pt-14 sm:pb-24">
            <div className="mx-auto w-full max-w-[1200px]">
              <div className="mx-auto max-w-[960px] text-center">
                {/* Floating brand trio */}
                <div className="mb-10 flex items-center justify-center gap-2">
                  <div className="inline-flex size-[38px] -rotate-[6deg] items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-md">
                    <ClaudeIcon className="size-[18px] text-[#D97757]" />
                  </div>
                  <div className="inline-flex size-[38px] rotate-[4deg] items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-md">
                    <SiOpenai className="size-[18px] text-white" />
                  </div>
                  <div className="inline-flex size-[38px] -rotate-[3deg] items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-md">
                    <SiGooglegemini className="size-[18px] text-[#4C8BF5]" />
                  </div>
                </div>

                <h1 className="text-[2rem] font-medium leading-[1.05] tracking-[-0.03em] text-white sm:text-[3rem]">
                  Built to make you<br className="hidden sm:block" />
                  {" "}extraordinarily productive.
                </h1>
                <p className="mx-auto mt-5 max-w-[560px] text-[14px] leading-relaxed text-white/60 sm:text-[15px]">
                  DP Code is the best way to code with the AI
                  subscriptions you already pay for.
                </p>

                <div className="mt-9 flex flex-col items-center gap-2">
                  <DownloadButton variant="light" />
                  <p className="text-[10px] text-white/40">
                    <InstallerCount initialCount={initialInstallerCount} />
                  </p>
                </div>
              </div>

              {/* Screenshot */}
              <div className="relative mt-14 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-2 backdrop-blur-md sm:mt-20 sm:p-8">
                <div className="rounded-lg border border-white/[0.06] shadow-xl shadow-black/40 sm:rounded-xl">
                  <Image
                    src="/dpcode-ui-dark.png"
                    alt="DP Code — AI-powered coding assistant interface"
                    width={3024}
                    height={1898}
                    className="block h-auto w-full rounded-lg sm:rounded-xl"
                    priority
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Features />

      <Workflow />

      <ClosingCTA initialInstallerCount={initialInstallerCount} />

      {/* Footer */}
      <footer className="mt-auto px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between text-[10px] text-neutral-400 sm:text-[12px]">
          <span>
            Made by{" "}
            <a href="https://x.com/emanueledpt" target="_blank" rel="noopener noreferrer" className="text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white">
              @emanueledpt
            </a>
          </span>
          <span>
            DP Code: clone from{" "}
            <a href="https://github.com/pingdotgg/t3code" target="_blank" rel="noopener noreferrer" className="text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white">
              T3 Code
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
