'use client'

import { useEffect, useId, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarIcon, ChevronDownIcon } from 'lucide-react'
import { Aluno, CategoriaAula, TipoAula } from '@/types'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { FaixaBadge } from '@/components/faixa-badge'
import { MicButton } from '@/components/ui/mic-button'
import { cn } from '@/lib/utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faShieldHalved, faLock, faArrowDown, faShield,
  faBullseye, faBolt, faUserShield, faPenToSquare,
} from '@fortawesome/free-solid-svg-icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

const TIPOS: { value: TipoAula; emoji: string; desc: string }[] = [
  { value: 'Kimono', emoji: '🥋', desc: 'Com kimono'  },
  { value: 'NoGi',   emoji: '🩳', desc: 'Sem kimono'  },
]

const CATEGORIAS: { value: CategoriaAula; icon: IconDefinition }[] = [
  { value: 'Passagem de Guarda', icon: faShieldHalved },
  { value: 'Guarda',             icon: faLock         },
  { value: 'Quedas',             icon: faArrowDown    },
  { value: 'Meia Guarda',        icon: faShield       },
  { value: 'Costas',             icon: faBullseye     },
  { value: 'Finalizações',       icon: faBolt         },
  { value: 'Defesa Pessoal',     icon: faUserShield   },
  { value: 'Outro',              icon: faPenToSquare  },
]

const TOTAL_STEPS = 4

export default function NovaAulaPage() {
  const router = useRouter()
  const id = useId()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [presentes, setPresentes] = useState<Set<string>>(new Set())

  const [form, setForm] = useState({
    tipo: '' as TipoAula | '',
    data: undefined as Date | undefined,
    categoria: '' as CategoriaAula | '',
    conteudoPrincipal: '',
  })

  useEffect(() => {
    fetch('/api/alunos')
      .then((r) => r.json())
      .then((data: Aluno[]) => setAlunos(data.filter((a) => a.status === 'Ativo')))
  }, [])

  function next() { setStep((s) => Math.min(s + 1, TOTAL_STEPS)) }
  function back() { setStep((s) => Math.max(s - 1, 1)) }
  function togglePresente(idAluno: string) {
    setPresentes((prev) => {
      const next = new Set(prev)
      if (next.has(idAluno)) { next.delete(idAluno) } else { next.add(idAluno) }
      return next
    })
  }

  async function submit() {
    setLoading(true)
    const dataStr = form.data
      ? form.data.toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
    const res = await fetch('/api/aulas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tipo: form.tipo || 'Kimono',
        data: dataStr,
        categoria: form.categoria || 'Outro',
        conteudoPrincipal: form.conteudoPrincipal,
        presencas: Array.from(presentes),
      }),
    })
    setLoading(false)
    if (res.ok) router.push('/aulas')
  }

  const canProceed =
    step === 1 ? !!form.tipo :
    step === 2 ? !!form.data :
    step === 3 ? !!form.categoria && form.conteudoPrincipal.trim().length > 0 :
    true

  return (
    // h-[100dvh] garante que nunca há scroll nos steps 1-3
    <div className="h-[100dvh] flex flex-col bg-background overflow-hidden">

      {/* Header */}
      <header className="shrink-0 z-40 bg-background border-b border-border px-4 h-14 flex items-center gap-3">
        <button onClick={step === 1 ? () => router.push('/aulas') : back} className="text-muted-foreground p-1">
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-bold flex-1">Nova Aula</h1>
        <span className="text-sm text-muted-foreground font-medium">{step}/{TOTAL_STEPS}</span>
      </header>

      {/* Progress bar */}
      <div className="shrink-0 h-1 bg-muted">
        <div className="h-full bg-primary transition-all duration-300 ease-out" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
      </div>

      {/* ── Step 1: Tipo ──────────────────────────────────────── */}
      {step === 1 && (
        <div className="flex-1 flex flex-col px-5 pt-6 pb-24 max-w-sm mx-auto w-full">
          <div className="text-center space-y-1 mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Qual o tipo de aula?</h2>
            <p className="text-muted-foreground text-sm">Kimono ou sem kimono (NoGi)?</p>
          </div>
          <div className="grid grid-cols-2 gap-4 flex-1">
            {TIPOS.map((t) => (
              <button
                key={t.value}
                onClick={() => setForm((p) => ({ ...p, tipo: t.value }))}
                className={cn(
                  'flex flex-col items-center justify-center gap-3 rounded-2xl border-2 aspect-square transition-all active:scale-[0.97]',
                  form.tipo === t.value
                    ? 'border-primary bg-primary/5 scale-[1.03] shadow-md'
                    : 'border-border bg-muted/30'
                )}
              >
                <span className="text-6xl leading-none" style={{ filter: 'grayscale(1)' }}>{t.emoji}</span>
                <div className="text-center">
                  <p className="font-bold text-base tracking-tight">{t.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p>
                </div>
              </button>
            ))}
          </div>
          <Button className="mt-5 w-full h-12 text-base shrink-0" onClick={next} disabled={!canProceed}>
            Próximo
          </Button>
        </div>
      )}

      {/* ── Step 2: Data ──────────────────────────────────────── */}
      {step === 2 && (
        <div className="flex-1 flex flex-col px-5 pt-6 pb-24 max-w-sm mx-auto w-full">
          <div className="text-center space-y-1 mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Qual a data da aula?</h2>
            <p className="text-muted-foreground text-sm">Selecione o dia do treino.</p>
          </div>

          <div className="space-y-3">
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <button className="flex h-14 w-full items-center justify-between rounded-xl border-2 border-border bg-background px-4 text-base outline-none transition-colors hover:bg-accent/10 active:bg-muted">
                  <span className={cn('flex items-center gap-3', form.data ? 'text-foreground font-semibold' : 'text-muted-foreground')}>
                    <CalendarIcon className="size-5" />
                    {form.data
                      ? form.data.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })
                      : 'Selecione uma data'}
                  </span>
                  <ChevronDownIcon className="size-5 text-muted-foreground/80" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden rounded-2xl p-0 shadow-md" align="center">
                <Calendar
                  mode="single"
                  selected={form.data}
                  onSelect={(date) => { setForm((p) => ({ ...p, data: date })); setCalendarOpen(false) }}
                  disabled={{ after: new Date() }}
                  captionLayout="dropdown"
                  defaultMonth={new Date()}
                  startMonth={new Date(2020, 0)}
                  endMonth={new Date()}
                />
              </PopoverContent>
            </Popover>

            <div className="grid grid-cols-3 gap-2">
              {[{ label: 'Hoje', offset: 0 }, { label: 'Ontem', offset: -1 }, { label: 'Anteontem', offset: -2 }].map(({ label, offset }) => {
                const d = new Date(); d.setDate(d.getDate() + offset)
                const selected = form.data?.toDateString() === d.toDateString()
                return (
                  <button
                    key={label}
                    onClick={() => setForm((p) => ({ ...p, data: d }))}
                    className={cn(
                      'rounded-xl border-2 py-3.5 text-sm font-medium transition-all active:scale-95',
                      selected ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'
                    )}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          <Button className="mt-auto w-full h-12 text-base shrink-0" onClick={next} disabled={!canProceed}>
            Próximo
          </Button>
        </div>
      )}

      {/* ── Step 3: Categoria + Conteúdo ─────────────────────── */}
      {step === 3 && (
        <div className="flex-1 flex flex-col px-5 pt-4 pb-24 max-w-sm mx-auto w-full gap-3">
          <div className="text-center space-y-0.5">
            <h2 className="text-xl font-bold tracking-tight">O que foi trabalhado?</h2>
            <p className="text-muted-foreground text-xs">Categoria e conteúdo da aula.</p>
          </div>

          <RadioGroup
            value={form.categoria}
            onValueChange={(v) => v && setForm((p) => ({ ...p, categoria: v as CategoriaAula }))}
            className="grid grid-cols-2 gap-2.5"
          >
            {CATEGORIAS.map((c) => {
              const selected = form.categoria === c.value
              return (
                <label
                  key={c.value}
                  className={cn(
                    'relative flex flex-col items-center justify-center gap-2.5 rounded-2xl py-4 px-2 text-center cursor-pointer transition-all active:scale-95',
                    selected
                      ? 'bg-white ring-2 ring-primary scale-[1.03] shadow-md'
                      : 'bg-white/40 border border-border'
                  )}
                >
                  <RadioGroupItem value={c.value} id={`${id}-cat-${c.value}`} className="sr-only after:absolute after:inset-0" />
                  <FontAwesomeIcon
                    icon={c.icon}
                    className="w-6 h-6 text-foreground"
                  />
                  <span className="text-xs font-bold leading-tight text-center text-foreground">
                    {c.value}
                  </span>
                </label>
              )
            })}
          </RadioGroup>

          <div className="space-y-2">
            <p className="text-sm font-medium">Conteúdo Principal</p>
            <Textarea
              value={form.conteudoPrincipal}
              onChange={(e) => setForm((p) => ({ ...p, conteudoPrincipal: e.target.value }))}
              placeholder="Ex: Triângulo partindo da guarda fechada…"
              className="text-base resize-none"
              rows={2}
            />
            <MicButton
              onTranscript={(text) =>
                setForm((p) => ({
                  ...p,
                  conteudoPrincipal: p.conteudoPrincipal ? p.conteudoPrincipal + ' ' + text : text,
                }))
              }
            />
          </div>

          <Button className="mt-auto w-full h-12 text-base shrink-0" onClick={next} disabled={!canProceed}>
            Próximo
          </Button>
        </div>
      )}

      {/* ── Step 4: Chamada (lista — pode scrollar) ──────────── */}
      {step === 4 && (
        <div className="flex-1 flex flex-col overflow-hidden px-5 pt-5 pb-24 max-w-sm mx-auto w-full gap-4">
          <div className="text-center space-y-0.5 shrink-0">
            <h2 className="text-xl font-bold tracking-tight">Quem estava presente?</h2>
            <p className="text-muted-foreground text-sm">
              {presentes.size}/{alunos.length} marcado{presentes.size !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex gap-4 justify-center shrink-0">
            <button onClick={() => setPresentes(new Set(alunos.map((a) => a.id)))} className="text-sm font-semibold text-primary">Marcar todos</button>
            <span className="text-muted-foreground">·</span>
            <button onClick={() => setPresentes(new Set())} className="text-sm font-semibold text-muted-foreground">Limpar</button>
          </div>

          {/* Lista com scroll */}
          <div className="flex-1 overflow-y-auto space-y-2 -mx-1 px-1">
            {alunos.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-6">Nenhum aluno ativo cadastrado.</p>
            ) : alunos.map((aluno) => {
              const presente = presentes.has(aluno.id)
              return (
                <label
                  key={aluno.id}
                  className={cn(
                    'flex items-center gap-4 rounded-2xl border-2 px-4 py-3.5 cursor-pointer transition-all active:scale-[0.98]',
                    presente ? 'border-primary bg-primary/5' : 'border-border'
                  )}
                >
                  <Checkbox checked={presente} onCheckedChange={() => togglePresente(aluno.id)} className="shrink-0" />
                  <span className="flex-1 font-medium text-sm">{aluno.nome}</span>
                  <FaixaBadge faixa={aluno.faixa} graus={aluno.graus} />
                </label>
              )
            })}
          </div>

          <Button className="shrink-0 w-full h-12 text-base" onClick={submit} disabled={loading}>
            {loading ? 'Salvando...' : 'Registrar Aula'}
          </Button>
        </div>
      )}
    </div>
  )
}
