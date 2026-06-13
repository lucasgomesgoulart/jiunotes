import { NextRequest, NextResponse } from 'next/server'
import { updateAluno, deleteAluno } from '@/lib/sheets'

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
