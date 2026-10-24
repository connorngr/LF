---
name: ship-tickets
description: Work several LifeFrame Linear tickets in parallel cloud sessions (one ticket per session, one PR each), then fold all open PRs (Dependabot first) into one integration branch, build and browser-test it, and report what needs a human. Use when the user asks to "handle these tickets at the same time", "run sessions in parallel", "merge all the PRs into a branch and test it", or names several LIF tickets to ship together.
---

# Ship tickets in parallel, then integrate and test

Two phases. Run phase 1 only when there are tickets to implement; run phase 2 whenever the user wants the open PRs combined and tested.

## 0. Preflight (always)

- `check_repo_access` for `connorngr/LF`. If push is refused (`repo_not_connected`), stop and send the user to https://claude.ai/connect-github (install the Claude GitHub App if missing). Sessions started without push access finish their work but cannot push or open PRs.
- Find the freshest base: `git fetch origin` and compare `origin/main` with any unmerged `chore/*` / `perf/*` branches that carry newer `documentations/progress.md`. Start sessions from the newest one and say so in every PR.
- Read `documentations/progress.md` and the Linear issues (`get_issue`) for each ticket so briefs name real files.

## 1. Dispatch (one session per ticket)

Ask once (`AskUserQuestion`, multiSelect) which tickets to run and whether each session should open a PR. Then `create_session` for each, all in one message:

- `source_url` https://github.com/connorngr/LF, `source_revision` = base from step 0, `outcome_branch` = `claude/lif-<N>-<slug>`.
- Brief = goal, files to read, scope checklist from the ticket, verify commands, deliverable. Always include:
  - Which other tickets run in parallel and which files each one owns, so they stay out of each other's way (e.g. one session owns `src/lib/visitor-prefs.ts`; another stores theme under its own key).
  - Verify: `pnpm typecheck`, `pnpm lint`, `pnpm test:run`, and `next build` if env allows.
  - "Open a PR against `main`; note the base branch; no emojis; do not merge; do not update Linear; list what you could not verify."
- Tell the user the session table, the expected conflicts, and that finished sessions do not report back. Arm one `send_later` check-in (~30 min).

On check-in: `get_session` each (status_bucket), then `list_events` with `kinds: ["result"]` for the final summary. If pushes failed, fix access, then `send_message` each session to push and open its PR.

## 2. Integrate and test

### 2a. Dependabot first
- List open PRs; take `dependabot/*` ones first.
- **Check each one actually bumps something**: `git show <sha> | grep '^[-+]  <pkg>@'`. Dependabot lockfile-only PRs here have been no-ops that only strip `libc:` lines. If so, apply the intended versions with `overrides:` in `pnpm-workspace.yaml` (selector form `pkg@<x.y.z: x.y.z`) and `pnpm install --no-frozen-lockfile`; avoid `pnpm update --depth Infinity`, which drags in unrelated bumps.
- Merge with `merge_pull_request` (pass `expectedHeadSha`). GitHub MCP calls act as the user's account (`get_me` = `connorngr`), not as a separate bot, so the `main` ruleset must have **Repository admin** on its bypass list (set to "For pull requests only"); adding only the Claude app does not help. A 405 "Cannot update this protected ref" means that bypass is missing: merge locally into the integration branch and tell the user how to grant it.

### 2b. Build the integration branch
- Start from `origin/main` + Dependabot merges, then merge the base branch from step 0, then each ticket branch (dependency/framework upgrade first).
- `package.json` / `pnpm-lock.yaml` conflicts: take the newer `package.json` side, start from the integration side's lockfile, run `pnpm install --no-frozen-lockfile`. Never hand-edit the lockfile.
- Known collision: several branches may each add a first vitest config (`vitest.config.ts` vs `.mts`). Git merges them without a conflict, but vitest loads only the `.ts` one and the other branch's tests fail. Keep one with `environment: "jsdom"`, `include: ["src/**/*.test.{ts,tsx}"]`, `setupFiles: ["./vitest.setup.ts"]`.
- When merging the PRs into `main` for real, check each one against the current `main` first (`git merge` into a scratch branch, then `pnpm test:run`). Fix conflicts or collisions on the PR branch itself (merge `main` into it, never rebase), push, then merge the PR.

### 2c. Verify
1. `pnpm install --frozen-lockfile`, `pnpm typecheck`, `pnpm lint`, `pnpm test:run`, `pnpm build` (copy `.env.example` to `.env`; placeholders are enough to build).
2. Local Postgres (cloud container): `initdb` as user `postgres` into `/var/lib/postgresql/<dir>` (scratchpad parents are not traversable by `postgres`), `pg_ctl ... -o '-k /tmp' start`, create role/db `lf`, set `DATABASE_URL`, `pnpm exec prisma migrate deploy`, seed posts with psql (one pinned, one private, one with `sound_cloud_track_id`, one plain).
3. `pnpm start`, then Playwright (`require('playwright')`, no install). Seed `localStorage['lifeframe:prefs:v1']` with a SoundCloud choice in contexts that are not testing consent, otherwise the consent dialog blocks clicks. Check at least:
   - Gallery order (pinned first), private hidden from visitors.
   - Tile click opens the intercepted modal with the gallery still mounted, both immediately and after prefetch; inject a stub of Umami's capture-phase click handler to prove tracking does not force a full load; hard reload renders the full page.
   - `/photo/<private>` and `/photo/<unknown>` return **404**. A `loading.tsx` in `app/photo/[id]` turns these into 200 (streaming sends the status before `notFound()`); keep loading UI only in the `@gallerymodal` intercept.
   - Theme: class set before hydration for OS light/dark and stored choice; toggle cycles; no hydration warnings.
   - Consent: dialog on first visit, stored under `lifeframe:prefs:v1`, not shown after reload.
   - `/upload` redirects to login; admin login (`.env` creds) sees private posts.
4. Restart the server from a script file. `pkill -f "next start"` typed inline matches the calling shell and kills it.
5. Fix real regressions on the ticket branch that caused them (push there, then merge into the integration branch), not only on the integration branch.

### 2d. Report
- Table: PR → merged locally/on GitHub → conflicts and how they were resolved.
- Test results (counts plus any failure with its root cause and fix commit).
- **Needs you:** merges blocked by branch protection; manual checks the container cannot do (real R2 images and uploads, real SoundCloud playback/autoplay, Umami on prod, Safari/Firefox, Vercel env and Neon migrations).
- Push the integration branch; open a PR only if the user asks.
