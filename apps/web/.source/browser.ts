// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  docs: create.doc("docs", {"cli-reference.mdx": () => import("../content/docs/cli-reference.mdx?collection=docs"), "examples.mdx": () => import("../content/docs/examples.mdx?collection=docs"), "index.mdx": () => import("../content/docs/index.mdx?collection=docs"), "sondage-manifest.mdx": () => import("../content/docs/sondage-manifest.mdx?collection=docs"), "sonde.mdx": () => import("../content/docs/sonde.mdx?collection=docs"), }),
};
export default browserCollections;