import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import * as path from "node:path";

import { describe, expect, it } from "vitest";

import type { CliIo } from "../src/types.js";
import { runCli } from "../src/cli.js";

interface CapturedIo {
  io: CliIo;
  stdout: string[];
  stderr: string[];
}

interface ScoreResult {
  total: number;
}

interface RunResultPayload {
  ok: boolean;
  result: {
    ok: boolean;
  };
}

function createIo(): CapturedIo {
  const stdout: string[] = [];
  const stderr: string[] = [];
  const io: CliIo = {
    writeStdout: (line) => {
      stdout.push(line);
    },
    writeStderr: (line) => {
      stderr.push(line);
    },
    readLines: async function* readLines() {},
  };
  return { io, stdout, stderr };
}

function parseJsonLine<T>(line: string | undefined): T {
  if (!line) {
    throw new Error("Expected JSON line output but received nothing.");
  }
  return JSON.parse(line) as T;
}

const packageRoot = process.cwd();
const workspaceRoot = path.resolve(packageRoot, "..", "..");
const workspaceBinPath = path.join(workspaceRoot, "node_modules", ".bin");

describe("fixture CLIs", () => {
  it("scores fixture CLIs in expected order", async () => {
    const previousPath = process.env.PATH ?? "";
    process.env.PATH = `${workspaceBinPath}${path.delimiter}${previousPath}`;

    const fixtureCliNames = ["cli-good", "cli-ok", "cli-bad"] as const;
    const scores: Record<(typeof fixtureCliNames)[number], number> = {
      "cli-good": 0,
      "cli-ok": 0,
      "cli-bad": 0,
    };

    const previousCwd = process.cwd();
    try {
      for (const cliName of fixtureCliNames) {
        const cwd = await mkdtemp(path.join(tmpdir(), `sonde-fixture-${cliName}-`));
        process.chdir(cwd);

        const generateIo = createIo();
        const generateExitCode = await runCli(["generate", cliName, "--json"], generateIo.io);
        expect(generateExitCode).toBe(0);
        expect(generateIo.stderr).toEqual([]);
        const generated = parseJsonLine<{ ok: boolean }>(generateIo.stdout.at(0));
        expect(generated.ok).toBe(true);

        const runIo = createIo();
        const runExitCode = await runCli(["run", cliName, "--json"], runIo.io);
        expect(runExitCode).toBe(0);
        const runPayload = parseJsonLine<RunResultPayload>(runIo.stdout.at(0));
        expect(runPayload.ok).toBe(true);
        expect(typeof runPayload.result.ok).toBe("boolean");

        const scoreIo = createIo();
        const scoreExitCode = await runCli(["score", cliName, "--json"], scoreIo.io);
        expect(scoreExitCode).toBe(0);
        expect(scoreIo.stderr).toEqual([]);
        const scorePayload = parseJsonLine<{ ok: boolean; result: ScoreResult }>(
          scoreIo.stdout.at(0),
        );
        expect(scorePayload.ok).toBe(true);
        scores[cliName] = scorePayload.result.total;
      }
    } finally {
      process.chdir(previousCwd);
      process.env.PATH = previousPath;
    }

    expect(scores["cli-good"]).toBeGreaterThanOrEqual(scores["cli-ok"]);
    expect(scores["cli-ok"]).toBeGreaterThanOrEqual(scores["cli-bad"]);
  });
});
