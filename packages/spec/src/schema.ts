import { z } from "zod";

import type { StmManifest, StmOption } from "./types.js";

const SEMVER_PATTERN =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|[0-9A-Za-z-]*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|[0-9A-Za-z-]*[A-Za-z-][0-9A-Za-z-]*))*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;

export const stmOptionSchema = z.object({
  long: z.string().min(2),
  short: z.string().min(2).optional(),
  description: z.string().optional(),
  takesValue: z.boolean(),
  valueHint: z.string().optional(),
});

export const stmCommandSchema = z.object({
  name: z.string().min(1),
  path: z.array(z.string().min(1)).min(1),
  description: z.string().optional(),
  usage: z.string().optional(),
  options: z.array(stmOptionSchema),
  subcommands: z.array(z.string().min(1)),
  supportsJson: z.boolean(),
  mayPrompt: z.boolean(),
});

export const stmManifestV1Schema = z.object({
  $schema: z.string().optional(),
  version: z.string().regex(SEMVER_PATTERN, {
    message: "Manifest version must be a valid semantic version (x.y.z).",
  }),
  generatedAt: z.string().datetime({ offset: true }),
  cli: z.object({
    name: z.string().min(1),
    binary: z.string().min(1),
    description: z.string().optional(),
  }),
  globalOptions: z.array(stmOptionSchema),
  commands: z.array(stmCommandSchema),
});

export interface JsonSchemaObject {
  [key: string]: unknown;
}

export const manifestJsonSchema: JsonSchemaObject = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://sonde.dev/schemas/stm-manifest-v1.schema.json",
  title: "STM Manifest (major v1)",
  type: "object",
  required: ["version", "generatedAt", "cli", "globalOptions", "commands"],
  additionalProperties: false,
  properties: {
    $schema: { type: "string" },
    version: {
      type: "string",
      pattern:
        "^(0|[1-9]\\\\d*)\\\\.(0|[1-9]\\\\d*)\\\\.(0|[1-9]\\\\d*)(?:-((?:0|[1-9]\\\\d*|[0-9A-Za-z-]*[A-Za-z-][0-9A-Za-z-]*)(?:\\\\.(?:0|[1-9]\\\\d*|[0-9A-Za-z-]*[A-Za-z-][0-9A-Za-z-]*))*))?(?:\\\\+([0-9A-Za-z-]+(?:\\\\.[0-9A-Za-z-]+)*))?$",
    },
    generatedAt: { type: "string", format: "date-time" },
    cli: {
      type: "object",
      required: ["name", "binary"],
      additionalProperties: false,
      properties: {
        name: { type: "string", minLength: 1 },
        binary: { type: "string", minLength: 1 },
        description: { type: "string" },
      },
    },
    globalOptions: {
      type: "array",
      items: { $ref: "#/$defs/option" },
    },
    commands: {
      type: "array",
      items: { $ref: "#/$defs/command" },
    },
  },
  $defs: {
    option: {
      type: "object",
      required: ["long", "takesValue"],
      additionalProperties: false,
      properties: {
        long: { type: "string", minLength: 2 },
        short: { type: "string", minLength: 2 },
        description: { type: "string" },
        takesValue: { type: "boolean" },
        valueHint: { type: "string" },
      },
    },
    command: {
      type: "object",
      required: [
        "name",
        "path",
        "options",
        "subcommands",
        "supportsJson",
        "mayPrompt",
      ],
      additionalProperties: false,
      properties: {
        name: { type: "string", minLength: 1 },
        path: {
          type: "array",
          minItems: 1,
          items: { type: "string", minLength: 1 },
        },
        description: { type: "string" },
        usage: { type: "string" },
        options: {
          type: "array",
          items: { $ref: "#/$defs/option" },
        },
        subcommands: {
          type: "array",
          items: { type: "string", minLength: 1 },
        },
        supportsJson: { type: "boolean" },
        mayPrompt: { type: "boolean" },
      },
    },
  },
};

export function validateManifest(manifest: unknown): StmManifest {
  return stmManifestV1Schema.parse(manifest);
}

export function normalizeOptions(options: StmOption[]): StmOption[] {
  return [...options].sort((left, right) => {
    if (left.long === right.long) {
      return (left.short ?? "").localeCompare(right.short ?? "");
    }
    return left.long.localeCompare(right.long);
  });
}
