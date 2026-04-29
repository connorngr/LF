'use server'

import { loginSchema } from '@/schemas/login'
import { validateCredentials, setAuthCookie } from '@/lib/auth'
import { redirect, RedirectType } from 'next/navigation'

type LoginResult = 
  | { success: true }
  | { success: false; error: string }

export async function login(data: unknown, from?: string): Promise<LoginResult> {
  const validation = loginSchema.safeParse(data)

  if (!validation.success) {
    const errors = validation.error.issues.map(issue => issue.message).join('; ')
    return { success: false, error: errors }
  }

  const { username, password } = validation.data

  if (!validateCredentials(username, password)) {
    return { success: false, error: 'Invalid username or password' }
  }

  await setAuthCookie()

  const redirectUrl = from?.startsWith('/') ? from : '/upload'
  redirect(redirectUrl, RedirectType.replace)
}
