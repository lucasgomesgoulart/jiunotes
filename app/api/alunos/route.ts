import { NextRequest, NextResponse } from 'next/server'
import { getAlunos, createAluno } from '@/lib/sheets'

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
    const body = await request.json()
    const aluno = await createAluno(body)
    return NextResponse.json(aluno, { status: 201 })
  } catch (err) {
    console.error('[POST /api/alunos]', err)
    return NextResponse.json({ error: 'Erro ao criar aluno' }, { status: 500 })
  }
}
