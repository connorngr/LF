import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { trackEvent } from '@/lib/analytics/track'
import { ContactDialog } from './ContactDialog'

vi.mock('@/lib/analytics/track', () => ({
  trackEvent: vi.fn(),
}))

const emails = [
  { label: 'Gmail', address: 'a@example.com' },
  { label: 'Outlook', address: 'b@example.org' },
]

function openDialog() {
  fireEvent.click(screen.getByRole('button', { name: 'Contact' }))
  return screen.findByRole('dialog')
}

describe('ContactDialog', () => {
  const writeText = vi.fn<(text: string) => Promise<void>>()

  beforeEach(() => {
    writeText.mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })
  })

  afterEach(() => {
    vi.mocked(trackEvent).mockClear()
    writeText.mockReset()
  })

  it('opens from a labelled icon button and tracks contact_open', async () => {
    render(<ContactDialog emails={emails} />)

    const dialog = await openDialog()

    expect(dialog).toHaveAccessibleName('Contact')
    expect(trackEvent).toHaveBeenCalledWith('contact_open')
  })

  it('lists each address as a mailto link', async () => {
    render(<ContactDialog emails={emails} />)
    await openDialog()

    expect(screen.getByRole('link', { name: 'a@example.com' })).toHaveAttribute(
      'href',
      'mailto:a@example.com',
    )
    expect(screen.getByRole('link', { name: 'b@example.org' })).toHaveAttribute(
      'href',
      'mailto:b@example.org',
    )
  })

  it('tracks the provider when a mailto link is clicked', async () => {
    render(<ContactDialog emails={emails} />)
    await openDialog()

    const link = screen.getByRole('link', { name: 'b@example.org' })
    // jsdom does not implement navigation; stop it after the handler ran.
    link.addEventListener('click', (event) => event.preventDefault())
    fireEvent.click(link)

    expect(trackEvent).toHaveBeenCalledWith('contact_email_click', { provider: 'Outlook' })
  })

  it('copies an address, shows feedback, and tracks the copy', async () => {
    render(<ContactDialog emails={emails} />)
    await openDialog()

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Copy Gmail address' }))
    })

    expect(writeText).toHaveBeenCalledWith('a@example.com')
    expect(trackEvent).toHaveBeenCalledWith('contact_email_click', {
      provider: 'Gmail',
      action: 'copy',
    })
    expect(screen.getByRole('button', { name: 'Copied Gmail address' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Copied a@example.com to the clipboard.')
  })

  it('shows an error when the clipboard is unavailable', async () => {
    writeText.mockRejectedValue(new Error('denied'))
    render(<ContactDialog emails={emails} />)
    await openDialog()

    fireEvent.click(screen.getByRole('button', { name: 'Copy Outlook address' }))

    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent(/Could not copy/),
    )
  })
})
