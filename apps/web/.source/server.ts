// @ts-nocheck
import * as __fd_glob_17 from "../content/docs/reference-implementation/quickstart.mdx?collection=docs"
import * as __fd_glob_16 from "../content/docs/reference-implementation/cli-reference.mdx?collection=docs"
import * as __fd_glob_15 from "../content/docs/reference-implementation/architecture.mdx?collection=docs"
import * as __fd_glob_14 from "../content/docs/integration/examples.mdx?collection=docs"
import * as __fd_glob_13 from "../content/docs/integration/cli-serve-protocol.mdx?collection=docs"
import * as __fd_glob_12 from "../content/docs/foundations/sonde.mdx?collection=docs"
import * as __fd_glob_11 from "../content/docs/foundations/sondage-manifest.mdx?collection=docs"
import * as __fd_glob_10 from "../content/docs/foundations/glossary.mdx?collection=docs"
import * as __fd_glob_9 from "../content/docs/foundations/ai-native-cli-requirements.mdx?collection=docs"
import * as __fd_glob_8 from "../content/docs/help/troubleshooting.mdx?collection=docs"
import * as __fd_glob_7 from "../content/docs/evaluation/scoring-100-guide.mdx?collection=docs"
import * as __fd_glob_6 from "../content/docs/index.mdx?collection=docs"
import { default as __fd_glob_5 } from "../content/docs/reference-implementation/meta.json?collection=docs"
import { default as __fd_glob_4 } from "../content/docs/integration/meta.json?collection=docs"
import { default as __fd_glob_3 } from "../content/docs/help/meta.json?collection=docs"
import { default as __fd_glob_2 } from "../content/docs/foundations/meta.json?collection=docs"
import { default as __fd_glob_1 } from "../content/docs/evaluation/meta.json?collection=docs"
import { default as __fd_glob_0 } from "../content/docs/meta.json?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.docs("docs", "content/docs", {"meta.json": __fd_glob_0, "evaluation/meta.json": __fd_glob_1, "foundations/meta.json": __fd_glob_2, "help/meta.json": __fd_glob_3, "integration/meta.json": __fd_glob_4, "reference-implementation/meta.json": __fd_glob_5, }, {"index.mdx": __fd_glob_6, "evaluation/scoring-100-guide.mdx": __fd_glob_7, "help/troubleshooting.mdx": __fd_glob_8, "foundations/ai-native-cli-requirements.mdx": __fd_glob_9, "foundations/glossary.mdx": __fd_glob_10, "foundations/sondage-manifest.mdx": __fd_glob_11, "foundations/sonde.mdx": __fd_glob_12, "integration/cli-serve-protocol.mdx": __fd_glob_13, "integration/examples.mdx": __fd_glob_14, "reference-implementation/architecture.mdx": __fd_glob_15, "reference-implementation/cli-reference.mdx": __fd_glob_16, "reference-implementation/quickstart.mdx": __fd_glob_17, });