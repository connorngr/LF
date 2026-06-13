# MVP Progress Tracker

> Last updated: 2026-06-13

## North Star — Ship by June 30, 2026

**Goal:** Functional LifeFrame I can use daily starting **July 2026**.

**Cadence:** Weekend-only work (~3 weeks left: Jun 7, 14, 21, 28).

**Two pillars to ship:**

1. **Analytics & observability** — who watches each post, where they come from, view counts
2. **Social media integration** — share UX + rich link previews

Everything else is defer until post-July unless it blocks deploy.

---

## Deployment stack

| Layer | Development | Production |
|-------|-------------|------------|
| **Hosting** | `pnpm dev` locally | Vercel |
| **Database** | Supabase Postgres | **Neon** Postgres |
| **Storage** | Cloudflare R2 | Cloudflare R2 |
| **ORM** | Prisma (`DATABASE_URL` + `DIRECT_URL`) | Same schema; Neon URLs in Vercel env |

**Rule:** Supabase is dev-only. On deploy, provision Neon, run migrations there, and set Vercel `DATABASE_URL` / `DIRECT_URL` to Neon — never the Supabase dev instance.

---

## 3-Week Execution Plan

| Week | Dates | Focus | Linear |
|------|-------|-------|--------|
| **1** | Jun 7–8 | Analytics research → view counts + logging → deploy | [LIF-57](https://linear.app/lifeframecn/issue/LIF-57), [LIF-40](https://linear.app/lifeframecn/issue/LIF-40), [LIF-56](https://linear.app/lifeframecn/issue/LIF-56), [LIF-33](https://linear.app/lifeframecn/issue/LIF-33) |
| **2** | Jun 14–15 | Finish analytics implementation from research; prod smoke-test | LIF-40, LIF-56 (+ any tickets spawned from LIF-57) |
| **3** | Jun 21–22 | Social research → social integration | [LIF-44](https://linear.app/lifeframecn/issue/LIF-44), [LIF-58](https://linear.app/lifeframecn/issue/LIF-58) |
| **Buffer** | Jun 28–29 | Polish, fix gaps, confirm daily-usable in prod | LIF-58, LIF-33 hardening |

See `documentations/today_scope.md` for this weekend's windows.

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

---

## In Progress — June Ship Track (Linear: Todo)

### Pillar 1: Analytics & observability

| Ticket | Linear | Title | Week |
|--------|--------|-------|------|
| LIF-57 | [Todo](https://linear.app/lifeframecn/issue/LIF-57) | LF-030: Analytics research — visitor tracking & traffic sources | 1 (research first) |
| LIF-40 | [Todo](https://linear.app/lifeframecn/issue/LIF-40) | LF-018: Image View Count Tracking | 1–2 |
| LIF-56 | [Todo](https://linear.app/lifeframecn/issue/LIF-56) | Observability: server logging + analytics hook | 1–2 |

### Pillar 2: Social media integration

| Ticket | Linear | Title | Week |
|--------|--------|-------|------|
| LIF-44 | [Todo](https://linear.app/lifeframecn/issue/LIF-44) | LF-023: Social share research (IG/FB, OG, Web Share) | 3 (research first) |
| LIF-58 | [Todo](https://linear.app/lifeframecn/issue/LIF-58) | LF-031: Social media integration — share UX & OG cards | 3–buffer |

### Ship

| Ticket | Linear | Title | Week |
|--------|--------|-------|------|
| LIF-33 | [Todo](https://linear.app/lifeframecn/issue/LIF-33) | LF-012: Vercel Deployment | 1 (after analytics MVP) |
| LIF-55 | [Todo](https://linear.app/lifeframecn/issue/LIF-55) | Side quest: Web vitals audit | 1 (optional polish) |

---

## Deferred (post-July)

| Ticket | Linear | Title | Why deferred |
|--------|--------|-------|--------------|
| LIF-39 | [Backlog](https://linear.app/lifeframecn/issue/LIF-39) | Comments, Likes & Reactions | Not needed for daily personal use |
| LIF-37 | [Backlog](https://linear.app/lifeframecn/issue/LIF-37) | Infinite scroll / pagination | Grid works for current volume |
| LIF-47 | [Backlog](https://linear.app/lifeframecn/issue/LIF-47) | Email share via mailto | May fold into LIF-58 |
| LIF-50 | [Backlog](https://linear.app/lifeframecn/issue/LIF-50) | Stress testing baseline | Post-ship hardening |
| LIF-49 | [Backlog](https://linear.app/lifeframecn/issue/LIF-49) | Prisma Accelerate | Post-ship if needed |
| LIF-35 | [Backlog](https://linear.app/lifeframecn/issue/LIF-35) | Storage comparison R2 vs Supabase | R2 already chosen |
| LIF-41 | [Backlog](https://linear.app/lifeframecn/issue/LIF-41) | Advanced auth | Basic auth sufficient |
| LIF-51 | [Backlog](https://linear.app/lifeframecn/issue/LIF-51) | Rate limiting | Post-ship security |
| LIF-52 | [Backlog](https://linear.app/lifeframecn/issue/LIF-52) | CAPTCHA | Post-ship security |
| LIF-29 | [Backlog](https://linear.app/lifeframecn/issue/LIF-29) | Dark/Light mode | Nice-to-have |

---

## Where We're Heading

**Done:** Core MVP — grid, upload, multi-image, carousel, slugs, SoundCloud, admin CRUD.

**Next 3 weeks:**

1. 📊 **Research + build analytics** — LIF-57 → LIF-40 + LIF-56
2. 🚀 **Deploy** — LIF-33 (Vercel + Neon; Supabase stays local dev)
3. 📱 **Research + build social sharing** — LIF-44 → LIF-58
4. ✅ **Daily-usable by July** — upload, browse, track views, share links

---

## Linear Sync

- **Team:** Lifeframecn (ID: `de769793-61ec-44d2-b53e-88eb6b36f346`)
- **Synced 2026-06-07:** Created LIF-57 (analytics research), LIF-58 (social integration)
- **Existing kept:** LIF-40, LIF-44, LIF-56 (no duplicates)
- **ID note:** LIF-57 = LF-030 analytics research; LIF-51 = rate limiting

---

## Implementation Notes

- **LIF-34 / LIF-46 thumbnails:** First image only → Sharp resize 400×400 `fit: inside` → `thumbnails/`; gallery uses `Post.imageUrl`; detail uses full `Image.imageUrl` keys (`src/lib/r2.ts`, `src/actions/upload.ts`)
- **LIF-45:** `ImageDetail` carousel with `CarouselPrevious` / `CarouselNext`, loop when `images.length > 1`
- **LIF-48:** `generateUniqueSlug` from post name; `getPostBySlugOrId` OR query; migration `20260516080736_add_slug_sc_id`
- **LIF-43:** `resolveSoundCloudTrack` via Iframely on upload; `SoundCloudTrackProvider` + crossfade engine; consent dialog in layout
- **LIF-53:** Gallery tiles grayscale on hover-capable devices; full color on touch (`ImageGallery.tsx`)
- **LIF-54:** `updatePost`/`deletePost` in `src/actions/posts.ts`; R2 cleanup via `deleteFromR2`; slug regen on rename; `AdminPostTile` with Dialog (edit) + AlertDialog (delete) on `/upload`
- **LIF-30:** bcrypt against `ADMIN_USERNAME` / `ADMIN_PASSWORD` in env; protects `/upload`
- **Deploy (LIF-33):** Dev DB = Supabase; prod DB = Neon on Vercel; images = R2 everywhere; run `prisma migrate deploy` against Neon before first prod deploy
- **Context7:** `npx ctx7@latest` for current library docs
- **shadcn:** Card, Avatar, Skeleton, Carousel, Dialog, AlertDialog from `src/components/ui/`

## Random thoughts (mapped to Linear)

| Idea | Ticket |
|------|--------|
| Who watches / traffic source research | [LIF-57](https://linear.app/lifeframecn/issue/LIF-57) |
| View counts | [LIF-40](https://linear.app/lifeframecn/issue/LIF-40) |
| Server logging + analytics | [LIF-56](https://linear.app/lifeframecn/issue/LIF-56) |
| Social share research | [LIF-44](https://linear.app/lifeframecn/issue/LIF-44) |
| Social integration (OG, Web Share) | [LIF-58](https://linear.app/lifeframecn/issue/LIF-58) |
| Grayscale hover on gallery | [LIF-53](https://linear.app/lifeframecn/issue/LIF-53) |
| CRUD for posts | [LIF-54](https://linear.app/lifeframecn/issue/LIF-54) |
| Web vitals / documentation | [LIF-55](https://linear.app/lifeframecn/issue/LIF-55) |
