import { NextResponse } from 'next/server'
import { getIAUsosHoje } from '@/lib/sheets'

const LIMITE_IA = 3

export async function GET() {
  const usos = await getIAUsosHoje()
  return NextResponse.json({ usos, limite: LIMITE_IA, restantes: Math.max(0, LIMITE_IA - usos) })
}
