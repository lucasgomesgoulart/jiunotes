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
import { FaixaSelector } from '@/components/faixa-selector'
import { cn } from '@/lib/utils'

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
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background px-4">
        <button onClick={step === 1 ? () => router.push('/alunos') : back} className="p-1 text-muted-foreground">
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="flex-1 text-lg font-bold">Novo Aluno</h1>
        <span className="text-sm font-medium text-muted-foreground">{step}/{TOTAL_STEPS}</span>
      </header>

      {/* Progress bar */}
      <div className="h-1 shrink-0 bg-muted">
        <div className="h-full bg-primary transition-all duration-300 ease-out" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
      </div>

      {/* Conteúdo rolável */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-sm space-y-6 px-5 pb-6 pt-8">

          {/* ── Step 1: Nome ─────────────────────────────────── */}
          {step === 1 && (
            <>
              <div className="space-y-1 text-center">
                <h2 className="text-2xl font-bold tracking-tight">Qual o nome do aluno?</h2>
                <p className="text-sm text-muted-foreground">Nome completo como aparecerá no sistema.</p>
              </div>
              <FloatingInput
                label="Nome completo"
                className="h-14 text-lg"
                value={form.nome}
                onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))}
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && canProceed && next()}
              />
            </>
          )}

          {/* ── Step 2: Faixa ────────────────────────────────── */}
          {step === 2 && (
            <>
              <div className="space-y-1 text-center">
                <h2 className="text-2xl font-bold tracking-tight">Qual a faixa atual?</h2>
                <p className="text-sm text-muted-foreground">Toque na faixa do aluno.</p>
              </div>
              <FaixaSelector
                value={form.faixa || undefined}
                onChange={(faixa) => setForm((p) => ({ ...p, faixa }))}
              />
            </>
          )}

          {/* ── Step 3: Graus ────────────────────────────────── */}
          {step === 3 && (
            <>
              <div className="space-y-1 text-center">
                <h2 className="text-2xl font-bold tracking-tight">Quantos graus?</h2>
                <p className="text-sm text-muted-foreground">Graus na faixa {(form.faixa || 'branca').toLowerCase()}.</p>
              </div>
              <RadioGroup
                value={String(form.graus)}
                onValueChange={(v) => v && setForm((p) => ({ ...p, graus: Number(v) }))}
                className="gap-2"
              >
                {GRAUS.map((g) => (
                  <label
                    key={g}
                    className="flex cursor-pointer items-center gap-4 rounded-xl border-2 border-border px-4 py-4 transition-all active:bg-muted has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5"
                  >
                    <RadioGroupItem value={String(g)} id={`${id}-grau-${g}`} className="border-primary" />
                    <span className="flex-1 text-base font-medium">
                      {g === 0 ? 'Sem grau' : `${g} grau${g > 1 ? 's' : ''}`}
                    </span>
                    <span className="select-none text-base tracking-widest text-muted-foreground">
                      {'⬤'.repeat(g)}{'○'.repeat(4 - g)}
                    </span>
                  </label>
                ))}
              </RadioGroup>
            </>
          )}

          {/* ── Step 4: Data de Nascimento ───────────────────── */}
          {step === 4 && (
            <>
              <div className="space-y-1 text-center">
                <h2 className="text-2xl font-bold tracking-tight">Data de nascimento</h2>
                <p className="text-sm text-muted-foreground">Opcional — ajuda a identificar o aluno.</p>
              </div>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <button className="flex h-14 w-full items-center justify-between rounded-xl border-2 border-border bg-background px-4 text-base font-normal outline-none transition-colors hover:bg-accent/10 active:bg-muted">
                    <span className={cn('flex items-center gap-3', form.dataNascimento ? 'font-medium text-foreground' : 'text-muted-foreground')}>
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
            </>
          )}
        </div>
      </div>

      {/* Rodapé fixo — botão de ação sempre visível, sem precisar rolar */}
      <div className="shrink-0 border-t border-border bg-background px-5 pb-8 pt-3">
        <div className="mx-auto w-full max-w-sm">
          {step < TOTAL_STEPS ? (
            <Button className="h-13 w-full text-base" onClick={next} disabled={!canProceed}>
              Próximo
            </Button>
          ) : (
            <>
              <Button className="h-13 w-full text-base" onClick={submit} disabled={loading}>
                {loading ? 'Salvando...' : 'Cadastrar Aluno'}
              </Button>
              <button onClick={submit} disabled={loading} className="w-full py-3 text-sm text-muted-foreground transition-colors hover:text-foreground">
                Pular e cadastrar sem data
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
