import { useState, useEffect, useRef } from 'react'
import { Instagram } from 'lucide-react'

const prompts = [
  '> Analisando mercado regional...',
  '> prompt: "Crie uma estratégia de vendas para SJP"',
  '> Gerando 12 variantes de copy em 3s...',
  '> ROI projetado: +340% em 90 dias',
  '> prompt: "Otimize funil de conversão"',
  '> Redução de custo operacional: -67%',
  '> Escala atingida: 10x output/hora',
  '> prompt: "Automatize follow-up de leads"',
  '> Pipeline ativado. 847 leads processados.',
  '> Produtividade multiplicada. Custo: R$0.',
]

export default function TelemetryTypewriter() {
  const [lines, setLines] = useState([])
  const [currentLine, setCurrentLine] = useState(0)
  const [currentChar, setCurrentChar] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const feedRef = useRef(null)

  useEffect(() => {
    if (currentLine >= prompts.length) {
      setTimeout(() => {
        setLines([])
        setCurrentLine(0)
        setCurrentChar(0)
        setDisplayText('')
      }, 2000)
      return
    }

    const targetText = prompts[currentLine]

    if (currentChar < targetText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + targetText[currentChar])
        setCurrentChar(prev => prev + 1)
      }, 30 + Math.random() * 40)
      return () => clearTimeout(timeout)
    } else {
      const timeout = setTimeout(() => {
        setLines(prev => [...prev.slice(-5), displayText])
        setDisplayText('')
        setCurrentChar(0)
        setCurrentLine(prev => prev + 1)
      }, 800)
      return () => clearTimeout(timeout)
    }
  }, [currentLine, currentChar, displayText])

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight
    }
  }, [lines, displayText])

  return (
    <div className="card-surface p-6 md:p-8 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
        <span className="font-mono text-[10px] text-red-400/80 uppercase tracking-[0.2em]">
          IA e Produtividade
        </span>
      </div>

      <div className="mb-4 flex gap-4 items-start">
        <img src="/speakers/matheus.jpg" alt="Matheus Binotti" className="w-16 h-16 rounded-full object-cover border-2 border-accent/20" />
        <div>
          <span className="font-mono text-xs text-zinc-500">02 — TECNOLOGIA</span>
          <div className="flex items-center gap-2 mt-1">
            <h3 className="font-heading font-bold text-xl text-white tracking-tight-custom">
              Matheus Binotti
            </h3>
            <a 
              href="https://www.instagram.com/matheus_binotti/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-accent hover:scale-110 transition-transform duration-300"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>
          <p className="font-body text-[10px] leading-tight text-zinc-400 mt-2 max-w-[200px]">
            Especialista em IA na prática. Vai te mostrar como usar a tecnologia como sua principal aliada para se destacar e ganhar tempo.
          </p>
        </div>
      </div>
      <div className="mb-4 flex justify-center">
        <img src="/logos/eletron.png" alt="Eletron Digital" className="h-12 md:h-16 object-contain" />
      </div>

      {/* Terminal Feed */}
      <div
        ref={feedRef}
        className="flex-1 min-h-[220px] bg-deep-slate rounded-xl border border-accent/5 p-4 overflow-hidden font-mono text-xs"
      >
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-accent/10">
          <div className="w-2 h-2 rounded-full bg-accent/40" />
          <div className="w-2 h-2 rounded-full bg-accent/20" />
          <div className="w-2 h-2 rounded-full bg-accent/10" />
          <span className="text-[9px] text-zinc-600 ml-2">ai_engine — eletron.digital</span>
        </div>
        
        {lines.map((line, i) => (
          <div key={i} className="mb-1.5">
            <span className={`${line.startsWith('> prompt:') ? 'text-accent' : 'text-zinc-500'}`}>
              {line}
            </span>
          </div>
        ))}
        
        {displayText && (
          <div className="mb-1.5">
            <span className={`${displayText.startsWith('> prompt:') ? 'text-accent' : 'text-zinc-400'}`}>
              {displayText}
            </span>
            <span className="inline-block w-2 h-4 bg-accent ml-0.5 animate-blink" />
          </div>
        )}

        {!displayText && lines.length === 0 && (
          <div>
            <span className="text-zinc-600">{'>'} </span>
            <span className="inline-block w-2 h-4 bg-accent ml-0.5 animate-blink" />
          </div>
        )}
      </div>

      {/* Footer Label */}
      <div className="mt-3 flex items-center justify-between">
        <span className="font-mono text-[9px] text-zinc-600">O Estagiário Infinito</span>
        <span className="font-mono text-[9px] text-accent/40">ia.active</span>
      </div>
    </div>
  )
}
