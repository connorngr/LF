/**
 * Environment variables for Life Frame MVP
 * 
 * @module app/lib/env
 * @description Validates and exposes environment variables at runtime.
 * 
 * **Usage in Server Components:**
 * ```typescript
 * import { profileName, avatarUrl } from '@/lib/env'
 * 
 * export default function Profile() {
 *   return <img src={avatarUrl} alt={profileName} />
 * }
 * ```
 * 
 * **Usage in Server Actions / API Routes:**
 * ```typescript
 * import { adminPassword, supabaseUrl } from '@/app/lib/env'
 * ```
 * 
 * **Validation:**
 * - Runs on module import (server startup)
 * - Fails fast with clear error if any variable is missing or invalid
 * - Uses zod v4 for schema validation
 * 
 * @see {@link https://github.com/colinhacks/zod Zod documentation}
 */

import { z } from 'zod'

export const defaultProfileMottoMarkdown =
  '**Life, uncurated.**\n\nEveryday frames — not reels, just real.'

const envVarSchema = z.object({
  NEXT_PUBLIC_PROFILE_NAME: z.string().min(1),
  NEXT_PUBLIC_PROFILE_HANDLE: z.string().min(1),
  NEXT_PUBLIC_AVATAR_URL: z.string().min(1),
  NEXT_PUBLIC_PROFILE_MOTTO_MARKDOWN: z
    .string()
    .default(defaultProfileMottoMarkdown),
  ADMIN_USERNAME: z.string().min(1),
  ADMIN_PASSWORD: z.string().min(1),
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  R2_ACCOUNT_ID: z.string().min(1),
  R2_ACCESS_KEY_ID: z.string().min(1),
  R2_SECRET_ACCESS_KEY: z.string().min(1),
  R2_BUCKET_NAME: z.string().min(1),
  R2_PUBLIC_URL: z.string().min(1),
  NEXT_PUBLIC_BASE_URL: z.string().min(1),
})

type EnvSchema = z.infer<typeof envVarSchema>

function parseEnv(): EnvSchema {
  const result = envVarSchema.safeParse(process.env)

  if (!result.success) {
    const errors = result.error.issues.map(
      (issue) => `${issue.path.join('.')}: ${issue.message}`
    )
    throw new Error(`Invalid environment variables:\n${errors.join('\n')}`)
  }

  return result.data
}

export const env = parseEnv()

/**
 * Profile name from NEXT_PUBLIC_PROFILE_NAME
 * @example "John Doe"
 */
export const {
  NEXT_PUBLIC_PROFILE_NAME: profileName,
  NEXT_PUBLIC_PROFILE_HANDLE: profileHandle,
  NEXT_PUBLIC_AVATAR_URL: avatarUrl,
  NEXT_PUBLIC_PROFILE_MOTTO_MARKDOWN: profileMottoMarkdown,
  ADMIN_USERNAME: adminUsername,
  ADMIN_PASSWORD: adminPassword,
  NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey,
  R2_ACCOUNT_ID: r2AccountId,
  R2_ACCESS_KEY_ID: r2AccessKeyId,
  R2_SECRET_ACCESS_KEY: r2SecretAccessKey,
  R2_BUCKET_NAME: r2BucketName,
  R2_PUBLIC_URL: r2PublicUrl,
  NEXT_PUBLIC_BASE_URL: nextPublicBaseUrl,
} = env

/** All env variables as object */
export type Env = typeof env