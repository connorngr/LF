import { z } from 'zod'

export type ContactEmail = Readonly<{
  label: string
  address: string
}>

const emailSchema = z.email()

/**
 * Parses CONTACT_EMAILS: comma-separated `Label:address` pairs, e.g.
 * `Gmail:a@x.com,Outlook:b@y.com`. Malformed entries are skipped so a typo
 * never breaks the build; an unset or empty value yields an empty list.
 */
export function parseContactEmails(raw: string | undefined): ContactEmail[] {
  if (!raw) return []

  return raw.split(',').flatMap((entry) => {
    const separator = entry.indexOf(':')
    if (separator === -1) return []

    const label = entry.slice(0, separator).trim()
    const address = entry.slice(separator + 1).trim()
    if (!label || !emailSchema.safeParse(address).success) return []

    return [{ label, address }]
  })
}
