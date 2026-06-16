'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Aluno, AulaComPresencas, Faixa } from '@/types'
import { AulaCard, Presente } from '@/components/aula-card'
import { TopHeader } from '@/components/layout/top-header'
import { cn } from '@/lib/utils'

/**
 * Aulas — Versão final "D1 cartões grandes" com ações explícitas.
 * Cada cartão tem: data grande, categoria colorida, avatares dos presentes,
 * botão "Editar" (→ /aulas/[id]/editar) e lixeira (com desfazer).
 *
 * Mantém os fetches /api/aulas e /api/alunos existentes.
 * Adicionar DELETE /api/aulas/[id] para a exclusão.
 */

function Trash({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
      <path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"/>
      <path d="M10 11v6M14 11v6"/>
    </svg>
  )
}

export default function AulasPage() {
  const router = useRouter()
  const [aulas, setAulas] = useState<AulaComPresencas[]>([])
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [apagada, setApagada] = useState<AulaComPresencas | null>(null)
  const [desfazerTimer, setDesfazerTimer] = useState<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    fetch('/api/aulas').then((r) => r.json()).then(setAulas).catch(() => {})
    fetch('/api/alunos').then((r) => r.json()).then(setAlunos).catch(() => {})
  }, [])

  const mapaAluno = useMemo(() => {
    const m = new Map<string, { nome: string; faixa: Faixa }>()
    alunos.forEach((a) => m.set(a.id, { nome: a.nome, faixa: a.faixa }))
    return m
  }, [alunos])

  function resolver(ids: string[]): Presente[] {
    return ids.map((id) => mapaAluno.get(id)).filter(Boolean) as Presente[]
  }

  function apagarAula(aula: AulaComPresencas) {
    // remove da lista imediatamente (optimistic)
    setAulas((prev) => prev.filter((a) => a.id !== aula.id))
    setApagada(aula)
    // timer de 5s para confirmar a exclusão real
    const t = setTimeout(async () => {
      await fetch(`/api/aulas/${aula.id}`, { method: 'DELETE' })
      setApagada(null)
    }, 5000)
    setDesfazerTimer(t)
  }

  function desfazer() {
    if (desfazerTimer) clearTimeout(desfazerTimer)
    if (apagada) setAulas((prev) => [apagada, ...prev].sort((a, b) => b.data.localeCompare(a.data)))
    setApagada(null)
    setDesfazerTimer(null)
  }

  return (
    <>
      <TopHeader title="Aulas" showLogout />

      <div className="mx-auto w-full max-w-sm px-5 pb-32 pt-4">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="font-display text-[34px] leading-none tracking-wide">Aulas</h1>
          <Link href="/aulas/nova"
            className="flex h-[38px] items-center rounded-xl px-3.5 text-[13.5px] font-extrabold text-white shadow-[0_8px_18px_-8px_rgba(225,20,42,0.6)] bg-cta-dojo">
            + Nova
          </Link>
        </div>

        <p className="mb-4 text-sm font-semibold text-muted-foreground">{aulas.length} aulas</p>

        <div className="space-y-4">
          {aulas.map((aula) => (
            <div key={aula.id}>
              <AulaCard
                data={aula.data}
                tipo={aula.tipo}
                categoria={aula.categoria}
                conteudo={aula.conteudoPrincipal}
                presentes={resolver(aula.presencas)}
              />
              {/* ações abaixo do card */}
              <div className="mt-2 flex gap-2">
                <Link href={`/aulas/${aula.id}/editar`}
                  className="flex h-[46px] flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card text-[14.5px] font-extrabold">
                  <svg viewBox="0 0 24 24" fill="none" className="h-[17px] w-[17px]" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 20h4L19.5 8.5a2.1 2.1 0 0 0-4-4L4 16v4zM13.5 6.5l4 4" />
                  </svg>
                  Editar
                </Link>
                <button
                  onClick={() => apagarAula(aula)}
                  className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-400">
                  <Trash className="h-[18px] w-[18px]" />
                </button>
              </div>
            </div>
          ))}
          {aulas.length === 0 && (
            <p className="py-10 text-center text-sm text-muted-foreground">Nenhuma aula registrada ainda.</p>
          )}
        </div>
      </div>

      {/* Toast "Apagar + Desfazer" */}
      {apagada && (
        <div className="fixed bottom-28 left-0 right-0 z-50 flex justify-center px-5">
          <div className="flex w-full max-w-sm items-center gap-4 rounded-2xl border border-border bg-[#23272F] px-4 py-3.5 shadow-2xl">
            <span className="flex-1 text-[14.5px] font-bold">Aula apagada</span>
            <button onClick={desfazer}
              className="h-[38px] whitespace-nowrap rounded-xl bg-primary px-4 text-sm font-extrabold text-white">
              Desfazer
            </button>
          </div>
        </div>
      )}
    </>
  )
}
