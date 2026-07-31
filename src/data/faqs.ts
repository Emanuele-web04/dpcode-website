// FILE: data/faqs.ts
// Purpose: Shared FAQ copy used by the homepage UI and FAQPage JSON-LD.
// Layer: static content (server/client importable).

export const FAQ_ITEMS = [
  {
    question: "What is Synara?",
    answer:
      "Synara is a free, open-source desktop command center for agentic development. It brings coding agents, chats, terminals, browser previews, diffs, branches, worktrees, and handoffs into one focused workspace so you can direct the work and ship with confidence.",
  },
  {
    question: "Do I need a new AI subscription?",
    answer:
      "No. Synara is the control plane around the accounts and subscriptions you already use. It supports Claude Code, Codex, OpenCode, Cursor, Antigravity, Grok, Kilo Code, Pi, and Droid while each provider keeps its own models and capabilities.",
  },
  {
    question: "What do I need installed before using it?",
    answer:
      "Install the Synara desktop app, then make sure the agent runtime you want to use is authenticated on your machine. For Codex sessions, that means the Codex CLI should be on your PATH and signed in before Synara starts a session.",
  },
  {
    question: "Can I run multiple tasks at the same time?",
    answer:
      "Yes. Parallel work is a core Synara workflow: open split chats, start separate threads, and run tasks in isolated worktrees so different agents can build, test, or debug without stepping on the same branch.",
  },
  {
    question: "Does it fit into a normal Git workflow?",
    answer:
      "Yes. Git is first-class in Synara. Work with regular branches or isolated worktrees, keep diffs visible, and move from a finished agent task to a reviewed pull request without leaving the workspace.",
  },
  {
    question: "Does Synara upload my code somewhere?",
    answer:
      "Synara runs locally as the workspace layer and does not require a Synara cloud account. The provider you choose receives the prompts, file snippets, diffs, terminal output, or tool results needed for that session; Synara does not proxy or store your work on its own server.",
  },
] as const;
