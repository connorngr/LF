# Today’s Scope — Sunday, June 7, 2026

**Time:** ~1–2 hours side quests, then ship  
**Priority order:** Side quests → logging & view tracking → deploy → social research (next)

**Already live in code:** Slug URLs (LIF-48), SoundCloud (LIF-43), multi-image carousel (LIF-45)

---

## Window 1 — ~1–2 hours · Side quests

Pick from backlog ideas in `progress.md` — polish and quality, not new platform features.

- [x] **Grayscale hover** ([LIF-53](https://linear.app/lifeframecn/issue/LIF-53)) — grid tiles grayscale by default, color on hover
- [x] **Post CRUD** ([LIF-54](https://linear.app/lifeframecn/issue/LIF-54)) — edit/delete via dialog + alert-dialog on `/upload`
- [ ] **Web vitals** ([LIF-55](https://linear.app/lifeframecn/issue/LIF-55)) — quick Lighthouse pass; note LCP/CLS issues on gallery + detail
- [x] **Docs** — update `progress.md` + Linear sync (LIF-45/48/43 Done; LIF-53–56 created)
- [x] **Commit** — LIF-53 grayscale hover + LIF-54 admin post CRUD

**Done when:** At least one side quest shipped or documented; `progress.md` reflects reality.

---

## Window 2 — Logging & view tracking (prioritized after side quests)

Moved up from “later” — do this before deploy so production ships with observability.

- [ ] **View counts** ([LIF-40](https://linear.app/lifeframecn/issue/LIF-40)) — increment on photo detail view; store on `Post` or separate table
- [ ] **Logging + analytics** ([LIF-56](https://linear.app/lifeframecn/issue/LIF-56)) — server logs + Vercel Analytics or lightweight events
- [ ] Smoke-test: view count increments; logs appear on upload failure

**Done when:** Detail views are counted; critical paths have visible logs or analytics.

---

## Window 3 — Deploy ([LIF-33](https://linear.app/lifeframecn/issue/LIF-33))

Only after side quests + tracking window are acceptable locally.

- [ ] Run migration (`add_slug_sc_id`) on production DB if not applied
- [ ] Confirm env vars on Vercel (R2, DB, admin, Iframely, SoundCloud)
- [ ] Deploy; smoke-test homepage, `/photo/{slug}`, upload, SoundCloud consent
- [ ] Verify view tracking + logs in production

**Done when:** App is live on Vercel; core flows pass in prod.

---

## Next objective (after deploy)

**Social media integration research** — not implementation today.

- [ ] Survey options ([LIF-44](https://linear.app/lifeframecn/issue/LIF-44)): Instagram/FB Stories, Open Graph/Twitter cards, native share APIs
- [ ] Note constraints (mobile Web Share API, canvas export, platform ToS)
- [ ] Draft short recommendation doc or Linear ticket breakdown

---

## Defer

- Full social features (comments, likes — LIF-39)
- Infinite scroll / pagination (LIF-37)
- Email share (LIF-47)
- Storage comparison (LIF-35)
- Advanced auth (LIF-41)

---

## Carry-over from June 6 (if blocked)

If migration or regression was incomplete before side quests:

- [ ] Run `add_slug_sc_id` locally; confirm slug + `sound_cloud_track_id` backfill
- [ ] Regression: grid slugs, legacy `/photo/{id}`, carousel, upload, admin
