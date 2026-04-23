import { useEffect, useRef } from 'react'
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

// Visual components remain the same but optimized for mobile
function ScanLineVisual() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    canvas.width = 300 * dpr
    canvas.height = 150 * dpr
    ctx.scale(dpr, dpr)
    let y = 0
    let frame
    const draw = () => {
      ctx.clearRect(0, 0, 300, 150)
      for (let i = 0; i < 300; i += 30) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 150);
        ctx.strokeStyle = 'rgba(74, 222, 128, 0.05)'; ctx.stroke();
      }
      for (let j = 0; j < 150; j += 30) {
        ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(300, j);
        ctx.strokeStyle = 'rgba(74, 222, 128, 0.05)'; ctx.stroke();
      }
      const gradient = ctx.createLinearGradient(0, y - 20, 0, y + 20)
      gradient.addColorStop(0, 'rgba(74, 222, 128, 0)')
      gradient.addColorStop(0.5, 'rgba(74, 222, 128, 0.4)')
      gradient.addColorStop(1, 'rgba(74, 222, 128, 0)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, y - 20, 300, 40)
      y = (y + 1) % 150
      frame = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(frame)
  }, [])
  return <canvas ref={canvasRef} className="w-full h-full opacity-60" />
}

function NetworkVisual() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    canvas.width = 300 * dpr
    canvas.height = 150 * dpr
    ctx.scale(dpr, dpr)
    const pts = Array.from({ length: 8 }, () => ({
      x: Math.random() * 280 + 10,
      y: Math.random() * 130 + 10,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
    }))
    let frame
    const draw = () => {
      ctx.clearRect(0, 0, 300, 150)
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 10 || p.x > 290) p.vx *= -1
        if (p.y < 10 || p.y > 140) p.vy *= -1
      })
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dist = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y)
          if (dist < 100) {
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y)
            ctx.strokeStyle = `rgba(74, 222, 128, ${(1 - dist / 100) * 0.2})`; ctx.stroke()
          }
        }
      }
      pts.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fillStyle = '#4ADE80'; ctx.fill()
      })
      frame = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(frame)
  }, [])
  return <canvas ref={canvasRef} className="w-full h-full opacity-60" />
}

function GoldenTicketVisual() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    canvas.width = 300 * dpr
    canvas.height = 150 * dpr
    ctx.scale(dpr, dpr)
    let frame; let t = 0
    const draw = () => {
      ctx.clearRect(0, 0, 300, 150); t += 0.03
      const cx = 150; const cy = 75
      const radius = 35 + Math.sin(t) * 5
      for (let ring = 0; ring < 2; ring++) {
        const r = radius + ring * 20
        ctx.beginPath()
        for (let i = 0; i <= 6; i++) {
          const angle = (i / 6) * Math.PI * 2 + t * (0.4 + ring * 0.2)
          const px = cx + Math.cos(angle) * r; const py = cy + Math.sin(angle) * r
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py)
        }
        ctx.strokeStyle = `rgba(74, 222, 128, ${0.4 - ring * 0.2})`; ctx.stroke()
      }
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 50)
      glow.addColorStop(0, `rgba(74, 222, 128, ${0.2 + Math.sin(t * 2) * 0.1})`); glow.addColorStop(1, 'rgba(74, 222, 128, 0)')
      ctx.fillStyle = glow; ctx.fillRect(cx - 50, cy - 50, 100, 100)
      frame = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(frame)
  }, [])
  return <canvas ref={canvasRef} className="w-full h-full opacity-70" />
}

const visuals = { scanline: ScanLineVisual, network: NetworkVisual, glow: GoldenTicketVisual }

export default function Protocol() {
  const containerRef = useRef(null)
  const stackRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current
      
      // Mobile & Desktop Stacking Logic
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return // Last card doesn't need to scale down for a next one

        ScrollTrigger.create({
          trigger: card,
          start: 'top 10%',
          endTrigger: containerRef.current,
          end: 'bottom bottom',
          pin: true,
          pinSpacing: false,
          scrub: true,
          onUpdate: (self) => {
            // As we scroll past, scale down and blur the previous card
            const progress = self.progress
            gsap.to(card, {
              scale: 1 - (progress * 0.1),
              filter: `blur(${progress * 10}px)`,
              opacity: 1 - (progress * 0.4),
              overwrite: 'auto'
            })
          }
        })
      })

      // Intro animations for the header
      gsap.from('.protocol-header > *', {
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: '.protocol-header',
          start: 'top 80%'
        }
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="protocol" ref={containerRef} className="py-24 md:py-32 bg-deep-slate relative overflow-hidden">
      <div className="container-elite">
        {/* Header */}
        <div className="protocol-header text-center mb-20 md:mb-32">
          <span className="font-mono text-xs text-accent tracking-[0.4em] uppercase block mb-6">
            PROTOCOLO DE SELEÇÃO
          </span>
          <h2 className="font-heading font-extrabold text-4xl md:text-7xl text-white tracking-tight-custom leading-none">
            A JORNADA DO<br />
            <span className="text-accent text-glow italic font-mono uppercase text-3xl md:text-6xl">Liderança</span>
          </h2>
        </div>

        {/* Stacking Container */}
        <div ref={stackRef} className="relative flex flex-col gap-24 md:gap-32">
          {steps.map((step, i) => {
            const Icon = step.icon
            const Visual = visuals[step.visual]

            return (
              <div
                key={i}
                ref={el => cardsRef.current[i] = el}
                className="w-full min-h-[60vh] md:min-h-[70vh] flex items-center justify-center sticky top-24 md:top-32"
              >
                <div className="card-surface p-8 md:p-16 w-full max-w-5xl shadow-2xl shadow-black/60 relative overflow-hidden group">
                  {/* Decorative background glow */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[100px] pointer-events-none group-hover:bg-accent/10 transition-colors duration-700" />
                  
                  <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
                    <div className="space-y-6">
                      <div className="flex items-center gap-6">
                        <span className="font-mono text-5xl md:text-7xl font-bold text-accent/10 leading-none">
                          {step.number}
                        </span>
                        <div className="h-px flex-1 bg-gradient-to-r from-accent/20 to-transparent" />
                      </div>
                      
                      <div>
                        <span className="font-mono text-[10px] md:text-xs text-accent tracking-[0.3em] uppercase block mb-2 opacity-60">
                          {step.label}
                        </span>
                        <h3 className="font-heading font-bold text-3xl md:text-5xl text-white tracking-tight-custom">
                          {step.title}
                        </h3>
                      </div>
                      
                      <p className="font-body text-zinc-400 text-base md:text-lg leading-relaxed max-w-md">
                        {step.description}
                      </p>
                      
                      <div className="pt-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-accent/5 border border-accent/10">
                          <Icon className="w-6 h-6 text-accent" />
                        </div>
                        <span className="font-mono text-[10px] text-accent/40 uppercase tracking-widest">
                          Protocolo Ativo
                        </span>
                      </div>
                    </div>

                    <div className="relative aspect-[4/3] lg:aspect-square bg-[#0D0D12] rounded-3xl border border-accent/10 overflow-hidden group/visual">
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center p-8">
                        <Visual />
                      </div>
                      
                      {/* Technical UI elements */}
                      <div className="absolute top-4 left-4 font-mono text-[8px] text-accent/30 uppercase tracking-tighter">
                        Enrichment.Layer_v1.0
                      </div>
                      <div className="absolute bottom-4 right-4 font-mono text-[8px] text-accent/30 uppercase tracking-tighter">
                        Status: Processing...
                      </div>
                      <div className="absolute top-1/2 left-0 w-full h-px bg-accent/5" />
                      <div className="absolute left-1/2 top-0 h-full w-px bg-accent/5" />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Final CTA in Protocol */}
        <div className="mt-32 text-center">
          <p className="font-body text-zinc-500 mb-8 max-w-lg mx-auto italic">
            "O futuro não é algo que acontece conosco. É algo que nós criamos através de nossas escolhas e coragem."
          </p>
        </div>
      </div>
    </section>
  )
} </section>
  )
}
