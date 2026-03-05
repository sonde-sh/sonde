import Link from "next/link";
import {
  ArrowRight,
  Braces,
  CheckCircle2,
  GitBranch,
  ShieldCheck,
  Sparkles,
  Terminal,
} from "lucide-react";

import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

export function HomePage() {
  return (
    <div className="space-y-10">
      <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden border-y border-(--border) bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.12),transparent_38%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.12),transparent_34%),var(--card)]">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[42px_42px] opacity-40" />
        <div className="relative mx-auto grid w-full max-w-5xl gap-8 px-4 py-16 md:py-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-5">
            <Badge variant="neutral">Manifest-first CLI quality</Badge>
            <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
              One manifest to make CLI tools predictable.
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-(--muted-foreground)">
              Without a shared manifest, each CLI behaves differently and LLM
              integrations break in subtle ways. Sonde helps maintainers validate
              behavior against one contract and publish evidence that others can
              trust.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/sondages">
                <Button>
                  View live reports <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
              <Link href="/docs">
                <Button variant="outline">Read the manifest docs</Button>
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-(--primary)">
              <p className="inline-flex items-center gap-2">
                <CheckCircle2 className="size-4 text-(--primary)" />
                Shared contract for LLM-ready CLIs
              </p>
              <p className="inline-flex items-center gap-2">
                <CheckCircle2 className="size-4 text-(--primary)" />
                Deterministic scoring model
              </p>
              <p className="inline-flex items-center gap-2">
                <CheckCircle2 className="size-4 text-(--primary)" />
                CI and local parity
              </p>
            </div>
          </div>
          <Card className="border-(--border) bg-(--background)/90 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Terminal className="size-4" />
                Quick start
              </CardTitle>
              <CardDescription>Adopt the manifest and publish comparable reports.</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="overflow-x-auto rounded-md border border-(--border) bg-(--muted) p-3 text-xs leading-relaxed text-(--foreground)">
                <code>{`npx @sonde-sh/sonde generate cli-good --json
npx @sonde-sh/sonde score cli-good --json
npx @sonde-sh/sonde publish cli-good --json`}</code>
              </pre>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-2xl border border-(--border) bg-(--card) p-6 md:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(16,185,129,0.14),transparent_34%),radial-gradient(circle_at_85%_10%,rgba(59,130,246,0.14),transparent_34%)]" />
        <div className="relative grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-4">
            <Badge variant="neutral">Manifest example</Badge>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              What good looks like
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-(--muted-foreground)">
              A strong manifest is explicit about command behavior, machine-readable
              output, and non-interactive mode. That is what lets LLM tooling use a
              CLI reliably across environments.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-(--border) bg-(--background)/70 p-3 text-sm">
                <p className="inline-flex items-center gap-2 font-medium">
                  <Braces className="size-4 text-(--primary)" />
                  Explicit command contract
                </p>
              </div>
              <div className="rounded-lg border border-(--border) bg-(--background)/70 p-3 text-sm">
                <p className="inline-flex items-center gap-2 font-medium">
                  <ShieldCheck className="size-4 text-(--primary)" />
                  Stable JSON output
                </p>
              </div>
            </div>
          </div>
          <pre className="overflow-x-auto rounded-xl border border-(--border) bg-[linear-gradient(145deg,var(--muted),color-mix(in_oklab,var(--muted),black_10%))] p-4 text-xs leading-relaxed text-(--foreground) shadow-sm">
            <code>{`{
  "name": "my-cli",
  "version": "1.4.0",
  "commands": [
    {
      "name": "scan",
      "description": "Run repository scan",
      "supportsJson": true,
      "nonInteractive": true
    }
  ],
  "output": {
    "schemaVersion": "1.0.0",
    "formats": ["json"]
  }
}`}</code>
          </pre>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-2xl border border-(--border) bg-(--card) p-6 md:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,transparent_45%,color-mix(in_oklab,var(--primary),transparent_88%)_100%)]" />
        <div className="relative space-y-5">
          <div className="space-y-3">
            <Badge variant="neutral">Why maintainers care</Badge>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Adoption creates leverage
            </h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-(--border) bg-(--background)/80 p-4">
              <p className="inline-flex items-center gap-2 text-sm font-medium">
                <Sparkles className="size-4 text-(--primary)" />
                Better LLM interoperability
              </p>
              <p className="mt-2 text-sm text-(--muted-foreground)">
                Fewer retries and fewer hidden assumptions when external tools invoke
                your CLI.
              </p>
            </div>
            <div className="rounded-lg border border-(--border) bg-(--background)/80 p-4">
              <p className="inline-flex items-center gap-2 text-sm font-medium">
                <GitBranch className="size-4 text-(--primary)" />
                Safer releases
              </p>
              <p className="mt-2 text-sm text-(--muted-foreground)">
                Manifest checks surface behavior drift before integrations break in
                downstream repos.
              </p>
            </div>
            <div className="rounded-lg border border-(--border) bg-(--background)/80 p-4">
              <p className="inline-flex items-center gap-2 text-sm font-medium">
                <Braces className="size-4 text-(--primary)" />
                Clear integration contract
              </p>
              <p className="mt-2 text-sm text-(--muted-foreground)">
                Integrators consume known capabilities instead of reverse engineering
                prompt/output behavior.
              </p>
            </div>
            <div className="rounded-lg border border-(--border) bg-(--background)/80 p-4">
              <p className="inline-flex items-center gap-2 text-sm font-medium">
                <ShieldCheck className="size-4 text-(--primary)" />
                Shared quality bar
              </p>
              <p className="mt-2 text-sm text-(--muted-foreground)">
                Contributors validate against one standard, not one-off scripts.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-2xl border border-(--border) bg-[linear-gradient(155deg,var(--card),color-mix(in_oklab,var(--card),var(--muted)_45%))] p-6 md:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-(--primary)/20 blur-3xl" />
        <div className="relative grid gap-5 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-3">
            <Badge variant="neutral">Sonde CLI</Badge>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              How Sonde helps you implement it
            </h2>
            <CardDescription className="max-w-xl">
              Use Sonde to go from initial manifest draft to verified compatibility
              in local dev and CI.
            </CardDescription>
            <div className="space-y-2 text-sm text-(--muted-foreground)">
              <p className="inline-flex items-center gap-2">
                <span className="inline-flex size-6 items-center justify-center rounded-full border border-(--border) text-xs font-semibold text-(--primary)">
                  1
                </span>
                Run validation while implementing commands
              </p>
              <p className="inline-flex items-center gap-2">
                <span className="inline-flex size-6 items-center justify-center rounded-full border border-(--border) text-xs font-semibold text-(--primary)">
                  2
                </span>
                Generate report artifacts for CI
              </p>
              <p className="inline-flex items-center gap-2">
                <span className="inline-flex size-6 items-center justify-center rounded-full border border-(--border) text-xs font-semibold text-(--primary)">
                  3
                </span>
                Publish results in the report explorer
              </p>
            </div>
          </div>
          <Card className="border-(--border) bg-(--background)/85">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Implementation flow</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-(--muted-foreground)">
              <pre className="overflow-x-auto rounded-md border border-(--border) bg-(--muted) p-3 text-xs leading-relaxed text-(--foreground)">
                <code>{`sonde generate <cli> --json
sonde run <cli> --json
sonde score <cli> --json`}</code>
              </pre>
              <Link className="inline-flex items-center gap-1 font-medium hover:underline" href="/docs">
                Integration guide
                <ArrowRight className="size-3.5" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
