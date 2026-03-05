interface ChecklistItem {
  title: string;
  detail: string;
}

const checklist: ChecklistItem[] = [
  {
    title: "Manifest foundations",
    detail: "Start with /docs/foundations/sonde and /docs/foundations/sondage-manifest for contract semantics and versioning.",
  },
  {
    title: "Reference CLI commands",
    detail: "Use /docs/reference-implementation/cli-reference for command behavior and flags in the reference implementation.",
  },
  {
    title: "Integration + evaluation",
    detail: "Use /docs/integration/cli-serve-protocol and /docs/evaluation/scoring-100-guide for protocol and quality workflows.",
  },
];

export function CliReferencePage() {
  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <p className="inline-flex rounded-full border px-3 py-1 text-xs font-medium">
          Route: /cli-reference
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Documentation pointer</h1>
        <p className="max-w-3xl text-sm leading-relaxed text-(--muted-foreground)">
          This route is intentionally a pointer page. Canonical Sonde documentation lives under
          <code> /docs/* </code> so human readers and LLM tooling use one stable source.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {checklist.map((item) => (
          <article key={item.title} className="rounded-lg border p-4">
            <h2 className="text-sm font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm text-(--muted-foreground)">
              {item.detail}
            </p>
          </article>
        ))}
      </section>

      <section className="rounded-xl border border-(--border) bg-(--card) p-5">
        <h2 className="text-sm font-semibold">Canonical docs routes</h2>
        <p className="mt-2 text-sm leading-relaxed text-(--muted-foreground)">
          Use <code>/docs/foundations/sonde</code>, <code>/docs/foundations/sondage-manifest</code>,
          <code>/docs/reference-implementation/cli-reference</code>,
          <code>/docs/reference-implementation/quickstart</code>, and
          <code>/docs/help/troubleshooting</code> for full reference content.
        </p>
      </section>
    </div>
  );
}

export default CliReferencePage;
