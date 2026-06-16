'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Aluno, Faixa } from '@/types'
import { Belt } from '@/components/belt'

/**
 * Graduar Aluno — Versão final "Dojo Escuro".
 * Bottom-sheet que aparece ao tocar "Promover faixa" no perfil.
 * Mostra faixa HOJE → DEPOIS lado a lado; toggle "+1 grau" / "Nova faixa".
 *
 * POST /api/alunos/[id]/graduar  body: { faixa, graus, data }
 * Criar esse endpoint — deve atualizar a faixa do aluno E adicionar um registro
 * em historicoGraduacoes na planilha.
 */

const FAIXAS: Faixa[] = ['Branca', 'Cinza', 'Amarela', 'Laranja', 'Verde', 'Azul', 'Roxa', 'Marrom', 'Preta']

const BELT_RING: Record<Faixa, string> = {
  Branca: '#E9E4D6', Cinza: '#8E959C', Amarela: '#F5C518', Laranja: '#F2700A',
  Verde: '#2FA84F', Azul: '#1A5FD0', Roxa: '#6A2DAE', Marrom: '#5C3A1E', Preta: '#17171A',
}

function Avatar({ nome, faixa, size = 56 }: { nome: string; faixa: Faixa; size?: number }) {
  const ini = nome.split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase()
  return (
    <div className="flex shrink-0 items-center justify-center rounded-full bg-secondary font-extrabold text-foreground"
      style={{ width: size, height: size, fontSize: size * 0.34, boxShadow: `inset 0 0 0 3px ${BELT_RING[faixa]}` }}>
      {ini}
    </div>
  )
}

export default function GraduarPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [aluno, setAluno] = useState<Aluno | null>(null)
  const [modo, setModo] = useState<'grau' | 'faixa'>('grau')
  const [novaFaixa, setNovaFaixa] = useState<Faixa>('Azul')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`/api/alunos/${id}`)
      .then((r) => r.json())
      .then((data: Aluno) => {
        setAluno(data)
        // pré-seleciona próxima faixa
        const idx = FAIXAS.indexOf(data.faixa)
        if (idx < FAIXAS.length - 1) setNovaFaixa(FAIXAS[idx + 1])
      })
  }, [id])

  if (!aluno) return null

  const depoisFaixa = modo === 'faixa' ? novaFaixa : aluno.faixa
  const depoisGraus = modo === 'grau' ? (aluno.graus >= 4 ? 0 : aluno.graus + 1) : 0

  async function confirmar() {
    setLoading(true)
    await fetch(`/api/alunos/${id}/graduar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        faixa: depoisFaixa,
        graus: depoisGraus,
        data: new Date().toISOString().split('T')[0],
        label: modo === 'grau'
          ? `${depoisGraus}º grau · ${depoisFaixa}`
          : `Faixa ${depoisFaixa}`,
      }),
    })
    setLoading(false)
    router.back()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/70 backdrop-blur-sm">
      <div className="w-full rounded-t-[28px] border border-b-0 border-border bg-[#1B1F27] px-5 pb-8 pt-3 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        {/* handle */}
        <div className="mx-auto mb-5 h-[5px] w-10 rounded-full bg-border" />

        {/* aluno */}
        <div className="mb-5 flex items-center gap-3">
          <Avatar nome={aluno.nome} faixa={aluno.faixa} size={48} />
          <div>
            <p className="text-xl font-extrabold">{aluno.nome}</p>
            <p className="text-sm font-semibold text-muted-foreground">Graduar faixa</p>
          </div>
        </div>

        {/* hoje → depois */}
        <div className="mb-5 flex items-center gap-4 px-1">
          <div className="flex-1 text-center">
            <p className="mb-2.5 text-[11.5px] font-extrabold uppercase tracking-widest text-muted-foreground">Hoje</p>
            <div className="flex justify-center"><Belt faixa={aluno.faixa} graus={aluno.graus} width={80} /></div>
            <p className="mt-2 text-[13px] font-bold text-muted-foreground">{aluno.graus} grau{aluno.graus !== 1 ? 's' : ''}</p>
          </div>
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 shrink-0 -rotate-90 text-primary" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20V5M6 11l6-6 6 6" />
          </svg>
          <div className="flex-1 text-center">
            <p className="mb-2.5 text-[11.5px] font-extrabold uppercase tracking-widest text-primary">Depois</p>
            <div className="flex justify-center drop-shadow-[0_0_10px_rgba(255,76,59,0.4)]">
              <Belt faixa={depoisFaixa} graus={depoisGraus} width={80} />
            </div>
            <p className="mt-2 text-[13px] font-extrabold text-foreground">
              {modo === 'faixa' ? `Faixa ${depoisFaixa}` : `${depoisGraus}º grau`}
            </p>
          </div>
        </div>

        {/* modo */}
        <div className="mb-5 flex gap-2.5">
          <button onClick={() => setModo('grau')}
            className={`flex h-[52px] flex-1 items-center justify-center rounded-2xl border-[1.5px] text-[14.5px] font-extrabold transition-all ${modo === 'grau' ? 'border-primary bg-primary/10 text-foreground' : 'border-input bg-card text-muted-foreground'}`}>
            +1 grau
          </button>
          <button onClick={() => setModo('faixa')}
            className={`flex h-[52px] flex-1 items-center justify-center gap-2 rounded-2xl border-[1.5px] text-[14.5px] font-extrabold transition-all ${modo === 'faixa' ? 'border-primary bg-primary/10 text-foreground' : 'border-input bg-card text-muted-foreground'}`}>
            {modo === 'faixa' && <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
            Nova faixa
          </button>
        </div>

        {/* seletor de faixa (só quando modo=faixa) */}
        {modo === 'faixa' && (
          <div className="mb-5 flex flex-wrap gap-2.5">
            {FAIXAS.filter((f) => f !== aluno.faixa).map((f) => (
              <button key={f} onClick={() => setNovaFaixa(f)}
                className={`rounded-xl px-3.5 py-2 text-sm font-bold transition-all ${novaFaixa === f ? 'ring-2 ring-primary scale-105' : 'opacity-70'}`}
                style={{ background: BELT_RING[f], color: f === 'Branca' || f === 'Amarela' ? '#1a1a1a' : '#fff' }}>
                {f}
              </button>
            ))}
          </div>
        )}

        <button onClick={confirmar} disabled={loading}
          className="h-14 w-full rounded-2xl text-[16.5px] font-extrabold text-white shadow-[0_12px_26px_-10px_rgba(225,20,42,0.55)] bg-cta-dojo disabled:opacity-50">
          {loading ? 'Salvando…' : 'Confirmar graduação'}
        </button>
      </div>
    </div>
  )
}
