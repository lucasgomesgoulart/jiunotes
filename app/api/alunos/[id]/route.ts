import { NextRequest, NextResponse } from 'next/server'
import { updateAluno, deleteAluno, getAlunos, getAulas, getAllPresencas, getGraduacoes } from '@/lib/db'
import { AlunoPerfil, PresencaResumo } from '@/types'

// Calcula um rótulo de duração ("1a 3m") a partir de uma data ISO até hoje
function tempoLabel(fromISO: string): string {
  if (!fromISO) return '—'
  const from = new Date(fromISO + 'T00:00:00')
  if (isNaN(from.getTime())) return '—'
  const now = new Date()
  let meses = (now.getFullYear() - from.getFullYear()) * 12 + (now.getMonth() - from.getMonth())
  if (now.getDate() < from.getDate()) meses--
  if (meses < 0) meses = 0
  const anos = Math.floor(meses / 12)
  const m = meses % 12
  if (anos > 0 && m > 0) return `${anos}a ${m}m`
  if (anos > 0) return `${anos}a`
  return `${m}m`
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const [alunos, aulas, presencas, graduacoes] = await Promise.all([
      getAlunos(),
      getAulas(),
      getAllPresencas(),
      getGraduacoes(id),
    ])

    const aluno = alunos.find((a) => a.id === id)
    if (!aluno) return NextResponse.json({ error: 'Aluno não encontrado' }, { status: 404 })

    const aulasMap = new Map(aulas.map((a) => [a.id, a]))
    const presencasAluno = presencas.filter((p) => p.idAluno === id)

    const agora = new Date()
    const mesAtual = agora.getMonth()
    const anoAtual = agora.getFullYear()
    const aulasMes = aulas.filter((a) => {
      const d = new Date(a.data + 'T00:00:00')
      return d.getMonth() === mesAtual && d.getFullYear() === anoAtual
    })
    const aulasMesIds = new Set(aulasMes.map((a) => a.id))
    const presencasMes = presencasAluno.filter((p) => aulasMesIds.has(p.idAula)).length

    const ultimasPresencas: PresencaResumo[] = presencasAluno
      .map((p) => aulasMap.get(p.idAula))
      .filter((a): a is NonNullable<typeof a> => !!a)
      .sort((a, b) => b.data.localeCompare(a.data))
      .slice(0, 8)
      .map((a) => ({ idAula: a.id, data: a.data, categoria: a.categoria, conteudo: a.conteudoPrincipal }))

    const historicoGraduacoes = [...graduacoes].sort((a, b) => b.data.localeCompare(a.data))

    // Tempo na faixa: data da graduação que levou à faixa atual; senão, graduação mais recente
    const graduacaoFaixaAtual = historicoGraduacoes.find((g) => g.faixa === aluno.faixa)
    const baseData = graduacaoFaixaAtual?.data ?? historicoGraduacoes[0]?.data ?? ''

    const perfil: AlunoPerfil = {
      ...aluno,
      totalPresencas: presencasAluno.length,
      presencasMes,
      totalAulasMes: aulasMes.length,
      tempoNaFaixaLabel: tempoLabel(baseData),
      historicoGraduacoes,
      ultimasPresencas,
    }
    return NextResponse.json(perfil)
  } catch (err) {
    console.error('[GET /api/alunos/:id]', err)
    return NextResponse.json({ error: 'Erro ao carregar perfil' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    await updateAluno(id, body)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[PUT /api/alunos/:id]', err)
    return NextResponse.json({ error: 'Erro ao atualizar aluno' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await deleteAluno(id)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[DELETE /api/alunos/:id]', err)
    return NextResponse.json({ error: 'Erro ao deletar aluno' }, { status: 500 })
  }
}
