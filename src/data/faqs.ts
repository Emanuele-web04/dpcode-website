// FILE: data/faqs.ts
// Purpose: Shared FAQ copy used by the homepage UI and FAQPage JSON-LD.
// Layer: static content (server/client importable).

export const FAQ_ITEMS = [
  {
    question: "What is Synara?",
    answer:
      "Synara is a desktop app for working with coding agents in one focused workspace. It brings chats, terminals, browser previews, diffs, branches, and handoffs into a single interface so you can keep momentum while the agents do the heavy lifting.",
  },
  {
    question: "Do I need a new AI subscription?",
    answer:
      "No. Synara is built around the accounts and subscriptions you already use. It supports major agent harnesses such as Claude Code, Codex, OpenCode, Cursor, Grok, Kilo Code, Pi, and Droid, with each provider keeping its own models and capabilities.",
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
] as const;
