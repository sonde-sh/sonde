import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

import { beforeAll, describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);
const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const workspaceRoot = path.resolve(packageRoot, "..", "..");

describe("sonde binary", () => {
  beforeAll(async () => {
    await execFileAsync("pnpm", ["--filter", "@sonde-sh/sonde...", "build"], {
      cwd: workspaceRoot,
    });
  }, 30_000);

  it(
    "runs the built dist binary in json mode",
    async () => {
    const fixtureDir = await mkdtemp(path.join(tmpdir(), "sonde-cli-bin-test-"));
    const manifestPath = path.join(fixtureDir, "sondage.manifest.json");
    await writeFile(
      manifestPath,
      JSON.stringify(
        {
          version: "1.0.0",
          generatedAt: "2026-01-01T00:00:00.000Z",
          cli: {
            name: "node",
            binary: "node",
          },
          globalOptions: [
            {
              long: "--help",
              takesValue: false,
            },
          ],
          commands: [],
        },
        null,
        2,
      ),
      "utf8",
    );

    const result = await execFileAsync(
      "node",
      [path.join(packageRoot, "dist/src/bin.js"), "run", "ignored-cli", "--json"],
      { cwd: fixtureDir },
    );

    const parsed = JSON.parse(result.stdout);
      expect(parsed).toEqual(
        expect.objectContaining({
          ok: true,
          apiVersion: "1.0.0",
          command: "run",
          cli: "ignored-cli",
        }),
      );
    },
    20_000,
  );

  it(
    "prints built-in manifest in json mode",
    async () => {
      const result = await execFileAsync("node", [
        path.join(packageRoot, "dist/src/bin.js"),
        "manifest",
        "--json",
      ]);

      const parsed = JSON.parse(result.stdout);
      expect(parsed).toEqual(
        expect.objectContaining({
          ok: true,
          apiVersion: "1.0.0",
          command: "manifest",
          result: expect.objectContaining({
            version: "1.0.0",
            cli: expect.objectContaining({
              name: "sonde",
              binary: "sonde",
            }),
          }),
        }),
      );
    },
    20_000,
  );
});
