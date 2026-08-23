// Framework-free Accept negotiation for the Markdown feature. Pure module so
// it can be unit-tested with node --test without pulling in next/server.
//
// Rule (RFC 9110, with an explicit-markdown bias):
// - A missing or empty Accept header means HTML (the canonical default).
// - text/markdown only counts when the client names it explicitly. A bare
//   `Accept: */*` (curl's default) or `Accept: text/*` does not select
//   Markdown; those requests keep the canonical HTML.
// - The text/html quality is taken from the most specific matching media
//   range: an exact `text/html` entry beats `text/*`, which beats `*/*`.
// - Markdown wins when it is named explicitly with q > 0 and its quality is
//   at least as high as the text/html quality ("at least as preferred").

export type NegotiatedFormat = "html" | "markdown";

type MediaRange = {
  type: string;
  subtype: string;
  q: number;
};

export function negotiateAcceptFormat(
  acceptHeader: string | null | undefined,
): NegotiatedFormat {
  if (acceptHeader == null) {
    return "html";
  }
  const ranges = parseAccept(acceptHeader);
  const markdownQuality = explicitQuality(ranges, "text", "markdown");
  const htmlQuality = mostSpecificQuality(ranges, "text", "html");
  if (markdownQuality > 0 && markdownQuality >= htmlQuality) {
    return "markdown";
  }
  return "html";
}

// Split an Accept header into media ranges with quality values clamped to
// [0, 1]. Malformed segments are skipped.
function parseAccept(header: string): MediaRange[] {
  const ranges: MediaRange[] = [];
  for (const part of header.split(",")) {
    const [mediaRange = "", ...params] = part
      .split(";")
      .map((segment) => segment.trim());
    if (mediaRange === "") {
      continue;
    }
    const slash = mediaRange.indexOf("/");
    if (slash <= 0 || slash === mediaRange.length - 1) {
      continue;
    }
    const type = mediaRange.slice(0, slash).trim().toLowerCase();
    const subtype = mediaRange.slice(slash + 1).trim().toLowerCase();
    if (type === "" || subtype === "") {
      continue;
    }
    let q = 1;
    for (const param of params) {
      const eq = param.indexOf("=");
      if (eq <= 0) {
        continue;
      }
      if (param.slice(0, eq).trim().toLowerCase() !== "q") {
        continue;
      }
      const value = Number(param.slice(eq + 1).trim());
      if (Number.isFinite(value)) {
        q = Math.min(1, Math.max(0, value));
      }
    }
    ranges.push({ type, subtype, q });
  }
  return ranges;
}

// Highest quality among ranges that name the exact (type, subtype). Entries
// with q = 0 are explicit rejections and never select Markdown.
function explicitQuality(
  ranges: MediaRange[],
  type: string,
  subtype: string,
): number {
  let q = 0;
  for (const range of ranges) {
    if (range.type === type && range.subtype === subtype) {
      q = Math.max(q, range.q);
    }
  }
  return q;
}

// Quality of the most specific matching range: exact (type, subtype), then
// (type, *), then (*, *).
function mostSpecificQuality(
  ranges: MediaRange[],
  type: string,
  subtype: string,
): number {
  let quality = 0;
  let specificity = -1; // 0 = */*, 1 = type/*, 2 = exact
  for (const range of ranges) {
    let rank = -1;
    if (range.type === "*") {
      rank = 0;
    } else if (range.type === type && range.subtype === "*") {
      rank = 1;
    } else if (range.type === type && range.subtype === subtype) {
      rank = 2;
    } else {
      continue;
    }
    if (rank > specificity) {
      specificity = rank;
      quality = range.q;
    }
  }
  return quality;
}
