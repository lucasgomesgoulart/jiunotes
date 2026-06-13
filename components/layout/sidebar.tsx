'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const navItems = [
  { href: '/alunos', label: 'Alunos' },
  { href: '/aulas', label: 'Aulas' },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <aside className="w-56 flex flex-col border-r border-border bg-sidebar min-h-screen">
      <div className="px-6 py-5 border-b border-border">
        <span className="font-bold text-lg tracking-tight">JiuNotes</span>
        <p className="text-xs text-muted-foreground mt-0.5">Gestão de aulas</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
              pathname.startsWith(item.href)
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-border">
        <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
          Sair
        </Button>
      </div>
    </aside>
  )
}
