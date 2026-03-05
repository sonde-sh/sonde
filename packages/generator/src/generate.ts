import { execa } from "execa";

import type { StmManifestV1 } from "@repo/spec";

import { parseHelpText } from "./help-parser.js";
import { generateManifestFromHelp } from "./manifest-generator.js";
import { DEFAULT_OUTPUT_FILE, writeManifestFile } from "./writer.js";

export interface GenerateManifestInput {
  cli: string;
  outputPath?: string;
}

export interface GenerateManifestResult {
  manifest: StmManifestV1;
  outputPath: string;
  commandCount: number;
}

async function runHelp(cli: string, args: string[]): Promise<string> {
  const result = await execa(cli, args, {
    reject: false,
    timeout: 10_000,
    windowsHide: true,
  });
  return `${result.stdout}\n${result.stderr}`.trim();
}

export async function generateManifest(
  input: GenerateManifestInput,
): Promise<GenerateManifestResult> {
  const rootHelp = await runHelp(input.cli, ["--help"]);
  const parsedRoot = parseHelpText(rootHelp);
  const commands: Record<string, string> = {};

  for (const commandName of parsedRoot.subcommands) {
    const commandPath = commandName.split(" ");
    const commandHelp = await runHelp(input.cli, [...commandPath, "--help"]);
    commands[commandName] = commandHelp;
  }

  const manifest = generateManifestFromHelp({
    cliName: input.cli,
    binary: input.cli,
    generatedAt: new Date().toISOString(),
    help: {
      root: rootHelp,
      commands,
    },
  });

  const outputPath = await writeManifestFile(
    manifest,
    input.outputPath ?? DEFAULT_OUTPUT_FILE,
  );

  return {
    manifest,
    outputPath,
    commandCount: manifest.commands.length,
  };
}
