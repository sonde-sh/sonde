import type { Metadata } from "next";
import { RootProvider } from "fumadocs-ui/provider/next";

import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";

export const metadata: Metadata = {
  title: "Sonde",
  description: "Sonde web app and documentation",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html className="h-full" lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          <RootProvider>{children}</RootProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

export default RootLayout;
