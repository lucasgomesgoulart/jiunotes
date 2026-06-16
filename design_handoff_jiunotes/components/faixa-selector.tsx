'use client'

import { Faixa } from '@/types'
import { Belt } from './belt'
import { cn } from '@/lib/utils'

/**
 * FaixaSelector — Direção F1 ("faixas reais em lista").
 * Cada opção É a própria faixa (cor + ponteira + nome gravado). Substitui a
 * grade de quadrados com ícone no passo 2 de /alunos/novo.
 *
 * Controlado: passe `value` e `onChange`. Encaixa direto no useState que o
 * wizard de Novo Aluno já usa.
 *
 *   <FaixaSelector value={faixa} onChange={setFaixa} />
 */

const FAIXAS: { nome: Faixa; bg: string; fg: string }[] = [
  { nome: 'Branca',  bg: '#E9E4D6', fg: '#26231D' },
  { nome: 'Cinza',   bg: '#8E959C', fg: '#ffffff' },
  { nome: 'Amarela', bg: '#F5C518', fg: '#3D3008' },
  { nome: 'Laranja', bg: '#F2700A', fg: '#ffffff' },
  { nome: 'Verde',   bg: '#2FA84F', fg: '#ffffff' },
  { nome: 'Azul',    bg: '#1A5FD0', fg: '#ffffff' },
  { nome: 'Roxa',    bg: '#7B2FBF', fg: '#ffffff' },
  { nome: 'Marrom',  bg: '#8A4B16', fg: '#ffffff' },
  { nome: 'Preta',   bg: '#17171A', fg: '#ffffff' },
]

interface FaixaSelectorProps {
  value?: Faixa
  onChange: (faixa: Faixa) => void
  className?: string
}

export function FaixaSelector({ value, onChange, className }: FaixaSelectorProps) {
  return (
    <div className={cn('flex flex-col gap-2.5', className)}>
      {FAIXAS.map(({ nome, bg, fg }) => {
        const selected = value === nome
        const isWhite = nome === 'Branca'
        return (
          <button
            key={nome}
            type="button"
            onClick={() => onChange(nome)}
            aria-pressed={selected}
            className={cn(
              'relative h-12 w-full overflow-hidden rounded-[10px] outline-none transition-transform active:scale-[0.99]',
              selected && 'ring-[3px] ring-primary'
            )}
            style={{
              background: bg,
              boxShadow: isWhite
                ? 'inset 0 0 0 1px rgba(0,0,0,0.16), 0 2px 6px rgba(0,0,0,0.3)'
                : 'inset 0 -3px 5px rgba(0,0,0,0.28), 0 2px 6px rgba(0,0,0,0.35)',
            }}
          >
            {/* costura central */}
            <span className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-black/10" />
            {/* nome gravado */}
            <span
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] font-extrabold uppercase tracking-[1.2px]"
              style={{ color: fg }}
            >
              {nome}
            </span>
            {/* ponteira preta */}
            <span className="absolute right-0 top-0 h-full w-[26%] bg-[#141414]" />
            {/* check da selecionada */}
            {selected && (
              <span className="absolute right-2.5 top-1/2 flex h-[26px] w-[26px] -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="h-[15px] w-[15px]">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

/** Re-export para conveniência. */
export { Belt }
