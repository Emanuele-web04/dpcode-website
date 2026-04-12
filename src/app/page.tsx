// FILE: page.tsx
// Purpose: Renders the homepage hero, including the live installer count and primary CTA.
// Layer: App Router page
// Depends on: Navbar, DownloadButton, InstallerCount, getInstallerCount

import Image from "next/image";
import Navbar from "@/components/Navbar";
import DownloadButton from "@/components/DownloadButton";
import InstallerCount from "@/components/InstallerCount";
import { getInstallerCount } from "@/lib/installerCount";

export default async function Home() {
  const initialInstallerCount = await getInstallerCount();

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-[#0a0a0a]">
      <Navbar />

      <section className="flex-1 px-4 pt-10 sm:px-6 sm:pt-14">
        <div className="mx-auto w-full max-w-[1200px]">
          {/* Headline */}
          <h1 className="text-[1.35rem] font-medium leading-[1.2] tracking-[-0.02em] text-neutral-900 dark:text-neutral-100 sm:text-[1.7rem]">
            Built to make you extraordinarily productive,<br /> DP Code is the best way to code with your AI subscriptions.
          </h1>

          {/* CTA */}
          <div className="mt-5 sm:mt-6">
            <div className="flex items-center">
              <DownloadButton />
            </div>
            <p className="mt-1.5 text-[10px] text-neutral-500 dark:text-neutral-400">
              <InstallerCount initialCount={initialInstallerCount} />
            </p>
          </div>

          {/* Screenshot */}
          <div className="relative mt-8 mb-10 rounded-2xl bg-[#FAF8F5] p-2 dark:bg-[#131213] sm:mt-12 sm:mb-16 sm:p-8">
            <div className="rounded-lg border border-black/[0.06] shadow-xl shadow-black/[0.06] dark:border-white/[0.06] dark:shadow-black/[0.3] sm:rounded-xl">
              {/* Light mode screenshot */}
              <Image
                src="/dpcode-ui.png"
                alt="DP Code — AI-powered coding assistant interface"
                width={2400}
                height={1500}
                className="block h-auto w-full rounded-lg dark:hidden sm:rounded-xl"
                priority
              />
              {/* Dark mode screenshot */}
              <Image
                src="/dpcode-ui-dark.png"
                alt="DP Code — AI-powered coding assistant interface"
                width={2400}
                height={1500}
                className="hidden h-auto w-full rounded-lg dark:block sm:rounded-xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

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
