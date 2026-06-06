/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `posts` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable: add nullable columns first so existing rows can be backfilled
ALTER TABLE "posts" ADD COLUMN "slug" TEXT,
ADD COLUMN "sound_cloud_track_id" TEXT;

-- Backfill existing posts (slug from id for legacy URLs; default SoundCloud track)
UPDATE "posts"
SET
  "slug" = "id",
  "sound_cloud_track_id" = '1472426293'
WHERE "slug" IS NULL;

-- Enforce NOT NULL after backfill
ALTER TABLE "posts" ALTER COLUMN "slug" SET NOT NULL,
ALTER COLUMN "sound_cloud_track_id" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "posts_slug_key" ON "posts"("slug");
