import type { StmManifestV1 } from "@repo/spec";

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

export type SondeManifest = StmManifestV1;

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
  command: "generate" | "run" | "score" | "serve";
  cli?: string;
  result: T;
}

export interface JsonFailure {
  ok: false;
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
