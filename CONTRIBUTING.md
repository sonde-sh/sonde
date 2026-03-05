# Contributing

## Prerequisites

- Node.js 20+
- pnpm 9+

## Local setup

```sh
pnpm install
```

## Development workflow

1. Create a feature branch from `main`.
2. Make changes with focused commits.
3. Run checks locally before opening a PR:

```sh
pnpm check-types
pnpm lint
pnpm test
pnpm build
```

## Changesets

This repository uses Changesets for versioning and release notes.

- Add a changeset for any user-facing change:

```sh
pnpm changeset
```

- Use `patch`/`minor`/`major` levels based on API impact.

## Pull requests

- Keep PRs scoped to one topic.
- Update docs and examples when behavior changes.
- Include tests for bug fixes and new behavior.

## Reporting issues

Use GitHub issues with reproduction details, expected behavior, and environment info.
