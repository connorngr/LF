# Life Frame

A minimal, distraction-free personal visual archive for preserving high-quality photos. Unlike social networks, there are no algorithms, likes, or metrics—just your images, preserved in full quality.

## Features

- **Profile Display** - Avatar, name, handle, optional motto (Markdown), and post count (shadcn/ui)
- **Image Grid** - 3-column / 4-column (from `md` breakpoint) responsive gallery with post titles on thumbnails
- **Photo Detail** - Full-size carousel when a post has multiple images; captions rendered as Markdown
- **Admin Authentication** - Session-based admin login; password verified with bcrypt
- **Image Upload** - Up to 10 images per post (name + caption required), Cloudflare R2 via Server Actions
- **Thumbnails** - First image of each post gets a resized thumbnail object for faster grid loads; originals stored under `images/`
- **Aspect ratio** - Portrait tiles and detail frame use a shared **4∶5** aspect ratio (`--photo-aspect-ratio` in `app/globals.css`)
- **Public read-only** - Anyone can browse; uploads require admin authentication

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Database**: PostgreSQL via Prisma ORM 7
- **Storage**: Cloudflare R2 (S3-compatible)
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **Type Safety**: TypeScript
- **Testing**: Vitest + Testing Library

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required variables:
- `NEXT_PUBLIC_PROFILE_NAME` - Display name
- `NEXT_PUBLIC_PROFILE_HANDLE` - Handle (e.g., @connorng)
- `NEXT_PUBLIC_AVATAR_URL` - Avatar image URL
- `NEXT_PUBLIC_BASE_URL` - Canonical site URL (e.g., `http://localhost:3000` in dev)
- `NEXT_PUBLIC_PROFILE_MOTTO_MARKDOWN` - *(optional)* Home bio as Markdown (a default exists in code if omitted — see `src/lib/env.ts`)
- `ADMIN_USERNAME` - Admin username
- `ADMIN_PASSWORD` - Bcrypt hashed password
- `R2_ACCOUNT_ID` - Cloudflare account ID
- `R2_ACCESS_KEY_ID` - R2 access key
- `R2_SECRET_ACCESS_KEY` - R2 secret key
- `R2_BUCKET_NAME` - R2 bucket name
- `R2_PUBLIC_URL` - R2 public URL
- `DATABASE_URL` - PostgreSQL connection string
- `DIRECT_URL` - Direct PostgreSQL connection (for migrations)

### 3. Set up database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy
```

### 4. Run development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   ├── photo/[id]/       # Full-page photo detail
│   ├── @gallerymodal/    # Intercepting route modal for `/photo/[id]` from home
│   ├── upload/           # Upload page (admin only)
│   └── auth/login/       # Admin login
├── src/
│   ├── actions/          # Server Actions (upload.ts)
│   ├── components/       # React components (ui/, organisms/)
│   └── lib/             # Utilities (prisma.ts, r2.ts, env.ts)
├── prisma/               # Database schema and migrations
│   └── schema.prisma    # Prisma schema
├── documentations/       # Project documentation
├── tests/               # Test setup and utilities
└── public/             # Static assets
```

## Available Scripts

| Command | Description |
|---------|------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run tests (vitest) |
| `pnpm test:ui` | Run tests with UI |
| `pnpm test:run` | Run tests once |

## Testing

Tests are set up with Vitest and Testing Library.

```bash
# Run tests in watch mode
pnpm test

# Run tests once
pnpm test:run

# Run tests with UI
pnpm test:ui
```

## Deployment

Deploy to Vercel:
1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Environment Variables

Values are validated at startup via `src/lib/env.ts` (except `DATABASE_URL` / `DIRECT_URL`, which Prisma reads directly).

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_PROFILE_NAME` | Display name | Yes |
| `NEXT_PUBLIC_PROFILE_HANDLE` | Handle with @ | Yes |
| `NEXT_PUBLIC_AVATAR_URL` | Avatar image URL | Yes |
| `NEXT_PUBLIC_BASE_URL` | Site base URL | Yes |
| `NEXT_PUBLIC_PROFILE_MOTTO_MARKDOWN` | Home motto (Markdown) | No (has default) |
| `ADMIN_USERNAME` | Admin username | Yes |
| `ADMIN_PASSWORD` | Bcrypt hash | Yes |
| `R2_ACCOUNT_ID` | Cloudflare account ID | Yes |
| `R2_ACCESS_KEY_ID` | R2 access key | Yes |
| `R2_SECRET_ACCESS_KEY` | R2 secret key | Yes |
| `R2_BUCKET_NAME` | R2 bucket name | Yes |
| `R2_PUBLIC_URL` | Public R2 hostname (validated at startup; image URLs currently use signed GETs — see `src/lib/r2.ts`) | Yes |
| `DATABASE_URL` | PostgreSQL connection | Yes (Prisma) |
| `DIRECT_URL` | Direct PostgreSQL URL for migrations | Yes (Prisma) |

## License

MIT