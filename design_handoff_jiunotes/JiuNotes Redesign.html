'use client'

import { Faixa } from '@/types'
import { cn } from '@/lib/utils'

/**
 * Belt — gráfico realista de faixa de Jiu-Jitsu (cor + ponteira preta + graus).
 * Substitui/complementa o FaixaBadge atual quando você quer a faixa "de verdade"
 * em vez de uma pílula colorida.
 *
 * Uso:
 *   <Belt faixa="Roxa" graus={2} className="w-14" />
 */

const BELT_BG: Record<Faixa, string> = {
  Branca:  '#E9E4D6',
  Cinza:   '#8E959C',
  Amarela: '#F5C518',
  Laranja: '#F2700A',
  Verde:   '#2FA84F',
  Azul:    '#1A5FD0',
  Roxa:    '#6A2DAE',
  Marrom:  '#5C3A1E',
  Preta:   '#17171A',
}

interface BeltProps {
  faixa: Faixa
  graus?: number
  /** largura em px (a altura é proporcional) */
  width?: number
  className?: string
}

export function Belt({ faixa, graus = 0, width = 56, className }: BeltProps) {
  const color = BELT_BG[faixa]
  const h = Math.max(13, Math.round(width * 0.27))
  const tipW = Math.round(width * 0.42)
  const isWhite = faixa === 'Branca'
  const n = Math.min(graus, 6)

  return (
    <div
      className={cn('relative shrink-0 rounded-[3px]', className)}
      style={{
        width,
        height: h,
        background: color,
        boxShadow: isWhite
          ? 'inset 0 0 0 1px rgba(0,0,0,0.14), 0 1px 2px rgba(0,0,0,0.18)'
          : 'inset 0 -2px 3px rgba(0,0,0,0.28), 0 1px 2px rgba(0,0,0,0.25)',
      }}
    >
      {/* ponteira (ponta preta) com os graus */}
      <div
        className="absolute right-0 top-0 flex h-full items-center justify-center gap-[3px] rounded-r-[3px] px-1"
        style={{
          width: tipW,
          background: faixa === 'Preta' ? '#000' : '#161616',
          boxShadow: 'inset 1px 0 2px rgba(0,0,0,0.35)',
        }}
      >
        {Array.from({ length: n }).map((_, i) => (
          <span
            key={i}
            className="rounded-[1px] bg-white"
            style={{ width: 2.6, height: h - 6, boxShadow: '0 0 0 0.5px rgba(0,0,0,0.25)' }}
          />
        ))}
      </div>
    </div>
  )
}
