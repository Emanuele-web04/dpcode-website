// FILE: about/page.tsx
// Purpose: Public About page — what Synara is, its local-first boundary, the
//          supported coding-agent runtimes, the open-source license, the
//          maintainer, and source links. Linked from the site footer.
// Layer: App Router page (static)
// Depends on: Navbar, SiteFooter, SectionEyebrow, data/product, lib/seo
// Note: Every fact is drawn from canonical constants or the privacy boundary.
//       No founding story, team size, address, or phone.

import type { ReactNode } from "react";
import Link from "next/link";
import { LuArrowDownToLine, LuCheck } from "react-icons/lu";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import { SectionEyebrow } from "@/components/SectionEyebrow";
import {
  PRODUCT_CATEGORY,
  PRODUCT_DESCRIPTION,
  PRODUCT_META_DESCRIPTION,
  SUPPORTED_PROVIDERS,
} from "@/data/product";
import { ctaButtonClass } from "@/lib/ctaButton";
import {
  SITE_URL,
  CREATOR_NAME,
  CREATOR_URL,
  GITHUB_REPO_URL,
  GITHUB_RELEASES_URL,
  GITHUB_SPONSORS_URL,
  X_PROFILE_URL,
  YOUTUBE_URL,
  breadcrumbJsonLd,
  jsonLdScript,
  pageMetadata,
} from "@/lib/seo";

const LAST_UPDATED = "August 23, 2026";

const MIT_LICENSE_URL = "https://opensource.org/licenses/MIT";

export const metadata = pageMetadata({
  title: "About — Synara",
  description:
    "What Synara is: a free, open-source, local-first workspace for coding agents — the local-first boundary, supported runtimes, MIT license, and maintainer.",
  path: "/about",
});

const ABOUT_JSONLD = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/about#webpage`,
    name: "About Synara",
    url: `${SITE_URL}/about`,
    dateModified: "2026-08-23",
    description: PRODUCT_META_DESCRIPTION,
  },
  breadcrumbJsonLd([
    { name: "Synara", path: "/" },
    { name: "About", path: "/about" },
  ]),
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--page-bg)] text-[var(--text-primary)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(ABOUT_JSONLD) }}
      />
      <Navbar />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pt-10 pb-20 sm:px-6 sm:pt-14">
        <SectionEyebrow as="p">About</SectionEyebrow>
        <h1 className="mt-3 text-[1.75rem] font-medium leading-[1.1] tracking-[-0.035em] sm:text-[2.25rem]">
          A local-first workspace for coding agents
        </h1>
        <p className="mt-5 text-[14px] leading-[1.7] text-[var(--text-secondary)] sm:text-[15px]">
          {PRODUCT_META_DESCRIPTION} The project is open source, so every claim
          on this page can be checked directly in the repository.
        </p>

        <Section title="What Synara is">
          <p>{PRODUCT_DESCRIPTION}</p>
          <p>
            In one line: {PRODUCT_CATEGORY} There is no paid tier, no account,
            and nothing held back behind a subscription.
          </p>
        </Section>

        <Section title="Local-first by default">
          <p>
            Synara is a desktop app that runs on your machine. Your chats,
            projects, settings, and history live in a local database (SQLite) on
            your own device — there is no Synara account and no Synara server
            holding your work.
          </p>
          <p>
            When you talk to a model, Synara connects <strong>directly</strong>{" "}
            to the provider you chose using the logins already configured on
            your machine. Your prompts and code go only to that provider,
            governed by their privacy terms; Synara does not proxy, copy, or
            store that traffic on a server of its own.
          </p>
          <p>
            <Link
              href="/privacy"
              className="text-[var(--accent-link)] underline underline-offset-2 transition-colors hover:text-[var(--accent-link-hover)]"
            >
              The Privacy page
            </Link>{" "}
            spells out the full boundary, including the opt-in anonymous
            analytics that are off by default.
          </p>
        </Section>

        <Section title="Supported runtimes">
          <p>
            Synara connects to the coding-agent runtimes you already have
            installed. It does not sell a separate model plan — each provider
            keeps its own authentication, models, limits, tools, and
            permissions.
          </p>
          <ul
            role="list"
            className="mt-5 grid gap-2.5 rounded-2xl border border-[var(--divide)] bg-[var(--block-elevated)] p-5 sm:grid-cols-2"
          >
            {SUPPORTED_PROVIDERS.map((provider) => (
              <li
                key={provider}
                className="flex items-center gap-2.5 text-[13px] leading-snug"
              >
                <LuCheck
                  className="size-4 shrink-0 text-[var(--accent-link)]"
                  aria-hidden="true"
                />
                {provider}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Open source">
          <p>
            Synara is open source under the MIT license and free to use. You can
            read the source, follow development, and sponsor the project through
            GitHub.
          </p>
          <ul
            role="list"
            className="mt-5 space-y-2.5 rounded-2xl border border-[var(--divide)] bg-[var(--block-elevated)] p-5"
          >
            <li>
              <Link
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent-link)] underline underline-offset-2 transition-colors hover:text-[var(--accent-link-hover)]"
              >
                Source repository
              </Link>
              <span className="text-[var(--text-tertiary)]"> — {GITHUB_REPO_URL}</span>
            </li>
            <li>
              <Link
                href={GITHUB_RELEASES_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent-link)] underline underline-offset-2 transition-colors hover:text-[var(--accent-link-hover)]"
              >
                Releases
              </Link>
              <span className="text-[var(--text-tertiary)]">
                {" "}
                — every published build and changelog
              </span>
            </li>
            <li>
              <Link
                href={MIT_LICENSE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent-link)] underline underline-offset-2 transition-colors hover:text-[var(--accent-link-hover)]"
              >
                MIT license
              </Link>
              <span className="text-[var(--text-tertiary)]">
                {" "}
                — the terms under which the source is released
              </span>
            </li>
            <li>
              <Link
                href={GITHUB_SPONSORS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent-link)] underline underline-offset-2 transition-colors hover:text-[var(--accent-link-hover)]"
              >
                GitHub Sponsors
              </Link>
              <span className="text-[var(--text-tertiary)]">
                {" "}
                — the direct way to fund development
              </span>
            </li>
          </ul>
        </Section>

        <Section title="Who maintains it">
          <p>
            Synara is maintained by {CREATOR_NAME}. You can follow his work on
            X, watch walkthroughs on YouTube, or visit his website.
          </p>
          <ul
            role="list"
            className="mt-5 space-y-2.5 rounded-2xl border border-[var(--divide)] bg-[var(--block-elevated)] p-5"
          >
            <li>
              <Link
                href={CREATOR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent-link)] underline underline-offset-2 transition-colors hover:text-[var(--accent-link-hover)]"
              >
                {CREATOR_NAME}
              </Link>
              <span className="text-[var(--text-tertiary)]"> — website</span>
            </li>
            <li>
              <Link
                href={X_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent-link)] underline underline-offset-2 transition-colors hover:text-[var(--accent-link-hover)]"
              >
                @emanueledpt
              </Link>
              <span className="text-[var(--text-tertiary)]"> — on X</span>
            </li>
            <li>
              <Link
                href={YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent-link)] underline underline-offset-2 transition-colors hover:text-[var(--accent-link-hover)]"
              >
                YouTube
              </Link>
              <span className="text-[var(--text-tertiary)]">
                {" "}
                — demos and walkthroughs
              </span>
            </li>
          </ul>
        </Section>

        <div className="mt-12 flex flex-col gap-4 border-t border-[var(--divide)] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-[var(--text-tertiary)]">
            Last updated {LAST_UPDATED}. Have a question or feedback?{" "}
            <Link
              href="/contact"
              className="text-[var(--accent-link)] underline underline-offset-2 transition-colors hover:text-[var(--accent-link-hover)]"
            >
              Get in touch
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
      <div className="mt-3 space-y-3 text-[14px] leading-[1.7] text-[var(--text-secondary)] [&_strong]:font-medium [&_strong]:text-[var(--text-primary)]">
        {children}
      </div>
    </section>
  );
}
