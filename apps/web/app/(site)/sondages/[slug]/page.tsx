import Link from "next/link";
import { notFound } from "next/navigation";

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
    <div className="space-y-6">
      <section className="space-y-3 rounded-xl border border-(--border) bg-(--card) p-6">
        <Badge variant="neutral">Manifest report details</Badge>
        <h1 className="text-3xl font-semibold tracking-tight">{report.row.cli}</h1>
        <p className="text-sm text-(--muted-foreground)">
          Source file:{" "}
          <code className="rounded bg-(--muted) px-1.5 py-1 text-xs text-(--foreground)">
            {report.row.sourceFile}
          </code>
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
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
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-(--muted-foreground)">Notes</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-sm text-(--muted-foreground)">
            {report.row.notes}
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

      <Link href="/sondages">
        <Button variant="outline">Back to sondages</Button>
      </Link>
    </div>
  );
}
