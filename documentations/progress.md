# MVP Progress Tracker

> Last updated: 2026-06-07

## Execution Plan (current)

1. **Side quests** — grayscale hover, CRUD, web vitals ([LIF-53](https://linear.app/lifeframecn/issue/LIF-53), [LIF-54](https://linear.app/lifeframecn/issue/LIF-54), [LIF-55](https://linear.app/lifeframecn/issue/LIF-55))
2. **Observability** — view counts + logging ([LIF-40](https://linear.app/lifeframecn/issue/LIF-40), [LIF-56](https://linear.app/lifeframecn/issue/LIF-56))
3. **Deploy** — Vercel ([LIF-33](https://linear.app/lifeframecn/issue/LIF-33))
4. **Research** — social share options ([LIF-44](https://linear.app/lifeframecn/issue/LIF-44))

See `documentations/today_scope.md` for today's windows.

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

## In Progress / Today (Linear: Todo)

| Ticket | Linear | Title | Status |
|--------|--------|-------|--------|
| LIF-55 | [Todo](https://linear.app/lifeframecn/issue/LIF-55) | Side quest: Web vitals audit | Today — Window 1 |
| LIF-40 | [Todo](https://linear.app/lifeframecn/issue/LIF-40) | LF-018: Image View Count Tracking | Today — Window 2 |
| LIF-56 | [Todo](https://linear.app/lifeframecn/issue/LIF-56) | Observability: server logging + analytics | Today — Window 2 |
| LIF-33 | [Todo](https://linear.app/lifeframecn/issue/LIF-33) | LF-012: Vercel Deployment | Today — Window 3 |

---

## Upcoming (Backlog)

### Phase 2: Polish & Sharing
| Ticket | Linear | Title | Dependencies |
|--------|--------|-------|--------------|
| LIF-47 | [Backlog](https://linear.app/lifeframecn/issue/LIF-47) | LF-027: Email Integration - Share via Mailto | LIF-46 |
| LIF-44 | [Todo](https://linear.app/lifeframecn/issue/LIF-44) | LF-023: Social share research (IG/FB, OG, Web Share) | Post-deploy |

### Phase 4: Ship prep (not yet implemented)
| Ticket | Linear | Title | Notes |
|--------|--------|-------|-------|
| LIF-50 | [Backlog](https://linear.app/lifeframecn/issue/LIF-50) | LF-029: Stress Testing (baseline) | No code yet — was incorrectly marked done |
| LIF-49 | [Backlog](https://linear.app/lifeframecn/issue/LIF-49) | LF-028: Prisma Accelerate | No code yet — was incorrectly marked done |
| LIF-35 | [Backlog](https://linear.app/lifeframecn/issue/LIF-35) | LF-015: Storage Comparison - R2 vs Supabase | LIF-25 |

### Phase 3: Social (post-deploy)
| Ticket | Linear | Title | Dependencies |
|--------|--------|-------|--------------|
| LIF-39 | [Backlog](https://linear.app/lifeframecn/issue/LIF-39) | LF-017: Comments, Likes & Reactions | LIF-30, LIF-33 |
| LIF-37 | [Backlog](https://linear.app/lifeframecn/issue/LIF-37) | LF-016: Image Infinite Scroll / Pagination | LIF-27, LIF-33 |
| LIF-38 | [Backlog](https://linear.app/lifeframecn/issue/LIF-38) | LF-019: CI/CD Pipeline & Automated Testing | — |

### Phase 5: Future / Security
| Ticket | Linear | Title | Notes |
|--------|--------|-------|-------|
| LIF-41 | [Backlog](https://linear.app/lifeframecn/issue/LIF-41) | LF-020: Advanced Auth - NextAuth or JWT | Post-MVP |
| LIF-42 | [Backlog](https://linear.app/lifeframecn/issue/LIF-42) | LF-021: Blog Engine Integration | Post-MVP |
| LIF-51 | [Backlog](https://linear.app/lifeframecn/issue/LIF-51) | Rate limiting (bot abuse) | Security — not LF-030 |
| LIF-52 | [Backlog](https://linear.app/lifeframecn/issue/LIF-52) | CAPTCHA verification | Security |
| LIF-29 | [Backlog](https://linear.app/lifeframecn/issue/LIF-29) | LF-008: Dark/Light Mode | prefers-color-scheme |

---

## Where We're Heading

**This week:** Side quests → observability (LIF-40, LIF-56) → deploy (LIF-33) → social share research (LIF-44).

**Roadmap overview:**
1. ✅ **Core MVP** — Grid, upload, multi-image, carousel, slugs, SoundCloud
2. 🎨 **Polish** — Side quests (LIF-53–55), email share (LIF-47)
3. 📊 **Observability** — View counts + logging (LIF-40, LIF-56)
4. 🚀 **Ship** — Vercel (LIF-33); optional stress/Accelerate (LIF-50, LIF-49) later
5. 💬 **Post-deploy** — Social research (LIF-44) → comments/pagination (LIF-39, LIF-37)

---

## Linear Sync

- **Team:** Lifeframecn (ID: `de769793-61ec-44d2-b53e-88eb6b36f346`)
- **Synced 2026-06-07:** Marked Done in Linear — LIF-43, LIF-45, LIF-48, LIF-53, LIF-54
- **Created 2026-06-07:** LIF-53 (grayscale), LIF-54 (CRUD), LIF-55 (web vitals), LIF-56 (logging/analytics)
- **ID note:** Linear LIF-51 = rate limiting (not “final touches”). No separate LF-030 ticket exists.

---

## Implementation Notes

- **LIF-34 / LIF-46 thumbnails:** First image only → Sharp resize 400×400 `fit: inside` → `thumbnails/`; gallery uses `Post.imageUrl`; detail uses full `Image.imageUrl` keys (`src/lib/r2.ts`, `src/actions/upload.ts`)
- **LIF-45:** `ImageDetail` carousel with `CarouselPrevious` / `CarouselNext`, loop when `images.length > 1`
- **LIF-48:** `generateUniqueSlug` from post name; `getPostBySlugOrId` OR query; migration `20260516080736_add_slug_sc_id`
- **LIF-43:** `resolveSoundCloudTrack` via Iframely on upload; `SoundCloudTrackProvider` + crossfade engine; consent dialog in layout
- **LIF-53:** Gallery tiles grayscale on hover-capable devices; full color on touch (`ImageGallery.tsx`)
- **LIF-54:** `updatePost`/`deletePost` in `src/actions/posts.ts`; R2 cleanup via `deleteFromR2`; slug regen on rename; `AdminPostTile` with Dialog (edit) + AlertDialog (delete) on `/upload`
- **LIF-30:** bcrypt against `ADMIN_USERNAME` / `ADMIN_PASSWORD` in env; protects `/upload`
- **Context7:** `npx ctx7@latest` for current library docs
- **shadcn:** Card, Avatar, Skeleton, Carousel, Dialog, AlertDialog from `src/components/ui/`

## Random thoughts (mapped to Linear)

| Idea | Ticket |
|------|--------|
| Grayscale hover on gallery | [LIF-53](https://linear.app/lifeframecn/issue/LIF-53) |
| CRUD for posts | [LIF-54](https://linear.app/lifeframecn/issue/LIF-54) |
| Web vitals / documentation | [LIF-55](https://linear.app/lifeframecn/issue/LIF-55) |
