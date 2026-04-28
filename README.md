# Life Frame

A minimal, distraction-free personal visual archive for preserving high-quality photos. Unlike social networks, there are no algorithms, likes, or metrics—just your images, preserved in full quality.

## Features

- **Profile Display** - Avatar, name, handle, and post count
- **Image Grid** - 4-column (desktop) / 3-column (mobile) gallery
- **Dark/Light Mode** - Auto-detects system preference
- **Admin Upload** - Upload images with optional captions
- **Public Read-Only** - Anyone can view, only you can upload

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Database**: PostgreSQL via Prisma ORM 7
- **Storage**: Supabase (Object Storage + Connection Pooler)
- **Styling**: Tailwind CSS 4
- **Type Safety**: TypeScript

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
- `ADMIN_USERNAME` - Admin username
- `ADMIN_PASSWORD` - Bcrypt hashed password
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `DATABASE_URL` - PostgreSQL connection string (with pgbouncer)
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
│   ├── api/              # API routes
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── prisma/               # Database schema and migrations
│   ├── schema.prisma    # Prisma schema
│   └── migrations/      # SQL migrations
├── src/
│   ├── components/     # React components
│   └── lib/             # Utilities (prisma.ts, env.ts)
├── documentations/       # Project documentation
└── public/             # Static assets
```

## Available Scripts

| Command | Description |
|---------|------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |

## API Endpoints

- `GET /api/test` - Test database connection

## Deployment

Deploy to Vercel:
1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_PROFILE_NAME` | Display name | Yes |
| `NEXT_PUBLIC_PROFILE_HANDLE` | Handle with @ | Yes |
| `NEXT_PUBLIC_AVATAR_URL` | Avatar image URL | Yes |
| `ADMIN_USERNAME` | Admin username | Yes |
| `ADMIN_PASSWORD` | Bcrypt hash | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | Yes |
| `DATABASE_URL` | Pooled connection (port 6543) | Yes |
| `DIRECT_URL` | Direct connection (port 5432) | Yes |

## License

MIT