import type { StmManifest } from "@sonde-sh/spec";

export const SONDE_JSON_API_VERSION = "1.0.0";
export const SONDE_SERVE_PROTOCOL_VERSION = "1.0.0";

export interface JsonSchema {
  type: "object";
  properties: Record<string, JsonSchemaProperty>;
  required: string[];
  additionalProperties: boolean;
}

export interface JsonSchemaProperty {
  type: "string" | "boolean" | "number";
  description?: string;
}

export type SondeManifest = StmManifest;

export interface CliIo {
  writeStdout: (line: string) => void;
  writeStderr: (line: string) => void;
  readLines: () => AsyncIterable<string>;
}

export interface CommandContext {
  cli: string;
  json: boolean;
  cwd: string;
}

export interface JsonSuccess<T> {
  ok: true;
  apiVersion: string;
  command: "generate" | "run" | "score" | "serve";
  cli?: string;
  result: T;
}

export interface JsonFailure {
  ok: false;
  apiVersion: string;
  command?: "generate" | "run" | "score" | "serve";
  cli?: string;
  error: {
    message: string;
  };
}

export interface ToolListResponse {
  tools: Array<{
    name: string;
    description?: string;
    inputSchema: JsonSchema;
  }>;
}

export interface ToolCallResponse {
  tool: string;
  output: unknown;
}
