import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'

export async function POST(request: NextRequest) {
  const { usuario, senha } = await request.json()

  const senhaValida = senha === process.env.PROFESSOR_PASSWORD
  // Se PROFESSOR_USERNAME não estiver definido, qualquer usuário passa
  const usuarioValido = !process.env.PROFESSOR_USERNAME || usuario === process.env.PROFESSOR_USERNAME

  if (!senhaValida || !usuarioValido) {
    return NextResponse.json({ error: 'Credenciais incorretas' }, { status: 401 })
  }

  const session = await getSession()
  session.isLoggedIn = true
  await session.save()

  return NextResponse.json({ ok: true })
}
