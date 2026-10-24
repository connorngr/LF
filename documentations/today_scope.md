# Today’s Scope — Sunday, August 9, 2026

**Part of:** Aug polish after June ship  
**Full plan:** `documentations/progress.md`

---

## Today = Web vitals → dark/light mode

**Focus:** [LIF-55](https://linear.app/lifeframecn/issue/LIF-55) web vitals ✅, then [LIF-29](https://linear.app/lifeframecn/issue/LIF-29) dark/light mode.

**Priority order:** Web vitals (done) → dark/light mode  
**Defer today:** Infinite scroll (LIF-37) — when posts grow.

**Already live:** Core MVP, private/pinned, grayscale hover, Umami, Vercel + Neon.

---

## Main window — Web vitals ([LIF-55](https://linear.app/lifeframecn/issue/LIF-55)) ✅

Lighthouse pass on gallery + detail (LCP / CLS / INP). **Closed** — payload/avatar wins landed; scored LCP barely moved, not worth more polish now.

### Baseline vs after (mobile prod `/`, Aug 9)

| Metric | Before | After |
|--------|--------|-------|
| Performance | 87 | ~85 (noise) |
| LCP | 3.6s | ~3.6s |
| CLS | 0 | 0 |
| FCP | 1.7s | ~2.0s |
| Avatar / payload | ~3MB PNG | ~15KB WebP; cache insight ~3MB → ~169KB |

Detail (`/photo/...`) still hurts if full originals are LCP; display WebP path + backfill script added (`displays/`, `scripts/backfill-display-images.ts`) — ship when ready, not blocking close.

### Tasks

- [x] Baseline Lighthouse (mobile) on `/` and a post detail URL
- [x] Fix top LCP issues (avatar downsize, WebP thumbs, display derivatives on upload, detail `getViewUrl`)
- [x] CLS already 0 — no layout work needed
- [x] Note remaining medium/low items for a follow-up pass

**Kept signed R2 URLs** via `getUrl()` / `getViewUrl()`.

**Vercel env:** `NEXT_PUBLIC_AVATAR_URL=avatars/profile-320.webp`.

**Follow-up (backlog, not blocking):** public R2 CDN; gallery above-fold eager; finish display backfill + re-Lighthouse detail; JPEG→WebP thumb backfill.

**Done when:** ✅ Called done — clear before/after; CLS green; no further LCP chase today.

---

## Second window — Dark/Light mode ([LIF-29](https://linear.app/lifeframecn/issue/LIF-29))

### Tasks

- [ ] Theme tokens (CSS variables) for light + dark
- [ ] Persist preference (localStorage + no-flicker script pattern)
- [ ] Toggle in UI (header/profile area)
- [ ] Spot-check gallery, detail, upload, auth

**Done when:** Toggle works without flash; both themes look intentional on main surfaces.

---

## Stretch (only if both finish early)

- [ ] Deploy if theme assets need prod verify
- [ ] Quick Umami sanity check after deploy

---

## Next / defer

| Focus | Ticket | Status |
|-------|--------|--------|
| Photo modal intercept bug + loading animation | LIF-61 | **Next** (bug — before features) |
| Env audit + Next.js 16.4.1 security upgrade | LIF-65 | **Urgent** (on 16.1.7, affected) |
| Dark/Light mode | LIF-29 | **Next** |
| Persist dialog prefs | LIF-62 | Todo |
| Gallery by year | LIF-63 | Option A picked (sticky year dividers) |
| Business mode | LIF-64 | `isBusiness` + contact dialog; ready |
| Add images to post | LIF-66 | Backlog |
| Infinite scroll | LIF-37 | Deferred (align with LIF-63) |
| CI/CD, rate limit, CAPTCHA, etc. | LIF-38+ | Backlog |
