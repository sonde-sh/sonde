import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

interface ChecklistItem {
  title: string;
  detail: string;
}

const checklist: ChecklistItem[] = [
  {
    title: "Machine-readable output",
    detail: "Prefer deterministic flags such as --json for pipeline-friendly parsing.",
  },
  {
    title: "Prompt control",
    detail: "Use explicit answers, non-interactive modes, or skip flags in CI.",
  },
  {
    title: "Artifact export",
    detail: "Expose report and manifest paths so tooling can discover them automatically.",
  },
];

export function CliReferencePage() {
  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <Badge variant="neutral">Route: /cli-reference</Badge>
        <h1 className="text-3xl font-semibold tracking-tight">CLI implementation checklist</h1>
        <p className="max-w-3xl text-sm leading-relaxed text-[var(--muted-foreground)]">
          Keep CLI workflows deterministic, scriptable, and compatible with Sonde report
          ingestion.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {checklist.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <CardTitle className="text-sm">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-[var(--muted-foreground)]">
              {item.detail}
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
        <h2 className="text-sm font-semibold">Operational guidance</h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
          Sonde can expose generated artifacts through MCP-compatible surfaces so docs,
          automation, and external tooling consume a single source of truth.
        </p>
      </section>
    </div>
  );
}

export default CliReferencePage;
