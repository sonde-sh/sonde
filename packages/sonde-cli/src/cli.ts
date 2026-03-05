import process from "node:process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { handleGenerate, handleRun, handleScore, loadManifest } from "./command-handlers.js";
import { createNodeIo } from "./io.js";
import { CliError, writeError, writeResult } from "./output.js";
import { runServeLoop } from "./serve.js";
import { SONDE_JSON_API_VERSION } from "./types.js";
import type { CliIo, JsonFailure } from "./types.js";

const COMMANDS = ["generate", "run", "serve", "score"] as const;
const HELP_FLAGS = new Set(["--help", "-h"]);
const VERSION_FLAGS = new Set(["--version", "-v"]);

type SondeCommand = (typeof COMMANDS)[number];

interface ParsedArgs {
  command?: SondeCommand;
  cli?: string;
  json: boolean;
  showHelp: boolean;
  showVersion: boolean;
}

export async function runCli(argv: string[], io: CliIo = createNodeIo()): Promise<number> {
  let parsed: ParsedArgs;

  try {
    parsed = parseArgs(argv);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid CLI arguments";
    writeError(io, argv.includes("--json"), {
      ok: false,
      apiVersion: SONDE_JSON_API_VERSION,
      error: { message },
    });
    return 1;
  }

  if (parsed.showVersion) {
    io.writeStdout(await readPackageVersion());
    return 0;
  }

  if (parsed.showHelp) {
    io.writeStdout(getUsage(parsed.command));
    return 0;
  }

  if (!parsed.command) {
    io.writeStderr(getUsage());
    return 1;
  }

  try {
    if (parsed.command === "serve") {
      const manifest = await loadManifest(process.cwd());
      await runServeLoop(io, manifest, parsed.json);
      return 0;
    }

    if (!parsed.cli) {
      throw new CliError(`Missing <cli> argument for '${parsed.command}' command`);
    }

    const context = {
      cli: parsed.cli,
      json: parsed.json,
      cwd: process.cwd(),
    };

    if (parsed.command === "generate") {
      const result = await handleGenerate(context);
      writeResult(io, parsed.json, {
        ok: true,
        apiVersion: SONDE_JSON_API_VERSION,
        command: "generate",
        cli: parsed.cli,
        result,
      });
      return 0;
    }

    if (parsed.command === "run") {
      const result = await handleRun(context);
      writeResult(io, parsed.json, {
        ok: true,
        apiVersion: SONDE_JSON_API_VERSION,
        command: "run",
        cli: parsed.cli,
        result,
      });
      return 0;
    }

    const result = await handleScore(context);
    writeResult(io, parsed.json, {
      ok: true,
      apiVersion: SONDE_JSON_API_VERSION,
      command: "score",
      cli: parsed.cli,
      result,
    });
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown command error";
    const payload: JsonFailure = {
      ok: false,
      apiVersion: SONDE_JSON_API_VERSION,
      command: parsed.command,
      cli: parsed.cli,
      error: {
        message,
      },
    };
    writeError(io, parsed.json, payload);
    return 1;
  }
}

export function parseArgs(argv: string[]): ParsedArgs {
  const json = argv.includes("--json");
  const hasHelpFlag = argv.some((arg) => HELP_FLAGS.has(arg));
  const hasVersionFlag = argv.some((arg) => VERSION_FLAGS.has(arg));
  const nonFlagArgs = argv.filter(
    (arg) => arg !== "--json" && !HELP_FLAGS.has(arg) && !VERSION_FLAGS.has(arg),
  );

  if (hasVersionFlag && nonFlagArgs.length === 0) {
    return {
      json,
      showHelp: false,
      showVersion: true,
    };
  }

  if (nonFlagArgs.length === 0) {
    if (hasHelpFlag) {
      return {
        json,
        showHelp: true,
        showVersion: false,
      };
    }
    throw new CliError(getUsage());
  }

  const command = nonFlagArgs.at(0);
  if (!command || !isSondeCommand(command)) {
    throw new CliError(getUsage());
  }

  if (hasHelpFlag) {
    return {
      command,
      json,
      showHelp: true,
      showVersion: false,
    };
  }

  if (command === "serve") {
    if (nonFlagArgs.length > 1) {
      throw new CliError("Usage: sonde serve [--json]");
    }

    return {
      command,
      json,
      showHelp: false,
      showVersion: false,
    };
  }

  const cli = nonFlagArgs.at(1);
  if (!cli) {
    throw new CliError(`Usage: sonde ${command} <cli> [--json]`);
  }

  if (nonFlagArgs.length > 2) {
    throw new CliError(`Unexpected extra arguments for '${command}'`);
  }

  return {
    command,
    cli,
    json,
    showHelp: false,
    showVersion: false,
  };
}

function isSondeCommand(value: string): value is SondeCommand {
  return COMMANDS.includes(value as SondeCommand);
}

function getUsage(command?: SondeCommand): string {
  if (!command) {
    return [
      "Usage: sonde <command> [options]",
      "",
      "Reference implementation for the Sonde manifest workflow.",
      "",
      "Commands:",
      "  generate <cli>    Generate a Sonde manifest for <cli>",
      "  run <cli>         Validate deterministic behavior from local manifest",
      "  score <cli>       Score manifest-aligned automation reliability",
      "  serve             Expose manifest tools over JSON line protocol",
      "",
      "Options:",
      "  --json            Output machine-readable JSON",
      "  --help, -h        Show help",
      "  --version, -v     Show CLI version",
    ].join("\n");
  }

  if (command === "serve") {
    return "Usage: sonde serve [--json]";
  }

  return `Usage: sonde ${command} <cli> [--json]`;
}

async function readPackageVersion(): Promise<string> {
  try {
    const currentFile = fileURLToPath(import.meta.url);
    const candidatePaths = [
      path.resolve(path.dirname(currentFile), "../package.json"),
      path.resolve(path.dirname(currentFile), "../../package.json"),
    ];
    for (const packageJsonPath of candidatePaths) {
      try {
        const packageJsonRaw = await readFile(packageJsonPath, "utf8");
        const parsed = JSON.parse(packageJsonRaw) as { version?: unknown };
        if (typeof parsed.version === "string" && parsed.version.length > 0) {
          return parsed.version;
        }
      } catch {
        // Try the next candidate path.
      }
    }
  } catch {
    // Fall through to a safe default when package metadata is unavailable.
  }
  return "0.0.0";
}
