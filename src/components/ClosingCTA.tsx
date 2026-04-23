import { SiOpenai, SiGooglegemini } from "react-icons/si";
import DownloadButton from "@/components/DownloadButton";
import InstallerCount from "@/components/InstallerCount";
import { ClaudeIcon, OpencodeIcon } from "@/components/BrandIcons";

export default function ClosingCTA({ initialInstallerCount }: { initialInstallerCount: number | null }) {
  return (
    <section className="relative overflow-hidden border-t border-white/[0.06]">
      {/* Base dark */}
      <div className="absolute inset-0 bg-[#0c0c0c]" />
      {/* Top light — neutral cool glow */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(255,255,255,0.06),transparent_65%)]"
      />
      {/* Bottom whisper — neutral */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[55%] bg-[radial-gradient(ellipse_55%_45%_at_50%_100%,rgba(255,255,255,0.03),transparent_70%)]"
      />
      {/* Subtle grid texture */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:48px_48px]"
      />

      <div className="relative mx-auto max-w-[960px] px-4 py-24 text-center sm:px-6 sm:py-32">
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
          <div className="inline-flex size-[38px] rotate-[5deg] items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-md">
            <OpencodeIcon className="size-[18px] text-white" />
          </div>
        </div>

        <h2 className="text-[2rem] font-medium leading-[1.05] tracking-[-0.03em] text-white sm:text-[3rem]">
          Start coding with every AI<br className="hidden sm:block" />
          you already pay for.
        </h2>
        <p className="mx-auto mt-5 max-w-[560px] text-[14px] leading-relaxed text-white/60 sm:text-[15px]">
          DP Code is free, open source, and built for your subscriptions.
          Plug in Claude, Codex, Gemini, or opencode, and ship faster today.
        </p>

        <div className="mt-9 flex flex-col items-center gap-2">
          <DownloadButton variant="light" />
          <p className="text-[10px] text-white/40">
            <InstallerCount initialCount={initialInstallerCount} />
          </p>
        </div>
      </div>
    </section>
  );
}
