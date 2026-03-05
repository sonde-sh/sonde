import Link from "next/link";

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
    <div className="space-y-6">
      <section className="flex flex-wrap items-end justify-between gap-4 rounded-xl border border-(--border) bg-(--card) p-6">
        <div className="space-y-3">
          <Badge variant="neutral">Manifest reports</Badge>
          <h1 className="text-3xl font-semibold tracking-tight">Sondages</h1>
          <p className="max-w-3xl text-sm leading-relaxed text-(--muted-foreground)">
            These reports compare manifest-aligned automation behavior with a
            consistent scoring model. Each entry captures contract metadata,
            score, JSON support, interactive prompt behavior, and implementation
            notes so quality differences are easy to inspect.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>CLI</TableHead>
              <TableHead>Manifest</TableHead>
              <TableHead>Report</TableHead>
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
                  <Link className="hover:underline" href={`/sondages/${row.slug}`}>
                    {row.cli}
                  </Link>
                </TableCell>
                <TableCell>{row.manifestVersion}</TableCell>
                <TableCell>{row.reportVersion}</TableCell>
                <TableCell>
                  <Badge variant={isPositive(row.schemaStatus) ? "success" : "neutral"}>
                    {row.schemaStatus}
                  </Badge>
                </TableCell>
                <TableCell>{row.score}</TableCell>
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
      )}
    </div>
  );
}

export default SondagesPage;
