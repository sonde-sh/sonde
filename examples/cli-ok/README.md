# cli-ok fixture

Runnable fixture CLI representing partial compatibility.

## Why this is "ok"

- Stable enough for baseline workflows.
- Has `--json` only at root help (not consistently on command help).
- Missing several AI-native control flags compared with `cli-good`.

## Files

- `bin/cli-ok.js`: fixture CLI implementation.
- `package.json`: workspace package/bin wiring.
