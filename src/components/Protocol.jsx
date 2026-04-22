import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScanLine, Network, Sparkles } from 'lucide-react'

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

      // Grid
      for (let i = 0; i < 300; i += 20) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, 150)
        ctx.strokeStyle = 'rgba(74, 222, 128, 0.05)'
        ctx.lineWidth = 1
        ctx.stroke()
      }
      for (let j = 0; j < 150; j += 20) {
        ctx.beginPath()
        ctx.moveTo(0, j)
        ctx.lineTo(300, j)
        ctx.strokeStyle = 'rgba(74, 222, 128, 0.05)'
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Scan line
      const gradient = ctx.createLinearGradient(0, y - 20, 0, y + 20)
      gradient.addColorStop(0, 'rgba(74, 222, 128, 0)')
      gradient.addColorStop(0.5, 'rgba(74, 222, 128, 0.5)')
      gradient.addColorStop(1, 'rgba(74, 222, 128, 0)')

      ctx.fillStyle = gradient
      ctx.fillRect(0, y - 20, 300, 40)

      y = (y + 0.8) % 150
      frame = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(frame)
  }, [])

  return <canvas ref={canvasRef} style={{ width: '100%', height: '150px' }} />
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

    const pts = Array.from({ length: 12 }, () => ({
      x: Math.random() * 280 + 10,
      y: Math.random() * 130 + 10,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
    }))

    let frame

    const draw = () => {
      ctx.clearRect(0, 0, 300, 150)

      // Move points
      pts.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 10 || p.x > 290) p.vx *= -1
        if (p.y < 10 || p.y > 140) p.vy *= -1
      })

      // Connections
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dist = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y)
          if (dist < 100) {
            ctx.beginPath()
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.strokeStyle = `rgba(74, 222, 128, ${(1 - dist / 100) * 0.3})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }

      // Nodes
      pts.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(74, 222, 128, 0.7)'
        ctx.fill()

        // Glow
        ctx.beginPath()
        ctx.arc(p.x, p.y, 10, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(74, 222, 128, 0.1)'
        ctx.fill()
      })

      frame = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(frame)
  }, [])

  return <canvas ref={canvasRef} style={{ width: '100%', height: '150px' }} />
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

    let frame
    let t = 0

    const draw = () => {
      ctx.clearRect(0, 0, 300, 150)
      t += 0.02

      const cx = 150
      const cy = 75

      // Rotating hexagon
      const sides = 6
      const radius = 30 + Math.sin(t) * 5

      for (let ring = 0; ring < 3; ring++) {
        const r = radius + ring * 15
        const alpha = (0.4 - ring * 0.12) * (Math.sin(t * 0.5) * 0.3 + 0.7)

        ctx.beginPath()
        for (let i = 0; i <= sides; i++) {
          const angle = (i / sides) * Math.PI * 2 + t * (0.3 + ring * 0.1)
          const px = cx + Math.cos(angle) * r
          const py = cy + Math.sin(angle) * r
          if (i === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }
        ctx.closePath()
        ctx.strokeStyle = `rgba(74, 222, 128, ${alpha})`
        ctx.lineWidth = 1.5
        ctx.stroke()
      }

      // Center glow
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 40)
      glow.addColorStop(0, `rgba(74, 222, 128, ${0.3 + Math.sin(t * 2) * 0.15})`)
      glow.addColorStop(1, 'rgba(74, 222, 128, 0)')
      ctx.fillStyle = glow
      ctx.fillRect(cx - 40, cy - 40, 80, 80)

      // Text
      ctx.fillStyle = `rgba(74, 222, 128, ${0.6 + Math.sin(t) * 0.2})`
      ctx.font = '10px "IBM Plex Mono"'
      ctx.textAlign = 'center'
      ctx.fillText('GOLDEN TICKET', cx, cy + 55)

      frame = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(frame)
  }, [])

  return <canvas ref={canvasRef} style={{ width: '100%', height: '150px' }} />
}

const visuals = { scanline: ScanLineVisual, network: NetworkVisual, glow: GoldenTicketVisual }

export default function Protocol() {
  const sectionRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        gsap.fromTo(card,
          { y: 100, opacity: 0, scale: 0.95 },
          {
            y: 0, opacity: 1, scale: 1,
            duration: 1, ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
            }
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="protocol" ref={sectionRef} className="section-padding">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-mono text-xs text-accent tracking-[0.3em] uppercase block mb-4">
            PROCESSO DE SELEÇÃO
          </span>
          <h2 className="font-heading font-extrabold text-3xl md:text-5xl text-white tracking-tight-custom">
            O Caminho da<br />
            <span className="text-accent text-glow">Seleção</span>
          </h2>
        </div>

        {/* Stacking Cards */}
        <div className="space-y-8">
          {steps.map((step, i) => {
            const Icon = step.icon
            const Visual = visuals[step.visual]

            return (
              <div
                key={i}
                ref={el => cardsRef.current[i] = el}
                className="card-surface p-8 md:p-12"
              >
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="font-mono text-4xl font-bold text-accent/20">{step.number}</span>
                      <div>
                        <span className="font-mono text-[10px] text-accent tracking-[0.2em] uppercase block">
                          {step.label}
                        </span>
                        <h3 className="font-heading font-bold text-2xl text-white tracking-tight-custom">
                          {step.title}
                        </h3>
                      </div>
                    </div>
                    <p className="font-body text-sm text-zinc-400 leading-relaxed">
                      {step.description}
                    </p>
                    <div className="mt-6 flex items-center gap-2">
                      <Icon className="w-5 h-5 text-accent/60" />
                      <div className="h-px flex-1 bg-gradient-to-r from-accent/20 to-transparent" />
                    </div>
                  </div>
                  <div className="bg-deep-slate rounded-2xl border border-accent/5 overflow-hidden">
                    <Visual />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
