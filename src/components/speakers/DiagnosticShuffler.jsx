import { useState, useEffect } from 'react'
import { Handshake, FileSignature, Crown, Instagram } from 'lucide-react'

const layers = [
  {
    icon: Handshake,
    title: 'Conexões que Transformam',
    text: 'Como transformar relacionamentos em contratos reais e oportunidades concretas.',
    accent: 'from-primary to-accent/30',
  },
  {
    icon: FileSignature,
    title: 'Da Conversa ao Contrato',
    text: 'O papel estratégico do jovem líder na construção de pontes comerciais na cidade.',
    accent: 'from-accent/30 to-primary',
  },
  {
    icon: Crown,
    title: 'Liderança Relacional',
    text: 'Networking não é trocar cartões. É construir uma rede de valor que multiplica resultados.',
    accent: 'from-primary/50 to-accent/20',
  },
]

export default function DiagnosticShuffler() {
  const [order, setOrder] = useState([0, 1, 2])

  useEffect(() => {
    const interval = setInterval(() => {
      setOrder(prev => {
        const arr = [...prev]
        arr.unshift(arr.pop())
        return arr
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="card-surface p-6 md:p-8 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
        <span className="font-mono text-[10px] text-accent/60 uppercase tracking-[0.2em]">
          Mentoria e Liderança
        </span>
      </div>
      
      <div className="mb-4 flex gap-4 items-start">
        <img src="/speakers/miriam.png" alt="Miriam Ferreira" className="w-16 h-16 rounded-full object-cover border-2 border-accent/20" />
        <div>
          <span className="font-mono text-xs text-zinc-500">01 — LIDERANÇA</span>
          <div className="flex items-center gap-2 mt-1">
            <h3 className="font-heading font-bold text-xl text-white tracking-tight-custom">
              Miriam Ferreira
            </h3>
            <a 
              href="https://www.instagram.com/miriam_ferreira/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-accent hover:scale-110 transition-transform duration-300"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>
          <p className="font-body text-[10px] leading-tight text-zinc-400 mt-2 max-w-[200px]">
            Empresária visionária e fundadora do Executive. Especialista em liderança com paixão por abrir portas para jovens talentos.
          </p>
        </div>
      </div>
      <div className="mb-4 flex justify-center">
        <img src="/logos/executive.png" alt="Executive Gastronomia" className="h-12 md:h-16 object-contain" />
      </div>

      {/* Shuffling Cards Stack */}
      <div className="relative flex-1 min-h-[220px]">
        {order.map((layerIdx, stackPos) => {
          const layer = layers[layerIdx]
          const Icon = layer.icon
          const zIndex = 3 - stackPos
          const translateY = stackPos * 12
          const scale = 1 - stackPos * 0.04
          const opacity = 1 - stackPos * 0.25

          return (
            <div
              key={layerIdx}
              className="absolute inset-0 rounded-2xl bg-deep-slate border border-accent/10 p-5 flex flex-col justify-between"
              style={{
                zIndex,
                transform: `translateY(${translateY}px) scale(${scale})`,
                opacity,
                transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              }}
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="w-5 h-5 text-accent" />
                  <span className="font-heading font-semibold text-sm text-white">{layer.title}</span>
                </div>
                <p className="font-body text-xs text-zinc-400 leading-relaxed">{layer.text}</p>
              </div>
              <div className={`h-1 rounded-full bg-gradient-to-r ${layer.accent} mt-4`} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
