import { NextResponse } from "next/server";
import { z } from "zod";

import { approvePendingReport } from "../../../../lib/reports-storage";

export const runtime = "nodejs";

const approveBodySchema = z.object({
  id: z.string().trim().min(1),
  approvedBy: z.string().trim().min(1).optional(),
});

function readAdminToken(): string | null {
  const token = process.env.SONDE_REPORTS_ADMIN_TOKEN;
  return typeof token === "string" && token.trim().length > 0 ? token.trim() : null;
}

export async function POST(request: Request): Promise<Response> {
  const configuredToken = readAdminToken();
  if (!configuredToken) {
    return NextResponse.json(
      { ok: false, error: { message: "Approval is not configured" } },
      { status: 503 },
    );
  }

  const providedToken = request.headers.get("x-sonde-admin-token")?.trim();
  if (!providedToken || providedToken !== configuredToken) {
    return NextResponse.json(
      { ok: false, error: { message: "Unauthorized admin token" } },
      { status: 401 },
    );
  }

  try {
    const body = (await request.json()) as unknown;
    const { id, approvedBy } = approveBodySchema.parse(body);
    const approved = await approvePendingReport(id, approvedBy);
    return NextResponse.json(
      {
        ok: true,
        id: approved.id,
        status: approved.status,
        approvedAt: approved.approvedAt,
      },
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to approve report";
    return NextResponse.json({ ok: false, error: { message } }, { status: 400 });
  }
}
