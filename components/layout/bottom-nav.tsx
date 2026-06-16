'use client'

import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  {
    href: '/dashboard',
    label: 'Início',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    ),
  },
  {
    href: '/alunos',
    label: 'Alunos',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    href: '/aulas',
    label: 'Aulas',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={2}>
        <rect x="3" y="4" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
]

export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4 pb-8 pt-2.5">
      <div
        className="flex w-full max-w-sm items-center gap-1 px-2 py-3"
        style={{
          background: '#1D2436',
          border: '1.5px solid rgba(255,255,255,0.2)',
          borderRadius: 24,
          boxShadow: '0 -20px 48px rgba(0,0,0,0.85), 0 4px 16px rgba(0,0,0,0.5)',
        }}
      >
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={cn(
                'flex flex-1 flex-col items-center gap-1.5 transition-all active:scale-95',
                active ? 'text-white' : 'text-muted-foreground hover:text-foreground/80'
              )}
            >
              <span
                className={cn(
                  'flex h-[34px] w-[46px] items-center justify-center rounded-xl transition-colors',
                  active && 'bg-primary text-primary-foreground shadow-[var(--neon-glow)]'
                )}
              >
                {item.icon}
              </span>
              <span className={cn('text-[11px] tracking-wide', active ? 'font-bold' : 'font-semibold')}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
