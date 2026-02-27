# Life Frame -- Product Definition (MVP)

## Product Positioning

Life Frame is **not** a social network. It is **not** a productivity
tool. It is **not** a performance tracker.

It is:

> A high-quality, distraction-free personal visual archive\
> where you are not competing with billions.

Unlike Instagram, this is: - No algorithm - No likes - No noise - No
compression destroying image quality

It is your **personal museum**.

------------------------------------------------------------------------

## Authentication (MVP)

-   Hardcoded admin authentication
-   Only you can upload/edit/delete
-   Public visitors have read-only access
-   No user system
-   No account management

------------------------------------------------------------------------

## Data Model Strategy

### Core Fields:

-   Image URL
-   Folder (custom named)
-   Tags (optional, future flexibility)
-   Date (auto)
-   Optional short caption

UI feels like folders.\
Database supports both folders + tags for long-term flexibility.

------------------------------------------------------------------------

## Homepage Philosophy

Homepage shows:

-   One **random high-quality image**
-   Date
-   Folder name
-   Optional short reflection
-   Minimal UI controls
-   Auto dark/light mode based on device preference
-   No music
-   No distractions

Purpose: - Surprise yourself - Create calm reflection - Trigger
nostalgia and pride

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

## Final Product Identity

Life Frame =

A minimal, intentional, high-quality digital archive\
for an active, reflective life.
