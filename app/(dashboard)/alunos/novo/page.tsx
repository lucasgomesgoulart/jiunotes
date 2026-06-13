'use client'

import { useId, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarIcon, ChevronDownIcon } from 'lucide-react'
import { Faixa } from '@/types'
import { Button } from '@/components/ui/button'
import { FloatingInput } from '@/components/ui/floating-input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const FAIXAS: {
  value: Faixa
  label: string
  bg: string
  text: string
  ring: string
}[] = [
  { value: 'Branca',  label: 'Branca',  bg: 'bg-white border-2 border-gray-200',  text: 'text-gray-800', ring: 'ring-gray-300' },
  { value: 'Cinza',   label: 'Cinza',   bg: 'bg-gray-400',     text: 'text-white',        ring: 'ring-gray-400' },
  { value: 'Amarela', label: 'Amarela', bg: 'bg-yellow-400',   text: 'text-yellow-900',   ring: 'ring-yellow-400' },
  { value: 'Laranja', label: 'Laranja', bg: 'bg-orange-500',   text: 'text-white',        ring: 'ring-orange-500' },
  { value: 'Verde',   label: 'Verde',   bg: 'bg-green-500',    text: 'text-white',        ring: 'ring-green-500' },
  { value: 'Azul',    label: 'Azul',    bg: 'bg-blue-600',     text: 'text-white',        ring: 'ring-blue-600' },
  { value: 'Roxa',    label: 'Roxa',    bg: 'bg-purple-600',   text: 'text-white',        ring: 'ring-purple-600' },
  { value: 'Marrom',  label: 'Marrom',  bg: 'bg-amber-800',    text: 'text-white',        ring: 'ring-amber-800' },
  { value: 'Preta',   label: 'Preta',   bg: 'bg-gray-950',     text: 'text-white',        ring: 'ring-gray-950' },
]

const GRAUS = [0, 1, 2, 3, 4]
const TOTAL_STEPS = 4

export default function NovoAlunoPage() {
  const router = useRouter()
  const id = useId()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)

  const [form, setForm] = useState({
    nome: '',
    faixa: '' as Faixa | '',
    graus: 0,
    dataNascimento: undefined as Date | undefined,
  })

  function next() { setStep((s) => Math.min(s + 1, TOTAL_STEPS)) }
  function back() { setStep((s) => Math.max(s - 1, 1)) }

  async function submit() {
    setLoading(true)
    const res = await fetch('/api/alunos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: form.nome,
        faixa: form.faixa || 'Branca',
        graus: form.graus,
        dataNascimento: form.dataNascimento
          ? form.dataNascimento.toISOString().split('T')[0]
          : '',
        status: 'Ativo',
      }),
    })
    setLoading(false)
    if (res.ok) router.push('/alunos')
  }

  const canProceed =
    step === 1 ? form.nome.trim().length > 0 :
    step === 2 ? !!form.faixa :
    true

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border px-4 h-14 flex items-center gap-3">
        <button onClick={step === 1 ? () => router.push('/alunos') : back} className="text-muted-foreground p-1">
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-bold flex-1">Novo Aluno</h1>
        <span className="text-sm text-muted-foreground font-medium">{step}/{TOTAL_STEPS}</span>
      </header>

      {/* Progress bar */}
      <div className="h-1 bg-muted">
        <div className="h-full bg-primary transition-all duration-300 ease-out" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
      </div>

      {/* Content */}
      <div className="px-5 pt-8 pb-10 max-w-sm mx-auto w-full space-y-6">

        {/* ── Step 1: Nome ─────────────────────────────────── */}
        {step === 1 && (
          <>
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">Qual o nome do aluno?</h2>
              <p className="text-muted-foreground text-sm">Nome completo como aparecerá no sistema.</p>
            </div>
            <FloatingInput
              label="Nome completo"
              className="h-14 text-lg"
              value={form.nome}
              onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && canProceed && next()}
            />
            <Button className="w-full h-13 text-base" onClick={next} disabled={!canProceed}>
              Próximo
            </Button>
          </>
        )}

        {/* ── Step 2: Faixa ────────────────────────────────── */}
        {step === 2 && (
          <>
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">Qual a faixa atual?</h2>
              <p className="text-muted-foreground text-sm">Toque na faixa do aluno.</p>
            </div>
            <RadioGroup
              value={form.faixa}
              onValueChange={(v) => v && setForm((p) => ({ ...p, faixa: v as Faixa }))}
              className="grid grid-cols-3 gap-3"
            >
              {FAIXAS.map((f) => (
                <label
                  key={f.value}
                  className={cn(
                    'relative flex flex-col items-center justify-center gap-2 rounded-2xl px-2 py-5 text-center cursor-pointer transition-all active:scale-95 shadow-sm',
                    f.bg,
                    form.faixa === f.value && `ring-4 ring-offset-2 ${f.ring} scale-105 shadow-lg`
                  )}
                >
                  <RadioGroupItem
                    id={`${id}-${f.value}`}
                    value={f.value}
                    className="sr-only after:absolute after:inset-0"
                  />
                  <span className="text-3xl leading-none">🥋</span>
                  <span className={cn('text-xs font-bold tracking-wide', f.text)}>{f.label.toUpperCase()}</span>
                </label>
              ))}
            </RadioGroup>
            <Button className="w-full h-13 text-base" onClick={next} disabled={!canProceed}>
              Próximo
            </Button>
          </>
        )}

        {/* ── Step 3: Graus ────────────────────────────────── */}
        {step === 3 && (
          <>
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">Quantos graus?</h2>
              <p className="text-muted-foreground text-sm">Graus na faixa {(form.faixa || 'branca').toLowerCase()}.</p>
            </div>
            <RadioGroup
              value={String(form.graus)}
              onValueChange={(v) => v && setForm((p) => ({ ...p, graus: Number(v) }))}
              className="gap-2"
            >
              {GRAUS.map((g) => (
                <label
                  key={g}
                  className="flex items-center gap-4 rounded-xl border-2 border-border px-4 py-4 cursor-pointer transition-all active:bg-muted has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5"
                >
                  <RadioGroupItem value={String(g)} id={`${id}-grau-${g}`} className="border-primary" />
                  <span className="flex-1 text-base font-medium">
                    {g === 0 ? 'Sem grau' : `${g} grau${g > 1 ? 's' : ''}`}
                  </span>
                  <span className="text-base tracking-widest text-muted-foreground select-none">
                    {'⬤'.repeat(g)}{'○'.repeat(4 - g)}
                  </span>
                </label>
              ))}
            </RadioGroup>
            <Button className="w-full h-13 text-base" onClick={next}>
              Próximo
            </Button>
          </>
        )}

        {/* ── Step 4: Data de Nascimento ───────────────────── */}
        {step === 4 && (
          <>
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">Data de nascimento</h2>
              <p className="text-muted-foreground text-sm">Opcional — ajuda a identificar o aluno.</p>
            </div>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <button className="flex h-14 w-full items-center justify-between rounded-xl border-2 border-border bg-background px-4 text-base font-normal outline-none transition-colors hover:bg-accent/10 active:bg-muted">
                  <span className={cn('flex items-center gap-3', form.dataNascimento ? 'text-foreground font-medium' : 'text-muted-foreground')}>
                    <CalendarIcon className="size-5" />
                    {form.dataNascimento
                      ? form.dataNascimento.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
                      : 'Selecione uma data'}
                  </span>
                  <ChevronDownIcon className="size-5 text-muted-foreground/80" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden rounded-2xl p-0 shadow-md" align="center">
                <Calendar
                  mode="single"
                  selected={form.dataNascimento}
                  onSelect={(date) => { setForm((p) => ({ ...p, dataNascimento: date })); setCalendarOpen(false) }}
                  disabled={{ after: new Date() }}
                  captionLayout="dropdown"
                  defaultMonth={form.dataNascimento ?? new Date(2000, 0)}
                  startMonth={new Date(1940, 0)}
                  endMonth={new Date()}
                />
              </PopoverContent>
            </Popover>
            <Button className="w-full h-13 text-base" onClick={submit} disabled={loading}>
              {loading ? 'Salvando...' : 'Cadastrar Aluno'}
            </Button>
            <button onClick={submit} disabled={loading} className="w-full py-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pular e cadastrar sem data
            </button>
          </>
        )}
      </div>
    </div>
  )
}
