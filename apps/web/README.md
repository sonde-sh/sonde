# Sonde Web App

Docs and visualization app for Sonde manifests, examples, and leaderboard views.

## Local development

From repository root:

```bash
pnpm install
pnpm --filter web dev
```

Then open:

- <http://localhost:3000>

## Production build

```bash
pnpm --filter web build
pnpm --filter web start
```

## Relevant routes

- `/`: project overview
- `/leaderboard`: score summaries
- `/docs/*`: documentation pages
