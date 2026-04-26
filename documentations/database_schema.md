# Database Schema - Life Frame MVP

> **Note:** For MVP, profile data and admin credentials are stored in `.env` file only.
> No `profiles` or `admin_users` table needed.

---

## Tables

### 1. posts

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Auto-generated |
| image_url | text | NOT NULL | URL to uploaded image |
| caption | text | | Optional short caption (max 500 chars) |
| created_at | timestamptz | DEFAULT NOW() | Upload date |

**SQL:**
```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## RLS (Row Level Security)

### posts
- **SELECT**: Public (read-only for visitors)
- **INSERT/UPDATE/DELETE**: Admin only (validated via .env credentials)

---

## Storage Bucket

Create Supabase Storage bucket: `life-frame-images`

- **Public**: Yes (images served publicly)
- **File size limit**: 10MB (reasonable for high-quality photos)
- **Allowed types**: jpg, jpeg, png, webp, gif