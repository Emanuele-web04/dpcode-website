import Image from "next/image";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { formatStars, getStars } from "@/lib/githubStars";
import { ThemeToggle } from "@/components/ThemeToggle";

export default async function Navbar() {
  const stars = await getStars();
  return (
    <nav className="w-full px-4 py-4 sm:px-6">
      <div className="mx-auto flex h-9 max-w-6xl items-center justify-between gap-2 sm:gap-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-[14px] font-medium tracking-[-0.02em] text-[var(--text-primary)]"
        >
          <Image
            src="/dpcode-icon.png"
            alt="DP Code"
            width={22}
            height={22}
            className="rounded-[5px] border border-[var(--divide)]"
          />
          <span className="hidden sm:inline">DP Code</span>
        </Link>

        {/*
          Middle nav: at <360px the page can only fit logo + 2 links + Download
          + ThemeToggle. We progressively reveal links — only X is visible by
          default, YouTube/GitHub join in at xs+/sm+, Website at sm+.
        */}
        <div className="flex min-w-0 flex-1 items-center justify-center gap-3 text-[13px] text-[var(--text-tertiary)] sm:gap-6">
          <a
            href="https://x.com/emanueledpt"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 transition-colors hover:text-[var(--text-primary)]"
          >
            X
          </a>
          <a
            href="https://youtube.com/@emanueledpt"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden shrink-0 transition-colors hover:text-[var(--text-primary)] min-[400px]:inline"
          >
            YouTube
          </a>
          <a
            href="https://github.com/Emanuele-web04/dpcode"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 transition-colors hover:text-[var(--text-primary)]"
          >
            GitHub
          </a>
          <a
            href="https://emanueledipietro.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden shrink-0 transition-colors hover:text-[var(--text-primary)] sm:inline"
          >
            Website
          </a>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <ThemeToggle />
          {stars !== null ? (
            <a
              href="https://github.com/Emanuele-web04/dpcode"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 text-[13px] text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-primary)] sm:flex"
            >
              <FaGithub className="size-4 text-[var(--text-primary)]" />
              {formatStars(stars)}
            </a>
          ) : null}
          <a
            href="https://github.com/Emanuele-web04/dpcode/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-[var(--divide)] px-3 py-1 text-[12.5px] font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--mock-row)] sm:px-3.5 sm:text-[13px]"
          >
            Download
          </a>
        </div>
      </div>
    </nav>
  );
}
