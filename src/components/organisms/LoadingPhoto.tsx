'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

type LoadingPhotoProps = Readonly<{
  src: string
  alt: string
  className?: string
}>

export function LoadingPhoto({ src, alt, className }: LoadingPhotoProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading')
  const isLoading = status === 'loading'
  const hasError = status === 'error'

  return (
    <>
      {isLoading ? (
        <output
          className="absolute inset-0 flex items-center justify-center bg-neutral-950"
          aria-label="Loading photo"
        >
          <div className="size-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        </output>
      ) : null}

      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-950 px-6 text-center text-sm text-white/70">
          This photo could not be loaded.
        </div>
      ) : null}

      <img
        src={src}
        alt={alt}
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
        className={cn(
          'block h-full w-full select-none object-contain transition-opacity duration-300',
          status === 'loaded' ? 'opacity-100' : 'opacity-0',
          className
        )}
      />
    </>
  )
}
