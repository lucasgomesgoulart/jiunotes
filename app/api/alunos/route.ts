import { NextRequest, NextResponse } from 'next/server'
import { getAlunos, createAluno } from '@/lib/db'
import { getSession } from '@/lib/session'

export async function GET() {
  try {
    const alunos = await getAlunos()
    return NextResponse.json(alunos)
  } catch (err) {
    console.error('[GET /api/alunos]', err)
    return NextResponse.json({ error: 'Erro ao buscar alunos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    const professorId = session.professorName || 'jiu123'
    const body = await request.json()
    const aluno = await createAluno({ ...body, professorId })
    return NextResponse.json(aluno, { status: 201 })
  } catch (err) {
    console.error('[POST /api/alunos]', err)
    return NextResponse.json({ error: 'Erro ao criar aluno' }, { status: 500 })
  }
}
