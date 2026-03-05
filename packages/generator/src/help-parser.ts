import { normalizeOptions } from "@repo/spec";
import type { StmOption } from "@repo/spec";

export interface ParsedHelpText {
  description?: string;
  usage?: string;
  options: StmOption[];
  subcommands: string[];
}

function parseOptionLine(line: string): StmOption | undefined {
  const trimmed = line.trim();
  if (!trimmed.includes("--")) {
    return undefined;
  }

  const longMatch = trimmed.match(/--[a-z0-9-]+/i);
  if (longMatch?.index === undefined) {
    return undefined;
  }
  if (!longMatch[0]) {
    return undefined;
  }

  const shortMatch = trimmed.match(/(^|,\s*)(-[A-Za-z0-9])\b/);
  const short = shortMatch?.[2];
  const long = longMatch[0].toLowerCase();
  let takesValue = false;
  let valueHint: string | undefined;

  const afterLong = trimmed.slice(longMatch.index + long.length).trim();
  const firstTailToken = afterLong.split(/\s+/)[0] ?? "";
  const valueMatch = firstTailToken.match(/^<?([A-Za-z0-9_-]+)>?$/);
  let descriptionStart = 0;
  if (valueMatch?.[1] && /^<.+>$/.test(firstTailToken)) {
    takesValue = true;
    valueHint = valueMatch[1];
    descriptionStart = firstTailToken.length;
  }

  const sectionSplit = trimmed.match(/\s{2,}/);
  const descriptionFromSection =
    sectionSplit?.index !== undefined
      ? trimmed.slice(sectionSplit.index).trim()
      : undefined;
  const descriptionFromTail = afterLong.slice(descriptionStart).trim() || undefined;
  const description = descriptionFromSection ?? descriptionFromTail;

  return {
    long,
    short,
    description,
    takesValue,
    valueHint,
  };
}

function parseCommandLine(line: string): string | undefined {
  const normalized = line.trim();
  if (!normalized) {
    return undefined;
  }

  const firstToken = normalized.split(/\s+/)[0];
  if (!firstToken || firstToken.startsWith("-")) {
    return undefined;
  }
  return firstToken.replace(/:$/, "");
}

function extractUsage(lines: string[]): string | undefined {
  const usageLine = lines.find((line) => /^usage:/i.test(line.trim()));
  if (!usageLine) {
    return undefined;
  }
  return usageLine.replace(/^usage:\s*/i, "").trim();
}

function extractDescription(lines: string[]): string | undefined {
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }
    if (/^(usage|options|commands):/i.test(trimmed)) {
      continue;
    }
    return trimmed;
  }
  return undefined;
}

export function parseHelpText(helpText: string): ParsedHelpText {
  const lines = helpText.replace(/\r\n/g, "\n").split("\n");
  const options: StmOption[] = [];
  const subcommands = new Set<string>();

  let currentSection: "none" | "options" | "commands" = "none";
  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const lowered = line.trim().toLowerCase();
    if (lowered === "options:" || lowered === "flags:") {
      currentSection = "options";
      continue;
    }
    if (lowered === "commands:" || lowered === "available commands:") {
      currentSection = "commands";
      continue;
    }
    if (!line.trim()) {
      currentSection = "none";
      continue;
    }

    if (currentSection === "options") {
      const parsedOption = parseOptionLine(line);
      if (parsedOption) {
        options.push(parsedOption);
      }
      continue;
    }

    if (currentSection === "commands") {
      const parsedCommand = parseCommandLine(line);
      if (parsedCommand) {
        subcommands.add(parsedCommand);
      }
    }
  }

  return {
    description: extractDescription(lines),
    usage: extractUsage(lines),
    options: normalizeOptions(options),
    subcommands: [...subcommands].sort((left, right) => left.localeCompare(right)),
  };
}
