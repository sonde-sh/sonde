import { del, list, put } from "@vercel/blob";
import { z } from "zod";

export const publishReportSchema = z.object({
  cli: z.string().trim().min(1),
  manifestVersion: z.string().trim().min(1),
  generatedAt: z.string().datetime({ offset: true }),
  schemaValid: z.boolean(),
  score: z.number().finite(),
  jsonSupport: z.boolean(),
  interactivePrompts: z.boolean(),
  notes: z.string().trim().min(1),
  publisherId: z.string().trim().min(1).optional(),
  sourceVersion: z.string().trim().min(1).optional(),
  report: z.record(z.string(), z.unknown()).optional(),
});

export type PublishReportInput = z.infer<typeof publishReportSchema>;

const storedReportBaseSchema = publishReportSchema.extend({
  id: z.string().trim().min(1),
  submittedAt: z.string().datetime({ offset: true }),
});

const pendingReportSchema = storedReportBaseSchema.extend({
  status: z.literal("pending"),
});

const approvedReportSchema = storedReportBaseSchema.extend({
  status: z.literal("approved"),
  approvedAt: z.string().datetime({ offset: true }),
  approvedBy: z.string().trim().min(1).optional(),
});

type PendingReportRecord = z.infer<typeof pendingReportSchema>;
type ApprovedReportRecord = z.infer<typeof approvedReportSchema>;

export interface ReportDocument {
  sourceFile: string;
  rawReport: string;
}

const PENDING_PREFIX = "reports/pending/";
const APPROVED_PREFIX = "reports/approved/";

function getBlobToken(): string | undefined {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  return typeof token === "string" && token.trim().length > 0 ? token.trim() : undefined;
}

function getBlobTokenOrThrow(): string {
  const token = getBlobToken();
  if (!token) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not configured");
  }
  return token;
}

function getBlobOptions(): { token?: string } {
  const token = getBlobToken();
  return token ? { token } : {};
}

function sanitizePathSegment(value: string): string {
  const normalized = value.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
  return normalized.length > 0 ? normalized : "report";
}

function createReportId(cli: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const random = crypto.randomUUID().split("-")[0] ?? "unknown";
  return `${sanitizePathSegment(cli)}-${timestamp}-${random}`;
}

function getPendingPath(id: string): string {
  return `${PENDING_PREFIX}${id}.json`;
}

function getApprovedPath(id: string): string {
  return `${APPROVED_PREFIX}${id}.json`;
}

async function listAllBlobs(prefix: string): Promise<Array<{ pathname: string; url: string }>> {
  const blobs: Array<{ pathname: string; url: string }> = [];
  let cursor: string | undefined;
  const token = getBlobTokenOrThrow();

  do {
    const page = await list({
      prefix,
      cursor,
      token,
    });
    for (const blob of page.blobs) {
      blobs.push({ pathname: blob.pathname, url: blob.url });
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  return blobs;
}

async function findBlobByPath(pathname: string): Promise<{ pathname: string; url: string } | null> {
  const token = getBlobTokenOrThrow();
  const response = await list({ prefix: pathname, token });
  const blob = response.blobs.find((entry) => entry.pathname === pathname);
  return blob ? { pathname: blob.pathname, url: blob.url } : null;
}

async function fetchBlobText(url: string): Promise<string> {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to fetch blob content (${response.status})`);
  }
  return response.text();
}

export function isBlobStorageConfigured(): boolean {
  return getBlobToken() !== undefined;
}

export async function createPendingReport(input: PublishReportInput): Promise<PendingReportRecord> {
  const payload = publishReportSchema.parse(input);
  const now = new Date().toISOString();
  const id = createReportId(payload.cli);
  const pendingRecord: PendingReportRecord = {
    ...payload,
    id,
    status: "pending",
    submittedAt: now,
  };

  await put(getPendingPath(id), JSON.stringify(pendingRecord, null, 2), {
    access: "public",
    addRandomSuffix: false,
    ...getBlobOptions(),
  });

  return pendingRecord;
}

export async function approvePendingReport(
  reportId: string,
  approvedBy?: string,
): Promise<ApprovedReportRecord> {
  const id = reportId.trim();
  if (id.length === 0) {
    throw new Error("Report id is required");
  }

  const pendingPath = getPendingPath(id);
  const pendingBlob = await findBlobByPath(pendingPath);
  if (!pendingBlob) {
    throw new Error(`Pending report '${id}' was not found`);
  }

  const rawPending = await fetchBlobText(pendingBlob.url);
  const pending = pendingReportSchema.parse(JSON.parse(rawPending) as unknown);
  const approvedRecord = approvedReportSchema.parse({
    ...pending,
    status: "approved",
    approvedAt: new Date().toISOString(),
    approvedBy: approvedBy?.trim() || undefined,
  }) as ApprovedReportRecord;

  await put(getApprovedPath(approvedRecord.id), JSON.stringify(approvedRecord, null, 2), {
    access: "public",
    addRandomSuffix: false,
    ...getBlobOptions(),
  });
  await del(pendingBlob.url, getBlobOptions());

  return approvedRecord;
}

export async function loadApprovedReportDocuments(): Promise<ReportDocument[]> {
  const blobs = await listAllBlobs(APPROVED_PREFIX);
  const documents = await Promise.all(
    blobs.map(async (blob) => ({
      sourceFile: blob.pathname.replace(APPROVED_PREFIX, ""),
      rawReport: await fetchBlobText(blob.url),
    })),
  );

  documents.sort((a, b) => a.sourceFile.localeCompare(b.sourceFile));
  return documents;
}
