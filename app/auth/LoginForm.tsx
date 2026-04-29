'use client'

import { useForm } from 'react-hook-form'
import { loginSchema, type LoginInput } from '@/schemas/login'
import { login } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { useSearchParams } from 'next/navigation'
import { startTransition, useActionState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'

type LoginResult =
  | { success: true }
  | { success: false; error: string }

const initialState: LoginResult = { success: false, error: '' }

export function LoginForm() {
  const searchParams = useSearchParams()
  const from = searchParams.get('from')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const [state, loginAction] = useActionState(
    async (_prevState: LoginResult, formData: FormData) => {
      const username = formData.get('username') as string
      const password = formData.get('password') as string
      return login({ username, password }, from || undefined)
    },
    initialState
  )

  const onSubmit = async (data: LoginInput) => {
    const formData = new FormData()
    formData.append('username', data.username)
    formData.append('password', data.password)
    startTransition(() => {
      loginAction(formData)
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="username" className="block text-sm font-medium">
          Username
        </label>
        <input
          {...register('username')}
          id="username"
          type="text"
          placeholder="Enter your username"
          className="w-full rounded-md border border-input/50 bg-background/50 px-3 py-2.5 text-sm transition-colors placeholder:text-muted-foreground/60 hover:border-input focus:border-primary focus:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          disabled={isSubmitting}
        />
        {errors.username && (
          <p className="text-xs text-destructive">{errors.username.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          {...register('password')}
          id="password"
          type="password"
          placeholder="Enter your password"
          className="w-full rounded-md border border-input/50 bg-background/50 px-3 py-2.5 text-sm transition-colors placeholder:text-muted-foreground/60 hover:border-input focus:border-primary focus:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          disabled={isSubmitting}
        />
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      {state.success === false && state.error && (
        <div className="space-y-1.5 rounded-md bg-destructive/10 p-3">
          <p className="text-xs font-medium text-destructive">Login failed</p>
          <p className="text-xs text-destructive/80">{state.error}</p>
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
            Logging in...
          </div>
        ) : (
          'Log In'
        )}
      </Button>
    </form>
  )
}
