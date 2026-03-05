import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { loadManifest, validateManifest } from "../src/index.js";

const validManifest = {
  version: "1.0.0",
  generatedAt: "2026-01-01T00:00:00.000Z",
  cli: {
    name: "example",
    binary: "example",
  },
  globalOptions: [],
  commands: [],
};

describe("spec validation", () => {
  it("validates a minimal STM manifest", () => {
    const parsed = validateManifest(validManifest);
    expect(parsed.version).toBe("1.0.0");
    expect(parsed.commands).toEqual([]);
  });

  it("returns INVALID_JSON for malformed content", async () => {
    const tempDir = await mkdtemp(path.join(tmpdir(), "spec-test-"));
    const manifestPath = path.join(tempDir, "sondage.manifest.json");
    await writeFile(manifestPath, "{ invalid", "utf8");

    const result = await loadManifest(manifestPath);
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error.code).toBe("INVALID_JSON");
  });

  it("returns VALIDATION_FAILED when required fields are missing", async () => {
    const tempDir = await mkdtemp(path.join(tmpdir(), "spec-test-"));
    const manifestPath = path.join(tempDir, "sondage.manifest.json");
    await writeFile(
      manifestPath,
      JSON.stringify({ version: "1.0.0", generatedAt: "2026-01-01T00:00:00.000Z" }),
      "utf8",
    );

    const result = await loadManifest(manifestPath);
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error.code).toBe("VALIDATION_FAILED");
    expect(Array.isArray(result.error.details)).toBe(true);
  });

  it("returns UNSUPPORTED_VERSION for unsupported major versions", async () => {
    const tempDir = await mkdtemp(path.join(tmpdir(), "spec-test-"));
    const manifestPath = path.join(tempDir, "sondage.manifest.json");
    await writeFile(
      manifestPath,
      JSON.stringify({
        version: "2.0.0",
        generatedAt: "2026-01-01T00:00:00.000Z",
        cli: {
          name: "example",
          binary: "example",
        },
        globalOptions: [],
        commands: [],
      }),
      "utf8",
    );

    const result = await loadManifest(manifestPath);
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error.code).toBe("UNSUPPORTED_VERSION");
  });
});
