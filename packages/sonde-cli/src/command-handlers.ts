import path from "node:path";

import { generateManifest } from "@repo/generator";
import { runCommand } from "@repo/runtime";
import { scoreManifest } from "@repo/scoring";
import { loadManifest as loadManifestFromSpec } from "@repo/spec";

import type { CommandContext, SondeManifest } from "./types.js";

export async function loadManifest(cwd: string): Promise<SondeManifest> {
  const loaded = await loadManifestFromSpec(path.resolve(cwd, "sondage.manifest.json"));
  if (!loaded.ok) {
    throw new Error(`${loaded.error.code}: ${loaded.error.message}`);
  }
  return loaded.manifest;
}

export async function handleGenerate(context: CommandContext): Promise<unknown> {
  return generateManifest({
    cli: context.cli,
  });
}

export async function handleRun(context: CommandContext): Promise<unknown> {
  const manifest = await loadManifest(context.cwd);
  return runCommand({
    command: context.cli,
    args: ["--help"],
    availableOptions: manifest.globalOptions,
    cwd: context.cwd,
    preferJson: true,
    preferNonInteractive: true,
  });
}

export async function handleScore(context: CommandContext): Promise<unknown> {
  const manifest = await loadManifest(context.cwd);
  const baselineRun = await runCommand({
    command: context.cli,
    args: ["--help"],
    availableOptions: manifest.globalOptions,
    cwd: context.cwd,
    preferJson: true,
    preferNonInteractive: true,
  });
  const repeatRun = await runCommand({
    command: context.cli,
    args: ["--help"],
    availableOptions: manifest.globalOptions,
    cwd: context.cwd,
    preferJson: true,
    preferNonInteractive: true,
  });

  return scoreManifest({
    manifest,
    runResults: [baselineRun, repeatRun],
  });
}
