import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'

const components = {
  p: ({ children }) => (
    <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  em: ({ children }) => <em className="italic text-foreground/90">{children}</em>,
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-primary underline underline-offset-4 hover:text-primary/80"
      rel="noopener noreferrer"
      target={href?.startsWith('http') ? '_blank' : undefined}
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="mb-2 list-disc space-y-1 pl-4 last:mb-0">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-2 list-decimal space-y-1 pl-4 last:mb-0">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  br: () => <br />,
} satisfies Components

type ProfileMottoMarkdownProps = Readonly<{
  source: string
  className?: string
}>

export function ProfileMottoMarkdown({ source, className }: ProfileMottoMarkdownProps) {
  const trimmed = source.trim()
  if (!trimmed) return null

  return (
    <div
      className={
        className ??
        'text-sm text-foreground/90 max-w-prose [&_*:first-child]:mt-0 [&_*:last-child]:mb-0'
      }
    >
      <ReactMarkdown components={components}>{trimmed}</ReactMarkdown>
    </div>
  )
}
