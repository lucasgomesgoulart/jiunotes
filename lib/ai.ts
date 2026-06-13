import Anthropic from '@anthropic-ai/sdk'
import { Aluno, Aula, SugestaoIA } from '@/types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function gerarSugestaoTreino(
  ultimasAulas: Aula[],
  alunos: Aluno[]
): Promise<SugestaoIA> {
  const alunosAtivos = alunos.filter((a) => a.status === 'Ativo')

  const contagem: Record<string, number> = {}
  for (const a of alunosAtivos) {
    contagem[a.faixa] = (contagem[a.faixa] ?? 0) + 1
  }
  const perfilTurma = Object.entries(contagem)
    .map(([faixa, n]) => `${n} ${faixa}${n > 1 ? 's' : ''}`)
    .join(', ')

  const historicoAulas = ultimasAulas
    .map((a, i) => `${i + 1}. [${a.data}] ${a.tipo} — ${a.categoria}: ${a.conteudoPrincipal}`)
    .join('\n')

  const prompt = `Você é um professor de Jiu-Jitsu experiente. Com base no histórico abaixo, sugira o próximo treino.

PERFIL DA TURMA: ${perfilTurma || 'Turma mista'}

ÚLTIMAS ${ultimasAulas.length} AULAS:
${historicoAulas || 'Nenhuma aula registrada ainda'}

Responda APENAS com JSON neste formato exato:
{
  "tema": "título curto do tema técnico",
  "justificativa": "motivo pedagógico da escolha (1-2 frases)",
  "estrutura": {
    "aquecimento": "sugestão de aquecimento específico",
    "tecnicaDoDia": "descrição da técnica principal",
    "dinamismoRolas": "dinâmica sugerida para o treino livre"
  }
}`

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    messages: [{ role: 'user', content: prompt }],
  })

  const content = message.content[0]
  if (content.type !== 'text') throw new Error('Resposta inválida da IA')

  const jsonMatch = content.text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('JSON não encontrado na resposta')

  return JSON.parse(jsonMatch[0]) as SugestaoIA
}
