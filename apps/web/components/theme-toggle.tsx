"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const nextTheme = isDark ? "light" : "dark";

  return (
    <button
      aria-label={`Switch to ${nextTheme} theme`}
      aria-checked={isDark}
      onClick={() => setTheme(nextTheme)}
      role="switch"
      type="button"
      className="relative inline-flex h-7 w-12 items-center rounded-full border border-(--border) bg-(--muted) p-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--primary) focus-visible:ring-offset-2 focus-visible:ring-offset-(--background)"
    >
      <span
        className={`absolute left-1 inline-flex size-5 items-center justify-center rounded-full bg-(--background) shadow-sm transition-transform ${isDark ? "translate-x-5" : "translate-x-0"}`}
      >
        {isDark ? <Moon className="size-3" /> : <Sun className="size-3" />}
      </span>
      <span className="sr-only">{isDark ? "Dark theme" : "Light theme"}</span>
    </button>
  );
}
