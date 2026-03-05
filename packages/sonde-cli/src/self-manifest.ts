import type { StmManifest, StmOption } from "@sonde-sh/spec";

const BASE_OPTIONS: StmOption[] = [
  {
    long: "--json",
    description: "Output machine-readable JSON",
    takesValue: false,
  },
  {
    long: "--help",
    short: "-h",
    description: "Show help",
    takesValue: false,
  },
  {
    long: "--version",
    short: "-v",
    description: "Show CLI version",
    takesValue: false,
  },
];

export function createSondeSelfManifest(generatedAt = new Date().toISOString()): StmManifest {
  return {
    version: "1.0.0",
    generatedAt,
    cli: {
      name: "sonde",
      binary: "sonde",
      description: "Reference implementation for the Sonde manifest workflow.",
    },
    globalOptions: BASE_OPTIONS,
    commands: [
      {
        name: "generate",
        path: ["generate"],
        description: "Generate a Sonde manifest for <cli>",
        usage: "sonde generate <cli> [--json]",
        options: [],
        subcommands: [],
        supportsJson: true,
        mayPrompt: false,
      },
      {
        name: "manifest",
        path: ["manifest"],
        description: "Print Sonde's own Sondage manifest",
        usage: "sonde manifest [--json]",
        options: [],
        subcommands: [],
        supportsJson: true,
        mayPrompt: false,
      },
      {
        name: "run",
        path: ["run"],
        description: "Validate deterministic behavior from local manifest",
        usage: "sonde run <cli> [--json]",
        options: [],
        subcommands: [],
        supportsJson: true,
        mayPrompt: false,
      },
      {
        name: "score",
        path: ["score"],
        description: "Score manifest-aligned automation reliability",
        usage: "sonde score <cli> [--json]",
        options: [],
        subcommands: [],
        supportsJson: true,
        mayPrompt: false,
      },
      {
        name: "serve",
        path: ["serve"],
        description: "Expose manifest tools over JSON line protocol",
        usage: "sonde serve [--json]",
        options: [],
        subcommands: [],
        supportsJson: true,
        mayPrompt: false,
      },
    ],
  };
}
