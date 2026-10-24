# Today’s Scope — Saturday, October 24, 2026

**Part of:** Oct polish after June ship  
**Full plan:** `documentations/progress.md`

---

## Today = Parallel round (shipped) → deploy → map next round

**Focus:** four tickets in parallel cloud sessions, merged to `main`; then plan the next feature round.

**Already live in `main`:** Core MVP, private/pinned, grayscale hover, Umami, Vercel + Neon, web vitals pass (LIF-55), plus everything below.

---

## Main window — Parallel round (merged)

| Ticket | What | PR |
|--------|------|----|
| [LIF-65](https://linear.app/lifeframecn/issue/LIF-65) | Next.js 16.4.1, `server-only` env guard, env audit | [#16](https://github.com/connorngr/LF/pull/16) |
| [LIF-61](https://linear.app/lifeframecn/issue/LIF-61) | Photo modal intercept fix (Umami root cause) + loading skeleton | [#17](https://github.com/connorngr/LF/pull/17) |
| [LIF-29](https://linear.app/lifeframecn/issue/LIF-29) | Dark/light/system theme, no flash | [#15](https://github.com/connorngr/LF/pull/15) |
| [LIF-62](https://linear.app/lifeframecn/issue/LIF-62) | SoundCloud consent persisted (`lifeframe:prefs:v1`) + music toggle | [#18](https://github.com/connorngr/LF/pull/18) |

Also merged: Dependabot #9–#12, web vitals #14. Open: [#19](https://github.com/connorngr/LF/pull/19) (real versions for Dependabot #9–#11, `ship-tickets` + `parallel-tickets` skills, these docs).

### Verified on the integration branch

- [x] `typecheck`, `lint`, `test:run` (30/30), `build`
- [x] Playwright vs local Postgres: pinned order, private hidden, modal soft-nav with Umami stub, 404 for private/unknown slugs, theme before hydration, consent persistence, `/upload` login, admin sees private

### Still to do (manual)

- [x] Merge #19
- [x] Mark LIF-61, LIF-29, LIF-62 Done in Linear (LIF-65 In Progress)
- [ ] Fix Vercel env vars: builds fail with "Invalid environment variables" while collecting page data for `/_not-found` (decide whether Preview may use prod Neon/R2)
- [ ] `prisma migrate status` → `migrate deploy` on Neon (direct URL; Neon branch as backup)
- [ ] Deploy, then: multi-image upload on real R2; modal + Umami `gallery_click` on prod; SoundCloud autoplay after "Play music"; Safari + Firefox
- [ ] With real R2: edit a post (add to 10, remove the first image, reorder) and check cover + bucket cleanup (LIF-66); year nav on a real phone (LIF-63)
- [ ] Ruleset on `main`: turn off "Restrict updates", keep "Require a pull request" (0 approvals), block force pushes / deletions

---

## Second window — Next feature round

| Wave | Ticket | Ready? |
|------|--------|--------|
| 1 | [LIF-63](https://linear.app/lifeframecn/issue/LIF-63) Gallery by year (option A, sticky year dividers) | Merged [#21](https://github.com/connorngr/LF/pull/21), Done |
| 1 | [LIF-66](https://linear.app/lifeframecn/issue/LIF-66) Add images to an existing post (10 limit) | Merged [#20](https://github.com/connorngr/LF/pull/20), Done |
| 2 | [LIF-64](https://linear.app/lifeframecn/issue/LIF-64) Business mode (`isBusiness` + contact dialog) | Started after wave 1 merged |
| deferred | [LIF-37](https://linear.app/lifeframecn/issue/LIF-37) Infinite scroll | Deferred until post count grows; after LIF-63 + LIF-64 |

Wave 1 ran with the `parallel-tickets` skill after #19 merged; combined with `ship-tickets` and verified (64 unit tests, build, Playwright: year sections/nav, admin grid, edit dialog reorder saved to DB) before merging.

---

## Defer until later

- CI on PRs (slice of LIF-38) — workflow in review; test gap mapping in LIF-67
- Admin auth hardening (plaintext compare, session revocation)
- Theme pref via `visitor-prefs.ts`
- Display-size image derivatives (LIF-55 described them, but they were never committed)
- Rate limiting / CAPTCHA (LIF-51, LIF-52), stress test (LIF-50), advanced auth (LIF-41), blog (LIF-42)
