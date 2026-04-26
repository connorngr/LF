import { z } from 'zod'

const envVarSchema = z.object({
  NEXT_PUBLIC_PROFILE_NAME: z.string().min(1),
  NEXT_PUBLIC_PROFILE_HANDLE: z.string().min(1),
  NEXT_PUBLIC_AVATAR_URL: z.url(),
  ADMIN_USERNAME: z.string().min(1),
  ADMIN_PASSWORD: z.string().min(1),
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
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

export const {
  NEXT_PUBLIC_PROFILE_NAME: profileName,
  NEXT_PUBLIC_PROFILE_HANDLE: profileHandle,
  NEXT_PUBLIC_AVATAR_URL: avatarUrl,
  ADMIN_USERNAME: adminUsername,
  ADMIN_PASSWORD: adminPassword,
  NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey,
} = env

export type Env = typeof env