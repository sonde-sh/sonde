import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export const GITHUB_REPOSITORY_URL = "https://github.com/sonde-sh/sonde";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: "Sonde Docs",
    },
    githubUrl: GITHUB_REPOSITORY_URL,
    links: [
      {
        text: "Home",
        url: "/",
      },
      {
        text: "Sondages",
        url: "/sondages",
      },
    ],
  };
}
