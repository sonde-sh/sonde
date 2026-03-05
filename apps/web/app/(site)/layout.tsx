import type { Metadata } from "next";
import Link from "next/link";

import { ThemeToggle } from "../../components/theme-toggle";

export const metadata: Metadata = {
  title: "Sonde Web",
  description: "Developer-oriented Sonde sondages and report explorer",
};

interface SiteLayoutProps {
  children: React.ReactNode;
}

export default function SiteLayout({ children }: Readonly<SiteLayoutProps>) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link className="text-sm font-semibold tracking-tight" href="/">
              Sonde
            </Link>
            <nav className="flex items-center gap-4 text-sm text-[var(--muted-foreground)]">
              <Link className="hover:text-[var(--foreground)]" href="/">
                Home
              </Link>
              <Link className="hover:text-[var(--foreground)]" href="/sondages">
                Sondages
              </Link>
              <Link className="hover:text-[var(--foreground)]" href="/docs">
                Docs
              </Link>
            </nav>
          </div>
          <ThemeToggle />
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
