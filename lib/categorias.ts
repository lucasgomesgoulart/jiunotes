import { CategoriaAula, TipoAula } from '@/types'

/**
 * Paleta "Dojo Escuro" — cores de categoria/tipo adaptadas ao fundo escuro.
 * Fonte única de verdade (espelha os tokens --cat-* em globals.css).
 * Use os helpers de estilo para chips/tags com fundo translúcido + texto na cor.
 */

export const CAT_COLOR: Record<CategoriaAula, string> = {
  'Passagem de Guarda': '#4D8DFF',
  'Guarda':             '#8C8CFF',
  'Quedas':             '#FF6B5E',
  'Meia Guarda':        '#B07BFF',
  'Costas':             '#4CC474',
  'Finalizações':       '#FF6B8E',
  'Defesa Pessoal':     '#FFB13D',
  'Outro':              '#A8A8B0',
}

/** Cor de acento por tipo de aula. */
export const TIPO_COLOR: Record<TipoAula, string> = {
  Kimono: '#4D8DFF',
  NoGi:   '#FF8A3D',
}

/** Estilo de chip/tag: fundo translúcido (15%) + texto na cor cheia. */
export function catChipStyle(cat: CategoriaAula): React.CSSProperties {
  const c = CAT_COLOR[cat] ?? CAT_COLOR['Outro']
  return { background: `${c}26`, color: c }
}

/** Estilo selecionado: fundo translúcido + borda + texto na cor (para filtros/tiles). */
export function catSelectedStyle(cat: CategoriaAula): React.CSSProperties {
  const c = CAT_COLOR[cat] ?? CAT_COLOR['Outro']
  return { background: `${c}26`, color: c, borderColor: c }
}

export function tipoChipStyle(tipo: TipoAula): React.CSSProperties {
  const c = TIPO_COLOR[tipo]
  return { background: `${c}26`, color: c }
}
