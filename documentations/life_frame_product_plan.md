# Life Frame -- Product Definition (MVP)

## Product Positioning

Life Frame is **not** a social network. It is **not** a productivity
tool. It is **not** a performance tracker.

It is:

> A high-quality, distraction-free personal visual archive\
> where you are not competing with billions.

Unlike Instagram, this is: - No algorithm - No likes - No noise - No
compression destroying image quality - No followers/engagement metrics

It is your **personal museum**.

---

## Scope: Personal Profile Page (Not Home Feed)

This MVP focuses exclusively on the **personal profile page** -- the same
section you'd access by clicking your profile avatar on Instagram.

**What's included:**
- Avatar display
- Profile name
- Basic stats (post count, optional)
- Grid-like image display
- Full-quality image uploads
- Folder organization
- Public read-only access

**What's excluded:**
- Home feed / discovery
- Followers/following lists
- Like/comment engagement
- Stories/reels
- Notifications

------------------------------------------------------------------------

## Authentication (MVP)

- Fixed credentials stored in `.env` file
- Password hashed and stored in database for comparison
- Only admin (owner) can upload/edit/delete
- Public visitors have read-only access
- No user registration system

------------------------------------------------------------------------

## Data Model Strategy

### Profile:
- Display name
- Handle (@username)
- Avatar URL (static, stored in DB)
- Bio (optional, MVP: no)

### Posts:
- Image URL
- Caption (optional, short text)
- Date (auto-set to upload date)
- No folders/collections in MVP

### MVP Simplification:
Single flat grid of posts. No folder/collection organization.

------------------------------------------------------------------------

## Profile Page (MVP Homepage)

The profile page is the main/only view:

- Avatar (static, from DB)
- Profile name + handle
- Total posts count
- 4-column grid (desktop) / 3-column (mobile)
- Click to view full-size image (lightbox - future MVP)
- Clean, Instagram-inspired layout
- Auto dark/light mode based on device preference
- No distractions

------------------------------------------------------------------------

## Differentiation

Sharp answer to "Why not Instagram?"

> This is not a social feed.\
> It's a personal museum.\
> My images are preserved in full quality.\
> There are no algorithms.\
> No validation loops.\
> Just memory.

------------------------------------------------------------------------

## AI Integration (Future Phase)

AI can enhance --- not replace --- memory.

Possible future enhancement: - "Generate Reflection" button on upload -
AI generates a poetic 1-sentence description

Example: \> "A quiet road where your legs were tired but your mind was
clear."

AI must remain optional and subtle.

------------------------------------------------------------------------

## Strict MVP Scope

### Included:

-   Upload image
-   Assign folder
-   Add optional caption
-   Random homepage image
-   Folder grid view
-   Public read-only mode
-   Hardcoded admin access

### Excluded (Future):

-   Blogging system
-   Video stories
-   External APIs (Strava, etc.)
-   Advanced AI automation
-   Multi-user system

------------------------------------------------------------------------

## Storage Strategy

Use a generous free-tier service that preserves image quality.

Potential options: - Cloudinary - Supabase (Object Storage) - Firebase
Storage

For frontend growth, Supabase + object storage is a strong choice.

------------------------------------------------------------------------

## 3-Year Vision

When opening Life Frame after years:

You see: - A random, high-quality image - Minimal interface - A calm,
silent visual experience

You feel: - Nostalgic - Proud - Motivated - Peaceful

It becomes your **visual autobiography in progress**.

------------------------------------------------------------------------

## Clarifying Questions for MVP Scope

Before we proceed, I need answers to these uncertainties:

### 1. Avatar
Static avatar, stored in database (MVP scope -- update to API/integration later)

### 2. Profile Name
- Display name: "connor" (from DB)
- Handle: @connorng

### 3. Stats Display
- Total posts (required)
- Optional suggestions for future: total folders/collections, oldest memory date, newest memory date

### 4. Grid Layout
- Desktop: up to 4 columns
- Mobile: 3 columns
- Standard square grid (no masonry for MVP)
- Gap between images: 2-4px (Instagram-style)

### 5. Image Interaction
- Lightbox view on click (future MVP) -- styled like Instagram story view
- No hover effects in MVP

### 6. Folder Organization -- CLARIFIED
Instagram doesn't have "folders" but does have:
- **Highlights** (at top, above grid)
- **Tagged** photos section
- **Your posts** (default grid)

For MVP: Remove "folder" concept. Just single grid of all posts.
(Future: consider "collections" or "albums" for grouping if needed later)

### 7. Upload Flow
- Admin-only authentication
- Credentials stored in `.env` file
- Compare against hashed password in database
- During upload: image file + optional caption + date (auto-set to upload date)

---

## Final Product Identity

Life Frame =

A minimal, intentional, high-quality digital archive\
for an active, reflective life.
