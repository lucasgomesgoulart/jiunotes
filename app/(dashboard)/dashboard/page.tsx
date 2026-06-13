'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Aluno, Aula } from '@/types'
import { FaixaBadge } from '@/components/faixa-badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { TopHeader } from '@/components/layout/top-header'
import { SugestaoIA } from '@/types'
import { cn } from '@/lib/utils'

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
  const [sugestao, setSugestao] = useState<SugestaoIA | null>(null)
  const [loadingIA, setLoadingIA] = useState(false)
  const [sugestaoAberta, setSugestaoAberta] = useState(false)
  const [restantesIA, setRestantesIA] = useState<number | null>(null)

  const LIMITE_IA = 3

  useEffect(() => {
    fetch('/api/ai/usos')
      .then((r) => r.json())
      .then((d) => setRestantesIA(d.restantes))
      .catch(() => setRestantesIA(LIMITE_IA))
  }, [])

  useEffect(() => {
    fetch('/api/dashboard')
      .then((r) => r.json())
      .then((d) => { if (!d?.error) setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function prepararProximaAula() {
    setSugestaoAberta(true)
    if (sugestao) return
    if (restantesIA !== null && restantesIA <= 0) return
    setLoadingIA(true)
    try {
      const res = await fetch('/api/ai/sugestao')
      const body = await res.json()
      if (res.status === 429) {
        setRestantesIA(0)
      } else {
        setSugestao(body)
        setRestantesIA((r) => (r !== null ? Math.max(0, r - 1) : null))
      }
    } finally {
      setLoadingIA(false)
    }
  }

  const hora = new Date().getHours()
  const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite'

  return (
    <>
      <TopHeader title="JiuNotes" showLogout />

      <div className="px-4 pt-5 pb-32 space-y-6 max-w-sm mx-auto w-full">

        {/* Saudação */}
        <div>
          <p className="text-muted-foreground text-sm">{saudacao}, Professor</p>
          <h1 className="text-xl font-bold tracking-tight mt-0.5">Visão Geral</h1>
        </div>

        {/* Stat cards */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className={cn('rounded-2xl border border-border bg-muted/40 h-24 animate-pulse', i === 2 && 'col-span-2')} />
            ))}
          </div>
        ) : data && (
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-3xl font-bold text-primary">{data.totalAtivos}</p>
              <p className="text-xs text-muted-foreground mt-1 font-medium">Alunos ativos</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-3xl font-bold text-primary">{data.totalAulasMes}</p>
              <p className="text-xs text-muted-foreground mt-1 font-medium">Aulas em {data.mesNome}</p>
            </div>
            <div className="col-span-2 rounded-2xl border border-border bg-card p-4">
              <p className="text-3xl font-bold text-primary">{data.totalPresencasMes}</p>
              <p className="text-xs text-muted-foreground mt-1 font-medium">Presenças em {data.mesNome}</p>
            </div>
          </div>
        )}

        {/* CTA Cadastrar aula */}
        <div className="rounded-2xl bg-slate-800 p-5 text-white space-y-3">
          <div>
            <p className="font-bold text-base">Cadastrar aula</p>
            <p className="text-xs text-white/60 mt-0.5">Registre o treino de hoje ou peça uma sugestão à IA</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={prepararProximaAula}
              disabled={restantesIA !== null && restantesIA <= 0}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {restantesIA === null ? 'Sugestão IA' : restantesIA <= 0 ? 'Limite atingido' : `Sugestão IA (${restantesIA}/${LIMITE_IA})`}
            </button>
            <Link
              href="/aulas/nova"
              className="flex-1 bg-white text-slate-800 text-sm font-semibold py-2.5 rounded-xl transition-colors text-center"
            >
              Nova aula
            </Link>
          </div>
        </div>

        {/* Card de sugestão IA */}
        {sugestaoAberta && (
          <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-sm">Sugestão para hoje</p>
              <button onClick={() => setSugestaoAberta(false)} className="text-muted-foreground text-xs">✕</button>
            </div>
            {loadingIA ? (
              <div className="space-y-2">
                <div className="h-4 bg-muted animate-pulse rounded" />
                <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
              </div>
            ) : sugestao ? (
              <>
                <div>
                  <p className="font-bold text-base text-primary">{sugestao.tema}</p>
                  <p className="text-sm text-muted-foreground mt-1">{sugestao.justificativa}</p>
                </div>
                <Separator />
                <div className="space-y-1.5 text-sm">
                  <p><span className="font-medium">Aquecimento:</span> <span className="text-muted-foreground">{sugestao.estrutura.aquecimento}</span></p>
                  <p><span className="font-medium">Técnica:</span> <span className="text-muted-foreground">{sugestao.estrutura.tecnicaDoDia}</span></p>
                  <p><span className="font-medium">Rolas:</span> <span className="text-muted-foreground">{sugestao.estrutura.dinamismoRolas}</span></p>
                </div>
                <Button asChild className="w-full">
                  <Link href="/aulas/nova">Começar esta aula</Link>
                </Button>
              </>
            ) : restantesIA !== null && restantesIA <= 0 ? (
              <p className="text-sm text-muted-foreground">Limite de {LIMITE_IA} sugestões por dia atingido. Volta amanhã.</p>
            ) : (
              <p className="text-sm text-muted-foreground">Erro ao gerar sugestão. Verifique sua chave da API.</p>
            )}
          </div>
        )}

        {/* Top presenças */}
        {data && data.topAlunos.length > 0 && (
          <div className="rounded-2xl bg-muted/40 border border-border p-4 space-y-3">
            <p className="font-semibold text-sm text-foreground">Mais presentes em {data.mesNome}</p>
            <div className="space-y-2">
              {data.topAlunos.map((aluno, i) => (
                <div key={aluno.id} className="flex items-center gap-3 bg-background rounded-xl px-4 py-3">
                  <span className="text-sm font-bold text-muted-foreground w-5 shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{aluno.nome}</p>
                    <FaixaBadge faixa={aluno.faixa} graus={aluno.graus} />
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-primary text-base">{aluno.presencas} aulas</p>
                    <p className="text-sm font-semibold text-foreground">
                      {data.totalAulasMes > 0
                        ? `${Math.round((aluno.presencas / data.totalAulasMes) * 100)}%`
                        : '—'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Últimas aulas */}
        {data && data.ultimasAulas.length > 0 && (
          <div className="rounded-2xl bg-muted/40 border border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-sm text-foreground">Últimas aulas</p>
              <Link href="/aulas" className="text-xs text-primary font-medium">Ver todas</Link>
            </div>
            <div className="space-y-2">
              {data.ultimasAulas.map((aula) => (
                <div key={aula.id} className="flex items-center gap-3 bg-background rounded-xl px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-base truncate">{aula.conteudoPrincipal}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{aula.categoria}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-foreground">
                      {new Date(aula.data + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    </p>
                    <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full', aula.tipo === 'Kimono' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700')}>
                      {aula.tipo}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </>
  )
}
