'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarIcon } from 'lucide-react'
import { Aluno, AulaComPresencas, CategoriaAula, TipoAula } from '@/types'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { MicButton } from '@/components/ui/mic-button'
import { Belt } from '@/components/belt'
import { cn } from '@/lib/utils'

/**
 * AulaForm — formulário "uma tela só" compartilhado entre Nova aula e Editar aula.
 * Sem wizard: Tipo · Quando · O que treinou · O que foi passado (texto + ditado
 * por voz via MicButton) · Quem veio. "Salvar" fixo embaixo.
 *
 * - Sem `aula`  → modo criação  (POST /api/aulas)
 * - Com `aula`  → modo edição   (PUT /api/aulas/[id]) + botão Apagar (DELETE)
 */

const TIPOS: { value: TipoAula; label: string }[] = [
  { value: 'Kimono', label: 'Kimono' },
  { value: 'NoGi', label: 'NoGi' },
]

const CATEGORIAS: { value: CategoriaAula; cor: string }[] = [
  { value: 'Passagem de Guarda', cor: '#4D8DFF' },
  { value: 'Guarda', cor: '#8C8CFF' },
  { value: 'Quedas', cor: '#FF6B5E' },
  { value: 'Meia Guarda', cor: '#B07BFF' },
  { value: 'Costas', cor: '#4CC474' },
  { value: 'Finalizações', cor: '#FF6B8E' },
  { value: 'Defesa Pessoal', cor: '#FFB13D' },
  { value: 'Outro', cor: '#A8A8B0' },
]

function NumLabel({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="mb-3 mt-[22px] flex items-center gap-2.5">
      <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-primary text-[12.5px] font-extrabold text-primary-foreground">{n}</span>
      <span className="whitespace-nowrap text-base font-extrabold tracking-tight">{children}</span>
    </div>
  )
}

interface AulaFormProps {
  aula?: AulaComPresencas
}

export function AulaForm({ aula }: AulaFormProps) {
  const router = useRouter()
  const editando = !!aula
  const [loading, setLoading] = useState(false)
  const [apagando, setApagando] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [presentes, setPresentes] = useState<Set<string>>(new Set(aula?.presencas ?? []))
  const [form, setForm] = useState({
    tipo: (aula?.tipo ?? 'Kimono') as TipoAula,
    data: aula ? new Date(aula.data + 'T00:00:00') : new Date(),
    categoria: (aula?.categoria ?? '') as CategoriaAula | '',
    conteudoPrincipal: aula?.conteudoPrincipal ?? '',
  })

  useEffect(() => {
    fetch('/api/alunos')
      .then((r) => r.json())
      .then((data: Aluno[]) => setAlunos(Array.isArray(data) ? data.filter((a) => a.status === 'Ativo') : []))
      .catch(() => setAlunos([]))
  }, [])

  function togglePresente(id: string) {
    setPresentes((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const podeSalvar = !!form.categoria && form.conteudoPrincipal.trim().length > 0

  async function submit() {
    if (!podeSalvar) return
    setLoading(true)
    const dataStr = form.data.toISOString().split('T')[0]
    const payload = {
      tipo: form.tipo,
      data: dataStr,
      categoria: form.categoria || 'Outro',
      conteudoPrincipal: form.conteudoPrincipal,
      presencas: Array.from(presentes),
    }
    const res = await fetch(editando ? `/api/aulas/${aula!.id}` : '/api/aulas', {
      method: editando ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    setLoading(false)
    if (res.ok) router.push('/aulas')
  }

  async function apagar() {
    if (!aula) return
    setApagando(true)
    await fetch(`/api/aulas/${aula.id}`, { method: 'DELETE' })
    router.push('/aulas')
  }

  const hoje = new Date()
  const ontem = new Date(); ontem.setDate(ontem.getDate() - 1)
  const atalhos = [
    { label: 'Hoje', d: hoje },
    { label: 'Ontem', d: ontem },
  ]

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-background">
      {/* header */}
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-4">
        <button onClick={() => router.push('/aulas')} className="p-1 text-muted-foreground">
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="flex-1 text-lg font-extrabold tracking-tight">{editando ? 'Editar aula' : 'Nova aula'}</h1>
      </header>

      {/* corpo: tudo numa rolagem */}
      <div className="mx-auto w-full max-w-sm flex-1 overflow-y-auto px-5 pb-4">
        <NumLabel n={1}>Tipo</NumLabel>
        <div className="flex gap-3">
          {TIPOS.map((t) => (
            <button
              key={t.value}
              onClick={() => setForm((p) => ({ ...p, tipo: t.value }))}
              className={cn(
                'flex h-[88px] flex-1 flex-col items-center justify-center gap-2 rounded-2xl border-[1.5px] text-[14.5px] font-extrabold transition-all active:scale-[0.98]',
                form.tipo === t.value ? 'border-primary bg-primary/10' : 'border-input bg-card'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <NumLabel n={2}>Quando</NumLabel>
        <div className="flex gap-2.5">
          {atalhos.map(({ label, d }) => {
            const sel = form.data.toDateString() === d.toDateString()
            return (
              <button
                key={label}
                onClick={() => setForm((p) => ({ ...p, data: d }))}
                className={cn(
                  'h-[50px] flex-1 whitespace-nowrap rounded-2xl border-[1.5px] text-[14.5px] font-extrabold transition-all active:scale-95',
                  sel ? 'border-primary bg-primary/10 text-foreground' : 'border-input bg-card text-muted-foreground'
                )}
              >
                {label}
              </button>
            )
          })}
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <button className="flex h-[50px] flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-2xl border-[1.5px] border-input bg-card text-[14.5px] font-extrabold text-muted-foreground">
                <CalendarIcon className="size-4" /> Outra data
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden rounded-2xl p-0" align="center">
              <Calendar
                mode="single"
                selected={form.data}
                onSelect={(date) => { if (date) setForm((p) => ({ ...p, data: date })); setCalendarOpen(false) }}
                disabled={{ after: new Date() }}
                captionLayout="dropdown"
                startMonth={new Date(2020, 0)}
                endMonth={new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>

        <NumLabel n={3}>O que treinou</NumLabel>
        <div className="flex flex-wrap gap-2.5">
          {CATEGORIAS.map(({ value, cor }) => {
            const sel = form.categoria === value
            return (
              <button
                key={value}
                onClick={() => setForm((p) => ({ ...p, categoria: value }))}
                className="whitespace-nowrap rounded-full border-[1.5px] px-[15px] py-2.5 text-[13.5px] font-bold transition-all active:scale-95"
                style={
                  sel
                    ? { borderColor: cor, background: cor + '26', color: cor }
                    : { borderColor: 'transparent', background: 'rgba(255,255,255,0.08)', color: 'var(--muted-foreground)' }
                }
              >
                {value}
              </button>
            )
          })}
        </div>

        <NumLabel n={4}>O que foi passado</NumLabel>
        <Textarea
          value={form.conteudoPrincipal}
          onChange={(e) => setForm((p) => ({ ...p, conteudoPrincipal: e.target.value }))}
          placeholder="Escreva a técnica trabalhada… ou toque no microfone e fale."
          rows={3}
          className="resize-none text-[15px]"
        />
        <div className="mt-2.5">
          <MicButton
            onTranscript={(text) =>
              setForm((p) => ({
                ...p,
                conteudoPrincipal: p.conteudoPrincipal ? p.conteudoPrincipal + ' ' + text : text,
              }))
            }
          />
        </div>

        <NumLabel n={5}>Quem veio</NumLabel>
        <div className="mb-3 flex items-center justify-between">
          <span className="whitespace-nowrap text-[13.5px] font-bold text-muted-foreground">
            {presentes.size} de {alunos.length} marcados
          </span>
          <button
            onClick={() => setPresentes(new Set(alunos.map((a) => a.id)))}
            className="whitespace-nowrap text-sm font-extrabold text-primary"
          >
            Marcar todos
          </button>
        </div>
        <div className="space-y-2.5">
          {alunos.map((aluno) => {
            const on = presentes.has(aluno.id)
            return (
              <label
                key={aluno.id}
                className={cn(
                  'flex cursor-pointer items-center gap-3.5 rounded-2xl border-[1.5px] px-[15px] py-3 transition-all active:scale-[0.99]',
                  on ? 'border-primary bg-primary/[0.08]' : 'border-input bg-card'
                )}
              >
                <input type="checkbox" checked={on} onChange={() => togglePresente(aluno.id)} className="sr-only" />
                <span
                  className={cn(
                    'flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-lg border-2 text-white',
                    on ? 'border-primary bg-primary' : 'border-input'
                  )}
                >
                  {on && (
                    <svg viewBox="0 0 24 24" fill="none" className="h-[15px] w-[15px]" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                <span className="flex-1 text-[15.5px] font-bold">{aluno.nome}</span>
                <Belt faixa={aluno.faixa} graus={aluno.graus} width={44} />
              </label>
            )
          })}
        </div>

        {editando && (
          <button
            onClick={apagar}
            disabled={apagando}
            className="mt-7 flex h-[50px] w-full items-center justify-center gap-2 rounded-2xl border border-amber-500/40 bg-amber-500/10 text-[14.5px] font-extrabold text-amber-400 disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 7h16" /><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              <path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" /><path d="M10 11v6M14 11v6" />
            </svg>
            {apagando ? 'Apagando…' : 'Apagar aula'}
          </button>
        )}
      </div>

      {/* salvar fixo */}
      <div className="shrink-0 border-t border-border bg-background/85 px-5 pb-8 pt-3 backdrop-blur">
        <button
          onClick={submit}
          disabled={!podeSalvar || loading}
          className="h-[58px] w-full rounded-2xl text-[17px] font-extrabold text-white shadow-[0_12px_26px_-10px_rgba(225,20,42,0.6)] bg-cta-dojo disabled:opacity-40 disabled:shadow-none"
        >
          {loading ? 'Salvando…' : editando ? 'Salvar alterações' : 'Salvar aula'}
        </button>
      </div>
    </div>
  )
}
