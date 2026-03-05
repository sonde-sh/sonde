interface ChecklistItem {
  title: string;
  detail: string;
}

const checklist: ChecklistItem[] = [
  {
    title: "Canonical CLI docs",
    detail: "Use /docs/cli-reference as the source of truth for all commands and flags.",
  },
  {
    title: "Serve protocol",
    detail: "Use /docs/cli-serve-protocol for JSON line request and response contracts.",
  },
  {
    title: "100/100 scoring path",
    detail: "Use /docs/scoring-100-guide to reproduce and validate deterministic scoring.",
  },
];

export function CliReferencePage() {
  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <p className="inline-flex rounded-full border px-3 py-1 text-xs font-medium">
          Route: /cli-reference
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">CLI docs pointer</h1>
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
          Use <code>/docs/cli-reference</code>, <code>/docs/quickstart</code>,
          <code>/docs/architecture</code>, and <code>/docs/troubleshooting</code> for full
          reference content.
        </p>
      </section>
    </div>
  );
}

export default CliReferencePage;
