import type { Metadata } from "next";
import Link from "next/link";

import { ThemeToggle } from "../../components/theme-toggle";
import { GITHUB_REPOSITORY_URL } from "../../lib/layout.shared";

export const metadata: Metadata = {
  title: "Sonde Web",
  description: "Developer-oriented Sonde sondages and report explorer",
};

interface SiteLayoutProps {
  children: React.ReactNode;
}

export default function SiteLayout({ children }: Readonly<SiteLayoutProps>) {
  return (
    <div className="flex min-h-screen flex-col bg-(--background) text-(--foreground)">
      <header className="border-b border-(--border) bg-(--background)/90 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link className="text-sm font-semibold tracking-tight" href="/">
              Sonde
            </Link>
            <nav className="flex items-center gap-4 text-sm text-(--muted-foreground)">
              <Link className="hover:text-(--foreground)" href="/">
                Home
              </Link>
              <Link className="hover:text-(--foreground)" href="/sondages">
                Sondages
              </Link>
              <Link className="hover:text-(--foreground)" href="/docs">
                Docs
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <a
              aria-label="Open GitHub repository"
              className="text-(--muted-foreground) hover:text-(--foreground)"
              href={GITHUB_REPOSITORY_URL}
              rel="noreferrer noopener"
              target="_blank"
            >
              <svg
                aria-hidden="true"
                className="size-4 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12a12 12 0 0 0 8.21 11.39c.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.34-1.76-1.34-1.76-1.1-.75.08-.74.08-.74 1.21.09 1.85 1.25 1.85 1.25 1.08 1.84 2.82 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.39 1.24-3.24-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.24a11.42 11.42 0 0 1 6.01 0c2.29-1.56 3.3-1.24 3.3-1.24.66 1.65.24 2.87.12 3.17.77.85 1.24 1.93 1.24 3.24 0 4.61-2.81 5.62-5.49 5.92.43.37.82 1.1.82 2.23v3.3c0 .32.22.69.82.58A12 12 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
              </svg>
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
      <footer className="mt-14 border-t border-(--border) bg-(--card)/40">
        <div className="mx-auto grid w-full max-w-5xl gap-10 px-4 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="space-y-4">
            <p className="text-base font-semibold tracking-tight">Sonde</p>
            <p className="max-w-md text-sm leading-relaxed text-(--muted-foreground)">
              A shared manifest for CLI tools so LLMs can leverage them with
              predictable behavior across ecosystems, versions, and CI
              environments.
            </p>
          </div>
          <div className="space-y-3 text-sm">
            <p className="font-medium">Project</p>
            <div className="space-y-2 text-(--muted-foreground)">
              <p>
                <Link className="hover:text-(--foreground)" href="/sondages">
                  Reports
                </Link>
              </p>
              <p>
                <Link className="hover:text-(--foreground)" href="/docs">
                  Documentation
                </Link>
              </p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <p className="font-medium">Community</p>
            <div className="space-y-2 text-(--muted-foreground)">
              <p>
                <a
                  className="hover:text-(--foreground)"
                  href={GITHUB_REPOSITORY_URL}
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  GitHub
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
