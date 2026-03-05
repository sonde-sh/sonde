import { describe, expect, it } from "vitest";

import {
  buildPreferredArgs,
  detectInteractiveOutput,
  runCommand,
  selectPreferredFlags,
} from "../src/index.js";

describe("flag preference selection", () => {
  it("selects json and non-interactive flags", () => {
    const selection = selectPreferredFlags(
      [],
      [
        { long: "--json", takesValue: false },
        { long: "--non-interactive", takesValue: false },
      ],
      true,
      true,
    );

    expect(selection.jsonFlag).toBe("--json");
    expect(selection.nonInteractiveFlags).toEqual(["--non-interactive"]);
  });

  it("builds argument list with selected flags", () => {
    const args = buildPreferredArgs(["status"], {
      jsonFlag: "--json",
      nonInteractiveFlags: ["--yes"],
    });
    expect(args).toEqual(["status", "--json", "--yes"]);
  });
});

describe("interactive detection", () => {
  it("detects interactive prompts", () => {
    expect(detectInteractiveOutput("Are you sure? [y/n]")).toBe(true);
    expect(detectInteractiveOutput("all done")).toBe(false);
  });
});

describe("command execution", () => {
  it("returns deterministic run envelope", async () => {
    const result = await runCommand({
      command: "node",
      args: ["-e", "console.log(JSON.stringify({ok:true}))"],
      preferJson: false,
      preferNonInteractive: false,
    });

    expect(result.ok).toBe(true);
    expect(result.exitCode).toBe(0);
    expect(result.stdout.trim()).toBe('{"ok":true}');
  });
});
