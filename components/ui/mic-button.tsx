'use client'

import { useState, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface SpeechRecognitionResult {
  readonly transcript: string
}
interface SpeechRecognitionResultList {
  readonly [index: number]: { readonly [index: number]: SpeechRecognitionResult }
}
interface SpeechRecognitionEvent { readonly results: SpeechRecognitionResultList }
interface SpeechRecognitionInstance {
  lang: string
  continuous: boolean
  interimResults: boolean
  onresult: (e: SpeechRecognitionEvent) => void
  onend: () => void
  onerror: () => void
  start: () => void
  stop: () => void
}
interface WindowWithSpeech extends Window {
  SpeechRecognition?: new () => SpeechRecognitionInstance
  webkitSpeechRecognition?: new () => SpeechRecognitionInstance
}

interface MicButtonProps {
  onTranscript: (text: string) => void
  className?: string
}

export function MicButton({ onTranscript, className }: MicButtonProps) {
  const [status, setStatus] = useState<'idle' | 'listening' | 'unsupported'>('idle')
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)

  const start = useCallback(() => {
    const w = window as WindowWithSpeech
    const SpeechRecognition = w.SpeechRecognition ?? w.webkitSpeechRecognition

    if (!SpeechRecognition) {
      setStatus('unsupported')
      return
    }

    const rec = new SpeechRecognition()
    rec.lang = 'pt-BR'
    rec.continuous = false
    rec.interimResults = false

    rec.onresult = (e: SpeechRecognitionEvent) => {
      const text: string = e.results[0][0].transcript
      onTranscript(text)
    }

    rec.onend = () => setStatus('idle')
    rec.onerror = () => setStatus('idle')

    recognitionRef.current = rec
    rec.start()
    setStatus('listening')
  }, [onTranscript])

  const stop = useCallback(() => {
    recognitionRef.current?.stop()
    setStatus('idle')
  }, [])

  if (status === 'unsupported') {
    return (
      <div className="w-full h-13 rounded-2xl border-2 border-dashed border-border flex items-center justify-center text-sm text-muted-foreground gap-2">
        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={2}>
          <line x1="2" y1="2" x2="22" y2="22" />
          <path strokeLinecap="round" d="M9 9v3a3 3 0 005.12 2.12M15 9.34V5a3 3 0 00-5.94-.6" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23M12 19v3M8 22h8" />
        </svg>
        Ditado não disponível neste navegador
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={status === 'listening' ? stop : start}
      className={cn(
        'relative w-full h-13 rounded-2xl flex items-center justify-center gap-3 font-semibold text-base transition-all active:scale-[0.98]',
        status === 'listening'
          ? 'bg-red-500 text-white shadow-lg shadow-red-500/40'
          : 'border-2 border-dashed border-primary/50 text-primary bg-primary/5 hover:bg-primary/10',
        className
      )}
    >
      {status === 'listening' && (
        <span className="absolute inset-0 rounded-2xl bg-red-500 animate-ping opacity-30 pointer-events-none" />
      )}

      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 relative shrink-0" stroke="currentColor" strokeWidth={2}>
        <rect x="9" y="2" width="6" height="11" rx="3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10a7 7 0 0014 0M12 19v3M8 22h8" />
      </svg>

      <span className="relative">
        {status === 'listening' ? 'Toque para parar...' : '🎤 Falar conteúdo'}
      </span>
    </button>
  )
}
