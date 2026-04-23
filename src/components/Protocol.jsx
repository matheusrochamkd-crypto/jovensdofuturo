import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScanLine, Network, Sparkles, ChevronRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    number: '01',
    label: 'Acesso Restrito',
    title: 'Candidatura',
    description: 'Seleção exclusiva com vagas limitadas para quem busca impacto real. Envie seu perfil e sua justificativa de impacto.',
    icon: ScanLine,
    visual: 'scanline',
  },
  {
    number: '02',
    label: 'O Encontro de Gerações',
    title: 'Curadoria de Perfis',
    description: 'Nossa equipe avalia cuidadosamente cada candidatura. Não buscamos o currículo mais perfeito, buscamos jovens com real vontade de aprender, crescer e fazer a diferença.',
    icon: Network,
    visual: 'network',
  },
  {
    number: '03',
    label: 'O Veredito',
    title: 'Golden Ticket',
    description: 'Estamos selecionando os perfis que vão liderar o futuro. O amanhã não é sorte, é visão.',
    icon: Sparkles,
    visual: 'glow',
  },
]

function CanvasContainer({ children, className }) {
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.05 }
    )
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className={className}>
      {isVisible && children}
    </div>
  )
}

function ScanLineVisual() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    const dpr = window.devicePixelRatio || 1
    canvas.width = 300 * dpr; canvas.height = 150 * dpr
    ctx.scale(dpr, dpr)
    let y = 0
    
    const draw = () => {
      ctx.fillStyle = '#0D0D12'; ctx.fillRect(0, 0, 300, 150)
      ctx.beginPath()
      for (let i = 0; i < 300; i += 50) { ctx.moveTo(i, 0); ctx.lineTo(i, 150) }
      for (let j = 0; j < 150; j += 50) { ctx.moveTo(0, j); ctx.lineTo(300, j) }
      ctx.strokeStyle = 'rgba(74, 222, 128, 0.02)'; ctx.stroke()
      
      const gradient = ctx.createLinearGradient(0, y - 10, 0, y + 10)
      gradient.addColorStop(0, 'transparent'); gradient.addColorStop(0.5, 'rgba(74, 222, 128, 0.2)'); gradient.addColorStop(1, 'transparent')
      ctx.fillStyle = gradient; ctx.fillRect(0, y - 10, 300, 20)
      y = (y + 1) % 150
    }
    
    gsap.ticker.add(draw)
    return () => gsap.ticker.remove(draw)
  }, [])
  return <canvas ref={canvasRef} className="w-full h-full" />
}

function NetworkVisual() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    const dpr = window.devicePixelRatio || 1
    canvas.width = 300 * dpr; canvas.height = 150 * dpr
    ctx.scale(dpr, dpr)
    const pts = Array.from({ length: 5 }, () => ({
      x: Math.random() * 280 + 10, y: Math.random() * 130 + 10,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
    }))
    
    const draw = () => {
      ctx.fillStyle = '#0D0D12'; ctx.fillRect(0, 0, 300, 150)
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 10 || p.x > 290) p.vx *= -1
        if (p.y < 10 || p.y > 140) p.vy *= -1
      })
      ctx.beginPath()
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y)
        }
      }
      ctx.strokeStyle = 'rgba(74, 222, 128, 0.1)'; ctx.stroke()
      pts.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2); ctx.fillStyle = '#4ADE80'; ctx.fill()
      })
    }
    
    gsap.ticker.add(draw)
    return () => gsap.ticker.remove(draw)
  }, [])
  return <canvas ref={canvasRef} className="w-full h-full" />
}

function GoldenTicketVisual() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    const dpr = window.devicePixelRatio || 1
    canvas.width = 300 * dpr; canvas.height = 150 * dpr
    ctx.scale(dpr, dpr)
    let t = 0
    
    const draw = () => {
      ctx.fillStyle = '#0D0D12'; ctx.fillRect(0, 0, 300, 150); t += 0.03
      const cx = 150; const cy = 75; const radius = 25 + Math.sin(t) * 3
      ctx.beginPath()
      for (let i = 0; i <= 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + t * 0.3
        const px = cx + Math.cos(angle) * radius; const py = cy + Math.sin(angle) * radius
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py)
      }
      ctx.strokeStyle = 'rgba(74, 222, 128, 0.3)'; ctx.stroke()
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 30)
      glow.addColorStop(0, `rgba(74, 222, 128, ${0.1 + Math.sin(t * 1.5) * 0.05})`); glow.addColorStop(1, 'transparent')
      ctx.fillStyle = glow; ctx.fillRect(cx - 30, cy - 30, 60, 60)
    }
    
    gsap.ticker.add(draw)
    return () => gsap.ticker.remove(draw)
  }, [])
  return <canvas ref={canvasRef} className="w-full h-full" />
}

const visuals = { scanline: ScanLineVisual, network: NetworkVisual, glow: GoldenTicketVisual }

export default function Protocol() {
  const containerRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (i === cardsRef.current.length - 1) return
        ScrollTrigger.create({
          trigger: card,
          start: 'top 12%',
          endTrigger: containerRef.current,
          end: 'bottom bottom',
          pin: true,
          pinSpacing: false,
          scrub: 0.4,
          onUpdate: (self) => {
            gsap.set(card, {
              scale: 1 - (self.progress * 0.04),
              opacity: 1 - (self.progress * 0.4),
              y: -self.progress * 15,
              force3D: true
            })
          }
        })
      })
      gsap.from('.protocol-header > *', {
        y: 20, opacity: 0, stagger: 0.1, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: '.protocol-header', start: 'top 90%' }
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="protocol" ref={containerRef} className="py-24 md:py-32 bg-deep-slate relative overflow-hidden">
      <div className="container-elite">
        <div className="protocol-header text-center mb-20 md:mb-32">
          <span className="font-mono text-xs text-accent tracking-[0.4em] uppercase block mb-6">
            PROTOCOLO DE SELEÇÃO
          </span>
          <h2 className="font-heading font-extrabold text-4xl md:text-7xl text-white tracking-tight-custom leading-none">
            A JORNADA DO<br />
            <span className="text-accent text-glow italic font-mono uppercase text-3xl md:text-6xl">Liderança</span>
          </h2>
        </div>

        <div className="relative flex flex-col gap-24 md:gap-32">
          {steps.map((step, i) => {
            const Icon = step.icon
            const Visual = visuals[step.visual]

            return (
              <div
                key={i}
                ref={el => cardsRef.current[i] = el}
                className="w-full min-h-[60vh] md:min-h-[70vh] flex items-center justify-center sticky top-24 md:top-32 will-change-transform"
              >
                <div className="card-surface p-8 md:p-16 w-full max-w-5xl shadow-2xl shadow-black/60 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[100px] pointer-events-none" />
                  
                  <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
                    <div className="space-y-6">
                      <div className="flex items-center gap-6">
                        <span className="font-mono text-5xl md:text-7xl font-bold text-accent/10 leading-none">{step.number}</span>
                        <div className="h-px flex-1 bg-gradient-to-r from-accent/20 to-transparent" />
                      </div>
                      <div>
                        <span className="font-mono text-[10px] md:text-xs text-accent tracking-[0.3em] uppercase block mb-2 opacity-60">{step.label}</span>
                        <h3 className="font-heading font-bold text-3xl md:text-5xl text-white tracking-tight-custom">{step.title}</h3>
                      </div>
                      <p className="font-body text-zinc-400 text-base md:text-lg leading-relaxed max-w-md">{step.description}</p>
                      <div className="pt-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-accent/5 border border-accent/10"><Icon className="w-6 h-6 text-accent" /></div>
                        <span className="font-mono text-[10px] text-accent/40 uppercase tracking-widest">Protocolo Ativo</span>
                      </div>
                    </div>

                    <CanvasContainer className="relative aspect-[4/3] lg:aspect-square bg-[#0D0D12] rounded-3xl border border-accent/10 overflow-hidden group/visual">
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center p-8"><Visual /></div>
                    </CanvasContainer>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
} </section>
  )
}
