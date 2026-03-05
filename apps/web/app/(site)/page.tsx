import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";

export function HomePage() {
  return (
    <div className="space-y-6">
      <section className="space-y-4 rounded-xl border border-(--border) bg-(--card) p-6">
        <Badge variant="neutral">Manifest workflow</Badge>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Standardized manifest reports with deterministic signal.
        </h1>
        <p className="max-w-3xl text-base leading-relaxed text-(--muted-foreground)">
          Sonde aggregates local JSON reports into a predictable view so teams and
          agents can compare manifest-aligned automation behavior with minimal
          interpretation overhead.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/sondages">
            <Button>
              Open sondages <ArrowRight className="ml-2 size-4" />
            </Button>
          </Link>
          <Link href="/docs">
            <Button variant="outline">Browse docs</Button>
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Reliable inputs</CardTitle>
            <CardDescription>Reads report JSON files from a shared directory.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-(--muted-foreground)">
            Keep report ingestion flexible while preserving deterministic sorting and
            compatibility-oriented metadata.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Fast interpretation</CardTitle>
            <CardDescription>Contract and behavior signals at a glance.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-(--muted-foreground)">
            Quickly identify where implementations align with manifest expectations
            and where interactive behavior still causes friction.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>CI-friendly</CardTitle>
            <CardDescription>Designed for local + pipeline output parity.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-(--muted-foreground)">
            Report generation and sondages rendering stay machine-readable,
            reproducible, and easy to inspect.
          </CardContent>
        </Card>
      </section>

      <Separator />
      <p className="text-sm text-(--muted-foreground)">
        Use Sonde Web as the read layer for standardized report artifacts generated
        through your manifest validation runs.
      </p>
    </div>
  );
}

export default HomePage;
