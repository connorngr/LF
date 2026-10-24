# Today’s Scope — Saturday, October 24, 2026

**Part of:** Oct polish after Aug fixes  
**Full plan:** `documentations/progress.md`

---

## Today = Finish LIF-65 auth hardening, then LIF-63 + LIF-66 in parallel

**Already merged (synced to Linear today):** LIF-29 dark mode (#15), LIF-61 photo modal (#17), LIF-62 consent prefs (#18), LIF-65 part 1, Next 16.4.1 + `server-only` (#16).

**Priority order:** LIF-65 auth → LIF-63 + LIF-66 (parallel) → LIF-64  
**Defer:** Infinite scroll (LIF-37) — when posts grow; align cursor with year grouping.

---

## Main window — Env audit, auth hardening ([LIF-65](https://linear.app/lifeframecn/issue/LIF-65))

### Tasks

- [ ] `ADMIN_PASSWORD` as a bcrypt hash; `validateCredentials` uses `bcrypt.compare` (today: plaintext `===` in `src/lib/auth.ts`)
- [ ] Session cookie: random/signed token with a separate `SESSION_SECRET`, not a fixed hash of the credentials; logout invalidates it
- [ ] Update `.env.example` + `src/lib/env.ts` for the new vars
- [ ] Manual: grep `.next/static` for secrets after build; Vercel per-env secrets; R2 token scope; rotate anything shared

**Done when:** login works with a hashed password, the cookie can't be derived from the credentials, and the manual checks are ticked.

---

## Parallel windows — Gallery by year ([LIF-63](https://linear.app/lifeframecn/issue/LIF-63)) + Add images to post ([LIF-66](https://linear.app/lifeframecn/issue/LIF-66))

- **LIF-63:** sticky year dividers (option A, year = upload date); pinned per year. Touches gallery query + `ImageGallery`.
- **LIF-66:** add images to an existing post with the 10-image limit enforced on edit (`MAX_IMAGES_PER_POST`). Touches `src/actions/posts.ts` + admin edit dialog.

The two have little file overlap, so they can run in separate branches.

---

## Next / defer

| Focus | Ticket | Status |
|-------|--------|--------|
| Env audit — auth hardening | LIF-65 | **In Progress** (Urgent) |
| Gallery by year | LIF-63 | Next (parallel) |
| Add images to post | LIF-66 | Next (parallel) |
| Business mode | LIF-64 | After LIF-66 (shared schema/edit dialog) |
| Infinite scroll | LIF-37 | Deferred (align with LIF-63) |
| CI/CD, rate limit, CAPTCHA, etc. | LIF-38+ | Backlog |
