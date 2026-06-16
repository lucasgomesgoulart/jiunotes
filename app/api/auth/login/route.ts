import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'

// Lista de professores com suas credenciais
const PROFESSORS = [
  { username: 'jiu123', password: '123jiu', name: 'jiu123' },
  { username: 'suzuki', password: '123suzuki', name: 'suzuki' },
]

export async function POST(request: NextRequest) {
  const { usuario, senha } = await request.json()

  // Validar contra a lista de professores
  const professor = PROFESSORS.find((p) => p.username === usuario && p.password === senha)

  if (!professor) {
    return NextResponse.json({ error: 'Credenciais incorretas' }, { status: 401 })
  }

  const session = await getSession()
  session.isLoggedIn = true
  session.professorName = professor.name
  await session.save()

  return NextResponse.json({ ok: true })
}
