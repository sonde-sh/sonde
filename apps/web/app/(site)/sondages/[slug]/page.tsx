import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Terminal } from "lucide-react";

import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { isPositive, loadLeaderboardRowBySlug } from "../../../../lib/leaderboard";

export const dynamic = "force-dynamic";

interface SondageReportPageProps {
  params: Promise<{ slug: string }>;
}

export default async function SondageReportPage({ params }: Readonly<SondageReportPageProps>) {
  const { slug } = await params;
  const report = await loadLeaderboardRowBySlug(slug);

  if (!report) {
    notFound();
  }

  return (
    <div className="space-y-10">
      <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden border-y border-(--border) bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.12),transparent_38%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.12),transparent_34%),var(--card)]">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[42px_42px] opacity-40" />
        <div className="relative mx-auto w-full max-w-5xl space-y-4 px-4 py-14 md:py-16">
          <Badge variant="neutral">Report detail</Badge>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{report.row.cli}</h1>
            <Link href="/sondages">
              <Button variant="outline">
                <ArrowLeft className="mr-2 size-4" />
                Back to reports
              </Button>
            </Link>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-(--muted-foreground)">
            A manifest-alignment snapshot for this CLI. Review compatibility signals
            and raw output to decide whether behavior is safe for automation.
          </p>
          <p className="text-sm text-(--muted-foreground)">
            Source file:{" "}
            <code className="rounded bg-(--muted) px-1.5 py-1 text-xs text-(--foreground)">
              {report.row.sourceFile}
            </code>
          </p>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-(--muted-foreground)">Score</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-2xl font-semibold">{report.row.score}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-(--muted-foreground)">Manifest version</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">{report.row.manifestVersion}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-(--muted-foreground)">Report version</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">{report.row.reportVersion}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-(--muted-foreground)">Schema status</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Badge variant={isPositive(report.row.schemaStatus) ? "success" : "neutral"}>
              {report.row.schemaStatus}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-(--muted-foreground)">JSON support</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Badge variant={isPositive(report.row.jsonSupport) ? "success" : "neutral"}>
              {report.row.jsonSupport}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-(--muted-foreground)">
              Interactive prompts
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Badge variant={isPositive(report.row.interactivePrompts) ? "success" : "neutral"}>
              {report.row.interactivePrompts}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-(--muted-foreground)">Notes</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-sm text-(--muted-foreground)">
            {report.row.notes}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-(--muted-foreground)">Use this report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-(--muted-foreground)">
            <p>
              Compare this entry against other CLIs in the leaderboard and inspect
              raw JSON for schema and behavior drift.
            </p>
            <div className="space-y-2 rounded-md border border-(--border) bg-(--muted) p-3 text-xs text-(--foreground)">
              <p className="inline-flex items-center gap-2 font-medium">
                <Terminal className="size-3.5" />
                Suggested workflow
              </p>
              <pre className="overflow-x-auto leading-relaxed">
                <code>{`pnpm sonde run --manifest ./manifest.json
pnpm sonde web`}</code>
              </pre>
            </div>
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
          <pre className="overflow-x-auto rounded-md border border-(--border) bg-(--muted) p-4 text-xs leading-relaxed text-(--foreground)">
            <code>{report.rawReport}</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
