import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import {
  isBlobStorageConfigured,
  loadApprovedReportDocuments,
  type ReportDocument,
} from "./reports-storage";

export interface LeaderboardRow {
  cli: string;
  score: string;
  manifestVersion: string;
  lastUpdatedAt: string;
  schemaStatus: string;
  jsonSupport: string;
  interactivePrompts: string;
  notes: string;
  sortScore: number;
  sourceFile: string;
  slug: string;
}

interface RecordLike {
  [key: string]: unknown;
}

interface ParsedRow {
  row: Omit<LeaderboardRow, "slug">;
  slugSeed: string;
}

const DEFAULT_REPORTS_DIR = path.resolve(process.cwd(), "..", "..", "reports");
const BLOB_REPORTS_DIR = "vercel-blob://reports/approved";

function isObject(value: unknown): value is RecordLike {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function readBooleanLike(value: unknown): string {
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true" || normalized === "yes") {
      return "Yes";
    }
    if (normalized === "false" || normalized === "no") {
      return "No";
    }
    return value.trim() || "-";
  }

  if (typeof value === "number") {
    return value === 0 ? "No" : "Yes";
  }

  return "-";
}

function readScore(value: unknown): { score: string; sortScore: number } {
  if (typeof value === "number" && Number.isFinite(value)) {
    return { score: value.toString(), sortScore: value };
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      return { score: "-", sortScore: Number.NEGATIVE_INFINITY };
    }
    const parsed = Number(trimmed);
    if (Number.isFinite(parsed)) {
      return { score: trimmed, sortScore: parsed };
    }
    return { score: trimmed, sortScore: Number.NEGATIVE_INFINITY };
  }

  return { score: "-", sortScore: Number.NEGATIVE_INFINITY };
}

function slugify(value: string): string {
  const normalized = value.trim().toLowerCase();
  const slug = normalized
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug.length > 0 ? slug : "report";
}

function createUniqueSlug(base: string, usedSlugs: Set<string>): string {
  let slug = base;
  let index = 2;

  while (usedSlugs.has(slug)) {
    slug = `${base}-${index}`;
    index += 1;
  }

  usedSlugs.add(slug);
  return slug;
}

function parseRow(row: unknown, sourceFile: string): ParsedRow | null {
  if (!isObject(row)) {
    return null;
  }

  const cli =
    readString(row.cli) ??
    readString(row.command) ??
    readString(row.name) ??
    path.basename(sourceFile, ".json");

  const { score, sortScore } = readScore(
    row.score ?? row.totalScore ?? row.value ?? row.points
  );

  return {
    row: {
      cli,
      score,
      manifestVersion:
        readString(row.manifestVersion) ??
        readString(row.manifest_version) ??
        readString(row.version) ??
        "-",
      lastUpdatedAt:
        readString(row.lastUpdatedAt) ??
        readString(row.last_updated_at) ??
        readString(row.generatedAt) ??
        readString(row.generated_at) ??
        readString(row.updatedAt) ??
        readString(row.updated_at) ??
        "-",
      schemaStatus: readBooleanLike(
        row.schemaValid ?? row.schema_valid ?? row.contractStatus ?? row.contract_status,
      ),
      jsonSupport: readBooleanLike(
        row.jsonSupport ?? row.json_output ?? row.jsonOutput ?? row.json
      ),
      interactivePrompts: readBooleanLike(
        row.interactivePrompts ?? row.interactive ?? row.prompts
      ),
      notes:
        readString(row.notes) ??
        readString(row.note) ??
        readString(row.summary) ??
        "-",
      sortScore,
      sourceFile,
    },
    slugSeed: readString(row.slug) ?? cli,
  };
}

function parseRows(data: unknown, sourceFile: string): ParsedRow[] {
  if (Array.isArray(data)) {
    return data
      .map((entry) => parseRow(entry, sourceFile))
      .filter((entry): entry is ParsedRow => entry !== null);
  }

  if (isObject(data)) {
    const container =
      (Array.isArray(data.leaderboard) && data.leaderboard) ||
      (Array.isArray(data.reports) && data.reports) ||
      (Array.isArray(data.results) && data.results) ||
      (Array.isArray(data.items) && data.items);

    if (container) {
      return container
        .map((entry) => parseRow(entry, sourceFile))
        .filter((entry): entry is ParsedRow => entry !== null);
    }

    const singleRow = parseRow(data, sourceFile);
    return singleRow ? [singleRow] : [];
  }

  return [];
}

export async function loadLeaderboardRows(): Promise<{
  rows: LeaderboardRow[];
  reportsDir: string;
}> {
  const { reportsDir, documents } = await loadReportDocuments();

  const rows: LeaderboardRow[] = [];
  const usedSlugs = new Set<string>();

  for (const document of documents) {
    try {
      const data = JSON.parse(document.rawReport) as unknown;
      const parsedRows = parseRows(data, document.sourceFile);
      for (const parsedRow of parsedRows) {
        const slug = createUniqueSlug(slugify(parsedRow.slugSeed), usedSlugs);
        rows.push({ ...parsedRow.row, slug });
      }
    } catch {
      const fallbackSlug = createUniqueSlug(
        slugify(path.basename(document.sourceFile, ".json")),
        usedSlugs
      );
      rows.push({
        cli: path.basename(document.sourceFile, ".json"),
        score: "-",
        manifestVersion: "-",
        lastUpdatedAt: "-",
        schemaStatus: "-",
        jsonSupport: "-",
        interactivePrompts: "-",
        notes: "Invalid JSON report file",
        sortScore: Number.NEGATIVE_INFINITY,
        sourceFile: document.sourceFile,
        slug: fallbackSlug,
      });
    }
  }

  rows.sort((a, b) => {
    if (a.sortScore !== b.sortScore) {
      return b.sortScore - a.sortScore;
    }
    const cliCompare = a.cli.localeCompare(b.cli);
    if (cliCompare !== 0) {
      return cliCompare;
    }
    return a.sourceFile.localeCompare(b.sourceFile);
  });

  return { rows, reportsDir };
}

export async function loadLeaderboardRowBySlug(
  slug: string
): Promise<{ row: LeaderboardRow; reportsDir: string; rawReport: string } | null> {
  const { rows, reportsDir } = await loadLeaderboardRows();
  const row = rows.find((entry) => entry.slug === slug);

  if (!row) {
    return null;
  }

  const { documents } = await loadReportDocuments();
  const document = documents.find((entry) => entry.sourceFile === row.sourceFile);
  if (!document) {
    return { row, reportsDir, rawReport: "Unable to read report file." };
  }
  return { row, reportsDir, rawReport: document.rawReport };
}

export function isPositive(value: string): boolean {
  return value.toLowerCase() === "yes";
}

async function loadReportDocuments(): Promise<{ reportsDir: string; documents: ReportDocument[] }> {
  if (isBlobStorageConfigured()) {
    try {
      const blobDocuments = await loadApprovedReportDocuments();
      if (blobDocuments.length > 0) {
        return { reportsDir: BLOB_REPORTS_DIR, documents: blobDocuments };
      }
    } catch {
      // Fallback to local report artifacts when storage is unavailable.
    }
  }

  return {
    reportsDir: DEFAULT_REPORTS_DIR,
    documents: await loadReportDocumentsFromFilesystem(DEFAULT_REPORTS_DIR),
  };
}

async function loadReportDocumentsFromFilesystem(reportsDir: string): Promise<ReportDocument[]> {
  let entries: string[] = [];
  try {
    const dirEntries = await readdir(reportsDir, { withFileTypes: true });
    entries = dirEntries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b));
  } catch {
    return [];
  }

  const documents: ReportDocument[] = [];
  for (const fileName of entries) {
    const sourcePath = path.join(reportsDir, fileName);
    try {
      const rawReport = await readFile(sourcePath, "utf8");
      documents.push({ sourceFile: fileName, rawReport });
    } catch {
      documents.push({
        sourceFile: fileName,
        rawReport: "Unable to read report file.",
      });
    }
  }
  return documents;
}
