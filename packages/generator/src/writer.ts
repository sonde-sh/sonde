import { writeFile } from "node:fs/promises";
import path from "node:path";

import { validateManifest } from "@sonde-sh/spec";
import type { StmManifestV1 } from "@sonde-sh/spec";

export const DEFAULT_OUTPUT_FILE = "sondage.manifest.json";

function stableObject(input: unknown): unknown {
  if (Array.isArray(input)) {
    return input.map((value) => stableObject(value));
  }

  if (input && typeof input === "object") {
    const objectInput = input as Record<string, unknown>;
    const keys = Object.keys(objectInput).sort((left, right) =>
      left.localeCompare(right),
    );
    const output: Record<string, unknown> = {};
    for (const key of keys) {
      output[key] = stableObject(objectInput[key]);
    }
    return output;
  }

  return input;
}

export function toStableManifestJson(manifest: StmManifestV1): string {
  const validated = validateManifest(manifest);
  const sorted = stableObject(validated);
  return `${JSON.stringify(sorted, null, 2)}\n`;
}

export async function writeManifestFile(
  manifest: StmManifestV1,
  outputPath = DEFAULT_OUTPUT_FILE,
): Promise<string> {
  const absolutePath = path.resolve(outputPath);
  const jsonOutput = toStableManifestJson(manifest);
  await writeFile(absolutePath, jsonOutput, "utf8");
  return absolutePath;
}
