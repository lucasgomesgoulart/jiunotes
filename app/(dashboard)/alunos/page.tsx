'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Aluno } from '@/types'
import { Belt } from '@/components/belt'
import { TopHeader } from '@/components/layout/top-header'

/**
 * Alunos — Versão final "Dojo Escuro".
 * Cada aluno mostra faixa real (Belt) + dois botões explícitos:
 *   "Ver perfil →" (vai pra /alunos/[id])
 *   "Inativar" (com modal de confirmação inline).
 *
 * Mantém o fetch /api/alunos e o PUT /api/alunos/[id] existentes.
 */
export default function AlunosPage() {
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [professorId, setProfessorId] = useState('jiu123')
  const [confirmando, setConfirmando] = useState<Aluno | null>(null)
  const [inativando, setInativando] = useState(false)

  useEffect(() => {
    // Pega professor logado
    const fetchAlunosOrdenados = async () => {
      try {
        const sessionRes = await fetch('/api/session')
        const session = await sessionRes.json()
        const prof = session.professorName || 'jiu123'
        setProfessorId(prof)

        const alunosRes = await fetch('/api/alunos')
        const data: Aluno[] = await alunosRes.json()

        if (Array.isArray(data)) {
          const ativos = data.filter((a) => a.status === 'Ativo')
          // Ordena: meus alunos primeiro, depois do outro professor
          const meus = ativos.filter((a) => a.professorId === prof)
          const outros = ativos.filter((a) => a.professorId !== prof)
          setAlunos([...meus, ...outros])
        }
      } catch {
        setAlunos([])
      }
    }

    fetchAlunosOrdenados()
  }, [])

  async function confirmarInativar() {
    if (!confirmando) return
    setInativando(true)
    await fetch(`/api/alunos/${confirmando.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Inativo' }),
    })
    setAlunos((prev) => prev.filter((a) => a.id !== confirmando.id))
    setInativando(false)
    setConfirmando(null)
  }

  return (
    <>
      <TopHeader title="JiuNotes" showLogout />

      <div className="mx-auto w-full max-w-sm px-5 pb-32 pt-4">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="font-display text-[34px] leading-none tracking-wide">Alunos</h1>
          <Link href="/alunos/novo"
            className="flex h-[38px] items-center rounded-xl px-3.5 text-[13.5px] font-extrabold text-white shadow-[0_8px_18px_-8px_rgba(225,20,42,0.6)] bg-cta-dojo">
            + Novo
          </Link>
        </div>

        <p className="mb-4 text-sm font-semibold text-muted-foreground">{alunos.length} alunos ativos</p>

        <div className="space-y-3">
          {alunos.map((aluno) => {
            const ehOutroProfessor = aluno.professorId !== professorId
            return (
            <div key={aluno.id} className="rounded-2xl border border-border bg-card p-4">
              {/* nome + faixa */}
              <div className="flex items-start justify-between gap-2">
                <p className="text-[17px] font-bold tracking-tight flex-1">{aluno.nome}</p>
                {ehOutroProfessor && (
                  <span className="whitespace-nowrap rounded-full bg-amber-500/15 px-2.5 py-1 text-[10px] font-bold text-amber-400">
                    Outro prof
                  </span>
                )}
              </div>
              <div className="mt-2 flex items-center gap-2.5">
                <Belt faixa={aluno.faixa} graus={aluno.graus} width={48} />
                <span className="text-[12.5px] font-semibold text-muted-foreground">
                  {aluno.faixa}{aluno.graus ? ` · ${aluno.graus} grau${aluno.graus > 1 ? 's' : ''}` : ''}
                </span>
              </div>
              {/* ações */}
              <div className="mt-3.5 flex gap-2.5 border-t border-border pt-3.5">
                <Link href={`/alunos/${aluno.id}`}
                  className="flex h-[46px] flex-1 items-center justify-center rounded-xl text-[14.5px] font-extrabold text-white bg-cta-dojo shadow-[0_8px_18px_-8px_rgba(225,20,42,0.5)]">
                  Ver perfil →
                </Link>
                <button
                  onClick={() => setConfirmando(aluno)}
                  className="flex h-[46px] flex-1 items-center justify-center rounded-xl border border-amber-500/40 bg-amber-500/10 text-[14px] font-extrabold text-amber-400">
                  Inativar
                </button>
              </div>
            </div>
          )
          })}
          {alunos.length === 0 && (
            <p className="py-10 text-center text-sm text-muted-foreground">Nenhum aluno ativo.</p>
          )}
        </div>
      </div>

      {/* Modal confirmação inativar */}
      {confirmando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm">
          <div className="w-full max-w-sm space-y-5 rounded-3xl border border-border bg-[#1D212A] p-6 shadow-2xl">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/16 text-amber-400">
                <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.5L22 20H2L12 3.5z" />
                  <path strokeLinecap="round" d="M12 10v4.5M12 17.4h.01" />
                </svg>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xl font-extrabold">Inativar aluno?</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                <span className="font-bold text-foreground">{confirmando.nome}</span> não aparecerá mais nas listas. Você pode reativá-lo depois.
              </p>
            </div>
            <div className="space-y-2.5">
              <button onClick={confirmarInativar} disabled={inativando}
                className="h-[54px] w-full rounded-2xl bg-amber-500 text-base font-extrabold text-amber-950 disabled:opacity-60">
                {inativando ? 'Inativando…' : 'Sim, inativar'}
              </button>
              <button onClick={() => setConfirmando(null)}
                className="h-[54px] w-full rounded-2xl border border-border text-[15.5px] font-bold">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
