import type { CliIo, JsonFailure, JsonSuccess } from "./types.js";

export class CliError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "CliError";
  }
}

export function writeResult<T>(
  io: CliIo,
  json: boolean,
  payload: JsonSuccess<T>,
): void {
  if (json) {
    io.writeStdout(JSON.stringify(payload));
    return;
  }

  io.writeStdout(`${payload.command} completed`);
  io.writeStdout(JSON.stringify(payload.result, null, 2));
}

export function writeError(io: CliIo, json: boolean, payload: JsonFailure): void {
  if (json) {
    io.writeStderr(JSON.stringify(payload));
    return;
  }

  io.writeStderr(payload.error.message);
}
