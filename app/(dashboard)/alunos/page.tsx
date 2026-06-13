'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Aluno } from '@/types'
import { FaixaBadge } from '@/components/faixa-badge'
import { TopHeader } from '@/components/layout/top-header'
import { Button } from '@/components/ui/button'

export default function AlunosPage() {
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmando, setConfirmando] = useState<Aluno | null>(null)
  const [inativando, setInativando] = useState(false)

  useEffect(() => {
    fetch('/api/alunos')
      .then((r) => r.json())
      .then((data: Aluno[]) => {
        setAlunos(data.filter((a) => a.status === 'Ativo'))
        setLoading(false)
      })
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
      <TopHeader
        title="Alunos"
        showLogout
        action={<Button asChild size="sm"><Link href="/alunos/novo">+ Novo</Link></Button>}
      />

      <div className="px-4 py-3">
        <p className="text-sm text-muted-foreground">
          {alunos.length} aluno{alunos.length !== 1 ? 's' : ''} ativo{alunos.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="px-4 space-y-2 pb-6">
        {loading ? (
          <div className="py-16 text-center text-muted-foreground text-sm">Carregando...</div>
        ) : alunos.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <p className="text-muted-foreground text-sm">Nenhum aluno ativo no momento.</p>
            <Button asChild><Link href="/alunos/novo">Cadastrar primeiro aluno</Link></Button>
          </div>
        ) : (
          alunos.map((aluno) => (
            <div key={aluno.id} className="bg-background rounded-2xl border-2 border-border flex items-center gap-3 px-4 py-3.5">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{aluno.nome}</p>
                <div className="mt-1.5">
                  <FaixaBadge faixa={aluno.faixa} graus={aluno.graus} />
                </div>
              </div>
              <button
                onClick={() => setConfirmando(aluno)}
                className="shrink-0 text-xs font-medium text-muted-foreground border border-border rounded-xl px-3 py-2 hover:border-destructive/50 hover:text-destructive transition-colors"
              >
                Inativar
              </button>
            </div>
          ))
        )}
      </div>

      {/* Modal de confirmação — centralizado, grande */}
      {confirmando && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm"
          onClick={() => !inativando && setConfirmando(null)}
        >
          <div
            className="w-full max-w-sm bg-background rounded-3xl p-6 space-y-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ícone */}
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-3xl">
                ⚠️
              </div>
            </div>

            {/* Texto */}
            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold tracking-tight">Inativar aluno?</h2>
              <p className="text-muted-foreground text-sm">
                <span className="font-semibold text-foreground">{confirmando.nome}</span> não aparecerá mais nas listas e chamadas.
                Você pode reativá-lo depois.
              </p>
            </div>

            {/* Botões */}
            <div className="space-y-2.5">
              <button
                onClick={confirmarInativar}
                disabled={inativando}
                className="w-full h-13 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-base transition-colors disabled:opacity-60"
              >
                {inativando ? 'Inativando...' : 'Sim, inativar'}
              </button>
              <button
                onClick={() => setConfirmando(null)}
                disabled={inativando}
                className="w-full h-13 rounded-2xl border-2 border-border text-foreground font-semibold text-base hover:bg-muted transition-colors disabled:opacity-60"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
