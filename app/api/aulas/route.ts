import { NextRequest, NextResponse } from 'next/server'
import { getAulas, createAula, createPresencas, getPresencasByAula } from '@/lib/db'
import { getSession } from '@/lib/session'
import { AulaComPresencas } from '@/types'

export async function GET() {
  try {
    const session = await getSession()
    const professorId = session.professorName || 'jiu123'
    const aulas = await getAulas(professorId)
    const aulasComPresencas: AulaComPresencas[] = await Promise.all(
      aulas.map(async (aula) => {
        const presencas = await getPresencasByAula(aula.id)
        return { ...aula, presencas: presencas.map((p) => p.idAluno) }
      })
    )
    return NextResponse.json(aulasComPresencas.sort((a, b) => b.data.localeCompare(a.data)))
  } catch (err) {
    console.error('[GET /api/aulas]', err)
    return NextResponse.json({ error: 'Erro ao buscar aulas' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    const professorId = session.professorName || 'jiu123'
    const { presencas, ...aulaData } = await request.json()
    const aula = await createAula({ ...aulaData, professorId })
    if (presencas?.length) {
      await createPresencas(aula.id, presencas)
    }
    return NextResponse.json({ ...aula, presencas: presencas ?? [] }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/aulas]', err)
    return NextResponse.json({ error: 'Erro ao criar aula' }, { status: 500 })
  }
}
