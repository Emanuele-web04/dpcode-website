// FILE: FAQ.tsx
// Purpose: Renders homepage FAQs distilled from the original Synara project docs.
// Layer: Marketing UI section
// Exports: FAQ default component

"use client";

import { useState } from "react";
import { FiPlus } from "react-icons/fi";

const faqs = [
  {
    question: "What is Synara?",
    answer:
      "Synara is a desktop app for working with coding agents in one focused workspace. It brings chats, terminals, browser previews, diffs, branches, and handoffs into a single interface so you can keep momentum while the agents do the heavy lifting.",
  },
  {
    question: "Do I need a new AI subscription?",
    answer:
      "No. Synara is built around the accounts and subscriptions you already use. It supports major agent harnesses such as Claude Code, Codex, Gemini, OpenCode, Cursor, Grok, Kilo Code, and Pi, with each provider keeping its own models and capabilities.",
  },
  {
    question: "What do I need installed before using it?",
    answer:
      "Install the Synara desktop app, then make sure the agent runtime you want to use is authenticated on your machine. For Codex sessions, that means the Codex CLI should be on your PATH and signed in before Synara starts a session.",
  },
  {
    question: "Can I run multiple tasks at the same time?",
    answer:
      "Yes. Synara was built for parallel work: open split chats, start separate threads, and run tasks in isolated worktrees so different agents can build, test, or debug without stepping on the same branch.",
  },
  {
    question: "Does it fit into a normal Git workflow?",
    answer:
      "Yes. Synara works with regular branches and Git worktrees, keeps diffs visible, and can help you move from a finished agent task to a pull request. You still review the changes and keep the repository in a normal Git shape.",
  },
  {
    question: "Does Synara upload my code somewhere?",
    answer:
      "Synara runs locally as the workspace layer. The provider you choose still receives the prompts, file snippets, diffs, terminal output, or tool results needed for a session, but Synara does not require uploading your whole repo to a separate Synara cloud.",
  },
];

export default function FAQ() {
  // Keep one panel open so both opening and closing can animate cleanly.
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  const toggleQuestion = (question: string) => {
    setOpenQuestion((current) => (current === question ? null : question));
  };

  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
            FAQ
          </p>
          <h2 className="mt-3 text-[1.65rem] font-medium leading-[1.12] tracking-[-0.035em] text-[var(--text-primary)] sm:text-[2rem]">
            The practical bits,
            <br className="hidden sm:block" /> answered.
          </h2>
          <p className="mt-5 max-w-sm text-[15px] leading-[1.65] text-[var(--text-secondary)] sm:text-[16px]">
            A quick pass over setup, providers, parallel work, and how much
            control you keep while agents are running.
          </p>
        </div>

        <div className="divide-y divide-[var(--divide)]">
          {faqs.map(({ question, answer }) => {
            const isOpen = openQuestion === question;
            const panelId = `faq-${question
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "")}`;
            const labelId = `${panelId}-label`;

            return (
              <div key={question} className="group/faq relative cursor-pointer py-5">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  aria-labelledby={labelId}
                  onClick={() => toggleQuestion(question)}
                  className="absolute inset-0 z-10 cursor-pointer appearance-none rounded-md border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-link)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--page-bg)]"
                />

                <div className="relative z-0 flex items-start justify-between gap-5">
                  <span
                    id={labelId}
                    className="text-[15px] font-medium leading-[1.45] text-[var(--text-primary)] transition-colors duration-300 group-hover/faq:text-[var(--accent-link)] sm:text-[16px]"
                  >
                    {question}
                  </span>
                  <span
                    className={`mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--block-elevated)] transition duration-300 ease-out motion-reduce:transition-none ${
                      isOpen
                        ? "rotate-45 text-[var(--accent-link)]"
                        : "rotate-0 text-[var(--text-tertiary)]"
                    }`}
                  >
                    <FiPlus className="size-3.5" aria-hidden="true" />
                  </span>
                </div>

                <div
                  id={panelId}
                  aria-hidden={!isOpen}
                  className={`relative z-0 grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pt-5 text-[13px] leading-[1.7] text-[var(--text-secondary)] sm:text-[14px]">
                      {answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
