import { SiOpenai } from "react-icons/si";
import { ClaudeIcon } from "@/components/BrandIcons";
import {
  AssistantBlock,
  ChatColumnChrome,
  FileChangeCard,
  ResponseDivider,
  UserBubble,
  chatMockPanel,
} from "@/components/CursorChatMockUi";

/** Two-pane mock styled like Cursor’s agent chat: feed, file cards, bubbles, dividers, composer. */
export function ParallelChatMock() {
  return (
    <div
      className={`grid h-full min-h-[280px] flex-1 grid-cols-1 divide-y divide-[var(--divide)] sm:grid-cols-2 sm:divide-x sm:divide-y-0 ${chatMockPanel}`}
    >
      <ChatColumnChrome
        icon={<ClaudeIcon className="size-3 shrink-0 text-[#D97757]" />}
        label="Claude · plan"
        composerIcon={
          <ClaudeIcon className="size-2.5 text-[#D97757]" aria-hidden />
        }
        composerLabel="Opus 4.7"
      >
        <AssistantBlock meta="0:05 • 4.5s">
          Re-reading{" "}
          <code className="font-mono text-[10.5px] text-[var(--text-secondary)]">
            auth.ts
          </code>{" "}
          to map the session flow before we split helpers.
        </AssistantBlock>
        <FileChangeCard
          count={2}
          meta="0:09 • 2m 3s"
          files={[
            { path: "src/lib/auth.ts", add: 1, del: 1, badge: "TS" },
            { path: "src/lib/session.ts", add: 2, del: 0, badge: "TS" },
          ]}
        />
        <UserBubble meta="0:12">
          Split{" "}
          <code className="font-mono text-[10px] text-[var(--text-secondary)]">
            verifySession
          </code>{" "}
          into two helpers — keep cookies isolated.
        </UserBubble>
        <ResponseDivider label="Response • Worked for 9.8s" />
        <AssistantBlock meta="0:14 • 1.1s">
          Proposed: extract{" "}
          <code className="font-mono text-[10.5px] text-[var(--text-secondary)]">
            readCookie
          </code>{" "}
          and{" "}
          <code className="font-mono text-[10.5px] text-[var(--text-secondary)]">
            validateExpiry
          </code>{" "}
          under{" "}
          <code className="font-mono text-[10.5px] text-[var(--text-secondary)]">
            lib/session/
          </code>
          .
        </AssistantBlock>
      </ChatColumnChrome>
      <ChatColumnChrome
        icon={<SiOpenai className="size-3 shrink-0 text-[var(--text-primary)]" />}
        label="Codex · tests"
        composerIcon={<SiOpenai className="size-2.5 shrink-0" aria-hidden />}
        composerLabel="GPT-5.5"
      >
        <UserBubble meta="0:03">
          Write focused tests for auth — expired tokens and rotation edge
          cases.
        </UserBubble>
        <ResponseDivider label="Response • Worked for 6.2s" />
        <AssistantBlock meta="0:11 • 5.4s">
          Wrote{" "}
          <code className="font-mono text-[10.5px] text-[var(--text-secondary)]">
            auth.test.ts
          </code>{" "}
          — 12 cases covering the tricky paths.
        </AssistantBlock>
        <FileChangeCard
          count={1}
          meta="0:12 • 0.6s"
          files={[
            { path: "src/lib/auth.test.ts", add: 48, del: 0, badge: "TS" },
          ]}
        />
        <AssistantBlock meta="0:13 • 0.8s">
          <span className="font-medium">New fixed run:</span>{" "}
          <span className="text-blue-600 underline decoration-blue-600/30 underline-offset-2 dark:text-blue-400 dark:decoration-blue-400/30">
            pnpm test auth
          </span>{" "}
          →{" "}
          <span className="text-emerald-700 dark:text-emerald-400">
            24 passed, 0 failed
          </span>
          .
        </AssistantBlock>
      </ChatColumnChrome>
    </div>
  );
}
