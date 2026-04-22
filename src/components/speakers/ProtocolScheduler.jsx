import { useEffect, useRef } from 'react'

const nodes = [
  { x: 60, y: 40, label: 'Estratégia' },
  { x: 180, y: 30, label: 'Inovação' },
  { x: 300, y: 50, label: 'Escala' },
  { x: 120, y: 130, label: 'Mercado' },
  { x: 240, y: 120, label: 'Indústria' },
  { x: 60, y: 200, label: 'Produto' },
  { x: 180, y: 210, label: 'Resultado' },
  { x: 300, y: 190, label: 'Lucro' },
]

const connections = [
  [0, 1], [1, 2], [0, 3], [1, 4], [2, 4],
  [3, 4], [3, 5], [4, 7], [5, 6], [6, 7],
  [3, 6], [1, 3],
]

export default function ProtocolScheduler() {
  const canvasRef = useRef(null)
  const animRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    
    canvas.width = 360 * dpr
    canvas.height = 250 * dpr
    ctx.scale(dpr, dpr)

    let frame = 0

    const draw = () => {
      ctx.clearRect(0, 0, 360, 250)
      const time = frame * 0.02

      connections.forEach(([a, b]) => {
        const nodeA = nodes[a]
        const nodeB = nodes[b]
        const pulse = Math.sin(time + a * 0.5) * 0.3 + 0.5

        ctx.beginPath()
        ctx.moveTo(nodeA.x, nodeA.y)
        ctx.lineTo(nodeB.x, nodeB.y)
        ctx.strokeStyle = `rgba(74, 222, 128, ${pulse * 0.3})`
        ctx.lineWidth = 1
        ctx.stroke()

        const progress = (Math.sin(time * 0.8 + a + b) + 1) / 2
        const px = nodeA.x + (nodeB.x - nodeA.x) * progress
        const py = nodeA.y + (nodeB.y - nodeA.y) * progress

        ctx.beginPath()
        ctx.arc(px, py, 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(74, 222, 128, ${pulse * 0.8})`
        ctx.fill()
      })

      nodes.forEach((node, i) => {
        const pulse = Math.sin(time + i * 0.7) * 0.3 + 0.7
        ctx.beginPath()
        ctx.arc(node.x, node.y, 14, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(45, 90, 39, ${pulse * 0.3})`
        ctx.fill()

        ctx.beginPath()
        ctx.arc(node.x, node.y, 6, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(74, 222, 128, ${pulse})`
        ctx.fill()

        ctx.fillStyle = `rgba(228, 228, 231, ${pulse * 0.6})`
        ctx.font = '9px "IBM Plex Mono"'
        ctx.textAlign = 'center'
        ctx.fillText(node.label, node.x, node.y + 22)
      })

      frame++
      animRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  return (
    <div className="card-surface p-6 md:p-8 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse" />
        <span className="font-mono text-[10px] text-blue-400/80 uppercase tracking-[0.2em]">
          Experiência de Mercado
        </span>
      </div>

      <div className="mb-4 flex gap-4 items-start">
        <img src="/speakers/robson.jpg" alt="Robson Alves" className="w-16 h-16 rounded-full object-cover border-2 border-accent/20" />
        <div>
          <span className="font-mono text-xs text-zinc-500">03 — MERCADO</span>
          <h3 className="font-heading font-bold text-xl text-white tracking-tight-custom mt-1">
            Robson Alves
          </h3>
          <p className="font-body text-[10px] leading-tight text-zinc-400 mt-2 max-w-[200px]">
            Com quase 30 anos de experiência na Nutrimental, Robson traz a bagagem de quem sabe exatamente o que as grandes empresas esperam da nova geração.
          </p>
        </div>
      </div>
      <div className="mb-4 flex justify-center">
        <img src="/logos/nutrimental.png" alt="Nutrimental" className="h-12 md:h-16 object-contain" />
      </div>

      {/* Network Graph */}
      <div className="flex-1 min-h-[220px] bg-deep-slate rounded-xl border border-accent/5 flex items-center justify-center overflow-hidden p-4">
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '250px' }}
        />
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between">
        <span className="font-mono text-[9px] text-zinc-600">Bastidores do Sucesso</span>
        <span className="font-mono text-[9px] text-blue-400/40">market.active</span>
      </div>
    </div>
  )
}
