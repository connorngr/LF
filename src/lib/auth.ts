import { adminUsername, adminPassword } from '@/lib/env'
import { cookies } from 'next/headers'

export const AUTH_COOKIE_NAME = 'lifeframe_auth_token'
export const AUTH_COOKIE_VALUE = 'authenticated'

export function validateCredentials(username: string, password: string): boolean {
  return username === adminUsername && password === adminPassword
}

export async function setAuthCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(AUTH_COOKIE_NAME, AUTH_COOKIE_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

export async function removeAuthCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_COOKIE_NAME)
}

export async function getAuthCookie(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(AUTH_COOKIE_NAME)?.value
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getAuthCookie()
  return token === AUTH_COOKIE_VALUE
}
