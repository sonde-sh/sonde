import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: "Sonde Docs",
    },
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
