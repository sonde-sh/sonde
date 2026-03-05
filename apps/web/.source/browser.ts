// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  docs: create.doc("docs", {"architecture.mdx": () => import("../content/docs/architecture.mdx?collection=docs"), "cli-reference.mdx": () => import("../content/docs/cli-reference.mdx?collection=docs"), "cli-serve-protocol.mdx": () => import("../content/docs/cli-serve-protocol.mdx?collection=docs"), "examples.mdx": () => import("../content/docs/examples.mdx?collection=docs"), "glossary.mdx": () => import("../content/docs/glossary.mdx?collection=docs"), "index.mdx": () => import("../content/docs/index.mdx?collection=docs"), "quickstart.mdx": () => import("../content/docs/quickstart.mdx?collection=docs"), "scoring-100-guide.mdx": () => import("../content/docs/scoring-100-guide.mdx?collection=docs"), "sondage-manifest.mdx": () => import("../content/docs/sondage-manifest.mdx?collection=docs"), "sonde.mdx": () => import("../content/docs/sonde.mdx?collection=docs"), "troubleshooting.mdx": () => import("../content/docs/troubleshooting.mdx?collection=docs"), }),
};
export default browserCollections;