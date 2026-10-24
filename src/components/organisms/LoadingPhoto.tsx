'use client'

import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

type LoadingPhotoProps = Readonly<{
  src: string
  alt: string
  className?: string
  priority?: boolean
}>

export function LoadingPhoto({
  src,
  alt,
  className,
  priority = false,
}: LoadingPhotoProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading')
  const isLoading = status === 'loading'
  const hasError = status === 'error'

  return (
    <>
      {isLoading ? <LoadingPhotoPlaceholder /> : null}

      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-950 px-6 text-center text-sm text-white/70">
          This photo could not be loaded.
        </div>
      ) : null}

      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 1024px) 100vw, 70vw"
        {...(priority ? { priority: true } : { loading: 'lazy' as const })}
        unoptimized
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
        className={cn(
          'object-contain transition-opacity duration-300',
          status === 'loaded' ? 'opacity-100' : 'opacity-0',
          className
        )}
      />
    </>
  )
}

// Shared with ImageDetailSkeleton so the route loading state and the image
// loading state look identical and swap without a visual jump.
export function LoadingPhotoPlaceholder() {
  return (
    <output
      className="absolute inset-0 flex items-center justify-center bg-neutral-950"
      aria-label="Loading photo"
    >
      <div className="size-8 animate-spin rounded-full border-2 border-white/20 border-t-white motion-reduce:animate-none" />
    </output>
  )
}
