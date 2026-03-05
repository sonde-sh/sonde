// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  docs: create.doc("docs", {"index.mdx": () => import("../content/docs/index.mdx?collection=docs"), "evaluation/scoring-100-guide.mdx": () => import("../content/docs/evaluation/scoring-100-guide.mdx?collection=docs"), "foundations/ai-native-cli-requirements.mdx": () => import("../content/docs/foundations/ai-native-cli-requirements.mdx?collection=docs"), "foundations/glossary.mdx": () => import("../content/docs/foundations/glossary.mdx?collection=docs"), "foundations/sondage-manifest.mdx": () => import("../content/docs/foundations/sondage-manifest.mdx?collection=docs"), "foundations/sonde.mdx": () => import("../content/docs/foundations/sonde.mdx?collection=docs"), "help/troubleshooting.mdx": () => import("../content/docs/help/troubleshooting.mdx?collection=docs"), "integration/cli-serve-protocol.mdx": () => import("../content/docs/integration/cli-serve-protocol.mdx?collection=docs"), "integration/examples.mdx": () => import("../content/docs/integration/examples.mdx?collection=docs"), "integration/report-publishing.mdx": () => import("../content/docs/integration/report-publishing.mdx?collection=docs"), "reference-implementation/architecture.mdx": () => import("../content/docs/reference-implementation/architecture.mdx?collection=docs"), "reference-implementation/cli-reference.mdx": () => import("../content/docs/reference-implementation/cli-reference.mdx?collection=docs"), "reference-implementation/quickstart.mdx": () => import("../content/docs/reference-implementation/quickstart.mdx?collection=docs"), }),
};
export default browserCollections;