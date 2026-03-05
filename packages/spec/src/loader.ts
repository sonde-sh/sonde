import { readFile } from "node:fs/promises";
import path from "node:path";

import { stmManifestV1Schema } from "./schema.js";
import type { DeterministicError, LoadManifestResult } from "./types.js";

const DEFAULT_MANIFEST_FILE = "sondage.manifest.json";

function failure(error: DeterministicError): LoadManifestResult {
  return { ok: false, error };
}

export async function loadManifest(
  explicitPath?: string,
): Promise<LoadManifestResult> {
  const manifestPath = explicitPath
    ? path.resolve(explicitPath)
    : path.resolve(process.cwd(), DEFAULT_MANIFEST_FILE);

  let rawContent = "";
  try {
    rawContent = await readFile(manifestPath, "utf8");
  } catch (error: unknown) {
    const nodeError = error as NodeJS.ErrnoException;
    if (nodeError.code === "ENOENT") {
      return failure({
        code: "MISSING_FILE",
        message: `Manifest file not found at ${manifestPath}`,
      });
    }
    return failure({
      code: "READ_FAILED",
      message: `Unable to read manifest file at ${manifestPath}`,
      details: nodeError.message,
    });
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(rawContent);
  } catch (error: unknown) {
    const parseError = error as Error;
    return failure({
      code: "INVALID_JSON",
      message: `Manifest file contains invalid JSON at ${manifestPath}`,
      details: parseError.message,
    });
  }

  const validationResult = stmManifestV1Schema.safeParse(parsedJson);
  if (!validationResult.success) {
    const details = validationResult.error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
    return failure({
      code: "VALIDATION_FAILED",
      message: "Manifest JSON does not match STM v1 schema",
      details,
    });
  }

  return { ok: true, manifest: validationResult.data };
}

export { DEFAULT_MANIFEST_FILE };
