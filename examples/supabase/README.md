# Sonde Supabase Example

Reference fixture showing how a Supabase workflow maps to the Sonde manifest contract.
Use it to generate standardized artifacts, run deterministic checks, and produce comparable reports through the reference CLI.

## Canonical docs

Use canonical docs under `apps/web/content/docs`:

- [Quickstart](../../apps/web/content/docs/reference-implementation/quickstart.mdx)
- [CLI reference](../../apps/web/content/docs/reference-implementation/cli-reference.mdx)
- [Serve protocol](../../apps/web/content/docs/integration/cli-serve-protocol.mdx)

## Example commands

```sh
sonde --version
sonde generate supabase --json
sonde run supabase --json
sonde score supabase --json
```

## Tool serving

```sh
sonde serve --json
```

This fixture includes a sample `manifest.json` tool manifest for local protocol testing and contract-aware agent/tool integrations.
