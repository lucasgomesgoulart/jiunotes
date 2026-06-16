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
    <header className="sticky top-0 z-40 flex items-end justify-between gap-3 bg-gradient-to-b from-background to-transparent px-5 pt-12 pb-3">
      <h1 className="font-display text-3xl leading-none tracking-wide uppercase">{title}</h1>
      <div className="flex items-center gap-2">
        {action}
        {showLogout && (
          <button
            onClick={handleLogout}
            className="flex size-9 items-center justify-center rounded-xl border border-white/15 text-muted-foreground hover:text-foreground transition-colors"
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
