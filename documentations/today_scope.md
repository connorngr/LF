# Today’s Scope — Saturday, June 13, 2026

**Part of:** 3-week ship plan → functional by **June 30**, daily use in **July 2026**  
**Cadence:** Weekends only (Jun 7 · 14 · 21 · 28)  
**Full plan:** `documentations/progress.md`

---

## Today = Analytics research integration

**Single focus:** [LIF-57](https://linear.app/lifeframecn/issue/LIF-57) — research visitor tracking, traffic sources, and pick the analytics stack before building.

**Priority order:** Analytics research → recommendation doc → spawn implementation tickets  
**Defer today:** View counts (LIF-40), logging hook (LIF-56), deploy (LIF-33) — start only if research is done early.

**Already live in code:** Slug URLs (LIF-48), SoundCloud (LIF-43), multi-image carousel (LIF-45), admin CRUD (LIF-54), grayscale hover (LIF-53)

---

## Main window — Analytics research ([LIF-57](https://linear.app/lifeframecn/issue/LIF-57))

Research first; no implementation until the approach is chosen.

### Questions to answer

- [ ] **Who watches:** anonymous session vs fingerprint vs nothing — privacy trade-offs for a personal photo site
- [ ] **Where they come from:** referrer, UTM, Vercel Analytics vs custom `PostView` table
- [ ] **Tool vs roll-your-own:** Plausible / Umami / PostHog / Vercel Analytics vs Prisma events table
- [ ] **Per-post view counts:** counter on `Post` vs event log — what LIF-40 should implement
- [ ] **Observability:** what server logs belong in LIF-56 vs the analytics tool

### Deliverables

- [ ] Written recommendation (Linear comment on LIF-57 or short doc in `documentations/`)
- [ ] Decision matrix: privacy, cost, Vercel/Neon compatibility, per-post granularity
- [ ] Updated or new Linear tickets for LIF-40 + LIF-56 based on research
- [ ] Clear “build next session” checklist

**Done when:** Approach is chosen with rationale; LIF-40 and LIF-56 have concrete acceptance criteria from research.

---

## Stretch goals (only if research finishes early)

### Build ([LIF-40](https://linear.app/lifeframecn/issue/LIF-40), [LIF-56](https://linear.app/lifeframecn/issue/LIF-56))

- [ ] View counts — increment on photo detail view per research decision
- [ ] Logging + analytics hook — wire chosen tool or custom table
- [ ] Smoke-test locally

### Deploy ([LIF-33](https://linear.app/lifeframecn/issue/LIF-33))

**Database split:** Supabase Postgres for **local dev only**; **Neon** Postgres for **production** on Vercel. Images stay on **Cloudflare R2** in both environments.

- [ ] Neon project + migrations + Vercel env vars
- [ ] Deploy; smoke-test homepage, `/photo/{slug}`, upload, SoundCloud consent

---

## Upcoming weekends (reserved)

| Weekend | Focus | Tickets |
|---------|-------|---------|
| **Jun 14–15** | Build analytics from LIF-57 research; prod hardening | LIF-40, LIF-56, LIF-33 |
| **Jun 21–22** | Social research → implementation | LIF-44 → LIF-58 |
| **Jun 28–29** | Buffer: polish, share smoke-tests, confirm daily-usable | LIF-58, LIF-33 |

---

## Defer until after July

- Comments, likes (LIF-39)
- Infinite scroll (LIF-37)
- Email share alone (LIF-47 — may merge into LIF-58)
- Storage comparison (LIF-35)
- Advanced auth (LIF-41)
- Stress test / Prisma Accelerate (LIF-50, LIF-49)
- Web vitals audit (LIF-55)

---

## Carry-over (if blocked)

- [ ] Run `add_slug_sc_id` locally; confirm slug + `sound_cloud_track_id` backfill
- [ ] Regression: grid slugs, legacy `/photo/{id}`, carousel, upload, admin, SoundCloud crossfade
