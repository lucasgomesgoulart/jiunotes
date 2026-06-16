'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Aluno, Faixa, CategoriaAula } from '@/types'
import { Belt } from '@/components/belt'
import { cn } from '@/lib/utils'

/**
 * Perfil do Aluno — Versão final "Dojo Escuro".
 * Mostra: avatar com anel da faixa, faixa atual, tempo na faixa, presenças,
 * frequência, botão "Promover faixa", histórico de graduações e últimas presenças.
 *
 * Requer endpoint: GET /api/alunos/[id]
 * Retorna AlunoPerfil (ver interface abaixo).
 * Criar esse endpoint em app/api/alunos/[id]/route.ts.
 */

interface Graduacao {
  faixa: Faixa
  graus: number
  data: string   // "2026-03-15"
  label: string  // "4º grau · Branca"
}

interface PresencaResumo {
  idAula: string
  data: string
  categoria: CategoriaAula
  conteudo: string
}

interface AlunoPerfil extends Aluno {
  totalPresencas: number
  presencasMes: number
  totalAulasMes: number         // para calcular frequência
  tempoNaFaixaLabel: string     // ex: "1a 3m" — calcular no servidor
  historicoGraduacoes: Graduacao[]
  ultimasPresencas: PresencaResumo[]
}

const CAT_COLOR: Record<string, string> = {
  'Passagem de Guarda': '#4D8DFF', 'Guarda': '#8C8CFF', 'Quedas': '#FF6B5E',
  'Meia Guarda': '#B07BFF', 'Costas': '#4CC474', 'Finalizações': '#FF6B8E',
  'Defesa Pessoal': '#FFB13D', 'Outro': '#A8A8B0',
}

const BELT_RING: Record<Faixa, string> = {
  Branca: '#E9E4D6', Cinza: '#8E959C', Amarela: '#F5C518', Laranja: '#F2700A',
  Verde: '#2FA84F', Azul: '#1A5FD0', Roxa: '#6A2DAE', Marrom: '#5C3A1E', Preta: '#17171A',
}

function Avatar({ nome, faixa, size = 72 }: { nome: string; faixa: Faixa; size?: number }) {
  const ini = nome.split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase()
  return (
    <div className="flex shrink-0 items-center justify-center rounded-full bg-secondary font-extrabold text-foreground"
      style={{ width: size, height: size, fontSize: size * 0.34, boxShadow: `inset 0 0 0 3px ${BELT_RING[faixa]}` }}>
      {ini}
    </div>
  )
}

export default function PerfilAlunoPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [perfil, setPerfil] = useState<AlunoPerfil | null>(null)

  useEffect(() => {
    fetch(`/api/alunos/${id}`)
      .then((r) => r.json())
      .then(setPerfil)
  }, [id])

  if (!perfil) {
    return <div className="flex h-screen items-center justify-center text-muted-foreground text-sm">Carregando…</div>
  }

  const freq = perfil.totalAulasMes > 0 ? Math.round((perfil.presencasMes / perfil.totalAulasMes) * 100) : 0

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-background">
      {/* header */}
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-4">
        <button onClick={() => router.back()} className="p-1 text-muted-foreground">
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="flex-1 text-lg font-extrabold">Aluno</h1>
        <Link href={`/alunos/${id}/editar`}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground">
          <svg viewBox="0 0 24 24" fill="none" className="h-[19px] w-[19px]" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 20h4L19.5 8.5a2.1 2.1 0 0 0-4-4L4 16v4zM13.5 6.5l4 4" />
          </svg>
        </Link>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-sm space-y-5 px-5 pb-8 pt-6">
          {/* identidade */}
          <div className="flex flex-col items-center gap-4 text-center">
            <Avatar nome={perfil.nome} faixa={perfil.faixa} />
            <div>
              <p className="text-2xl font-extrabold tracking-tight">{perfil.nome}</p>
              <div className="mt-3 flex items-center justify-center gap-3">
                <Belt faixa={perfil.faixa} graus={perfil.graus} width={70} />
                <span className="text-sm font-bold text-muted-foreground">
                  {perfil.faixa} · {perfil.graus} grau{perfil.graus !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>

          {/* estatísticas */}
          <div className="flex items-stretch rounded-3xl border border-border bg-card px-3 py-[18px]">
            {[
              { n: perfil.tempoNaFaixaLabel, l: `na faixa ${perfil.faixa.toLowerCase()}` },
              { n: String(perfil.totalPresencas), l: 'presenças totais' },
              { n: `${freq}%`, l: 'freq. no mês' },
            ].map((s, i) => (
              <div key={i} className="flex flex-1 items-center">
                {i > 0 && <div className="mr-3.5 h-12 w-px bg-border" />}
                <div className="flex-1 px-1 text-center">
                  <div className="font-display text-3xl leading-[0.95]">{s.n}</div>
                  <div className="mt-1.5 text-[11px] font-semibold leading-tight text-muted-foreground">{s.l}</div>
                </div>
              </div>
            ))}
          </div>

          {/* promover */}
          <Link href={`/alunos/${id}/graduar`}
            className="flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl text-[16.5px] font-extrabold text-white shadow-[0_12px_26px_-10px_rgba(225,20,42,0.55)] bg-cta-dojo">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 20V5M6 11l6-6 6 6" />
            </svg>
            Promover faixa
          </Link>

          {/* histórico de graduações */}
          {perfil.historicoGraduacoes.length > 0 && (
            <div>
              <p className="mb-2 text-[16.5px] font-extrabold tracking-tight">Graduações</p>
              <div>
                {perfil.historicoGraduacoes.map((g, i) => (
                  <div key={i} className="flex gap-3.5">
                    <div className="flex flex-col items-center">
                      <div className={cn('mt-3.5 h-2.5 w-2.5 rounded-full', i === 0 ? 'bg-primary' : 'bg-border')} />
                      {i < perfil.historicoGraduacoes.length - 1 && <div className="mt-1 flex-1 w-0.5 bg-border" />}
                    </div>
                    <div className="pb-3 pt-2.5">
                      <p className="text-[14.5px] font-bold">{g.label}</p>
                      <p className="mt-0.5 text-[12.5px] font-semibold text-muted-foreground">
                        {new Date(g.data + 'T00:00:00').toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* últimas presenças */}
          {perfil.ultimasPresencas.length > 0 && (
            <div>
              <p className="mb-2 text-[16.5px] font-extrabold tracking-tight">Últimas presenças</p>
              <div className="divide-y divide-border rounded-2xl border border-border bg-card overflow-hidden">
                {perfil.ultimasPresencas.map((p) => {
                  const c = CAT_COLOR[p.categoria] ?? '#A8A8B0'
                  return (
                    <div key={p.idAula} className="flex items-center gap-3 px-4 py-3">
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: c }} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[15px] font-bold">{p.conteudo}</p>
                        <p className="text-[12px] font-semibold text-muted-foreground">{p.categoria}</p>
                      </div>
                      <p className="shrink-0 text-[12.5px] font-semibold text-muted-foreground">
                        {new Date(p.data + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
