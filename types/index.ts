export type Faixa =
  | 'Branca'
  | 'Cinza'
  | 'Amarela'
  | 'Laranja'
  | 'Verde'
  | 'Azul'
  | 'Roxa'
  | 'Marrom'
  | 'Preta'

export type TipoAula = 'Kimono' | 'NoGi'

export type CategoriaAula =
  | 'Passagem de Guarda'
  | 'Guarda'
  | 'Quedas'
  | 'Meia Guarda'
  | 'Costas'
  | 'Finalizações'
  | 'Defesa Pessoal'
  | 'Outro'

export interface Aluno {
  id: string
  nome: string
  faixa: Faixa
  graus: number
  dataNascimento: string
  status: 'Ativo' | 'Inativo'
}

export interface Aula {
  id: string
  data: string
  tipo: TipoAula
  conteudoPrincipal: string
  categoria: CategoriaAula
}

export interface Presenca {
  id: string
  idAula: string
  idAluno: string
}

export interface AulaComPresencas extends Aula {
  presencas: string[]
}

export interface Graduacao {
  idAluno: string
  faixa: Faixa
  graus: number
  data: string
  label: string
}

export interface PresencaResumo {
  idAula: string
  data: string
  categoria: CategoriaAula
  conteudo: string
}

export interface AlunoPerfil extends Aluno {
  totalPresencas: number
  presencasMes: number
  totalAulasMes: number
  tempoNaFaixaLabel: string
  historicoGraduacoes: Graduacao[]
  ultimasPresencas: PresencaResumo[]
}

export interface SugestaoIA {
  tema: string
  justificativa: string
  estrutura: {
    aquecimento: string
    tecnicaDoDia: string
    dinamismoRolas: string
  }
}
