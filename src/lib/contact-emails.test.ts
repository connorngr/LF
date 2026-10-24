import { describe, expect, it } from 'vitest'
import { parseContactEmails } from './contact-emails'

describe('parseContactEmails', () => {
  it('returns an empty list when unset', () => {
    expect(parseContactEmails(undefined)).toEqual([])
  })

  it('returns an empty list when empty or blank', () => {
    expect(parseContactEmails('')).toEqual([])
    expect(parseContactEmails('  ,  ')).toEqual([])
  })

  it('parses a valid list and trims whitespace', () => {
    expect(parseContactEmails('Gmail:a@x.com, Outlook : b@y.com ')).toEqual([
      { label: 'Gmail', address: 'a@x.com' },
      { label: 'Outlook', address: 'b@y.com' },
    ])
  })

  it('skips malformed entries and keeps the valid ones', () => {
    expect(
      parseContactEmails(
        'a@x.com,:b@y.com,Work:not-an-email,Empty:,Gmail:ok@x.com,,Outlook:c@y.com',
      ),
    ).toEqual([
      { label: 'Gmail', address: 'ok@x.com' },
      { label: 'Outlook', address: 'c@y.com' },
    ])
  })
})
