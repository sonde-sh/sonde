# @sonde-sh/sonde

Sonde CLI for deterministic CLI manifest generation, runtime checks, and scoring.

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
sonde generate <cli> --json
sonde run <cli> --json
sonde score <cli> --json
sonde serve --json
```

## Output modes

- Default: human-readable logs
- `--json`: machine-readable JSON payloads for automation and CI

## Manifest file

Commands that depend on a manifest (`run`, `score`, `serve`) read:

- `sondage.manifest.json` in the current working directory
