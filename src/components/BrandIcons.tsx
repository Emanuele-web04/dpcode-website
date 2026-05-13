// FILE: BrandIcons.tsx
// Purpose: Holds small brand glyph components used across marketing sections.
// Layer: UI component helpers
// Exports: WorktreeIcon, ClaudeIcon, OpencodeIcon, CursorIcon, PiIcon, KiloCodeIcon
// Depends on: react-icons marks and inline SVGs

import { SiAnthropic } from "react-icons/si";
import { LuSplit } from "react-icons/lu";

type IconProps = { className?: string };

/**
 * Default worktrees glyph: Lucide's "split" icon, rotated 90° so the trunk
 * points up and the two branches diverge horizontally — reads as a worktree
 * fork rather than a left-to-right path split.
 */
export function WorktreeIcon({ className }: IconProps) {
  return (
    <span className={`inline-flex rotate-90 ${className ?? ""}`}>
      <LuSplit className="size-full" aria-hidden="true" />
    </span>
  );
}

/** Anthropic mark (replaces legacy Claude wordmark in UI). */
export function ClaudeIcon({ className }: IconProps) {
  return <SiAnthropic className={className} aria-hidden="true" />;
}

export function OpencodeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 512 512" className={className} aria-hidden="true">
      <path d="M320 224V352H192V224H320Z" fill="currentColor" opacity="0.22" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M384 416H128V96H384V416ZM320 160H192V352H320V160Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function CursorIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 466.73 532.09" className={className} aria-hidden="true">
      <path
        d="M457.43,125.94L244.42,2.96c-6.84-3.95-15.28-3.95-22.12,0L9.3,125.94c-5.75,3.32-9.3,9.46-9.3,16.11v247.99c0,6.65,3.55,12.79,9.3,16.11l213.01,122.98c6.84,3.95,15.28,3.95,22.12,0l213.01-122.98c5.75-3.32,9.3-9.46,9.3-16.11v-247.99c0-6.65-3.55-12.79-9.3-16.11h-.01ZM444.05,151.99l-205.63,356.16c-1.39,2.4-5.06,1.42-5.06-1.36v-233.21c0-4.66-2.49-8.97-6.53-11.31L24.87,145.67c-2.4-1.39-1.42-5.06,1.36-5.06h411.26c5.84,0,9.49,6.33,6.57,11.39h-.01Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Pi block-letter mark — stylized "Pi" composed of square modules. */
export function PiIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 800 800" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M165.29 165.29 H517.36 V400 H400 V517.36 H282.65 V634.72 H165.29 Z M282.65 282.65 V400 H400 V282.65 Z"
      />
      <path
        fill="currentColor"
        d="M517.36 400 H634.72 V634.72 H517.36 Z"
      />
    </svg>
  );
}

/**
 * KiloCode mark — pixel-style square frame with stylized K/C glyphs.
 * Original artwork is solid black, so we drive every shape with
 * currentColor and rely on the parent text color (var(--text-primary))
 * to keep it readable in both light and dark themes.
 */
export function KiloCodeIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M23,26v-2h3v-5l-2-2h-4v2h-3v5l2,2h4ZM20,20h3v3h-3v-3Z" />
      <rect x="12" y="17" width="3" height="3" />
      <polygon points="26 12 23 12 23 9 20 6 17 6 17 9 20 9 20 12 17 12 17 15 26 15 26 12" />
      <path d="M0,0v32h32V0H0ZM29,29H3V3h26v26Z" />
      <polygon points="15 26 15 23 9 23 9 17 6 17 6 23.1875 8.8125 26 15 26" />
      <rect x="12" y="6" width="3" height="3" />
      <polygon points="9 12 12 12 12 15 15 15 15 12 12 9 9 9 9 6 6 6 6 15 9 15 9 12" />
    </svg>
  );
}
