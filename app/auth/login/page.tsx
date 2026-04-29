import { LoginForm } from '../LoginForm'
import { profileName } from '@/lib/env'

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-8">
        <div className="space-y-3 text-center">
          <h1 className="text-3xl font-bold tracking-tight">{profileName}'s Gallery</h1>
          <p className="text-base text-muted-foreground">
            Admin login required to upload and manage photos
          </p>
        </div>

        <div className="rounded-lg border border-border/50 bg-linear-to-b from-card to-card/95 p-6 shadow-sm backdrop-blur-sm">
          <LoginForm />
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Protected admin area
        </p>
      </div>
    </main>
  )
}
