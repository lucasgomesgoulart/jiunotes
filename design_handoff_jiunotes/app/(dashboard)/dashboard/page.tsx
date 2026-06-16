'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Aluno, Aula } from '@/types'
import { Belt } from '@/components/belt'
import { TopHeader } from '@/components/layout/top-header'
import { cn } from '@/lib/utils'

/**
 * Início — Versão final "Dojo Escuro" (sem IA).
 * Header + saudação + CTA grande "Nova aula" + faixa de estatísticas (3 colunas
 * num painel só) + "Mais presentes" (ranking com <Belt>) + "Últimas aulas".
 *
 * Mantém o fetch /api/dashboard existente (mesmo DashboardData).
 * REMOVIDO o card de "Sugestão IA" por decisão do cliente (foco não é IA).
 */

interface DashboardData {
  totalAtivos: number
  totalAulasMes: number
  totalPresencasMes: number
  mesNome: string
  topAlunos: (Aluno & { presencas: number })[]
  ultimasAulas: Aula[]
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard')
      .then((r) => r.json())
      .then((d) => { if (!d?.error) setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const hora = new Date().getHours()
  const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite'

  return (
    <>
      <TopHeader title="JiuNotes" showLogout />

      <div className="mx-auto w-full max-w-sm space-y-6 px-5 pb-32 pt-5">
        {/* Saudação */}
        <div>
          <p className="text-xs font-extrabold uppercase tracking-widest text-primary">{saudacao}, Professor</p>
          <h1 className="mt-1.5 font-display text-4xl leading-none tracking-wide">Visão Geral</h1>
        </div>

        {/* CTA principal */}
        <Link
          href="/aulas/nova"
          className="relative block overflow-hidden rounded-3xl p-5 text-white shadow-[0_18px_40px_-12px_rgba(225,20,42,0.6)] bg-cta-dojo"
        >
          <span className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/10" />
          <p className="relative text-xl font-extrabold tracking-tight">Cadastrar aula de hoje</p>
          <p className="relative mt-1 text-sm text-white/85">Registre o treino em uma tela só.</p>
          <span className="relative mt-4 flex h-12 items-center justify-center gap-2 rounded-2xl bg-white text-[15px] font-extrabold text-[#16181E]">
            + Nova aula
          </span>
        </Link>

        {/* Faixa de estatísticas (um painel, 3 colunas) */}
        <div className="flex items-stretch rounded-3xl border border-border bg-card px-3.5 py-[18px]">
          {[
            { n: data?.totalAtivos, l: 'Alunos ativos' },
            { n: data?.totalAulasMes, l: `Aulas em ${data?.mesNome ?? '—'}` },
            { n: data?.totalPresencasMes, l: 'Presenças' },
          ].map((s, i) => (
            <div key={i} className="flex flex-1 items-center">
              {i > 0 && <div className="mr-3.5 h-12 w-px bg-border" />}
              <div className="px-1">
                <div className="font-display text-4xl leading-[0.95]">{loading ? '–' : s.n ?? 0}</div>
                <div className="mt-1.5 text-[11.5px] font-semibold uppercase tracking-wide text-muted-foreground">{s.l}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Mais presentes */}
        {data && data.topAlunos.length > 0 && (
          <div>
            <p className="mb-3 text-[17px] font-extrabold tracking-tight">Mais presentes em {data.mesNome}</p>
            <div className="space-y-2.5">
              {data.topAlunos.map((aluno, i) => {
                const pct = data.totalAulasMes > 0 ? Math.round((aluno.presencas / data.totalAulasMes) * 100) : 0
                return (
                  <div key={aluno.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5">
                    <span className={cn('w-[18px] text-center font-display text-2xl', i === 0 ? 'text-primary' : 'text-muted-foreground/40')}>{i + 1}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[16.5px] font-bold tracking-tight">{aluno.nome}</p>
                      <div className="mt-1.5"><Belt faixa={aluno.faixa} graus={aluno.graus} width={46} /></div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-display text-lg">{pct}<span className="text-xs">%</span></p>
                      <p className="text-xs text-muted-foreground">{aluno.presencas} aulas</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Últimas aulas */}
        {data && data.ultimasAulas.length > 0 && (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[17px] font-extrabold tracking-tight">Últimas aulas</p>
              <Link href="/aulas" className="whitespace-nowrap text-[13.5px] font-bold text-primary">Ver todas</Link>
            </div>
            <div className="space-y-2.5">
              {data.ultimasAulas.map((aula) => (
                <Link key={aula.id} href="/aulas" className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15.5px] font-bold">{aula.conteudoPrincipal}</p>
                    <p className="mt-0.5 text-[12.5px] font-semibold text-muted-foreground">{aula.categoria}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[13.5px] font-bold">
                      {new Date(aula.data + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    </p>
                    <span className="mt-1 inline-block rounded-full bg-[#1A5FD0]/20 px-2.5 py-0.5 text-[11.5px] font-extrabold text-[#6FA5FF]">{aula.tipo}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
