import { NextResponse } from 'next/server'
import { deleteAula, getAulaComPresencas, updateAula, setPresencas } from '@/lib/db'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const aula = await getAulaComPresencas(id)
    if (!aula) return NextResponse.json({ error: 'Aula não encontrada' }, { status: 404 })
    return NextResponse.json(aula)
  } catch (err) {
    console.error('[GET /api/aulas/[id]]', err)
    return NextResponse.json({ error: 'Erro ao buscar aula' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const { presencas, ...aulaData } = await req.json()
    await updateAula(id, aulaData)
    if (Array.isArray(presencas)) {
      await setPresencas(id, presencas)
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[PUT /api/aulas/[id]]', err)
    return NextResponse.json({ error: 'Erro ao atualizar aula' }, { status: 500 })
  }
}

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
