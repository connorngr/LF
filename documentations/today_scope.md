# Today’s Scope — Saturday, June 6, 2026

**Focus:** Migration + regression testing  
**Already live:** Slug URLs (LIF-48), SoundCloud (LIF-43)

---

## Window 1 — 3 hours · Migration

- [ ] Run Prisma migration (`add_slug_sc_id`) locally
- [ ] Confirm backfill: existing posts get `slug` + `sound_cloud_track_id`
- [ ] Verify unique slug constraint; fix any duplicate slug failures
- [ ] Regenerate Prisma client if needed
- [ ] Commit migration when clean

**Done when:** DB schema matches code; no migration errors.

---

## Window 2 — 3 hours · Regression testing

- [ ] **Homepage** — grid loads, links use slugs
- [ ] **Photo detail** — `/photo/{slug}` opens; legacy `/photo/{id}` still works
- [ ] **Multi-image** — carousel navigates all images
- [ ] **Upload** — new post gets unique slug + SoundCloud track id
- [ ] **SoundCloud** — consent dialog, play/pause, loop on finish
- [ ] **Admin** — login, upload, protected routes
- [ ] Fix any regressions found

**Done when:** Core flows pass locally end-to-end.

---

## Window 3 — 3 hours · Optional (if time)

- [ ] Update `progress.md` (mark LIF-48, LIF-43, LIF-45 done)
- [ ] LIF-33 Vercel deploy — only if regression is green

---

## Defer

Deploy polish, SEO metadata, social features, sharing — after migration + regression are solid.
