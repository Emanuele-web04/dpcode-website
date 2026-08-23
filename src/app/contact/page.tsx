// FILE: contact/page.tsx
// Purpose: Public Contact page — clearly labeled channels for feedback, public
//          technical issues, social updates, and privacy questions. Linked from
//          the site footer and the About page.
// Layer: App Router page (static)
// Depends on: Navbar, SiteFooter, SectionEyebrow, lib/seo
// Note: Only approved public channels appear. No street address, no phone, no
//       promised response times. feedback@trysynara.com is approved public
//       contact.

import type { ReactNode } from "react";
import Link from "next/link";
import type { IconType } from "react-icons";
import { FaGithub } from "react-icons/fa";
import { LuArrowDownToLine, LuArrowUpRight, LuMail, LuShieldCheck } from "react-icons/lu";
import { SiX } from "react-icons/si";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import { SectionEyebrow } from "@/components/SectionEyebrow";
import { ctaButtonClass } from "@/lib/ctaButton";
import {
  SITE_URL,
  GITHUB_REPO_URL,
  X_PROFILE_URL,
  breadcrumbJsonLd,
  jsonLdScript,
  pageMetadata,
} from "@/lib/seo";

const LAST_UPDATED = "August 23, 2026";

/** Approved public customer contact; also the sender of the in-app Feedback
 *  dialog and the inbound alias for feedback replies. */
const FEEDBACK_EMAIL = "feedback@trysynara.com";

/** Product account, distinct from the maintainer's personal X profile. */
const PRODUCT_X_URL = "https://x.com/trySynara";

const GITHUB_ISSUES_URL = `${GITHUB_REPO_URL}/issues`;

type Channel = {
  icon: IconType;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
  external: boolean;
};

const CHANNELS: readonly Channel[] = [
  {
    icon: LuMail,
    title: "Feedback and product questions",
    description:
      "General feedback, product questions, and feature ideas — including anything you'd otherwise put in the in-app Feedback dialog.",
    href: `mailto:${FEEDBACK_EMAIL}`,
    linkLabel: FEEDBACK_EMAIL,
    external: true,
  },
  {
    icon: FaGithub,
    title: "Public technical issues",
    description:
      "Bugs, technical problems, and feature requests belong as public GitHub issues so the discussion stays searchable and reachable by others.",
    href: GITHUB_ISSUES_URL,
    linkLabel: "Open a GitHub issue",
    external: true,
  },
  {
    icon: SiX,
    title: "Product updates on X",
    description:
      "Product announcements and release news from the Synara account.",
    href: PRODUCT_X_URL,
    linkLabel: "@trySynara",
    external: true,
  },
  {
    icon: SiX,
    title: "Maintainer updates on X",
    description:
      "The maintainer shares development updates and context on his personal X profile.",
    href: X_PROFILE_URL,
    linkLabel: "@emanueledpt",
    external: true,
  },
  {
    icon: LuShieldCheck,
    title: "Privacy questions",
    description:
      "Questions about data, storage, analytics, or the local-first boundary are answered on the Privacy page. The feedback email above also works.",
    href: "/privacy",
    linkLabel: "Read the Privacy page",
    external: false,
  },
];

export const metadata = pageMetadata({
  title: "Contact — Synara",
  description:
    "How to reach Synara: feedback and product questions by email, public technical issues on GitHub, social updates on X, and privacy questions on the Privacy page.",
  path: "/contact",
});

const CONTACT_JSONLD = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/contact#webpage`,
    name: "Contact Synara",
    url: `${SITE_URL}/contact`,
    dateModified: "2026-08-23",
    description:
      "Public contact channels for Synara: feedback and product questions, public technical issues, social updates, and privacy questions.",
  },
  breadcrumbJsonLd([
    { name: "Synara", path: "/" },
    { name: "Contact", path: "/contact" },
  ]),
];

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--page-bg)] text-[var(--text-primary)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(CONTACT_JSONLD) }}
      />
      <Navbar />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pt-10 pb-20 sm:px-6 sm:pt-14">
        <SectionEyebrow as="p">Contact</SectionEyebrow>
        <h1 className="mt-3 text-[1.75rem] font-medium leading-[1.1] tracking-[-0.035em] sm:text-[2.25rem]">
          Get in touch
        </h1>
        <p className="mt-5 text-[14px] leading-[1.7] text-[var(--text-secondary)] sm:text-[15px]">
          Prefer public channels where possible — the same answer helps the next
          person. Each channel below says what it&apos;s for. No response time
          is guaranteed, but feedback, issues, and questions all reach the
          maintainer directly.
        </p>

        <Section title="Which channel fits">
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {CHANNELS.map((channel) => (
              <ChannelCard
                key={channel.title}
                icon={channel.icon}
                title={channel.title}
                description={channel.description}
                href={channel.href}
                linkLabel={channel.linkLabel}
                external={channel.external}
              />
            ))}
          </div>
        </Section>

        <div className="mt-12 flex flex-col gap-4 border-t border-[var(--divide)] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-[var(--text-tertiary)]">
            Last updated {LAST_UPDATED}. Learn more about the project on the{" "}
            <Link
              href="/about"
              className="text-[var(--accent-link)] underline underline-offset-2 transition-colors hover:text-[var(--accent-link-hover)]"
            >
              About page
            </Link>
            .
          </p>
          <Link href="/install" className={ctaButtonClass()}>
            Download Synara
            <LuArrowDownToLine className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10 border-t border-[var(--divide)] pt-8">
      <h2 className="text-[1.05rem] font-medium tracking-[-0.02em] text-[var(--text-primary)]">
        {title}
      </h2>
      <div className="mt-3 text-[14px] leading-[1.7] text-[var(--text-secondary)]">
        {children}
      </div>
    </section>
  );
}

function ChannelCard({
  icon: Icon,
  title,
  description,
  href,
  linkLabel,
  external,
}: {
  icon: IconType;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
  external: boolean;
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-[var(--divide)] bg-[var(--block-elevated)] p-5">
      <div className="flex items-center gap-2.5">
        <Icon className="size-4 text-[var(--accent-link)]" aria-hidden="true" />
        <h3 className="text-[13px] font-medium text-[var(--text-primary)]">{title}</h3>
      </div>
      <p className="mt-2.5 flex-1 text-[13px] leading-snug text-[var(--text-secondary)]">
        {description}
      </p>
      {external ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--accent-link)] underline underline-offset-2 transition-colors hover:text-[var(--accent-link-hover)]"
        >
          {linkLabel}
          <LuArrowUpRight className="size-3.5" aria-hidden="true" />
        </a>
      ) : (
        <Link
          href={href}
          className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--accent-link)] underline underline-offset-2 transition-colors hover:text-[var(--accent-link-hover)]"
        >
          {linkLabel}
          <LuArrowUpRight className="size-3.5" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
