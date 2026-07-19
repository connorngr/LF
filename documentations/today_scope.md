# Today’s Scope — Sunday, July 19, 2026

**Part of:** July polish after June ship → daily use in **July 2026**  
**Full plan:** `documentations/progress.md`

---

## Today = Private + pinned posts

**Focus:** [LIF-59](https://linear.app/lifeframecn/issue/LIF-59) private posts ✅, then [LIF-60](https://linear.app/lifeframecn/issue/LIF-60) pinned posts.

**Priority order:** Private posts → pinned posts  
**Defer today:** Infinite scroll (LIF-37) — Next Up in `progress.md` after this session.

**Already live in code:** Slug URLs (LIF-48), SoundCloud (LIF-43), multi-image carousel (LIF-45), admin CRUD (LIF-54), grayscale hover (LIF-53), Umami analytics (LIF-56 / LIF-57), Vercel + Neon deploy (LIF-33), private posts (LIF-59)

---

## Main window — Private posts ([LIF-59](https://linear.app/lifeframecn/issue/LIF-59)) ✅

Hide admin-marked posts from the public gallery and photo detail routes.

### Tasks

- [x] Add `isPrivate` boolean to `Post` schema + migration
- [x] Filter private posts from public gallery query
- [x] Return 404 for private post detail URLs (non-admin)
- [x] Show private posts in admin `/upload` grid with visual indicator
- [x] Toggle private/public in upload form + edit dialog

**Done when:** Public visitors never see private posts; admin still sees and can toggle them on `/upload`. ✅

---

## Second window — Pinned posts ([LIF-60](https://linear.app/lifeframecn/issue/LIF-60))

Pin posts to the top of the gallery (Instagram Highlights-style).

### Tasks

- [ ] Add `isPinned` boolean (or `pinnedAt` timestamp) to `Post` schema + migration
- [ ] Sort gallery: pinned first, then `createdAt desc`
- [ ] Pin/unpin toggle in admin `/upload` UI
- [ ] Optional: visual pin indicator on gallery tiles

**Done when:** Pinned public posts appear first in the gallery; pin/unpin works from admin.

---

## Stretch goals (only if pinned finishes early)

### Smoke / polish

- [x] Regression: public gallery hides private; admin still sees them
- [ ] Regression: pin order + unpin restores chronological sort
- [ ] Deploy if schema migrations need prod (`is_private` migration)

---

## Next up (after today)

| Focus | Ticket |
|-------|--------|
| Infinite scroll / on-demand fetch as user scrolls | [LIF-37](https://linear.app/lifeframecn/issue/LIF-37) |

---

## Defer until later

- Comments, likes (LIF-39)
- Email share alone (LIF-47)
- Storage comparison (LIF-35)
- Advanced auth (LIF-41)
- Stress test / Prisma Accelerate (LIF-50, LIF-49)
- Web vitals audit (LIF-55)
- Rate limiting / CAPTCHA (LIF-51, LIF-52)
- Dark/Light mode (LIF-29)
