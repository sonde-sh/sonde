import { executeManifestTool } from "@sonde-sh/runtime";
import type {
  CliIo,
  JsonSchema,
  SondeManifest,
  ToolCallResponse,
  ToolListResponse,
} from "./types.js";

export interface ServeRequest {
  id: string | number;
  method: "tools/list" | "tools/call";
  params?: {
    name?: string;
    input?: unknown;
  };
}

export interface ServeSuccess<T> {
  id: string | number;
  ok: true;
  result: T;
}

export interface ServeFailure {
  id: string | number | null;
  ok: false;
  error: {
    message: string;
  };
}

export function listTools(manifest: SondeManifest): ToolListResponse {
  return {
    tools: manifest.commands.map((command) => ({
      name: command.name,
      description: command.description,
      inputSchema: normalizeSchema(command.options),
    })),
  };
}

export async function handleServeRequest(
  manifest: SondeManifest,
  request: ServeRequest,
): Promise<ServeSuccess<ToolListResponse | ToolCallResponse> | ServeFailure> {
  if (request.method === "tools/list") {
    return {
      id: request.id,
      ok: true,
      result: listTools(manifest),
    };
  }

  const toolName = request.params?.name;
  if (!toolName) {
    return {
      id: request.id,
      ok: false,
      error: {
        message: "Missing tool name in tools/call request",
      },
    };
  }

  const knownTool = manifest.commands.find((command) => command.name === toolName);
  if (!knownTool) {
    return {
      id: request.id,
      ok: false,
      error: {
        message: `Unknown tool '${toolName}'`,
      },
    };
  }

  const output = await executeManifestTool({
    manifest,
    toolName,
    input: request.params?.input ?? {},
  });

  return {
    id: request.id,
    ok: true,
    result: {
      tool: toolName,
      output,
    },
  };
}

export async function runServeLoop(
  io: CliIo,
  manifest: SondeManifest,
  json: boolean,
): Promise<void> {
  if (json) {
    io.writeStdout(JSON.stringify({ ok: true, command: "serve", status: "ready" }));
  } else {
    io.writeStdout("serve ready");
  }

  for await (const rawLine of io.readLines()) {
    const line = rawLine.trim();
    if (!line) {
      continue;
    }

    let request: ServeRequest;
    try {
      request = JSON.parse(line) as ServeRequest;
    } catch {
      const malformed: ServeFailure = {
        id: null,
        ok: false,
        error: {
          message: "Invalid JSON request",
        },
      };
      io.writeStdout(JSON.stringify(malformed));
      continue;
    }

    try {
      const response = await handleServeRequest(manifest, request);
      io.writeStdout(JSON.stringify(response));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown serve error";
      const response: ServeFailure = {
        id: request.id,
        ok: false,
        error: {
          message,
        },
      };
      io.writeStdout(JSON.stringify(response));
    }
  }
}

function normalizeSchema(options: SondeManifest["commands"][number]["options"]): JsonSchema {
  const properties: JsonSchema["properties"] = {};
  for (const option of options) {
    const key = option.long.replace(/^--/, "").replace(/-/g, "_");
    properties[key] = {
      type: option.takesValue ? "string" : "boolean",
      description: option.description,
    };
  }
  return {
    type: "object",
    properties,
    required: [],
    additionalProperties: false,
  };
}
