// FILE: update-installer-downloads.mjs
// Purpose: Refreshes the stored installer download total from GitHub releases.
// Layer: Maintenance script for the Codex daily automation
// Depends on: GitHub Releases API, src/data/installer-downloads.json

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const outputPath = resolve(projectRoot, "src/data/installer-downloads.json");
const releasesApiUrl =
  "https://api.github.com/repos/Emanuele-web04/dpcode/releases";
const installerFilePattern = /\.(dmg|exe|AppImage)$/i;

// Fetches every releases page so the stored figure remains a true all-time total.
async function fetchAllReleases() {
  const releases = [];

  for (let page = 1; ; page += 1) {
    const url = new URL(releasesApiUrl);
    url.searchParams.set("per_page", "100");
    url.searchParams.set("page", String(page));

    const headers = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(
        `GitHub Releases API failed: ${response.status} ${response.statusText}`
      );
    }

    const pageReleases = await response.json();

    if (!Array.isArray(pageReleases) || pageReleases.length === 0) {
      break;
    }

    releases.push(...pageReleases);
  }

  return releases;
}

function countInstallerDownloads(releases) {
  return releases.reduce((total, release) => {
    const releaseTotal =
      release.assets?.reduce((assetTotal, asset) => {
        if (!asset.name || !installerFilePattern.test(asset.name)) {
          return assetTotal;
        }

        return assetTotal + (asset.download_count ?? 0);
      }, 0) ?? 0;

    return total + releaseTotal;
  }, 0);
}

async function readExistingSnapshot() {
  try {
    return JSON.parse(await readFile(outputPath, "utf8"));
  } catch {
    return null;
  }
}

const releases = await fetchAllReleases();
const count = countInstallerDownloads(releases);

if (count <= 0) {
  throw new Error("Refusing to write an empty installer download count.");
}

const previousSnapshot = await readExistingSnapshot();
const nextSnapshot = {
  count,
  updatedAt: new Date().toISOString(),
  source: releasesApiUrl,
};

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(nextSnapshot, null, 2)}\n`);

const previousCount = previousSnapshot?.count ?? "unknown";
console.log(`Installer downloads: ${previousCount} -> ${count}`);
