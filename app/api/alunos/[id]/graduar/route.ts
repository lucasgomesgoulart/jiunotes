import { NextRequest, NextResponse } from 'next/server'
import { updateAluno, createGraduacao } from '@/lib/db'
import { Faixa } from '@/types'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { faixa, graus, data, label } = (await request.json()) as {
      faixa: Faixa
      graus: number
      data: string
      label: string
    }

    // Atualiza a faixa/grau atuais do aluno
    await updateAluno(id, { faixa, graus })

    // Registra a graduação no histórico
    await createGraduacao({ idAluno: id, faixa, graus, data, label })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[POST /api/alunos/:id/graduar]', err)
    return NextResponse.json({ error: 'Erro ao graduar aluno' }, { status: 500 })
  }
}
