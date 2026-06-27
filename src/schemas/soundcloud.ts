import { z } from 'zod'

export const soundCloudUrlSchema = z
  .string()
  .trim()
  .url('Must be a valid URL')
  .refine((value) => {
    try {
      const hostname = new URL(value).hostname.replace(/^www\./, '')
      return hostname === 'soundcloud.com' || hostname.endsWith('.soundcloud.com')
    } catch {
      return false
    }
  }, 'Must be a SoundCloud track URL')

export const optionalSoundCloudUrlSchema = z
  .union([soundCloudUrlSchema, z.literal('')])
  .optional()
  .transform((value) => (value === '' || value === undefined ? undefined : value))
