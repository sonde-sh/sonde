// @ts-nocheck
import * as __fd_glob_5 from "../content/docs/sonde.mdx?collection=docs"
import * as __fd_glob_4 from "../content/docs/sondage-manifest.mdx?collection=docs"
import * as __fd_glob_3 from "../content/docs/index.mdx?collection=docs"
import * as __fd_glob_2 from "../content/docs/examples.mdx?collection=docs"
import * as __fd_glob_1 from "../content/docs/cli-reference.mdx?collection=docs"
import { default as __fd_glob_0 } from "../content/docs/meta.json?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.docs("docs", "content/docs", {"meta.json": __fd_glob_0, }, {"cli-reference.mdx": __fd_glob_1, "examples.mdx": __fd_glob_2, "index.mdx": __fd_glob_3, "sondage-manifest.mdx": __fd_glob_4, "sonde.mdx": __fd_glob_5, });