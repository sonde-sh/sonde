import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  generateManifestFromHelp,
  parseHelpText,
  writeManifestFile,
} from "../src/index.js";

describe("help parser", () => {
  it("extracts options and commands deterministically", () => {
    const parsed = parseHelpText(`
mycli - sample

Usage: mycli [command]

Options:
  -h, --help           Show help
  --json <format>      Output as json

Commands:
  deploy               Deploy app
  logs                 Show logs
`);

    expect(parsed.options.map((option) => option.long)).toEqual([
      "--help",
      "--json",
    ]);
    expect(parsed.subcommands).toEqual(["deploy", "logs"]);
  });
});

describe("manifest generator", () => {
  it("builds manifest with json support signals", () => {
    const manifest = generateManifestFromHelp({
      cliName: "mycli",
      binary: "mycli",
      generatedAt: "2026-01-01T00:00:00.000Z",
      help: {
        root: `
mycli root help
Usage: mycli [command]
Options:
  -h, --help Show help
`,
        commands: {
          deploy: `
Usage: mycli deploy
Options:
  --json Output json
`,
        },
      },
    });

    expect(manifest.commands[0]?.name).toBe("deploy");
    expect(manifest.commands[0]?.supportsJson).toBe(true);
  });

  it("writes deterministic json output", async () => {
    const manifest = generateManifestFromHelp({
      cliName: "mycli",
      binary: "mycli",
      generatedAt: "2026-01-01T00:00:00.000Z",
      help: {
        root: "Usage: mycli",
        commands: {},
      },
    });

    const tempDir = await mkdtemp(path.join(tmpdir(), "generator-test-"));
    const outputPath = path.join(tempDir, "sondage.manifest.json");
    await writeManifestFile(manifest, outputPath);
    const written = await readFile(outputPath, "utf8");

    expect(written.startsWith("{\n")).toBe(true);
    expect(written.includes('"version": "1"')).toBe(true);
  });
});
