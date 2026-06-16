import { NextResponse } from 'next/server'
import { getAlunos, getAulas, getAllPresencas } from '@/lib/db'

export async function GET() {
  try {
  const [alunos, aulas, todasPresencas] = await Promise.all([getAlunos(), getAulas(), getAllPresencas()])

  const agora = new Date()
  const mesAtual = agora.getMonth()
  const anoAtual = agora.getFullYear()

  const aulasMes = aulas.filter((a) => {
    const d = new Date(a.data + 'T00:00:00')
    return d.getMonth() === mesAtual && d.getFullYear() === anoAtual
  })

  const aulasMesIds = new Set(aulasMes.map((a) => a.id))

  // Contagem de presenças por aluno no mês — sem nenhuma chamada extra
  const presencasPorAluno: Record<string, number> = {}
  for (const p of todasPresencas) {
    if (aulasMesIds.has(p.idAula)) {
      presencasPorAluno[p.idAluno] = (presencasPorAluno[p.idAluno] ?? 0) + 1
    }
  }

  const ativos = alunos.filter((a) => a.status === 'Ativo')

  const topAlunos = ativos
    .map((a) => ({ ...a, presencas: presencasPorAluno[a.id] ?? 0 }))
    .sort((a, b) => b.presencas - a.presencas)
    .slice(0, 5)

  const totalPresencasMes = Object.values(presencasPorAluno).reduce((s, n) => s + n, 0)

  return NextResponse.json({
    totalAtivos: ativos.length,
    totalAulasMes: aulasMes.length,
    totalPresencasMes,
    mesNome: agora.toLocaleDateString('pt-BR', { month: 'long' }),
    topAlunos,
    ultimasAulas: aulas
      .sort((a, b) => b.data.localeCompare(a.data))
      .slice(0, 3),
  })
  } catch (err) {
    console.error('[GET /api/dashboard]', err)
    return NextResponse.json({ error: 'Erro ao carregar dashboard' }, { status: 500 })
  }
}
