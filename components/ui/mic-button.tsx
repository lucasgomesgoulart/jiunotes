'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { cn } from '@/lib/utils'

/**
 * MicButton — ditado por voz (Web Speech API).
 *
 * Robustez mobile (especialmente iOS):
 * - `continuous` + `interimResults` com auto-reinício: o iOS encerra a sessão
 *   após pausas; enquanto o usuário não tocar em "parar", reiniciamos sozinhos.
 * - Cada trecho FINAL é enviado uma única vez via onTranscript (o pai concatena).
 * - Trata permissão negada e navegadores sem suporte (ex.: Brave no iPhone) com
 *   mensagem clara orientando a usar o microfone do teclado do iPhone.
 */

interface SpeechAlternative { readonly transcript: string }
interface SpeechResult { readonly isFinal: boolean; readonly length: number; readonly [i: number]: SpeechAlternative }
interface SpeechResultList { readonly length: number; readonly [i: number]: SpeechResult }
interface SpeechEvent { readonly resultIndex: number; readonly results: SpeechResultList }
interface SpeechErrorEvent { readonly error: string }
interface SpeechRecognitionInstance {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  onresult: (e: SpeechEvent) => void
  onend: () => void
  onerror: (e: SpeechErrorEvent) => void
  onstart: () => void
  start: () => void
  stop: () => void
  abort: () => void
}
interface WindowWithSpeech extends Window {
  SpeechRecognition?: new () => SpeechRecognitionInstance
  webkitSpeechRecognition?: new () => SpeechRecognitionInstance
}

type Status = 'idle' | 'listening' | 'unsupported' | 'denied'

interface MicButtonProps {
  onTranscript: (text: string) => void
  className?: string
}

export function MicButton({ onTranscript, className }: MicButtonProps) {
  const [status, setStatus] = useState<Status>('idle')
  const [interim, setInterim] = useState('')
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)
  const activeRef = useRef(false) // o usuário quer continuar ouvindo?

  const stop = useCallback(() => {
    activeRef.current = false
    setInterim('')
    try { recognitionRef.current?.stop() } catch { /* ignore */ }
    setStatus('idle')
  }, [])

  const start = useCallback(() => {
    const w = window as WindowWithSpeech
    const SR = w.SpeechRecognition ?? w.webkitSpeechRecognition
    if (!SR) { setStatus('unsupported'); return }

    activeRef.current = true

    const begin = () => {
      const rec = new SR()
      rec.lang = 'pt-BR'
      rec.continuous = true
      rec.interimResults = true
      rec.maxAlternatives = 1

      rec.onstart = () => setStatus('listening')

      rec.onresult = (e: SpeechEvent) => {
        let parcial = ''
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const r = e.results[i]
          const texto = r[0]?.transcript ?? ''
          if (r.isFinal) {
            const limpo = texto.trim()
            if (limpo) onTranscript(limpo)
          } else {
            parcial += texto
          }
        }
        setInterim(parcial)
      }

      rec.onerror = (e: SpeechErrorEvent) => {
        if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
          activeRef.current = false
          setStatus('denied')
        }
        // 'no-speech' / 'aborted' / 'network': deixamos o onend decidir o reinício
      }

      rec.onend = () => {
        setInterim('')
        // iOS encerra após silêncio — reinicia enquanto o usuário não parou
        if (activeRef.current) {
          try { begin() } catch { setStatus('idle') }
        } else {
          setStatus('idle')
        }
      }

      recognitionRef.current = rec
      try {
        rec.start()
      } catch {
        // start() pode lançar se já estiver rodando; ignora
      }
    }

    begin()
  }, [onTranscript])

  // Limpa ao desmontar
  useEffect(() => () => { activeRef.current = false; try { recognitionRef.current?.abort() } catch { /* */ } }, [])

  if (status === 'unsupported' || status === 'denied') {
    return (
      <div className="flex min-h-13 w-full items-center gap-2.5 rounded-2xl border-2 border-dashed border-border px-4 py-3 text-[13px] leading-snug text-muted-foreground">
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0" stroke="currentColor" strokeWidth={2}>
          <line x1="2" y1="2" x2="22" y2="22" strokeLinecap="round" />
          <path strokeLinecap="round" d="M9 9v3a3 3 0 005.12 2.12M15 9.34V5a3 3 0 00-5.94-.6" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16.95A7 7 0 015 12v-2m14 0v2M12 19v3M8 22h8" />
        </svg>
        <span>
          {status === 'denied'
            ? 'Permissão do microfone negada. Libere o microfone para o site nas configurações do navegador.'
            : 'Ditado por voz indisponível neste navegador. Toque no campo de texto e use o 🎤 do teclado do iPhone.'}
        </span>
      </div>
    )
  }

  return (
    <div className={cn('w-full', className)}>
      <button
        type="button"
        onClick={status === 'listening' ? stop : start}
        className={cn(
          'relative flex h-13 w-full items-center justify-center gap-3 rounded-2xl text-base font-semibold transition-all active:scale-[0.98]',
          status === 'listening'
            ? 'bg-red-500 text-white shadow-lg shadow-red-500/40'
            : 'border-2 border-dashed border-primary/50 bg-primary/5 text-primary hover:bg-primary/10'
        )}
      >
        {status === 'listening' && (
          <span className="pointer-events-none absolute inset-0 animate-ping rounded-2xl bg-red-500 opacity-30" />
        )}
        <svg viewBox="0 0 24 24" fill="none" className="relative h-5 w-5 shrink-0" stroke="currentColor" strokeWidth={2}>
          <rect x="9" y="2" width="6" height="11" rx="3" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 10a7 7 0 0014 0M12 19v3M8 22h8" />
        </svg>
        <span className="relative">
          {status === 'listening' ? 'Ouvindo… toque para parar' : '🎤 Falar conteúdo'}
        </span>
      </button>
      {status === 'listening' && interim && (
        <p className="mt-1.5 px-1 text-[13px] italic text-muted-foreground">{interim}</p>
      )}
    </div>
  )
}
