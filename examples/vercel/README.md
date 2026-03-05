# Sonde Vercel Example

Minimal fixture showing how a Vercel-oriented CLI can be consumed by `sonde`.

## Install CLI

```bash
npx @sonde-sh/sonde --help
```

## Example commands

```bash
sonde --version
sonde generate vercel --json
sonde run vercel --json
sonde score vercel --json
```

## Tool serving

```bash
sonde serve --json
```

The `sondage.manifest.json` file illustrates command definitions that become
MCP-like tools.
