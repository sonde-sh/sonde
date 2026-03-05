# Sonde

Sonde is a toolkit for evaluating and building AI-native, AI-friendly CLIs.
It generates machine-readable CLI manifests, runs deterministic checks, and scores how reliably a CLI works for developers, agents, and automation.

## Canonical docs

The canonical documentation source is:

- `apps/web/content/docs`

Start here:

- [Docs index](./apps/web/content/docs/index.mdx)
- [Quickstart](./apps/web/content/docs/quickstart.mdx)
- [CLI reference](./apps/web/content/docs/cli-reference.mdx)
- [Serve protocol](./apps/web/content/docs/cli-serve-protocol.mdx)
- [Scoring 100 guide](./apps/web/content/docs/scoring-100-guide.mdx)
- [Troubleshooting](./apps/web/content/docs/troubleshooting.mdx)

## Install CLI

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
sonde run <cli> [--json]
sonde score <cli> [--json]
sonde serve [--json]
```

For complete behavior, outputs, and edge cases, use the canonical [CLI reference](./apps/web/content/docs/cli-reference.mdx).

## Packages

- `@sonde-sh/sonde`: CLI binary (`sonde`)
- `@sonde-sh/spec`: STM schema, types, and manifest loading/validation
- `@sonde-sh/generator`: help-text parsing and manifest generation
- `@sonde-sh/runtime`: deterministic command execution and tool execution
- `@sonde-sh/scoring`: weighted (0-100) scoring engine for CLI behavior

## Versioning and compatibility

- Manifest contract uses semantic versioning in `sondage.manifest.json` via `version` (for example `1.0.0`).
- Current supported manifest major version is `1`; loading a different major returns `UNSUPPORTED_VERSION`.
- JSON command envelopes include `apiVersion` for `generate`, `run`, and `score`.
- `sonde serve --json` includes `protocolVersion` in readiness and per-request responses.
- Score reports include both `reportVersion` and `manifestVersion` to make downstream compatibility explicit.

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
