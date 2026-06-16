import { NextResponse } from 'next/server'
import { getAlunos, getUltimasAulas, getIAUsosHoje, incrementIAUsos } from '@/lib/db'
import { gerarSugestaoTreino } from '@/lib/ai'

const LIMITE_IA = 3

export async function GET() {
  const usos = await getIAUsosHoje()
  if (usos >= LIMITE_IA) {
    return NextResponse.json({ error: 'limite_atingido', usos }, { status: 429 })
  }

  const [ultimasAulas, alunos] = await Promise.all([getUltimasAulas(10), getAlunos()])
  const sugestao = await gerarSugestaoTreino(ultimasAulas, alunos)
  await incrementIAUsos()
  return NextResponse.json(sugestao)
}
