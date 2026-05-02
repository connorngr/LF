import { MarkdownContent } from '@/components/molecules/MarkdownContent'

type ProfileMottoMarkdownProps = Readonly<{
  source: string
  className?: string
}>

export function ProfileMottoMarkdown({ source, className }: ProfileMottoMarkdownProps) {
  const trimmed = source.trim()
  if (!trimmed) return null

  return <MarkdownContent source={source} className={className} />
}
