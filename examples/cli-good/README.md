# cli-good fixture

Runnable fixture CLI representing a high-quality, automation-friendly interface.

## Why this is "good"

- Stable help output for reproducible manifest generation.
- Clear machine-readable flag (`--json`).
- Agent-friendly safety/control flags (`--yes`, `--dry-run`, `--fields`).
- No interactive prompt markers in help output.

## Files

- `bin/cli-good.js`: fixture CLI implementation.
- `package.json`: workspace package/bin wiring.
