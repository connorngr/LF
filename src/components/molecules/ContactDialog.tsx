'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Copy, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { trackEvent } from '@/lib/analytics/track'
import type { ContactEmail } from '@/lib/contact-emails'

const COPIED_FEEDBACK_MS = 2000

type ContactDialogProps = Readonly<{
  emails: ContactEmail[]
}>

export function ContactDialog({ emails }: ContactDialogProps) {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)
  const [copyError, setCopyError] = useState<string | null>(null)
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current)
    }
  }, [])

  const handleOpenChange = (open: boolean) => {
    if (open) {
      trackEvent('contact_open')
      return
    }
    setCopiedAddress(null)
    setCopyError(null)
  }

  const handleCopy = async ({ label, address }: ContactEmail) => {
    trackEvent('contact_email_click', { provider: label, action: 'copy' })
    if (resetTimer.current) clearTimeout(resetTimer.current)
    try {
      await navigator.clipboard.writeText(address)
      setCopyError(null)
      setCopiedAddress(address)
      resetTimer.current = setTimeout(() => setCopiedAddress(null), COPIED_FEEDBACK_MS)
    } catch {
      setCopiedAddress(null)
      setCopyError('Could not copy. Select the address and copy it manually.')
    }
  }

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Contact"
            title="Contact"
            className="rounded-full text-muted-foreground hover:text-foreground"
          />
        }
      >
        <Mail aria-hidden />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contact</DialogTitle>
          <DialogDescription>Send an email or copy an address.</DialogDescription>
        </DialogHeader>
        <ul className="space-y-2">
          {emails.map((email) => {
            const copied = copiedAddress === email.address
            return (
              <li
                key={`${email.label}:${email.address}`}
                className="flex items-center gap-3 rounded-lg border px-3 py-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">{email.label}</p>
                  <a
                    href={`mailto:${email.address}`}
                    onClick={() => trackEvent('contact_email_click', { provider: email.label })}
                    className="block truncate text-sm font-medium text-foreground underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none"
                  >
                    {email.address}
                  </a>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={copied ? `Copied ${email.label} address` : `Copy ${email.label} address`}
                  title={copied ? 'Copied' : 'Copy address'}
                  onClick={() => handleCopy(email)}
                >
                  {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
                </Button>
              </li>
            )
          })}
        </ul>
        {copyError ? <p className="text-xs text-destructive">{copyError}</p> : null}
        <p role="status" aria-live="polite" className="sr-only">
          {copiedAddress ? `Copied ${copiedAddress} to the clipboard.` : copyError}
        </p>
      </DialogContent>
    </Dialog>
  )
}
