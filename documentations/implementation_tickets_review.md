# Implementation Tickets - Review Draft

## Priority: P0 (Must Have)

### Infrastructure

- [v] **LF-001: Project Setup** - Initialize Next.js project, install dependencies, configure Supabase client
- [ ] **LF-002: Database Schema** - Create posts table in Supabase (profile/data stored in .env, see below)
- [ ] **LF-003: Supabase Storage Setup** - Create bucket for image uploads (**Note: Supabase only 1GB free, plan R2 migration for 10GB**) - reseach ticket on configure supabase to next and r2 storage
- [v] **LF-004: Environment Configuration** - Set up .env structure and validation

### Profile Page

- [ ] **LF-005: Profile Header** - Display avatar, name (@handle), total posts count
- [ ] **LF-006: Image Grid - Desktop** - 4-column grid layout
- [ ] **LF-007: Image Grid - Mobile** - 3-column responsive grid
- [ ] **LF-008: Dark/Light Mode** - Auto-detect system preference

### Admin/Upload

- [ ] **LF-009: Admin Authentication** - Validate against .env credentials (no DB table)
- [ ] **LF-010: Image Upload** - Upload to Supabase Storage, create DB record
- [ ] **LF-011: Upload Interface** - Simple admin upload page with caption input

### Deployment

- [ ] **LF-012: Vercel Deployment** - Deploy MVP to Vercel with environment variables

---

## Priority: P1 (Important)

- [ ] **LF-013: Image Thumbnail Generation** - Generate optimized images for grid (optional - depends on performance)
- [ ] **LF-014: Image Aspect Ratio Handling** - Decide on square crop vs original aspect ratio

---

## Priority: P2 (Research)

- [ ] **LF-015: Storage Comparison** - R2 vs Supabase Storage research

---

## .env Configuration (MVP)

Since only one profile/admin exists, all data stored in .env:

```env
# Profile (public)
NEXT_PUBLIC_PROFILE_NAME=connor
NEXT_PUBLIC_PROFILE_HANDLE=@connorng
NEXT_PUBLIC_AVATAR_URL=https://your-bucket.supabase.co/avatars/avatar.png

# Admin (private)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=hashed_password_here
```

---

## Additional Notes from Review

- Profile handle: @connorng
- Avatar: stored in .env, CDN URL
- Password: hashed in .env (bcrypt), validated on admin login
- No DB tables for profiles/admin_users - simplifies to .env only

---

## Ready to create in Linear?

Reply with:
- **"yes"** - Create all tickets now
- **"p0 only"** - Create only P0 tickets