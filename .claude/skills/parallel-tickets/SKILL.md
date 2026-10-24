---
name: parallel-tickets
description: Implement several LifeFrame Linear tickets at the same time, one cloud session per ticket, but only after checking that the plan (documentations/progress.md, today_scope.md, Linear) is up to date and each ticket is clear and does not share files with another in the same wave. Use when the user says "implement these tickets simultaneously", "start the next wave", "run wave 1", or names several LIF tickets to build in parallel. For combining and testing the resulting PRs, hand off to the ship-tickets skill.
---

# Implement tickets in parallel (gated)

Do not start any session until all four gates pass. A failed gate ends with a short report and a proposed fix, not a dispatch.

## Gate 1: the plan is up to date

Compare three sources and list every mismatch:
- `documentations/progress.md` on `origin/main` (and on any open docs PR): the "Next feature round" table, waves, and "Linear Sync" lines.
- Linear: `list_issues` for team `Lifeframecn`, fields id/title/status/updatedAt. A ticket updated in Linear after the last "Linear Sync" date may have new scope.
- Git: `git log origin/main` and open PRs. Work that is merged or already in a PR but still listed as "next" means the docs are stale.

Fail if: a wave ticket is Done/Canceled/In Progress in Linear, its Linear description changed after the docs were written, or merged work is not reflected. Fix by running the `map-features` skill (or a docs-only sync) first, and get it merged.

## Gate 2: each ticket is clear

For each ticket, `get_issue` and check:
- **Decisions made:** no "pick one" design options or open questions without a default. Defaults written in the ticket or progress.md count as decided; say them in the brief.
- **Pointers are real:** every file or symbol named in the ticket exists (`git ls-tree origin/main`, `grep`). Stale pointers are not a failure if the right location is known; correct them in the brief.
- **Manual prerequisites listed:** new env vars (Vercel), Neon migrations, external accounts. These do not block coding but must be in the report.

Unclear tickets: one `AskUserQuestion` round (max 4 questions, likeliest option first). If still unclear, drop the ticket from the wave and say why.

## Gate 3: no shared files inside a wave

Build an ownership map per ticket from its scope and pointers: files it will edit, new files, schema/migration, `package.json`. Two tickets in one wave must not share a file. Also:
- At most one ticket per wave changes `prisma/schema.prisma` (migration order and lockfile conflicts).
- At most one ticket per wave adds dependencies.
- A shared helper is owned by exactly one ticket; the others are told not to create or edit it.

Move conflicting tickets to the next wave instead of hoping the merge is clean. Known hot files in this repo: `src/components/organisms/ImageGallery.tsx` (gallery query `galleryOrderBy`, tiles, badges), `src/components/molecules/PostEditForm.tsx`, `src/actions/posts.ts`, `src/schemas/{upload,post}.ts`, `app/layout.tsx`.

## Gate 4: environment

- `check_repo_access` for `connorngr/LF`: push must be `ok`. Otherwise send the user to https://claude.ai/connect-github.
- `origin/main` builds: `pnpm install --frozen-lockfile && pnpm typecheck && pnpm lint && pnpm test:run`. Do not branch new work from a red `main`.

## Dispatch

Show the user the wave table (ticket, owned files, assumptions, manual prerequisites) and confirm once with `AskUserQuestion` (which tickets, PR or branch only). Then send every `create_session` in one message:

- `source_url` https://github.com/connorngr/LF, `source_revision` `main`, `outcome_branch` `claude/lif-<N>-<slug>`.
- Brief (the session only knows what you write):
  1. Goal and the Linear id (tell it to `get_issue` for the full text).
  2. Files to read first, with corrected pointers, plus AGENTS.md.
  3. Scope checklist and the defaults/assumptions you decided in Gate 2.
  4. **Owned files** and **files it must not touch** (the other tickets' files and shared helpers it does not own).
  5. Verify: `pnpm typecheck`, `pnpm lint`, `pnpm test:run`, `next build` with `.env.example` values; add vitest tests next to new logic (`src/**/*.test.{ts,tsx}`, single `vitest.config.ts`). Do not add `loading.tsx` to `app/photo/[id]` (it turns `notFound()` into HTTP 200).
  6. Deliver: push, open a PR against `main`, no emojis, do not merge, do not update Linear or `documentations/`, end with what was not verified and any manual step (env var, migration).

Then report the session table and arm one `send_later` check-in (~30 min). Finished sessions do not report back on their own.

## After the wave

- On check-in: `get_session` (status_bucket) and `list_events` with `kinds: ["result"]` for each session's summary; relay PR links, blockers, and anything unverified.
- Combine and test the PRs with the `ship-tickets` skill (phase 2), then merge in dependency order.
- After merge: mark the tickets Done in Linear and sync `progress.md` / `today_scope.md` (move the wave to "Shipped", promote the next wave), so Gate 1 passes for the next run.
