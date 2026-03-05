import { execa } from "execa";
import type { StmCommand, StmManifestV1, StmOption } from "@sonde-sh/spec";

import { buildPreferredArgs, selectPreferredFlags } from "./flags.js";

export interface RunOptions {
  command: string;
  args: string[];
  cwd?: string;
  env?: Record<string, string>;
  timeoutMs?: number;
  input?: string;
  availableOptions?: StmOption[];
  preferJson?: boolean;
  preferNonInteractive?: boolean;
}

export interface RunErrorInfo {
  code:
    | "TIMEOUT"
    | "EXECUTION_FAILED"
    | "NON_ZERO_EXIT"
    | "INTERACTIVE_PROMPT_DETECTED";
  message: string;
}

export interface RunResult {
  ok: boolean;
  command: string;
  args: string[];
  exitCode: number | null;
  durationMs: number;
  stdout: string;
  stderr: string;
  combinedOutput: string;
  parsedJson?: unknown;
  interactiveDetected: boolean;
  usedPreferences: {
    jsonFlag?: string;
    nonInteractiveFlags: string[];
  };
  error?: RunErrorInfo;
}

export interface ExecuteManifestToolOptions {
  manifest: StmManifestV1;
  toolName: string;
  input: unknown;
  cwd?: string;
}

const INTERACTIVE_PATTERNS = [
  /password/i,
  /select an option/i,
  /choose/i,
  /are you sure/i,
  /press any key/i,
  /\[y\/n\]/i,
  /enter .*:/i,
  /confirm/i,
  /interactive/i,
];

export function detectInteractiveOutput(output: string): boolean {
  return INTERACTIVE_PATTERNS.some((pattern) => pattern.test(output));
}

export async function runCommand(options: RunOptions): Promise<RunResult> {
  const start = Date.now();
  const availableOptions = options.availableOptions ?? [];
  const preferJson = options.preferJson ?? true;
  const preferNonInteractive = options.preferNonInteractive ?? true;

  const selectedFlags = selectPreferredFlags(
    options.args,
    availableOptions,
    preferJson,
    preferNonInteractive,
  );
  const finalArgs = buildPreferredArgs(options.args, selectedFlags);

  try {
    const result = await execa(options.command, finalArgs, {
      cwd: options.cwd,
      env: options.env,
      timeout: options.timeoutMs ?? 10_000,
      input: options.input,
      reject: false,
      stripFinalNewline: false,
      windowsHide: true,
    });

    const combinedOutput = `${result.stdout}\n${result.stderr}`.trim();
    const exitCode = result.exitCode ?? null;
    const parsedJson = tryParseJson(result.stdout);
    const interactiveDetected = detectInteractiveOutput(combinedOutput);
    const nonZeroError = exitCode === 0 ? undefined : {
      code: "NON_ZERO_EXIT" as const,
      message: `Command exited with code ${String(exitCode)}`,
    };
    const interactiveError = interactiveDetected
      ? {
          code: "INTERACTIVE_PROMPT_DETECTED" as const,
          message: "Interactive prompt detected in command output.",
        }
      : undefined;
    return {
      ok: exitCode === 0 && !interactiveDetected,
      command: options.command,
      args: finalArgs,
      exitCode,
      durationMs: Date.now() - start,
      stdout: result.stdout,
      stderr: result.stderr,
      combinedOutput,
      parsedJson,
      interactiveDetected,
      usedPreferences: {
        jsonFlag: selectedFlags.jsonFlag,
        nonInteractiveFlags: selectedFlags.nonInteractiveFlags,
      },
      error: interactiveError ?? nonZeroError,
    };
  } catch (error: unknown) {
    const castError = error as { timedOut?: boolean; message?: string };
    const message =
      castError.message ?? "Unknown process execution failure occurred";
    const combinedOutput = message;
    return {
      ok: false,
      command: options.command,
      args: finalArgs,
      exitCode: null,
      durationMs: Date.now() - start,
      stdout: "",
      stderr: message,
      combinedOutput,
      interactiveDetected: detectInteractiveOutput(combinedOutput),
      usedPreferences: {
        jsonFlag: selectedFlags.jsonFlag,
        nonInteractiveFlags: selectedFlags.nonInteractiveFlags,
      },
      error: {
        code: castError.timedOut ? "TIMEOUT" : "EXECUTION_FAILED",
        message,
      },
    };
  }
}

function tryParseJson(value: string): unknown {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  try {
    return JSON.parse(trimmed);
  } catch {
    return undefined;
  }
}

function buildArgsFromInput(command: StmCommand, input: unknown): string[] {
  const args = [...command.path];
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return args;
  }

  const inputRecord = input as Record<string, unknown>;
  for (const option of command.options) {
    const optionName = option.long.replace(/^--/, "").replace(/-/g, "_");
    const optionValue = inputRecord[optionName];
    if (optionValue === undefined || optionValue === null) {
      continue;
    }
    if (!option.takesValue) {
      if (optionValue === true) {
        args.push(option.long);
      }
      continue;
    }
    args.push(option.long, String(optionValue));
  }

  return args;
}

export async function executeManifestTool(
  options: ExecuteManifestToolOptions,
): Promise<RunResult> {
  const command = options.manifest.commands.find(
    (entry) => entry.name === options.toolName,
  );
  if (!command) {
    return {
      ok: false,
      command: options.manifest.cli.binary,
      args: [],
      exitCode: null,
      durationMs: 0,
      stdout: "",
      stderr: `Unknown tool ${options.toolName}`,
      combinedOutput: `Unknown tool ${options.toolName}`,
      interactiveDetected: false,
      usedPreferences: {
        nonInteractiveFlags: [],
      },
      error: {
        code: "EXECUTION_FAILED",
        message: `Unknown tool ${options.toolName}`,
      },
    };
  }

  return runCommand({
    command: options.manifest.cli.binary,
    args: buildArgsFromInput(command, options.input),
    availableOptions: [...options.manifest.globalOptions, ...command.options],
    preferJson: true,
    preferNonInteractive: true,
    cwd: options.cwd,
  });
}
