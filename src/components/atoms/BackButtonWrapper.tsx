'use client'

import { useRouter } from 'next/navigation'

export function BackButtonWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  return (
    <button onClick={() => router.back()} className=''>
      {children}
    </button>
  )
}