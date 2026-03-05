import { DocsLayout } from "fumadocs-ui/layouts/docs";

import { baseOptions } from "../../../lib/layout.shared";
import { source } from "../../../lib/source";

interface DocsLayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: Readonly<DocsLayoutProps>) {
  return (
    <DocsLayout tree={source.getPageTree()} {...baseOptions()}>
      {children}
    </DocsLayout>
  );
}
