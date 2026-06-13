'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Auth1 } from '@/components/ui/auth-1'

export default function LoginPage() {
  const router = useRouter()
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(usuario: string, senha: string) {
    setErro('')
    setLoading(true)

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, senha }),
    })

    setLoading(false)

    if (res.ok) {
      router.push('/alunos')
    } else {
      setErro('Usuário ou senha incorretos.')
    }
  }

  return (
    <Auth1
      onSubmit={handleSubmit}
      errorMessage={erro}
      submitLabel={loading ? 'Entrando...' : 'Entrar'}
    />
  )
}
