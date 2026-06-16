import type { Metadata } from 'next'
import { Hanken_Grotesk, Anton } from 'next/font/google'
import './globals.css'

// Corpo — Hanken Grotesk (substitui Inter)
const hanken = Hanken_Grotesk({
  variable: '--font-hanken',
  subsets: ['latin'],
})

// Títulos — Anton (display condensado da marca)
const anton = Anton({
  variable: '--font-anton',
  weight: '400',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'JiuNotes',
  description: 'Sistema de gestão de aulas de Jiu-Jitsu',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`dark ${hanken.variable} ${anton.variable} h-full antialiased`}>
      <body className="min-h-full bg-background text-foreground">{children}</body>
    </html>
  )
}
