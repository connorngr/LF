import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { ProfileMottoMarkdown } from '@/components/molecules/ProfileMottoMarkdown'
import { ContactDialog } from '@/components/molecules/ContactDialog'
import { BusinessModeToggle } from '@/components/molecules/BusinessModeToggle'
import {
  profileName,
  profileHandle,
  avatarUrl,
  profileMottoMarkdown,
  contactEmails,
} from '@/lib/env'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/auth'
import { getUrl } from '@/lib/r2'

type PersonalInfoHeroProps = Readonly<{
  businessOnly?: boolean
}>

export async function PersonalInfoHero({ businessOnly = false }: PersonalInfoHeroProps) {
  const isAdmin = await isAuthenticated()
  const visible = isAdmin ? {} : { isPrivate: false }
  const [totalCount, businessCount] = await Promise.all([
    prisma.post.count({ where: visible }),
    prisma.post.count({ where: { ...visible, isBusiness: true } }),
  ])
  // The count follows the gallery: business posts only while business mode is on.
  const postCount = businessOnly ? businessCount : totalCount
  // Stay visible while on, so an empty business view can still be switched off.
  const showBusinessToggle = businessCount > 0 || businessOnly

  return (
    <div className="mx-auto max-w-4xl border-0 bg-transparent shadow-none">
      <div className="space-y-6 px-4 py-6 md:px-8">
        <div className="flex flex-row items-start gap-4 md:items-center md:gap-8">
          <Link href="/upload" className="group cursor-pointer">
            <Avatar className="size-35 shrink-0 border-4 border-background transition-opacity group-hover:opacity-80 md:size-40">
              <AvatarImage
                src={await getUrl(avatarUrl)}
                alt={profileName}
                priority
              />
            </Avatar>
          </Link>
          <div className="min-w-0 flex-1 space-y-2 md:space-y-3">
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-xl leading-tight tracking-tight md:text-2xl">
                {profileName}
              </h1>
              {contactEmails.length > 0 ? <ContactDialog emails={contactEmails} /> : null}
            </div>
            <div className="flex flex-row flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              <span className="text-muted-foreground">@{profileHandle}</span>
              <span aria-hidden className="text-muted-foreground/60">
                ·
              </span>
              <p className="m-0">
                <span className="font-semibold text-foreground">{postCount}</span>{' '}
                <span className="text-muted-foreground">
                  {postCount === 1 ? 'post' : 'posts'}
                </span>
              </p>
              {showBusinessToggle ? (
                <>
                  <span aria-hidden className="text-muted-foreground/60">
                    ·
                  </span>
                  <BusinessModeToggle enabled={businessOnly} />
                </>
              ) : null}
            </div>
            <ProfileMottoMarkdown source={profileMottoMarkdown} />
          </div>
        </div>
      </div>
    </div>
  )
}

export function PersonalInfoHeroSkeleton() {
  return (
    <Card className="mx-auto max-w-4xl border-0 bg-transparent shadow-none">
      <CardContent className="space-y-6 px-4 py-6 md:px-8">
        <div className="flex flex-row items-start gap-4 md:items-center md:gap-8">
          <Skeleton className="size-20 shrink-0 rounded-full md:size-40" />
          <div className="min-w-0 flex-1 space-y-2 md:space-y-3">
            <Skeleton className="h-7 w-36 md:h-8" />
            <div className="flex flex-row flex-wrap items-center gap-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="max-w-prose space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
