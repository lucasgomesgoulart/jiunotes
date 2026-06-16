'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Aluno, Faixa } from '@/types'
import { FloatingInput } from '@/components/ui/floating-input'
import { FaixaSelector } from '@/components/faixa-selector'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Button } from '@/components/ui/button'
import { useId } from 'react'

const GRAUS = [0, 1, 2, 3, 4]

export default function EditarAlunoPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const idGen = useId()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [aluno, setAluno] = useState<Aluno | null>(null)
  const [form, setForm] = useState({
    nome: '',
    faixa: 'Branca' as Faixa,
    graus: 0,
  })

  useEffect(() => {
    fetch(`/api/alunos/${id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: Aluno) => {
        setAluno(data)
        setForm({ nome: data.nome, faixa: data.faixa, graus: data.graus })
      })
      .catch(() => {
        setAluno(null)
      })
      .finally(() => setLoading(false))
  }, [id])

  async function salvar() {
    if (!aluno) return
    setSaving(true)
    const res = await fetch(`/api/alunos/${aluno.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSaving(false)
    if (res.ok) router.push(`/alunos/${aluno.id}`)
  }

  if (loading) {
    return (
      <div className="flex h-[100dvh] items-center justify-center text-muted-foreground text-sm">
        Carregando…
      </div>
    )
  }

  if (!aluno) {
    return (
      <div className="flex h-[100dvh] items-center justify-center px-6 text-center text-sm text-muted-foreground">
        Aluno não encontrado.
      </div>
    )
  }

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-background">
      {/* header */}
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-4">
        <button onClick={() => router.back()} className="p-1 text-muted-foreground">
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="flex-1 text-lg font-extrabold">Editar aluno</h1>
      </header>

      {/* conteúdo rolável */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-sm space-y-6 px-5 pb-6 pt-8">
          {/* Nome */}
          <div>
            <label className="mb-2 block text-sm font-bold">Nome</label>
            <FloatingInput
              label="Nome completo"
              className="h-12 text-base"
              value={form.nome}
              onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))}
            />
          </div>

          {/* Faixa */}
          <div>
            <label className="mb-3 block text-sm font-bold">Faixa</label>
            <FaixaSelector
              value={form.faixa}
              onChange={(f) => setForm((p) => ({ ...p, faixa: f }))}
            />
          </div>

          {/* Graus */}
          <div>
            <label className="mb-3 block text-sm font-bold">Graus</label>
            <RadioGroup
              value={String(form.graus)}
              onValueChange={(v) => setForm((p) => ({ ...p, graus: Number(v) }))}
              className="gap-2"
            >
              {GRAUS.map((g) => (
                <label
                  key={g}
                  className="flex cursor-pointer items-center gap-4 rounded-xl border-2 border-border px-4 py-4 transition-all active:bg-muted has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5"
                >
                  <RadioGroupItem value={String(g)} id={`${idGen}-grau-${g}`} className="border-primary" />
                  <span className="flex-1 text-base font-medium">
                    {g === 0 ? 'Sem grau' : `${g} grau${g > 1 ? 's' : ''}`}
                  </span>
                  <span className="select-none text-base tracking-widest text-muted-foreground">
                    {'⬤'.repeat(g)}{'○'.repeat(4 - g)}
                  </span>
                </label>
              ))}
            </RadioGroup>
          </div>
        </div>
      </div>

      {/* rodapé com botão de salvar */}
      <div className="shrink-0 border-t border-border bg-background px-5 pb-8 pt-3">
        <div className="mx-auto w-full max-w-sm">
          <Button
            onClick={salvar}
            disabled={saving || form.nome.trim().length === 0}
            className="h-13 w-full text-base"
          >
            {saving ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </div>
      </div>
    </div>
  )
}
