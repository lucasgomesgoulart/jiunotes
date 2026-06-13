import { NextResponse } from 'next/server'
import { deleteAula } from '@/lib/sheets'

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    await deleteAula(id)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[DELETE /api/aulas/[id]]', err)
    return NextResponse.json({ error: 'Erro ao apagar aula' }, { status: 500 })
  }
}
