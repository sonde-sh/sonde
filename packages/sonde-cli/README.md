# @sonde-sh/sonde

Sonde CLI for evaluating and improving AI-native/AI-friendly CLI behavior through manifest generation, deterministic runtime checks, and scoring.

## Canonical docs

Use `apps/web/content/docs` as the source of truth:

- [CLI reference](../../apps/web/content/docs/reference-implementation/cli-reference.mdx)
- [Quickstart](../../apps/web/content/docs/reference-implementation/quickstart.mdx)
- [Serve protocol](../../apps/web/content/docs/integration/cli-serve-protocol.mdx)
- [Troubleshooting](../../apps/web/content/docs/help/troubleshooting.mdx)

## Install

```sh
npm install -g @sonde-sh/sonde
```

## Usage

```sh
sonde --help
sonde --version
```

Commands:

```sh
sonde generate <cli> [--json]
sonde manifest [--json]
sonde run <cli> [--json]
sonde score <cli> [--json]
sonde publish <cli> [--json]
sonde serve [--json]
```

## Output modes

- Default: human-readable logs
- `--json`: machine-readable JSON payloads for automation and CI

## Manifest file

Commands that depend on a manifest (`run`, `score`, `serve`) read:

- `sondage.manifest.json` in the current working directory

`sonde manifest` prints Sonde's own Sondage manifest contract and does not require a local manifest file.
