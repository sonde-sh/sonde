import type { StmOption } from "@repo/spec";

export interface PreferredFlagSelection {
  jsonFlag?: string;
  jsonFlagValue?: string;
  nonInteractiveFlags: string[];
}

const JSON_FLAG_PRIORITY = ["--json", "--output", "--format"] as const;
const NON_INTERACTIVE_PRIORITY = [
  "--non-interactive",
  "--no-input",
  "--yes",
  "--assume-yes",
  "--force",
] as const;

function hasFlag(args: string[], flag: string): boolean {
  return args.includes(flag);
}

export function selectPreferredFlags(
  args: string[],
  availableOptions: StmOption[],
  preferJson: boolean,
  preferNonInteractive: boolean,
): PreferredFlagSelection {
  const selection: PreferredFlagSelection = {
    nonInteractiveFlags: [],
  };

  if (preferJson) {
    for (const preferredJsonFlag of JSON_FLAG_PRIORITY) {
      const option = availableOptions.find(
        (candidate) => candidate.long === preferredJsonFlag,
      );
      if (!option || hasFlag(args, option.long)) {
        continue;
      }
      selection.jsonFlag = option.long;
      if (option.takesValue) {
        selection.jsonFlagValue = "json";
      }
      break;
    }
  }

  if (preferNonInteractive) {
    for (const preferredNonInteractiveFlag of NON_INTERACTIVE_PRIORITY) {
      const option = availableOptions.find(
        (candidate) => candidate.long === preferredNonInteractiveFlag,
      );
      if (!option || hasFlag(args, option.long)) {
        continue;
      }
      selection.nonInteractiveFlags.push(option.long);
      if (option.takesValue) {
        selection.nonInteractiveFlags.push("true");
      }
      break;
    }
  }

  return selection;
}

export function buildPreferredArgs(
  args: string[],
  selection: PreferredFlagSelection,
): string[] {
  const nextArgs = [...args];
  if (selection.jsonFlag) {
    nextArgs.push(selection.jsonFlag);
    if (selection.jsonFlagValue) {
      nextArgs.push(selection.jsonFlagValue);
    }
  }
  nextArgs.push(...selection.nonInteractiveFlags);
  return nextArgs;
}
