import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'

const headingSpacing = 'mb-2 mt-3 font-semibold text-foreground first:mt-0 last:mb-0'

export const markdownComponents = {
  h1: ({ children }) => <h1 className={`${headingSpacing} text-xl tracking-tight`}>{children}</h1>,
  h2: ({ children }) => <h2 className={`${headingSpacing} text-lg tracking-tight`}>{children}</h2>,
  h3: ({ children }) => <h3 className={`${headingSpacing} text-base`}>{children}</h3>,
  h4: ({ children }) => <h4 className={`${headingSpacing} text-sm`}>{children}</h4>,
  h5: ({ children }) => <h5 className={`${headingSpacing} text-sm font-medium`}>{children}</h5>,
  h6: ({ children }) => (
    <h6 className={`${headingSpacing} text-xs uppercase tracking-[0.12em]`}>{children}</h6>
  ),
  del: ({ children }) => (
    <del className="line-through decoration-foreground/50 text-muted-foreground">{children}</del>
  ),
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

const defaultMarkdownClassName =
  'text-sm text-foreground/90 max-w-prose [&_*:first-child]:mt-0 [&_*:last-child]:mb-0'

type MarkdownContentProps = Readonly<{
  source: string
  className?: string
}>

export function MarkdownContent({ source, className }: MarkdownContentProps) {
  return (
    <div className={className ?? defaultMarkdownClassName}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {source.trim()}
      </ReactMarkdown>
    </div>
  )
}
