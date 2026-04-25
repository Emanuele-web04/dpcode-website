import { SiOpenai, SiGooglegemini } from "react-icons/si";
import DownloadButton from "@/components/DownloadButton";
import InstallerCount from "@/components/InstallerCount";
import { ClaudeIcon, OpencodeIcon } from "@/components/BrandIcons";

export default function ClosingCTA({
  initialInstallerCount,
}: {
  initialInstallerCount: number | null;
}) {
  return (
    <section className="border-t border-[var(--divide)] bg-[var(--page-bg)] py-16 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 text-center sm:px-6">
        <div className="mb-8 flex items-center justify-center gap-2 sm:mb-10">
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

        <h2 className="text-[1.65rem] font-medium leading-[1.1] tracking-[-0.04em] text-[var(--text-primary)] sm:text-[2.25rem] sm:leading-[1.06]">
          Start coding with every AI
          <br className="hidden sm:block" /> you already pay for.
        </h2>
        <p className="mx-auto mt-6 max-w-6xl text-[13px] leading-[1.6] text-[var(--text-secondary)] sm:text-[14px]">
          DP Code is free, open source, and built for your subscriptions. Plug
          in Claude, Codex, Gemini, or OpenCode, and ship faster today.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3">
          <DownloadButton />
          <p className="text-[11px] text-[var(--text-tertiary)]">
            <InstallerCount initialCount={initialInstallerCount} />
          </p>
        </div>
      </div>
    </section>
  );
}
