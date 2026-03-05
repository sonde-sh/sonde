import type { RunResult } from "@sonde-sh/runtime";
import type { StmManifest, StmOption } from "@sonde-sh/spec";

import { ANALYZERS, type AnalyzerEntry } from "./analyzers.js";

export interface ScoreWeights {
  jsonSupport: number;
  hierarchyConsistency: number;
  predictableFlags: number;
  deterministicOutput: number;
  interactiveBehavior: number;
}

export interface MetricReport {
  id: keyof ScoreWeights;
  score: number;
  weight: number;
  weightedScore: number;
  details: string[];
}

export interface ScoreInput {
  manifest: StmManifest;
  runResults?: RunResult[];
}

export interface ScoreReport {
  reportVersion: "1.0.0";
  manifestVersion: string;
  cli: string;
  total: number;
  grade: "A" | "B" | "C" | "D" | "F";
  jsonSupport: boolean;
  interactivePrompts: boolean;
  notes: string;
  weights: ScoreWeights;
  metrics: MetricReport[];
  analyzers: AnalyzerEntry[];
  generatedAt: string;
}

const WEIGHTS: ScoreWeights = {
  jsonSupport: 25,
  hierarchyConsistency: 20,
  predictableFlags: 20,
  deterministicOutput: 20,
  interactiveBehavior: 15,
};

function clampScore(input: number): number {
  return Math.max(0, Math.min(100, Math.round(input)));
}

function getGrade(total: number): ScoreReport["grade"] {
  if (total >= 90) {
    return "A";
  }
  if (total >= 80) {
    return "B";
  }
  if (total >= 70) {
    return "C";
  }
  if (total >= 60) {
    return "D";
  }
  return "F";
}

function isJsonOption(option: StmOption): boolean {
  return /\bjson\b/i.test(option.long) || /\bjson\b/i.test(option.description ?? "");
}

function scoreJsonSupport(input: ScoreInput): MetricReport {
  const commands = input.manifest.commands;
  if (commands.length === 0) {
    return {
      id: "jsonSupport",
      score: 0,
      weight: WEIGHTS.jsonSupport,
      weightedScore: 0,
      details: ["No commands available to evaluate JSON support."],
    };
  }

  const withJsonSupport = commands.filter(
    (command) =>
      command.supportsJson || command.options.some((option) => isJsonOption(option)),
  ).length;

  const score = clampScore((withJsonSupport / commands.length) * 100);
  return {
    id: "jsonSupport",
    score,
    weight: WEIGHTS.jsonSupport,
    weightedScore: (score / 100) * WEIGHTS.jsonSupport,
    details: [`${String(withJsonSupport)}/${String(commands.length)} commands support JSON.`],
  };
}

function scoreHierarchyConsistency(input: ScoreInput): MetricReport {
  const commands = input.manifest.commands;
  const details: string[] = [];
  let consistent = 0;

  for (const command of commands) {
    const joinedPath = command.path.join(" ");
    if (joinedPath === command.name) {
      consistent += 1;
      continue;
    }
    details.push(`Command "${command.name}" mismatches path "${joinedPath}".`);
  }

  const score =
    commands.length === 0 ? 0 : clampScore((consistent / commands.length) * 100);
  if (details.length === 0) {
    details.push("All commands have path/name consistency.");
  }
  return {
    id: "hierarchyConsistency",
    score,
    weight: WEIGHTS.hierarchyConsistency,
    weightedScore: (score / 100) * WEIGHTS.hierarchyConsistency,
    details,
  };
}

function scorePredictableFlags(input: ScoreInput): MetricReport {
  const allOptions = [
    ...input.manifest.globalOptions,
    ...input.manifest.commands.flatMap((command) => command.options),
  ];

  if (allOptions.length === 0) {
    return {
      id: "predictableFlags",
      score: 0,
      weight: WEIGHTS.predictableFlags,
      weightedScore: 0,
      details: ["No options available for predictability checks."],
    };
  }

  const validOptions = allOptions.filter((option) => option.long.startsWith("--"));
  const score = clampScore((validOptions.length / allOptions.length) * 100);

  return {
    id: "predictableFlags",
    score,
    weight: WEIGHTS.predictableFlags,
    weightedScore: (score / 100) * WEIGHTS.predictableFlags,
    details: [`${String(validOptions.length)}/${String(allOptions.length)} long flags are predictable.`],
  };
}

function scoreDeterministicOutput(input: ScoreInput): MetricReport {
  const runResults = input.runResults ?? [];
  if (runResults.length < 2) {
    return {
      id: "deterministicOutput",
      score: 100,
      weight: WEIGHTS.deterministicOutput,
      weightedScore: WEIGHTS.deterministicOutput,
      details: ["Insufficient repeated runs; assuming deterministic output."],
    };
  }

  const groups = new Map<string, string[]>();
  for (const result of runResults) {
    const key = `${result.command}|${result.args.join(" ")}`;
    const existing = groups.get(key) ?? [];
    existing.push(result.combinedOutput);
    groups.set(key, existing);
  }

  let stableGroups = 0;
  let evaluatedGroups = 0;
  const details: string[] = [];

  for (const [key, outputs] of groups) {
    if (outputs.length < 2) {
      continue;
    }
    evaluatedGroups += 1;
    const [firstOutput, ...rest] = outputs;
    const stable = rest.every((output) => output === firstOutput);
    if (stable) {
      stableGroups += 1;
    } else {
      details.push(`Output changed across repeated run for "${key}".`);
    }
  }

  if (evaluatedGroups === 0) {
    return {
      id: "deterministicOutput",
      score: 100,
      weight: WEIGHTS.deterministicOutput,
      weightedScore: WEIGHTS.deterministicOutput,
      details: ["No repeated commands detected; assuming deterministic output."],
    };
  }

  const score = clampScore((stableGroups / evaluatedGroups) * 100);
  if (details.length === 0) {
    details.push("Repeated command runs are stable.");
  }
  return {
    id: "deterministicOutput",
    score,
    weight: WEIGHTS.deterministicOutput,
    weightedScore: (score / 100) * WEIGHTS.deterministicOutput,
    details,
  };
}

function scoreInteractiveBehavior(input: ScoreInput): MetricReport {
  const runResults = input.runResults ?? [];
  if (runResults.length === 0) {
    return {
      id: "interactiveBehavior",
      score: 100,
      weight: WEIGHTS.interactiveBehavior,
      weightedScore: WEIGHTS.interactiveBehavior,
      details: ["No run results provided; assuming non-interactive behavior."],
    };
  }

  const interactiveCount = runResults.filter(
    (result) => result.interactiveDetected,
  ).length;
  const score = clampScore(
    ((runResults.length - interactiveCount) / runResults.length) * 100,
  );

  return {
    id: "interactiveBehavior",
    score,
    weight: WEIGHTS.interactiveBehavior,
    weightedScore: (score / 100) * WEIGHTS.interactiveBehavior,
    details: [
      `${String(interactiveCount)} of ${String(runResults.length)} runs showed interactive prompts.`,
    ],
  };
}

export function scoreManifest(input: ScoreInput): ScoreReport {
  const metrics = [
    scoreJsonSupport(input),
    scoreHierarchyConsistency(input),
    scorePredictableFlags(input),
    scoreDeterministicOutput(input),
    scoreInteractiveBehavior(input),
  ];

  const total = clampScore(
    metrics.reduce((sum, metric) => sum + metric.weightedScore, 0),
  );

  return {
    reportVersion: "1.0.0",
    manifestVersion: input.manifest.version,
    cli: input.manifest.cli.name,
    total,
    grade: getGrade(total),
    jsonSupport:
      metrics.find((metric) => metric.id === "jsonSupport")?.score !== 0,
    interactivePrompts:
      metrics.find((metric) => metric.id === "interactiveBehavior")?.score !==
      100,
    notes: metrics.flatMap((metric) => metric.details).join(" "),
    weights: WEIGHTS,
    metrics,
    analyzers: ANALYZERS,
    generatedAt: new Date().toISOString(),
  };
}
