#!/bin/sh
# Vercel build entry point (see vercel.json).
# Production builds apply pending Prisma migrations before building; preview
# and development builds never touch the database schema.
# `prisma migrate deploy` only runs migrations missing from _prisma_migrations.
set -e

if [ "$VERCEL_ENV" = "production" ]; then
  # Migrations need Neon's direct (non-pooled) connection.
  MIGRATION_URL="${DATABASE_URL_UNPOOLED:-$DATABASE_URL}"
  if [ -z "$MIGRATION_URL" ]; then
    echo "Error: set DATABASE_URL_UNPOOLED (or DATABASE_URL) for Production." >&2
    exit 1
  fi
  echo "Applying pending Prisma migrations"
  DATABASE_URL="$MIGRATION_URL" pnpm exec prisma migrate deploy
else
  echo "Skipping Prisma migrations (VERCEL_ENV=${VERCEL_ENV:-unset})"
fi

pnpm build
