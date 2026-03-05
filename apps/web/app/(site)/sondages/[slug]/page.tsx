import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";

import { Badge } from "../../../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { isPositive, loadLeaderboardRowBySlug } from "../../../../lib/leaderboard";

export const dynamic = "force-dynamic";

interface SondageReportPageProps {
  params: Promise<{ slug: string }>;
}

function formatRelativeTime(input: string): string {
  const parsedDate = new Date(input);
  if (Number.isNaN(parsedDate.getTime())) {
    return input;
  }

  const diffMs = Date.now() - parsedDate.getTime();
  if (diffMs < 0) {
    return "just now";
  }

  const minuteMs = 60_000;
  const hourMs = 60 * minuteMs;
  const dayMs = 24 * hourMs;

  if (diffMs < minuteMs) {
    return "just now";
  }

  if (diffMs < hourMs) {
    const minutes = Math.floor(diffMs / minuteMs);
    return `${String(minutes)} minute${minutes === 1 ? "" : "s"} ago`;
  }

  if (diffMs < dayMs) {
    const hours = Math.floor(diffMs / hourMs);
    return `${String(hours)} hour${hours === 1 ? "" : "s"} ago`;
  }

  const days = Math.floor(diffMs / dayMs);
  return `${String(days)} day${days === 1 ? "" : "s"} ago`;
}

export default async function SondageReportPage({ params }: Readonly<SondageReportPageProps>) {
  const { slug } = await params;
  const report = await loadLeaderboardRowBySlug(slug);

  if (!report) {
    notFound();
  }

  const lastUpdatedRelative = formatRelativeTime(report.row.lastUpdatedAt);

  return (
    <div className="space-y-10">
      <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden border-y border-(--border) bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.12),transparent_38%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.12),transparent_34%),var(--card)]">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[42px_42px] opacity-40" />
        <div className="relative mx-auto grid w-full max-w-5xl gap-8 px-4 py-14 md:py-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-4">
            <Link
              className="inline-flex items-center gap-1.5 text-sm font-medium text-(--muted-foreground) hover:text-(--foreground) hover:underline"
              href="/sondages"
            >
              <ArrowLeft className="size-4" />
              Back to reports
            </Link>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{report.row.cli}</h1>
            <p className="max-w-2xl text-sm leading-relaxed text-(--muted-foreground)">
              A manifest-alignment snapshot for this CLI. Use these compatibility
              signals before integrating this tool in automated workflows.
            </p>
            <p className="text-sm text-(--muted-foreground)">
              Source file:{" "}
              <code className="rounded bg-(--muted) px-1.5 py-1 text-xs text-(--foreground)">
                {report.row.sourceFile}
              </code>
            </p>
          </div>
          <Card className="border-(--border) bg-(--card)/95 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-(--muted-foreground)">Score</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <p className="text-5xl font-semibold leading-none">{report.row.score}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-(--muted-foreground)">Manifest</p>
                  <p className="font-medium">{report.row.manifestVersion}</p>
                </div>
                <div>
                  <p className="text-(--muted-foreground)">Last updated</p>
                  <p className="font-medium">{lastUpdatedRelative}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-(--muted-foreground)">Schema status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            <Badge variant={isPositive(report.row.schemaStatus) ? "success" : "neutral"}>
              {report.row.schemaStatus}
            </Badge>
            <p className="text-xs leading-relaxed text-(--muted-foreground)">
              Whether the report payload matches the expected Sonde schema and can
              be parsed reliably by downstream tooling.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-(--muted-foreground)">JSON support</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            <Badge variant={isPositive(report.row.jsonSupport) ? "success" : "neutral"}>
              {report.row.jsonSupport}
            </Badge>
            <p className="text-xs leading-relaxed text-(--muted-foreground)">
              Whether automation-friendly, machine-readable output is available on
              evaluated command paths.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-(--muted-foreground)">
              Interactive prompts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            <Badge variant={isPositive(report.row.interactivePrompts) ? "success" : "neutral"}>
              {report.row.interactivePrompts}
            </Badge>
            <p className="text-xs leading-relaxed text-(--muted-foreground)">
              Whether command runs show prompt-like behavior that can block
              unattended agents and CI jobs.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-(--muted-foreground)">Use this report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-(--muted-foreground)">
            <p>
              Use this page to decide if this CLI is safe to automate: schema
              validity checks parse safety, JSON support checks machine-readability,
              and prompt behavior checks non-interactive reliability.
            </p>
            <p>
              To reproduce or challenge the result, run Sonde with the execution
              method you already use in your environment, then compare your new
              output against this report.
            </p>
            <Link className="inline-flex items-center gap-1.5 hover:underline" href="/docs">
              Open Sonde docs
              <ExternalLink className="size-3.5" />
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Raw JSON</CardTitle>
        </CardHeader>
        <CardContent>
          <details className="group rounded-md border border-(--border) bg-(--muted)">
            <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-(--foreground) marker:content-none">
              <span className="inline-flex items-center gap-2">
                <span className="transition-transform group-open:rotate-90">▶</span>
                Show raw JSON payload
              </span>
            </summary>
            <div className="px-4 pb-4">
              <pre className="overflow-x-auto rounded-md border border-(--border) bg-(--background) p-4 text-xs leading-relaxed text-(--foreground)">
                <code>{report.rawReport}</code>
              </pre>
            </div>
          </details>
        </CardContent>
      </Card>
    </div>
  );
}
