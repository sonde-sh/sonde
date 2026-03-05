import process from "node:process";
import { handleGenerate, handleRun, handleScore, loadManifest } from "./command-handlers.js";
import { createNodeIo } from "./io.js";
import { CliError, writeError, writeResult } from "./output.js";
import { runServeLoop } from "./serve.js";
import type { CliIo, JsonFailure } from "./types.js";

const COMMANDS = ["generate", "run", "serve", "score"] as const;

type SondeCommand = (typeof COMMANDS)[number];

interface ParsedArgs {
  command: SondeCommand;
  cli?: string;
  json: boolean;
}

export async function runCli(argv: string[], io: CliIo = createNodeIo()): Promise<number> {
  let parsed: ParsedArgs;

  try {
    parsed = parseArgs(argv);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid CLI arguments";
    writeError(io, false, {
      ok: false,
      error: { message },
    });
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
        command: "run",
        cli: parsed.cli,
        result,
      });
      return 0;
    }

    const result = await handleScore(context);
    writeResult(io, parsed.json, {
      ok: true,
      command: "score",
      cli: parsed.cli,
      result,
    });
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown command error";
    const payload: JsonFailure = {
      ok: false,
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
  const nonFlagArgs = argv.filter((arg) => arg !== "--json");

  const command = nonFlagArgs.at(0);
  if (!command || !isSondeCommand(command)) {
    throw new CliError("Usage: sonde <generate|run|serve|score> [cli] [--json]");
  }

  if (command === "serve") {
    if (nonFlagArgs.length > 1) {
      throw new CliError("Usage: sonde serve [--json]");
    }

    return {
      command,
      json,
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
  };
}

function isSondeCommand(value: string): value is SondeCommand {
  return COMMANDS.includes(value as SondeCommand);
}
