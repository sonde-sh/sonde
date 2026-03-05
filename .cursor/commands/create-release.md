---
description: Prepare a release with Changesets
---

Create a release for this repository using the existing Changesets workflow.

Follow this exact flow:

1. Check repository state first.
   - Run `git status --short --branch`.
   - If the working tree is not clean, stop and ask whether to continue.
2. Ensure dependencies are ready.
   - Run `pnpm install --frozen-lockfile`.
3. Validate before versioning.
   - Run `pnpm check-types && pnpm lint && pnpm test && pnpm build`.
4. Check pending changesets.
   - Run `pnpm changeset:status`.
   - If no changesets are present, ask for the release intent and create one with `pnpm changeset`.
5. Version packages.
   - Run `pnpm version-packages`.
6. Show exactly what changed.
   - List changed files and summarize version/changelog updates.
7. Do not commit automatically.
   - Propose a conventional commit message (`chore(release): version packages`) and wait for explicit user approval.
8. Explain publish step for this repo.
   - This repository publishes through `.github/workflows/release.yml` (Changesets GitHub Action on `main` or manual dispatch).
   - If asked, trigger the workflow with GitHub CLI and report the run link.

Optional user input: `$ARGUMENTS`
