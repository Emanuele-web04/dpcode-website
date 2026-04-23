export async function getStars(): Promise<number | null> {
  try {
    const res = await fetch(
      "https://api.github.com/repos/Emanuele-web04/dpcode",
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.stargazers_count ?? null;
  } catch {
    return null;
  }
}

export function formatStars(count: number): string {
  if (count >= 1000) {
    const k = count / 1000;
    return k >= 100
      ? `${Math.round(k)}K`
      : `${k.toFixed(1).replace(/\.0$/, "")}K`;
  }
  return count.toString();
}
