'use client'

import { useRouter } from 'next/navigation'

interface TopHeaderProps {
  title: string
  action?: React.ReactNode
  showLogout?: boolean
}

export function TopHeader({ title, action, showLogout }: TopHeaderProps) {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <header className="sticky top-0 z-40 bg-background border-b border-border px-4 h-14 flex items-center justify-between">
      <h1 className="text-lg font-bold tracking-tight">{title}</h1>
      <div className="flex items-center gap-2">
        {action}
        {showLogout && (
          <button
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground p-2 rounded-lg transition-colors"
            aria-label="Sair"
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        )}
      </div>
    </header>
  )
}
