import process from "node:process";
import readline from "node:readline";
import type { CliIo } from "./types.js";

export function createNodeIo(): CliIo {
  return {
    writeStdout: (line: string) => {
      process.stdout.write(`${line}\n`);
    },
    writeStderr: (line: string) => {
      process.stderr.write(`${line}\n`);
    },
    readLines: async function* readLines() {
      const rl = readline.createInterface({
        input: process.stdin,
        crlfDelay: Infinity,
      });

      for await (const line of rl) {
        yield line;
      }
    },
  };
}
