'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AulaComPresencas, CategoriaAula } from '@/types'
import { TopHeader } from '@/components/layout/top-header'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Cor de cada categoria
const CATEGORIA_STYLE: Record<string, { bg: string; text: string }> = {
  'Passagem de Guarda': { bg: 'bg-blue-100',   text: 'text-blue-700' },
  'Guarda':             { bg: 'bg-indigo-100',  text: 'text-indigo-700' },
  'Quedas':             { bg: 'bg-red-100',     text: 'text-red-700' },
  'Meia Guarda':        { bg: 'bg-purple-100',  text: 'text-purple-700' },
  'Costas':             { bg: 'bg-green-100',   text: 'text-green-700' },
  'Finalizações':       { bg: 'bg-rose-100',    text: 'text-rose-700' },
  'Defesa Pessoal':     { bg: 'bg-amber-100',   text: 'text-amber-700' },
  'Outro':              { bg: 'bg-gray-100',    text: 'text-gray-600' },
}

// Chip selecionado usa fundo sólido
const CATEGORIA_SELECTED: Record<string, { bg: string; text: string }> = {
  'Passagem de Guarda': { bg: 'bg-blue-500',   text: 'text-white' },
  'Guarda':             { bg: 'bg-indigo-600',  text: 'text-white' },
  'Quedas':             { bg: 'bg-red-500',     text: 'text-white' },
  'Meia Guarda':        { bg: 'bg-purple-600',  text: 'text-white' },
  'Costas':             { bg: 'bg-green-600',   text: 'text-white' },
  'Finalizações':       { bg: 'bg-rose-600',    text: 'text-white' },
  'Defesa Pessoal':     { bg: 'bg-amber-500',   text: 'text-white' },
  'Outro':              { bg: 'bg-gray-600',    text: 'text-white' },
}

function formatarData(iso: string) {
  if (!iso) return '—'
  const d = new Date(iso + 'T12:00:00')
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })
}

function formatarDataCurta(iso: string) {
  if (!iso) return '—'
  const d = new Date(iso + 'T12:00:00')
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

export default function AulasPage() {
  const agora = new Date()
  const [aulas, setAulas] = useState<AulaComPresencas[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [filtro, setFiltro] = useState<CategoriaAula | null>(null)
  const [anoSel, setAnoSel] = useState(agora.getFullYear())
  const [mesSel, setMesSel] = useState(agora.getMonth()) // 0-based
  const [confirmandoId, setConfirmandoId] = useState<string | null>(null)
  const [apagando, setApagando] = useState(false)

  async function apagar(id: string) {
    setApagando(true)
    await fetch(`/api/aulas/${id}`, { method: 'DELETE' })
    setAulas((prev) => prev.filter((a) => a.id !== id))
    setConfirmandoId(null)
    setApagando(false)
  }

  useEffect(() => {
    fetch('/api/aulas')
      .then((r) => r.json())
      .then((data) => {
        if (data?.error) { setErro(data.error); setLoading(false); return }
        setAulas(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => { setErro('Erro de conexão. Verifique as credenciais do Google Sheets.'); setLoading(false) })
  }, [])

  const TODAS_CATEGORIAS: { value: CategoriaAula; chip: string }[] = [
    { value: 'Passagem de Guarda', chip: 'Passagem' },
    { value: 'Guarda',             chip: 'Guarda' },
    { value: 'Quedas',             chip: 'Quedas' },
    { value: 'Meia Guarda',        chip: 'Meia Guarda' },
    { value: 'Costas',             chip: 'Costas' },
    { value: 'Finalizações',       chip: 'Finalizações' },
    { value: 'Defesa Pessoal',     chip: 'Defesa' },
    { value: 'Outro',              chip: 'Outro' },
  ]

  // Aulas do mês/ano selecionado
  const aulasDoPeriodo = aulas.filter((a) => {
    if (!a.data) return false
    const d = new Date(a.data + 'T12:00:00')
    return d.getFullYear() === anoSel && d.getMonth() === mesSel
  })

  // Conta por categoria só no período selecionado
  const contagem = aulasDoPeriodo.reduce<Record<string, number>>((acc, a) => {
    acc[a.categoria] = (acc[a.categoria] ?? 0) + 1
    return acc
  }, {})

  const aulasFiltradas = filtro
    ? aulasDoPeriodo.filter((a) => a.categoria === filtro)
    : aulasDoPeriodo

  // Anos disponíveis: do mais antigo ao atual
  const anosDisponiveis = Array.from(
    new Set(
      aulas
        .map((a) => a.data ? new Date(a.data + 'T12:00:00').getFullYear() : null)
        .filter((y): y is number => y !== null && !isNaN(y))
    )
  ).sort((a, b) => b - a)
  if (!anosDisponiveis.includes(agora.getFullYear())) {
    anosDisponiveis.unshift(agora.getFullYear())
  }

  return (
    <>
      <TopHeader
        title="Aulas"
        action={<Button asChild size="sm"><Link href="/aulas/nova">+ Nova</Link></Button>}
      />

      {/* Filtro por categoria — wrap 2 linhas, tudo visível */}
      {!loading && (
        <div className="px-4 pt-3 pb-1">
          <div className="flex flex-wrap gap-2">
            {/* Chip "Todas" */}
            <button
              onClick={() => setFiltro(null)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-semibold transition-all active:scale-95',
                filtro === null
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              Todas
            </button>

            {TODAS_CATEGORIAS.map(({ value: cat, chip }) => {
              const total = contagem[cat] ?? 0
              const disabled = total === 0
              const sel = filtro === cat
              const style = sel ? CATEGORIA_SELECTED[cat] : CATEGORIA_STYLE[cat]

              return (
                <button
                  key={cat}
                  disabled={disabled}
                  onClick={() => setFiltro(sel ? null : cat)}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-xs font-semibold transition-all',
                    disabled
                      ? 'bg-muted/30 text-muted-foreground/30 cursor-not-allowed'
                      : cn(
                          style?.bg ?? 'bg-muted',
                          style?.text ?? 'text-muted-foreground',
                          sel ? 'shadow-sm scale-[1.04]' : 'active:scale-95'
                        )
                  )}
                >
                  {chip}
                  {!disabled && (
                    <span className="ml-1 opacity-60">({total})</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Seletor de Ano e Mês */}
      {!loading && (
        <div className="px-4 pt-3 pb-1 flex gap-2">
          {/* Ano */}
          <div className="relative flex-1">
            <select
              value={anoSel}
              onChange={(e) => { setAnoSel(Number(e.target.value)); setFiltro(null) }}
              className="w-full appearance-none rounded-xl border-2 border-border bg-background px-3 py-2.5 pr-8 text-sm font-semibold text-foreground outline-none focus:border-primary"
            >
              {anosDisponiveis.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">▾</span>
          </div>

          {/* Mês */}
          <div className="relative flex-[2]">
            <select
              value={mesSel}
              onChange={(e) => { setMesSel(Number(e.target.value)); setFiltro(null) }}
              className="w-full appearance-none rounded-xl border-2 border-border bg-background px-3 py-2.5 pr-8 text-sm font-semibold text-foreground outline-none focus:border-primary"
            >
              {MESES.map((m, i) => (
                <option key={i} value={i}>{m}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">▾</span>
          </div>
        </div>
      )}

      <div className="px-4 py-2">
        <p className="text-sm text-muted-foreground">
          {aulasFiltradas.length} aula{aulasFiltradas.length !== 1 ? 's' : ''}
          {filtro ? ` · ${filtro}` : ''} em {MESES[mesSel]} {anoSel}
        </p>
      </div>

      <div className="px-4 space-y-4 pb-6">
        {erro ? (
          <div className="py-16 text-center space-y-2">
            <p className="text-destructive text-sm font-medium">{erro}</p>
            <p className="text-muted-foreground text-xs">Verifique o arquivo <code>.env.local</code> e reinicie o servidor.</p>
          </div>
        ) : loading ? (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-3xl border-2 border-border h-40 bg-muted/30 animate-pulse" />
            ))}
          </div>
        ) : aulasFiltradas.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <p className="text-muted-foreground text-sm">
              {filtro ? `Nenhuma aula de ${filtro} registrada.` : 'Nenhuma aula registrada ainda.'}
            </p>
            {!filtro && <Button asChild><Link href="/aulas/nova">Registrar primeira aula</Link></Button>}
          </div>
        ) : (
          aulasFiltradas.map((aula) => {
            const catStyle = CATEGORIA_STYLE[aula.categoria] ?? { bg: 'bg-gray-100', text: 'text-gray-600' }
            return (
              <div key={aula.id} className="rounded-3xl border-2 border-border bg-background overflow-hidden">
                {/* Topo colorido */}
                <div className={cn(
                  'px-5 py-3 flex items-center justify-between',
                  aula.tipo === 'Kimono' ? 'bg-blue-600' : 'bg-orange-500'
                )}>
                  <span className="text-white font-bold text-sm">
                    {aula.tipo === 'Kimono' ? '🥋 Kimono' : '💪 NoGi'}
                  </span>
                  <span className="text-white/80 text-sm font-medium">
                    {formatarDataCurta(aula.data)}
                  </span>
                </div>

                {/* Corpo */}
                <div className="px-5 py-4 space-y-3">
                  <p className="text-xs text-muted-foreground font-medium capitalize">
                    {formatarData(aula.data)}
                  </p>
                  <p className="font-bold text-lg leading-snug">{aula.conteudoPrincipal}</p>

                  {/* Tag colorida e maior */}
                  <span className={cn(
                    'inline-block text-sm font-semibold px-4 py-1.5 rounded-full',
                    catStyle.bg, catStyle.text
                  )}>
                    {aula.categoria}
                  </span>
                </div>

                {/* Rodapé */}
                <div className="px-5 py-3 border-t-2 border-border flex items-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-muted-foreground" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                  </svg>
                  <span className="text-sm font-semibold text-primary">{aula.presencas.length}</span>
                  <span className="text-sm text-muted-foreground flex-1">
                    aluno{aula.presencas.length !== 1 ? 's' : ''} presente{aula.presencas.length !== 1 ? 's' : ''}
                  </span>

                  {confirmandoId === aula.id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Apagar?</span>
                      <button
                        onClick={() => apagar(aula.id)}
                        disabled={apagando}
                        className="text-xs font-bold text-destructive disabled:opacity-50"
                      >
                        {apagando ? '...' : 'Sim'}
                      </button>
                      <button
                        onClick={() => setConfirmandoId(null)}
                        className="text-xs text-muted-foreground"
                      >
                        Não
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmandoId(aula.id)}
                      className="text-muted-foreground/50 hover:text-destructive transition-colors p-1"
                    >
                      <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </>
  )
}
