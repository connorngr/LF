# MVP Progress Tracker

> Last updated: 2026-07-19

## North Star — Ship by June 30, 2026 ✅

**Goal:** Functional LifeFrame I can use daily starting **July 2026**.

**Status:** Shipped — deployed to Vercel with Umami analytics. Daily-usable.

---

## Deployment stack

| Layer | Development | Production |
|-------|-------------|------------|
| **Hosting** | `pnpm dev` locally | Vercel |
| **Database** | Supabase Postgres | **Neon** Postgres |
| **Storage** | Cloudflare R2 | Cloudflare R2 |
| **ORM** | Prisma (`DATABASE_URL` + `DIRECT_URL`) | Same schema; Neon URLs in Vercel env |
| **Analytics** | Disabled (dev) | Umami Cloud |

**Rule:** Supabase is dev-only. On deploy, provision Neon, run migrations there, and set Vercel `DATABASE_URL` / `DIRECT_URL` to Neon — never the Supabase dev instance.

---

## Completed Tickets

| Ticket | Linear | Title | Notes |
|--------|--------|-------|-------|
| LIF-22 | [Done](https://linear.app/lifeframecn/issue/LIF-22) | LF-001: Project Setup | Next.js + TypeScript + Tailwind |
| LIF-24 | [Done](https://linear.app/lifeframecn/issue/LIF-24) | LF-004: Environment Configuration | .env + zod validation |
| LIF-23 | [Done](https://linear.app/lifeframecn/issue/LIF-23) | LF-002: Database Schema | Prisma + posts table |
| LIF-25 | [Done](https://linear.app/lifeframecn/issue/LIF-25) | LF-003: Storage Setup | Cloudflare R2 + @aws-sdk/client-s3 |
| LIF-26 | [Done](https://linear.app/lifeframecn/issue/LIF-26) | LF-005: Profile Header | PersonalInfoHero organism |
| LIF-27 | [Done](https://linear.app/lifeframecn/issue/LIF-27) | LF-006: Image Grid - Desktop | ImageGallery + ImageDetail |
| LIF-28 | [Done](https://linear.app/lifeframecn/issue/LIF-28) | LF-007: Image Grid - Mobile | 3-column mobile grid |
| LIF-30 | [Done](https://linear.app/lifeframecn/issue/LIF-30) | LF-009: Admin Authentication | bcrypt + session, /upload protected |
| LIF-31 | [Done](https://linear.app/lifeframecn/issue/LIF-31) | LF-010: Image Upload | R2 + Server Actions |
| LIF-32 | [Done](https://linear.app/lifeframecn/issue/LIF-32) | LF-011: Upload Interface | /upload + UploadForm |
| LIF-34 | [Done](https://linear.app/lifeframecn/issue/LIF-34) | LF-013: Image Thumbnail Generation | Sharp 400×400 → `thumbnails/` |
| LIF-36 | [Done](https://linear.app/lifeframecn/issue/LIF-36) | LF-014: Image Aspect Ratio Handling | 4∶5 `aspect-photo`, object-cover |
| LIF-46 | [Done](https://linear.app/lifeframecn/issue/LIF-46) | LF-024: Multi-Image Posts & Thumbnail Optimization | `Image` model, upload flow |
| LIF-45 | [Done](https://linear.app/lifeframecn/issue/LIF-45) | LF-025: Carousel View for Multi-Image Posts | embla Carousel in ImageDetail |
| LIF-48 | [Done](https://linear.app/lifeframecn/issue/LIF-48) | LF-026: SEO Improvement - Slug-based URLs | `slug` + migration, legacy id fallback |
| LIF-43 | [Done](https://linear.app/lifeframecn/issue/LIF-43) | LF-022: Music Integration - SoundCloud for Posts | Iframely + consent + crossfade |
| LIF-53 | [Done](https://linear.app/lifeframecn/issue/LIF-53) | Side quest: Grayscale gallery hover | `[@media(hover:hover)]` grayscale + color on hover |
| LIF-54 | [Done](https://linear.app/lifeframecn/issue/LIF-54) | Side quest: Admin post CRUD | `updatePost`/`deletePost`, dialog edit + alert delete on `/upload` |
| LIF-57 | [Done](https://linear.app/lifeframecn/issue/LIF-57) | LF-030: Analytics research — visitor tracking & traffic sources | Umami Cloud chosen; no DB view-count column |
| LIF-56 | [Done](https://linear.app/lifeframecn/issue/LIF-56) | Observability: server logging + analytics hook | Umami script + Tier 2 custom events |
| LIF-33 | [Done](https://linear.app/lifeframecn/issue/LIF-33) | LF-012: Vercel Deployment | Vercel + Neon Postgres + R2 |
| LIF-59 | [Done](https://linear.app/lifeframecn/issue/LIF-59) | LF-032: Private posts — hide from public gallery | `isPrivate` + admin-only visibility |

---

## Canceled (June ship track)

| Ticket | Linear | Title | Why canceled |
|--------|--------|-------|--------------|
| LIF-40 | [Canceled](https://linear.app/lifeframecn/issue/LIF-40) | LF-018: Image View Count Tracking | Superseded by Umami pageviews + `post_view` events |
| LIF-44 | [Canceled](https://linear.app/lifeframecn/issue/LIF-44) | LF-023: Social share research (IG/FB, OG, Web Share) | Not feasible for personal accounts |
| LIF-58 | [Canceled](https://linear.app/lifeframecn/issue/LIF-58) | LF-031: Social media integration — share UX & OG cards | Deprioritized; Umami covers traffic source tracking |

---

## In progress today — see `documentations/today_scope.md`

| Ticket | Linear | Title | Priority |
|--------|--------|-------|----------|
| LIF-60 | [Todo](https://linear.app/lifeframecn/issue/LIF-60) | LF-033: Pinned posts — highlight at top of gallery | High |

---

## Next Up — July 2026 (Linear: Backlog)

| Ticket | Linear | Title | Priority |
|--------|--------|-------|----------|
| LIF-37 | [Backlog](https://linear.app/lifeframecn/issue/LIF-37) | LF-016: Image Infinite Scroll / Pagination | High |

Cursor-based pagination: as the user scrolls the gallery, fetch and append more posts (IntersectionObserver + loading skeleton + end state).

---

## Deferred (post-July)

| Ticket | Linear | Title | Why deferred |
|--------|--------|-------|--------------|
| LIF-55 | [Todo](https://linear.app/lifeframecn/issue/LIF-55) | Side quest: Web vitals audit | Optional polish — Lighthouse pass on gallery + detail |
| LIF-39 | [Backlog](https://linear.app/lifeframecn/issue/LIF-39) | Comments, Likes & Reactions | Not needed for daily personal use |
| LIF-47 | [Backlog](https://linear.app/lifeframecn/issue/LIF-47) | Email share via mailto | May fold into future share work |
| LIF-50 | [Backlog](https://linear.app/lifeframecn/issue/LIF-50) | Stress testing baseline | Post-ship hardening |
| LIF-49 | [Backlog](https://linear.app/lifeframecn/issue/LIF-49) | Prisma Accelerate | Post-ship if needed |
| LIF-35 | [Backlog](https://linear.app/lifeframecn/issue/LIF-35) | Storage comparison R2 vs Supabase | R2 already chosen |
| LIF-41 | [Backlog](https://linear.app/lifeframecn/issue/LIF-41) | Advanced auth | Basic auth sufficient |
| LIF-51 | [Backlog](https://linear.app/lifeframecn/issue/LIF-51) | Rate limiting | Post-ship security |
| LIF-52 | [Backlog](https://linear.app/lifeframecn/issue/LIF-52) | CAPTCHA | Post-ship security |
| LIF-29 | [Backlog](https://linear.app/lifeframecn/issue/LIF-29) | Dark/Light mode | Nice-to-have |

---

## Where We're Heading

**Done:** Core MVP — grid, upload, multi-image, carousel, slugs, SoundCloud, admin CRUD, Umami analytics, Vercel deploy, private posts.

**Remaining today:**

1. 📌 **Pinned posts** — [LIF-60](https://linear.app/lifeframecn/issue/LIF-60): pin to top of gallery (Instagram Highlights-style)

**Next after today:**

2. ∞ **Infinite scroll** — [LIF-37](https://linear.app/lifeframecn/issue/LIF-37): on-demand fetch as user scrolls the gallery

---

## Linear Sync

- **Team:** Lifeframecn (ID: `de769793-61ec-44d2-b53e-88eb6b36f346`)
- **Synced 2026-07-12:** Marked LIF-33, LIF-56, LIF-57 Done; synced LIF-54 Done; created LIF-59 (private posts), LIF-60 (pinned posts)
- **Synced 2026-07-19:** Marked LIF-59 Done (private posts shipped); LIF-60 remains today; LIF-37 stays Next Up
- **Canceled (unchanged):** LIF-40, LIF-44, LIF-58 — superseded by Umami / not feasible
- **ID note:** LIF-59 = LF-032 private posts; LIF-60 = LF-033 pinned posts; LIF-37 = LF-016 infinite scroll / pagination

---

## Implementation Notes

- **LIF-34 / LIF-46 thumbnails:** First image only → Sharp resize 400×400 `fit: inside` → `thumbnails/`; gallery uses `Post.imageUrl`; detail uses full `Image.imageUrl` keys (`src/lib/r2.ts`, `src/actions/upload.ts`)
- **LIF-45:** `ImageDetail` carousel with `CarouselPrevious` / `CarouselNext`, loop when `images.length > 1`
- **LIF-48:** `generateUniqueSlug` from post name; `getPostBySlugOrId` OR query; migration `20260516080736_add_slug_sc_id`
- **LIF-43:** `resolveSoundCloudTrack` via Iframely on upload; `SoundCloudTrackProvider` + crossfade engine; consent dialog in layout
- **LIF-53:** Gallery tiles grayscale on hover-capable devices; full color on touch (`ImageGallery.tsx`)
- **LIF-54:** `updatePost`/`deletePost` in `src/actions/posts.ts`; R2 cleanup via `deleteFromR2`; slug regen on rename; `AdminPostTile` with Dialog (edit) + AlertDialog (delete) on `/upload`
- **LIF-59:** `Post.isPrivate` + migration `20260719130000_add_is_private`; public queries filter `isPrivate: false`; detail returns `notFound()` for non-admin; upload/edit checkbox + `GalleryPrivateBadge`; gallery `mode` is `view` | `edit` (UI only — private visibility always from `isAuthenticated()`)
- **LIF-30:** bcrypt against `ADMIN_USERNAME` / `ADMIN_PASSWORD` in env; protects `/upload`
- **LIF-56 / LIF-57:** Umami Cloud in prod only (`isUmamiEnabled()`); `UmamiScript` filters `/upload` + `/auth`; custom events via `trackEvent()` — `post_view`, `gallery_click`, `carousel_navigate`, `back_to_gallery`, `soundcloud_*`
- **Deploy (LIF-33):** Dev DB = Supabase; prod DB = Neon on Vercel; images = R2 everywhere; run `prisma migrate deploy` against Neon before first prod deploy
- **Context7:** `npx ctx7@latest` for current library docs
- **shadcn:** Card, Avatar, Skeleton, Carousel, Dialog, AlertDialog from `src/components/ui/`

## Random thoughts (mapped to Linear)

| Idea | Ticket |
|------|--------|
| Private posts | [LIF-59](https://linear.app/lifeframecn/issue/LIF-59) ✅ |
| Pinned posts | [LIF-60](https://linear.app/lifeframecn/issue/LIF-60) |
| Infinite scroll / fetch on scroll | [LIF-37](https://linear.app/lifeframecn/issue/LIF-37) |
| Who watches / traffic source research | [LIF-57](https://linear.app/lifeframecn/issue/LIF-57) |
| Server logging + analytics | [LIF-56](https://linear.app/lifeframecn/issue/LIF-56) |
| Grayscale hover on gallery | [LIF-53](https://linear.app/lifeframecn/issue/LIF-53) |
| CRUD for posts | [LIF-54](https://linear.app/lifeframecn/issue/LIF-54) |
| Web vitals / documentation | [LIF-55](https://linear.app/lifeframecn/issue/LIF-55) |
