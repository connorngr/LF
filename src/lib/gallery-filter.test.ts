import { describe, expect, it } from 'vitest'
import { buildGalleryModeSearch, isBusinessMode } from './gallery-filter'

describe('isBusinessMode', () => {
  it('is true only for mode=business', () => {
    expect(isBusinessMode('business')).toBe(true)
    expect(isBusinessMode(undefined)).toBe(false)
    expect(isBusinessMode('')).toBe(false)
    expect(isBusinessMode('Business')).toBe(false)
    expect(isBusinessMode('all')).toBe(false)
  })

  it('uses the first value of a repeated param', () => {
    expect(isBusinessMode(['business', 'all'])).toBe(true)
    expect(isBusinessMode(['all', 'business'])).toBe(false)
  })
})

describe('buildGalleryModeSearch', () => {
  it('adds mode=business when enabling', () => {
    expect(buildGalleryModeSearch('', true)).toBe('?mode=business')
  })

  it('removes the param when disabling', () => {
    expect(buildGalleryModeSearch('?mode=business', false)).toBe('')
  })

  it('keeps unrelated params', () => {
    expect(buildGalleryModeSearch('?ref=mail&mode=business', false)).toBe('?ref=mail')
    expect(buildGalleryModeSearch('?ref=mail', true)).toBe('?ref=mail&mode=business')
  })
})
