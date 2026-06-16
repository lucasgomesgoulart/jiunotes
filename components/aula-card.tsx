'use client'

import { CategoriaAula, Faixa } from '@/types'
import { CAT_COLOR } from '@/lib/categorias'
import { Belt } from './belt'

/**
 * AulaCard — Direção D1 ("cartões grandes"), aprovada para a tela de Aulas.
 * Uma aula por bloco: barra de cor da categoria, data grande, presentes como
 * avatares (iniciais + anel na cor da faixa). A categoria pode ter várias tags
 * (string separada por ", ") — cada uma vira um chip colorido.
 *
 * A página resolve os IDs de presença (Aula.presencas: string[]) para
 * { nome, faixa } antes de passar para cá.
 */

const corDaCategoria = (cat: string): string => CAT_COLOR[cat as CategoriaAula] ?? '#A8A8B0'

const BELT_RING: Record<Faixa, string> = {
  Branca: '#E9E4D6', Cinza: '#8E959C', Amarela: '#F5C518', Laranja: '#F2700A',
  Verde: '#2FA84F', Azul: '#1A5FD0', Roxa: '#6A2DAE', Marrom: '#5C3A1E', Preta: '#17171A',
}

export interface Presente { nome: string; faixa: Faixa }

interface AulaCardProps {
  data: string            // ISO "2026-06-09"
  tipo: 'Kimono' | 'NoGi'
  categoria: string
  conteudo: string
  presentes: Presente[]
  onClick?: () => void
}

function Avatar({ nome, faixa, size = 36 }: { nome: string; faixa: Faixa; size?: number }) {
  const ini = nome.split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase()
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full bg-secondary font-extrabold text-foreground"
      style={{ width: size, height: size, fontSize: size * 0.36, boxShadow: `inset 0 0 0 2.5px ${BELT_RING[faixa]}` }}
    >
      {ini}
    </div>
  )
}

export function AulaCard({ data, tipo, categoria, conteudo, presentes, onClick }: AulaCardProps) {
  const cats = categoria.split(',').map((c) => c.trim()).filter(Boolean)
  const cor = corDaCategoria(cats[0] ?? '')
  const d = new Date(data + 'T00:00:00')
  const dia = String(d.getDate()).padStart(2, '0')
  const semana = d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')

  return (
    <button
      type="button"
      onClick={onClick}
      className="block w-full overflow-hidden rounded-3xl border border-border bg-card text-left shadow-[0_12px_28px_-16px_rgba(0,0,0,0.7)] transition-transform active:scale-[0.99]"
    >
      <div className="h-[7px]" style={{ background: cor }} />
      <div className="px-[18px] pb-[18px] pt-[17px]">
        <div className="flex items-center gap-3.5">
          <div className="min-w-[50px] shrink-0 text-center">
            <div className="font-display text-4xl leading-[0.85]">{dia}</div>
            <div className="mt-0.5 text-[11.5px] font-extrabold uppercase tracking-wide text-muted-foreground">{semana}</div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex flex-wrap gap-1.5">
              {cats.map((cat) => {
                const c = corDaCategoria(cat)
                return (
                  <span
                    key={cat}
                    className="inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-[5px] text-xs font-extrabold"
                    style={{ background: c + '26', color: c }}
                  >
                    {cat}
                  </span>
                )
              })}
            </div>
            <div className="text-xl font-extrabold tracking-tight">{conteudo}</div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3 border-t border-border pt-[15px]">
          <span className="text-[12.5px] font-extrabold text-[#6FA5FF]">{tipo}</span>
          <div className="ml-auto flex items-center">
            <div className="flex">
              {presentes.map((p, i) => (
                <div key={i} style={{ marginLeft: i === 0 ? 0 : -6 }}>
                  <Avatar nome={p.nome} faixa={p.faixa} />
                </div>
              ))}
            </div>
            <span className="ml-2.5 text-[13px] font-bold text-muted-foreground">
              {presentes.length} presente{presentes.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>
    </button>
  )
}

export { Belt }
