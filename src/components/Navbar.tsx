import Image from "next/image";
import { FaGithub } from "react-icons/fa";

function formatStars(count: number): string {
  if (count >= 1000) {
    const k = count / 1000;
    return k >= 100
      ? `${Math.round(k)}K`
      : `${k.toFixed(1).replace(/\.0$/, "")}K`;
  }
  return count.toString();
}

async function getStars(): Promise<number | null> {
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

export default async function Navbar() {
  const stars = await getStars();
  return (
    <nav className="w-full px-4 pt-5 pb-4 sm:px-6">
      <div className="mx-auto flex h-8 max-w-[1200px] items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 text-[15px] font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          <Image
            src="/dpcode-icon.png"
            alt="DP Code"
            width={24}
            height={24}
            className="rounded-md border border-black/10 dark:border-white/10"
          />
          <span className="hidden sm:inline">DP Code</span>
        </a>

        {/* Socials — centered */}
        <div className="flex items-center gap-5 text-[13px] text-neutral-500 dark:text-neutral-400">
          <a
            href="https://x.com/emanueledpt"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-neutral-900 dark:hover:text-white"
          >
            X
          </a>
          <a
            href="https://youtube.com/@emanueledpt"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-neutral-900 dark:hover:text-white"
          >
            YouTube
          </a>
          <a
            href="https://github.com/Emanuele-web04/dpcode"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-neutral-900 dark:hover:text-white"
          >
            GitHub
          </a>
          <a
            href="https://emanueledipietro.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden transition-colors hover:text-neutral-900 dark:hover:text-white sm:block"
          >
            Website
          </a>
        </div>

        {/* GitHub */}
        <div className="flex items-center gap-4">
          {stars !== null && (
            <a
              href="https://github.com/Emanuele-web04/dpcode"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[13px] text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
            >
              <FaGithub className="size-4" />
              {formatStars(stars)}
            </a>
          )}
          <a
            href="https://github.com/Emanuele-web04/dpcode"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-neutral-900 px-3.5 py-1 text-[13px] font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}
