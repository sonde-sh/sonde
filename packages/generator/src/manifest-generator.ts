import type { StmCommand, StmManifestV1 } from "@repo/spec";

import { parseHelpText } from "./help-parser.js";

export interface HelpTextInput {
  root: string;
  commands: Record<string, string>;
}

export interface ManifestGeneratorInput {
  cliName: string;
  binary: string;
  help: HelpTextInput;
  generatedAt?: string;
}

const JSON_FLAG_PATTERN = /\bjson\b/i;
const PROMPT_HINT_PATTERN =
  /\b(prompt|interactive|browser|confirm|login|token|password)\b/i;

function commandSupportsJson(command: StmCommand): boolean {
  return command.options.some(
    (option) =>
      JSON_FLAG_PATTERN.test(option.long) ||
      JSON_FLAG_PATTERN.test(option.description ?? ""),
  );
}

function commandMayPrompt(command: StmCommand): boolean {
  return command.options.some((option) =>
    PROMPT_HINT_PATTERN.test(option.description ?? ""),
  );
}

function normalizeCommandName(commandPath: string): string {
  return commandPath.trim().replace(/\s+/g, " ");
}

export function generateManifestFromHelp(
  input: ManifestGeneratorInput,
): StmManifestV1 {
  const parsedRoot = parseHelpText(input.help.root);
  const commandKeys = Object.keys(input.help.commands).sort((left, right) =>
    left.localeCompare(right),
  );

  const commands: StmCommand[] = commandKeys.map((commandKey) => {
    const normalizedName = normalizeCommandName(commandKey);
    const path = normalizedName.split(" ");
    const parsedCommand = parseHelpText(input.help.commands[commandKey] ?? "");
    const command: StmCommand = {
      name: normalizedName,
      path,
      description: parsedCommand.description,
      usage: parsedCommand.usage,
      options: parsedCommand.options,
      subcommands: parsedCommand.subcommands,
      supportsJson: false,
      mayPrompt: false,
    };
    return {
      ...command,
      supportsJson: commandSupportsJson(command),
      mayPrompt: commandMayPrompt(command),
    };
  });

  return {
    $schema: "https://sonde.dev/schemas/stm-manifest-v1.schema.json",
    version: "1",
    generatedAt: input.generatedAt ?? "1970-01-01T00:00:00.000Z",
    cli: {
      name: input.cliName,
      binary: input.binary,
      description: parsedRoot.description,
    },
    globalOptions: parsedRoot.options,
    commands,
  };
}
