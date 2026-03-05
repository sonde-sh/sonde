import { NextResponse } from "next/server";

import { createPendingReport, publishReportSchema } from "../../../../lib/reports-storage";

export const runtime = "nodejs";

function readPublishToken(): string | null {
  const token = process.env.SONDE_PUBLISH_TOKEN;
  return typeof token === "string" && token.trim().length > 0 ? token.trim() : null;
}

export async function POST(request: Request): Promise<Response> {
  const configuredToken = readPublishToken();
  if (!configuredToken) {
    return NextResponse.json(
      { ok: false, error: { message: "Publishing is not configured" } },
      { status: 503 },
    );
  }

  const providedToken = request.headers.get("x-sonde-publish-token")?.trim();
  if (!providedToken || providedToken !== configuredToken) {
    return NextResponse.json(
      { ok: false, error: { message: "Unauthorized publish token" } },
      { status: 401 },
    );
  }

  try {
    const body = (await request.json()) as unknown;
    const payload = publishReportSchema.parse(body);
    const pending = await createPendingReport(payload);
    return NextResponse.json(
      {
        ok: true,
        id: pending.id,
        status: pending.status,
        submittedAt: pending.submittedAt,
      },
      { status: 202 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid publish payload";
    return NextResponse.json({ ok: false, error: { message } }, { status: 400 });
  }
}
