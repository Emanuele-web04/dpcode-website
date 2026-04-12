// FILE: installerCount.ts
// Purpose: Fetches and summarizes live installer download totals from GitHub releases.
// Layer: Server utility
// Depends on: GitHub Releases API, optional GITHUB_TOKEN, server-only

import "server-only";

const RELEASES_API_URL =
  "https://api.github.com/repos/Emanuele-web04/dpcode/releases?per_page=100";

const INSTALLER_FILE_PATTERN = /\.(dmg|exe|AppImage)$/i;

type GitHubReleaseAsset = {
  download_count?: number;
  name?: string;
};

type GitHubRelease = {
  assets?: GitHubReleaseAsset[];
};

// Counts only actual installer artifacts so updater metadata and blockmaps do not inflate totals.
export function countInstallerDownloads(releases: GitHubRelease[]): number {
  return releases.reduce((total, release) => {
    const releaseTotal =
      release.assets?.reduce((assetTotal, asset) => {
        if (!asset.name || !INSTALLER_FILE_PATTERN.test(asset.name)) {
          return assetTotal;
        }

        return assetTotal + (asset.download_count ?? 0);
      }, 0) ?? 0;

    return total + releaseTotal;
  }, 0);
}

// Fetches the current installer total directly from GitHub with caching disabled.
export async function getInstallerCount(): Promise<number | null> {
  try {
    const headers: HeadersInit = {
      Accept: "application/vnd.github+json",
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(RELEASES_API_URL, {
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const releases = (await response.json()) as GitHubRelease[];
    return countInstallerDownloads(releases);
  } catch {
    return null;
  }
}
