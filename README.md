# Sonde

Sonde is a spec-first toolkit for evaluating and exposing CLI tools through a
deterministic STM (Sondage Tool Manifest) contract.

## Workspace layout

- `packages/spec`: STM types, schema, and manifest loader/validator.
- `packages/generator`: help-text parser and manifest generator.
- `packages/runtime`: deterministic command executor.
- `packages/scoring`: 0-100 weighted CLI scoring engine.
- `packages/sonde-cli`: `sonde` binary (`generate`, `run`, `serve`, `score`).
- `apps/web`: Sonde web app with overview (`/`), leaderboard (`/leaderboard`), and docs (`/docs/*`).
- `examples/vercel`, `examples/supabase`: demo fixtures.

## Commands

```sh
pnpm install
pnpm check-types
pnpm lint
pnpm test
pnpm build
```

Run the CLI package directly:

```sh
pnpm --filter @repo/sonde-cli build
node packages/sonde-cli/dist/src/bin.js generate <cli> --json
node packages/sonde-cli/dist/src/bin.js run <cli> --json
node packages/sonde-cli/dist/src/bin.js score <cli> --json
node packages/sonde-cli/dist/src/bin.js serve --json
```

## Manifest

Generated manifest path:

- `sondage.manifest.json`

Schema and validation are implemented in `@repo/spec` and consumed by all Sonde
packages.
