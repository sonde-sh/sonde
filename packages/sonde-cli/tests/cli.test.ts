import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CliIo, SondeManifest } from "../src/types.js";

const loadManifestMock = vi.fn();
const generateManifestMock = vi.fn();
const runCommandMock = vi.fn();
const executeManifestToolMock = vi.fn();
const scoreManifestMock = vi.fn();

vi.mock("@repo/spec", () => ({ loadManifest: loadManifestMock }));
vi.mock("@repo/generator", () => ({ generateManifest: generateManifestMock }));
vi.mock("@repo/runtime", () => ({
  runCommand: runCommandMock,
  executeManifestTool: executeManifestToolMock,
}));
vi.mock("@repo/scoring", () => ({ scoreManifest: scoreManifestMock }));

const manifest: SondeManifest = {
  version: "1",
  generatedAt: "2026-01-01T00:00:00.000Z",
  cli: {
    name: "sonde-test",
    binary: "sonde-test",
  },
  globalOptions: [],
  commands: [
    {
      name: "deploy",
      description: "Deploy project",
      path: ["deploy"],
      options: [{ long: "--target", takesValue: true }],
      subcommands: [],
      supportsJson: false,
      mayPrompt: false,
    },
  ],
};

function createIo(inputLines: string[] = []): {
  io: CliIo;
  stdout: string[];
  stderr: string[];
} {
  const stdout: string[] = [];
  const stderr: string[] = [];

  const io: CliIo = {
    writeStdout: (line) => {
      stdout.push(line);
    },
    writeStderr: (line) => {
      stderr.push(line);
    },
    readLines: async function* readLines() {
      for (const line of inputLines) {
        yield line;
      }
    },
  };

  return { io, stdout, stderr };
}

describe("sonde CLI", () => {
  beforeEach(() => {
    loadManifestMock.mockReset();
    generateManifestMock.mockReset();
    runCommandMock.mockReset();
    executeManifestToolMock.mockReset();
    scoreManifestMock.mockReset();
    loadManifestMock.mockResolvedValue({ ok: true, manifest });
  });

  it("runs generate command in json mode", async () => {
    const { runCli } = await import("../src/cli.js");
    generateManifestMock.mockResolvedValue({ commandCount: 3 });
    const { io, stdout, stderr } = createIo();

    const exitCode = await runCli(["generate", "vercel", "--json"], io);

    expect(exitCode).toBe(0);
    expect(loadManifestMock).toHaveBeenCalledTimes(0);
    expect(generateManifestMock).toHaveBeenCalledWith({ cli: "vercel" });
    expect(stderr).toEqual([]);
    expect(stdout).toHaveLength(1);
    const firstLine = stdout.at(0);
    expect(firstLine).toBeDefined();
    expect(JSON.parse(firstLine ?? "")).toEqual({
      ok: true,
      command: "generate",
      cli: "vercel",
      result: { commandCount: 3 },
    });
  });

  it("runs run command in json mode", async () => {
    const { runCli } = await import("../src/cli.js");
    runCommandMock.mockResolvedValue({ status: "ok" });
    const { io, stdout } = createIo();

    const exitCode = await runCli(["run", "supabase", "--json"], io);

    expect(exitCode).toBe(0);
    expect(runCommandMock).toHaveBeenCalled();
    const firstLine = stdout.at(0);
    expect(firstLine).toBeDefined();
    expect(JSON.parse(firstLine ?? "")).toEqual({
      ok: true,
      command: "run",
      cli: "supabase",
      result: { status: "ok" },
    });
  });

  it("runs score command in json mode", async () => {
    const { runCli } = await import("../src/cli.js");
    runCommandMock.mockResolvedValue({ ok: true, command: "supabase", args: ["--help"] });
    scoreManifestMock.mockResolvedValue({ score: 96 });
    const { io, stdout } = createIo();

    const exitCode = await runCli(["score", "vercel", "--json"], io);

    expect(exitCode).toBe(0);
    expect(scoreManifestMock).toHaveBeenCalled();
    const firstLine = stdout.at(0);
    expect(firstLine).toBeDefined();
    expect(JSON.parse(firstLine ?? "")).toEqual({
      ok: true,
      command: "score",
      cli: "vercel",
      result: { score: 96 },
    });
  });

  it("serves tools list and delegates tool calls to runtime", async () => {
    const { runCli } = await import("../src/cli.js");
    executeManifestToolMock.mockResolvedValue({ deployed: true });
    const { io, stdout } = createIo([
      JSON.stringify({ id: "1", method: "tools/list" }),
      JSON.stringify({
        id: "2",
        method: "tools/call",
        params: { name: "deploy", input: { target: "preview" } },
      }),
      JSON.stringify({
        id: "3",
        method: "tools/call",
        params: { name: "dangerous-shell", input: { cmd: "rm -rf /" } },
      }),
    ]);

    const exitCode = await runCli(["serve", "--json"], io);

    expect(exitCode).toBe(0);
    expect(stdout).toHaveLength(4);

    const readyLine = stdout.at(0);
    expect(readyLine).toBeDefined();
    expect(JSON.parse(readyLine ?? "")).toEqual({
      ok: true,
      command: "serve",
      status: "ready",
    });

    const toolListLine = stdout.at(1);
    expect(toolListLine).toBeDefined();
    expect(JSON.parse(toolListLine ?? "")).toEqual({
      id: "1",
      ok: true,
      result: {
        tools: [
          {
            name: "deploy",
            description: "Deploy project",
            inputSchema: {
              type: "object",
              properties: {
                target: { type: "string", description: undefined },
              },
              required: [],
              additionalProperties: false,
            },
          },
        ],
      },
    });

    expect(executeManifestToolMock).toHaveBeenCalledTimes(1);
    expect(executeManifestToolMock).toHaveBeenCalledWith({
      manifest,
      toolName: "deploy",
      input: { target: "preview" },
    });

    const deployLine = stdout.at(2);
    expect(deployLine).toBeDefined();
    expect(JSON.parse(deployLine ?? "")).toEqual({
      id: "2",
      ok: true,
      result: {
        tool: "deploy",
        output: { deployed: true },
      },
    });

    const deniedLine = stdout.at(3);
    expect(deniedLine).toBeDefined();
    expect(JSON.parse(deniedLine ?? "")).toEqual({
      id: "3",
      ok: false,
      error: {
        message: "Unknown tool 'dangerous-shell'",
      },
    });
  });
});
