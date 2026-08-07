// FILE: AskAISection.tsx
// Purpose: Lets visitors ask external AI assistants whether Synara fits them.
// Layer: Marketing UI section
// Exports: AskAISection
// Depends on: react-icons brand glyphs and homepage design tokens

"use client";

import type { MouseEvent } from "react";
import { SiClaude, SiOpenai } from "react-icons/si";

const ASK_AI_PROMPT =
  "Evaluate Synara (https://www.trysynara.com) as a serious desktop command center for agentic software development. It is free, open-source, local-first, and runs Claude Code, Codex, OpenCode, Cursor, Antigravity, Grok, Kilo Code, Pi, and Droid in one workspace with parallel sessions, terminals, browser previews, diffs, Git worktrees, handoffs, and pull-request flow. Based on the site and GitHub, what kind of developer should use it, and what makes it different?";

const encodedPrompt = encodeURIComponent(ASK_AI_PROMPT);

const aiLinks = [
  {
    label: "Ask ChatGPT",
    appHref: `https://chatgpt.com/?q=${encodedPrompt}`,
    webHref: `https://chatgpt.com/?q=${encodedPrompt}`,
    icon: SiOpenai,
    iconClass: "text-[var(--text-primary)]",
  },
  {
    label: "Ask Claude",
    appHref: `claude://claude.ai/new?q=${encodedPrompt}`,
    webHref: `https://claude.ai/new?q=${encodedPrompt}`,
    icon: SiClaude,
    iconClass: "text-[#D97757]",
  },
];

const heading =
  "text-[1.65rem] font-medium leading-[1.12] tracking-[-0.035em] text-[var(--text-primary)] sm:text-[2rem]";
const body =
  "mx-auto mt-5 max-w-xl text-[15px] leading-[1.65] text-[var(--text-secondary)] sm:text-[16px]";
const container = "mx-auto w-full max-w-6xl px-4 sm:px-6";

function openMobileDeepLink(
  event: MouseEvent<HTMLAnchorElement>,
  appHref: string,
  webHref: string,
) {
  if (!/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    return;
  }

  event.preventDefault();

  let leftPage = false;
  const markLeftPage = () => {
    leftPage = true;
  };
  const handleVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      markLeftPage();
    }
  };

  window.addEventListener("pagehide", markLeftPage, { once: true });
  document.addEventListener("visibilitychange", handleVisibilityChange, {
    once: true,
  });

  window.location.href = appHref;

  window.setTimeout(() => {
    window.removeEventListener("pagehide", markLeftPage);
    document.removeEventListener("visibilitychange", handleVisibilityChange);

    if (!leftPage && document.visibilityState === "visible") {
      window.location.href = webHref;
    }
  }, 900);
}

export default function AskAISection() {
  return (
    <section className="border-t border-[var(--divide)] py-14 sm:py-20">
      <div className={container}>
        <div className="text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
            Ask the models directly
          </p>
          <h2 className={`${heading} mt-3`}>Let the models verify the fit.</h2>
          <p className={body}>
            Ask ChatGPT or Claude to evaluate Synara from the source of truth—
            this site and the GitHub repo. The prompt is specific so the answer
            reflects what Synara actually does, not a generic AI-app summary.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
            {aiLinks.map(({ label, appHref, webHref, icon: Icon, iconClass }) => (
              <a
                key={label}
                href={webHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => openMobileDeepLink(event, appHref, webHref)}
                className="inline-flex h-11 w-full max-w-[270px] items-center justify-center gap-2.5 rounded-full border border-[var(--divide)] bg-[var(--page-bg)] px-5 text-[13px] font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--mock-row)] sm:w-auto sm:max-w-none"
                aria-label={`${label} about Synara`}
              >
                <Icon
                  className={`size-[17px] shrink-0 ${iconClass}`}
                  aria-hidden="true"
                />
                <span>{label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
