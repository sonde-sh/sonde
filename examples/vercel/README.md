# Sonde Vercel Example

Reference fixture for evaluating and improving the Vercel CLI as an AI-native, AI-friendly CLI.
Use it to generate a manifest, run deterministic checks, and measure Sonde score in a Vercel-oriented workflow.

## Canonical docs

Use canonical docs under `apps/web/content/docs`:

- [Quickstart](../../apps/web/content/docs/quickstart.mdx)
- [CLI reference](../../apps/web/content/docs/cli-reference.mdx)
- [Serve protocol](../../apps/web/content/docs/cli-serve-protocol.mdx)

## Example commands

```sh
sonde --version
sonde generate vercel --json
sonde run vercel --json
sonde score vercel --json
```

## Tool serving

```sh
sonde serve --json
```

This fixture includes a sample `manifest.json` tool manifest for local protocol testing and agent/tool integrations.
