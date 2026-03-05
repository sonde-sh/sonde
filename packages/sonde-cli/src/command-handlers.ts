import path from "node:path";

import { generateManifest } from "@sonde-sh/generator";
import { runCommand } from "@sonde-sh/runtime";
import { scoreManifest } from "@sonde-sh/scoring";
import { loadManifest as loadManifestFromSpec } from "@sonde-sh/spec";

import { createSondeSelfManifest } from "./self-manifest.js";
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

export async function handleManifest(): Promise<unknown> {
  return createSondeSelfManifest();
}

export async function handleRun(context: CommandContext): Promise<unknown> {
  const manifest = await loadManifest(context.cwd);
  return runCommand({
    command: manifest.cli.binary,
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
    command: manifest.cli.binary,
    args: ["--help"],
    availableOptions: manifest.globalOptions,
    cwd: context.cwd,
    preferJson: true,
    preferNonInteractive: true,
  });
  const repeatRun = await runCommand({
    command: manifest.cli.binary,
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
