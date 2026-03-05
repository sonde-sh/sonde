import type { RunResult } from "@sonde-sh/runtime";
import { describe, expect, it } from "vitest";

import { ANALYZERS, scoreManifest } from "../src/index.js";

describe("scoring", () => {
  it("returns a weighted report in the 0-100 range", () => {
    const runResults: RunResult[] = [
      {
        ok: true,
        command: "mycli",
        args: ["deploy", "--json"],
        exitCode: 0,
        durationMs: 10,
        stdout: '{"ok":true}',
        stderr: "",
        combinedOutput: '{"ok":true}',
        interactiveDetected: false,
        usedPreferences: {
          jsonFlag: "--json",
          nonInteractiveFlags: ["--non-interactive"],
        },
      },
      {
        ok: true,
        command: "mycli",
        args: ["deploy", "--json"],
        exitCode: 0,
        durationMs: 10,
        stdout: '{"ok":true}',
        stderr: "",
        combinedOutput: '{"ok":true}',
        interactiveDetected: false,
        usedPreferences: {
          jsonFlag: "--json",
          nonInteractiveFlags: ["--non-interactive"],
        },
      },
    ];

    const report = scoreManifest({
      manifest: {
        version: "1.0.0",
        generatedAt: "2026-01-01T00:00:00.000Z",
        cli: { name: "mycli", binary: "mycli" },
        globalOptions: [{ long: "--help", takesValue: false }],
        commands: [
          {
            name: "deploy",
            path: ["deploy"],
            options: [{ long: "--json", takesValue: false }],
            subcommands: [],
            supportsJson: true,
            mayPrompt: false,
          },
        ],
      },
      runResults,
    });

    expect(report.total).toBeGreaterThanOrEqual(0);
    expect(report.total).toBeLessThanOrEqual(100);
    expect(report.reportVersion).toBe("1.0.0");
    expect(report.manifestVersion).toBe("1.0.0");
    expect(report.metrics).toHaveLength(5);
  });

  it("ships expected analyzer entries", () => {
    const ids = ANALYZERS.map((analyzer) => analyzer.id);
    expect(ids).toEqual([
      "vercel",
      "supabase",
      "docker",
      "skills.sh",
      "terraform",
    ]);
  });
});
