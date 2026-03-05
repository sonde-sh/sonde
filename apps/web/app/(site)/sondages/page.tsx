import Link from "next/link";
import { ArrowRight, ArrowUpRight, Terminal } from "lucide-react";

import { Badge } from "../../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { isPositive, loadLeaderboardRows } from "../../../lib/leaderboard";

export const dynamic = "force-dynamic";

export async function SondagesPage() {
  const { rows } = await loadLeaderboardRows();
  const topScore = rows[0]?.score ?? "-";

  return (
    <div className="space-y-10">
      <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden border-y border-(--border) bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.12),transparent_38%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.12),transparent_34%),var(--card)]">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[42px_42px] opacity-40" />
        <div className="relative mx-auto grid w-full max-w-5xl gap-8 px-4 py-16 md:py-20 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <Badge variant="neutral">Manifest reports</Badge>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Real CLI behavior, ranked.
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-(--muted-foreground)">
              Every entry shows whether a CLI actually follows the manifest
              contract. Compare schema status, JSON support, prompt behavior, and
              implementation notes before shipping or integrating.
            </p>
            <Link className="inline-flex items-center gap-1 text-sm font-medium hover:underline" href="/docs">
              Understand the manifest contract
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <div className="grid gap-2 text-sm sm:grid-cols-3 lg:grid-cols-1">
            <Card className="p-3">
              <CardHeader className="space-y-0 p-0">
                <CardTitle className="text-xs text-(--muted-foreground)">Entries</CardTitle>
              </CardHeader>
              <CardContent className="p-0 pt-1 text-lg font-semibold">{rows.length}</CardContent>
            </Card>
            <Card className="p-3">
              <CardHeader className="space-y-0 p-0">
                <CardTitle className="text-xs text-(--muted-foreground)">Top score</CardTitle>
              </CardHeader>
              <CardContent className="p-0 pt-1 text-lg font-semibold">{topScore}</CardContent>
            </Card>
            <Card className="p-3">
              <CardHeader className="space-y-0 p-0">
                <CardTitle className="text-xs text-(--muted-foreground)">Mode</CardTitle>
              </CardHeader>
              <CardContent className="inline-flex items-center gap-2 p-0 pt-1 text-sm font-semibold">
                <Terminal className="size-3.5" />
                {rows.length > 0 ? "Live leaderboard" : "Awaiting reports"}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {rows.length === 0 ? (
        <Card>
          <CardContent className="space-y-3 p-6">
            <p className="text-sm text-(--muted-foreground)">No reports found yet.</p>
            <p className="text-sm text-(--muted-foreground)">
              Generate standardized report artifacts from your manifest workflow
              and refresh to see results here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card className="border-(--border)">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>CLI</TableHead>
                    <TableHead>Manifest</TableHead>
                    <TableHead>Last updated</TableHead>
                    <TableHead>Schema</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>JSON</TableHead>
                    <TableHead>Prompts</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.slug}>
                      <TableCell className="font-medium">
                        <Link className="inline-flex items-center gap-1 hover:underline" href={`/sondages/${row.slug}`}>
                          {row.cli}
                          <ArrowUpRight className="size-3.5" />
                        </Link>
                      </TableCell>
                      <TableCell>{row.manifestVersion}</TableCell>
                      <TableCell>{row.lastUpdatedAt}</TableCell>
                      <TableCell>
                        <Badge variant={isPositive(row.schemaStatus) ? "success" : "neutral"}>
                          {row.schemaStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">{row.score}</TableCell>
                      <TableCell>
                        <Badge variant={isPositive(row.jsonSupport) ? "success" : "neutral"}>
                          {row.jsonSupport}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={isPositive(row.interactivePrompts) ? "success" : "neutral"}>
                          {row.interactivePrompts}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-lg text-sm text-(--muted-foreground)">
                        {row.notes}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default SondagesPage;
