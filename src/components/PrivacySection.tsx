// FILE: PrivacySection.tsx
// Purpose: Homepage trust block — the single, clean "what happens to your data"
//          section, summarizing Synara's local-first, opt-in-analytics stance.
// Layer: Marketing UI section
// Depends on: next/link, react-icons/lu, design tokens
// Note: Every claim here must stay true to the app. Verified against the synara
//       codebase: local SQLite, direct-to-provider, no Synara cloud/account,
//       anonymous analytics OFF by default (opt-in).

import Link from "next/link";
import {
  LuHardDrive,
  LuPlug,
  LuShieldCheck,
  LuEyeOff,
  LuArrowRight,
  LuGithub,
} from "react-icons/lu";

const heading =
  "text-[1.65rem] font-medium leading-[1.12] tracking-[-0.035em] text-[var(--text-primary)] sm:text-[2rem]";
const body =
  "mt-5 max-w-xl text-[15px] leading-[1.65] text-[var(--text-secondary)] sm:text-[16px]";
const container = "mx-auto w-full max-w-6xl px-4 sm:px-6";

const pillars = [
  {
    Icon: LuHardDrive,
    title: "Your work stays local",
    description:
      "Your chats, projects, settings, and history live in a database on your own machine. There is no Synara cloud holding your work.",
  },
  {
    Icon: LuPlug,
    title: "Direct-to-provider",
    description:
      "Synara connects directly to the provider you choose with your existing login. Prompts and code go to that provider—not through a Synara proxy.",
  },
  {
    Icon: LuShieldCheck,
    title: "No account, no lock-in",
    description:
      "Nothing to sign up for. Remote access from your phone is self-hosted over your own network, behind a token you control.",
  },
  {
    Icon: LuEyeOff,
    title: "Telemetry is opt-in",
    description:
      "Optional, anonymous usage stats are off unless you turn them on. They never include your code, prompts, or chat history.",
  },
];

export default function PrivacySection() {
  return (
    <section className="border-t border-[var(--divide)] py-14 sm:py-20">
      <div className={container}>
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
          Privacy
        </p>
        <h2 className={`${heading} mt-3`}>Security is a product feature.</h2>
        <p className={body}>
          Synara runs on your machine, connects straight to the provider you
          choose, and keeps telemetry off by default. The boundary is clear:
          your work stays with you unless you explicitly send it somewhere.
        </p>

        <div className="mt-12 grid grid-cols-1 border-t border-[var(--divide)] sm:grid-cols-2">
          {pillars.map(({ Icon, title, description }) => (
            <div
              key={title}
              className="border-b border-[var(--divide)] p-6 sm:p-7 sm:[&:nth-child(odd)]:border-r sm:[&:nth-child(odd)]:border-[var(--divide)]"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-[var(--block-elevated)]">
                  <Icon className="size-[18px] text-[var(--text-primary)]" />
                </span>
                <span className="text-[15px] font-medium text-[var(--text-primary)]">
                  {title}
                </span>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-[var(--text-secondary)] sm:text-[13.5px]">
                {description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px]">
          <Link
            href="/privacy"
            className="inline-flex items-center gap-1.5 font-medium text-[var(--accent-link)] transition-colors hover:text-[var(--accent-link-hover)]"
          >
            Read the full privacy approach
            <LuArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <a
            href="https://github.com/Emanuele-web04/synara"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-primary)]"
          >
            <LuGithub className="size-4" aria-hidden="true" />
            Open source — audit every line
          </a>
        </div>
      </div>
    </section>
  );
}
