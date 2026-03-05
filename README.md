# Sonde

Sonde defines a stable manifest contract for AI-native CLI workflows and provides tooling to generate, validate, and score against that contract.
The CLI in this repository is the reference implementation used to produce standardized artifacts for developers, agents, and automation.

## Canonical docs

The canonical documentation source is:

- `apps/web/content/docs`

Start here:

- [Docs index](./apps/web/content/docs/index.mdx)
- [Sonde](./apps/web/content/docs/foundations/sonde.mdx)
- [Manifest](./apps/web/content/docs/foundations/sondage-manifest.mdx)
- [AI-native CLI requirements](./apps/web/content/docs/foundations/ai-native-cli-requirements.mdx)
- [Quickstart](./apps/web/content/docs/reference-implementation/quickstart.mdx)
- [CLI reference](./apps/web/content/docs/reference-implementation/cli-reference.mdx)
- [Serve protocol](./apps/web/content/docs/integration/cli-serve-protocol.mdx)
- [Scoring 100 guide](./apps/web/content/docs/evaluation/scoring-100-guide.mdx)
- [Troubleshooting](./apps/web/content/docs/help/troubleshooting.mdx)

## Manifest contract first

- The manifest contract is versioned in `sondage.manifest.json` via `version`.
- Command JSON envelopes include `apiVersion` to keep integrations parse-safe.
- Serve protocol readiness and responses include `protocolVersion`.
- Score reports include `manifestVersion` and `generatedAt` for compatibility and freshness tracking.

## Reference implementation (CLI)

```sh
npm install -g @sonde-sh/sonde
```

Or run directly:

```sh
npx @sonde-sh/sonde --help
```

## Quick command view

```sh
sonde generate <cli> [--json]
sonde manifest [--json]
sonde run <cli> [--json]
sonde score <cli> [--json]
sonde serve [--json]
```

For complete behavior, outputs, and edge cases, use the canonical [CLI reference](./apps/web/content/docs/reference-implementation/cli-reference.mdx).
For normative contract semantics, start with [Sonde](./apps/web/content/docs/foundations/sonde.mdx) and [Manifest](./apps/web/content/docs/foundations/sondage-manifest.mdx).

## Examples and fixtures

- Runnable compatibility fixtures live in `examples/cli-good`, `examples/cli-ok`, and `examples/cli-bad`.
- Use runnable fixtures for deterministic local demos and test automation.

## Packages

- `@sonde-sh/sonde`: CLI binary (`sonde`)
- `@sonde-sh/spec`: STM schema, types, and manifest loading/validation
- `@sonde-sh/generator`: help-text parsing and manifest generation
- `@sonde-sh/runtime`: deterministic command execution and tool execution
- `@sonde-sh/scoring`: weighted (0-100) scoring engine for CLI behavior

## Versioning and compatibility

- Current supported manifest major version is `1`; loading a different major returns `UNSUPPORTED_VERSION`.
- Manifest versioning follows semantic versioning (`major.minor.patch`).
- Protocol version fields are intended as machine-consumable compatibility guards.

## Local development

Prerequisites:

- Node.js 18+
- pnpm 9+

Install and validate:

```sh
pnpm install
pnpm check-types
pnpm lint
pnpm test
pnpm build
```

Run the local CLI build:

```sh
pnpm --filter @sonde-sh/sonde build
node packages/sonde-cli/dist/src/bin.js --help
```

## Release workflow

This repository uses Changesets:

```sh
pnpm changeset
pnpm version-packages
pnpm release
```

Release PRs and npm publish are automated via GitHub Actions.
