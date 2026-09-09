import { FAQ_ITEMS } from "@/data/faqs";
import { PRODUCT_DESCRIPTION, PRODUCT_PILLARS, SUPPORTED_PROVIDERS } from "@/data/product";
import { SPONSOR_TIERS, SPONSOR_FUNDING_USES, ONE_TIME_SPONSORSHIP } from "@/data/sponsorTiers";
import { getSortedReleases, toVersionSlug } from "@/lib/changelog";
import { docsSource } from "@/lib/docs";
import { buildDocumentationMarkdown } from "@/lib/docsMarkdown";
import { getReleaseDownloads } from "@/lib/releases";
import { orderedSponsors, sponsorLink, monthlyTierCheckoutUrl, ONE_TIME_CHECKOUT_URL } from "@/lib/sponsors";
import { SITE_URL, GITHUB_REPO_URL, GITHUB_SPONSORS_URL } from "@/lib/seo";
import { PRIVACY_MARKDOWN } from "@/data/privacyMarkdown";

export async function buildPageMarkdown(path: string): Promise<string | null> {
  if (path === "/docs" || path.startsWith("/docs/")) {
    const page = docsSource.getPage(path.split("/").slice(2).filter(Boolean));
    return page ? buildDocumentationMarkdown(page) : null;
  }
  let lines: string[];
  if (path === "/") {
    lines = ["# Synara", PRODUCT_DESCRIPTION, "## Coding-agent runtimes", SUPPORTED_PROVIDERS.join(", "),
      ...PRODUCT_PILLARS.flatMap(p => [`## ${p.title}`, p.description]),
      "## Frequently asked questions", ...FAQ_ITEMS.flatMap(f => [`### ${f.question}`, f.answer]),
      `[Download](${SITE_URL}/install.md) · [Documentation](${SITE_URL}/docs.md) · [Release notes](${SITE_URL}/changelog.md)`,
      `[Source code — MIT license](${GITHUB_REPO_URL})`, `[Privacy](${SITE_URL}/privacy.md)`,
    ];
  } else if (path === "/install") {
    const downloads = await getReleaseDownloads();
    lines = ["# Download Synara", "Install the desktop app and authenticate at least one supported coding-agent runtime on your machine. Start with one repository and one bounded task.",
      `Latest release: ${downloads.version ?? "See release downloads"}`,
      `- [macOS Apple Silicon](${downloads.mac.arm64})\n- [macOS Intel](${downloads.mac.x64})\n- [Windows](${downloads.windows})\n- [Linux](${downloads.linux})`,
      `[All release assets](${downloads.releasesUrl})`, `[Installation guide](${SITE_URL}/docs/getting-started/installation.md)`];
  } else if (path === "/changelog") {
    lines = ["# Synara changelog", "Every release, newest first. Follow a version link for its complete notes.",
      ...getSortedReleases().map(e => `- [Synara ${e.version} — ${e.date}](${SITE_URL}/changelog/${toVersionSlug(e.version)}.md)`)];
  } else if (path.startsWith("/changelog/")) {
    const entry = getSortedReleases().find(e => path === `/changelog/${toVersionSlug(e.version)}`);
    if (!entry) return null;
    lines = [`# Synara ${entry.version}`, entry.date,
      ...entry.features.flatMap(f => [`## ${f.title}`, f.description, ...(f.details ? [f.details] : [])]),
      `[All releases](${SITE_URL}/changelog.md)`];
  } else if (path === "/privacy") {
    lines = [PRIVACY_MARKDOWN];
  } else if (path === "/sponsors") {
    lines = ["# Synara sponsors", "The people keeping Synara free. Synara is funded entirely by sponsorship, with no paid tier and no company behind it.",
      ...orderedSponsors().map(s => `- [${s.name}](${sponsorLink(s)})${s.since ? ` — since ${s.since}` : ""}`),
      `[Sponsorship tiers](${SITE_URL}/sponsor.md)`];
  } else if (path === "/sponsor") {
    lines = ["# Sponsor Synara", "Help keep Synara free and open source. Sponsorship is handled through GitHub Sponsors.",
      ...SPONSOR_FUNDING_USES.flatMap(u => [`## ${u.title}`, u.body]),
      ...SPONSOR_TIERS.flatMap(t => [`## ${t.label} — $${t.amount} USD per month`, t.tagline, ...t.perks.map(p => `- ${p}`), `[Choose this tier](${monthlyTierCheckoutUrl(t.amount)})`]),
      `## ${ONE_TIME_SPONSORSHIP.label}`, ONE_TIME_SPONSORSHIP.tagline, ...ONE_TIME_SPONSORSHIP.perks.map(p => `- ${p}`), `[One-time contribution](${ONE_TIME_CHECKOUT_URL})`,
      `[GitHub Sponsors](${GITHUB_SPONSORS_URL})`, `[Sponsor wall](${SITE_URL}/sponsors.md)`];
  } else return null;
  return `${lines.join("\n\n")}\n\nCanonical URL: ${SITE_URL}${path}\n\n[Agent content index](${SITE_URL}/llms.txt)`;
}
