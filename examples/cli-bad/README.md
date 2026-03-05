# cli-bad fixture

Runnable fixture CLI representing low compatibility for automation.

## Why this is "bad"

- Emits interactive prompt markers (for example `[y/n]`).
- Help output includes unstable/noisy content.
- Lacks machine-readable and non-interactive conventions.

## Files

- `bin/cli-bad.js`: fixture CLI implementation.
- `package.json`: workspace package/bin wiring.
