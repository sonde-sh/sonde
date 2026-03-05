import path from "node:path";
import process from "node:process";

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
  return evaluateManifestReliability(manifest, context.cwd);
}

interface PublishReportPayload {
  cli: string;
  manifestVersion: string;
  generatedAt: string;
  schemaValid: boolean;
  score: number;
  jsonSupport: boolean;
  interactivePrompts: boolean;
  notes: string;
  sourceVersion?: string;
  report: Record<string, unknown>;
}

export async function handlePublish(context: CommandContext): Promise<unknown> {
  const publishUrl = readRequiredEnv("SONDE_PUBLISH_URL");
  const publishToken = readRequiredEnv("SONDE_PUBLISH_TOKEN");

  const scoreResult = await handleScore(context);
  const report = normalizeScoreToPublishPayload(context.cli, scoreResult);

  const response = await fetch(publishUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-sonde-publish-token": publishToken,
    },
    body: JSON.stringify(report),
  });

  const rawBody = await response.text();
  const parsedBody = parseJsonSafely(rawBody);
  if (!response.ok) {
    const message =
      readErrorMessage(parsedBody) ??
      `Publish request failed (${response.status})${rawBody ? `: ${rawBody}` : ""}`;
    throw new Error(message);
  }

  return {
    publishUrl,
    report,
    response: parsedBody ?? rawBody,
  };
}

function normalizeScoreToPublishPayload(cli: string, scoreResult: unknown): PublishReportPayload {
  if (!isObject(scoreResult)) {
    throw new Error("Invalid score payload: expected an object");
  }

  const manifestVersion = readString(scoreResult.manifestVersion);
  const generatedAt = readString(scoreResult.generatedAt);
  const notes = readString(scoreResult.notes);
  const jsonSupport = scoreResult.jsonSupport;
  const interactivePrompts = scoreResult.interactivePrompts;
  const total = scoreResult.total;

  if (!manifestVersion) {
    throw new Error("Invalid score payload: missing manifestVersion");
  }
  if (!generatedAt) {
    throw new Error("Invalid score payload: missing generatedAt");
  }
  if (typeof total !== "number" || !Number.isFinite(total)) {
    throw new Error("Invalid score payload: missing total score");
  }
  if (typeof jsonSupport !== "boolean") {
    throw new Error("Invalid score payload: missing jsonSupport boolean");
  }
  if (typeof interactivePrompts !== "boolean") {
    throw new Error("Invalid score payload: missing interactivePrompts boolean");
  }
  if (!notes) {
    throw new Error("Invalid score payload: missing notes");
  }

  return {
    cli,
    manifestVersion,
    generatedAt,
    schemaValid: true,
    score: Math.round(total),
    jsonSupport,
    interactivePrompts,
    notes,
    sourceVersion: readString(process.env.npm_package_version) ?? undefined,
    report: scoreResult,
  };
}

async function evaluateManifestReliability(
  manifest: SondeManifest,
  cwd: string,
): Promise<unknown> {
  const baselineRun = await runCommand({
    command: manifest.cli.binary,
    args: ["--help"],
    availableOptions: manifest.globalOptions,
    cwd,
    preferJson: true,
    preferNonInteractive: true,
  });
  const repeatRun = await runCommand({
    command: manifest.cli.binary,
    args: ["--help"],
    availableOptions: manifest.globalOptions,
    cwd,
    preferJson: true,
    preferNonInteractive: true,
  });

  return scoreManifest({
    manifest,
    runResults: [baselineRun, repeatRun],
  });
}

function readRequiredEnv(key: string): string {
  const value = process.env[key];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value.trim();
}

function readString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseJsonSafely(value: string): unknown {
  if (value.trim().length === 0) {
    return null;
  }
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

function readErrorMessage(value: unknown): string | null {
  if (!isObject(value)) {
    return null;
  }
  const nestedError = value.error;
  if (isObject(nestedError)) {
    const nestedMessage = readString(nestedError.message);
    if (nestedMessage) {
      return nestedMessage;
    }
  }
  return readString(value.message);
}
