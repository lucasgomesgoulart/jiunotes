import { Faixa } from '@/types'
import { cn } from '@/lib/utils'

const faixaConfig: Record<Faixa, { bg: string; text: string; dots?: string }> = {
  Branca:  { bg: 'bg-white border border-gray-300',  text: 'text-gray-800' },
  Cinza:   { bg: 'bg-gray-400',  text: 'text-white' },
  Amarela: { bg: 'bg-yellow-400', text: 'text-yellow-900' },
  Laranja: { bg: 'bg-orange-500', text: 'text-white' },
  Verde:   { bg: 'bg-green-600',  text: 'text-white' },
  Azul:    { bg: 'bg-blue-600',   text: 'text-white' },
  Roxa:    { bg: 'bg-purple-600', text: 'text-white' },
  Marrom:  { bg: 'bg-amber-800',  text: 'text-white' },
  Preta:   { bg: 'bg-gray-900',   text: 'text-white' },
}

interface FaixaBadgeProps {
  faixa: Faixa
  graus: number
  className?: string
}

export function FaixaBadge({ faixa, graus, className }: FaixaBadgeProps) {
  const config = faixaConfig[faixa]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold',
        config.bg,
        config.text,
        className
      )}
    >
      {faixa}
      {graus > 0 && (
        <span className="flex gap-0.5">
          {Array.from({ length: graus }).map((_, i) => (
            <span key={i} className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
          ))}
        </span>
      )}
    </span>
  )
}
