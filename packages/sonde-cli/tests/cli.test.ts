import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CliIo, SondeManifest } from "../src/types.js";

const loadManifestMock = vi.fn();
const generateManifestMock = vi.fn();
const runCommandMock = vi.fn();
const executeManifestToolMock = vi.fn();
const scoreManifestMock = vi.fn();
const fetchMock = vi.fn();

vi.mock("@sonde-sh/spec", () => ({ loadManifest: loadManifestMock }));
vi.mock("@sonde-sh/generator", () => ({ generateManifest: generateManifestMock }));
vi.mock("@sonde-sh/runtime", () => ({
  runCommand: runCommandMock,
  executeManifestTool: executeManifestToolMock,
}));
vi.mock("@sonde-sh/scoring", () => ({ scoreManifest: scoreManifestMock }));

const manifest: SondeManifest = {
  version: "1.0.0",
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
    fetchMock.mockReset();
    loadManifestMock.mockResolvedValue({ ok: true, manifest });
    delete process.env.SONDE_PUBLISH_URL;
    delete process.env.SONDE_PUBLISH_TOKEN;
    vi.stubGlobal("fetch", fetchMock);
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
      apiVersion: "1.0.0",
      command: "generate",
      cli: "vercel",
      result: { commandCount: 3 },
    });
  });

  it("runs manifest command in json mode", async () => {
    const { runCli } = await import("../src/cli.js");
    const { io, stdout, stderr } = createIo();

    const exitCode = await runCli(["manifest", "--json"], io);

    expect(exitCode).toBe(0);
    expect(stderr).toEqual([]);
    expect(stdout).toHaveLength(1);
    const firstLine = stdout.at(0);
    expect(firstLine).toBeDefined();
    expect(JSON.parse(firstLine ?? "")).toEqual({
      ok: true,
      apiVersion: "1.0.0",
      command: "manifest",
      result: expect.objectContaining({
        version: "1.0.0",
        cli: expect.objectContaining({
          name: "sonde",
          binary: "sonde",
        }),
      }),
    });
  });

  it("runs run command in json mode", async () => {
    const { runCli } = await import("../src/cli.js");
    runCommandMock.mockResolvedValue({ status: "ok" });
    const { io, stdout } = createIo();

    const exitCode = await runCli(["run", "supabase", "--json"], io);

    expect(exitCode).toBe(0);
    expect(runCommandMock).toHaveBeenCalledWith(
      expect.objectContaining({
        command: "sonde-test",
      }),
    );
    const firstLine = stdout.at(0);
    expect(firstLine).toBeDefined();
    expect(JSON.parse(firstLine ?? "")).toEqual({
      ok: true,
      apiVersion: "1.0.0",
      command: "run",
      cli: "supabase",
      result: { status: "ok" },
    });
  });

  it("runs score command in json mode", async () => {
    const { runCli } = await import("../src/cli.js");
    runCommandMock.mockResolvedValue({ ok: true, command: "supabase", args: ["--help"] });
    scoreManifestMock.mockResolvedValue({
      manifestVersion: "1.0.0",
      generatedAt: "2026-03-05T00:00:00.000Z",
      total: 96,
      metrics: [],
    });
    const { io, stdout } = createIo();

    const exitCode = await runCli(["score", "vercel", "--json"], io);

    expect(exitCode).toBe(0);
    expect(runCommandMock).toHaveBeenCalledTimes(2);
    expect(runCommandMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        command: "sonde-test",
      }),
    );
    expect(runCommandMock).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        command: "sonde-test",
      }),
    );
    expect(scoreManifestMock).toHaveBeenCalled();
    const firstLine = stdout.at(0);
    expect(firstLine).toBeDefined();
    expect(JSON.parse(firstLine ?? "")).toEqual({
      ok: true,
      apiVersion: "1.0.0",
      command: "score",
      cli: "vercel",
      result: {
        manifestVersion: "1.0.0",
        generatedAt: "2026-03-05T00:00:00.000Z",
        total: 96,
        metrics: [],
      },
    });
  });

  it("runs publish command and forwards normalized report", async () => {
    const { runCli } = await import("../src/cli.js");
    process.env.SONDE_PUBLISH_URL = "https://example.com/api/reports/publish";
    process.env.SONDE_PUBLISH_TOKEN = "test-token";
    runCommandMock.mockResolvedValue({ ok: true, command: "supabase", args: ["--help"] });
    scoreManifestMock.mockResolvedValue({
      manifestVersion: "1.0.0",
      generatedAt: "2026-03-05T00:00:00.000Z",
      total: 88,
      jsonSupport: true,
      interactivePrompts: false,
      notes: "Deterministic output",
    });
    fetchMock.mockResolvedValue({
      ok: true,
      status: 202,
      text: async () => JSON.stringify({ ok: true, id: "report-1", status: "pending" }),
    });
    const { io, stdout, stderr } = createIo();

    const exitCode = await runCli(["publish", "vercel", "--json"], io);

    expect(exitCode).toBe(0);
    expect(generateManifestMock).toHaveBeenCalledTimes(0);
    expect(runCommandMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.com/api/reports/publish",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "content-type": "application/json",
          "x-sonde-publish-token": "test-token",
        }),
      }),
    );
    const [, requestInit] = fetchMock.mock.calls[0] as [string, { body?: string }];
    const submittedBody = JSON.parse(requestInit.body ?? "{}") as Record<string, unknown>;
    expect(submittedBody).toEqual(
      expect.objectContaining({
        cli: "vercel",
        score: 88,
        report: expect.objectContaining({
          total: 88,
        }),
      }),
    );
    expect(stderr).toEqual([]);
    const firstLine = stdout.at(0);
    expect(firstLine).toBeDefined();
    expect(JSON.parse(firstLine ?? "")).toEqual({
      ok: true,
      apiVersion: "1.0.0",
      command: "publish",
      cli: "vercel",
      result: expect.objectContaining({
        publishUrl: "https://example.com/api/reports/publish",
        response: { ok: true, id: "report-1", status: "pending" },
        report: expect.objectContaining({
          cli: "vercel",
          score: 88,
          schemaValid: true,
          report: expect.objectContaining({
            total: 88,
          }),
        }),
      }),
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
      apiVersion: "1.0.0",
      protocolVersion: "1.0.0",
      command: "serve",
      status: "ready",
    });

    const toolListLine = stdout.at(1);
    expect(toolListLine).toBeDefined();
    expect(JSON.parse(toolListLine ?? "")).toEqual({
      id: "1",
      ok: true,
      protocolVersion: "1.0.0",
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
      protocolVersion: "1.0.0",
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
      protocolVersion: "1.0.0",
      error: {
        message: "Unknown tool 'dangerous-shell'",
      },
    });
  });

  it("returns usage in json format for invalid command with --json", async () => {
    const { runCli } = await import("../src/cli.js");
    const { io, stderr } = createIo();

    const exitCode = await runCli(["wat", "--json"], io);

    expect(exitCode).toBe(1);
    expect(stderr).toHaveLength(1);
    const firstError = stderr.at(0);
    expect(firstError).toBeDefined();
    expect(JSON.parse(firstError ?? "")).toEqual({
      ok: false,
      apiVersion: "1.0.0",
      error: {
        message: expect.stringContaining("Usage: sonde"),
      },
    });
  });

  it("returns usage for missing cli argument", async () => {
    const { runCli } = await import("../src/cli.js");
    const { io, stderr } = createIo();

    const exitCode = await runCli(["run", "--json"], io);

    expect(exitCode).toBe(1);
    const firstError = stderr.at(0);
    expect(firstError).toBeDefined();
    expect(JSON.parse(firstError ?? "")).toEqual({
      ok: false,
      apiVersion: "1.0.0",
      error: {
        message: "Usage: sonde run <cli> [--json]",
      },
    });
  });

  it("returns error for extra command arguments", async () => {
    const { runCli } = await import("../src/cli.js");
    const { io, stderr } = createIo();

    const exitCode = await runCli(["generate", "vercel", "extra", "--json"], io);

    expect(exitCode).toBe(1);
    const firstError = stderr.at(0);
    expect(firstError).toBeDefined();
    expect(JSON.parse(firstError ?? "")).toEqual({
      ok: false,
      apiVersion: "1.0.0",
      error: {
        message: "Unexpected extra arguments for 'generate'",
      },
    });
  });

  it("returns error for manifest command with extra arguments", async () => {
    const { runCli } = await import("../src/cli.js");
    const { io, stderr } = createIo();

    const exitCode = await runCli(["manifest", "extra", "--json"], io);

    expect(exitCode).toBe(1);
    const firstError = stderr.at(0);
    expect(firstError).toBeDefined();
    expect(JSON.parse(firstError ?? "")).toEqual({
      ok: false,
      apiVersion: "1.0.0",
      error: {
        message: "Usage: sonde manifest [--json]",
      },
    });
  });

  it("returns help text with --help", async () => {
    const { runCli } = await import("../src/cli.js");
    const { io, stdout, stderr } = createIo();

    const exitCode = await runCli(["--help"], io);

    expect(exitCode).toBe(0);
    expect(stderr).toEqual([]);
    expect(stdout).toHaveLength(1);
    expect(stdout.at(0)).toContain("Usage: sonde <command> [options]");
    expect(stdout.at(0)).toContain(
      "Generate a Sonde manifest by exploring <cli> help output",
    );
    expect(stdout.at(0)).toContain(
      "Evaluate <cli> against manifest rules and return report",
    );
  });

  it("returns version with --version", async () => {
    const { runCli } = await import("../src/cli.js");
    const { io, stdout, stderr } = createIo();

    const exitCode = await runCli(["--version"], io);

    expect(exitCode).toBe(0);
    expect(stderr).toEqual([]);
    expect(stdout).toHaveLength(1);
    expect(stdout.at(0)).toBe("0.1.0");
  });

  it("returns error payload when manifest loading fails", async () => {
    const { runCli } = await import("../src/cli.js");
    loadManifestMock.mockResolvedValue({
      ok: false,
      error: {
        code: "MISSING_FILE",
        message: "Manifest file not found",
      },
    });
    const { io, stderr } = createIo();

    const exitCode = await runCli(["run", "supabase", "--json"], io);

    expect(exitCode).toBe(1);
    const firstError = stderr.at(0);
    expect(firstError).toBeDefined();
    expect(JSON.parse(firstError ?? "")).toEqual({
      ok: false,
      apiVersion: "1.0.0",
      command: "run",
      cli: "supabase",
      error: {
        message: "MISSING_FILE: Manifest file not found",
      },
    });
  });

  it("returns malformed request error in serve mode", async () => {
    const { runCli } = await import("../src/cli.js");
    const { io, stdout } = createIo(["not-json"]);

    const exitCode = await runCli(["serve", "--json"], io);

    expect(exitCode).toBe(0);
    expect(stdout).toHaveLength(2);
    const malformed = stdout.at(1);
    expect(malformed).toBeDefined();
    expect(JSON.parse(malformed ?? "")).toEqual({
      id: null,
      ok: false,
      protocolVersion: "1.0.0",
      error: {
        message: "Invalid JSON request",
      },
    });
  });
});
