import { GoGitBranch } from "react-icons/go";
import { SiGooglegemini, SiOpenai } from "react-icons/si";
import { ClaudeIcon, OpencodeIcon } from "@/components/BrandIcons";
import {
  AssistantBlock,
  ChatColumnChrome,
  ResponseDivider,
  UserBubble,
  chatMockPanel,
} from "@/components/CursorChatMockUi";

const menuRow =
  "flex items-center gap-2.5 px-3 py-2.5 text-[11px] text-[var(--text-primary)]";

function HandoffHeaderPill() {
  return (
    <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--divide)] bg-[var(--page-bg)] px-3 py-1.5 text-[11px] font-medium text-[var(--text-primary)] shadow-[0_1px_0_color-mix(in_oklab,var(--text-primary)_6%,transparent)] dark:shadow-none">
      <GoGitBranch
        className="size-3.5 shrink-0 text-[var(--text-secondary)]"
        aria-hidden
      />
      Hand off
    </div>
  );
}

function HandoffDropdownMenu() {
  return (
    <div className="ml-auto w-2/5 min-w-[10.5rem] max-w-full overflow-hidden rounded-xl border border-black/[0.06] bg-[var(--page-bg)] shadow-[0_8px_30px_-4px_rgba(0,0,0,0.12)] dark:border-white/[0.08] dark:bg-[var(--block-elevated)] dark:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.55)]">
      <div className={`${menuRow} border-b border-[var(--divide)]`}>
        <ClaudeIcon className="size-4 shrink-0 text-[#D97757]" />
        Handoff to Claude
      </div>
      <div className={`${menuRow} border-b border-[var(--divide)]`}>
        <SiGooglegemini className="size-4 shrink-0 text-[#4C8BF5]" />
        Handoff to Gemini
      </div>
      <div className={menuRow}>
        <OpencodeIcon className="size-4 shrink-0 text-[var(--text-secondary)]" />
        Handoff to OpenCode
      </div>
    </div>
  );
}

/** Full-width chat mock with handoff control in the thread header. */
export function HandoffChatMock() {
  return (
    <div
      className={`${chatMockPanel} flex h-full min-h-[280px] w-full flex-1 flex-col`}
      aria-hidden
    >
      <ChatColumnChrome
        icon={<ClaudeIcon className="size-3 shrink-0 text-[#D97757]" />}
        label="Claude · stale closure bug"
        headerEnd={<HandoffHeaderPill />}
        belowHeader={<HandoffDropdownMenu />}
        composerIcon={<SiOpenai className="size-2.5 shrink-0" aria-hidden />}
        composerLabel="GPT-5.5"
      >
        <AssistantBlock meta="0:04 • 3.1s">
          Tracing the effect in{" "}
          <code className="font-mono text-[10.5px] text-[var(--text-secondary)]">
            useSession.ts
          </code>
          — the callback closes over an old token after refresh.
        </AssistantBlock>
        <UserBubble meta="0:18">
          Hand this thread to another model — I want a second pair of eyes
          before we patch it.
        </UserBubble>
        <ResponseDivider label="Handoff • Context synced · 0.4s" />
        <AssistantBlock meta="0:22 • 2.8s">
          <span className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
            <SiOpenai className="size-3.5 text-[var(--text-primary)]" />
            <span className="font-medium">GPT-5.5</span>
            <span className="text-[var(--text-secondary)]">
              · picking up at msg 12
            </span>
          </span>
          <span className="mt-2 block">
            Loaded full thread. I&apos;d hoist token reads into a ref so the
            listener always sees the latest value — want a minimal diff?
          </span>
        </AssistantBlock>
      </ChatColumnChrome>
    </div>
  );
}
