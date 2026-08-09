# Today’s Scope — Sunday, August 9, 2026

**Part of:** Aug polish after June ship  
**Full plan:** `documentations/progress.md`

---

## Today = Web vitals → dark/light mode

**Focus:** [LIF-55](https://linear.app/lifeframecn/issue/LIF-55) web vitals, then [LIF-29](https://linear.app/lifeframecn/issue/LIF-29) dark/light mode.

**Priority order:** Web vitals → dark/light mode  
**Defer today:** Infinite scroll (LIF-37) — when posts grow.

**Already live:** Core MVP, private/pinned, grayscale hover, Umami, Vercel + Neon.

---

## Main window — Web vitals ([LIF-55](https://linear.app/lifeframecn/issue/LIF-55))

Lighthouse pass on gallery + detail (LCP / CLS / INP).

### Baseline (mobile `/`, Aug 9)

| Metric | Before |
|--------|--------|
| Performance | 87 |
| LCP | 3.6s |
| CLS | 0 |
| FCP | 1.7s |

### Tasks

- [x] Baseline Lighthouse (mobile) on `/` and a post detail URL
- [x] Fix top LCP issues (priority images, avatar downsize ~3MB→15KB WebP, WebP thumbs going forward)
- [x] CLS already 0 — no layout work needed
- [x] Note remaining medium/low items for a follow-up pass

**Kept signed R2 URLs** via `getUrl()` (bucket not publicly readable; `R2_PUBLIC_URL` / r2.dev TLS fails).

**Vercel env:** `NEXT_PUBLIC_AVATAR_URL=avatars/profile-320.webp` set — redeploy / re-Lighthouse.

**LCP priority:** avatar only on `/`; gallery tiles stay lazy. Detail first slide keeps `priority`.

**Follow-up (not today):** real public CDN URL for R2 (correct `pub-*.r2.dev` or custom domain) → `Cache-Control`, `remotePatterns`, Next Image optimizer; legacy JPEG thumb backfill to WebP.

**Done when:** Clear before/after numbers; no obvious red LCP/CLS on gallery or detail.

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
| Infinite scroll | LIF-37 | Deferred |
| CI/CD, rate limit, CAPTCHA, etc. | LIF-38+ | Backlog |
