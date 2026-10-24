import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { trackEvent } from '@/lib/analytics/track'
import { BusinessModeToggle } from './BusinessModeToggle'

const replace = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
  usePathname: () => '/',
}))

vi.mock('@/lib/analytics/track', () => ({
  trackEvent: vi.fn(),
}))

describe('BusinessModeToggle', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/')
  })

  afterEach(() => {
    replace.mockClear()
    vi.mocked(trackEvent).mockClear()
  })

  it('renders an unchecked switch labelled Business', () => {
    render(<BusinessModeToggle enabled={false} />)

    const toggle = screen.getByRole('switch', { name: 'Business' })
    expect(toggle).toHaveAttribute('aria-checked', 'false')
  })

  it('switches to business mode without scrolling and tracks it', async () => {
    render(<BusinessModeToggle enabled={false} />)

    await act(async () => {
      fireEvent.click(screen.getByRole('switch', { name: 'Business' }))
    })

    expect(replace).toHaveBeenCalledWith('/?mode=business', { scroll: false })
    expect(trackEvent).toHaveBeenCalledWith('business_mode_toggle', { enabled: true })
  })

  it('switches back to all posts and keeps other params', async () => {
    window.history.replaceState(null, '', '/?ref=mail&mode=business')
    render(<BusinessModeToggle enabled />)

    expect(screen.getByRole('switch', { name: 'Business' })).toHaveAttribute(
      'aria-checked',
      'true',
    )

    await act(async () => {
      fireEvent.click(screen.getByRole('switch', { name: 'Business' }))
    })

    expect(replace).toHaveBeenCalledWith('/?ref=mail', { scroll: false })
    expect(trackEvent).toHaveBeenCalledWith('business_mode_toggle', { enabled: false })
  })
})
