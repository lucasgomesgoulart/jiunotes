'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { AulaComPresencas } from '@/types'
import { AulaForm } from '@/components/aula-form'

export default function EditarAulaPage() {
  const { id } = useParams<{ id: string }>()
  const [aula, setAula] = useState<AulaComPresencas | null>(null)
  const [erro, setErro] = useState(false)

  useEffect(() => {
    fetch(`/api/aulas/${id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setAula)
      .catch(() => setErro(true))
  }, [id])

  if (erro) {
    return (
      <div className="flex h-[100dvh] items-center justify-center px-6 text-center text-sm text-muted-foreground">
        Aula não encontrada.
      </div>
    )
  }

  if (!aula) {
    return (
      <div className="flex h-[100dvh] items-center justify-center text-sm text-muted-foreground">
        Carregando…
      </div>
    )
  }

  return <AulaForm aula={aula} />
}
