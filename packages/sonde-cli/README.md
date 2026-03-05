# @sonde-sh/sonde

Sonde CLI for evaluating and improving AI-native/AI-friendly CLI behavior through manifest generation, deterministic runtime checks, and scoring.

## Canonical docs

Use `apps/web/content/docs` as the source of truth:

- [CLI reference](../../apps/web/content/docs/cli-reference.mdx)
- [Quickstart](../../apps/web/content/docs/quickstart.mdx)
- [Serve protocol](../../apps/web/content/docs/cli-serve-protocol.mdx)
- [Troubleshooting](../../apps/web/content/docs/troubleshooting.mdx)

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
sonde run <cli> [--json]
sonde score <cli> [--json]
sonde serve [--json]
```

## Output modes

- Default: human-readable logs
- `--json`: machine-readable JSON payloads for automation and CI

## Manifest file

Commands that depend on a manifest (`run`, `score`, `serve`) read:

- `sondage.manifest.json` in the current working directory
