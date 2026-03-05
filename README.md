# Sonde

Sonde is a deterministic toolkit for analyzing CLI behavior through STM
(Sondage Tool Manifest) artifacts and repeatable scoring.

## Packages

- `@sonde-sh/sonde`: CLI binary (`sonde`)
- `@sonde-sh/spec`: STM schema, types, and manifest loading/validation
- `@sonde-sh/generator`: help-text parsing and manifest generation
- `@sonde-sh/runtime`: deterministic command execution and tool execution
- `@sonde-sh/scoring`: weighted (0-100) scoring engine for CLI behavior

## Install the CLI

```sh
npm install -g @sonde-sh/sonde
```

Or run without installing:

```sh
npx @sonde-sh/sonde --help
```

## CLI commands

```sh
sonde generate <cli> --json
sonde run <cli> --json
sonde score <cli> --json
sonde serve --json
```

Generated manifest path:

- `sondage.manifest.json`

## Local development

Prerequisites:

- Node.js 20+
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
